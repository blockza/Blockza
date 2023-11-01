import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SocialList() {
  return (
    <>
      <ul className='social-list'>
        <li>
          <Link href="/" target="_blank">
            <i className='fa fa-envelope'></i>
          </Link>
        </li>
        <li>
          <Link href="/" target="_blank">
            <i className='fa fa-twitter'></i>
          </Link>
        </li>
        <li>
          <Link href="/" target="_blank">
            <i className='fa fa-telegram'></i>
          </Link>
        </li>
        <li>
          <Link href="/" target="_blank">
            <i className='fa fa-linkedin-square'></i>
          </Link>
        </li>
        <li>
          <Link href="/" target="_blank">
            <i className='fa fa-youtube-play'></i>
          </Link>
        </li>
        <li>
          <Link href="/" target="_blank">
            <i className='fa fa-instagram'></i>
          </Link>
        </li>
      </ul>
    </>
  );
}