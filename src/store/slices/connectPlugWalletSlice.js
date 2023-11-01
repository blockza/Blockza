const connectPlugWalletSlice = (set) => ({
  plugAddress: '',
  identity: null,
  auth: {
    state: 'initializing-auth',
    actor: null,
    client: null,
  },

  setAuth: (input) => set((state) => ({ auth: input })),
  setPlugAddress: (input) => set((state) => ({ plugAddress: input })),
  setIdentity: (input) => set((state) => ({ identity: input })),
});

export default connectPlugWalletSlice;
