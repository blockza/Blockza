const themeSlice = (set, get) => ({
  isBlack: false,
  isOpen: '',

  setIsBlack: (input) => set((state) => ({ isBlack: input })),
  setIsOpen: (input) => set((state) => ({ isOpen: input })),
});

export default themeSlice;
