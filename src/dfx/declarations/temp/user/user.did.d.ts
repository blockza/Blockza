import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ImageObject = Uint8Array | number[];
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
export type Result = { 'ok' : [string, User, [] | [User]] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [string, User, boolean] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [string, User] } |
  { 'err' : string };
export interface Reward { 'creation_time' : bigint, 'isClaimed' : boolean }
export type Rewards = Array<Reward>;
export interface User {
  'dob' : [] | [string],
  'authorDescription' : [] | [string],
  'linkedin' : [] | [string],
  'twitter' : [] | [string],
  'instagram' : [] | [string],
  'name' : [] | [string],
  'authorInfo' : [] | [string],
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
export interface anon_class_15_1 {
  'add_reward' : ActorMethod<[], boolean>,
  'add_user' : ActorMethod<[], Result_2>,
  'check_user_exists' : ActorMethod<[Principal], boolean>,
  'get_other_user_details' : ActorMethod<[Principal], Result_2>,
  'get_user_details' : ActorMethod<[UserId], Result_1>,
  'update_user' : ActorMethod<[InputUser], Result>,
}
export interface _SERVICE extends anon_class_15_1 {}
