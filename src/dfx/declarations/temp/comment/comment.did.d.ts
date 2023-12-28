import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Activities = Array<Activity>;
export interface Activity {
  'activity_type' : ActivityType,
  'time' : bigint,
  'target' : string,
}
export type ActivityType = { 'subscribe' : null } |
  { 'like' : null } |
  { 'create' : null } |
  { 'comment' : null };
export type AdminActivities = Array<AdminActivity>;
export interface AdminActivity {
  'activity_type' : AdminActivityType,
  'time' : bigint,
  'target' : string,
}
export type AdminActivityType = { 'reject' : null } |
  { 'unBlock' : null } |
  { 'approve' : null } |
  { 'block' : null };
export interface Comment {
  'creation_time' : bigint,
  'content' : string,
  'user' : Principal,
}
export type Comments = Array<Comment>;
export type InputComment = string;
export type Result = { 'ok' : [Comments, string] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [AdminActivities, string] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [Activities, string] } |
  { 'err' : string };
export type Result_3 = { 'ok' : [Comment, string] } |
  { 'err' : string };
export type UserId = Principal;
export interface anon_class_19_1 {
  'addActivity' : ActorMethod<[UserId, string, ActivityType], boolean>,
  'addAdminActivity' : ActorMethod<
    [UserId, string, AdminActivityType],
    boolean
  >,
  'addComment' : ActorMethod<[InputComment, string, string], Result_3>,
  'getActivities' : ActorMethod<[], Result_2>,
  'getAdminActivities' : ActorMethod<[UserId, string], Result_1>,
  'getComments' : ActorMethod<[string], Result>,
}
export interface _SERVICE extends anon_class_19_1 {}
