// Import base modules
import AssocList "mo:base/AssocList";
import Error "mo:base/Error";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Bool "mo:base/Bool";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import ImageType "../model/ImageType";
shared ({ caller = initializer }) actor class () {

  private let MAX_USERS = 1_000;
  private let MAX_NAME_CHARS = 40;
  private let MAX_BIO_CHARS = 140;
  private let MAX_LINK_CHARS = 2048;
  private let MAX_EMAIL_CHARS = 320;

  type ImageObject = ImageType.ImageObject;
  type Reward = {
    isClaimed : Bool;
    creation_time : Int;
  };
  type Rewards = [Reward];
  public type User = {
    profileImg : ?ImageObject;
    bannerImg : ?ImageObject;
    name : ?Text;
    email : ?Text;
    website : ?Text;
    dob : ?Text;
    gender : ?Text;
    facebook : ?Text;
    twitter : ?Text;
    instagram : ?Text;
    linkedin : ?Text;
    authorInfo : ?Text;
    authorTitle : ?Text;
    authorDescription : ?Text;
    joinedFrom : Int;
    rewards : Rewards;

    // // subscribers : ?Nat;
  };
  public type InputUser = {
    profileImg : ?ImageObject;
    bannerImg : ?ImageObject;
    name : Text;
    email : Text;
    website : Text;
    dob : Text;
    gender : Text;
    facebook : Text;
    twitter : Text;
    instagram : Text;
    linkedin : Text;
    authorInfo : Text;
    authorTitle : Text;
    authorDescription : Text;
    // // subscribers : ?Nat;
  };
  public type UserId = ?Text;
  private var sectek = "#cosa@erwe0ss1s<e}s*dfCc<e>c!dwa)<vvde>";

  public type Id = Principal;
  type Users = [(Id, User)];

  // private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
  // private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

  stable var stable_users : Users = [];

  var userStorage = Map.fromIter<Id, User>(stable_users.vals(), stable_users.size(), Principal.equal, Principal.hash);

  func emailExists(email : Text) : Bool {
    // let users = Map.HashMap.entries<Id, User>(userStorage);
    for ((_, user) : (Id, User) in userStorage.entries()) {
      switch (user.email) {
        case (?userEmail) {
          if (userEmail == email) {
            return true;
          };
        };
        case null {};
      };
    };
    return false;
  };

  public shared ({ caller }) func add_user() : async Result.Result<(Text, User), Text> {
    // Return error if the user already exists
    if (is_user(caller) != null) {
      let user = userStorage.get(caller);
      switch user {
        case (?iuser) {
          return #ok("Already a User", iuser);
        };
        case (null) {
          return #err("Error while getting user");
        };
      };
    };
    let currentTime = Time.now();
    let lastFourDigits = currentTime % 10000; // This gives us the last four digits
    let textNumber = Int.toText(lastFourDigits);
    let result = "User" # textNumber;
    // Create new user with default name
    var tempUser = {
      profileImg = null;
      bannerImg = null;
      name = ?result;
      email = null;
      website = null;
      dob = null;
      gender = null;
      facebook = null;
      twitter = null;
      instagram = null;
      linkedin = null;
      authorInfo = null;
      authorTitle = null;
      authorDescription = null;
      joinedFrom = (Time.now() / 1000000);
      rewards = [];
      // subscribers = ?0;
    };

    userStorage.put(caller, tempUser);
    return #ok("User added successfuly", tempUser);
  };

  // Check if the user exists
  func is_user(caller : Principal) : ?User {
    assert not Principal.isAnonymous(caller);

    let user = userStorage.get(caller);
    return user;
  };
  public func check_user_exists(caller : Principal) : async Bool {
    let user = userStorage.get(caller);
    return user != null;
  };

  // Check the length
  func check_length(text : Text, length : Nat) : Bool {
    return text.size() <= length;
  };

  // Get User details by the caller
  public query ({ caller }) func get_user_details(userId : UserId) : async Result.Result<(Text, User, Bool), Text> {
    // assert is_user(userId) != null;
    var userPrincipal : Principal = caller;
    Debug.print(debug_show (caller));
    switch userId {
      case (?isUserId) {
        userPrincipal := Principal.fromText(isUserId);
        let user = userStorage.get(userPrincipal);

        switch user {
          case (?iuser) {
            return #ok("User get by id Successful", iuser, userPrincipal == caller);
          };
          case (null) {
            return #err("User not found");

          };
        };
      };
      case (null) {
        let user = userStorage.get(caller);

        switch user {
          case (?iuser) {
            return #ok("User get by Caller Successful", iuser, true);
          };
          case (null) {
            return #err("User not found");

          };
        };

      };
    };
    Debug.print(debug_show (userId, caller));

    // let user = userStorage.get(caller);

    return #err("Something went wrong while getting user");
  };
  // Get User details by user passed as parameter
  public query func get_other_user_details(caller : Principal) : async Result.Result<(Text, User), Text> {
    // assert is_user(caller) != null;
    let user = userStorage.get(caller);
    switch user {
      case (?iuser) {
        return #ok("User get Successful", iuser);
      };
      case (null) {
        return #err("User does not exists");
      };
    };
  };

  // Edit User details by the caller
  public shared ({ caller }) func update_user(user : InputUser) : async Result.Result<(Text, User, ?User), Text> {
    let oldUser = is_user(caller);
    assert oldUser != null;
    var tempRewareds : Rewards = [];

    switch (oldUser) {
      case (?isOldUser) {
        tempRewareds := isOldUser.rewards;
        switch (isOldUser.email) {
          case (?email) {
            if (user.email != email) {
              let isEmail = emailExists(user.email);
              if (isEmail) {
                return #err("Email Already Exists");

              };
            };
          };
          case (null) {};
        };
      };
      case (null) {
        return #err("error while updating user");
      };
    };

    // var tempName = "";
    // var tempBio = "";
    // var tempExternalLink = "";
    // var tempTwitter = "";
    // var tempEmail = "";
    var tempName = "";
    var tempEmail = "";
    var tempWebsite = "";
    var tempDob = "";
    var tempGender = "";
    var tempFacebook = "";
    var tempTwitter = "";
    var tempInstagram = "";
    var tempLinekdin = "";
    var tempAuthorInfo = "";
    var tempAuthorTitle = "";
    var tempAuthorDescription = "";
    var tempProfileImg : ?ImageObject = null;
    var tempBannerImg : ?ImageObject = null;
    var tempJoinedFrom : Int = 0;

    // assert user.bio.size() <= MAX_BIO_CHARS;
    // tempBio := user.bio;
    // assert user.externalLink.size() <= MAX_LINK_CHARS;
    // tempExternalLink := user.externalLink;
    assert user.name.size() <= MAX_NAME_CHARS;
    assert user.name.size() >= 3;
    tempName := user.name;

    assert user.email.size() <= MAX_EMAIL_CHARS;
    tempEmail := user.email;

    assert user.website.size() <= MAX_LINK_CHARS;
    tempWebsite := user.website;

    assert user.dob.size() <= MAX_NAME_CHARS;
    tempDob := user.dob;

    assert user.gender.size() <= MAX_NAME_CHARS;
    tempGender := user.gender;

    assert user.facebook.size() <= MAX_LINK_CHARS;
    tempFacebook := user.facebook;

    assert user.twitter.size() <= MAX_LINK_CHARS;
    tempTwitter := user.twitter;

    assert user.instagram.size() <= MAX_LINK_CHARS;
    tempInstagram := user.instagram;

    assert user.linkedin.size() <= MAX_LINK_CHARS;
    tempLinekdin := user.linkedin;

    assert user.authorInfo.size() <= MAX_BIO_CHARS;
    tempAuthorInfo := user.authorInfo;

    assert user.authorTitle.size() <= MAX_NAME_CHARS;
    tempAuthorTitle := user.authorTitle;

    assert user.authorDescription.size() <= MAX_BIO_CHARS;
    tempAuthorDescription := user.authorDescription;

    if (user.bannerImg != null) {
      tempBannerImg := user.bannerImg;

    } else {
      switch (oldUser) {
        case (?isUser) {
          tempBannerImg := isUser.bannerImg;
        };
        case (null) {};

      };
    };
    if (user.profileImg != null) {
      tempProfileImg := user.profileImg;
    } else {
      switch (oldUser) {
        case (?isUser) {
          tempProfileImg := isUser.profileImg;
        };
        case (null) {

        };

      };
    };

    switch oldUser {
      case (?isUser) {
        tempJoinedFrom := isUser.joinedFrom;
      };
      case (null) {
        return #err("Error while updating joined date");
      };
    };

    var tempUser = {
      name = ?tempName;
      email = ?tempEmail;
      website = ?tempWebsite;
      dob = ?tempDob;
      gender = ?tempGender;
      facebook = ?tempFacebook;
      twitter = ?tempTwitter;
      instagram = ?tempInstagram;
      linkedin = ?tempLinekdin;
      authorInfo = ?tempAuthorInfo;
      authorTitle = ?tempAuthorTitle;
      authorDescription = ?tempAuthorDescription;
      profileImg = tempProfileImg;
      bannerImg = tempBannerImg;
      joinedFrom = tempJoinedFrom;
      rewards = tempRewareds;
    };
    let beforeUser = userStorage.replace(caller, tempUser);
    return #ok("User Updated Successfuly", tempUser, beforeUser)

  };
  public shared func add_reward(caller : Principal, key : Text) : async Bool {
    let oldUser = is_user(caller);
    assert oldUser != null;
    if (not (key == sectek)) {
      return false;
    };
    switch (oldUser) {
      case (?isUser) {
        let oldRewards = isUser.rewards;
        let newReward : Reward = {
          creation_time = Time.now() / 1000000;
          isClaimed = false;
        };
        let newRewards : Rewards = Array.append(oldRewards, [newReward]);
        var tempUser = {
          name = isUser.name;
          email = isUser.email;
          website = isUser.website;
          dob = isUser.dob;
          gender = isUser.gender;
          facebook = isUser.facebook;
          twitter = isUser.twitter;
          instagram = isUser.instagram;
          linkedin = isUser.linkedin;
          authorInfo = isUser.authorInfo;
          authorTitle = isUser.authorTitle;
          authorDescription = isUser.authorDescription;
          profileImg = isUser.profileImg;
          bannerImg = isUser.bannerImg;
          joinedFrom = isUser.joinedFrom;
          rewards = newRewards;
        };
        let newEntry = userStorage.replace(caller, tempUser);
        return true;
      };
      case (null) {
        return false;

      };
    };
  };
  system func preupgrade() {
    stable_users := Iter.toArray(userStorage.entries());

  };

  system func postupgrade() {
    userStorage := Map.fromIter<Id, User>(stable_users.vals(), stable_users.size(), Principal.equal, Principal.hash);
    stable_users := [];
  };
};
