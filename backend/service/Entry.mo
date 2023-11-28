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
import EntryType "../model/EntryType";
import EntryStoreHelper "../helper/EntryStoreHelper";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = Text;
  type Entry = EntryType.Entry;
  type UserId = EntryType.UserId;
  type InputEntry = EntryType.InputEntry;
  type EntryId = EntryType.EntryId;
  type ListEntryItem = EntryType.ListEntryItem;
  type Entries = [(Key, Entry)];
  stable var stable_entries : Entries = [];

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
    entriesList;
  };
  public shared ({ caller }) func insertEntry(entry : InputEntry, userCanisterId : Text, isDraftUpdate : Bool, draftId : Text) : async Result.Result<(Text, EntryId), (Text)> {
    assert not Principal.isAnonymous(caller);

    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
    };
    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;
    // switch (oldUser) {
    //   case (?isOlduser) {
    //     if (isOlduser != caller) {
    //       return #err("Error while publishing draft");
    //     };
    //   };
    //   case (null) {};
    // };

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

    let entryId = EntryType.generateNewRemoteObjectId();
    entryStorage := EntryStoreHelper.addNewEntry(entryStorage, entry, entryId, caller, isDraftUpdate, draftId);
    if (isDraftUpdate) {
      return #ok("Published", draftId);
    } else {
      return #ok("Published", entryId);

    };
  };
  public shared ({ caller }) func updateDraft(key : Key) : async Result.Result<(Text, Bool), (Text)> {
    assert not Principal.isAnonymous(caller);

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

              // promotionLikesTarget = isEntry.promotionLikesTarget;
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

  public query func getEntry(key : Key) : async ?Entry {
    entryStorage.get(key);
  };
  public query func getCategories() : async [Text] {
    EntryStoreHelper.getCategoies();
  };
  public shared ({ caller }) func likeEntry(key : Key, userCanisterId : Text) : async Result.Result<(Text, Bool), (Text)> {
    assert not Principal.isAnonymous(caller);
    let userCanister = actor (userCanisterId) : actor {
      add_reward : (caller : Principal, key : Text) -> async Bool;
    };

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

              var newPromotionICP : Float = isEntry.promotionICP;
              if ((newPromotionICP - 0.1) <= 0) {
                newPromoted := false;
              } else {
                newPromotionICP := newPromotionICP - 0.1;
                newPromoted := true;
              };
              let newLikedUsers = Array.append(tempLikedUsers, [caller]);

              let isUserRewarded = await userCanister.add_reward(caller, sectek);

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
                  // promotionLikesTarget = isEntry.promotionLikesTarget;
                  promotionICP = newPromotionICP;
                };
                let newEntry = entryStorage.replace(key, tempEntry);
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
                  isPromoted = isEntry.isPromoted;
                  // promotionLikesTarget = isEntry.promotionLikesTarget;
                  promotionICP = isEntry.promotionICP;
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
                promotionICP = isEntry.promotionICP;
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
                // promotionLikesTarget = isEntry.promotionLikesTarget;
                promotionICP = isEntry.promotionICP;
              };
              let newEntry = entryStorage.replace(key, tempEntry);
              #ok("Article Liked Successfully", true);
            };
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
  public shared ({ caller }) func mintEntry(key : Key) : async Result.Result<(Text, Bool), (Text)> {
    assert not Principal.isAnonymous(caller);

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

              // promotionLikesTarget = isEntry.promotionLikesTarget;
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
      if (entry.isDraft == false) {
        if (entry.user == user) {
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
      if (entry.isDraft == false) {
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
      if (entry.isDraft == false) {
        nonDraftedEntries.put(key, entry);
      };
    };
    let entryArray = Iter.toArray(nonDraftedEntries.entries());
    return EntryStoreHelper.sortEntriesByLatest(entryArray)

    // var tempEntries : [(Key, Entry)] = [];
    // tempEntries := Iter.toArray(entryStorage.entries());
    // return tempEntries;
  };
  public query func getPromotedEntries() : async [(Key, Entry)] {
    var nonDraftedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if ((not entry.isDraft) and entry.isPromoted) {
        nonDraftedEntries.put(key, entry);
      };
    };
    let entryArray = Iter.toArray(nonDraftedEntries.entries());
    return EntryStoreHelper.sortEntriesByLatest(entryArray);
  };
  public query func getEntriesList(inputCategory : Text) : async [(Key, ListEntryItem)] {

    var entiresList = Map.HashMap<Key, ListEntryItem>(0, Text.equal, Text.hash);

    if ((inputCategory == "All")) {
      for ((key, entry) in entryStorage.entries()) {
        let lisEntryItem : ListEntryItem = {
          title = entry.title;
          image = entry.image;
          likes = entry.likes;
          views = entry.views;
          creation_time = entry.creation_time;
          user = entry.user;
          category = entry.category;
          isDraft = entry.isDraft;
          minters = entry.minters;
        };
        if (entry.isDraft == false) {
          entiresList.put(key, lisEntryItem);
        };
        //  else {
        //   let tempCategories = entry.category;
        //   for (category in tempCategories.vals()) {
        //     if (category == inputCategory) {
        //       entiresList.put(key, lisEntryItem);
        //     };
        //   };
        // };
        // entiresList := sortByCategory(inputCategory, entiresList, key, lisEntryItem, entry);
      };
    } else {
      for ((key, entry) in entryStorage.entries()) {
        let lisEntryItem : ListEntryItem = {
          title = entry.title;
          image = entry.image;
          likes = entry.likes;
          views = entry.views;
          creation_time = entry.creation_time;
          user = entry.user;
          category = entry.category;
          isDraft = entry.isDraft;
          minters = entry.minters;
        };
        if (entry.isDraft == false) {
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
    let entryArray = Iter.toArray(entiresList.entries());
    return EntryStoreHelper.sortListByLatest(entryArray)

  };
  public query ({ caller }) func getUserEntriesList(inputCategory : Text, draft : Bool) : async [(Key, ListEntryItem)] {
    assert not Principal.isAnonymous(caller);

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
        };
        if (draft) {
          if (entry.isDraft) {
            if (inputCategory == "All") {
              entiresList.put(key, lisEntryItem);
            } else {
              let tempCategories = entry.category;
              for (category in tempCategories.vals()) {
                if (category == inputCategory) {
                  entiresList.put(key, lisEntryItem);
                };
              };
            };
            // entiresList.put(key, lisEntryItem);

          };
        } else {
          if (entry.isDraft == false) {
            if (inputCategory == "All") {
              entiresList.put(key, lisEntryItem);
            } else {
              let tempCategories = entry.category;
              for (category in tempCategories.vals()) {
                if (category == inputCategory) {
                  entiresList.put(key, lisEntryItem);
                };
              };
            };
            // entiresList.put(key, lisEntryItem);
          };
        };

      };

    };
    let entryArray = Iter.toArray(entiresList.entries());
    return EntryStoreHelper.sortListByLatest(entryArray)

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
