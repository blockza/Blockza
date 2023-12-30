import React from 'react';
import 'slick-carousel/slick/slick.css';
import icpimage from '@/assets/Img/coin-image.png';
// import infinity1 from '@/assets/Img/Icons/icon-infinite3.png';
import infinity1 from '@/assets/Img/coin-image.png';
import iconcalender from '@/assets/Img/Icons/icon-calender.png';
import user from '@/assets/Img/user-bg.png';
import cup from '@/assets/Img/icon-cup.png';
import Girl from '@/assets/Img/Icons/icon-woman.png';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
export default function LeadershipPost({ more }: { more?: boolean }) {
  return (
    <>
      <div className='leader-ship-pnl'>
        <Image
          src={icpimage}
          alt='icpImage'
          style={{ height: '165px', width: '165px' }}
        />
        <h1>ICP Leaderboard</h1>
        <h6> Additional Weekly ICP Tracks</h6>
        <ul className='winner-list'>
          <li>
            <div className='winner-post second-p'>
              <div className='img-pnl'>
                <Image src={user} alt='user' />
              </div>
              <div className='txt-pnl'>
                <h2>Name</h2>
                <h3>#54513</h3>
                <h4>+364,500</h4>
              </div>
            </div>
          </li>
          <li>
            <div className='winner-post first-p'>
              <div className='cup-pnl'>
                <Image src={cup} alt='Cup' />
              </div>
              <div className='img-pnl'>
                <Image src={user} alt='user' />
              </div>
              <div className='txt-pnl'>
                <h2>Name</h2>
                <h3>#54513</h3>
                <h4>+364,500</h4>
              </div>
            </div>
          </li>
          <li>
            <div className='winner-post third-p'>
              <div className='img-pnl'>
                <Image src={user} alt='user' />
              </div>
              <div className='txt-pnl'>
                <h2>Name</h2>
                <h3>#54513</h3>
                <h4>+364,500</h4>
              </div>
            </div>
          </li>
        </ul>
        <div className='table-container'>
          <div className='table-container-inner'>
            <Table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Highest Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <div className='calender-pnl'>
                      <ul>
                        <li>
                          <Image src={iconcalender} alt='Calender' /> Oct 11 -
                          Oct 18
                        </li>
                        <li>
                          End in <span>1d : 18h : 18m</span>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                {more ? (
                  <>
                    <tr>
                      <td>
                        <b>4</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>5</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>6</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>7</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td>
                        <b>1</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>2</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </div>
        </div>
        <div className='text-center'>
          <Link href='/NFTArticleLeaderboard' className='show-more-link'>
            Show more <i className='fa fa-caret-down'></i>
          </Link>
        </div>
      </div>
    </>
  );
}
('use client');
// import * as React from 'react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import iconuser1 from '@/assets/Img/Icons/icon-user-2.png';
import iconuser2 from '@/assets/Img/Icons/icon-user-1.png';
import cup1 from '@/assets/Img/Icons/icon-cup-3.png';
import cup2 from '@/assets/Img/Icons/icon-cup-2.png';
import Articles1 from '@/assets/Img/Icons/icon-article-2.png';
import Articles2 from '@/assets/Img/Icons/icon-article-1.png';
import Settings1 from '@/assets/Img/Icons/icon-setting-2.png';
import Settings2 from '@/assets/Img/Icons/icon-setting-1.png';
import feedback1 from '@/assets/Img/Icons/icon-feedback-1.png';
import feedback2 from '@/assets/Img/Icons/icon-feedback-2.png';
import Search1 from '@/assets/Img/Icons/icon-search-2.png';
import Search2 from '@/assets/Img/Icons/icon-search-1.png';
import Top1 from '@/assets/Img/Icons/icon-flame-2.png';
import Top2 from '@/assets/Img/Icons/icon-flame-1.png';
import Coins1 from '@/assets/Img/Icons/icon-coins-2.png';
import Coins2 from '@/assets/Img/Icons/icon-coins-1.png';
import Insight1 from '@/assets/Img/Icons/icon-idea-2.png';
import Insight2 from '@/assets/Img/Icons/icon-idea-1.png';
import Research1 from '@/assets/Img/Icons/icon-research-2.png';
import Research2 from '@/assets/Img/Icons/icon-research-1.png';
import reports1 from '@/assets/Img/Icons/icon-profit-report-2.png';
import reports2 from '@/assets/Img/Icons/icon-profit-report-1.png';
import directory1 from '@/assets/Img/Icons/icon-folder-3.png';
import directory2 from '@/assets/Img/Icons/icon-folder-2.png';
import podcast1 from '@/assets/Img/Icons/icon-podcast-2.png';
import podcast2 from '@/assets/Img/Icons/icon-podcast-1.png';
import News1 from '@/assets/Img/Icons/icon-news-2.png';
import News2 from '@/assets/Img/Icons/icon-news-3.png';
import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import Infinity from '@/assets/Img/Icons/infinity.png';
import Wallet from '@/assets/Img/Icons/plug-wallet.png';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Modal, Spinner } from 'react-bootstrap';
import SocialList from '@/components/SocialList/SocialList';
import ArticlesPost from '@/components/ArticlesPost/ArticlesPost';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';

export default function SidebarHome() {
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [show, setShow] = useState(false);

  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [toggle, settoggle] = React.useState(false);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = React.useState<string>('');
  const router = useRouter();
  const location = usePathname();

  const route = location.split('/')[1];
  const sidebarRef = React.useRef<HTMLElement | null>();

  const { auth, setAuth, setIdentity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    setIdentity: state.setIdentity,
  }));
  const { isBlack, setIsBlack, isOpen, setIsOpen } = useThemeStore((state) => ({
    isBlack: state.isBlack,
    isOpen: state.isOpen,
    setIsBlack: state.setIsBlack,
    setIsOpen: state.setIsOpen,
  }));
  const handleConnectClose = () => {
    setIsConnectLoading(false);
  };

  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading: setIsConnectLoading,
    handleClose: handleConnectClose,
  });

  const toggleHandle = () => {
    if (isOpen !== 'Navbar') {
      settoggle((prev) => {
        if (!prev) {
          setIsOpen('Sidebar');
          return true;
        } else {
          setIsOpen('');
          return false;
        }
      });
    }
  };
  const handleTabChange = (tab: string) => {
    setTab(tab);
  };
  // Dark Theme

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Function to toggle the class
  const toggleThemeClass = () => {
    setIsThemeActive(!isThemeActive);
  };
  // Dark Theme

  const connect = async () => {
    setIsConnectLoading(true);
    const login = await methods.login();
  };

  const closeNavbar = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      toggleHandle();
    }
  };
  useEffect(() => {
    if (toggle) {
      document.addEventListener('click', closeNavbar);
    } else {
      document.removeEventListener('click', closeNavbar);
    }

    return () => {
      document.removeEventListener('click', closeNavbar);
    };
  }, [toggle]);

  React.useEffect(() => {
    // const token = getToken();
    // if (window.ic) {
    // window.ic.plug.isConnected();
    // }
    const getIdentity = async () => {
      logger('Identity was get');
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        setConnected(con);
      }
    };
    getIdentity();
  }, [auth]);
  React.useEffect(() => {
    const currentTab = location;

    setTab(currentTab);
  }, []);
  return (
    route != 'blocked' &&
    route != 'superadmin' && (
      <>
        <div
          ref={sidebarRef as React.RefObject<HTMLDivElement>}
          className={toggle ? 'sidebar-home active' : 'sidebar-home'}
        >
          <div className='sidebar-inner'>
            <button className='toggler' onClick={toggleHandle}>
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <ul>
              <li>
                <Button
                  onClick={connect}
                  className='connect-btn'
                  disabled={isConnectLoading || connected}
                >
                  <span>
                    <Image src={iconlogo} alt='Logo' />
                  </span>
                  {isConnectLoading ? (
                    <Spinner size='sm' className='ms-4 text-primary' />
                  ) : connected ? (
                    'Connected'
                  ) : (
                    'Connect'
                  )}
                </Button>
              </li>

              {connected && (
                <>
                  <li>
                    <Link
                      // onClick={(e) => {
                      //   e.preventDefault();
                      // }}
                      className={location === '/profile' ? 'active' : ''}
                      href='/profile'
                    >
                      <div className='img-pnl'>
                        <Image src={iconuser1} alt='Search Profile' />
                        <Image src={iconuser2} alt='Search Profile' />
                      </div>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      // onClick={(e) => {
                      //   e.preventDefault();
                      // }}
                      className={location === '/reward' ? 'active' : ''}
                      href='/reward'
                    >
                      <div className='img-pnl'>
                        <Image src={cup1} alt='Search Cup' />
                        <Image src={cup2} alt='Search Cup' />
                      </div>
                      My Rewards
                    </Link>
                  </li>

                  <li>
                    <Link
                      // onClick={(e) => {
                      //   e.preventDefault();
                      // }}
                      className={location === '/profiledetails' ? 'active' : ''}
                      href='/profiledetails'
                    >
                      <div className='img-pnl'>
                        <Image src={Settings1} alt='Settings' />
                        <Image src={Settings2} alt='Settings' />
                      </div>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      // onClick={(e) => {
                      //   e.preventDefault();
                      // }}
                      className={location === '/subscribers' ? 'active' : ''}
                      href='/subscribers'
                    >
                      <div className='img-pnl'>
                        <Image src={iconuser1} alt='Search Profile' />
                        <Image src={iconuser2} alt='Search Profile' />
                      </div>
                      My Subscribers
                    </Link>
                  </li>
                  <li>
                    <Link
                      // onClick={(e) => {
                      //   e.preventDefault();
                      // }}

                      href='/'
                    >
                      <div className='img-pnl'>
                        <Image src={feedback1} alt='feedback' />
                        <Image src={feedback2} alt='feedback' />
                      </div>
                      Feedback
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  className={location === '/allarticles' ? 'active' : ''}
                  href='/allarticles'
                >
                  <div className='img-pnl'>
                    <Image src={Articles1} alt='Articles' />
                    <Image src={Articles2} alt='Articles' />
                  </div>
                  {auth.state === 'initialized' && 'My '}Articles
                </Link>
              </li>
              <li>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={location === '/search' ? 'active' : ''}
                  href='/search'
                >
                  <div className='img-pnl'>
                    <Image src={Search1} alt='Search icon' />
                    <Image src={Search2} alt='Search icon' />
                  </div>
                  Search
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/#top'
                >
                  <div className='img-pnl'>
                    <Image src={Top1} alt='Top icon' />
                    <Image src={Top2} alt='Top icon' />
                  </div>
                  Top
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/#news'
                >
                  <div className='img-pnl'>
                    <Image src={News1} alt='News Icon' />
                    <Image src={News2} alt='News Icon' />
                  </div>
                  News
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/#news'
                >
                  <div className='img-pnl'>
                    <Image src={Coins1} alt='Coins Icon' />
                    <Image src={Coins2} alt='Coins Icon' />
                  </div>
                  Coins
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/'
                >
                  <div className='img-pnl'>
                    <Image src={Insight1} alt='Insight Icon' />
                    <Image src={Insight2} alt='Insight Icon' />
                  </div>
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/'
                >
                  <div className='img-pnl'>
                    <Image src={Research1} alt='Research Icon' />
                    <Image src={Research2} alt='Research Icon' />
                  </div>
                  Research
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/'
                >
                  <div className='img-pnl'>
                    <Image src={reports1} alt='reports Icon' />
                    <Image src={reports2} alt='reports Icon' />
                  </div>
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/'
                >
                  <div className='img-pnl'>
                    <Image src={directory1} alt='directory Icon' />
                    <Image src={directory2} alt='directory Icon' />
                  </div>
                  Directory
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/#podcast'
                >
                  <div className='img-pnl'>
                    <Image src={podcast1} alt='podcast Icon' />
                    <Image src={podcast2} alt='podcast Icon' />
                  </div>
                  Podcast
                </Link>
              </li>
              <li>
                <Link
                  // onClick={(e) => {
                  //   e.preventDefault();
                  // }}
                  href='/'
                >
                  <div className='img-pnl'>
                    <i className='fa fa-ellipsis-h'></i>
                  </div>
                  More
                </Link>
              </li>
            </ul>
            <SocialList />
          </div>
          {location === '/' && (
            <div className='trending-side-panel'>
              <div className='spacer-20'></div>
              <h4>
                trending Stories <i className='fa fa-angle-down'></i>
              </h4>
              <ArticlesPost />
            </div>
          )}
        </div>

        {/* Connect Modal */}
        <Modal show={show} centered onHide={handleClose}>
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
              <Link
                onClick={(e) => {
                  e.preventDefault();
                }}
                href='/entriesn'
                className='grey-btn'
              >
                <p>Internet Identity</p>
                <Image src={Infinity} alt='Infinity' />
              </Link>
            </div>
          </Modal.Body>
        </Modal>
        {/* Connect Modal */}
      </>
    )
  );
}
