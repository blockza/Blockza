'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Dropdown } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import hot from '@/assets/Img/Icons/icon-flame-1.png';
import stars from '@/assets/Img/Icons/icon-start.png';
import press from '@/assets/Img/Icons/icon-press-release.png';
import iconcompass from '@/assets/Img/Icons/icon-compass.png';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import iconranking from '@/assets/Img/Icons/icon-ranking.png';
import iconrss from '@/assets/Img/Icons/icon-rss.png';
import generalpost1 from '@/assets/Img/event-5.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import icpimage from '@/assets/Img/coin-image.png';
import generalpost2 from '@/assets/Img/event-6.png';
import user from '@/assets/Img/user.png';
import iconbnb from '@/assets/Img/icon-bnb.png';
import PodcastPost from '@/components/PodcastPost/PodcastPost';
import SurveyPost from '@/components/SurveyPost/SurveyPost';
import ReleasePost from '@/components/ReleasePost/ReleasePost';
// import PressPost from '@/components/PressPost/PressPost';
import FeaturedSlider from '@/components/FeaturedSlider/FeaturedSlider';
import ReleaseSlider from '@/components/ReleaseSlider/ReleaseSlider';
import ProductSlider from '@/components/ProductSlider/ProductSlider';
import StoriesPost from '@/components/StoriesPost/StoriesPost';
import LeadershipPost from '@/components/LeadershipPost/LeadershipPost';
import { useThemeStore } from '@/store/useStore';
import Articles from '@/components/Articles';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));
  function isElementInViewport(elem: any) {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elemTop = elem.getBoundingClientRect().top + scroll;
    return elemTop - scroll < windowHeight;
  }

  function animateSections() {
    const elementsToAnimate = document.querySelectorAll('.scroll-anime');
    const elementsInViewport: any = [];
    elementsToAnimate.forEach((elem) => {
      if (isElementInViewport(elem)) {
        elem.classList.add('anime');
        elementsInViewport.push(elem);
      }
    });
    setAnimatedElements(elementsInViewport);
  }

  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);

  // router.push('/route')
  return (
    <>
      <main id='main' className={isBlack ? 'black' : ''}>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section ' id='top'>
            <Row>
              <Col xl='6' lg='6' md='12'>
                <div className='pbg-pnl anime-left'>
                  <Row>
                    <Col xl='12' lg='12' md='12' className='heding'>
                      <h4>
                        <Image src={stars} alt='Hot' /> FEATURED CAMPAIGNS{' '}
                      </h4>
                      <div className='spacer-20'></div>
                    </Col>
                    <FeaturedSlider />
                  </Row>
                </div>
              </Col>
              <Col xl='6' lg='6' md='12'>
                <div className='pbg-pnl anime-right'>
                  <Row>
                    <Col xl='12' lg='12' md='12' className='heding'>
                      <h4>
                        <Image src={press} alt='Hot' /> PRESS RELEASE
                      </h4>
                      <div className='spacer-20'></div>
                    </Col>
                    <ReleaseSlider />
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className='section scroll-anime anime-down' id='news'>
            <div className='pbg-pnl'>
              <Row>
                <Col xl='12' lg='12' md='12' sm='12'>
                  <div className='spacer-30'></div>
                  <h4>
                    <Image src={iconrss} alt='Hot' /> NFTStudio24 Feed
                  </h4>
                </Col>
                <Col xl='3' lg='3' md='12' sm='12'>
                  <Row>
                    <Col xl='12' lg='12'>
                      <div className='spacer-20'></div>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant='success'
                          className='fill'
                          id='dropdown-basic'
                        >
                          Trending <i className='fa fa-angle-down'></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href='#/action-1'>
                            Trending
                          </Dropdown.Item>
                          <Dropdown.Item href='#/action-2'>
                            Trending
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <div className='spacer-20'></div>
                    </Col>
                    <Col xl='12' lg='12' md='4' sm='6'>
                      <div className='general-post auto'>
                        <div className='txt-pnl'>
                          <Link href='#'>
                            <h6>
                              Japan Relaxes Corporate Crypto Tax Regime in 2024
                            </h6>
                          </Link>
                          <p>Dec 25,2023</p>
                          <p>
                            In positive regulatory news for the local
                            cryptocurrency industry, Japan has...
                          </p>
                          <ul className='thumb-list'>
                            <li>
                              <a href='#'>
                                <Image src={iconthumb} alt='Icon Thumb' /> 11
                              </a>
                            </li>
                            <li>
                              <a href='#'>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12' md='4' sm='6'>
                      <div className='general-post auto'>
                        <div className='txt-pnl'>
                          <Link href='#'>
                            <h6>
                              Japan Relaxes Corporate Crypto Tax Regime in 2024
                            </h6>
                          </Link>
                          <p>Dec 25,2023</p>
                          <p>
                            In positive regulatory news for the local
                            cryptocurrency industry, Japan has...
                          </p>
                          <ul className='thumb-list'>
                            <li>
                              <a href='#'>
                                <Image src={iconthumb} alt='Icon Thumb' /> 11
                              </a>
                            </li>
                            <li>
                              <a href='#'>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12' md='4' sm='6'>
                      <div className='general-post auto'>
                        <div className='txt-pnl'>
                          <Link href='#'>
                            <h6>
                              Japan Relaxes Corporate Crypto Tax Regime in 2024
                            </h6>
                          </Link>
                          <p>Dec 25,2023</p>
                          <p>
                            In positive regulatory news for the local
                            cryptocurrency industry, Japan has...
                          </p>
                          <ul className='thumb-list'>
                            <li>
                              <a href='#'>
                                <Image src={iconthumb} alt='Icon Thumb' /> 11
                              </a>
                            </li>
                            <li>
                              <a href='#'>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xl='6' lg='6' md='12' sm='12'>
                  <div className='spacer-20'></div>
                  <div className='general-post big'>
                    <div className='img-pnl'></div>
                    <div className='txt-pnl'>
                      <div className='flex-div-sm'>
                        <div className='user-pnl'>
                          <div className='imge-pnl'>
                            <Image src={user} alt='user' />
                          </div>
                          <div className='txte-pnl'>
                            <h5>By Hinza Asif</h5>
                            <p>Ceo NFTStudio24</p>
                          </div>
                        </div>
                        <div className='user-pnl'>
                          <div className='imge-pnl'>
                            <Image src={iconbnb} alt='BNB' />
                          </div>
                          <div className='txte-pnl'>
                            <h5>By Hinza Asif</h5>
                            <p>Ceo NFTStudio24</p>
                          </div>
                        </div>
                      </div>
                      <div className='spacer-20'></div>
                      <Link href='#'>
                        <h6>
                          Japan Half-Hearted Approach to Stablecoins: A Looming
                          Concern
                        </h6>
                      </Link>
                      <p>
                        In June 2023, the world witnessed a significant
                        development in the cryptocurrency realm as Japan passed
                        a bill regarding stablecoins. This move, however, left
                        many observers baffled, as it appeared that Japan had
                        entered the stablecoin arena with only half a plan. Fast
                        forward to October 2023, and Japan still lacks a clear
                        and comprehensive framework for overseeing stablecoins.
                        While the country was one of the first major economies
                        to introduce legal guidelines for stablecoins, there
                        remains a sense of ambiguity surrounding their
                        regulation. This article explores Japan’s hesitant
                        stance towards stablecoins and the potential
                        implications.
                      </p>
                      <ul className='thumb-list'>
                        <li>
                          <a href='#'>
                            <Image src={iconthumb} alt='Icon Thumb' /> 11
                          </a>
                        </li>
                        <li>
                          <a href='#'>
                            <Image src={iconmessage} alt='Icon Comment' /> 12
                            Comments
                          </a>
                        </li>
                        <li>
                          <div className='count-description-pnl'>
                            <div className='d-flex'>
                              <ul className='vote-comment-list'>
                                <li>
                                  <div>
                                    <Image src={iconrise} alt='Rise' /> Vote
                                  </div>
                                  <div>Vote</div>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <ul className='quiz-list'>
                                <li>
                                  <Image
                                    src={icpimage}
                                    alt='icpImage'
                                    style={{ height: '25px', width: '30px' }}
                                  />{' '}
                                  <span>+500 ICP</span>
                                </li>
                                <li>
                                  <Link href='#'>
                                    Take Quiz{' '}
                                    <i className='fa fa-angle-right'></i>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col xl='3' lg='3' md='12' sm='12'>
                  <Row>
                    <Col xl='12' lg='12'>
                      <div className='spacer-20'></div>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant='success'
                          className='fill'
                          id='dropdown-basic'
                        >
                          Top Stories <i className='fa fa-angle-down'></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href='#/action-1'>
                            Top Stories
                          </Dropdown.Item>
                          <Dropdown.Item href='#/action-2'>
                            Top Stories
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <div className='spacer-20'></div>
                    </Col>
                    <Col xl='12' lg='12' md='4' sm='6'>
                      <div className='general-post auto'>
                        <div className='txt-pnl'>
                          <Link href='#'>
                            <h6>
                              Japan Relaxes Corporate Crypto Tax Regime in 2024
                            </h6>
                          </Link>
                          <p>Dec 25,2023</p>
                          <p>
                            In positive regulatory news for the local
                            cryptocurrency industry, Japan has...
                          </p>
                          <ul className='thumb-list'>
                            <li>
                              <a href='#'>
                                <Image src={iconthumb} alt='Icon Thumb' /> 11
                              </a>
                            </li>
                            <li>
                              <a href='#'>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12' md='4' sm='6'>
                      <div className='general-post auto'>
                        <div className='txt-pnl'>
                          <Link href='#'>
                            <h6>
                              Japan Relaxes Corporate Crypto Tax Regime in 2024
                            </h6>
                          </Link>
                          <p>Dec 25,2023</p>
                          <p>
                            In positive regulatory news for the local
                            cryptocurrency industry, Japan has...
                          </p>
                          <ul className='thumb-list'>
                            <li>
                              <a href='#'>
                                <Image src={iconthumb} alt='Icon Thumb' /> 11
                              </a>
                            </li>
                            <li>
                              <a href='#'>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12' md='4' sm='6'>
                      <div className='general-post auto'>
                        <div className='txt-pnl'>
                          <Link href='#'>
                            <h6>
                              Japan Relaxes Corporate Crypto Tax Regime in 2024
                            </h6>
                          </Link>
                          <p>Dec 25,2023</p>
                          <p>
                            In positive regulatory news for the local
                            cryptocurrency industry, Japan has...
                          </p>
                          <ul className='thumb-list'>
                            <li>
                              <a href='#'>
                                <Image src={iconthumb} alt='Icon Thumb' /> 11
                              </a>
                            </li>
                            <li>
                              <a href='#'>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          <div className='section scroll-anime anime-down' id='news'>
            <div className='pbg-pnl'>
              <Row>
                <Col xl='3' lg='3' md='6' sm='6'>
                  <div className='general-post'>
                    <Link href='#' className='img-pnl'>
                      <Image src={generalpost1} alt='general post' />
                    </Link>
                    <div className='txt-pnl'>
                      <Link href='#'>
                        <h6>
                          NPCI, Backed by Indian Central Bank, Initiates
                          Blockchain Talent Search
                        </h6>
                      </Link>
                      <p>
                        Singapore, Malaysia, the UAE, France, Benelux nations,
                        Nepal, and the U.K. Embrace… .
                      </p>
                      <ul className='thumb-list'>
                        <li>
                          <a href='#'>
                            <Image src={iconthumb} alt='Icon Thumb' /> 11
                          </a>
                        </li>
                        <li>
                          <a href='#'>
                            <Image src={iconmessage} alt='Icon Comment' /> 12
                            Comments
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col xl='3' lg='3' md='6' sm='6'>
                  <div className='general-post'>
                    <div className='img-pnl'>
                      <Image src={generalpost2} alt='general post' />
                    </div>
                    <div className='txt-pnl'>
                      <h6>
                        Coinbase Publicly Unveils ‘Base’ Revolutionary
                        Decentralized Blockchain
                      </h6>
                      <p>
                        Coinbase, the largest U.S. cryptocurrency exchange,
                        officially launches its decentralized blockchain, Base,…
                        .{' '}
                      </p>
                      <ul className='thumb-list'>
                        <li>
                          <a href='#'>
                            <Image src={iconthumb} alt='Icon Thumb' /> 11
                          </a>
                        </li>
                        <li>
                          <a href='#'>
                            <Image src={iconmessage} alt='Icon Comment' /> 12
                            Comments
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col xl='3' lg='3' md='6' sm='6'>
                  <div className='general-post'>
                    <div className='img-pnl'></div>
                    <div className='txt-pnl'>
                      <h6>
                        Coinbase Publicly Unveils ‘Base’ Revolutionary
                        Decentralized Blockchain
                      </h6>
                      <p>
                        Coinbase, the largest U.S. cryptocurrency exchange,
                        officially launches its decentralized blockchain, Base,…
                        .{' '}
                      </p>
                      <ul className='thumb-list'>
                        <li>
                          <a href='#'>
                            <Image src={iconthumb} alt='Icon Thumb' /> 11
                          </a>
                        </li>
                        <li>
                          <a href='#'>
                            <Image src={iconmessage} alt='Icon Comment' /> 12
                            Comments
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col xl='3' lg='3' md='6' sm='6'>
                  <div className='general-post'>
                    <Link href='#' className='img-pnl'></Link>
                    <div className='txt-pnl'>
                      <Link href='#'>
                        <h6>
                          Coinbase Publicly Unveils ‘Base’ Revolutionary
                          Decentralized Blockchain
                        </h6>
                      </Link>
                      <p>
                        Coinbase, the largest U.S. cryptocurrency exchange,
                        officially launches its decentralized blockchain, Base,…
                        .{' '}
                      </p>
                      <ul className='thumb-list'>
                        <li>
                          <a href='#'>
                            <Image src={iconthumb} alt='Icon Thumb' /> 11
                          </a>
                        </li>
                        <li>
                          <a href='#'>
                            <Image src={iconmessage} alt='Icon Comment' /> 12
                            Comments
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className='section scroll-anime icp-leadership-pnl'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='pbg-pnl'>
                  <Row>
                    <Col xxl='3' xl='3' lg='12' md='12' className='heding'>
                      <h4>
                        <Image src={iconevents} alt='Hot' /> Events
                      </h4>
                      <div className='spacer-20'></div>
                      <div className='flex-div-xs'>
                        <Link href='#' className='upcoming-btn'>
                          Upcoming <i className='fa fa-angle-down'></i>
                        </Link>
                        <div className='search-pnl'>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Find Events'
                          />
                          <button>
                            <i className='fa fa-search'></i>
                          </button>
                        </div>
                      </div>
                      <div className='spacer-30'></div>
                      <ReleasePost />
                    </Col>
                    <Col xxl='6' xl='6' lg='12' md='12' className='heding'>
                      <div className='d-flex-sm'>
                        <h4>
                          <Image src={iconcompass} alt='Hot' /> Web 3 Directory
                        </h4>
                        <Link href='#' className='discover-btn'>
                          View More <i className='fa fa-angle-right'></i>
                        </Link>
                      </div>
                      <div className='spacer-20'></div>
                      <ProductSlider />
                    </Col>
                    <Col xxl='3' xl='3' lg='12' className='ld-cntnr'>
                      <h4>
                        <Image src={iconranking} alt='icon ranking' />{' '}
                        Leaderboard
                      </h4>
                      <LeadershipPost />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>

          {/* Podcast Panel */}
          <div className='section scroll-anime' id='podcast'>
            <Row>
              <Col xl='8' lg='12' md='12'>
                <PodcastPost />
              </Col>
              <Col xl='4' lg='12' md='12'>
                <SurveyPost />
              </Col>
            </Row>
          </div>
          {/* Podcast Panel */}

          {/* Partners Site Panel */}
          <div className='section scroll-anime stories-container'>
            <div className='pbg-pnl'>
              <Row>
                <Col xl='12' lg='12' md='12' sm='12' className='heding'>
                  <h3>
                    <Image src={hot} alt='Hot' />
                    Top Webstories
                  </h3>
                  <div className='spacer-10'></div>
                </Col>
                <StoriesPost />
              </Row>
            </div>
          </div>
          {/* Partners Site Panel */}
        </div>
      </main>
    </>
  );
}
