import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Map "mo:base/HashMap";

import ImageType "../model/ImageType";
import EntryType "../model/EntryType";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Prelude "mo:base/Prelude";
import Order "mo:base/Order";

module EntryStoreHelper {

  type Entry = EntryType.Entry;
  type UserId = EntryType.UserId;
  type InputEntry = EntryType.InputEntry;
  type EntryStorage = EntryType.EntryStorage;
  type EntryId = EntryType.EntryId;
  type ListEntryItem = EntryType.ListEntryItem;
  type Key = Text;

  type ImageStore = Trie.Trie<ImageId, ImageObject>;
  type ImageObject = ImageType.ImageObject;
  type ImageId = ImageType.ImageId;

  let my_categories = ["AI", "BlockChain", "Guide", "GameReview"];

  public func addNewImage(imageObjectStore : ImageStore, image : ImageObject, imageId : ImageId) : ImageStore {
    let newStore = Trie.put(
      imageObjectStore,
      ImageType.imageIdKey(imageId),
      Text.equal,
      image,
    ).0;

    return newStore;
  };

  public func addNewEntry(entryStorage : EntryStorage, entry : InputEntry, entryId : EntryId, caller : UserId, isDraftUpdate : Bool, draftId : Text) : EntryStorage {

    var categories = Array.mapFilter<Text, Text>(
      entry.category,
      func(x) {
        var found = false;
        for (cat in my_categories.vals()) {
          if (x == cat) {
            found := true;
          };
        };
        if (found) {
          ?x;
        } else {
          ?"Other";
        };
      },
    );

    // case ("AI") ?"AI";

    // case ("BlockChain") ?"BlockChain";
    // case ("Guide") ?"Guide";
    // case ("GameReview") ?"GameReview";
    // case (_) ?"Other";

    // switch (entry.category) {

    //   case ("AI") "AI";
    //   case ("BlockChain") "BlockChain";
    //   case ("Guide") "Guide";
    //   case ("GameReview") "GameReview";
    //   case (_) "Other";
    // };
    let tempEntry : Entry = {
      title = entry.title;
      description = entry.description;
      image = entry.image;
      creation_time = Time.now() / 1000000;
      user = caller;
      views = 0;
      likes = 0;
      category = categories;
      seoTitle = entry.seoTitle;
      seoSlug = entry.seoSlug;
      viewedUsers = [];
      likedUsers = [];
      seoDescription = entry.seoDescription;
      seoExcerpt = entry.seoExcerpt;
      subscription = entry.subscription;
      isDraft = entry.isDraft;
      isPromoted = entry.isPromoted;
      // promotionLikesTarget = entry.promotionLikesTarget;
      promotionICP = entry.promotionICP;
      minters = [];
    };
    if (isDraftUpdate) {
      let oldEntry = entryStorage.replace(draftId, tempEntry);
      let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
      return newEntryStorage;
    } else {
      entryStorage.put(entryId, tempEntry);
      let newEntryStorage : Map.HashMap<EntryId, Entry> = Map.fromIter<EntryId, Entry>(entryStorage.entries(), entryStorage.size(), Text.equal, Text.hash);
      return newEntryStorage;

    };

  };
  public func sortListByLatest(array : [(Key, ListEntryItem)]) : [(Key, ListEntryItem)] {
    let compare = func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    Array.sort(
      array,
      compare,
    );
  };
  public func sortEntriesByLatest(array : [(Key, Entry)]) : [(Key, Entry)] {
    let compare = func((keyA : Key, a : Entry), (keyB : Key, b : Entry)) : Order.Order {
      if (a.creation_time > b.creation_time) {
        return #less;
      } else if (a.creation_time < b.creation_time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    // let sortedArray = Array.sort(newArr, func((keyA : Key, a : ListEntryItem), (keyB : Key, b : ListEntryItem)) { Order.fromCompare((b.creation_time - a.creation_time)) });
    Array.sort(
      array,
      compare,
    );
  };
  public func getCategoies() : [Text] {
    my_categories;
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
