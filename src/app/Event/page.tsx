'use client';
import React from 'react';
import Head from 'next/head';
import {
  Row,
  Col
} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import smallpost1 from '@/assets/Img/Posts/Small-Post-1.png';
import smallpost2 from '@/assets/Img/Posts/Small-Post-2.png';
import smallpost3 from '@/assets/Img/Posts/Small-Post-3.png';
import banner from '@/assets/Img/banner.png';

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
                <div className="spacer-20"></div>
                <h4>All Events</h4>
                <div className="spacer-20"></div>
                <h2>WikiFinance EXPO Sydney 2023</h2>
                <div className="spacer-10"></div>
                <h4><i className='fa fa-calendar blue-color'></i> November</h4>
                <div className="spacer-20"></div>
                <Image src={banner} alt="Post" />
                <div className="spacer-20"></div>
                <p>
                  Are you ready to embark on a journey of discovery and learning? Don’t miss the WikiExpo SYDNEY 2023, the premier
                  event for knowledge enthusiasts!
                </p>
                <p>
                  <b>📅  Date:</b> 16th Nov. 2023
                </p>
                <p>
                  <b>📍 Location:</b> The Fullerton Hotel Sydney No. 1 Martin Place, Sydney NSW 2000, Australia
                </p>
                <p>
                  <b>🔥 Event Highlights:</b>
                </p>
                <ul className='blut-dot-list'>
                  <li>
                    <b>Expert Speakers:</b> Learn from leading experts in various fields, sharing their insights and expertise.
                  </li>
                  <li>
                    <b>Knowledge Hub:</b> Explore a vast array of topics and gain valuable knowledge from diverse disciplines.
                  </li>
                  <li>
                    <b>Interactive Workshops:</b> Engage in hands-on workshops to enhance your skills and understanding.
                  </li>
                  <li>
                    <b>Networking:</b> Connect with like-minded individuals and build lasting connections.
                  </li>
                  <li>
                    <b>Expo Hall:</b> Discover innovative products, services, and projects advancing the world of knowledge.
                  </li>
                </ul>
                <p>
                  This is your chance to immerse yourself in a world of ideas and discovery. Whether you’re a student, professional, or simply curious,
                  WikiExpo has something for everyone!
                </p>
                <div className="full-div">
                  <Link href="#" className='submit-btn w-auto'>Get Your Tickets Now</Link>
                </div>
                <Link href="#" className='simple-link'>WikiExpo Tickets</Link>
                <div className="spacer-20"></div>
                <p>
                  Stay tuned for updates on speakers, sessions, and more! Follow us for the latest event news and exciting announcements.
                </p>
                <p>👉 <b>Website:</b> WikiExpo Website</p>
                <p>
                  👥 <b>Join our LinkedIn Group:</b> <Link href="#" className='simple-link'>[ WikiExpo ]</Link>
                </p>
                <div className="spacer-20"></div>
                <hr></hr>
                <div className="spacer-40"></div>
                <Row>
                  <Col xxl="3" xl="4" lg="6" md="6" sm="6">
                    <h4><b>DETAILS</b></h4>
                    <p>
                      <b>Date</b><br></br>
                      November 16
                    </p>
                    <p>
                      <b>Event Tags:</b><br></br>
                      <Link href="#" className='simple-link'>
                        WikiExpo 2023
                      </Link>
                    </p>
                    <p>
                      <b>Website:</b><br></br>
                      <Link href="https://www.wikiexpo.com/Australia/2023_EN/auexpo.html" target="_blank" className='simple-link'>
                        https://www.wikiexpo.com/
                        Australia/2023_EN/auexpo.html
                      </Link>
                    </p>
                  </Col>
                  <Col xxl="3" xl="4" lg="6" md="6" sm="6">
                    <h4><b>VENUE</b></h4>
                    <div className="full-div">
                      <p>The Fullerton Hotel
                        Sydney No. 1 Martin
                        Place, Sydney NSW 2000,
                        Australia
                        The Fullerton Hotel
                        Sydney
                        No. 1 Martin Place,
                        Sydney NSW 2000 ,
                        Australia Australia
                      </p>
                    </div>
                    <div className="full-div">
                      <Link href="https://maps.app.goo.gl/q9necEo16bDEM5ck6" className='simple-link'>+ Google Map</Link>
                      <div className="spacer-10"></div>
                    </div>
                    <div className="full-div">
                      <Link href="#" className='simple-link'>View Venue Website</Link>
                    </div>
                  </Col>
                  <Col xxl="3" xl="4" lg="12" md="12" sm="12">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.850950794357!2d151.20525597661134!3d-33.86773191900508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b9597300d6dd%3A0x85247df2880c3db5!2sThe%20Fullerton%20Hotel%20Sydney!5e0!3m2!1sen!2s!4v1700478933415!5m2!1sen!2s" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                  </Col>
                  <Col xxl="12" xl="12" lg="12" md="12" sm="12">
                    <div className="spacer-40"></div>
                    <hr></hr>
                    <Link className="upcoming-btn" href="#">Upcoming <i className="fa fa-angle-down"></i></Link>
                    <div className="spacer-10"></div>
                  </Col>
                </Row>
                <Row>
                  <Col xxl="4" xl="6" lg="6" md="12" sm="12">
                    <div className='release-post'>
                      <div className='release-post-inner'>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost1} alt="Post" /></Link>
                        </div>
                        <div className='txt-pnl'>
                          <span>October 22 - October 24</span>
                          <h6>ETH Hong Kong 2023</h6>
                          <p>Cyberport Connecting & Empowering Web3 Builders Cyberport 1, Cyberport Rd , Pok Fu Lam, Hong Kong</p>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xxl="4" xl="6" lg="6" md="12" sm="12">
                    <div className='release-post'>
                      <div className='release-post-inner'>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost2} alt="Post" /></Link>
                        </div>
                        <div className='txt-pnl'>
                          <span>October 22 - October 24</span>
                          <h6>Blockchain Life 2023
                            Festival Arena</h6>
                          <p>Dubai, Festival Arena Dubai, Festival Arena</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xxl="4" xl="6" lg="6" md="12" sm="12">
                    <div className='release-post'>
                      <div className='release-post-inner'>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={smallpost3} alt="Post" /></Link>
                        </div>
                        <div className='txt-pnl'>
                          <span>November 1 - November 2</span>
                          <h6>World Blockchain
                            Summit 2023 </h6>
                          <p>DUBAI MARINA Barsha Heights, Dubai, UAE Dubai Dubai 333851</p>
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
