'use client';
import * as React from 'react';
// import { Sidebar } from 'flowbite-react';
import { useRouter } from 'next/navigation';

export default function DashSidebar() {
  const router = useRouter();
  const [tab, setTab] = React.useState('entries');

  const handleTabChange = (tab: string) => {
    if (tab === 'entries') {
      router.push('/dashboard');
    } else if (tab === 'profile') {
      router.push(`/profile`);
    } else {
      router.push(`/dashboard/${tab}`);
    }
    setTab(tab);
  };

  return (
  <>
  {/* <Sidebar aria-label='Default sidebar example' className='dashboard-sidebar'>
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item>
          <p>Champ</p>
        </Sidebar.Item>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        {sidebarItems.map(({ icon, name }) => {
          return (
            <Sidebar.Item
              key={name}
              // href='/dashboard/entries'
              icon={icon}
              onClick={() => handleTabChange(name)}
              className={tab === name ? 'active-bar' : 'pointer'}
              labelColor='dark'
            >
              <p>
                {name.slice(0, 1).toUpperCase() + name.slice(1, name.length)}
              </p>
            </Sidebar.Item>
          );
        })} */}
         {/* <Sidebar.Item
  //         // href='/dashboard/entries'
          icon={BiSolidFileBlank}
          onClick={() => handleTabChange('entries')}
          className={tab === 'entries' ? 'active-bar' : ''}
          labelColor='dark'
        >
          <p>Entries</p>
        </Sidebar.Item>{' '}
        <Sidebar.Item
          // href='/dashboard/nfts'
          icon={PiStarFourFill}
          onClick={() => handleTabChange('nfts')}
          className={tab === 'nfts' ? 'active-bar' : ''}
          labelColor='dark'
        >
          <p>NFTs</p>
        </Sidebar.Item>{' '}
        <Sidebar.Item
          // href='/dashboard/subscribers'
          icon={MdPeopleAlt}
          onClick={() => handleTabChange('subscribers')}
          className={tab === 'subscribers' ? 'active-bar' : ''}
          labelColor='dark'
        >
          <p>Subscribers</p>
        </Sidebar.Item>
        <Sidebar.Item
          // href='/dashboard/settings'
          icon={FaGear}
          onClick={() => handleTabChange('settings')}
          className={tab === 'settings' ? 'active-bar' : ''}
          labelColor='dark'
        >
          <p>Settings</p>
        </Sidebar.Item>
        <Sidebar.Item
          // href='/dashboard/profile'
          icon={BsFillPersonFill}
          onClick={() => handleTabChange('profile')}
          className={tab === 'profile' ? 'active-bar' : ''}
          labelColor='dark'
        >
          <p>Profile</p>
        </Sidebar.Item> */}
       {/* </Sidebar.ItemGroup>
     </Sidebar.Items>
   </Sidebar> */}
  </>
  )
}
