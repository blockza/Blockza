import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Row, Col } from 'react-bootstrap';
import podcast from '@/assets/Img/Icons/icon-podcast-3.png';
import podcastuser from '@/assets/Img/Profile/Podcast.png';
export default function PodcastPost() {
  return (
    <>
      {/* <div className='Podcast-pnl scroll-anime'>
        <Row>
          <Col xl="12" lg="12" md="12"></Col>
          <div className='podcast-post'>
            <div className='text-pnl'>
              <h2>
                Podcasting
                <span>Simplified</span>
              </h2>
              <h5>
                Welcome to <b>NFTStudio24</b> Podcast! Explore the Web3 and blockchain world through success and failure stories from
                industry pioneers. Get inspired and informed in just minutes.
              </h5>
              <Link href="#" className='reg-btn big'>Subscribe now!</Link>
              <Link href="#" className='reg-btn big'><Image src={podcast} alt='podcast' /> Podcast</Link>
            </div>
            <div className='img-pnl'>
              <Image src={podcastuser} alt='podcast' />
            </div>
          </div>
        </Row>
      </div>
      <div className='full-div podcast-list'>
        <ul>
          <li>
            <Link href="#">
              <i className='fa fa-podcast'></i>
              <p>iTunes</p>
            </Link>
          </li>
          <li>
            <Link href="#">
              <i className='fa fa-soundcloud'></i>
              <p>Soundcloud</p>
            </Link>
          </li>
          <li>
            <Link href="#">
              <i className='fa fa-spotify'></i>
              <p>Spotify</p>
            </Link>
          </li>
          <li>
            <Link href="#">
              <i className='fa fa-google-plus-circle'></i>
              <p>Google</p>
            </Link>
          </li>
        </ul>
      </div> */}
      <div className='Podcast-pnl scroll-anime'>
        <Row>
          <Col xl='12' lg='12' md='12'></Col>
          <div className='podcast-post'>
            <div className='text-pnl'>
              <h2>
                Podcasting
                <span>Simplified</span>
              </h2>
              <h5>
                Welcome to <b>NFTStudio24</b> Podcast! Explore the Web3 and
                blockchain world through success and failure stories from
                industry pioneers. Get inspired and informed in just minutes.
              </h5>
              <Link href='#' className='reg-btn big'>
                Subscribe now!
              </Link>
              <Link href='#' className='reg-btn big'>
                <Image src={podcast} alt='podcast' /> Podcast
              </Link>
              <div className='full-div podcast-list'>
                <ul>
                  <li>
                    <Link href='#'>
                      <i className='fa fa-podcast'></i>
                      <p>iTunes</p>
                    </Link>
                  </li>
                  <li>
                    <Link href='#'>
                      <i className='fa fa-soundcloud'></i>
                      <p>Soundcloud</p>
                    </Link>
                  </li>
                  <li>
                    <Link href='#'>
                      <i className='fa fa-spotify'></i>
                      <p>Spotify</p>
                    </Link>
                  </li>
                  <li>
                    <Link href='#'>
                      <i className='fa fa-google-plus-circle'></i>
                      <p>Google</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='img-pnl'>
              <Image src={podcastuser} alt='podcast' />
            </div>
          </div>
        </Row>
      </div>
    </>
  );
}
