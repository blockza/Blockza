'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Container,
  Row,
  Col,
  Tab,
  Tabs,
  Dropdown,
  Button,
  Spinner,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar/NavBar';
import SidebarHome from '@/components/SideBarHome/SideBarHome';
import calander from '@/assets/Img/Icons/icon-calander.png';
import achievements from '@/assets/Img/achievements.png';
import girl from '@/assets/Img/Icons/icon-girl-1.png';
import defaultBanner from '@/assets/Img/default-banner.jpg';

import article from '@/assets/Img/Icons/icon-article-1.png';
import Cup from '@/assets/Img/Icons/icon-cup-2.png';
import comment from '@/assets/Img/Icons/icon-writer.png';
import Footer from '@/components/Footer/Footer';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import moment from 'moment';
import { toast } from 'react-toastify';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { utcToLocal } from '@/components/utils/utcToLocal';
import ProfileTabs from '@/components/ProfileTabs';
import { makeSubscriberActor } from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { Principal } from '@dfinity/principal';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function Profiles() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [profileImg, setProfileImg] = useState<string | null>();
  const [bannerImg, setBannerImg] = useState<string | null>();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  // const [authorId, setAuthorId] = useState<any[]>();
  const [NotFound, setNotFound] = useState<boolean>(false);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));

  const handleClose = () => {};
  const { auth, setAuth, setIdentity, identity } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      setIdentity: state.setIdentity,
      identity: state.identity,
    })
  );
  const methods = authMethods({ auth, setAuth, setIsLoading, handleClose });

  function isElementInViewport(elem: any) {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elemTop = elem.getBoundingClientRect().top + scroll;
    return elemTop - scroll < windowHeight;
  }

  function animateSections() {
    const elementsToAnimate = document.querySelectorAll('.scroll-anime');
    const elementsInViewport: any = [];
    elementsToAnimate.forEach((elem) => {
      if (isElementInViewport(elem)) {
        elem.classList.add('anime');
        elementsInViewport.push(elem);
      }
    });
    setAnimatedElements(elementsInViewport);
  }

  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = await getImage(img);
      if (name === 'profile') {
        setProfileImg(tempImg);
      } else {
        setBannerImg(tempImg);
      }
    } else {
      if (name === 'profile') {
        // setProfileFile(null);
        setProfileImg(null);
      } else {
        // setBannerFile(null);
        setBannerImg(null);
      }
    }
  };
  const getUser = async (res?: any) => {
    let tempUser = null;
    let inputId = userId ? [userId] : [];
    if (res) {
      tempUser = await res.get_user_details(inputId);
    } else {
      tempUser = await auth.actor.get_user_details(inputId);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      updateImg(tempUser.ok[1].profileImg[0], 'profile');
      updateImg(tempUser.ok[1].bannerImg[0], 'banner');
      setIsOwner(tempUser.ok[2]);
    }
  };
  const getSubscriber = async () => {
    const authorId = Principal.fromText(userId as string);

    const subscriberActor = makeSubscriberActor({
      agentOptions: {
        identity,
      },
    });
    const tempSub = await subscriberActor.isSubscriber(authorId);
    setIsSubscribed(tempSub);
  };
  const handleSubscribe = async () => {
    if (auth.state !== 'initialized') {
      return toast.error(
        'To perform this action, kindly connect to Internet Identity.'
      );
    }
    const authorId = Principal.fromText(userId as string);
    try {
      setIsSubscribing(true);

      const subscriberActor = makeSubscriberActor({
        agentOptions: {
          identity,
        },
      });
      const subed = await subscriberActor.addSubscriber(
        authorId,
        userCanisterId
      );
      await getSubscriber();
      setIsSubscribing(false);
    } catch (error) {
      setIsSubscribing(false);
    }
  };
  useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
    } else {
      methods.initAuth().then(async (res: any) => {
        getUser(res.actor);

        if (!res.success) {
          // toast.error('Your session has expired please log in again', {
          //   autoClose: 1900,
          // });
          // setTimeout(() => {
          //   router.push('/');
          // }, 3000);
        } else {
        }
      });
    }
  }, []);
  useEffect(() => {
    if (auth.state === 'anonymous') {
      // setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
    }
  }, [auth, userId]);

  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);
  useEffect(() => {
    if (identity && userId) {
      getSubscriber();
    }
  }, [identity]);
  useEffect(() => {
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();
          // const principal = await identity.getDelegation().toJSON().publicKey;
          // logger({ identity, principal }, 'WE GOT THIS BOZO');
          setIsAuthenticated(true);
          setIdentity(identity);
        } else {
          if (!userId) {
            router.replace('/');
            setIsAuthenticated(false);
          } else {
            auth.actor
              .get_user_details([userId])
              .then(() => {
                setIsAuthenticated(true);
              })
              .catch(() => {
                setNotFound(true);
              });
          }
        }
      }
    };
    getIdentity();
  }, [auth.client]);

  // router.push('/route')
  return (
    <>
      <main id='main' className={isBlack ? 'black' : ''}>
        {isAuthenticated && !NotFound && (
          <>
            <div className='main-inner'>
              <Head>
                <title>Hi</title>
              </Head>
              <div className='inner-content'>
                <Row>
                  <Col xl='10' lg='12' md='12'>
                    <div className='profile-detail'>
                      <div className='profile-detail-body'>
                        <div className='pr-banner'>
                          <div
                          // className='banner-pnl'
                          // style={{ minHeight: 432 }}
                          >
                            <Image
                              src={bannerImg ? bannerImg : defaultBanner}
                              fill={true}
                              alt='Banner'
                            />
                          </div>
                        </div>
                        <div className='flex-div-sm'>
                          <div className='profile-info'>
                            <div className='img-pnl'>
                              {/* <Image src={girl} alt='girl' /> */}
                              <div className='img'>
                                <Image
                                  src={profileImg ? profileImg : girl}
                                  fill={true}
                                  alt='Profile'
                                />
                              </div>
                            </div>
                            <div className='txt-pnl'>
                              <h2>
                                {user ? user.name : 'User Name'}{' '}
                                {isOwner && (
                                  <Link
                                    href='/profiledetails'
                                    className='text-black'
                                  >
                                    <i className='fa fa-pencil'></i>
                                  </Link>
                                )}
                              </h2>
                            </div>
                          </div>
                          <div className='edit-profile'>
                            <ul>
                              {isOwner ? (
                                <li>
                                  <Link href='/profiledetails'>
                                    <i className='fa fa-edit'></i> Edit Your
                                    Profile
                                  </Link>
                                </li>
                              ) : (
                                <li>
                                  <Button
                                    className={isSubscribed ? 'active' : ''}
                                    disabled={isSubscribing}
                                    onClick={handleSubscribe}
                                  >
                                    {isSubscribing ? (
                                      <Spinner size='sm' />
                                    ) : isSubscribed ? (
                                      <>
                                        <i className='fa fa-check'></i>{' '}
                                        Subscribed
                                      </>
                                    ) : (
                                      'Subscribe'
                                    )}
                                  </Button>
                                </li>
                              )}
                              <li>
                                <Link href='#'>
                                  <i className='fa fa-share-alt'></i>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className='flex-div-xs '>
                          {/* <h1>2</h1> */}
                          <div className='description'>
                            {user ? user.authorInfo : 'Author Info'}{' '}
                          </div>
                          <div className='socials'>
                            {user && user?.website[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.website[0]}>
                                {/* <i className='fa fa-instagram'></i> */}
                                <i className='fa fa-globe'></i>
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.instagram[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.instagram[0]}>
                                <i className='fa fa-instagram'></i>
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.facebook[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.facebook[0]}>
                                <i className='fa fa-facebook-f'></i>
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.twitter[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.twitter[0]}>
                                <i className='fa fa-twitter '></i>
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.linkedin[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.linkedin[0]}>
                                <i className='fa fa-linkedin'></i>
                              </Link>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                        <p>
                          {}
                          <Image src={calander} alt='calander' /> Joined from{' '}
                          {user
                            ? utcToLocal(
                                user.joinedFrom.toString(),
                                'MMMM Do, YYYY'
                              )
                            : ''}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <div className='spacer-40'></div>
                  <Col xxl='7' xl='8' lg='12' md='12'>
                    <div className='heding'>
                      <h3>
                        <Image src={article} alt='Article' />
                        Activities
                      </h3>
                      {/* <ul className='tabs-list'>
                        <li>
                          <Link href='#' className='active'>
                            Reviews
                          </Link>
                        </li>
                        <li>
                          <Link href='#'>Comments</Link>
                        </li>
                        <li>
                          <Link href='#'>Favorite Posts</Link>
                        </li>
                        <li>
                          <Link href='#'>Favorite product Communities</Link>
                        </li>
                      </ul> */}
                      <ProfileTabs
                        userId={
                          userId
                            ? Principal.fromText(userId)
                            : identity
                            ? identity.getPrincipal()
                            : null
                        }
                      />
                    </div>
                  </Col>
                  <Col xxl='3' xl='4' lg='12' md='12'>
                    <div className='heding'>
                      <h3>
                        <Image src={Cup} alt='Cup' /> Achievement
                      </h3>
                    </div>
                    <Image src={achievements} alt='achievements' />
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
        {NotFound && (
          <section className='bg-white'>
            {/* <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'> */}
            <div className='pagenotfound'>
              <div>
                <RiAlarmWarningFill
                  size={60}
                  className='drop-shadow-glow animate-flicker text-red-500'
                />
                <h1 className='mt-8 text-4xl md:text-6xl'>User Not Found</h1>
                <Link href='/'>Back to home</Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
