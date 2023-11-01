import React from 'react';
import { Button } from 'react-bootstrap';
import post1 from "@/assets/Img/Posts/video-1.png";
import Link from 'next/link';
import Image from 'next/image';
export default function VideoPost() {
  return (
    <>
      <div className='Video-post'>
        <div className='Video-post-inner'>
          <div className='img-pnl'>
            <Link href="/"><Image src={post1} alt="Post" /></Link>
            <Button className="play-btn"><i className='fa fa-play-circle-o'></i></Button>
          </div>
          <div className='txt-pnl'>
            <h5>HYPERVIEW: It's Estelle Flores World, We're Just Living In It</h5>
            <div className='flex-div'>
              <span>2 m 25s <i className='fa fa-clock-o'></i></span>
              <span>September 30</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}