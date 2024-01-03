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
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Order "mo:base/Order";
import Prim "mo:prim";
import EntryType "../model/EntryType";
import EntryStoreHelper "../helper/EntryStoreHelper";
import UserType "../model/UserType";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = EntryType.SubKey;
  type Subscriber = EntryType.Subscriber;
  type InputSubscriber = Text;
  type Subscribers = [Subscriber];
  type SubscribersStore = [(Key, Subscribers)];
  type ActivityType = UserType.ActivityType;

  stable var stable_subscribers : SubscribersStore = [];
  var subscribersStorage = Map.fromIter<Key, Subscribers>(stable_subscribers.vals(), 0, Principal.equal, Principal.hash);
  public shared func searchPaginateSubscribersByLatest(array : [Subscriber], userCanisterId : Text, search : Text, startIndex : Nat, length : Nat) : async {
    entries : [Subscriber];
    amount : Nat;
  } {

    let searchString = Text.map(search, Prim.charToLower);
    var searchedSubscribers = Map.HashMap<Principal, Subscriber>(0, Principal.equal, Principal.hash);
    // let title = Text.map(user.title, Prim.charToLower);
    let userCanister = actor (userCanisterId) : actor {
      get_user_name_only : (userId : Principal) -> async ?Text;
    };
    for (sub in array.vals()) {

      var user = sub.user;
      let obj = await userCanister.get_user_name_only(user);
      switch (obj) {
        case (?name) {
          let userName = Text.map(name, Prim.charToLower);
          // var isTitleSearched = Text.contains(title, #text searchString);
          var isUserSearched = Text.contains(userName, #text searchString);
          if (isUserSearched) {
            searchedSubscribers.put(user, sub);
          };
        };
        case (null) {};
      };

    };
    let searchedArray : [Subscriber] = Iter.toArray(searchedSubscribers.vals());
    // let newArray = Array.mapFilter<Subscriber, Subscriber>(
    //   // mapping from Nat to Text values
    //   array,
    //   searchsub,
    // );
    // can't divide by 0, so return null
    // var searchedUsersArray : [(Id, ListAdminUser)] = Iter.toArray(searchedUsers.entries());

    let compare = func(a : Subscriber, b : Subscriber) : Order.Order {
      if (a.subscribed_on > b.subscribed_on) {
        return #less;
      } else if (a.subscribed_on < b.subscribed_on) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListSubscriberItem), (keyB : Key, b : ListSubscriberItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    let sortedEntries = Array.sort(
      searchedArray,
      compare,
    );
    var paginatedArray : [Subscriber] = [];
    let size = sortedEntries.size();
    let amount : Nat = size - startIndex;
    let itemsPerPage = 11;
    if (size > startIndex and size > (length + startIndex) and length != 0) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, length);
    } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
      if (length != 0) {
        paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, amount);
      } else {
        paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, itemsPerPage);

      };

    } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
      Debug.print(debug_show (size, startIndex, amount));
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, amount);

    } else if (size > startIndex) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, startIndex, amount);

    } else if (size > itemsPerPage) {
      paginatedArray := Array.subArray<Subscriber>(sortedEntries, 0, itemsPerPage);
    } else {
      paginatedArray := sortedEntries;
    };
    return { entries = paginatedArray; amount = sortedEntries.size() };
  };
  public query ({ caller }) func isSubscriber(author : Principal) : async Bool {
    let maybeOldSubscribers = subscribersStorage.get(author);

    switch (maybeOldSubscribers) {
      case (?oldSubscribers) {
        var isSubscribed = Array.find<Subscriber>(oldSubscribers, func x = x.user == caller);
        switch (isSubscribed) {
          case (?yes) {
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
    // return false;
  };
  public shared ({ caller }) func addSubscriber(author : Principal, userCanisterId : Text, commentCanisterId : Text) : async Result.Result<(Subscriber, Text), Text> {
    assert not Principal.isAnonymous(caller);
    // assert inputComment
    try {
      let userCanister = actor (userCanisterId) : actor {
        check_user_exists : (caller : Principal) -> async Bool;
      };
      let commentCanister = actor (commentCanisterId) : actor {
        addActivity : (user : Principal, target : Text, activityType : ActivityType) -> async Bool;
      };

      let isUser = await userCanister.check_user_exists(caller);
      assert isUser;
      let newSubscriber : Subscriber = {
        user = caller;
        subscribed_on = Time.now() / 1000000;
      };
      let authorId = Principal.toText(author);
      let maybeOldSubscribers = subscribersStorage.get(author);
      switch (maybeOldSubscribers) {
        case (?oldSubscribers) {
          // var isSubscribed = Array.find<Subscriber>(oldSubscribers, func x = x.user == caller);
          // return true;
          var isSubscribed = Array.find<Subscriber>(oldSubscribers, func x = x.user == caller);
          switch (isSubscribed) {
            case (?subscribed) {
              var newSubscribers : Subscribers = [];
              for (subscriber : Subscriber in oldSubscribers.vals()) {
                if (subscriber.user != caller) {
                  newSubscribers := Array.append<Subscriber>(newSubscribers, [subscriber]);
                };
              };

              let temp = subscribersStorage.replace(author, newSubscribers);
              return #ok(newSubscriber, "UnSubscribed Successfully");
            };
            case (null) {
              let newSubscribers = Array.append<Subscriber>(oldSubscribers, [newSubscriber]);
              subscribersStorage.put(author, newSubscribers);
              let activitied = commentCanister.addActivity(caller, authorId, #subscribe);
              return #ok(newSubscriber, "Subsribed Successfully")

            };
          };

        };
        case (null) {
          let newSubscribers = [newSubscriber];
          subscribersStorage.put(author, newSubscribers);
          let activitied = commentCanister.addActivity(caller, authorId, #subscribe);
          return #ok(newSubscriber, "Subsribed Successfully #1")
          // return false;
        };
      };

      // switch (maybeOldSubscribers) {
      //   case (?oldSubscribers) {
      //     var isSubscribed = Array.find<Subscriber>(oldSubscribers, func x = x.user == caller);
      //     // return true;
      //   };
      //   case (null) {
      //     // return false;
      //   };
      // };
      // #err("NOOO")
      // let oldComments = subscribersStorage.get(article);
      // var newComments = [];
      // let tempComment : Subscriber = {
      //   creation_time = Time.now() / 1000000;
      //   user = caller;
      //   content = inputComment;
      // };
      // switch (oldComments) {
      //   case (?isComments) {
      //     let newComments = Array.append<Subscriber>(isComments, [tempComment]);
      //     subscribersStorage.put(article, newComments);

      //     return #ok(tempComment, "Subscriber added successfully");
      //   };
      //   case (null) {
      //     let initComments = [tempComment];
      //     subscribersStorage.put(article, initComments);
      //     return #ok(tempComment, "First Subscriber added successfully");
      //   };
      // };
    } catch (err) {
      return #err("Error while adding subscriber");
    };
    // oldComments.add(tempComment);
    // subscribersStorage.put(article, tempComment);
    // let newEntryStorage : Map.HashMap<Key, Subscribers> = Map.fromIter<Key, Subscribers>(stable_subscribers.vals(), 0, Text.equal, Text.hash);
    // return newEntryStorage;

    // // let entryId = EntryType.generateNewRemoteObjectId();
    // // entryStorage := EntryStoreHelper.addNewEntry(entryStorage, entry, entryId, caller);

    // return "entryId";
  };
  public query ({ caller }) func getSubscribers(startIndex : Nat, length : Nat) : async Result.Result<({ entries : [Subscriber]; amount : Nat }, Text), Text> {
    assert not Principal.isAnonymous(caller);

    let maybeSubscribers = subscribersStorage.get(caller);
    switch (maybeSubscribers) {
      case (?subscribers) {
        let sorted = EntryStoreHelper.paginateSubscribersByLatest(subscribers, startIndex, length);
        // let sorted = await EntryStoreHelper.paginateSubscribersByLatest(subscribers, userCanisterId, search, startIndex, length);
        return #ok(sorted, "Subscribers get successfully")

      };
      case (null) {
        return #ok({ entries = []; amount = 0 }, "Error while getting subscribers");
      };
    };

  };
  public shared ({ caller }) func searchSubscribers(userCanisterId : Text, search : Text, startIndex : Nat, length : Nat) : async Result.Result<({ entries : [Subscriber]; amount : Nat }, Text), Text> {
    assert not Principal.isAnonymous(caller);

    let maybeSubscribers = subscribersStorage.get(caller);
    switch (maybeSubscribers) {
      case (?subscribers) {
        // let sorted = EntryStoreHelper.paginateSubscribersByLatest(subscribers, startIndex, length);
        let sorted = await searchPaginateSubscribersByLatest(subscribers, userCanisterId, search, startIndex, length);
        return #ok(sorted, "Subscribers get successfully")

      };
      case (null) {
        return #ok({ entries = []; amount = 0 }, "Error while getting subscribers");
      };
    };

  };

  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_subscribers := Iter.toArray(subscribersStorage.entries());
    Debug.print("pre-upgrade finished.");

  };

  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    subscribersStorage := Map.fromIter<Key, Subscribers>(stable_subscribers.vals(), stable_subscribers.size(), Principal.equal, Principal.hash);
    stable_subscribers := [];
    Debug.print("post-upgrade finished.");

  };

};
