'use client';

import * as React from 'react';
import '@/styles/globals.css';
// import 'flowbite';
import 'react-toastify/dist/ReactToastify.css';
import { useEntriesStore } from '@/store/useStore';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Entry } from '@/types/dashboard';
// import { getAllUsersEntries } from '@/components/utils/ipfs';
import HomeEntryCard from '@/components/HomeEntryCard/page';

export default function HomeEntries() {
  const { allUsersEntries, setAllUsersEntries } = useEntriesStore((state) => ({
    allUsersEntries: state.allUsersEntries,
    setAllUsersEntries: state.setAllUsersEntries,
  }));
  const location = usePathname();
  const router = useRouter();

  const handleOpenEntry = (entry: Entry) => {
    router.push(`/${entry[1].user}/${entry[0]}`);
  };

  // React.useEffect(() => {
  //   const getAllEntries = async () => {
  //     const tempEntries = await getAllUsersEntries(10, 0);
  //     logger('Entries', tempEntries);
  //     setAllUsersEntries(tempEntries);
  //   };
  //   // logger(allUsersEntries);
  //   getAllEntries();
  // }, [location]);

  return (
    <div className='container'>
      {allUsersEntries.map((entry: Entry,index:number) => {
        return <HomeEntryCard entry={entry} key={index}/>;
      })}
    </div>
  );
}
