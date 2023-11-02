import Time "mo:base/Time";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import ImageType "ImageType";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";

module EntryType {
  type ImageObject = ImageType.ImageObject;
  public type UserId = Principal;

  public type EntryId = Text;

  public type Entry = {
    title : Text;
    description : Text;
    image : ImageObject;
    likes : Nat;
    views : Nat;
    creation_time : Int;
    user : UserId;
    subscription : Bool;
  };
  public type InputEntry = {
    title : Text;
    description : Text;
    image : ImageObject;
    likes : Nat;
    views : Nat;
    // user : UserId;
    subscription : Bool;
  };
  public type EntryStorage = Map.HashMap<EntryId, Entry>;
  public func generateNewRemoteObjectId() : EntryId {
    return Int.toText(Time.now());
  };

  public func entryIdKey(x : EntryId) : Trie.Key<EntryId> {
    { key = x; hash = Text.hash(x) };
  };

};
