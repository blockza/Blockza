export interface Entry {
  0: number;
  1: {
    user: number;
    title: string;
    image: any;
    description: string;
    creation_time: number;
  };
}
export interface RawEntry {
  0: {
    user: number;
    title: string;
    image: any;
    description: string;
    creation_time: floanumbert;
  };
}
export interface RawCollection {
  user: number;
  name: string;
  image: any;
  description: string;
  creation_time: floanumbert;
}
export interface CollectionObject {
  0: string;
  1: RawCollection;
}
export interface EntrySizeMap {
  All: string;
  Minted: string;
  Draft: string;
  Mine: string;
  [key: string]: string; // Add this index signature
}

export interface EntriesSizeObject {
  all: string;
  draft: string;
  user: string;
  [key: string]: string; // Add this index signature
}
