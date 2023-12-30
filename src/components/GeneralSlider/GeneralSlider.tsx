import React from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import generalpost1 from '@/assets/Img/event-5.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import generalpost2 from '@/assets/Img/event-6.png';
import iconcoin from '@/assets/Img/coin-image.png';

import Link from 'next/link';
import Image from 'next/image';
export default function GeneralSlider() {
  var Featued = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };
  return (
    <Slider {...Featued} lazyLoad='anticipated'>
      <div className='Post-padding'>
        <div className='general-post slider'>
          <Link href='#' className='img-pnl'>
            <Image src={generalpost1} alt='general post' />
          </Link>
          <div className='txt-pnl'>
            <Link href='#'>
              <h6>
                NPCI, Backed by Indian Central Bank, Initiates Blockchain Talent
                Search
              </h6>
            </Link>
            <p>
              Singapore, Malaysia, the UAE, France, Benelux nations, Nepal, and
              the U.K. Embrace… .
            </p>
            <ul className='thumb-list flex'>
              <li>
                <a href='#' className='mr-3'>
                  <Image src={iconthumb} alt='Icon Thumb' /> 11
                </a>
                <a href='#'>
                  <Image src={iconmessage} alt='Icon Comment' /> 12 Comments
                </a>
              </li>
              <li>
                <Image src={iconcoin} alt='Icon Comment' /> +500 NS24
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='Post-padding '>
        <div className='general-post slider'>
          <Link href='#' className='img-pnl'>
            <Image src={generalpost2} alt='general post' />
          </Link>
          <div className='txt-pnl'>
            <Link href='#'>
              <h6>
                NPCI, Backed by Indian Central Bank, Initiates Blockchain Talent
                Search
              </h6>
            </Link>
            <p>
              Singapore, Malaysia, the UAE, France, Benelux nations, Nepal, and
              the U.K. Embrace… .
            </p>
            <ul className='thumb-list flex'>
              <li>
                <a href='#' className='mr-3'>
                  <Image src={iconthumb} alt='Icon Thumb' /> 11
                </a>
                <a href='#'>
                  <Image src={iconmessage} alt='Icon Comment' /> 12 Comments
                </a>
              </li>
              <li>
                <Image src={iconcoin} alt='Icon Comment' /> +500 NS24
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='Post-padding'>
        <div className='general-post slider'>
          <Link href='#' className='img-pnl'>
            <Image src={generalpost1} alt='general post' />
          </Link>
          <div className='txt-pnl'>
            <Link href='#'>
              <h6>
                NPCI, Backed by Indian Central Bank, Initiates Blockchain Talent
                Search
              </h6>
            </Link>
            <p>
              Singapore, Malaysia, the UAE, France, Benelux nations, Nepal, and
              the U.K. Embrace… .
            </p>
            <ul className='thumb-list flex'>
              <li>
                <a href='#' className='mr-3'>
                  <Image src={iconthumb} alt='Icon Thumb' /> 11
                </a>
                <a href='#'>
                  <Image src={iconmessage} alt='Icon Comment' /> 12 Comments
                </a>
              </li>
              <li>
                <Image src={iconcoin} alt='Icon Comment' /> +500 NS24
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='Post-padding'>
        <div className='general-post slider'>
          <Link href='#' className='img-pnl'>
            <Image src={generalpost2} alt='general post' />
          </Link>
          <div className='txt-pnl'>
            <Link href='#'>
              <h6>
                NPCI, Backed by Indian Central Bank, Initiates Blockchain Talent
                Search
              </h6>
            </Link>
            <p>
              Singapore, Malaysia, the UAE, France, Benelux nations, Nepal, and
              the U.K. Embrace… .
            </p>
            <ul className='thumb-list flex'>
              <li>
                <a href='#' className='mr-3'>
                  <Image src={iconthumb} alt='Icon Thumb' /> 11
                </a>
                <a href='#'>
                  <Image src={iconmessage} alt='Icon Comment' /> 12 Comments
                </a>
              </li>
              <li>
                <Image src={iconcoin} alt='Icon Comment' /> +500 NS24
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Slider>
  );
}
