'use client';
import Button from '@/components/buttons/Button';
import { ConnectPlugWallet } from '@/components/utils/connection';
import logger from '@/lib/logger';
import * as React from 'react';
import { toast } from 'react-toastify';
import { uploadOnIpfs } from '@/components/utils/ipfs';
import { object, string, mixed } from 'yup';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import {
  makeCollectionActor,
  makeEntryActor,
} from '@/dfx/service/actor-locator';

export default function CreateNFT() {
  const MAX_FILE_SIZE = 2002400; //100KB

  const validFileExtensions: any = {
    image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
  };

  function isValidFileType(fileName: any, fileType: any) {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
    );
  }

  const collectionSchema = object({
    name: string().required(),
    description: string().required(),
    img: mixed()
      .required('Required')
      .test('is-valid-type', 'Not a valid image type', (value: any) =>
        isValidFileType(value && value.name.toLowerCase(), 'image')
      )
      .test(
        'is-valid-size',
        'Max allowed size is 100KB',
        (value: any) => value && value.size <= MAX_FILE_SIZE
      ),
  });

  const [collection, setCollection] = React.useState({
    name: '',
    description: '',
    img: undefined,
  });
  const [tempImg, setTempImg] = React.useState({ imgName: '', imgUrl: '' });

  const handleClose = () => {
    setCollection({
      name: '',
      description: '',
      img: undefined,
    });
    setTempImg({
      imgName: '',
      imgUrl: '',
    });
  };

  const handleChange = (e: any) => {
    setCollection((prev) => {
      return { ...prev, [e.target?.name]: e.target?.value };
    });
    return true;
  };
  const handleImageChange = (e: any) => {
    const img = e.target.files[0];
    const imgUrl = URL.createObjectURL(img);
    setTempImg({
      imgName: img.name,
      imgUrl,
    });
    setCollection((prev) => {
      return { ...prev, [e.target.name]: img };
    });
  };

  const handleCreate = async () => {
    let error = undefined;
    await collectionSchema.validate(collection).catch((err) => {
      toast.error(err.errors[0], {
        autoClose: 3000,
      });
      error = err.errors[0];
    });
    if (error || collection.img === null) {
      return;
    }
    const fileArray = await fileToCanisterBinaryStoreFormat(collection.img);
    const inputCollection = {
      name: collection.name,
      user: 'abdull213',
      description: collection.description,
      image: fileArray,
      subscription: false,
    };
    const collectionActor = makeCollectionActor();
    collectionActor
      .insertCollection(inputCollection)
      .then(() => {
        toast.success('Collection Added successfuly');
        handleClose();
      })
      .catch((err: string) => toast.error(err));
    // const response = await ConnectPlugWallet();
    // const connected = response.success;
    // if (!connected) {
    //   return toast.error(response.msg);
    // }
    // const img = collection.img;
    // const link = await uploadOnIpfs(
    //   { name: collection.name, description: collection.description },
    //   img
    // );
    // axios
    //   .post('/collections/createCollection', {
    //     metadata: link,
    //   })
    //   .then((res) => {
    //     toast.success('Created Collection');
    //     handleClose();
    //   });
  };
  return (
    <>
      <div className='flex h-full w-full items-center justify-center p-6'>
        <div className='w-full max-w-3xl'>
          <p className='mb-3 text-3xl font-semibold'>Collection Setup</p>
          <p className='mb-5 text-xl font-medium opacity-60'>
            Create an ERC1155 collection that will contain your NFTs.
          </p>
          <div className='mb-4 flex flex-col gap-6 rounded-3xl bg-white p-6'>
            <div className='flex flex-col gap-2'>
              <p className='text-2xl font-semibold'>Collection image</p>
              <p className='opacity-60'>Upload a collection image.</p>

              <label
                className='flex w-full items-center gap-5 rounded-xl border-2 border-gray-300 p-5 opacity-70'
                htmlFor='file_input'
              >
                <div className='icon'>
                  <img
                    src={
                      tempImg.imgUrl !== ''
                        ? tempImg.imgUrl
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJgO12xqOwt3vcZwldiNXl7oO7H_l5-DzUyN7_6U&s'
                    }
                    className='w-20'
                    alt=''
                  />
                </div>
                <div className='text'>
                  <p className=''>
                    {' '}
                    {tempImg.imgName !== ''
                      ? tempImg.imgName
                      : 'Upload a file or drag and drop'}
                  </p>
                </div>
              </label>
              <input
                className='hidden w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
                id='file_input'
                // value={collection.img}
                onChange={(e) => handleImageChange(e)}
                name='img'
                type='file'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-2xl font-semibold'>Name</p>
              <p className='opacity-60'>The Name of the collection.</p>
              <input
                type='text'
                placeholder='Collection name'
                className='rounded-md border-gray-300 p-3 opacity-70'
                value={collection.name}
                onChange={(e) => handleChange(e)}
                name='name'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-2xl font-semibold'>Description</p>
              <p className='opacity-60'>
                A brief description of the collection.
              </p>
              <input
                type='text'
                placeholder='Collection description'
                className='rounded-md border-gray-300 p-3 opacity-70'
                value={collection.description}
                onChange={(e) => handleChange(e)}
                name='description'
              />
            </div>
          </div>
          <Button
            onClick={handleCreate}
            className='hover:border-1 flex w-full justify-center rounded-xl border-0 py-4 opacity-80 hover:border-0 disabled:bg-gray-300 disabled:text-gray-600'
          >
            Create Collection
          </Button>
        </div>
      </div>
    </>
  );
}
