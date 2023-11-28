'use client';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import banner from '@/assets/Img/banner-1.png';
import flame from '@/assets/Img/Icons/icon-flame-3.png';
import smallpost1 from '@/assets/Img/Posts/Small-Post-1.png';
import smallpost2 from '@/assets/Img/Posts/Small-Post-2.png';
import smallpost3 from '@/assets/Img/Posts/Small-Post-3.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import NFtPost1 from '@/assets/Img/Posts/nft-post-1.png';
import NFtPost2 from '@/assets/Img/Posts/nft-post-2.png';
import NFtPost3 from '@/assets/Img/Posts/nft-post-3.png';
import NFtPost4 from '@/assets/Img/Posts/nft-post-4.png';
import NFtPost5 from '@/assets/Img/Posts/nft-post-5.png';
import NFtPost6 from '@/assets/Img/Posts/nft-post-6.png';
import NFtPost7 from '@/assets/Img/Posts/nft-post-7.png';
import article from '@/assets/Img/article.png';
import NFtPost8 from '@/assets/Img/Posts/nft-post-8.png';
import SurveyPost from '@/components/SurveyPost/SurveyPost';
import QuizPost from '@/components/QuizPost/QuizPost';
import { useSearchParams } from 'next/navigation';
import logger from '@/lib/logger';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function categorydetail() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  logger(category);
  return (
    <>
      <main id='main'>
        <div className='main-inner home category-details'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className='text-right'>
                  <div className='search-post-pnl'>
                    <input type='text' placeholder='Search Posts' />
                    <button>
                      <i className='fa fa-search'></i>
                    </button>
                  </div>
                </div>
                <div className='spacer-20'></div>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href='/'>HOME</Link>
                  </Breadcrumb.Item>
                  {/* <Breadcrumb.Item href='#'>News</Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>CRYPTOPEDIA</Breadcrumb.Item> */}
                  <Breadcrumb.Item active>
                    {category?.replace('_', ' ')}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xl='8' lg='12' md='12'>
                <div className='spacer-10'></div>
                <h2>BLOCKCHAIN NEWS</h2>
                <div className='spacer-20'></div>
                <p>
                  <b>
                    The blockchain industry is the infrastructure on which every
                    decentralized application or website operates. Ituses the
                    Distributed ledger technology (DLT) to record transactions
                    and share information with various networks with no central
                    party.
                  </b>
                </p>
                <p>
                  <b>
                    The latest news on recent developments in the Blockchain
                    industry. Blockehain updates for Ethereu, Solana, Polygon,
                    Kiayton, and other networks.
                  </b>
                </p>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='img-banner-pnl'>
                  <Image src={banner} alt='banner' />
                </div>
                <div className='spacer-20'></div>
                <h4>
                  <Image src={flame} alt='flame' /> <b>Top News</b>
                </h4>
                <div className='spacer-10'></div>
              </Col>
              <Col xxl='8' xl='7' lg='12' md='12'>
                <Image src={article} alt='article' />
              </Col>
              <Col xxl='4' xl='5' lg='12' md='12'>
                <Row>
                  <Col xxl='12' xl='12' lg='6' md='6'>
                    <Link href='#' className='nft-post'>
                      <Image src={NFtPost1} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col xxl='12' xl='12' lg='6' md='6'>
                    <div className='nft-post'>
                      <Image src={NFtPost2} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-20'></div>
                <h4>
                  <Image src={flame} alt='flame' />{' '}
                  <b>Latest BLOCKCHAIN NEWS News</b>
                </h4>
                <div className='spacer-10'></div>
              </Col>
              <Col xxl='8' xl='6' lg='12' md='12'>
                <Row>
                  <Col xxl='6' xl='12' lg='6' md='6'>
                    <Link href='#' className='nft-post'>
                      <Image src={NFtPost7} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col xxl='6' xl='12' lg='6' md='6'>
                    <div className='nft-post'>
                      <Image src={NFtPost8} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='6' xl='12' lg='6' md='6'>
                    <Link href='#' className='nft-post'>
                      <Image src={NFtPost5} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col xxl='6' xl='12' lg='6' md='6'>
                    <div className='nft-post'>
                      <Image src={NFtPost6} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='6' xl='12' lg='6' md='6'>
                    <Link href='#' className='nft-post'>
                      <Image src={NFtPost3} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                  <Col xxl='6' xl='12' lg='6' md='6'>
                    <div className='nft-post'>
                      <Image src={NFtPost4} alt='NFT Post' />
                      <div className='text-panel'>
                        <h2>
                          Blockchain in Space: Transforming the Future of Space
                          Exploration
                        </h2>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={logo} alt='Logo' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>News Room</h6>
                            <p>Last updated: 2023/05/18 at 10:07 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xxl='4' xl='6' lg='12' md='12'>
                <SurveyPost />
                <div className='spacer-30'></div>
                <QuizPost />
              </Col>
            </Row>
            <Row>
              <Col xxl='12' xl='12' lg='12' md='12' sm='12'>
                <div className='spacer-40'></div>
                <hr></hr>
                <Link className='upcoming-btn' href='#'>
                  Events <i className='fa fa-angle-down'></i>
                </Link>
                <div className='spacer-10'></div>
              </Col>
              <Col xxl='4' xl='6' lg='6' md='12' sm='12'>
                <div className='release-post'>
                  <div className='release-post-inner'>
                    <div className='img-pnl'>
                      <Link href='/'>
                        <Image src={smallpost1} alt='Post' />
                      </Link>
                    </div>
                    <div className='txt-pnl'>
                      <span>October 22 - October 24</span>
                      <h6>ETH Hong Kong 2023</h6>
                      <p>
                        Cyberport Connecting & Empowering Web3 Builders
                        Cyberport 1, Cyberport Rd , Pok Fu Lam, Hong Kong
                      </p>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xxl='4' xl='6' lg='6' md='12' sm='12'>
                <div className='release-post'>
                  <div className='release-post-inner'>
                    <div className='img-pnl'>
                      <Link href='/'>
                        <Image src={smallpost2} alt='Post' />
                      </Link>
                    </div>
                    <div className='txt-pnl'>
                      <span>October 22 - October 24</span>
                      <h6>Blockchain Life 2023 Festival Arena</h6>
                      <p>Dubai, Festival Arena Dubai, Festival Arena</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xxl='4' xl='6' lg='6' md='12' sm='12'>
                <div className='release-post'>
                  <div className='release-post-inner'>
                    <div className='img-pnl'>
                      <Link href='/'>
                        <Image src={smallpost3} alt='Post' />
                      </Link>
                    </div>
                    <div className='txt-pnl'>
                      <span>November 1 - November 2</span>
                      <h6>World Blockchain Summit 2023 </h6>
                      <p>
                        DUBAI MARINA Barsha Heights, Dubai, UAE Dubai Dubai
                        333851
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
