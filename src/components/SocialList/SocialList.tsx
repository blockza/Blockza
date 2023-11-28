import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SocialList() {
  return (
    <>
      <ul className='social-list'>
        <li>
          <Link
            href='https://coinmarketcap.com/community/profile/NFTStudio24'
            target='_blank'
          >
            <i className='fa fa-envelope'></i>
          </Link>
        </li>
        <li>
          <a href='https://twitter.com/nftstudio24' target='_blank'>
            <i className='fa fa-twitter'></i>
          </a>
        </li>
        <li>
          <Link href='https://t.me/NFTStudio24_official' target='_blank'>
            <i className='fa fa-telegram'></i>
          </Link>
        </li>
        <li>
          <Link
            href='https://www.linkedin.com/company/nftstudio24-com?trk=public_profile_experience-item_profile-section-card_image-click&originalSubdomain=ng'
            target='_blank'
          >
            <i className='fa fa-linkedin-square'></i>
          </Link>
        </li>
        <li>
          <Link href='https://www.youtube.com/@nftstudio24' target='_blank'>
            <i className='fa fa-youtube-play'></i>
          </Link>
        </li>
        <li>
          <Link href='https://www.instagram.com/nftstudio24/' target='_blank'>
            <i className='fa fa-instagram'></i>
          </Link>
        </li>
      </ul>
    </>
  );
}
