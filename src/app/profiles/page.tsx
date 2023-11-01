'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Container, Row, Col, Tab, Tabs, Dropdown } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar/NavBar';
import SidebarHome from '@/components/SideBarHome/SideBarHome';
import calander from '@/assets/Img/Icons/icon-calander.png';
import girl from '@/assets/Img/Icons/icon-girl-1.png';
import article from '@/assets/Img/Icons/icon-article-1.png';
import Cup from '@/assets/Img/Icons/icon-cup-2.png';
import comment from '@/assets/Img/Icons/icon-writer.png';
import Footer from '@/components/Footer/Footer';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function profiles() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));
  const handleClose = () => {};
  const { auth, setAuth, setIdentity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    setIdentity: state.setIdentity,
  }));
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

  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);
  React.useEffect(() => {
    // const token = getToken();
    // if (window.ic) {
    // window.ic.plug.isConnected();
    // }
    const getIdentity = async () => {
      console.log('Identity was get');
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();
          setIsAuthenticated(true);
          setIdentity(identity);
        } else {
          router.replace('/');
          setIsAuthenticated(false);
          console.log('Authentication failed');
        }
        console.log('is authenticated', con);
      }
    };
    getIdentity();
  }, [auth.client]);
  // router.push('/route')
  return (
    <>
      {isAuthenticated && (
        <>
          <main id='main' className={isBlack ? 'black' : ''}>
            <div className='main-inner'>
              <Head>
                <title>Hi</title>
              </Head>
              <div className='inner-content'>
                <Row>
                  <Col xl='10' lg='12' md='12'>
                    <div className='profile-detail'>
                      <div className='profile-detail-body'>
                        <div className='flex-div-sm'>
                          <div className='profile-info'>
                            <div className='img-pnl'>
                              <Image src={girl} alt='girl' />
                            </div>
                            <div className='txt-pnl'>
                              <h2>
                                Neha Ali <i className='fa fa-pencil'></i>
                              </h2>
                            </div>
                          </div>
                          <div className='edit-profile'>
                            <ul>
                              <li>
                                <Link href='#'>
                                  <i className='fa fa-edit'></i> Edit Your
                                  Profile
                                </Link>
                              </li>
                              <li>
                                <Link href='#'>
                                  <i className='fa fa-share-alt'></i>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <p>
                          <Image src={calander} alt='calander' /> Joined from
                          19/10/2023
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
                      <ul className='tabs-list'>
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
                      </ul>
                    </div>

                    <div className='profile-comment-pnl'>
                      <Image src={comment} alt='comment' />
                    </div>
                  </Col>
                  <Col xxl='3' xl='4' lg='12' md='12'>
                    <div className='heding'>
                      <h3>
                        <Image src={Cup} alt='Cup' /> Achievement
                      </h3>
                    </div>
                    <div className='profile-achievment-pnl'></div>
                  </Col>
                </Row>
              </div>
            </div>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
