import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Result = { 'ok' : [Subscribers, string] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [Subscriber, string] } |
  { 'err' : string };
export interface Subscriber { 'user' : Principal, 'subscribed_on' : bigint }
export type Subscribers = Array<Subscriber>;
export interface anon_class_18_1 {
  'addSubscriber' : ActorMethod<[Principal, string, string], Result_1>,
  'getSubscribers' : ActorMethod<[], Result>,
  'isSubscriber' : ActorMethod<[Principal], boolean>,
}
export interface _SERVICE extends anon_class_18_1 {}
