import Time "mo:base/Time";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import ImageType "ImageType";
import Map "mo:base/HashMap";

module CollectionType {
  type ImageObject = ImageType.ImageObject;
  type User = Text;

  public type CollectionId = Text;

  public type Collection = {
    name : Text;
    description : Text;
    image : ImageObject;
    creation_time : Int;
    user : User;
  };
  public type RawCollection = {
    name : Text;
    description : Text;
    image : ImageObject;
    user : User;
  };
  public type CollectionStorage = Map.HashMap<CollectionId, Collection>;

  public func generateNewRemoteObjectId() : CollectionId {
    return Int.toText(Time.now());
  };

};
