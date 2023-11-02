// ==================== In progress =============================
// import Map "mo:base/HashMap";
// import Text "mo:base/Text";
// import Iter "mo:base/Iter";
// import Array "mo:base/Array";

// actor {

//   type Title = Text;
//   type Description = Text;
//   type Key = Text;
//   type User = Text;

//   type Entry = {
//     user : User;
//     title : Text;
//     description : Description;
//   };
//   stable var entries : [Entry] = [];

//   stable let entryStorage = Array.init<[Entry]>(0, []);

//   public func insertEntry(entry:Entry) : async () {
//     entryStorage.put(entry);
//   };

//   public query func getEntry(key : Key) : async ?Entry {
//     entryStorage.get(key);
//   };

//   public query func getAllEntries() : async [(Key, Entry)] {
//     var tempEntries : [(Key, Entry)] = [];
//     tempEntries := Iter.toArray(entryStorage.entries());
//     return tempEntries;
//   };

//   system func preupgrade() {
//     entries := Iter.toArray(entryStorage.entries());
//   };

//   system func postupgrade() {
//     entries := [];
//   };

// };

// Old is Gold

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
import CollectionType "../model/CollectionType";
import CollectionStoreHelper "../helper/CollectionStoreHelper";

actor {

  type Title = Text;
  type Key = Text;
  type User = Text;
  type Collection = CollectionType.Collection;
  type InputCollection = CollectionType.RawCollection;
  type CollectionId = CollectionType.CollectionId;

  type Entries = [(Key, Collection)];
  stable var stable_collections : Entries = [];

  var collectionStorage = Map.fromIter<Key, Collection>(stable_collections.vals(), 0, Text.equal, Text.hash);

  public shared ({ caller }) func insertCollection(collection : InputCollection) : async CollectionId {
    let collectionId = CollectionType.generateNewRemoteObjectId();
    collectionStorage := CollectionStoreHelper.addNewCollection(collectionStorage, collection, collectionId);
    Debug.print(debug_show (caller));
    return collectionId;
  };

  public query func getCollection(key : Key) : async ?Collection {
    collectionStorage.get(key);
  };

  public query func getUserCollection(user : User) : async [(Key, Collection)] {
    var userCollections = Map.fromIter<Key, Collection>(stable_collections.vals(), stable_collections.size(), Text.equal, Text.hash);
    for ((key, collection) in collectionStorage.entries()) {
      if (collection.user == user) {
        userCollections.put(key, collection);
      };
    };
    return Iter.toArray(userCollections.entries());
  };

  public query func getAllCollections() : async [(Key, Collection)] {
    // var tempCollections : [(Key, Collection)] = [];
    // tempCollections := Iter.toArray(collectionStorage.entries());
    // return tempCollections;
    return Iter.toArray(collectionStorage.entries());
  };

  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_collections := Iter.toArray(collectionStorage.entries());
    Debug.print("pre-upgrade finished.");

  };

  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    collectionStorage := Map.fromIter<Key, Collection>(stable_collections.vals(), stable_collections.size(), Text.equal, Text.hash);
    stable_collections := [];
    Debug.print("post-upgrade finished.");

  };

};
