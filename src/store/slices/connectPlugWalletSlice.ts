import { ConnectPlugWalletSlice } from '@/types/store';

const connectPlugWalletSlice = (
  set: (fn: (state: ConnectPlugWalletSlice) => ConnectPlugWalletSlice) => void,
  get: () => ConnectPlugWalletSlice
) => ({
  identity: null,
  principal: '',
  reward: null,
  balance: null,
  auth: {
    state: 'initializing-auth',
    actor: null,
    client: null,
    isLoading: true,
  },
  userAuth: {
    name: '',
    status: false,
    role: '',
    principalText: '',
    principalArray: null,
  },

  setAuth: (input: any): void =>
    set((state) => ({
      ...state,
      auth: input,
    })),

  setIdentity: (input: any): void =>
    set((state) => ({
      ...state,
      identity: input,
    })),
  setReward: (input: any): void =>
    set((state) => ({
      ...state,
      reward: input,
    })),
  setBalance: (input: any): void =>
    set((state) => ({
      ...state,
      balance: input,
    })),

  setPrincipal: (input: any): void =>
    set((state) => ({
      ...state,
      principal: input,
    })),

  setUserAuth: (input: any): void =>
    set((state) => ({
      ...state,
      userAuth: input,
    })),
});

export default connectPlugWalletSlice;
