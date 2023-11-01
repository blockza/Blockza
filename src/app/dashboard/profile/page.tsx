'use client';
import ButtonLink from '@/components/links/ButtonLink';
import * as React from 'react';

export default function Profile() {
  return (
    <div className='flex justify-between bg-white px-2 py-3'>
      <p className='header-title'>Profile</p>
      <ButtonLink href='/write' variant='primary'>
        Create Collection
      </ButtonLink>
    </div>
  );
}
