import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'ZeroAddress' : null } |
  { 'InvalidTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : null };
export interface CanisterStatus {
  'storage_memory_used' : bigint,
  'controllers' : Array<Principal>,
  'storage_daily_burn' : bigint,
  'storage_balance' : bigint,
  'nft_balance' : bigint,
}
export type CreationError = { 'notenoughcycles' : null } |
  { 'awaitingid' : null };
export interface Dip721NFT {
  'addCustodian' : ActorMethod<[Principal], Result>,
  'balanceOfDip721' : ActorMethod<[Principal], bigint>,
  'create_storage_canister' : ActorMethod<[boolean], Result_3>,
  'getMaxLimitDip721' : ActorMethod<[], number>,
  'getMetadataDip721' : ActorMethod<[TokenId], MetadataResult>,
  'getMetadataForUserDip721' : ActorMethod<[Principal], ExtendedMetadataResult>,
  'getTokenIdsForUserDip721' : ActorMethod<
    [Principal],
    BigUint64Array | bigint[]
  >,
  'get_status' : ActorMethod<[], Result_2>,
  'get_storage_canister_id' : ActorMethod<[], Result_1>,
  'init_storage_controllers' : ActorMethod<[], Result>,
  'isCustodian' : ActorMethod<[], string>,
  'logoDip721' : ActorMethod<[], LogoResult>,
  'mintDip721' : ActorMethod<[Principal, MetadataDesc], MintReceipt>,
  'nameDip721' : ActorMethod<[], string>,
  'ownerOfDip721' : ActorMethod<[TokenId], OwnerResult>,
  'safeTransferFromDip721' : ActorMethod<
    [Principal, Principal, TokenId],
    TxReceipt
  >,
  'set_storage_canister_id' : ActorMethod<[Principal], Result>,
  'supportedInterfacesDip721' : ActorMethod<[], Array<InterfaceId>>,
  'symbolDip721' : ActorMethod<[], string>,
  'totalSupplyDip721' : ActorMethod<[], bigint>,
  'transferFromDip721' : ActorMethod<
    [Principal, Principal, TokenId],
    TxReceipt
  >,
}
export type ExtendedMetadataResult = {
    'Ok' : { 'token_id' : TokenId, 'metadata_desc' : MetadataDesc }
  } |
  { 'Err' : ApiError };
export type InterfaceId = { 'Burn' : null } |
  { 'Mint' : null } |
  { 'Approval' : null } |
  { 'TransactionHistory' : null } |
  { 'TransferNotification' : null };
export interface LogoResult { 'data' : string, 'logo_type' : string }
export type MetadataDesc = Array<MetadataPart>;
export interface MetadataKeyVal { 'key' : string, 'val' : MetadataVal }
export interface MetadataPart {
  'data' : Uint8Array | number[],
  'key_val_data' : Array<MetadataKeyVal>,
  'purpose' : MetadataPurpose,
}
export type MetadataPurpose = { 'Preview' : null } |
  { 'Rendered' : null };
export type MetadataResult = { 'Ok' : MetadataDesc } |
  { 'Err' : ApiError };
export type MetadataVal = { 'Nat64Content' : bigint } |
  { 'Nat32Content' : number } |
  { 'Nat8Content' : number } |
  { 'NatContent' : bigint } |
  { 'Nat16Content' : number } |
  { 'BlobContent' : Uint8Array | number[] } |
  { 'TextContent' : string };
export type MintReceipt = { 'Ok' : MintReceiptPart } |
  { 'Err' : ApiError };
export interface MintReceiptPart { 'id' : bigint, 'token_id' : TokenId }
export type OwnerResult = { 'Ok' : Principal } |
  { 'Err' : ApiError };
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : { 'nostorageid' : null } | { 'awaitingid' : null } };
export type Result_2 = { 'ok' : CanisterStatus } |
  { 'err' : string };
export type Result_3 = { 'ok' : string } |
  { 'err' : CreationError };
export type TokenId = bigint;
export type TxReceipt = { 'Ok' : bigint } |
  { 'Err' : ApiError };
export interface _SERVICE extends Dip721NFT {}
