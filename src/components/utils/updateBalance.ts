import { E8S } from '@/constant/config';
import { makeLedgerCanister } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Auth, ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { create } from 'zustand';

interface Props {
  identity: any;
  auth: Auth;
  setBalance: (input: number) => void;
}
export default function updateBalance({ identity, auth, setBalance }: Props) {
  const getBalance = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    let ledgerActor = makeLedgerCanister({
      agentOptions: {
        identity,
      },
    });

    let acc: any = AccountIdentifier.fromPrincipal({
      principal: identity.getPrincipal(),
      // subAccount: identity.getPrincipal(),
    });
    let res = await ledgerActor.account_balance({
      account: acc.bytes,
    });
    let balance = parseInt(res.e8s) / E8S;
    logger(balance, 'UPdated balance');
    setBalance(balance);
  };
  getBalance();
}
