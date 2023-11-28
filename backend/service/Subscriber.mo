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
import EntryType "../model/EntryType";
import EntryStoreHelper "../helper/EntryStoreHelper";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = Principal;
  type Subscriber = {
    user : Principal;
    subscribed_on : Int;
  };
  type InputSubscriber = Text;
  type Subscribers = [Subscriber];
  type SubscribersStore = [(Key, Subscribers)];

  stable var stable_subscribers : SubscribersStore = [];
  var subscribersStorage = Map.fromIter<Key, Subscribers>(stable_subscribers.vals(), 0, Principal.equal, Principal.hash);

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

  public shared ({ caller }) func addSubscriber(author : Principal, userCanisterId : Text) : async Result.Result<(Subscriber, Text), Text> {
    assert not Principal.isAnonymous(caller);
    // assert inputComment
    try {
      let userCanister = actor (userCanisterId) : actor {
        check_user_exists : (caller : Principal) -> async Bool;
      };

      let isUser = await userCanister.check_user_exists(caller);
      assert isUser;
      let newSubscriber : Subscriber = {
        user = caller;
        subscribed_on = Time.now() / 1000000;
      };
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
              return #ok(newSubscriber, "Subsribed Successfully")

            };
          };

        };
        case (null) {
          let newSubscribers = [newSubscriber];
          subscribersStorage.put(author, newSubscribers);
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
  public query ({ caller }) func getSubscribers() : async Result.Result<(Subscribers, Text), Text> {
    assert not Principal.isAnonymous(caller);

    let maybeSubscribers = subscribersStorage.get(caller);

    switch (maybeSubscribers) {
      case (?subscribers) {
        return #ok(subscribers, "Subscribers get successfully")

      };
      case (null) {
        return #err("Error while getting subscribers");
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
