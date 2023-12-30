'use client';

import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Entry } from '@/types/dashboard';

export default function HomeEntryCard({ entry }: any) {
  // const { allUsersEntries, setAllUsersEntries } = useEntriesStore((state) => ({
  //   allUsersEntries: state.allUsersEntries,
  //   setAllUsersEntries: state.setAllUsersEntries,
  // }));
  const location = usePathname();
  const router = useRouter();

  const handleOpenEntry = (entry: Entry) => {
    router.push(`/${entry[1].user}/${entry[0]}`);
  };

  return (
    <div className='max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800'>
      <a href='#'>
        <img
          className='rounded-t-lg'
          src='/docs/images/blog/image-1.jpg'
          alt=''
        />
      </a>
      <div className='p-5'>
        <a href='#'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {entry.title}
          </h5>
        </a>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          {entry.description}
        </p>
        <a
          href='#'
          className='inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Read more
          <svg
            className='ml-2 h-3.5 w-3.5'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 14 10'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M1 5h12m0 0L9 1m4 4L9 9'
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
