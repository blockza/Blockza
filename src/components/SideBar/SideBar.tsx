'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarItems } from '@/constant/dashboard';
import logger from '@/lib/logger';
export default function Sidebar() {
  const [toggle, settoggle] = React.useState(false);
  const [tab, setTab] = React.useState<string>('');
  const router = useRouter();
  const location = usePathname();
  React.useEffect(() => {
    const currentTab = location;

    setTab(currentTab);
  }, []);
  const toggleHandle = (event: any) => {
    logger('HI');
    settoggle(!toggle);
  };
  const handleTabChange = (tab: string) => {
    logger(tab);
    setTab(tab);
  }

  return (
    <>
      {/* <div className={toggle ? "sidebar active" : "sidebar"} onClickOutside={(e) => toggleHandle(e)}> */}
      <div className='sidebar' onClick={toggleHandle}>
        <button className='toggler'>
          <div>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <ul>
          {sidebarItems.map(({ icon, name, route }) => {
           
            
            return (
              <li className={tab === route ? 'active' : 'pointer'} key={name}>
               
                <Link href={`${route}`} onClick={() => handleTabChange(route)}>
                  <div className='img-pnl'>
                    <Image src={icon} alt='Entires icon' />
                  </div>
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
