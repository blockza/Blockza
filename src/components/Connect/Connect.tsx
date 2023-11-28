'use client';

import { Actor, ActorMethod, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as React from 'react';

// import { Modal } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ButtonLink from '@/components/links/ButtonLink';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { Button, Modal, Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { JsonnableDelegationChain } from '@dfinity/identity';
import { makeLedgerCanister, makeUserActor } from '@/dfx/service/actor-locator';
import Link from 'next/link';
import Image from 'next/image';
import authMethods from '@/lib/auth';
import infinity from '@/assets/Img/Icons/infinity.png';

// import infinity from '@/assets/Img/Icons/icon-infinite.png';
import Wallet from '@/assets/Img/Icons/plug-wallet.png';
import cup from '@/assets/Img/Icons/icon-cup-1.png';
import cup1 from '@/assets/Img/Icons/icon-cup-3.png';
import userImg from '@/assets/Img/Icons/icon-user-3.png';
import user1 from '@/assets/Img/Icons/icon-user-2.png';
import feedback from '@/assets/Img/Icons/icon-feedback-3.png';
import feedback1 from '@/assets/Img/Icons/icon-feedback-1.png';
import setting from '@/assets/Img/Icons/icon-setting-3.png';
import setting1 from '@/assets/Img/Icons/icon-setting-2.png';
import gift from '@/assets/Img/Icons/icon-gift.png';
import { ConnectPlugWallet } from '@/components/utils/connection';
import iconbook from '@/assets/Img/Icons/icon-book.png';
import icongirl from '@/assets/Img/Icons/icon-girl-1.png';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import logger from '@/lib/logger';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';

export default function Connect({
  hideRewards,
  hideUser,
}: {
  hideRewards?: boolean;
  hideUser?: boolean;
}) {
  const [pText, setPText] = React.useState('nothing');
  const [show, setShow] = React.useState<boolean | undefined>();
  const [plugConnected, setPlugConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoggin, setIsLoggin] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<number | null>();
  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = React.useState<User | null>();
  const [profileImg, setProfileImg] = React.useState<string | null>();
  const [publicKey, setPublicKey] = React.useState<string | null>();

  const [client, setClient] = React.useState<AuthClient>();
  const pathname = usePathname();
  const { auth, setAuth, setIdentity, setPrincipal, identity, principal } =
    useConnectPlugWalletStore((state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      setIdentity: state.setIdentity,
      setPrincipal: state.setPrincipal,
      identity: state.identity,
      principal: state.principal,
    }));
  const router = useRouter();
  const location = usePathname();
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsLoggin(false);
  };

  const methods = authMethods({ auth, setAuth, setIsLoading, handleClose });

  const verifyConnection = async () => {
    if (!window.ic) {
      return toast.error('Install Plug Wallet');
    }
    const connected = false; //await window.ic.plug.isConnected();
    if (connected) {
      toast.success('Already connected');
      setPlugConnected(true);
      handleClose();
      return;
    } else {
      const whitelist = [process.env.NEXT_PUBLIC_HELLO_CANISTER_ID];

      const host = 'http://127.0.0.1:4943';

      const onConnectionUpdate = async () => {};
      try {
        const publicKey = await window.ic.plug.requestConnect({
          whitelist,
          host,
          onConnectionUpdate,
          timeout: 50000,
        });
        setPlugConnected(true);
        handleClose();
      } catch {
        toast.error("Couldn't connect to plug wallet");
      }
    }
  };

  const connectIdentity = async () => {
    const webapp_id = process.env.NEXT_PUBLIC_WHOAMI_CANISTER_ID;
    setIsLoading(true);

    const local_ii_url = `http://${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}.localhost:8000`;

    const webapp_idl = ({ IDL }: any) => {
      return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ['query']) });
    };

    const authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // set to 30 minutes
        disableDefaultIdleCallback: true, // disable the default reload behavior
      },
    });

    await new Promise<void>((resolve, reject) => {
      authClient.login({
        identityProvider: local_ii_url,
        onSuccess: resolve,
        onError: reject,
        maxTimeToLive: BigInt(1800) * BigInt(1_000_000_000),
      });
    });

    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    const webapp = Actor.createActor(webapp_idl, {
      agent,
      canisterId: webapp_id!,
    });
    function refreshLogin() {
      // prompt the user then refresh their authentication
      authClient.login({
        identityProvider: local_ii_url,
        onSuccess: async () => {
          const newIdentity = authClient.getIdentity();
          agent.replaceIdentity(newIdentity);
        },
      });
    }

    authClient.idleManager?.registerCallback?.(refreshLogin);
    setClient(authClient);
    // At this point we're authenticated, and we can get the identity from the auth client:
    setIdentity(identity);
    // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
    // Using the interface description of our webapp, we create an actor that we use to call the service methods.

    setIsLoading(false);

    // logger(principal);
    // const agent = new HttpAgent({ identity });
    // Using the interface description of our webapp, we create an actor that we use to call the service methods.
    // const webapp = Actor.createActor(webapp_idl, {
    //   agent,
    //   canisterId: webapp_id!,
    // });
    // Call whoami which returns the principal (user id) of the current user.
    const principal = await webapp.whoami();
    // router.push('/write');
    // setPText(identity.toString());
  };

  const handleConnect = async () => {
    // await verifyConnection();
    setIsLoading(true);
    const { success, msg } = await ConnectPlugWallet();
    setIsLoading(false);

    if (success) {
      toast.success(msg);
      setPlugConnected(true);
      // router.push('/dashboard');
    } else {
      toast.error(msg);
    }
    // if (connected) {
    //   const principal = await window.ic.plug.getPrincipal();
    //   const publicAddr = principal.toString();

    //   axios
    //     .post(`auth/login`, {
    //       email: publicAddr,
    //       password: PASS_KEY,
    //     })
    //     .then((res) => {
    //       localStorage.setItem('token', res.data.data);
    //       // router.push('/dashboard');
    //     });
    // }
  };
  const disconnect = async () => {
    // if (getToken()) {
    //   localStorage.removeItem('token');
    // }

    const connect = await window.ic.plug.isConnected();
    if (connect) {
      window.ic.plug.disconnect();
    }
  };
  const connect = async () => {
    setIsLoggin(true);
    const login = await methods.login();
  };
  const updateImg = async (img: any) => {
    if (img) {
      const tempImg = await getImage(img);

      setProfileImg(tempImg);
    } else {
      // setProfileFile(null);
      setProfileImg(null);
    }
  };
  React.useEffect(() => {
    // const token = getToken();
    // if (window.ic) {
    // window.ic.plug.isConnected();
    // }
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();

          setIdentity(identity);
          const pKey = await identity.getDelegation().toJSON().publicKey;
          setPublicKey(pKey);
        }
      }
    };
    getIdentity();
  }, [auth.client]);

  const getUser = async (res?: any) => {
    let tempUser = null;
    if (res) {
      tempUser = await res.get_user_details([]);
    } else {
      tempUser = await auth.actor.get_user_details([]);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      updateImg(tempUser.ok[1].profileImg[0]);
    }
  };
  const getII = async () => {
    const identity = await auth.client.getIdentity();
    const principal = await identity.getPrincipal();
    setPrincipal(principal.toString());
    setIdentity(identity);
  };
  React.useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
      getII();
    } else {
      methods.initAuth().then(async (res) => {
        if (res.success) {
          getUser(res.actor);
        }
      });
    }
  }, []);
  React.useEffect(() => {
    if (auth.state === 'anonymous') {
      // setIsOwner(false);
      setIdentity(null);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
      getII();
    }
  }, [auth, pathname]);

  // React.useEffect(() => {
  //   if (auth.state === 'initialized') {
  //     getUser();
  //   } else {
  //     methods.initAuth().then(async (res) => {
  //       if (!res.success) {
  //         // toast.error('Your session has expired please log in again', {
  //         //   autoClose: 1900,
  //         // });
  //         // setTimeout(() => {
  //         //   router.push('/');
  //         // }, 3000);
  //         getUser(res.actor);
  //       } else {
  //         getUser(res.actor);
  //         logger(res, auth.actor);
  //       }
  //     });
  //     logger('User not authenticated');
  //   }
  // }, []);

  React.useEffect(() => {
    methods.initAuth();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className='loader-container'>
          <Spinner
            animation='border'
            variant='secondary'
            size='sm'
            className={`${hideUser ? 'hide-on-mobile' : ''} ${
              hideRewards ? 'hide-on-desktop' : ''
            }`}
          />
        </div>
      ) : auth.state !== 'initialized' ? (
        <Button
          className={`link-btn ${hideUser ? 'hide-on-mobile' : ''} ${
            hideRewards ? 'hide-on-desktop' : ''
          }`}
          disabled={isLoggin}
        >
          Sign In
        </Button>
      ) : (
        <>
          <>
            <Nav.Link
              href='/reward'
              className={`link-btn empty re ${
                hideRewards ? 'hide-on-mobile' : ''
              } ${hideRewards ? 'hide-on-desktop' : ''}`}
            >
              My Reward
            </Nav.Link>
            <Nav.Link
              href='javascript:void(0);'
              className={`link-btn empty ${
                hideRewards ? 'hide-on-mobile' : ''
              } ${hideRewards ? 'hide-on-desktop' : ''}`}
            >
              <Image src={iconbook} alt='iconbook' /> Guide Book
            </Nav.Link>
          </>

          <div
            className={`profile-btn ${hideUser ? 'hide-on-mobile' : ''} ${
              hideRewards ? 'hide-on-desktop' : ''
            }`}
          >
            <NavDropdown
              onSelect={() => console.log('hi')}
              // active={true}
              title={
                <>
                  <div className='link-btn logedin'>
                    <div className='img-pnl'>
                      {/* <Image src={icongirl} alt='icongirl' /> */}
                      <div
                        style={{
                          position: 'relative',
                          width: '45px',
                          margin: '0 auto',
                          height: '45px',
                        }}
                      >
                        <Image
                          src={profileImg ? profileImg : icongirl}
                          className='backend-img'
                          fill={true}
                          alt='Profileicon'
                        />
                      </div>
                    </div>
                    <div className='txt-pnl'>
                      <h6>{user ? user?.name : 'User Name'}</h6>
                      <span>
                        <Image src={infinity} alt='Infinity' /> 0
                      </span>
                    </div>
                  </div>
                </>
              }
              id='basic-nav-dropdown'
            >
              <NavDropdown.Item className='pr-link'>
                <div>
                  <div
                    style={{
                      position: 'relative',
                      width: '60px',
                      margin: '0 auto',
                      height: '60px',
                    }}
                  >
                    <Image
                      src={profileImg ? profileImg : icongirl}
                      className='backend-img'
                      fill={true}
                      alt='Profileicon'
                    />
                  </div>
                </div>
                <div>
                  <h6> {user ? user?.name : 'User Name'}</h6>
                  <p>
                    {publicKey
                      ? publicKey?.slice(0, 5) + '...' + publicKey?.slice(-3)
                      : ''}
                  </p>
                </div>
                <div className='total-icp'>
                  <p>Total ICP</p>
                  <span>
                    <Image src={infinity} alt='Infinity' /> 0
                  </span>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item className='custom'>
                <Link href='/profile'>
                  <Image src={userImg} alt='user' />
                  <Image src={user1} alt='user' /> My Profile
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className='custom'>
                <Link
                  // onClick={async () => {
                  //   let ledgerActor = await makeLedgerCanister({
                  //     agentOptions: {
                  //       identity,
                  //     },
                  //   });

                  //   let acc: any = AccountIdentifier.fromPrincipal({
                  //     principal: identity.getPrincipal(),
                  //     // subAccount: identity.getPrincipal(),
                  //   });
                  //   logger(principal)
                  //   let balance = await ledgerActor.account_balance({
                  //     account: acc.bytes,
                  //   });
                  //   let replicaPrincipal = Principal.fromText(
                  //     'ae25j-iwln7-esrn6-abfzr-p2plk-ow2pg-n2iuh-7ebfd-3drqw-m4cuq-zae'
                  //   );
                  //   let replicaAcc: any = AccountIdentifier.fromPrincipal({
                  //     principal: replicaPrincipal,
                  //     // subAccount: identity.getPrincipal(),
                  //   });
                  //   let transfer = await ledgerActor.transfer({
                  //     to: replicaAcc.bytes,
                  //     fee: { e8s: 10000 },
                  //     memo: 1,
                  //     amount: { e8s: 1000000 },
                  //     from_subaccount: [],
                  //     created_at_time: [],
                  //   });
                  //   logger({ balance }, 'DA transfer');
                  // }}
                  href='/reward'
                  // }
                >
                  <Image src={cup} alt='cup' />
                  <Image src={cup1} alt='cup' /> My Rewards
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className='custom'>
                <Link href='/profiledetails'>
                  <Image src={setting} alt='setting' />
                  <Image src={setting1} alt='setting' /> Settings
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className='custom'>
                <Link href='/'>
                  <Image src={feedback} alt='Feedback' />
                  <Image src={feedback1} alt='Feedback' /> Feedback
                </Link>
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item className='custom'>
                <Link href='/' className='dropdown-item blue'>
                  <Image src={gift} alt='Feedback' />
                  <Image src={gift} alt='Feedback' /> Refer Friends & Collect
                  Rewards
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={async () => {
                  await methods.logout();
                  await methods.initAuth();
                }}
                className='disconnect-btn'
              >
                <i className='fa fa-sign-out'></i> Disconnect
              </NavDropdown.Item>
            </NavDropdown>
          </div>

          {/* <Button
            className='connect-btn'
            style={buttonStyle ? { marginLeft: '10px' } : {}}
          >
            Create
          </Button> */}
        </>
      )}
      {/* <Modal show={show} onClose={handleClose} size={'md'}>
          <Modal.Header className=''>Connect Wallet</Modal.Header>
          <Modal.Body>
            <div className='wallet-container flex flex-col gap-3'>
              <div className='wallet-item' onClick={handleConnect}>
                <p>Plug Wallet</p>
                <img src='https://docs.plugwallet.ooo/imgs/logo.png' alt='' />
              </div>
              <div className='wallet-item' onClick={connectIdentity}>
                <p>Internet Identity</p>
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHnDVbkjS_-BN8jMKEJtnIwfx6y4xeqs5N3_jaydwPAQ&s'
                  alt=''
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose}>Cancel</Button>
          </Modal.Footer>
        </Modal> */}
      {/* <Modal
        show={show}
        onClose={handleClose}
        centered
        onHide={() => setShow(false)}
        // dialogClassName='modal-20w'
        className='modal'
      >
        <Modal.Header className=''>Connect Wallet</Modal.Header>
        <Modal.Body>
          <div className='wallet-container '>
            <div
              className='wallet-item'
              onClick={async () => {
                if (client) {
                  const con = await client.isAuthenticated();
                  logger('is authenticated', con);
                }
              }}
            >
              <p>Plug Wallet</p>
              <img src='https://docs.plugwallet.ooo/imgs/logo.png' alt='' />
            </div>
            <div
              className='wallet-item'
              onClick={() => login({ setAuth, auth, handleClose })}
            >
              <p>Internet Identity</p>
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHnDVbkjS_-BN8jMKEJtnIwfx6y4xeqs5N3_jaydwPAQ&s'
                alt=''
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal> */}
      {/* <Modal show={show} centered onHide={handleClose}>
        <Modal.Body>
          <div className='flex-div connect-heading-pnl'>
            <i className='fa fa-question-circle-o'></i>
            <p>Connect Wallet</p>
            <Button className='close-btn' onClick={handleClose}>
              <i className='fa fa-close'></i>
            </Button>
          </div>
          <div className='full-div'>
            <Button className='grey-btn'>
              <p>Plug Wallet</p>
              <Image src={Wallet} alt='Wallet' />
            </Button>
            <Button disabled={isLoggin} onClick={connect} className='grey-btn'>
              <p>Internet Identity</p>
              <Image src={infinity} alt='Infinity' />
            </Button>
          </div>
        </Modal.Body>
      </Modal> */}
    </>
  );
}
