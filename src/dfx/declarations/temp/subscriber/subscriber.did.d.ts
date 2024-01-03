import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Result = {
    'ok' : [{ 'entries' : Array<Subscriber>, 'amount' : bigint }, string]
  } |
  { 'err' : string };
export type Result_1 = { 'ok' : [Subscriber, string] } |
  { 'err' : string };
export interface Subscriber { 'user' : Principal, 'subscribed_on' : bigint }
export interface anon_class_20_1 {
  'addSubscriber' : ActorMethod<[Principal, string, string], Result_1>,
  'getSubscribers' : ActorMethod<[bigint, bigint], Result>,
  'isSubscriber' : ActorMethod<[Principal], boolean>,
  'searchPaginateSubscribersByLatest' : ActorMethod<
    [Array<Subscriber>, string, string, bigint, bigint],
    { 'entries' : Array<Subscriber>, 'amount' : bigint }
  >,
  'searchSubscribers' : ActorMethod<[string, string, bigint, bigint], Result>,
}
export interface _SERVICE extends anon_class_20_1 {}
