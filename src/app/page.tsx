'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Tab, Tabs, Dropdown } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar/NavBar';
import SidebarHome from '@/components/SideBarHome/SideBarHome';
import iconfilter from '@/assets/Img/Icons/icon-filter.png';
import hot from '@/assets/Img/Icons/icon-flame-1.png';
import stars from '@/assets/Img/Icons/icon-start.png';
import press from '@/assets/Img/Icons/icon-press-release.png';
import iconcompass from '@/assets/Img/Icons/icon-compass.png';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconrss from '@/assets/Img/Icons/icon-rss.png';
import PodcastPost from '@/components/PodcastPost/PodcastPost';
import SurveyPost from '@/components/SurveyPost/SurveyPost';
import ReleasePost from '@/components/ReleasePost/ReleasePost';
// import PressPost from '@/components/PressPost/PressPost';
import ArticlesPost from '@/components/ArticlesPost/ArticlesPost';
import FeaturedSlider from '@/components/FeaturedSlider/FeaturedSlider';
import ReleaseSlider from '@/components/ReleaseSlider/ReleaseSlider';
import ProductSlider from '@/components/ProductSlider/ProductSlider';
import StoriesPost from '@/components/StoriesPost/StoriesPost';
import Footer from '@/components/Footer/Footer';
import ExportPost from '@/components/ExportPost/ExportPost';
import LeadershipPost from '@/components/LeadershipPost/LeadershipPost';
import { useThemeStore } from '@/store/useStore';
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
            <Row>
              <Col xxl='6' xl='6' lg='12' md='12' className='heding'>
                <h4>
                  <Image src={iconrss} alt='Hot' /> NFTSTUDIO24 FEED
                </h4>
                <div className='spacer-20'></div>
                <ul className='tabs-list'>
                  <li>
                    <Link href='#' className='active'>
                      All Content
                    </Link>
                  </li>
                  <li>
                    <Link href='#'>Features</Link>
                  </li>
                  <li>
                    <Link href='#'>Quiz</Link>
                  </li>
                  <li>
                    <Link href='#'>Podcasts</Link>
                  </li>
                  <li>
                    <Link href='#'>Guide</Link>
                  </li>
                  <li>
                    <Link href='#' className='arrow-link'>
                      <i className='fa fa-angle-right'></i>
                    </Link>
                  </li>
                  <li>
                    <Dropdown>
                      <Dropdown.Toggle id='dropdown-basic'>
                        <Image src={iconfilter} alt='Icon Filter' /> Filter
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Another action
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-3'>
                          Something else
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
                <div className='spacer-10'></div>
                <ExportPost />
                {/* <Tabs
                  defaultActiveKey='allcontent'
                  id='uncontrolled-tab-example'
                  className='tabs-fill'
                >
                  <Tab eventKey='allcontent' title='All Content'>
                    <Row>
                      <Col xl='12' lg='12' md='12'>
                      
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey='features' title='Features'>
                    <Row>
                      <Col xl='12' lg='12' md='12'>
                        <ExportPost />
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey='Quiz' title='Quiz'>
                    <Row>
                      <Col xl='12' lg='12' md='12'>
                        <ExportPost />
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey='Podcasts' title='Podcasts'>
                    <Row>
                      <Col xl='12' lg='12' md='12'>
                        <ExportPost />
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey='Guide' title='Guide'>
                    <Row>
                      <Col xl='12' lg='12' md='12'>
                        <ExportPost />
                      </Col>
                    </Row>
                  </Tab>
                </Tabs> */}
              </Col>
              <Col
                xxl={{ span: 5, offset: 1 }}
                xl='6'
                lg='12'
                className='ld-cntnr'
              >
                <LeadershipPost />
              </Col>
            </Row>
          </div>

          <div className='section scroll-anime'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='pbg-pnl'>
                  <Row>
                    <Col xxl='7' xl='8' lg='12' md='12' className='heding'>
                      <div className='bdrd-pnl'>
                        <div className='d-flex-sm'>
                          <h4>
                            <Image src={iconcompass} alt='Hot' /> Discover
                            Product communities
                          </h4>
                          <Link href='#' className='discover-btn'>
                            Discover More <i className='fa fa-angle-right'></i>
                          </Link>
                        </div>
                        <div className='spacer-20'></div>
                        <ProductSlider />
                      </div>
                    </Col>
                    <Col xxl='5' xl='4' lg='12' md='12' className='heding'>
                      <h4>
                        <Image src={iconevents} alt='Hot' /> Events
                      </h4>
                      <div className='spacer-20'></div>
                      <div className='flex-div-xs'>
                        <Link href='#' className='upcoming-btn'>
                          Upcoming <i className='fa fa-angle-right'></i>
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
                      <div className='spacer-20'></div>
                      <ReleasePost />
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
      <Footer />
    </>
  );
}
