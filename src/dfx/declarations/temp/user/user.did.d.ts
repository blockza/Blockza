import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Id = Principal;
export type ImageObject = Uint8Array | number[];
export type ImageObject__1 = Uint8Array | number[];
export interface InputUser {
  'dob' : string,
  'authorDescription' : string,
  'linkedin' : string,
  'twitter' : string,
  'instagram' : string,
  'name' : string,
  'authorInfo' : string,
  'email' : string,
  'website' : string,
  'facebook' : string,
  'gender' : string,
  'bannerImg' : [] | [ImageObject],
  'authorTitle' : string,
  'profileImg' : [] | [ImageObject],
}
export interface ListAdminUser {
  'name' : [] | [string],
  'role' : Role,
  'email' : [] | [string],
  'joinedFrom' : bigint,
}
export interface ListUser {
  'isBlocked' : boolean,
  'name' : [] | [string],
  'email' : [] | [string],
  'joinedFrom' : bigint,
}
export type Permission = { 'assign_role' : null } |
  { 'manage_user' : null } |
  { 'manage_article' : null } |
  { 'write' : null };
export type Result = { 'ok' : [string, User, [] | [User]] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [string, User] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [string, User, boolean] } |
  { 'err' : string };
export interface Reward {
  'creation_time' : bigint,
  'claimed_at' : [] | [bigint],
  'isClaimed' : boolean,
  'amount' : bigint,
}
export type Rewards = Array<Reward>;
export type Role = { 'admin' : null } |
  { 'article_admin' : null } |
  { 'authorized' : null } |
  { 'user_admin' : null } |
  { 'sub_admin' : null };
export type Role__1 = { 'admin' : null } |
  { 'article_admin' : null } |
  { 'authorized' : null } |
  { 'user_admin' : null } |
  { 'sub_admin' : null };
export interface User {
  'dob' : [] | [string],
  'authorDescription' : [] | [string],
  'linkedin' : [] | [string],
  'twitter' : [] | [string],
  'instagram' : [] | [string],
  'isBlocked' : boolean,
  'name' : [] | [string],
  'authorInfo' : [] | [string],
  'role' : Role,
  'email' : [] | [string],
  'website' : [] | [string],
  'facebook' : [] | [string],
  'joinedFrom' : bigint,
  'gender' : [] | [string],
  'rewards' : Rewards,
  'bannerImg' : [] | [ImageObject],
  'authorTitle' : [] | [string],
  'profileImg' : [] | [ImageObject],
}
export type UserId = [] | [string];
export interface anon_class_20_1 {
  'add_reward' : ActorMethod<[Principal, bigint], boolean>,
  'add_user' : ActorMethod<[], Result_1>,
  'assign_role' : ActorMethod<[Principal, string, Role__1], Result_1>,
  'block_user' : ActorMethod<[string, string], Result_1>,
  'check_user_exists' : ActorMethod<[Principal], boolean>,
  'claim_rewards' : ActorMethod<[string], boolean>,
  'entry_require_permission' : ActorMethod<[Principal, Permission], boolean>,
  'get_authorized_users' : ActorMethod<
    [string, bigint, bigint],
    { 'users' : Array<[Id, ListUser]>, 'amount' : bigint }
  >,
  'get_subAdmin_users' : ActorMethod<
    [string, bigint, bigint],
    { 'users' : Array<[Id, ListAdminUser]>, 'amount' : bigint }
  >,
  'get_user_details' : ActorMethod<[UserId], Result_2>,
  'get_user_name' : ActorMethod<
    [Principal],
    [] | [{ 'name' : [] | [string], 'image' : [] | [ImageObject__1] }]
  >,
  'make_admin' : ActorMethod<[Principal, Role__1], boolean>,
  'unBlock_user' : ActorMethod<[string, string], Result_1>,
  'update_user' : ActorMethod<[InputUser], Result>,
}
export interface _SERVICE extends anon_class_20_1 {}
