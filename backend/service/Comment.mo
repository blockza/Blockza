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
  type Key = Text;
  type Comment = {
    user : Principal;
    content : Text;
    creation_time : Int;
  };
  type InputComment = Text;
  type Comments = [Comment];
  type CommentsStore = [(Key, Comments)];

  stable var stable_comments : CommentsStore = [];
  var commentstorage = Map.fromIter<Key, Comments>(stable_comments.vals(), 0, Text.equal, Text.hash);

  public shared ({ caller }) func addComment(inputComment : InputComment, userCanisterId : Text, article : Text) : async Result.Result<(Comment, Text), Text> {
    assert not Principal.isAnonymous(caller);
    // assert inputComment
    try {
      let userCanister = actor (userCanisterId) : actor {
        check_user_exists : (caller : Principal) -> async Bool;
      };

      let isUser = await userCanister.check_user_exists(caller);
      assert isUser;

      let oldComments = commentstorage.get(article);
      var newComments = [];
      let tempComment : Comment = {
        creation_time = Time.now() / 1000000;
        user = caller;
        content = inputComment;
      };
      switch (oldComments) {
        case (?isComments) {
          let newComments = Array.append<Comment>(isComments, [tempComment]);
          commentstorage.put(article, newComments);

          return #ok(tempComment, "Comment added successfully");
        };
        case (null) {
          let initComments = [tempComment];
          commentstorage.put(article, initComments);
          return #ok(tempComment, "First Comment added successfully");
        };
      };
    } catch (err) {
      return #err("Error while adding comment");
    };
    // oldComments.add(tempComment);
    // commentstorage.put(article, tempComment);
    // let newEntryStorage : Map.HashMap<Key, Comments> = Map.fromIter<Key, Comments>(stable_comments.vals(), 0, Text.equal, Text.hash);
    // return newEntryStorage;

    // // let entryId = EntryType.generateNewRemoteObjectId();
    // // entryStorage := EntryStoreHelper.addNewEntry(entryStorage, entry, entryId, caller);

    // return "entryId";
  };
  public query func getComments(article : Text) : async Result.Result<(Comments, Text), Text> {
    let maybeComments = commentstorage.get(article);

    switch (maybeComments) {
      case (?comments) {
        return #ok(comments, "Comments get successfully")

      };
      case (null) {
        return #err("Error while getting comments");
      };
    };

  };

  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_comments := Iter.toArray(commentstorage.entries());
    Debug.print("pre-upgrade finished.");

  };

  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    commentstorage := Map.fromIter<Key, Comments>(stable_comments.vals(), stable_comments.size(), Text.equal, Text.hash);
    stable_comments := [];
    Debug.print("post-upgrade finished.");

  };

};
