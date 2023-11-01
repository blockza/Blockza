import React from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-3.png';
import post2 from '@/assets/Img/Posts/Post-4.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
export default function ReleaseSlider() {
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
  var Featued = {
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
    <>
      <Slider {...Featued}>
        <div className='Post-padding'>
          <Link href='#' className='Featured-Post press'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Image src={post1} alt='Post' />
              </div>
              <div className='txt-pnl'>
                <h2>Press Release</h2>
                <h5>Hong Kong FinTech Week 2023: “Fintech Redefined”</h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link href='#' className='Featured-Post press'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Link href='/'>
                  <Image src={post2} alt='Post' />
                </Link>
              </div>
              <div className='txt-pnl'>
                <h2>Press Release</h2>
                <h5>
                  Highstreet Redefines Metaverse Life Via Home Sales with
                  Animoca Brands
                </h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link href='#' className='Featured-Post press'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Image src={post1} alt='Post' />
              </div>
              <div className='txt-pnl'>
                <h2>Press Release</h2>
                <h5>Hong Kong FinTech Week 2023: “Fintech Redefined”</h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link href='#' className='Featured-Post press'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Link href='/'>
                  <Image src={post2} alt='Post' />
                </Link>
              </div>
              <div className='txt-pnl'>
                <h2>Press Release</h2>
                <h5>
                  Highstreet Redefines Metaverse Life Via Home Sales with
                  Animoca Brands
                </h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
              </div>
            </div>
          </Link>
        </div>
      </Slider>
    </>
  );
}
