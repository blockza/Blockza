'use client';
import ButtonLink from '@/components/links/ButtonLink';
import * as React from 'react';
import { useEntriesStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
// import { getAllEntries } from '@/components/utils/ipfs';
import { Entry } from '@/types/dashboard';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { arrayBufferToImgSrc } from '@/dfx/utils/image';
import moment from 'moment';
import { Button } from 'react-bootstrap';
// import { getImage } from '@/components/utils/getImage';

export default function Entries() {
  const { entries, setEntries } = useEntriesStore((state) => ({
    entries: state.entries,
    setEntries: state.setEntries,
  }));
  const location = usePathname();
  const router = useRouter();

  const handleOpenEntry = (entry: Entry) => {
    router.push(`/entry?user=${entry[1].user}&id=${entry[0]}`);
  };

  React.useEffect(() => {
    const getEntries = async () => {
      const entryActor = makeEntryActor();
      const tempEntries = await entryActor.getAllEntries();
      setEntries(tempEntries);
    };
    getEntries();
  }, [location]);

  return (
    <>
      <div className='flex justify-end bg-white p-2'>
        <Button href='/write' variant='primary'>
          Create Entity
        </Button>
      </div>
      <div className='entries-container flex flex-col items-center gap-10 p-5'>
        {entries.map((entry: Entry) => {
          return (
            <div
              key={entry[0]}
              className='entry p-5 last:mb-16'
              onClick={() => handleOpenEntry(entry)}
            >
              <p className='title'>{entry[1].title}</p>
              <p className='description'>
                {moment
                  .utc(parseInt(entry[1].creation_time.toString()))
                  .format('MMMM Do, YYYY')}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
