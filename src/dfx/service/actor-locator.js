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
import {
  createActor as createCommentActor,
  canisterId as commentCanisterId,
} from '@/dfx/declarations/comment';
import {
  createActor as createSubscriberActor,
  canisterId as subscriberCanisterId,
} from '@/dfx/declarations/subscriber';
import {
  createActor as createIcpLedgerCanister,
  canisterId as icpLedgerCanisterCanisterId,
} from '@/dfx/declarations/icp_ledger_canister';
import {
  createActor as createDIP721Canister,
  canisterId as DIP721CanisterId,
} from '@/dfx/declarations/DIP721';
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
export function makeCommentActor(options) {
  return makeActor(commentCanisterId, createCommentActor, options);
}
export function makeSubscriberActor(options) {
  return makeActor(subscriberCanisterId, createSubscriberActor, options);
}
export function makeLedgerCanister(options) {
  return makeActor(
    icpLedgerCanisterCanisterId,
    createIcpLedgerCanister,
    options
  );
}
export function makeDIP721Canister(options) {
  return makeActor(
    DIP721CanisterId,
    createDIP721Canister,
    options
  );
}
