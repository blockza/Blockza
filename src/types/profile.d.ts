export interface User {
  name: string;
  email: string;
  website: string;
  dob: string;
  gender: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  authorInfo: string;
  authorTitle: string;
  authorDescription: string;
  joinedFrom: number;
  bannerImg: File | null;
  profileImg: File | null;
}
export interface ListUser {
  0: string;
  1: {
    name: string;
    email: [string];
    joinedFrom: number;
    isBlocked: boolean;
  };
}
export interface Roles {
  authorized?: null;
  user_admin?: null;
  article_admin?: null;
  sub_admin?: null;
}
export interface ActivityType {
  subscribe?: null;
  like?: null;
  comment?: null;
  create?: null;
}
export interface AdminActivityType {
  block?: null;
  unBlock?: null;
  approve?: null;
  reject?: null;
}
export interface Activity {
  target: string;
  time: BigInt;
  user: [];
  activity_type: ActivityType;
  title: string;
  target: string;
  isPromoted: boolean;
  // wasPromote: boolean;
}
export interface AdminActivity {
  target: string;
  time: BigInt;
  user: [any];
  activity_type: AdminActivityType;
  name: string;
  isPromoted: boolean;
}
export interface RefinedActivity {
  message: string;
  date: string;
  time: string;
  title: strring;
  target: string;
  isPromoted: boolean;
  // wasPromote: boolean;
}
export interface RefinedAdminActivity {
  message: string;
  date: string;
  time: string;
  target: string;
  name: string;
  isPromoted: boolean;
}
