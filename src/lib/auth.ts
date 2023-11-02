import { makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Actor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { JsonnableDelegationChain } from '@dfinity/identity';
import React from 'react';

interface AuthState {
  state: string;
  actor: Actor | null;
  client: AuthClient | null;
}
interface methodsProps {
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<object>>;
  auth: AuthState;
  client?: AuthClient;
  handleClose?: () => void;
}
interface initProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<object>>;
  auth: AuthState;
  // client: AuthClient | null;
  // handleClose: () => void;
}
interface loginProps {
  // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<object>>;
  auth: AuthState;
  // client: AuthClient | null;
  handleClose: () => void;
}
interface authProps {
  setAuth: React.Dispatch<React.SetStateAction<object>>;
  auth: AuthState;
  client: AuthClient;
}

interface timeoutProps {
  setAuth: React.Dispatch<React.SetStateAction<object>>;
  auth: AuthState;
}
const authMethods = ({
  setIsLoading,
  setAuth,
  auth,
  handleClose,
  client,
}: methodsProps) => {
  //
  const initAuth = async () => {
    const client = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // set to 30 minutes
        disableDefaultIdleCallback: true, // disable the default reload behavior
      },
    });
    if (setIsLoading) {
      setIsLoading(true);
      if (await client.isAuthenticated()) {
        const tempAuth = await authenticate(client);
        setIsLoading(false);
        return { success: false, actor: tempAuth };
      } else {
        setIsLoading(false);
        const tempActor = makeUserActor();
        setAuth({
          state: 'anonymous',
          actor: tempActor,
          client,
        });
        return { success: false, actor: tempActor };
      }
    }
    return { success: false, actor: null };
  };

  const login = async () => {
    logger('TRYING', process.env.DFX_NETWORK);
    let ran = false;
    if (auth && auth.state === 'anonymous' && auth.client && handleClose) {
      await auth.client.login({
        // maxTimeToLive: BigInt(1800) * BigInt(1_000_000_000),
        identityProvider:
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app/#authorize'
            : `http://${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}.localhost:8000/#authorize`,
        // `http://localhost:8000?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}#authorize`,
        onSuccess: () => {
          authenticate(auth.client as AuthClient);
          handleClose();
        },
        onError: () => {
          handleClose();
        },
      });
      const refreshLogin = () => {
        // prompt the user then refresh their authentication
        if (auth.client) {
          auth.client.login({
            onSuccess: async () => {
              authenticate(auth.client as AuthClient).then(() => {
                handleClose();
              });
            },
          });
        }
      };

      auth.client.idleManager?.registerCallback?.(refreshLogin);
    } else if (auth && !ran && auth.state === 'anonymous') {
      initAuth();
      ran = true;
    } else {
      logger('Login did not start');
    }
  };
  const logout = async () => {
    if (auth.state === 'initialized' && auth.client) {
      logger('LOGGIN OUT');
      await auth.client.logout();

      setAuth({
        state: 'anonymous',
        actor: null,
        client: null,
      });
      // router.push('/');
    }
  };
  const authenticate = async (client: AuthClient) => {
    try {
      const actor = makeUserActor({
        agentOptions: {
          identity: client.getIdentity(),
        },
      });
      const user = await actor.add_user();
      setAuth({
        state: 'initialized',
        actor,
        client,
      });
      return actor;
    } catch (e) {
      setAuth({
        ...auth,
        state: 'error',
      });
      logger(e, 'Error while authenticating');
    }
  };

  const handleSessionTimeout = () => {
    // upon login the localstorage items may not be set, wait for next tick
    setTimeout(() => {
      try {
        const delegation = JSON.parse(
          window.localStorage.getItem('ic-delegation') as string
        ) as JsonnableDelegationChain;
        const expirationTimeMs =
          Number.parseInt(delegation.delegations[0].delegation.expiration, 16) /
          1000000;
        setTimeout(() => {
          logout();
        }, expirationTimeMs - Date.now());
      } catch {
        const a = auth.client?.idleManager;

        console.error(a, 'Could not handle delegation expiry.');
      }
    });
  };
  return {
    initAuth,
    login,
    logout,
    authenticate,
  };
};
export default authMethods;
// export default { initAuth, login, logout, authenticate };
