import { makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Actor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { JsonnableDelegationChain } from '@dfinity/identity';
import { ConnectPlugWalletSlice, ConnectStore } from '@/types/store';
import React from 'react';
import { create } from 'zustand';
import { Principal } from '@dfinity/principal';

interface AuthState {
  state: string;
  actor: Actor | null;
  client: AuthClient | null;
}
interface methodsProps {
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  useConnectPlugWalletStore: ReturnType<typeof create>;
  client?: AuthClient;
  handleClose?: () => void;
}

const authMethods = ({
  setIsLoading,
  useConnectPlugWalletStore,
  handleClose,
  client,
}: methodsProps) => {
  const { auth, setAuth, setUserAuth } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: (state as ConnectPlugWalletSlice).setAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));

  //
  const initAuth = async () => {
    setAuth({ ...auth, isLoading: true });
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
          isLoading: false,
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
    setAuth({ ...auth, isLoading: true });

    if (auth.state === 'initialized' && auth.client) {
      logger('LOGGIN OUT');
      await auth.client.logout();

      setAuth({
        state: 'anonymous',
        actor: null,
        client: null,
        isLoading: false,
      });
      setUserAuth({
        name: '',
        status: false,
        role: '',
        principalText: '',
        principalArray: null,
        userPerms: null,
      });
      // router.push('/');
    }
  };
  const getPerms = (role: any) => {
    let userPerms = {
      userManagement: false,
      articleManagement: false,
      adminManagement: false,
    };
    if (role.hasOwnProperty('authorized')) {
      userPerms = {
        adminManagement: false,
        userManagement: false,
        articleManagement: false,
      };
    } else if (role.hasOwnProperty('user_admin')) {
      userPerms = {
        adminManagement: false,
        userManagement: true,
        articleManagement: false,
      };
    } else if (role.hasOwnProperty('article_admin')) {
      userPerms = {
        adminManagement: false,
        userManagement: false,
        articleManagement: true,
      };
    } else if (role.hasOwnProperty('sub_admin')) {
      userPerms = {
        adminManagement: false,
        userManagement: true,
        articleManagement: true,
      };
    } else if (role.hasOwnProperty('admin')) {
      userPerms = {
        adminManagement: true,
        userManagement: true,
        articleManagement: true,
      };
    }
    return userPerms;
  };
  const authenticate = async (client: AuthClient) => {
    try {
      setAuth({
        ...auth,
        isLoading: true,
      });
      const myIdentity = client.getIdentity();
      const actor = makeUserActor({
        agentOptions: {
          identity: myIdentity,
        },
      });
      const resp = await actor.add_user();
      if (resp.ok) {
        const user = resp.ok[1];
        const userPrincipalArray = myIdentity.getPrincipal();
        const userPrincipalText = userPrincipalArray.toString();
        let userPerms = getPerms(user.role);
        logger({ user, userPerms, userPrincipalText }, 'DAA USERAA');
        // logger(user.role == { authorized: null });
        setUserAuth({
          name: user.name,
          status: user.isBlocked,
          role: user.role,
          principalText: userPrincipalText,
          principalArray: userPrincipalArray,
          userPerms,
        });
        if (handleClose) handleClose();
      }
      setAuth({
        state: 'initialized',
        actor,
        client,
        isLoading: false,
      });
      if (handleClose) handleClose();
      return actor;
    } catch (e) {
      setAuth({
        ...auth,
        state: 'error',
      });
      if (handleClose) handleClose();
      setUserAuth({
        name: '',
        status: false,
        role: '',
        principalText: '',
        principalArray: null,
        userPerms: null,
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

// export default { initAuth, login, logout, authenticate };
