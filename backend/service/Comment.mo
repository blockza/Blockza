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
import Order "mo:base/Order";
import EntryType "../model/EntryType";
import EntryStoreHelper "../helper/EntryStoreHelper";
import UserType "../model/UserType";

shared ({ caller = initializer }) actor class () {

  type Title = Text;
  type Key = Text;
  type Comment = {
    user : Principal;
    content : Text;
    creation_time : Int;
  };
  type ActivityType = UserType.ActivityType;
  type Activity = {
    // user : Principal;
    activity_type : ActivityType;
    time : Int;
    target : Text;
  };
  type Activities = [Activity];
  type Permission = UserType.Permission;

  type AdminActivityType = UserType.AdminActivityType;
  type AdminActivity = {
    activity_type : AdminActivityType;
    time : Int;
    target : Text;
  };
  type AdminActivities = [AdminActivity];

  type UserId = Principal;
  private let MAX_ACTIVITIES_PER_USER = 100;
  private let MAX_ACTIVITIES = 1000;
  private let MAX_ACTIVITIES_PER_ADMIN = 100;

  private let MAX_COMMENTS_PER_ARTICLE = 100;
  private let MAX_COMMENTS = 1000;
  type InputComment = Text;
  type Comments = [Comment];
  type CommentsStore = [(Key, Comments)];
  type ActivityStore = [(UserId, Activities)];
  type AdminActivityStore = [(UserId, AdminActivities)];

  stable var stable_comments : CommentsStore = [];
  var commentstorage = Map.fromIter<Key, Comments>(stable_comments.vals(), 0, Text.equal, Text.hash);

  stable var stable_activities : ActivityStore = [];
  var activitystorage = Map.fromIter<UserId, Activities>(stable_activities.vals(), 0, Principal.equal, Principal.hash);

  stable var stable_admin_activities : AdminActivityStore = [];
  var adminActivitystorage = Map.fromIter<UserId, AdminActivities>(stable_admin_activities.vals(), 0, Principal.equal, Principal.hash);

  public shared ({ caller }) func addActivity(user : UserId, target : Text, activityType : ActivityType) : async Bool {
    assert not Principal.isAnonymous(caller);
    assert Principal.isController(caller);
    assert activitystorage.size() <= MAX_ACTIVITIES;

    // assert inputComment
    try {
      let oldActivities = activitystorage.get(user);

      var newActivities = [];
      let tempActivity : Activity = {
        time = Time.now() / 1000000;
        // user = user;
        target = target;
        activity_type = activityType;
      };
      switch (oldActivities) {
        case (?isActivities) {
          // assert isActivities.size() <= MAX_ACTIVITIES_PER_USER;
          if (isActivities.size() >= MAX_ACTIVITIES_PER_USER) {
            let cutActivities = Array.subArray<Activity>(isActivities, 1, isActivities.size() - 1);
            let newActivities = Array.append<Activity>(cutActivities, [tempActivity]);
            activitystorage.put(user, newActivities);

            return true;
          } else {

            let newActivities = Array.append<Activity>(isActivities, [tempActivity]);
            activitystorage.put(user, newActivities);

            return true;
          };
        };
        case (null) {
          let initActivities = [tempActivity];
          activitystorage.put(user, initActivities);
          return true;
        };
      };
    } catch (err) {
      return false;
    };

  };
  public query ({ caller }) func getActivities() : async Result.Result<(Activities, Text), Text> {
    let maybeActivities = activitystorage.get(caller);

    switch (maybeActivities) {
      case (?activities) {
        let compare = func(a : Activity, b : Activity) : Order.Order {
          if (a.time > b.time) {
            return #less;
          } else if (a.time < b.time) {
            return #greater;
          } else {
            return #equal;
          };
        };
        // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
        let sortedActivities = Array.sort(
          activities,
          compare,
        );
        return #ok(sortedActivities, "Activities get successfully");
      };
      case (null) {
        return #err("Error while getting Activities");
      };
    };

  };
  public shared ({ caller }) func addAdminActivity(user : UserId, target : Text, activityType : AdminActivityType) : async Bool {
    assert not Principal.isAnonymous(caller);
    assert Principal.isController(caller);
    assert activitystorage.size() <= MAX_ACTIVITIES;

    // assert inputComment
    try {
      let oldActivities = adminActivitystorage.get(user);

      var newActivities = [];
      let tempActivity : AdminActivity = {
        time = Time.now() / 1000000;
        // user = user;
        target = target;
        activity_type = activityType;
      };
      switch (oldActivities) {
        case (?isActivities) {
          // assert isActivities.size() <= MAX_ACTIVITIES_PER_USER;
          if (isActivities.size() >= MAX_ACTIVITIES_PER_ADMIN) {
            let cutActivities = Array.subArray<AdminActivity>(isActivities, 1, isActivities.size() - 1);
            let newActivities = Array.append<AdminActivity>(cutActivities, [tempActivity]);
            let n = adminActivitystorage.replace(user, newActivities);

            return true;
          } else {

            let newActivities = Array.append<AdminActivity>(isActivities, [tempActivity]);
            let n = adminActivitystorage.replace(user, newActivities);

            return true;
          };
        };
        case (null) {
          let initActivities = [tempActivity];
          adminActivitystorage.put(user, initActivities);
          return true;
        };
      };
    } catch (err) {
      return false;
    };

  };
  public shared ({ caller }) func getAdminActivities(user : UserId, userCanisterId : Text) : async Result.Result<(AdminActivities, Text), Text> {
    let userCanister = actor (userCanisterId) : actor {
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;
    };
    assert await userCanister.entry_require_permission(caller, #assign_role);
    let maybeActivities = adminActivitystorage.get(user);

    switch (maybeActivities) {
      case (?activities) {
        let compare = func(a : AdminActivity, b : AdminActivity) : Order.Order {
          if (a.time > b.time) {
            return #less;
          } else if (a.time < b.time) {
            return #greater;
          } else {
            return #equal;
          };
        };
        // let sortedArray = Array.sort(newArr, func((keyA : Id, a : ListUser), (keyB : Id, b : ListUser)) { Order.fromCompare((b.creation_time - a.creation_time)) });
        let sortedActivities = Array.sort(
          activities,
          compare,
        );
        return #ok(sortedActivities, "Activities get successfully");
      };
      case (null) {
        return #err("Error while getting Activities");
      };
    };

  };
  public shared ({ caller }) func addComment(inputComment : InputComment, userCanisterId : Text, article : Text) : async Result.Result<(Comment, Text), Text> {
    assert not Principal.isAnonymous(caller);
    assert commentstorage.size() <= MAX_COMMENTS;
    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
    };
    let isUser = await userCanister.check_user_exists(caller);
    assert isUser;
    // assert inputComment
    try {

      let oldComments = commentstorage.get(article);

      var newComments = [];
      let tempComment : Comment = {
        creation_time = Time.now() / 1000000;
        user = caller;
        content = inputComment;
      };
      switch (oldComments) {
        case (?isComments) {
          assert isComments.size() <= MAX_COMMENTS_PER_ARTICLE;
          let newComments = Array.append<Comment>(isComments, [tempComment]);
          commentstorage.put(article, newComments);
          let activitied = addActivity(caller, article, #comment);
          return #ok(tempComment, "Comment added successfully");
        };
        case (null) {
          let initComments = [tempComment];
          commentstorage.put(article, initComments);
          let activitied = addActivity(caller, article, #comment);
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
    stable_activities := Iter.toArray(activitystorage.entries());
    stable_admin_activities := Iter.toArray(adminActivitystorage.entries());
    Debug.print("pre-upgrade finished.");

  };

  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    commentstorage := Map.fromIter<Key, Comments>(stable_comments.vals(), stable_comments.size(), Text.equal, Text.hash);
    stable_comments := [];

    activitystorage := Map.fromIter<UserId, Activities>(stable_activities.vals(), stable_activities.size(), Principal.equal, Principal.hash);
    stable_activities := [];

    adminActivitystorage := Map.fromIter<UserId, AdminActivities>(stable_admin_activities.vals(), stable_admin_activities.size(), Principal.equal, Principal.hash);
    stable_admin_activities := [];

    Debug.print("post-upgrade finished.");

  };

};
