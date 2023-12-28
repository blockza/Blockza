import { Principal } from '@dfinity/principal';

interface Auth {
  state: string;
  actor: Actor | null;
  client: AuthClient | null;
}
export interface UserPermissions {
  userManagement: boolean;
  articleManagement: boolean;
  adminManagement: boolean;
}

interface UserAuth {
  name: string;
  status: boolean;
  role: string;
  principalText: string;
  principalArray: null | Principal;
  userPerms: null | UserPermissions;
}
export interface Wallet {
  balance: number;
  reward: number;
}
export interface ConnectStore {
  identity: any;
  principal: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  reward: number;
  setIdentity: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setPrincipal: (input: string) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
}

export interface ConnectPlugWalletSlice {
  identity: any;
  principal: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  reward: number;
  setIdentity: (input: any) => void;
  setPrincipal: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
}
