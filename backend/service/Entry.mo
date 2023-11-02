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
import EntryType "../model/EntryType";
import EntryStoreHelper "../helper/EntryStoreHelper";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = Text;
  type Entry = EntryType.Entry;
  type UserId = EntryType.UserId;
  type InputEntry = EntryType.InputEntry;
  type EntryId = EntryType.EntryId;

  type Entries = [(Key, Entry)];
  stable var stable_entries : Entries = [];

  var entryStorage = Map.fromIter<Key, Entry>(stable_entries.vals(), 0, Text.equal, Text.hash);

  public shared ({ caller }) func insertEntry(entry : InputEntry, userCanisterId : Text) : async EntryId {
    assert not Principal.isAnonymous(caller);

    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
    };

    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;

    let entryId = EntryType.generateNewRemoteObjectId();
    entryStorage := EntryStoreHelper.addNewEntry(entryStorage, entry, entryId, caller);
    return entryId;
  };
  public shared ({ caller }) func main(canisterId : Text) : async ?Text {
    // let canister2 = actor (canisterId) : actor {
    //   p_is_user : (caller : Principal) -> async ?UserId;
    // };
    // let trans = await canister2.p_is_user(caller);
    // Debug.print(debug_show ("trans"));
    return ?"23";
  };
  public query func getEntry(key : Key) : async ?Entry {
    entryStorage.get(key);
  };

  public query func getUserEntries(user : UserId) : async [(Key, Entry)] {
    var sortedEntries = Map.fromIter<Key, Entry>(stable_entries.vals(), stable_entries.size(), Text.equal, Text.hash);
    for ((key, entry) in entryStorage.entries()) {
      if (entry.user == user) {
        sortedEntries.put(key, entry);
      };
    };
    return Iter.toArray(sortedEntries.entries());
  };

  public query func getAllEntries() : async [(Key, Entry)] {
    var tempEntries : [(Key, Entry)] = [];
    tempEntries := Iter.toArray(entryStorage.entries());
    return tempEntries;
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
