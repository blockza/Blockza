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
          <Link href='#' className='Product-post'>
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image src={bgimg} alt='Logo' />
              </div>
              <div className='text-pnl'>
                <div className='flex-div-sm'>
                  <div className='logo-img'>
                    <Image src={sublogo} alt='Logo' />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Afropolitan</h3>
                    <p>
                      Afropolitan is creating a Digital Nation to enable all
                      Africans to build abundant ...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>Afrocentric and innovative. Really dig the logo too</p>
                  <div className='img-pl'>
                    <Image src={girl} alt='Girl' />
                    <h5>Salome Ogbolu</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>2</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>250</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>1950</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>{' '}
        <div className='Post-padding'>
          <Link href='#' className='Product-post'>
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image src={bgimg} alt='Logo' />
              </div>
              <div className='text-pnl'>
                <div className='flex-div-sm'>
                  <div className='logo-img'>
                    <Image src={sublogo} alt='Logo' />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Afropolitan</h3>
                    <p>
                      Afropolitan is creating a Digital Nation to enable all
                      Africans to build abundant ...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>Afrocentric and innovative. Really dig the logo too</p>
                  <div className='img-pl'>
                    <Image src={girl} alt='Girl' />
                    <h5>Salome Ogbolu</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>2</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>250</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>1950</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link href='#' className='Product-post'>
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image src={bgimg} alt='Logo' />
              </div>
              <div className='text-pnl'>
                <div className='flex-div-sm'>
                  <div className='logo-img'>
                    <Image src={sublogo} alt='Logo' />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Afropolitan</h3>
                    <p>
                      Afropolitan is creating a Digital Nation to enable all
                      Africans to build abundant ...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>Afrocentric and innovative. Really dig the logo too</p>
                  <div className='img-pl'>
                    <Image src={girl} alt='Girl' />
                    <h5>Salome Ogbolu</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>2</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>250</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>1950</b>
                    <span>Upvotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
        <div className='Post-padding'>
          <Link href='#' className='Product-post'>
            <div className='Product-post-inner'>
              <div className='img-pnl'>
                <Image src={bgimg} alt='Logo' />
              </div>
              <div className='text-pnl'>
                <div className='flex-div-sm'>
                  <div className='logo-img'>
                    <Image src={sublogo} alt='Logo' />
                  </div>
                  <div className='heading-txt-pnl'>
                    <h3>Afropolitan</h3>
                    <p>
                      Afropolitan is creating a Digital Nation to enable all
                      Africans to build abundant ...
                    </p>
                  </div>
                </div>
                <div className='txt-pnl'>
                  <p>Afrocentric and innovative. Really dig the logo too</p>
                  <div className='img-pl'>
                    <Image src={girl} alt='Girl' />
                    <h5>Salome Ogbolu</h5>
                  </div>
                </div>
                <ul>
                  <li>
                    <b>2</b>
                    <span>Posts</span>
                  </li>
                  <li>
                    <b>250</b>
                    <span>Reviews</span>
                  </li>
                  <li>
                    <b>1950</b>
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
