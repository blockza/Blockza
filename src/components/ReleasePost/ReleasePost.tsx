import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/Posts/Small-Post-1.png';
import smallpost2 from '@/assets/Img/Posts/Small-Post-2.png';
import smallpost3 from '@/assets/Img/Posts/Small-Post-3.png';
export default function ReleasePost() {
  return (
    <>
      <div className='release-post'>
        <div className='release-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost1} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <span>October 22 - October 24</span>
            <h6>ETH Hong Kong 2023</h6>
            <p>Cyberport Connecting & Empowering Web3 Builders Cyberport 1, Cyberport Rd , Pok Fu Lam, Hong Kong</p>
          </div>
        </div>
      </div>
      <div className='release-post'>
        <div className='release-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost2} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <span>October 22 - October 24</span>
            <h6>Blockchain Life 2023
              Festival Arena</h6>
            <p>Dubai, Festival Arena Dubai, Festival Arena</p>
          </div>
        </div>
      </div>
      <div className='release-post'>
        <div className='release-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost3} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <span>November 1 - November 2</span>
            <h6>World Blockchain
              Summit 2023 </h6>
            <p>DUBAI MARINA Barsha Heights, Dubai, UAE Dubai Dubai 333851</p>
          </div>
        </div>
      </div>
      <div className='release-post'>
        <div className='release-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost1} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <span>October 22 - October 24</span>
            <h6>ETH Hong Kong 2023</h6>
            <p>Cyberport Connecting & Empowering Web3 Builders Cyberport 1, Cyberport Rd , Pok Fu Lam, Hong Kong</p>
          </div>
        </div>
      </div>
      {/* <div className='release-post'>
        <div className='release-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost2} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <span>October 22 - October 24</span>
            <h6>Blockchain Life 2023
              Festival Arena</h6>
            <p>Dubai, Festival Arena Dubai, Festival Arena</p>
          </div>
        </div>
      </div>
      <div className='release-post'>
        <div className='release-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={smallpost3} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <span>November 1 - November 2</span>
            <h6>World Blockchain
              Summit 2023 </h6>
            <p>DUBAI MARINA Barsha Heights, Dubai, UAE Dubai Dubai 333851</p>
          </div>
        </div>
      </div> */}
    </>
  );
}