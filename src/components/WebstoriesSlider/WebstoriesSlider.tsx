import React from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/stories-1.png';
import post2 from '@/assets/Img/Posts/stories-2.png';
import post3 from '@/assets/Img/Posts/stories-3.png';
import post4 from '@/assets/Img/Posts/stories-4.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
export default function WebstoriesSlider() {
  // const responsive = {
  //   desktop: {
  //     breakpoint: { max: 3000, min: 992 },
  //     items: 2
  //   },
  //   tablet: {
  //     breakpoint: { max: 991, min: 767 },
  //     items: 2
  //   },
  //   mobile: {
  //     breakpoint: { max: 767, min: 0 },
  //     items: 1
  //   }
  // };
  var Webstories = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
    <Slider {...Webstories} lazyLoad='anticipated'>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post1} alt='Post' />
              <h2>Why is everyone obsessed with...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Jan 12, 2023</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post2} alt='Post' />
              <h2>What is Blockchain Security: Everything...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Dec 30, 2022</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post3} alt='Post' />
              <h2>TON Blockchain: The Complete Guide 2023...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Dec 29, 2022</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post4} alt='Post' />
              <h2>How to transfer Crypto from Freewell to...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Dec 30, 2022</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post1} alt='Post' />
              <h2>Why is everyone obsessed with...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Jan 12, 2023</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post2} alt='Post' />
              <h2>What is Blockchain Security: Everything...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Dec 30, 2022</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post3} alt='Post' />
              <h2>TON Blockchain: The Complete Guide 2023...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Dec 29, 2022</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn'
              >
                Coming Soon
              </Link>
            </div>
            <Link
              href='/'
              style={{
                pointerEvents: 'none',
              }}
              className='img-pnl'
            >
              <Image src={post4} alt='Post' />
              <h2>How to transfer Crypto from Freewell to...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>On Dec 30, 2022</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
    </Slider>
  );
}
