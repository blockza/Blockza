'use client';
import ButtonLink from '@/components/links/ButtonLink';
import { getImage } from '@/components/utils/getImage';
import { Collection } from '@/dfx/declarations/temp/collection/collection.did';
import { makeCollectionActor } from '@/dfx/service/actor-locator';
import { CollectionObject, RawCollection } from '@/types/dashboard';
import * as React from 'react';

export default function NFTs() {
  const [collections, setCollections] = React.useState<CollectionObject[]>([]);

  React.useEffect(() => {
    const getAllCollections = async () => {
      const collectionActor = makeCollectionActor();
      const tempCollections = await collectionActor.getAllCollections();
      console.log(tempCollections);
      setCollections(tempCollections);
      // const tempImg = await getImage(tempEntry[0].image);
      // setImage(tempImg);
      // setEntry(tempEntry);
    };
    getAllCollections();
  }, []);

  return (
    <>
      <div className='flex justify-between bg-white px-2 py-3'>
        <p className='header-title'>NFT Collections</p>
        <ButtonLink href='/dashboard/nfts/create' variant='primary'>
          Create Collection
        </ButtonLink>
      </div>
      {collections.length <= 0 ? (
        <div className='flex h-full w-full items-center justify-center '>
          <div className='flex  max-w-sm flex-col gap-4 rounded-3xl bg-white px-6 py-8'>
            <p className='text-center text-2xl font-semibold'>
              New NFT Collection
            </p>
            <p className='text-center opacity-40'>
              Create an NFT collection for your community to mint.
            </p>
            <ButtonLink
              href='/dashboard/nfts/create'
              className='flex justify-center rounded-xl py-3'
              variant='primary'
            >
              Create NFT Collection
            </ButtonLink>
            <ButtonLink
              href='/dashboard/nfts'
              className='flex justify-center rounded-xl bg-gray-200 py-3 text-black'
              variant='ghost'
            >
              Learn More
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className='flex h-full w-full  '>
          {collections &&
            collections.map((collectionObject: CollectionObject) => {
              const collection = collectionObject[1];
              const img = getImage(collection.image);
              console.log(collection);
              return (
                <div className='m-2 flex max-h-64  flex-col items-center border-2 bg-white p-4 '>
                  <div className='h-32'>
                    <img src={img} alt='' className='h-full w-full' />
                  </div>
                  <div className='text-center'>
                    <p className='mt-2 text-xl font-semibold'>
                      {collection.name}
                    </p>
                    <p className='mt-2 w-48 text-sm opacity-75'>
                      {collection.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
