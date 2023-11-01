import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/Posts/Small-Post-7.png';
import smallpost2 from '@/assets/Img/Posts/Small-Post-8.png';
import smallpost3 from '@/assets/Img/Posts/Small-Post-9.png';
export default function ArticlesPost() {
  return (
    <>

      <div className='Article-post'>
        <div className='Article-post-inner'>
          <span>01</span>
          <div className='img-pnl'>
            <Link href="/"> <Image src={smallpost1} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <p>
              Meta vs. OpenAI:
              The Race to Create the
              Ultimate AI Model
            </p>
          </div>
        </div>
      </div>
      <div className='Article-post'>
        <div className='Article-post-inner'>
          <span>02</span>
          <div className='img-pnl'>
            <Link href="/"> <Image src={smallpost2} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <p>
              DFINITY’s $20M Grant Initiative Powers ICP Asia Alliance for...
            </p>
          </div>
        </div>
      </div>
      <div className='Article-post'>
        <div className='Article-post-inner'>
          <span>03</span>
          <div className='img-pnl'>
            <Link href="/"> <Image src={smallpost3} alt="Post" /></Link>
          </div>
          <div className='txt-pnl'>
            <p>
              Aptos Ventures Abroad: Navigating Global....
            </p>
          </div>
        </div>
      </div>
    </>
  );
}