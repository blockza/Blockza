'use client';
// import * as React from 'react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import News1 from '@/assets/Img/sidebar-icons/news-1.png';
import News2 from '@/assets/Img/sidebar-icons/news-2.png';
import Web1 from '@/assets/Img/sidebar-icons/icon-web-2.png';
import Web2 from '@/assets/Img/sidebar-icons/icon-web-1.png';
import blockchain1 from '@/assets/Img/sidebar-icons/icon-blockchain-1.png';
import Articles1 from '@/assets/Img/Icons/icon-article-2.png';
import Articles2 from '@/assets/Img/Icons/icon-article-1.png';
import blockchain2 from '@/assets/Img/sidebar-icons/icon-blockchain-2.png';
import crypto1 from '@/assets/Img/sidebar-icons/icon-crypto-1.png';
import crypto2 from '@/assets/Img/sidebar-icons/icon-crypto-2.png';
import Defi1 from '@/assets/Img/sidebar-icons/icon-defi-1.png';
import Defi2 from '@/assets/Img/sidebar-icons/icon-defi-2.png';
import Doa1 from '@/assets/Img/sidebar-icons/icon-dao-1.png';
import Doa2 from '@/assets/Img/sidebar-icons/icon-dao-2.png';
import NFt1 from '@/assets/Img/sidebar-icons/icon-nft-1.png';
import NFt2 from '@/assets/Img/sidebar-icons/icon-nft-2.png';
import Metaverse1 from '@/assets/Img/sidebar-icons/icon-metavers-1.png';
import Metaverse2 from '@/assets/Img/sidebar-icons/icon-metavers-2.png';
import Game1 from '@/assets/Img/sidebar-icons/icon-games-1.png';
import Game2 from '@/assets/Img/sidebar-icons/icon-games-2.png';
import ai1 from '@/assets/Img/sidebar-icons/icon-ai-1.png';
import ai2 from '@/assets/Img/sidebar-icons/icon-ai-2.png';
import Career1 from '@/assets/Img/sidebar-icons/icon-career-1.png';
import Career2 from '@/assets/Img/sidebar-icons/icon-career-2.png';
import advertisment1 from '@/assets/Img/sidebar-icons/icon-advertisment-1.png';
import advertisment2 from '@/assets/Img/sidebar-icons/icon-advertisment-2.png';
import Contact1 from '@/assets/Img/sidebar-icons/icon-contact-1.png';
import Contact2 from '@/assets/Img/sidebar-icons/icon-contact-2.png';

import Coins1 from '@/assets/Img/Icons/icon-coins-2.png';
import Coins2 from '@/assets/Img/Icons/icon-coins-1.png';
import Research1 from '@/assets/Img/Icons/icon-research-2.png';
import Research2 from '@/assets/Img/Icons/icon-research-1.png';
import reports1 from '@/assets/Img/Icons/icon-profit-report-2.png';
import reports2 from '@/assets/Img/Icons/icon-profit-report-1.png';
import directory1 from '@/assets/Img/Icons/icon-folder-3.png';
import directory2 from '@/assets/Img/Icons/icon-folder-2.png';
import podcast1 from '@/assets/Img/Icons/icon-podcast-2.png';
import podcast2 from '@/assets/Img/Icons/icon-podcast-1.png';

import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import Infinity from '@/assets/Img/Icons/infinity.png';
import Wallet from '@/assets/Img/Icons/plug-wallet.png';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Modal, Spinner } from 'react-bootstrap';
import SocialList from '@/components/SocialList/SocialList';
import ArticlesPost from '@/components/ArticlesPost/ArticlesPost';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';

export default function NewSidebarHome() {
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [show, setShow] = useState(false);

  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [toggle, settoggle] = React.useState(false);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = React.useState<string>('');
  const router = useRouter();
  const location = usePathname();
  const path = usePathname();

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

  let routes: {
    latest: string;
    web3: string;
    blockchain: string;
    crypto: string;
    defi: string;
    dao: string;
    nft: string;
    metaverse: string;
    games: string;
    ai: string;
    career: string;
    advertise: string;
    contact: string;
  } = {
    latest: 'https://nftstudio24.com/news/',
    web3: '#web3',
    blockchain: '#blockchain',
    crypto: 'https://nftstudio24.com/news/cryptopedia/',
    defi: 'https://nftstudio24.com/?s=defi',
    dao: 'https://nftstudio24.com/?s=dao',
    nft: 'https://nftstudio24.com/news/latest-nft-news/',
    metaverse: 'https://nftstudio24.com/news/latest-nft-news/virtual-land/',
    games: 'https://nftstudio24.com/news/latest-nft-news/metaverse-nft-games/',
    ai: 'https://nftstudio24.com/?s=AI',
    career: 'https://nftstudio24.com/careers/',
    advertise: 'https://nftstudio24.com/advertise-with-us/',
    contact: 'https://nftstudio24.com/contact-us/',
  };
  if (path !== '/') {
    if (auth.state === 'initialized') {
      routes = {
        latest: 'https://nftstudio24.com/news/',
        web3: '/?route=blockchain',
        blockchain: '/?route=blockchain',
        crypto: 'https://nftstudio24.com/news/cryptopedia/',
        defi: 'https://nftstudio24.com/?s=defi',
        dao: 'https://nftstudio24.com/?s=dao',
        nft: 'https://nftstudio24.com/news/latest-nft-news/',
        metaverse: 'https://nftstudio24.com/news/latest-nft-news/virtual-land/',
        games:
          'https://nftstudio24.com/news/latest-nft-news/metaverse-nft-games/',
        ai: 'https://nftstudio24.com/?s=AI',
        career: 'https://nftstudio24.com/careers/',
        advertise: 'https://nftstudio24.com/advertise-with-us/',
        contact: 'https://nftstudio24.com/contact-us/',
      };
    } else {
      routes = {
        latest: 'https://nftstudio24.com/news/',
        web3: '/?route=web3',
        blockchain: '/?route=blockchain',
        crypto: 'https://nftstudio24.com/news/cryptopedia/',
        defi: 'https://nftstudio24.com/?s=defi',
        dao: 'https://nftstudio24.com/?s=dao',
        nft: 'https://nftstudio24.com/news/latest-nft-news/',
        metaverse: 'https://nftstudio24.com/news/latest-nft-news/virtual-land/',
        games:
          'https://nftstudio24.com/news/latest-nft-news/metaverse-nft-games/',
        ai: 'https://nftstudio24.com/?s=AI',
        career: 'https://nftstudio24.com/careers/',
        advertise: 'https://nftstudio24.com/advertise-with-us/',
        contact: 'https://nftstudio24.com/contact-us/',
      };
    }
  } else {
    if (auth.state === 'initialized') {
      routes = {
        latest: 'https://nftstudio24.com/news/',
        web3: '#blockchain',
        blockchain: '#blockchain',
        crypto: 'https://nftstudio24.com/news/cryptopedia/',
        defi: 'https://nftstudio24.com/?s=defi',
        dao: 'https://nftstudio24.com/?s=dao',
        nft: 'https://nftstudio24.com/news/latest-nft-news/',
        metaverse: 'https://nftstudio24.com/news/latest-nft-news/virtual-land/',
        games:
          'https://nftstudio24.com/news/latest-nft-news/metaverse-nft-games/',
        ai: 'https://nftstudio24.com/?s=AI',
        career: 'https://nftstudio24.com/careers/',
        advertise: 'https://nftstudio24.com/advertise-with-us/',
        contact: 'https://nftstudio24.com/contact-us/',
      };
    }
  }
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
          className={toggle ? 'sidebar-home new active' : 'sidebar-home new'}
        >
          <div className='sidebar-inner '>
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
              <li>
                <Link
                  className={location === '/allarticlesss' ? 'active' : ''}
                  href={routes.latest}
                >
                  <div className='img-pnl'>
                    <Image src={News1} alt='Articles' />
                    <Image src={News2} alt='Articles' />
                  </div>
                  Latest News
                </Link>
              </li>
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
                  className={location === '/search' ? 'active' : ''}
                  // href='/search'
                  href={routes.web3}
                >
                  <div className='img-pnl'>
                    <Image src={Web1} alt='Web Icon' />
                    <Image src={Web2} alt='Web Icon' />
                  </div>
                  Web3
                </Link>
              </li>
              <li>
                <Link href={routes.blockchain}>
                  <div className='img-pnl'>
                    <Image src={blockchain2} alt='blockchain ' />
                    <Image src={blockchain1} alt='blockchain' />
                  </div>
                  Blockchain
                </Link>
              </li>
              <li>
                <Link href={routes.crypto}>
                  <div className='img-pnl'>
                    <Image src={crypto2} alt='Crypto Icon' />
                    <Image src={crypto1} alt='Crypto Icon' />
                  </div>
                  Crypto
                </Link>
              </li>
              <li>
                <Link href={routes.defi}>
                  <div className='img-pnl'>
                    <Image src={Coins1} alt='Coins Icon' />
                    <Image src={Coins2} alt='Coins Icon' />
                  </div>
                  Defi
                </Link>
              </li>
              <li>
                <Link href={routes.dao}>
                  <div className='img-pnl'>
                    <Image src={Doa2} alt='Doa Icon' />
                    <Image src={Doa1} alt='Doa Icon' />
                  </div>
                  Dao
                </Link>
              </li>
              <li>
                <Link href={routes.nft}>
                  <div className='img-pnl'>
                    <Image src={NFt2} alt='NFt Icon' />
                    <Image src={NFt1} alt='NFt Icon' />
                  </div>
                  NFT
                </Link>
              </li>
              <li>
                <Link href={routes.metaverse}>
                  <div className='img-pnl'>
                    <Image src={Metaverse2} alt='Metaverse Icon' />
                    <Image src={Metaverse1} alt='Metaverse Icon' />
                  </div>
                  Metaverse
                </Link>
              </li>
              <li>
                <Link href={routes.games}>
                  <div className='img-pnl'>
                    <Image src={Game2} alt='Game Icon' />
                    <Image src={Game1} alt='Game Icon' />
                  </div>
                  Blockchain Game
                </Link>
              </li>
              <li>
                <Link href={routes.ai}>
                  <div className='img-pnl'>
                    <Image src={ai2} alt='Ai Icon' />
                    <Image src={ai1} alt='Ai Icon' />
                  </div>
                  AI
                </Link>
              </li>
              <li>
                <Link href={routes.career}>
                  <div className='img-pnl'>
                    <Image src={Career2} alt='Career Icon' />
                    <Image src={Career1} alt='Career Icon' />
                  </div>
                  Career
                </Link>
              </li>
              <li>
                <Link href={routes.advertise}>
                  <div className='img-pnl'>
                    <Image src={advertisment2} alt='advertisment Icon' />
                    <Image src={advertisment1} alt='advertisment Icon' />
                  </div>
                  Advertisement
                </Link>
              </li>
              <li>
                <Link href={routes.contact}>
                  <div className='img-pnl'>
                    <Image src={Contact2} alt='Contact Icon' />
                    <Image src={Contact1} alt='Contact Icon' />
                  </div>
                  Contact Us
                </Link>
              </li>
            </ul>
            <SocialList />
          </div>
          {/* {location === '/' && (
            <div className='trending-side-panel'>
              <div className='spacer-20'></div>
              <h4>
                trending Stories <i className='fa fa-angle-down'></i>
              </h4>
              <ArticlesPost />
            </div>
          )} */}
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
