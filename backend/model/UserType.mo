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

module UserType {
  type ImageObject = ImageType.ImageObject;
  public type UserId = ?Text;
  public type Id = Principal;

  public type Reward = {
    isClaimed : Bool;
    creation_time : Int;
    claimed_at : ?Int;
    amount : Nat;
  };
  public type Rewards = [Reward];
  public type EntryId = Text;
  public type Role = {
    #admin;
    #sub_admin;
    #user_admin;
    #article_admin;
    #authorized;
  };
  public type Permission = {
    #assign_role;
    #manage_user;
    #manage_article;
    #write;
  };
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
    role : Role;
    isBlocked : Bool;
  };
  public type ListUser = {
    name : ?Text;
    email : ?Text;
    joinedFrom : Int;
    isBlocked : Bool;
  };
  public type ListAdminUser = {
    name : ?Text;
    email : ?Text;
    joinedFrom : Int;
    role : Role;
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
  };
  public type Users = [(Id, User)];
  public type ListUsers = [(Id, ListUser)];
  public type ListAdminUsers = [(Id, ListAdminUser)];
  public type ActivityType = {
    #like;
    #comment;
    #subscribe;
    #create;
  };
  public type AdminActivityType = {
    #block;
    #unBlock;
    #approve;
    #reject;
  };
  public type SubAccount = Blob;
  public type Icrc1Timestamp = Nat64;
  public type Icrc1Tokens = Nat;
  public type Icrc1BlockIndex = Nat;

  public type Account = {
    owner : Principal;
    subaccount : ?SubAccount;
  };
  public type TransferFromArgs = {
    spender_subaccount : ?SubAccount;
    from : Account;
    to : Account;
    amount : Icrc1Tokens;
    fee : ?Icrc1Tokens;
    memo : ?Blob;
    created_at_time : ?Icrc1Timestamp;
  };
  public type TransferFromResult = {
    #Ok : Icrc1BlockIndex;
    #Err : TransferFromError;
  };

  public type TransferFromError = {
    #BadFee : { expected_fee : Icrc1Tokens };
    #BadBurn : { min_burn_amount : Icrc1Tokens };
    #InsufficientFunds : { balance : Icrc1Tokens };
    #InsufficientAllowance : { allowance : Icrc1Tokens };
    #TooOld;
    #CreatedInFuture : { ledger_time : Icrc1Timestamp };
    #Duplicate : { duplicate_of : Icrc1BlockIndex };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  public let MASTER_WALLET = "og5g4-dvvdy-behql-zqoz5-f2qjs-x4nke-k5spr-q7ngf-7ia7a-h4jaj-yae";
  public let PLATFORM_WALLET = "4o3sf-5uho3-wjwrb-4psji-hucud-jzdi5-mrbzs-ooom5-5cyep-fkr4m-fqe";
  public let ADMIN_WALLET = "wxk6k-c7r5a-sqg2h-zf4hv-cuwsv-eecys-rhuvf-ihde5-lgadl-sfakr-nae";
};
