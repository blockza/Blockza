import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import ImageType "../model/ImageType";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Float "mo:base/Float";
import Int16 "mo:base/Int16";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Order "mo:base/Order";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import EntryType "../model/EntryType";
import Prim "mo:prim";
import EntryStoreHelper "../helper/EntryStoreHelper";
import UserType "../model/UserType";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = Text;
  type Entry = EntryType.Entry;
  type UserId = EntryType.UserId;
  type InputEntry = EntryType.InputEntry;
  type EntryId = EntryType.EntryId;
  type EntryStatus = EntryType.EntryStatus;
  type ListEntryItem = EntryType.ListEntryItem;
  type Entries = [(Key, Entry)];
  type Permission = UserType.Permission;
  type User = UserType.User;
  type ActivityType = UserType.ActivityType;
  type AdminActivityType = UserType.AdminActivityType;
  type RewardConfig = { master : Nat; admin : Nat; platform : Nat };
  type LikeReward = Nat;
  //
  type SubAccount = UserType.SubAccount;
  type Icrc1Timestamp = UserType.Icrc1Timestamp;
  type Icrc1Tokens = UserType.Icrc1Tokens;
  type Icrc1BlockIndex = UserType.Icrc1BlockIndex;

  type Account = UserType.Account;
  type TransferFromArgs = UserType.TransferFromArgs;
  type TransferFromResult = UserType.TransferFromResult;

  type TransferFromError = UserType.TransferFromError;
  //
  type TransactionHistoryItem = {
    user : Principal;
    platform : Nat;
    admin : Nat;
    creation_time : Int;
  };
  type TransactionHistory = List.List<TransactionHistoryItem>;
  // WALLETS

  var MAX_TRANSACTIONS = 10;
  let MASTER_WALLET = UserType.MASTER_WALLET;
  let PLATFORM_WALLET = UserType.PLATFORM_WALLET;
  let ADMIN_WALLET = UserType.ADMIN_WALLET;

  // WALLETS
  stable var stable_entries : Entries = [];
  stable var stable_categories : [Text] = ["AI", "BlockChain", "Guide", "GameReview"];

  stable var reward_config : RewardConfig = {
    master = 80;
    admin = 10;
    platform = 10;
  };
  stable var like_reward : LikeReward = 1000;
  stable var transaction_history : TransactionHistory = List.nil();
  var entryStorage = Map.fromIter<Key, Entry>(stable_entries.vals(), 0, Text.equal, Text.hash);

  private var sectek = "#cosa@erwe0ss1s<e}s*dfCc<e>c!dwa)<vvde>";
  // var entryStorage = Map.HashMap<Key, Entry>(0, Text.equal, Text.hash);

  func sortByCategory(inputCategory : Text, entriesList : Map.HashMap<Key, ListEntryItem>, key : Text, lisEntryItem : ListEntryItem, entry : Entry) : Map.HashMap<Key, ListEntryItem> {
    if (inputCategory == "All") {
      entriesList.put(key, lisEntryItem);
    } else {
      let tempCategories = entry.category;
      for (category in tempCategories.vals()) {
        if (category == inputCategory) {
          entriesList.put(key, lisEntryItem);
        };
      };
    };
    return entriesList;
  };
  func shouldSendEntry(entry : Entry) : Bool {
    if (not entry.isDraft) {
      switch (entry.status) {
        case (#approved) {
          // sortedEntries.put(key, entry);
          return true;
        };
        case (_) {
          return false;
        };
      };
    } else {
      return false;
    };
  };
  func shouldSendListEntry(status : EntryStatus) : Bool {
    switch (status) {
      case (#approved) {
        return true;
      };
      case (_) {
        return false;
      };
    };

  };
  public shared ({ caller }) func insertEntry(entry : InputEntry, userCanisterId : Text, isDraftUpdate : Bool, draftId : Text, commentCanisterId : Text) : async Result.Result<(Text, EntryId), (Text)> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
    };
    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;
    let commentCanister = actor (commentCanisterId) : actor {
      addActivity : (user : Principal, target : Text, activityType : ActivityType) -> async Bool;
    };
    let LEDGER = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor {
      icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
    };

    if (isDraftUpdate) {
      let maybeOldEntry = entryStorage.get(draftId);
      switch (maybeOldEntry) {
        case (?oldEntry) {
          if (oldEntry.user != caller) {
            return #err("Error while saving draft");
          };
        };
        case (null) {
          return #err("Error while saving draft");
        };
      };
    };
    if (entry.isPromoted and entry.pressRelease) {
      return #err("Not Allowed");
    };
    if (entry.isPromoted) {
      if (List.size(transaction_history) >= MAX_TRANSACTIONS) {
        var totalPlatformFee = 0;
        var totalAdminFee = 0;
        func iterVals(item : TransactionHistoryItem) : Bool {
          totalPlatformFee := totalPlatformFee + item.platform;
          totalAdminFee := totalAdminFee + item.admin;
          return false;
        };
        let newHistory = List.filter<TransactionHistoryItem>(transaction_history, iterVals);
        transaction_history := List.nil();
        let platformRes = await LEDGER.icrc2_transfer_from({
          amount = totalPlatformFee;
          created_at_time = null;
          fee = null;
          from = {
            owner = Principal.fromText(MASTER_WALLET);
            subaccount = null;
          };
          memo = null;
          spender_subaccount = null;
          to = {
            owner = Principal.fromText(PLATFORM_WALLET);
            subaccount = null;
          };
        });
        let adminRes = await LEDGER.icrc2_transfer_from({
          amount = totalAdminFee;
          created_at_time = null;
          fee = null;
          from = {
            owner = Principal.fromText(MASTER_WALLET);
            subaccount = null;
          };
          memo = null;
          spender_subaccount = null;
          to = {
            owner = Principal.fromText(ADMIN_WALLET);
            subaccount = null;
          };
        });
      };

      let gasFee = (10000 * 2) / MAX_TRANSACTIONS;
      let rewardToGive = entry.promotionICP + gasFee;
      let response = await LEDGER.icrc2_transfer_from({
        amount = rewardToGive;
        created_at_time = null;
        fee = null;
        from = { owner = caller; subaccount = null };
        memo = null;
        spender_subaccount = null;
        to = { owner = Principal.fromText(MASTER_WALLET); subaccount = null };
      });
      let platformPercentage : Float = Float.fromInt(reward_config.platform) / 100;
      let adminPercentage : Float = Float.fromInt(reward_config.admin) / 100;
      let platformFee = (platformPercentage * Float.fromInt(entry.promotionICP));
      let adminFee = (adminPercentage * Float.fromInt(entry.promotionICP));
      Debug.print(debug_show (reward_config.platform, platformFee, platformPercentage, entry.promotionICP));
      var newTransaction : TransactionHistoryItem = {
        user = caller;
        platform = Int.abs(Float.toInt(platformFee));
        admin = Int.abs(Float.toInt(adminFee));
        creation_time = Time.now() / 1000000;
      };
      let new_transaction_history = List.push(newTransaction, transaction_history);
      transaction_history := new_transaction_history;

      switch (response) {
        case (#Ok(_)) {

        };
        case (#Err(_)) {
          Debug.print(debug_show (rewardToGive));
          Debug.print(debug_show (response));
          return #err("Error during transaction");
        };
      };
    };
    let entryId = EntryType.generateNewRemoteObjectId();
    let masterPercentage : Float = Float.fromInt(reward_config.master) / 100;
    let articlePool = (masterPercentage * Float.fromInt(entry.promotionICP));
    // let articlePool : Nat = Int.abs(Float.toInt(masterPercentage));

    entryStorage := EntryStoreHelper.addNewEntry(entryStorage, entry, entryId, caller, isDraftUpdate, draftId, Int.abs(Float.toInt(articlePool)), stable_categories);
    if (not entry.isDraft) {
      if (isDraftUpdate) {
        let activited = commentCanister.addActivity(caller, draftId, #create);
      } else {
        let activited = commentCanister.addActivity(caller, entryId, #create);

      };
    };
    if (isDraftUpdate) {
      return #ok("Published", draftId);
    } else {
      return #ok("Published", entryId);
    };
  };
  public query func getEntry(key : Key) : async ?Entry {
    entryStorage.get(key);
  };
  public query func getCategories() : async [Text] {
    return stable_categories;
  };
  public shared ({ caller }) func addCategory(categoryName : Text, userCanisterId : Text) : async [Text] {
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #manage_article);

    let newCategories = Array.append<Text>([categoryName], stable_categories);

    stable_categories := newCategories;
    // stable_categories := ["AI", "BlockChain", "Guide", "GameReview"];
    return newCategories;
  };
  public shared ({ caller }) func likeEntry(key : Key, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Text, Bool), (Text)> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      add_reward : (caller : Principal, like_reward : Nat) -> async Bool;
      check_user_exists : (caller : Principal) -> async Bool;

    };
    let commentCanister = actor (commentCanisterId) : actor {
      addActivity : (user : Principal, target : Text, activityType : ActivityType) -> async Bool;
    };

    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;

    let maybeEntry = entryStorage.get(key);
    switch (maybeEntry) {
      case (?isEntry) {
        var tempLikedUsers = isEntry.likedUsers;
        var isLiked = Array.find<Principal>(tempLikedUsers, func x = x == caller);
        var isPromoted = isEntry.isPromoted;
        var newPromoted = false;

        if (isPromoted) {
          switch (isLiked) {
            case (?liked) {
              return #err("Not Allowed");
            };
            case (null) {
              // let isTargetReached = isEntry.likes >= isEntry.promotionLikesTarget;
              // if (isTargetReached) {
              //   newPromoted := false;
              // } else {
              //   newPromoted := true;
              // };

              var newPromotionICP : Nat = isEntry.promotionICP;
              var shouldReward = false;
              if ((newPromotionICP - like_reward) : Int == 0) {
                newPromotionICP := newPromotionICP - like_reward;
                newPromoted := false;
                shouldReward := true;
              } else if ((newPromotionICP - like_reward) : Int <= 0) {
                shouldReward := false;
                newPromoted := false;
              } else {
                newPromotionICP := newPromotionICP - like_reward;
                newPromoted := true;
                shouldReward := true;
              };
              let newLikedUsers = Array.append(tempLikedUsers, [caller]);
              var isUserRewarded = true;
              if (shouldReward) {
                isUserRewarded := await userCanister.add_reward(caller, like_reward);
              };

              if (isUserRewarded) {

                var tempEntry = {
                  title = isEntry.title;
                  description = isEntry.description;
                  image = isEntry.image;
                  creation_time = isEntry.creation_time;
                  user = isEntry.user;
                  views = isEntry.views;
                  likes = isEntry.likes +1;
                  category = isEntry.category;
                  seoTitle = isEntry.seoTitle;
                  seoSlug = isEntry.seoSlug;
                  viewedUsers = isEntry.viewedUsers;
                  likedUsers = newLikedUsers;
                  seoDescription = isEntry.seoDescription;
                  seoExcerpt = isEntry.seoExcerpt;
                  subscription = isEntry.subscription;
                  isDraft = isEntry.isDraft;
                  isPromoted = newPromoted;
                  minters = isEntry.minters;
                  userName = isEntry.userName;
                  // promotionLikesTarget = isEntry.promotionLikesTarget;
                  promotionICP = newPromotionICP;
                  status = isEntry.status;
                  promotionHistory = isEntry.promotionHistory;
                  pressRelease = isEntry.pressRelease;
                };
                let newEntry = entryStorage.replace(key, tempEntry);
                let activited = commentCanister.addActivity(caller, key, #like);
                return #ok("Article Liked Successfully", true);

              } else {
                var tempEntry = {
                  title = isEntry.title;
                  description = isEntry.description;
                  image = isEntry.image;
                  creation_time = isEntry.creation_time;
                  user = isEntry.user;
                  views = isEntry.views;
                  likes = isEntry.likes +1;
                  category = isEntry.category;
                  seoTitle = isEntry.seoTitle;
                  seoSlug = isEntry.seoSlug;
                  viewedUsers = isEntry.viewedUsers;
                  likedUsers = newLikedUsers;
                  seoDescription = isEntry.seoDescription;
                  seoExcerpt = isEntry.seoExcerpt;
                  subscription = isEntry.subscription;
                  isDraft = isEntry.isDraft;
                  minters = isEntry.minters;
                  userName = isEntry.userName;
                  isPromoted = isEntry.isPromoted;
                  // promotionLikesTarget = isEntry.promotionLikesTarget;
                  promotionICP = isEntry.promotionICP;
                  status = isEntry.status;
                  promotionHistory = isEntry.promotionHistory;
                  pressRelease = isEntry.pressRelease;
                };
                let newEntry = entryStorage.replace(key, tempEntry);
                return #ok("Error while liking", true);
              };
              //  return #err("HIIIIi");
            };
          };
        } else {

          switch (isLiked) {
            case (?liked) {
              var newLikedUsers : [Principal] = [];
              for (item : Principal in tempLikedUsers.vals()) {
                if (item != caller) {
                  newLikedUsers := Array.append<Principal>(newLikedUsers, [item]);
                };
              };
              var newLikesCount = 0;
              if (isEntry.likes > 0) {
                newLikesCount := isEntry.likes -1;
              };

              var tempEntry = {
                title = isEntry.title;
                description = isEntry.description;
                image = isEntry.image;
                creation_time = isEntry.creation_time;
                user = isEntry.user;
                views = isEntry.views;
                likes = newLikesCount;
                category = isEntry.category;
                seoTitle = isEntry.seoTitle;
                seoSlug = isEntry.seoSlug;
                viewedUsers = isEntry.viewedUsers;
                likedUsers = newLikedUsers;
                seoDescription = isEntry.seoDescription;
                seoExcerpt = isEntry.seoExcerpt;
                subscription = isEntry.subscription;
                minters = isEntry.minters;
                isDraft = isEntry.isDraft;
                isPromoted = isEntry.isPromoted;
                // promotionLikesTarget = isEntry.promotionLikesTarget;
                userName = isEntry.userName;
                promotionICP = isEntry.promotionICP;
                status = isEntry.status;
                promotionHistory = isEntry.promotionHistory;
                pressRelease = isEntry.pressRelease;
              };
              let newEntry = entryStorage.replace(key, tempEntry);
              #ok("Article Unliked Successfully", false);
              // #err("Article Already Liked", false);
            };
            case (null) {
              let newLikedUsers = Array.append(tempLikedUsers, [caller]);

              var tempEntry = {
                title = isEntry.title;
                description = isEntry.description;
                image = isEntry.image;
                creation_time = isEntry.creation_time;
                user = isEntry.user;
                views = isEntry.views;
                likes = isEntry.likes +1;
                category = isEntry.category;
                seoTitle = isEntry.seoTitle;
                seoSlug = isEntry.seoSlug;
                viewedUsers = isEntry.viewedUsers;
                likedUsers = newLikedUsers;
                seoDescription = isEntry.seoDescription;
                seoExcerpt = isEntry.seoExcerpt;
                subscription = isEntry.subscription;
                isDraft = isEntry.isDraft;
                minters = isEntry.minters;
                isPromoted = isEntry.isPromoted;
                userName = isEntry.userName;
                // promotionLikesTarget = isEntry.promotionLikesTarget;
                promotionICP = isEntry.promotionICP;
                status = isEntry.status;
                pressRelease = isEntry.pressRelease;
                promotionHistory = isEntry.promotionHistory;
              };
              let newEntry = entryStorage.replace(key, tempEntry);
              let activited = commentCanister.addActivity(caller, key, #like);
              #ok("Article Liked Successfully", true);
            };
          };
        };
      };
      case (null) {
        #err("No Article Found")

      };
    };
  };
  public shared ({ caller }) func mintEntry(key : Key, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text)> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
    };
    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;

    let maybeEntry = entryStorage.get(key);
    switch (maybeEntry) {
      case (?isEntry) {

        var tempMinters = isEntry.minters;
        var isMinted = Array.find<Principal>(tempMinters, func x = x == caller);
        switch (isMinted) {
          case (?minted) {
            #err("Not Allowed");
          };
          case (null) {
            let newMinted : [Principal] = Array.append(tempMinters, [caller]);

            var tempEntry = {
              title = isEntry.title;
              description = isEntry.description;
              image = isEntry.image;
              creation_time = isEntry.creation_time;
              user = isEntry.user;
              views = isEntry.views;
              likes = isEntry.likes;
              category = isEntry.category;
              seoTitle = isEntry.seoTitle;
              seoSlug = isEntry.seoSlug;
              viewedUsers = isEntry.viewedUsers;
              likedUsers = isEntry.likedUsers;
              seoDescription = isEntry.seoDescription;
              seoExcerpt = isEntry.seoExcerpt;
              subscription = isEntry.subscription;
              isDraft = isEntry.isDraft;
              minters = newMinted;
              isPromoted = isEntry.isPromoted;
              promotionICP = isEntry.promotionICP;
              userName = isEntry.userName;

              status = isEntry.status;
              // promotionLikesTarget = isEntry.promotionLikesTarget;
              pressRelease = isEntry.pressRelease;
              promotionHistory = isEntry.promotionHistory;
            };

            let newEntry = entryStorage.replace(key, tempEntry);
            #ok("Article Minted Successfully", true);
          };
        };

      };
      case (null) {
        #err("No Article Found")

      };
    };
    //  public query func getEntry(key : Key) : async Result.Result<(Entry, Text), Text> {
    //   var entry = entryStorage.get(key);
    //   switch (entry) {
    //     case (?isEntry) {
    //       return #ok(isEntry, "Entery get successfully");
    //     };
    //     case (null) {
    //       return #err("Entry not found");
    //     };
    //   };
    // };
  };
  public shared ({ caller }) func isMinted(key : Key) : async Bool {
    assert not Principal.isAnonymous(caller);

    let maybeEntry = entryStorage.get(key);
    switch (maybeEntry) {
      case (?isEntry) {

        var tempMinters = isEntry.minters;
        var isMinted = Array.find<Principal>(tempMinters, func x = x == caller);
        switch (isMinted) {
          case (?minted) {
            return true;
          };
          case (null) {
            return false;
          };
        };

      };
      case (null) {
        return false;

      };
    };
    //  public query func getEntry(key : Key) : async Result.Result<(Entry, Text), Text> {
    //   var entry = entryStorage.get(key);
    //   switch (entry) {
    //     case (?isEntry) {
    //       return #ok(isEntry, "Entery get successfully");
    //     };
    //     case (null) {
    //       return #err("Entry not found");
    //     };
    //   };
    // };
  };
  public query func getUserEntries(user : UserId) : async [(Key, Entry)] {
    var sortedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if (entry.user == user) {
        if (shouldSendEntry(entry)) {
          sortedEntries.put(key, entry);
        };
      };
    };

    let entryArray = Iter.toArray(sortedEntries.entries());
    return EntryStoreHelper.sortEntriesByLatest(entryArray);
  };
  public query func getEntriesByCategory(inputCategory : Text) : async [(Key, Entry)] {
    // stable to entrystorage
    var sortedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      // if (entry.user == user) {
      //   sortedEntries.put(key, entry);
      // };
      if (shouldSendEntry(entry)) {
        let tempCategories = entry.category;
        for (category in tempCategories.vals()) {
          if (category == inputCategory) {

            sortedEntries.put(key, entry);
          };
        };
      };
    };
    let entryArray = Iter.toArray(sortedEntries.entries());
    return EntryStoreHelper.sortEntriesByLatest(entryArray);
  };
  public query func getAllEntries() : async [(Key, Entry)] {
    var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if (shouldSendEntry(entry)) {
        nonDraftedEntries.put(key, entry);
      };
    };
    let entryArray = Iter.toArray(nonDraftedEntries.entries());
    let sortedArray = EntryStoreHelper.sortEntriesByLatest(entryArray);
    var paginatedArray : [(Key, Entry)] = [];

    if (sortedArray.size() > 10) {

      paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, 0, 10);
    } else {
      paginatedArray := sortedArray;
    };
    return paginatedArray;

    // var tempEntries : [(Key, Entry)] = [];
    // tempEntries := Iter.toArray(entryStorage.entries());
    // return tempEntries;
  };
  public query func getPaginatedEntries(startIndex : Nat, length : Nat) : async {
    entries : [(Key, Entry)];
    amount : Nat;
  } {
    var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if (shouldSendEntry(entry)) {
        nonDraftedEntries.put(key, entry);
      };
    };
    let entryArray = Iter.toArray(nonDraftedEntries.entries());
    return EntryStoreHelper.paginateEntriesByLatest(entryArray, startIndex, length)

    // var tempEntries : [(Key, Entry)] = [];
    // tempEntries := Iter.toArray(entryStorage.entries());
    // return tempEntries;
  };
  public query func getPressEntries() : async [(Key, Entry)] {
    var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if (shouldSendEntry(entry)) {
        if (entry.pressRelease) {
          nonDraftedEntries.put(key, entry);
        };
      };
    };
    let entryArray = Iter.toArray(nonDraftedEntries.entries());
    return EntryStoreHelper.sortEntriesByLatest(entryArray)

    // var tempEntries : [(Key, Entry)] = [];
    // tempEntries := Iter.toArray(entryStorage.entries());
    // return tempEntries;
  };
  public query func getPromotedEntries(length : Nat) : async [(Key, Entry)] {
    var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if ((shouldSendEntry(entry)) and entry.isPromoted) {
        nonDraftedEntries.put(key, entry);
      };
    };
    let entryArray = Iter.toArray(nonDraftedEntries.entries());

    let sortedArray = EntryStoreHelper.sortEntriesByLatest(entryArray);
    let size = sortedArray.size();
    let startIndex = 0;
    var paginatedArray : [(Key, Entry)] = [];
    let itemsPerPage = 10;

    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, startIndex, itemsPerPage);

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      let amount : Nat = size - startIndex;
      Debug.print(debug_show (size, startIndex, amount));
      paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<(Key, Entry)>(sortedArray, 0, itemsPerPage);
    } else {
      paginatedArray := sortedArray;
    };
    return paginatedArray;
  };
  public query func getEntriesList(inputCategory : Text, draft : Bool, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Key, ListEntryItem)];
    amount : Nat;
  } {

    var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

    for ((key, entry) in entryStorage.entries()) {
      let lisEntryItem : ListEntryItem = {
        title = entry.title;
        image = entry.image;
        likes = entry.likes;
        views = entry.views;
        creation_time = entry.creation_time;
        user = entry.user;
        userName = entry.userName;
        category = entry.category;
        isDraft = entry.isDraft;
        minters = entry.minters;
        status = entry.status;
        isPromoted = entry.isPromoted;
        pressRelease = entry.pressRelease;
      };
      if ((inputCategory == "All")) {
        if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
          entiresList.put(key, lisEntryItem);
        };
      } else {
        if (draft and entry.isDraft or not draft and not entry.isDraft and shouldSendListEntry(entry.status)) {
          let tempCategories = entry.category;
          for (category in tempCategories.vals()) {
            if (category == inputCategory) {
              entiresList.put(key, lisEntryItem);
            };
          };

        };

        // entiresList := sortByCategory(inputCategory, entiresList, key, lisEntryItem, entry);
      };
    };
    // let entryArray = Iter.toArray(entiresList.entries());

    return EntryStoreHelper.searchSortList(entiresList, search, startIndex, length);

  };
  public query ({ caller }) func getUserEntriesList(inputCategory : Text, draft : Bool, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Key, ListEntryItem)];
    amount : Nat;
  } {
    assert not Principal.isAnonymous(caller);
    //   let userCanister = actor (userCanisterId) : actor {
    //   check_user_exists : (caller : Principal) -> async Bool;
    // };
    // let isUser = await userCanister.check_user_exists(caller);
    var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

    for ((key, entry) in entryStorage.entries()) {

      if (entry.user == caller) {
        let lisEntryItem : ListEntryItem = {
          title = entry.title;
          image = entry.image;
          likes = entry.likes;
          views = entry.views;
          creation_time = entry.creation_time;
          user = entry.user;
          category = entry.category;
          minters = entry.minters;
          isDraft = entry.isDraft;
          userName = entry.userName;
          status = entry.status;
          isPromoted = entry.isPromoted;
          pressRelease = entry.pressRelease;
        };
        if ((inputCategory == "All")) {

          if ((draft and (entry.isDraft or not shouldSendListEntry(entry.status))) or (not draft and not entry.isDraft and shouldSendListEntry(entry.status))) {
            entiresList.put(key, lisEntryItem);
          };
        } else {
          if ((draft and (entry.isDraft or not shouldSendListEntry(entry.status))) or (not draft and not entry.isDraft and shouldSendListEntry(entry.status))) {
            let tempCategories = entry.category;
            for (category in tempCategories.vals()) {
              if (category == inputCategory) {
                entiresList.put(key, lisEntryItem);
              };
            };

          };
        };

      };
    };
    let entryArray = Iter.toArray(entiresList.entries());
    return EntryStoreHelper.searchSortList(entiresList, search, startIndex, length);

  };
  public shared ({ caller }) func getReviewEntries(inputCategory : Text, userCanisterId : Text, status : EntryStatus, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [(Key, ListEntryItem)];
    amount : Nat;
  } {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #manage_article);
    var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

    for ((key, entry) in entryStorage.entries()) {

      let lisEntryItem : ListEntryItem = {
        title = entry.title;
        image = entry.image;
        likes = entry.likes;
        views = entry.views;
        creation_time = entry.creation_time;
        user = entry.user;
        category = entry.category;
        minters = entry.minters;
        isDraft = entry.isDraft;
        userName = entry.userName;
        status = entry.status;
        isPromoted = entry.isPromoted;
        pressRelease = entry.pressRelease;
      };
      if (not entry.isDraft) {
        if ((inputCategory == "All")) {
          if (entry.status == status) {
            entiresList.put(key, lisEntryItem);
          };
        } else {
          if (entry.status == status) {
            let tempCategories = entry.category;
            for (category in tempCategories.vals()) {
              if (category == inputCategory) {
                entiresList.put(key, lisEntryItem);
              };
            };
          };

        };
      };

    };
    let entryArray = Iter.toArray(entiresList.entries());
    return EntryStoreHelper.searchSortList(entiresList, search, startIndex, length);

  };
  public shared ({ caller }) func approveArticle(commentCanisterId : Text, userCanisterId : Text, key : Key, action : Bool) : async Result.Result<(Text, Entry), Text> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #manage_article);
    let commentCanister = actor (commentCanisterId) : actor {
      addAdminActivity : (user : Principal, target : Text, activityType : AdminActivityType) -> async Bool;
    };
    let maybeEntry = entryStorage.get(key);
    switch (maybeEntry) {
      case (?entry) {
        var status : EntryStatus = #pending;
        var activity : AdminActivityType = #approve;
        if (action) {
          status := #approved;
          activity := #approve;
        } else {
          status := #rejected;
          activity := #reject;
        };
        let tempEntry : Entry = {
          title = entry.title;
          description = entry.description;
          image = entry.image;
          creation_time = entry.creation_time;
          user = entry.user;
          views = 0;
          likes = 0;
          category = entry.category;
          seoTitle = entry.seoTitle;
          seoSlug = entry.seoSlug;
          viewedUsers = [];
          likedUsers = [];
          seoDescription = entry.seoDescription;
          seoExcerpt = entry.seoExcerpt;
          subscription = entry.subscription;
          isDraft = false;
          isPromoted = entry.isPromoted;
          // promotionLikesTarget = entry.promotionLikesTarget;
          promotionICP = entry.promotionICP;
          minters = [];
          userName = entry.userName;
          status = status;
          promotionHistory = null;
          pressRelease = entry.pressRelease;
        };
        let activitied = commentCanister.addAdminActivity(caller, key, activity);
        let newEntry = entryStorage.replace(key, tempEntry);
        switch (newEntry) {
          case (?isEntry) {
            #ok("Entry Approved Succesfuly", isEntry);
          };
          case (null) {
            #err("Error while approving");
          };
        };
      };
      case (null) {
        #err("Error while approving")

      };
    };
  };
  public query ({ caller }) func get_reward() : async RewardConfig {
    assert not Principal.isAnonymous(caller);
    return reward_config;
  };
  public query ({ caller }) func get_like_reward() : async Nat {
    assert not Principal.isAnonymous(caller);
    return like_reward;
  };
  public shared ({ caller }) func update_reward(userCanisterId : Text, inputReward : RewardConfig) : async RewardConfig {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #assign_role);
    let total = inputReward.master + inputReward.platform + inputReward.admin;
    assert total == 100;
    reward_config := inputReward;
    return reward_config;
  };
  public shared ({ caller }) func update_like_reward(userCanisterId : Text, inputReward : LikeReward) : async LikeReward {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #assign_role);
    assert like_reward < 100000000;
    like_reward := inputReward;
    return like_reward;
  };
  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_entries := Iter.toArray(entryStorage.entries());
    Debug.print("pre-upgrade finished.");

  };
  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    entryStorage := Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    stable_entries := [];
    Debug.print("post-upgrade finished.");

  };

};
