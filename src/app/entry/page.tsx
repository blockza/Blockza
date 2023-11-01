'use client';
import ButtonLink from '@/components/links/ButtonLink';
import * as React from 'react';
import { useEntriesStore } from '@/store/useStore';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import moment from 'moment';
import { Entry, RawEntry } from '@/types/dashboard';
import logger from '@/lib/logger';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { getImage } from '@/components/utils/getImage';
import Image from 'next/image';

export default function Entry() {
  const params = useParams();
  const [entry, setEntry] = React.useState<RawEntry>();
  const [image, setImage] = React.useState('');
  const searchParams = useSearchParams();

  // const getEntry = async () => {
  // axios
  //   .get('/entries/getById', {
  //     headers: {
  //       entryid: params.entry[1],
  //     },
  //   })
  //   .then(async (response) => {
  //     const tempEntry = response.data.data.entry;
  //     const path = tempEntry.metadata;
  //     const res = await oAxios.get(`https://ipfs.io/ipfs/${path}`);
  //     const obj = res.data;
  //     const utcDate = moment.utc(tempEntry.created_at);
  //     const formattedDate = utcDate.format('MMMM Do, YYYY');
  //     const newEntry = {
  //       id: tempEntry.id,
  //       user: tempEntry.user,
  //       title: obj.title,
  //       description: obj.description,
  //       createdAt: formattedDate,
  //     };
  //     setEntry(newEntry);
  //   })
  //   .catch((err) => logger(err));
  // };
  React.useEffect(() => {
    const id = searchParams.get('id');
    const getEntry = async () => {
      const entryActor = makeEntryActor();
      const tempEntry = await entryActor.getEntry(id);
      const tempImg = await getImage(tempEntry[0].image);
      console.log(tempImg);
      setImage(tempImg);
      setEntry(tempEntry);
    };
    getEntry();
  }, []);

  return (
    <>
      {entry ? (
        <div className='indv-entry container-fluid'>
          {image && (
            <div className='flex w-full items-center justify-center'>
              <Image fill={true} src={image} alt='' />
            </div>
          )}
          <div className='entry-title flex items-center justify-center'>
            {entry[0]?.title}
          </div>
          <div className='entry-text flex justify-center'>
            <div className='entry-description'>{entry[0]?.description}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
