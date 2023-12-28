import { create } from 'zustand';
import connectPlugWalletSlice from './slices/connectPlugWalletSlice';
import entriesSlice from './slices/entriesSlice';
import themeSlice from './slices/themeSlice';
interface ThemeStore {
  isBlack: boolean;
  isOpen: string;

  setIsBlack: (input: boolean) => void;
  setIsOpen: (input: string) => void;
}

const useConnectPlugWalletStore = create<ReturnType<any>>()((set, get) => ({
  ...connectPlugWalletSlice(set, get),
}));
const useEntriesStore = create((set, get) => ({
  ...entriesSlice(set, get),
}));
const useThemeStore = create<ThemeStore>((set, get) => ({
  ...themeSlice(set, get),
}));

export { useConnectPlugWalletStore, useEntriesStore, useThemeStore };
