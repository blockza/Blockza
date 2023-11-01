const entriesSlice = (set) => ({
  entries: [],

  setEntries: (input) => set((state) => ({ entries: input })),
});

export default entriesSlice;
