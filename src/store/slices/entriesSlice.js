const entriesSlice = (set, get) => ({
  entries: [],

  setEntries: (input) => set((state) => ({ entries: input })),
});

export default entriesSlice;
