'use client';
import React from 'react';
import Head from 'next/head';
import {
  Row,
  Col
} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import smallpost1 from '@/assets/Img/event-1.png';
import smallpost2 from '@/assets/Img/event-2.png';
import smallpost3 from '@/assets/Img/event-3.png';
import smallpost4 from '@/assets/Img/event-4.png';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function AllArticles() {

  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section text-left' id='top'>
            <Row>
              <Col xl='12' lg='12' className='text-right'>
                <div className='search-post-pnl'>
                  <input type='text' placeholder='Search Posts' />
                  <button>
                    <i className='fa fa-search'></i>
                  </button>
                </div>
              </Col>
              <Col xl="12" lg="12">
                <Row>
                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className="spacer-20"></div>
                    <Link className="upcoming-btn" href="#">Upcoming <i className="fa fa-angle-down"></i></Link>
                    <div className="spacer-40"></div>
                  </Col>
                </Row>
                <Row>
                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className="list-headiung">
                      <h4>November 2023</h4>
                    </div>
                  </Col>
                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className='release-post big'>
                      <div className='release-post-inner'>
                        <div className='txt-pnl'>
                          <span>November 16, 2023</span>
                          <h6>WikiFinance EXPO Sydney 2023</h6>
                          <p>
                            The Fullerton Hotel Sydney No. 1 Martin Place, Sydney NSW 2000, Australia The Fullerton Hotel Sydney, No. 1 Martin Place,, Sydney NSW 2000 , Australia, Australia
                          </p>
                          <p>
                            Are you ready to embark on a journey of discovery and learning? Don't miss the WikiExpo SYDNEY 2023, the premier event for knowledge enthusiasts!
                          </p>
                        </div>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost1} alt="Post" /></Link>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className='release-post big'>
                      <div className='release-post-inner'>
                        <div className='txt-pnl'>
                          <span>November 21 - November 22</span>
                          <h6>World Tokenization Summit | RWA |
                            Tokenization Event in Dubai</h6>
                          <p>
                            Dubai, United Arab Emirates Dubai United Arab Emirates
                          </p>
                          <p>
                            Are you ready to embark on a thrilling journey into the world of tokenization? Join us for a one-of-a-kind event that will revolutionize the way you perceive real-world assets. The Global Tokenization Extravaganza is here to ignite your imagination and empower you with the knowledge and connections to shape the future.
                          </p>
                        </div>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost2} alt="Post" /></Link>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className="list-headiung">
                      <h4>December 2023</h4>
                    </div>
                  </Col>
                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className='release-post big'>
                      <div className='release-post-inner'>
                        <div className='txt-pnl'>
                          <span>December 11 - December 12</span>
                          <h6>12th Global Blockchain Congress,
                            UAE, Dubai 2023</h6>
                          <p>
                            InterContinental Dubai Festival City InterContinental, Festival City ,Dubai
                          </p>
                          <p>
                            Are you ready for an exciting and transformative event in the world of blockchain? Look no further than the 12th Global Blockchain Congress, happening on December 11th and 12th, 2023,
                          </p>
                        </div>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost3} alt="Post" /></Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className='release-post big'>
                      <div className='release-post-inner'>
                        <div className='txt-pnl'>
                          <span>December 11  - December 16 </span>
                          <h6>TAIPEI BLOCKCHAIN WEEK 2023</h6>
                          <p>
                            Songshan Cultural & Creative Park No. 133, Guangfu S Rd, Xinyi District, Taipei City, Taiwan 台北市信義區光復南路133號 Songshan Cultural & Creative Park , No. 133, Guangfu S Rd,, Xinyi District, Taipei City,, Taiwan
                          </p>
                        </div>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost4} alt="Post" /></Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </main >
    </>
  );
}
