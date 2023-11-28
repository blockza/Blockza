import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Entry {
  'creation_time' : bigint,
  'title' : string,
  'seoTitle' : string,
  'promotionICP' : number,
  'likedUsers' : Array<Principal>,
  'seoSlug' : string,
  'subscription' : boolean,
  'views' : bigint,
  'user' : UserId,
  'minters' : Array<Principal>,
  'description' : string,
  'isPromoted' : boolean,
  'likes' : bigint,
  'isDraft' : boolean,
  'category' : Array<string>,
  'viewedUsers' : Array<Principal>,
  'image' : ImageObject,
  'seoDescription' : string,
  'seoExcerpt' : string,
}
export type EntryId = string;
export type ImageObject = Uint8Array | number[];
export interface InputEntry {
  'title' : string,
  'seoTitle' : string,
  'promotionICP' : number,
  'seoSlug' : string,
  'subscription' : boolean,
  'description' : string,
  'isPromoted' : boolean,
  'isDraft' : boolean,
  'category' : Array<string>,
  'image' : ImageObject,
  'seoDescription' : string,
  'seoExcerpt' : string,
}
export type Key = string;
export interface ListEntryItem {
  'creation_time' : bigint,
  'title' : string,
  'views' : bigint,
  'user' : UserId,
  'minters' : Array<Principal>,
  'likes' : bigint,
  'isDraft' : boolean,
  'category' : Array<string>,
  'image' : ImageObject,
}
export type Result = { 'ok' : [string, boolean] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [string, EntryId] } |
  { 'err' : string };
export type UserId = Principal;
export type UserId__1 = Principal;
export interface anon_class_17_1 {
  'getAllEntries' : ActorMethod<[], Array<[Key, Entry]>>,
  'getCategories' : ActorMethod<[], Array<string>>,
  'getEntriesByCategory' : ActorMethod<[string], Array<[Key, Entry]>>,
  'getEntriesList' : ActorMethod<[string], Array<[Key, ListEntryItem]>>,
  'getEntry' : ActorMethod<[Key], [] | [Entry]>,
  'getPromotedEntries' : ActorMethod<[], Array<[Key, Entry]>>,
  'getUserEntries' : ActorMethod<[UserId__1], Array<[Key, Entry]>>,
  'getUserEntriesList' : ActorMethod<
    [string, boolean],
    Array<[Key, ListEntryItem]>
  >,
  'insertEntry' : ActorMethod<[InputEntry, string, boolean, string], Result_1>,
  'isMinted' : ActorMethod<[Key], boolean>,
  'likeEntry' : ActorMethod<[Key, string], Result>,
  'mintEntry' : ActorMethod<[Key], Result>,
}
export interface _SERVICE extends anon_class_17_1 {}
