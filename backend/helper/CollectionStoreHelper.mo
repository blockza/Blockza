import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Map "mo:base/HashMap";

import ImageType "../model/ImageType";
import Time "mo:base/Time";
import Array "mo:base/Array";
import CollectionType "../model/CollectionType";

module CollectionStoreHelper {

  type Collection = CollectionType.Collection;
  type InputCollection = CollectionType.RawCollection;
  type CollectionStorage = CollectionType.CollectionStorage;
  type CollectionId = CollectionType.CollectionId;

  type ImageStore = Trie.Trie<ImageId, ImageObject>;
  type ImageObject = ImageType.ImageObject;
  type ImageId = ImageType.ImageId;

  public func addNewCollection(collectionStorage : CollectionStorage, collection : InputCollection, collectionId : CollectionId) : CollectionStorage {
    let tempEntry : Collection = {
      name = collection.name;
      description = collection.description;
      image = collection.image;
      creation_time = Time.now() / 1000000;
      user = collection.user;
    };

    collectionStorage.put(collectionId, tempEntry);
    let newCollectionStorage : Map.HashMap<CollectionId, Collection> = Map.fromIter<CollectionId, Collection>(collectionStorage.entries(), collectionStorage.size(), Text.equal, Text.hash);
    return newCollectionStorage;

  };

};
