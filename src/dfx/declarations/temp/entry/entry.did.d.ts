import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Entry {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'seoTitle' : string,
  'promotionICP' : bigint,
  'likedUsers' : Array<Principal>,
  'imageTags' : Array<string>,
  'seoSlug' : string,
  'subscription' : boolean,
  'views' : bigint,
  'tags' : Array<string>,
  'user' : UserId,
  'minters' : Array<Principal>,
  'description' : string,
  'isPromoted' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'promotionHistory' : List,
  'pressRelease' : boolean,
  'caption' : string,
  'category' : Array<string>,
  'viewedUsers' : Array<Principal>,
  'image' : ImageObject,
  'seoDescription' : string,
  'seoExcerpt' : string,
}
export type EntryId = string;
export type EntryStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export type EntryStatus__1 = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export type ImageObject = Uint8Array | number[];
export interface InputEntry {
  'userName' : string,
  'title' : string,
  'seoTitle' : string,
  'promotionICP' : bigint,
  'imageTags' : Array<string>,
  'seoSlug' : string,
  'subscription' : boolean,
  'tags' : Array<string>,
  'description' : string,
  'isPromoted' : boolean,
  'isDraft' : boolean,
  'pressRelease' : boolean,
  'caption' : string,
  'category' : Array<string>,
  'image' : ImageObject,
  'seoDescription' : string,
  'seoExcerpt' : string,
}
export type Key = string;
export type LikeReward = bigint;
export type List = [] | [[bigint, List]];
export interface ListEntryItem {
  'creation_time' : bigint,
  'status' : EntryStatus,
  'userName' : string,
  'title' : string,
  'views' : bigint,
  'user' : UserId,
  'minters' : Array<Principal>,
  'isPromoted' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'pressRelease' : boolean,
  'category' : Array<string>,
  'image' : ImageObject,
}
export type Result = { 'ok' : [string, boolean] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [string, EntryId] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [string, Entry] } |
  { 'err' : string };
export interface RewardConfig {
  'admin' : bigint,
  'platform' : bigint,
  'master' : bigint,
}
export type UserId = Principal;
export type UserId__1 = Principal;
export interface anon_class_22_1 {
  'addCategory' : ActorMethod<[string, string], Array<string>>,
  'approveArticle' : ActorMethod<[string, string, Key, boolean], Result_2>,
  'getAllEntries' : ActorMethod<[], Array<[Key, Entry]>>,
  'getCategories' : ActorMethod<[], Array<string>>,
  'getEntriesByCategory' : ActorMethod<[string], Array<[Key, Entry]>>,
  'getEntriesList' : ActorMethod<
    [string, boolean, string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'getEntry' : ActorMethod<[Key], [] | [Entry]>,
  'getPaginatedEntries' : ActorMethod<
    [bigint, bigint],
    { 'entries' : Array<[Key, Entry]>, 'amount' : bigint }
  >,
  'getPressEntries' : ActorMethod<[], Array<[Key, Entry]>>,
  'getPromotedEntries' : ActorMethod<[bigint], Array<[Key, Entry]>>,
  'getReviewEntries' : ActorMethod<
    [string, string, EntryStatus__1, string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'getUserEntries' : ActorMethod<[UserId__1], Array<[Key, Entry]>>,
  'getUserEntriesList' : ActorMethod<
    [string, boolean, string, bigint, bigint],
    { 'entries' : Array<[Key, ListEntryItem]>, 'amount' : bigint }
  >,
  'get_like_reward' : ActorMethod<[], bigint>,
  'get_reward' : ActorMethod<[], RewardConfig>,
  'insertEntry' : ActorMethod<
    [InputEntry, string, boolean, string, string],
    Result_1
  >,
  'isMinted' : ActorMethod<[Key], boolean>,
  'likeEntry' : ActorMethod<[Key, string, string], Result>,
  'mintEntry' : ActorMethod<[Key, string], Result>,
  'update_like_reward' : ActorMethod<[string, LikeReward], LikeReward>,
  'update_reward' : ActorMethod<[string, RewardConfig], RewardConfig>,
}
export interface _SERVICE extends anon_class_22_1 {}
