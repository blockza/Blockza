'use client';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Blocked() {
  const { userAuth } = useConnectPlugWalletStore((state) => ({
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const router = useRouter();
  useEffect(() => {
    if (!userAuth.status) {
      router.replace('/');
    }
  }, [userAuth]);
  return (
    <>
      <main id='main'>
        <div className='main-inner d-flex justify-content-center mt-5  p-5'>
          <p className='fw-bold h3 text-center'>
            Your account has been blocked by an administrator. Kindly reach out
            to the admin to submit an appeal for unblocking
          </p>
        </div>
      </main>
    </>
  );
}
