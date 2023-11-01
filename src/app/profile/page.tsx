'use client';
import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEntriesStore } from '@/store/useStore';
import { Entry } from '@/types/dashboard';
// import { getAllEntries } from '@/components/utils/ipfs';

export default function Profile() {
  const { entries, setEntries } = useEntriesStore((state) => ({
    entries: state.entries,
    setEntries: state.setEntries,
  }));
  const location = usePathname();
  const router = useRouter();

  const handleOpenEntry = (entry: Entry) => {
    router.push(`/${entry.user}/${entry.id}`);
  };

  // React.useEffect(() => {
  //   const getEntries = async () => {
  //   const tempEntries = await getAllEntries();

  //     setEntries(tempEntries);
  //   };
  //   getEntries();
  // }, [location]);

  return (
    <>
      <div className='w-full bg-gray-100'>
        <div className='container'>
          <div className='max-w-sm '>
            <div className='card-custom flex w-full flex-col rounded-2xl bg-white '>
              <div className='p-8'>
                <h3 className='aspect-2\1'>Test Title</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
