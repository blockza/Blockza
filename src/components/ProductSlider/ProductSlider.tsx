import React from 'react';
import bgimg from '@/assets/Img/Posts/bg-post.png';
import sublogo from '@/assets/Img/Logo/sub-logo.png';
import girl from '@/assets/Img/Icons/icon-girl.png';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
export default function ProductSlider() {
  var Product = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1199,
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
    <>
      <Slider {...Product} lazyLoad='anticipated'>
        <div className='Post-padding'>
          <Link
            href='https://nftstudio24.com/news/cryptopedia/blockchain-news/'
            className='Product-post'
          >
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image
                  src={'/images/b-b.png'}
                  width={213}
                  height={78}
                  alt='Logo'
                />
              </div>
              <div className='text-pnl'>
                <div className='d-flex'>
                  <div className='logo-img'>
                    <Image
                      src={'/images/l-b.png'}
                      width={15}
                      height={16}
                      alt='Logo'
                    />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Binance</h3>
                    <p style={{ minHeight: 84 }}>
                      Binance Contemplates US Exchange Closure Amidst Global
                      Concern
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>
                    The general population should exercise caution while
                    using...
                  </p>
                  <div className='img-pl'>
                    <Image
                      src={'/images/l-n.png'}
                      width={20}
                      height={20}
                      alt='Girl'
                    />
                    <h5>NFTStudio 24</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>2</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>345</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>2213</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>{' '}
        <div className='Post-padding'>
          <Link
            href='https://nftstudio24.com/news/cryptopedia/blockchain-news/'
            className='Product-post'
          >
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image
                  src={'/images/b-s.png'}
                  width={213}
                  height={78}
                  alt='Logo'
                />
              </div>
              <div className='text-pnl'>
                <div className='d-flex'>
                  <div className='logo-img'>
                    <Image
                      src={'/images/ls.png'}
                      width={20}
                      height={20}
                      alt='Logo'
                    />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Solana</h3>
                    <p style={{ minHeight: 84 }}>
                      Solana Blockchain Enables OpenAI’s ChatGPT Plugin for
                      Enhanced User...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>
                    The general population should exercise caution while
                    using...
                  </p>
                  <div className='img-pl'>
                    <Image
                      src={'/images/l-n.png'}
                      width={20}
                      height={20}
                      alt='Girl'
                    />
                    <h5>NFTStudio 24</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>3</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>350</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>2950</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link
            href='https://nftstudio24.com/news/cryptopedia/blockchain-news/'
            className='Product-post'
          >
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image
                  src={'/images/b-e.png'}
                  width={213}
                  height={78}
                  alt='Logo'
                />
              </div>
              <div className='text-pnl'>
                <div className='d-flex'>
                  <div className='logo-img'>
                    <Image
                      src={'/images/l-e.png'}
                      width={20}
                      height={20}
                      alt='Logo'
                    />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Etherium</h3>
                    <p style={{ minHeight: 84 }}>
                      Crypto ETF Expert Predicts All Spot Bitcoin ETF
                      Applications...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>
                    The general population should exercise caution while
                    using...
                  </p>
                  <div className='img-pl'>
                    <Image
                      src={'/images/l-n.png'}
                      width={20}
                      height={20}
                      alt='Girl'
                    />
                    <h5>NFTStudio 24</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>4</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>123</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>1356</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link
            href='https://nftstudio24.com/news/cryptopedia/blockchain-news/'
            className='Product-post'
          >
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image
                  src={'/images/b-a.png'}
                  width={213}
                  height={78}
                  alt='Logo'
                />
              </div>
              <div className='text-pnl'>
                <div className='d-flex'>
                  <div className='logo-img'>
                    <Image
                      src={'/images/l-a.png'}
                      width={20}
                      height={20}
                      alt='Logo'
                    />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Aptos</h3>
                    <p style={{ minHeight: 84 }}>
                      Aptos Ventures Abroad: Navigating Global Markets in the
                      Web3 and...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>
                    The general population should exercise caution while
                    using...
                  </p>
                  <div className='img-pl'>
                    <Image
                      src={'/images/l-n.png'}
                      width={20}
                      height={20}
                      alt='Girl'
                    />
                    <h5>NFTStudio 24</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>4</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>123</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>1356</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </Slider>
    </>
  );
}
