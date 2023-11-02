import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Map "mo:base/HashMap";

import ImageType "../model/ImageType";
import EntryType "../model/EntryType";
import Time "mo:base/Time";
import Array "mo:base/Array";

module EntryStoreHelper {

  type Entry = EntryType.Entry;
  type UserId = EntryType.UserId;
  type InputEntry = EntryType.InputEntry;
  type EntryStorage = EntryType.EntryStorage;
  type EntryId = EntryType.EntryId;

  type ImageStore = Trie.Trie<ImageId, ImageObject>;
  type ImageObject = ImageType.ImageObject;
  type ImageId = ImageType.ImageId;

  public func addNewImage(imageObjectStore : ImageStore, image : ImageObject, imageId : ImageId) : ImageStore {
    let newStore = Trie.put(
      imageObjectStore,
      ImageType.imageIdKey(imageId),
      Text.equal,
      image,
    ).0;

    return newStore;
  };

  public func addNewEntry(entryStorage : EntryStorage, entry : InputEntry, entryId : EntryId, caller : UserId) : EntryStorage {
    let tempEntry : Entry = {
      title = entry.title;
      description = entry.description;
      image = entry.image;
      creation_time = Time.now() / 1000000;
      user = caller;
      views = 0;
      likes = 0;
      subscription = entry.subscription;
    };

    entryStorage.put(entryId, tempEntry);
    let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
    return newEntryStorage;

  };

  public func removeImage(imageObjectStore : ImageStore, imageId : ImageId) : ImageStore {
    let newStore = Trie.remove(
      imageObjectStore,
      ImageType.imageIdKey(imageId),
      Text.equal,
    ).0;

    return newStore;
  };

  public func getImageById(id : ImageId, imageObjectStore : Trie.Trie<ImageId, ImageObject>) : ?ImageObject {
    return Trie.find<ImageId, ImageObject>(imageObjectStore, ImageType.imageIdKey(id), Text.equal);
  };

};
