'use client';
// import * as React from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Dashboard from '@/assets/Img/Icons/icon-dashboard-2.png';
import Dashboard1 from '@/assets/Img/Icons/icon-dashboard.png';
// import user1 from '@/assets/Img/Icons/icon-user-4.png';
// import user2 from '@/assets/Img/Icons/icon-user-5.png';
import user1 from '@/assets/Img/Icons/Group 1015.png';
import user2 from '@/assets/Img/Icons/Group 954.png';
// import article1 from '@/assets/Img/Icons/icon-article-3.png';
// import article2 from '@/assets/Img/Icons/icon-article-4.png';
import article1 from '@/assets/Img/Icons/Group 1016.png';
import article2 from '@/assets/Img/Icons/Group 955.png';
// import admin1 from '@/assets/Img/Icons/icon-admin-1.png';
// import admin2 from '@/assets/Img/Icons/icon-admin-2.png';
import admin1 from '@/assets/Img/Icons/Group 1017.png';
import admin2 from '@/assets/Img/Icons/Group 956.png';
import iconlist1 from '@/assets/Img/Icons/icon-list-1.png';
import iconlist2 from '@/assets/Img/Icons/icon-list-2.png';
import iconlist3 from '@/assets/Img/Icons/icon-list-3.png';
import iconlist4 from '@/assets/Img/Icons/icon-list-4.png';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown } from 'react-bootstrap';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
export default function SideBarDash() {
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [toggle, settoggle] = React.useState(false);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = React.useState<string>('');
  const router = useRouter();
  const location = usePathname();
  const sidebarRef = React.useRef<HTMLElement | null>();
  const [adminMenueShow, setAdminMenueShow] = React.useState(false);
  const [articleMenueShow, setArticleMenueShow] = React.useState(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const { isOpen, setIsOpen } = useThemeStore((state) => ({
    isOpen: state.isOpen,
    setIsOpen: state.setIsOpen,
  }));
  React.useEffect(() => {
    const currentTab = location;
    currentTab === '/superadmin/articleList' ||
    currentTab === '/superadmin/pendingList'
      ? setArticleMenueShow(true)
      : setArticleMenueShow(false);
    currentTab === '/superadmin/makeAdmin' ||
    currentTab === '/superadmin/trackAdmin'
      ? setAdminMenueShow(true)
      : setAdminMenueShow(false);
    setTab(currentTab);
    console.error(currentTab);
  }, [location]);
  return (
    <>
      <div
        ref={sidebarRef as React.RefObject<HTMLDivElement>}
        className={
          toggle ? 'sidebar-home active dark rmt' : 'sidebar-home dark rmt'
        }
      >
        {tab !== '/superadmin' && (
          <div className='sidebar-inner'>
            <button className='toggler' onClick={()=>settoggle((pre)=>!pre)}>
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <ul>
              {/* <li>
              <Link href='/superadmin' className={`${tab=='/superadmin'? 'active':""}`}>
                <Image src={Dashboard1} alt='dashboard' />
                <Image src={Dashboard} alt='dashboard' /> Dashboard
              </Link>
            </li> */}

              {userAuth.userPerms?.userManagement && (
                <li>
                  <Link
                    href='/superadmin/userManagment'
                    className={`${
                      location == '/superadmin/userManagment' ? 'active' : ''
                    }`}
                  >
                    <Image src={user1} alt='User' />
                    <Image src={user2} alt='User' /> User Management
                  </Link>
                </li>
              )}
              {userAuth.userPerms?.articleManagement && (
                <li>
                  {/* <Link href="#" >
                <Image src={article1} alt="Article" />
                <Image src={article2} alt="Article" />
                Article Management
              </Link> */}
                  <Dropdown
                    show={articleMenueShow}
                    onClick={() => setArticleMenueShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === '/superadmin/articleList' ||
                        location === '/superadmin/pendingList'
                          ? 'active'
                          : ''
                      }rmrounded`}
                    >
                      <Image src={article1} alt='Article' />
                      <Image src={article2} alt='Article' />
                      Article Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down'></i>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href='/superadmin/articleList'
                        className={`${
                          location === '/superadmin/articleList' ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist1} alt='ICon' />
                        <Image src={iconlist1} alt='ICon' /> Articles list
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href='/superadmin/pendingList'
                        className={`${
                          location === '/superadmin/pendingList' ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist2} alt='ICon' />
                        <Image src={iconlist2} alt='ICon' /> Pending articles
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.adminManagement && (
                <li>
                  <Dropdown
                    show={adminMenueShow}
                    onClick={() => setAdminMenueShow((pre) => !pre)}
                  >
                    <Dropdown.Toggle
                      variant='success'
                      id='dropdown-basic'
                      className={`${
                        location === '/superadmin/makeAdmin' ||
                        location === '/superadmin/trackAdmin'
                          ? 'active'
                          : ''
                      } rmrounded`}
                    >
                      <Image src={admin1} alt='admin' />
                      <Image src={admin2} alt='admin' />
                      Admin Management
                    </Dropdown.Toggle>
                    <i className='fa fa-angle-down'></i>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        href='/superadmin/makeAdmin'
                        className={`${
                          location === '/superadmin/makeAdmin' ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist3} alt='admin' />
                        <Image src={iconlist3} alt='admin' /> Make Admin
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        href='/superadmin/trackAdmin'
                        className={`${
                          location === '/superadmin/trackAdmin' ? 'active' : ''
                        }`}
                      >
                        <Image src={iconlist4} alt='admin' />
                        <Image src={iconlist4} alt='admin' /> Track Admin
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}
              {userAuth.userPerms?.adminManagement && (
                <li>
                  <Link
                    href='/superadmin/rewardManagement'
                    className={`${
                      location == '/superadmin/rewardManagement' ? 'active' : ''
                    }`}
                  >
                    <Image src={user1} alt='User' />
                    <Image src={user2} alt='User' /> Reward Management
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
