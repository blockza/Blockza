import React from 'react';
import post1 from '@/assets/Img/Posts/stories-1.png';
import post2 from '@/assets/Img/Posts/stories-2.png';
import post3 from '@/assets/Img/Posts/stories-3.png';
import post4 from '@/assets/Img/Posts/stories-4.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import Link from 'next/link';
import Image from 'next/image';
import { Col } from 'react-bootstrap';
export default function StoriesPost() {
  return (
    <>
      {/* <Col xl="3" lg="6" md="6" sm="12">
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link href='#' className='story-btn'>
                Story
              </Link>
            </div>
            <Link href='/' className='img-pnl'>
              <Image src={post1} alt='Post' />
              <h2>Why is everyone obsessed with...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>September 30</li>
              </ul>
            </Link>
          </div>
        </div>
      </Col>
      <Col xl="3" lg="6" md="6" sm="12">
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link href='#' className='story-btn'>
                Story
              </Link>
            </div>
            <Link href='/' className='img-pnl'>
              <Image src={post2} alt='Post' />
              <h2>The Complete Guide 2023...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>September 30</li>
              </ul>
            </Link>
          </div>
        </div>
      </Col>
      <Col xl="3" lg="6" md="6" sm="12">
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link href='#' className='story-btn'>
                Story
              </Link>
            </div>
            <Link href='/' className='img-pnl'>
              <Image src={post3} alt='Post' />
              <h2>What is  Blockchain Security: Everything...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>September 30</li>
              </ul>
            </Link>
          </div>
        </div>
      </Col>
      <Col xl="3" lg="6" md="6" sm="12">
        <div className='Stories-post'>
          <div className='Stories-post-inner'>
            <div className='top-span'>
              <span className='span-logo'>
                <Image className='post-logo' src={logo} alt='Logo' />
              </span>
              <Link href='#' className='story-btn'>
                Story
              </Link>
            </div>
            <Link href='/' className='img-pnl'>
              <Image src={post4} alt='Post' />
              <h2>How to transfer Crypto from Freewell to...</h2>
              <ul>
                <li>Buy NFT Studio 24</li>
                <li>September 30</li>
              </ul>
            </Link>
          </div>
        </div>
      </Col> */}

      <ul className='stories-list'>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post1} alt='Post' />
                <h2>Why is everyone obsessed with...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post2} alt='Post' />
                <h2>The Complete Guide 2023...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post3} alt='Post' />
                <h2>What is Blockchain Security: Everything...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post4} alt='Post' />
                <h2>How to transfer Crypto from Freewell to...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post1} alt='Post' />
                <h2>Why is everyone obsessed with...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post2} alt='Post' />
                <h2>The Complete Guide 2023...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <div className='Stories-post'>
            <div className='Stories-post-inner'>
              <div className='top-span'>
                <span className='span-logo'>
                  <Image className='post-logo' src={logo} alt='Logo' />
                </span>
                <Link href='#' className='story-btn'>
                  Story
                </Link>
              </div>
              <Link href='/' className='img-pnl'>
                <Image src={post3} alt='Post' />
                <h2>What is Blockchain Security: Everything...</h2>
                <ul>
                  <li>Buy NFT Studio 24</li>
                  <li>September 30</li>
                </ul>
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
