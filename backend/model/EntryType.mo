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
import Array "mo:base/Array";

module EntryType {
  type ImageObject = ImageType.ImageObject;
  public type UserId = Principal;
  public type EntryStatus = {
    #approved;
    #rejected;
    #pending;
  };
  public type EntryId = Text;

  public type Entry = {
    title : Text;
    description : Text;
    image : ImageObject;
    likes : Nat;
    likedUsers : [Principal];
    views : Nat;
    viewedUsers : [Principal];
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    subscription : Bool;
    isDraft : Bool;
    isPromoted : Bool;
    minters : [Principal];
    status : EntryStatus;
    // promotionLikesTarget : Nat;
    promotionICP : Nat;
    promotionHistory : List.List<Int>;
  };
  public type InputEntry = {
    title : Text;
    description : Text;
    image : ImageObject;
    userName : Text;
    // user : UserId;
    category : [Text];
    seoTitle : Text;
    seoSlug : Text;
    seoDescription : Text;
    seoExcerpt : Text;
    subscription : Bool;
    isDraft : Bool;
    isPromoted : Bool;
    promotionICP : Nat;
    // promotionLikesTarget : Nat;
    // promotion: ;

  };
  public type ListEntryItem = {
    title : Text;
    image : ImageObject;
    likes : Nat;
    views : Nat;
    creation_time : Int;
    user : UserId;
    userName : Text;
    category : [Text];
    isDraft : Bool;
    minters : [Principal];
    status : EntryStatus;
    isPromoted : Bool;
  };
  public type EntryStorage = Map.HashMap<EntryId, Entry>;
  public func generateNewRemoteObjectId() : EntryId {
    return Int.toText(Time.now());
  };

  public func entryIdKey(x : EntryId) : Trie.Key<EntryId> {
    { key = x; hash = Text.hash(x) };
  };

};
