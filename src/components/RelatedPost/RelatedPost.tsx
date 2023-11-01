import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/Posts/Small-Post-4.png';
import smallpost2 from '@/assets/Img/Posts/Small-Post-5.png';
import smallpost3 from '@/assets/Img/Posts/Small-Post-6.png';
export default function RelatedPost() {
  return (
    <>
      <div className='related-post'>
        <div className='related-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost1} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <Link href="#">Web3 Gaming and Esports: The Rise of African Gaming
              Communities</Link>
            <p>by Michael Saturday</p>
            <span>Oct 20, 2023</span>
          </div>
        </div>
      </div><div className='related-post'>
        <div className='related-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost2} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <Link href="#">NFTs and African Art: Empowering Creativity in the
              Digital Age</Link>
            <p>by Michael Saturday</p>
            <span>Oct 20, 2023</span>
          </div>
        </div>
      </div><div className='related-post'>
        <div className='related-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost3} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <Link href="#">Announcing the Scholarship Programme for African
              women by SCA x GWG</Link>
            <p>by Michael Saturday</p>
            <span>Oct 20, 2023</span>
          </div>
        </div>
      </div>
    </>
  );
}