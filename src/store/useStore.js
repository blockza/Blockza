import { create } from 'zustand';
import connectPlugWalletSlice from './slices/connectPlugWalletSlice';
import entriesSlice from './slices/entriesSlice';
import themeSlice from './slices/themeSlice';

const useConnectPlugWalletStore = create((set, get) => ({
  ...connectPlugWalletSlice(set, get),
}));
const useEntriesStore = create((set, get) => ({
  ...entriesSlice(set, get),
}));
const useThemeStore = create((set, get) => ({
  ...themeSlice(set, get),
}));

export { useConnectPlugWalletStore, useEntriesStore, useThemeStore };
