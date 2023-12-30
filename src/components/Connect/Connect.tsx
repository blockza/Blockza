'use client';

import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as React from 'react';
import icpimage from '@/assets/Img/coin-image.png';
// import { Modal } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Button,
  Form,
  Modal,
  Nav,
  NavDropdown,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { useConnectPlugWalletStore } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import authMethods from '@/lib/auth';
import infinity from '@/assets/Img/Icons/infinity.png';
import iconuser1 from '@/assets/Img/Icons/icon-user-2.png';
import iconuser2 from '@/assets/Img/Icons/icon-user-1.png';
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
import { ConnectPlugWalletSlice, UserAuth } from '@/types/store';
import logger from '@/lib/logger';
import { canisterId as ledgerCanisterId } from '@/dfx/declarations/icp_ledger_canister';
import { makeLedgerCanister } from '@/dfx/service/actor-locator';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
} from 'formik';
import { E8S, GAS_FEE } from '@/constant/config';
import { number, object, string } from 'yup';
export default function Connect({
  hideRewards,
  hideUser,
  hide = false,
}: {
  hideRewards?: boolean;
  hideUser?: boolean;
  hide?: boolean;
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
  const [rewards, setRewards] = React.useState(0);
  const [userBalance, setUserBalance] = React.useState<undefined | number>();
  const [isTransfering, setIsTransfering] = React.useState(false);
  const pathname = usePathname();
  const route = pathname.split('/')[1];
  const {
    auth,
    userAuth,
    identity,
    principal,
    setIdentity,
    setPrincipal,
    setUserAuth,
    reward,
    balance,
    setReward,
    setBalance,
  } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    reward: (state as ConnectPlugWalletSlice).reward,
    balance: (state as ConnectPlugWalletSlice).balance,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
    setIdentity: (state as ConnectPlugWalletSlice).setIdentity,
    setReward: (state as ConnectPlugWalletSlice).setReward,
    setBalance: (state as ConnectPlugWalletSlice).setBalance,
    principal: (state as ConnectPlugWalletSlice).principal,
    setPrincipal: (state as ConnectPlugWalletSlice).setPrincipal,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const router = useRouter();
  const location = usePathname();
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsLoggin(false);
  };

  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading,
    handleClose,
  });

  const initialTransferValues = {
    destination: '',
    amount: 0,
  };
  const gasFee = E8S / GAS_FEE;
  const gasFeeICP = gasFee / E8S;
  const transferSchema = object().shape({
    destination: string().test('min', 'Not a valid address', (value) => {
      try {
        Principal.fromText(value as string);
        return true;
      } catch {
        return false;
      }
    }),
    amount: number()
      .test('min', '', (value) => {
        if (value && value > 0) {
          return true;
        } else {
          return false;
        }
      })
      .test(
        'min',
        'Sorry, there are not enough funds in your account',
        (value) => {
          if (balance && value) {
            let requiredICP = balance - gasFeeICP;
            if (requiredICP >= value) return true;
          } else if (!value) {
            return true;
          } else {
            return false;
          }
        }
      ),
  });

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
  const copyPrincipal = () => {
    window.navigator.clipboard.writeText(principal);
    toast.success('Address copied to clipboard', { autoClose: 1000 });
  };
  const getBalance = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    let ledgerActor = await makeLedgerCanister({
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
    setBalance(balance);
    setUserBalance(balance);
  };
  const getUser = async (res?: any) => {
    let tempUser = null;
    if (res) {
      tempUser = await res.get_user_details([]);
    } else {
      tempUser = await auth.actor.get_user_details([]);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      const unClaimedRewards = tempUser.ok[1].rewards.filter((reward: any) => {
        return !reward.isClaimed;
      });
      // .reduce((acc: number, obj: any) => acc + parseInt(obj.amount), 0);
      // let rewardsInICP = unClaimedRewards / E8S;
      setRewards(unClaimedRewards.length);

      logger(unClaimedRewards.length, 'UNNNNNN');
      setReward(unClaimedRewards.length);

      if (tempUser.ok[1].isBlocked) {
        setUserAuth({ ...userAuth, status: tempUser.ok[1].isBlocked });
      }
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
  React.useEffect(() => {
    if (auth.state === 'initialized' && identity) {
      getBalance();
    }
  }, [auth, pathname, identity]);
  React.useEffect(() => {
    if (userAuth.status) {
      router.replace('/blocked');
    }
  }, [userAuth, pathname]);

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
      <ul className='side-btnlist'>
        {isLoading ? (
          <li>
            <div className='loader-container'>
              <Spinner
                animation='border'
                variant='secondary'
                size='sm'
                className={`${hideUser ? '' : ''} ${
                  hideRewards ? 'hide-on-desktop' : ''
                }`}
              />
            </div>
          </li>
        ) : auth.state !== 'initialized' ? (
          <li>
            <Button
              className={`link-btn ${hideUser ? '' : ''} ${
                hideRewards ? 'hide-on-desktop' : ''
              }`}
              disabled={isLoggin}
              onClick={() => {
                if (route === 'superadmin') {
                  connect();
                }
              }}
            >
              {isLoggin ? <Spinner size='sm' /> : 'Sign In'}
            </Button>
          </li>
        ) : (
          <>
            {!hide && (
              <>
                <li>
                  <Link
                    href='/reward'
                    className={`link-btn empty re ${
                      hideUser ? 'hide-on-mobile' : ''
                    } ${hideRewards ? 'hide-on-desktop' : ''}`}
                  >
                    My Rewards
                  </Link>
                </li>
                <li>
                  <Nav.Link
                    href='#'
                    className={`link-btn empty ${
                      hideUser ? 'hide-on-mobile' : ''
                    } ${hideRewards ? 'hide-on-desktop' : ''}`}
                  >
                    <Image src={iconbook} alt='iconbook' /> Guide Book
                  </Nav.Link>
                </li>
              </>
            )}
            <li>
              <div
                className={`profile-btn ${hideUser ? '' : ''} ${
                  hideRewards ? 'hide-on-desktop' : ''
                }`}
              >
                <NavDropdown
                  onSelect={() => {}}
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
                          <h6 className={hide ? 'text-white' : ''}>
                            {user
                              ? user?.name.toString().length <= 8
                                ? user?.name
                                : `${user?.name.toString().slice(0, 8)}... `
                              : 'User Name'}
                          </h6>

                          <span>
                            <Image
                              src={infinity}
                              alt='icpimage'
                              style={{ height: '10px  ', width: '20px' }}
                            />{' '}
                            {balance ?? 0}
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
                      <h6>
                        {user
                          ? user?.name.toString().length >= 16
                            ? `${user?.name
                                .toString()
                                .slice(0, 17)} \n ${user?.name
                                .toString()
                                .slice(17)}`
                            : user?.name
                          : 'User Name'}
                      </h6>
                      <p>
                        {principal
                          ? principal?.slice(0, 5) +
                            '...' +
                            principal?.slice(-3)
                          : ''}{' '}
                        <i
                          onClick={copyPrincipal}
                          className='fa fa-lg fa-copy '
                          style={{
                            cursor: 'pointer',
                            fontSize: 15,
                            color: 'black',
                          }}
                        ></i>
                      </p>
                    </div>
                    <div className='total-icp'>
                      <p>Claimable Rewards</p>
                      <span>
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          style={{ height: '21px', width: '21px' }}
                        />{' '}
                        {reward ?? 0}
                      </span>
                    </div>
                    <div className='total-icp'>
                      <p>ICP Tokens</p>
                      <span>
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        />{' '}
                        {balance ?? 0}
                      </span>
                    </div>
                  </NavDropdown.Item>
                  {!userAuth.status && (
                    <>
                      <NavDropdown.Item as={Link} href='/profile'>
                        <Image src={userImg} alt='user' />
                        <Image src={user1} alt='user' /> My Profile
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        // onClick={async (e) => {
                        //   e.preventDefault();

                        //   let ledgerActor = await makeLedgerCanister({
                        //     agentOptions: {
                        //       identity,
                        //     },
                        //   });

                        //   let acc: any = AccountIdentifier.fromPrincipal({
                        //     principal: identity.getPrincipal(),
                        //     // subAccount: identity.getPrincipal(),
                        //   });
                        //   let poor = Principal.fromText(
                        //     'og5g4-dvvdy-behql-zqoz5-f2qjs-x4nke-k5spr-q7ngf-7ia7a-h4jaj-yae'
                        //   );
                        //   let rich = Principal.fromText(
                        //     'dmy7a-ywgp6-wkwqw-rplzc-lbaqc-5ppsv-6och2-yh2mg-tnn4y-yz4su-lae'
                        //   );
                        //   let transfered = await ledgerActor.icrc2_transfer_from({
                        //     amount: 2000000,
                        //     created_at_time: [],
                        //     fee: [],
                        //     from: { owner: rich, subaccount: [] },
                        //     memo: [],
                        //     spender_subaccount: [],
                        //     to: { owner: poor, subaccount: [] },
                        //   });

                        //   logger(transfered);
                        // }}
                        href='/reward'
                        as={Link}
                      >
                        {/* <Link
                  // onClick={async () => {
                   
                  // }}
                  // }
                > */}
                        <Image src={cup} alt='cup' />
                        <Image src={cup1} alt='cup' /> My Rewards
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={handleShow}>
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        />{' '}
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        />{' '}
                        Transfer ICP
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/subscribers'>
                        {' '}
                        <Image src={userImg} alt='user' />
                        <Image src={user1} alt='user' />
                        My Subscribers
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/profiledetails'>
                        <Image src={setting} alt='setting' />
                        <Image src={setting1} alt='setting' /> Settings
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/'>
                        <Image src={feedback} alt='Feedback' />
                        <Image src={feedback1} alt='Feedback' /> Feedback
                      </NavDropdown.Item>

                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} href='/'>
                        <Image src={gift} alt='Feedback' />
                        <Image src={gift} alt='Feedback' /> Refer Friends &
                        Collect Rewards
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}
                  <NavDropdown.Item
                    onClick={async () => {
                      await methods.logout();
                      await methods.initAuth();
                      if (userAuth.status) {
                        router.replace('/');
                      }
                    }}
                    className='disconnect-btn'
                  >
                    <i className='fa fa-sign-out'></i> Disconnect
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </li>

            {/* <Button
            className='connect-btn'
            style={buttonStyle ? { marginLeft: '10px' } : {}}
          >
            Create
          </Button> */}
          </>
        )}
      </ul>

      <Modal centered show={show} onHide={handleClose} onClose={handleClose}>
        <Modal.Header closeButton className=''>
          Transfer ICP
        </Modal.Header>
        <Modal.Body>
          <div className=''>
            <Formik
              initialValues={initialTransferValues}
              // innerRef={formikRef}
              // enableReinitialize
              validationSchema={transferSchema}
              onSubmit={async (values, actions) => {
                // setPromotionValues({
                //   icp: values.ICP,
                //   // likes: values.likesCount,
                // });
                logger(values, 'SAT VALUES');
                if (!identity) {
                  return;
                }
                try {
                  setIsTransfering(true);
                  let acc: any = AccountIdentifier.fromPrincipal({
                    principal: Principal.fromText(values.destination),
                    // subAccount: identity.getPrincipal(),
                  });
                  const ledgerActor = makeLedgerCanister({
                    agentOptions: {
                      identity,
                    },
                  });
                  let transfer = await ledgerActor.transfer({
                    to: acc.bytes,
                    fee: { e8s: GAS_FEE },
                    memo: 1,
                    amount: { e8s: values.amount * E8S },
                    from_subaccount: [],
                    created_at_time: [],
                  });
                  logger({ transfer });
                  if (transfer.Ok) {
                    // setIsArticleDraft(false);
                    setIsTransfering(false);
                    handleClose();
                    toast.success('Transfer Successfull');
                    getBalance();
                    // setConfirmTransaction(false);
                  } else if (transfer.Err) {
                    toast.success('Error During Transaction');

                    setIsTransfering(false);
                  }
                } catch (err) {
                  logger(err);
                }

                // setConfirmTransaction(true);
                // formikRef.current?.handleSubmit();
                // await uploadEntry(values, actions);
              }}
            >
              {({
                errors,
                touched,
                handleChange,
                handleBlur,
                isValid,
                dirty,
              }) => (
                <FormikForm
                  className='flex w-full flex-col items-center justify-center'
                  // onChange={(e) => handleImageChange(e)}
                >
                  <Field name='destination'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>Destination</Form.Label>
                        </div>

                        <Form.Control
                          type='text'
                          placeholder='Destination'
                          value={field.value}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name='destination'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='destination'
                      component='div'
                    />
                  </div>
                  <Field name='amount'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>Amount</Form.Label>
                        </div>

                        <Form.Control
                          type='number'
                          placeholder='Amount'
                          value={field.value}
                          onInput={handleBlur}
                          onChange={handleChange}
                          name='amount'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='amount'
                      component='div'
                    />
                  </div>
                  <div className='mt-3'>
                    <p className='m-0'>Transaction Fee </p>
                    <p className='m-0'> {gasFeeICP}0000 ICP</p>
                  </div>
                  <div className='d-flex justify-content-end gap-4'>
                    <Button
                      className='publish-btn'
                      disabled={isTransfering}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className='publish-btn'
                      disabled={isTransfering || !(isValid && dirty)}
                      type='submit'
                    >
                      {isTransfering ? <Spinner size='sm' /> : 'Transfer'}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer> */}
      </Modal>
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
