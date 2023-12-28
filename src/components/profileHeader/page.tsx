'use client';
import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';
import * as React from 'react';

export default function ProfileHeader() {
  const [tab, setTab] = React.useState('entries');
  const [user, setUser] = React.useState({
    name: '',
    email: '',
  });

  React.useEffect(() => {
    const getUser = async () => {
      // const res = await axios.get('/users/profile');
      const data = { name: 'dummy Name', email: 'dummy Email' };
      setUser({
        name: data.name,
        email: data.email,
      });
    };
    getUser();

    return () => {
      getUser();
    };
  }, []);

  return (
    <>
      <div className='flex justify-between border-b border-b-gray-200 bg-white px-2 py-3'>
        <p className='header-title'>Mirror</p>
        <ButtonLink href='/write' variant='primary'>
          + Create
        </ButtonLink>
      </div>
      <div className=' w-full bg-gray-100'>
        <div className='mx-auto h-full w-full max-w-screen-2xl'>
          <div className='aspect-custom max-h-80 w-full bg-blue-500'></div>
          <div className='relative aspect-video max-h-80 w-full bg-white'>
            <div className='profile-position absolute'>
              <div className='conatiner flex flex-col items-center'>
                <img
                  src='https://mirror-media.imgix.net/publication-images/EOShsg30kAZB-qeyLW6t7.jpg?h=797&w=1280'
                  className='box-content h-16 w-16 rounded-full border-4 border-white  md:h-20 md:w-20 md:border-4 lg:h-28 lg:w-28 lg:border-8'
                  alt=''
                />
                <p className='mb-2 text-center text-3xl font-semibold'>
                  {user.name ? user.name : 'Hlte'}
                </p>
                <p className='mb-3 w-fit rounded-lg bg-gray-100 px-2 text-gray-500'>
                  {user.email.slice(0, 5)}
                </p>
                <Button
                  className='border-0 bg-gray-200 hover:border-0 '
                  variant='light'
                >
                  Edit Profile
                </Button>
              </div>
            </div>
            <div className='absolute bottom-0 flex w-full justify-center gap-4 '>
              {['entries', 'collections'].map((x,index) => {
                return (
                  
                  <p
                  key={index}
                    className={
                      tab === x
                        ? 'cursor-pointer border-b-2 border-b-blue-500 pb-2 font-semibold text-blue-500'
                        : 'cursor-pointer pb-2 font-semibold text-gray-600'
                    }
                    onClick={() => setTab(x)}
                  >
                    {x.slice(0, 1).toUpperCase() + x.slice(1, x.length)}
                  </p>
                  );
              })}
              {/* <p
                className={
                  tab === 'entries'
                    ? 'cursor-pointer border-b-2 border-b-blue-500 pb-2 font-semibold text-blue-500'
                    : 'cursor-pointer pb-2 font-semibold text-gray-600'
                }
                onClick={() => setTab('entries')}
              >
                Entries
              </p>
              <p
                className={
                  tab === 'collections'
                    ? 'cursor-pointer border-b-2 border-b-blue-500 pb-2 font-semibold text-blue-500'
                    : 'cursor-pointer pb-2 font-semibold text-gray-600'
                }
                onClick={() => setTab('collections')}
              >
                Collections
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
