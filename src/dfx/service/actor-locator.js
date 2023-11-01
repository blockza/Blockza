import {
  createActor as createEntryActor,
  canisterId as entryCanisterId,
} from '@/dfx/declarations/entry';
import {
  createActor as createCollectionActor,
  canisterId as collectionCanisterId,
} from '@/dfx/declarations/collection';

import {
  createActor as createUserActor,
  canisterId as userCanisterId,
} from '@/dfx/declarations/user';

export const makeActor = (canisterId, createActor, options) => {
  let dfd;
  const NFTCanisterId =
    process.env.CANISTER_ID_NFTSTUDIO24 ||
    process.env.NEXT_PUBLIC_NFTSTUDIO24_CANISTER_ID;
  const hostOptions = {
    host:
      process.env.DFX_NETWORK === 'ic'
        ? `https://${NFTCanisterId}.ic0.app`
        : 'http://localhost:8000',
  };
  if (!options) {
    options = {
      agentOptions: hostOptions,
    };
  } else if (!options.agentOptions) {
    options.agentOptions = hostOptions;
  } else {
    options.agentOptions.host = hostOptions.host;
  }
  return createActor(canisterId, options);
};

export function makeEntryActor(options) {
  return makeActor(entryCanisterId, createEntryActor, options);
}
export function makeCollectionActor() {
  return makeActor(collectionCanisterId, createCollectionActor);
}
export function makeUserActor(options) {
  return makeActor(userCanisterId, createUserActor, options);
}
