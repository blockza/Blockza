'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Dropdown, Spinner } from 'react-bootstrap';
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
import LeadershipPost from '@/components/LeadershipPost/LeadershipPost';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import Articles from '@/components/Articles';
import WebstoriesSlider from '@/components/WebstoriesSlider/WebstoriesSlider';
import { getImage } from '@/components/utils/getImage';
import girl from '@/assets/Img/user-img.png';
import logger from '@/lib/logger';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import parse from 'html-react-parser';
import EntryListNewHome from '@/components/EntryListNewHome/EntryListNewHome';
import { Router } from 'lucide-react';

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
  const [Entries, setEntries] = useState<any>([]);
  const [latestEntry, setLatestEntry] = useState<any>([]);
  const [isArticleLoading, setIsArticleLoading] = useState<any>(true);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
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
  let refineEntries = async (entriesList: any) => {
    const userAcotr = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    for (let entry = 0; entry < entriesList.length; entry++) {
      let newUser = null;
      var authorId = entriesList[entry][1].user.toString();
      newUser = await userAcotr.get_user_details([authorId]);
      if (newUser.ok) {
        if (newUser.ok[1].profileImg.length != 0) {
          logger(newUser.ok[1].profileImg.length, 'newuserimg');
          newUser.ok[1].profileImg = await updateImg(
            newUser.ok[1].profileImg[0]
          );
        }
        entriesList[entry][1].user = newUser.ok[1];
        logger(newUser, 'newuser1');
      }
      entriesList[entry][1].image = await updateImg(
        entriesList[entry][1].image
      );
    }
    return entriesList;
  };

  const getEntries = async (category?: string | null) => {
    try {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      const tempEntries = await entryActor.getAllEntries();
      logger({ tempEntries }, 'newhomeEntry');
      if (tempEntries.length > 5) {
        const filteredEntries = tempEntries.slice(0, 5);
        let refined = await refineEntries(filteredEntries);
        logger(refined[0], 'refinded');
        setLatestEntry(refined[0]);
        let [bcaa, ...restEntries] = refined;
        setEntries(restEntries);
        setIsArticleLoading(false);

        logger(restEntries, 'refindede');
      } else if (tempEntries.length != 0) {
        let refined = await refineEntries(tempEntries);
        logger(refined[0], 'refinded');
        let [bcaa, ...restEntries] = refined;
        setEntries(restEntries);

        setIsArticleLoading(false);
        // setIsArticleLoading(false)
        setLatestEntry(refined[0]);
      } else {
        setIsArticleLoading(false);
      }
      // setEntryId(templatestEntry[0]);
      // logger('pop');
    } catch (err) {
      logger(err, 'pop');
      setIsArticleLoading(false);
      // logger('pop');
    }
  };
  let checkStatefn = () => {
    return Entries.length !== 0 ? true : false;
  };
  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);
  };
  let updateImg = async (img: any, name?: string) => {
    if (img) {
      let tempImg = await getImage(img);
      return tempImg;
    }
  };
  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);
  useEffect(() => {
    if (auth) {
      getEntries();
    }
  }, [auth]);

  // router.push('/route')
  return (
    <>
      <main id='main' className='new-home'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section ' id='top'>
            <Row>
              <Col xl='6' lg='6' md='12'>
                <div className='anime-left'>
                  <Row>
                    <Col xl='12' lg='12' md='12' className='heding'>
                      <h4>
                        <Image src={stars} alt='Hot' />
                        Featured Compaigns{' '}
                      </h4>
                      <div className='spacer-20'></div>
                    </Col>
                    <FeaturedSlider />
                  </Row>
                </div>
              </Col>
              <Col xl='6' lg='6' md='12'>
                <div className='anime-right'>
                  <Row>
                    <Col xl='12' lg='12' md='12' className='heding'>
                      <h4>
                        <Image src={press} alt='Hot' /> Press Release
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
              <Col xl='12' lg='12' md='12' sm='12' className='heding'>
                <h4>
                  <Image src={iconrss} alt='Hot' /> NFTStudio24 Feed
                </h4>
              </Col>
              <Col xxl='3' xl='12' lg='12' md='12' sm='12'>
                <Row>
                  <Col xl='12' lg='12' className='heding'>
                    <div className='spacer-20'></div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant='success'
                        className='fill'
                        id='dropdown-basic'
                      >
                        Trending <i className='fa fa-angle-down'></i>
                      </Dropdown.Toggle>
                      {/* 
                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Trending
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Trending
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                    </Dropdown>
                    <div className='spacer-20'></div>
                  </Col>
                  <Col xxl='12' xl='4' lg='4' md='6' sm='6'>
                    <div className='general-post auto'>
                      <div className='txt-pnl'>
                        <Link href='https://nftstudio24.com/news/'>
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
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='4' lg='4' md='6' sm='6'>
                    <div className='general-post auto'>
                      <div className='txt-pnl'>
                        <Link href='https://nftstudio24.com/news/'>
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
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='4' lg='4' md='6' sm='6'>
                    <div className='general-post auto'>
                      <div className='txt-pnl'>
                        <Link href='https://nftstudio24.com/news/'>
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
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xxl='6' xl='12' lg='12' md='12' sm='12'>
                <div className='spacer-20'></div>

                {isArticleLoading ? (
                  <div className='d-flex justify-content-center'>
                    <Spinner />
                  </div>
                ) : latestEntry.length != 0 ? (
                  <div className='general-post big'>
                    <div className='img-pnl'>
                      {latestEntry.length != 0 && latestEntry[1].image && (
                        <Link
                          href={`/article?articleId=${
                            latestEntry.length != 0 ? latestEntry[0] : '#'
                          }`}
                          target='_self'
                          style={{ height: '100%', width: '100%' }}
                        >
                          <Image
                            src={latestEntry[1].image}
                            width={100}
                            height={100}
                            style={{ height: '100%', maxHeight: 'unset' }}
                            alt='articleimage'
                          />
                        </Link>
                      )}
                    </div>
                    <div className='txt-pnl'>
                      <div className='flex-div-sm'>
                        <div className='user-pnl'>
                          <div className='imge-pnl'>
                            <Image
                              src={
                                latestEntry.length != 0 &&
                                latestEntry[1].user.profileImg.length != 0
                                  ? latestEntry[1].user.profileImg[0]
                                  : girl
                              }
                              alt='user'
                            />
                          </div>
                          <div className='txte-pnl d-flex align-items-center'>
                            <h5>
                              By{' '}
                              {latestEntry.length != 0
                                ? latestEntry[1].user.name[0]
                                : 'User'}
                            </h5>
                            {/* <p>Ceo NFTStudio24</p>/ */}
                          </div>
                        </div>
                        <div className='user-pnl'>
                          <div className='imge-pnl'>
                            <Image src={iconbnb} alt='BNB' />
                          </div>
                          <div className='txte-pnl  d-flex align-items-center'>
                            <h5>
                              On{' '}
                              {latestEntry.length != 0
                                ? latestEntry[1].category[0]
                                : 'category'}
                            </h5>
                            {/* <p>Ceo NFTStudio24</p> */}
                          </div>
                        </div>
                      </div>
                      <div className='spacer-20'></div>
                      <Link
                        href={`/article?articleId=${
                          latestEntry.length != 0 ? latestEntry[0] : '#'
                        }`}
                        target='_self'
                      >
                        <h1 className='text-black'>
                          {latestEntry.length != 0
                            ? latestEntry[1].title.length > 84
                              ? `${latestEntry[1].title.slice(0, 82)}...`
                              : latestEntry[1].title
                            : 'loading...'}
                        </h1>
                      </Link>
                      <p
                        style={{
                          overflowY: 'hidden',
                          maxHeight: 158,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          openArticleLink(
                            `/article?articleId=${
                              latestEntry.length != 0 ? latestEntry[0] : '#'
                            }`
                          )
                        }
                      >
                        {latestEntry.length !== 0
                          ? parse(latestEntry[1].description ?? '')
                          : 'loading...'}
                      </p>
                      <Link
                        href={`/article?articleId=${
                          latestEntry.length != 0 ? latestEntry[0] : '#'
                        }`}
                        target='_self'
                        className='text-secondary'
                      >
                        Show more <i className='fa fa-caret-down'></i>
                      </Link>
                      <ul className='thumb-list'>
                        <li>
                          <span className='myanch'>
                            <Image
                              src={iconthumb}
                              alt='Icon Thumb'
                              style={{ height: '22px', width: '22px' }}
                            />{' '}
                            {latestEntry.length != 0
                              ? Number(latestEntry[1].likes)
                              : 0}
                          </span>
                        </li>
                        <li>
                          {/* <a href='#'> */}
                          <Link
                            href={`/article?articleId=${
                              latestEntry.length != 0 ? latestEntry[0] : '#'
                            }`}
                            target='_self'
                          >
                            <Image src={iconmessage} alt='Icon Comment' /> 12
                            Comments
                            {/* </a> */}
                          </Link>
                        </li>
                        <li>
                          <div className='count-description-pnl'>
                            <div className='d-flex'>
                              <ul className='vote-comment-list'>
                                <li>
                                  <div>
                                    <Image src={iconrise} alt='Rise' /> Vote
                                  </div>
                                  <div>
                                    {latestEntry.length != 0
                                      ? Number(latestEntry[1].likes)
                                      : 0}
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <ul className='quiz-list'>
                                <li>
                                  <Image
                                    src={icpimage}
                                    alt='icpImage'
                                    style={{
                                      height: '32px',
                                      width: '32px ',
                                      maxWidth: '32px',
                                    }}
                                  />{' '}
                                  <span>+500 NS24</span>
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
                ) : (
                  <div className='d-flex justify-content-center'>
                    {' '}
                    <b>No article found</b>
                  </div>
                )}
              </Col>
              <Col xxl='3' xl='12' lg='12' md='12' sm='12'>
                <Row>
                  <Col xl='12' lg='12' className='heding'>
                    <div className='spacer-20'></div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant='success'
                        className='fill'
                        id='dropdown-basic'
                      >
                        Top Stories <i className='fa fa-angle-down'></i>
                      </Dropdown.Toggle>

                      {/* <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Top Stories
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Top Stories
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                    </Dropdown>
                    <div className='spacer-20'></div>
                  </Col>
                  <Col xxl='12' xl='4' lg='4' md='6' sm='6'>
                    <div className='general-post auto'>
                      <div className='txt-pnl'>
                        <Link href='https://nftstudio24.com/news/'>
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
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='4' lg='4' md='6' sm='6'>
                    <div className='general-post auto'>
                      <div className='txt-pnl'>
                        <Link href='https://nftstudio24.com/news/'>
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
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='4' lg='4' md='6' sm='6'>
                    <div className='general-post auto'>
                      <div className='txt-pnl'>
                        <Link href='https://nftstudio24.com/news/'>
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
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
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
          <div className='spacer-40'></div>

          <div className='section scroll-anime anime-down' id='news'>
            <Row className='justify-content-center'>
              {isArticleLoading ? (
                <div className='d-flex justify-content-center'>
                  <Spinner />
                </div>
              ) : Entries.length !== 0 ? (
                <EntryListNewHome Entries={Entries} />
              ) : (
                <div className='d-flex justify-content-center'>
                  {' '}
                  <b>No article found</b>
                </div>
              )}
            </Row>
            {/* <Row>
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
              <Col xxl='3' xl='3' lg='6' md='6' sm='6'>
                <div className='general-post'>
                  <Link href='#' className='img-pnl'>
                    <Image src={generalpost2} alt='general post' />
                  </Link>
                  <div className='txt-pnl'>
                    <Link href='#'>
                      <h6>
                        NPCI, Backed by Indian Central Bank, Initiates
                        Blockchain Talent Search
                      </h6>
                    </Link>
                    <p>
                      Coinbase, the largest U.S. cryptocurrency exchange,
                      officially launches its decentralized blockchain, Base,… .{' '}
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
              <Col xxl='3' xl='3' lg='6' md='6' sm='6'>
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
                      officially launches its decentralized blockchain, Base,… .{' '}
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
              <Col xxl='3' xl='3' lg='6' md='6' sm='6'>
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
                      officially launches its decentralized blockchain, Base,… .{' '}
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
            </Row> */}
          </div>
          <div className='spacer-20'></div>
          <div className='section scroll-anime icp-leadership-pnl'>
            <Row>
              <Col xxl='3' xl='3' lg='12' md='12' className='heding'>
                <h4 style={{ textTransform: 'unset' }}>
                  <Image src={iconevents} alt='Hot' /> Events
                </h4>
                <div className='spacer-20'></div>
                <div className='flex-div-xs'>
                  <Link
                    href='#'
                    className='upcoming-btn'
                    style={{ textTransform: 'unset' }}
                  >
                    Upcoming <i className='fa fa-angle-down'></i>
                  </Link>
                  {/* <Link href='#' className='upcoming-btn'>
                  </Link> */}
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

                <div className='spacer-30'></div>
              </Col>
              <Col xxl='6' xl='7' lg='12' md='12' className='heding'>
                <Row>
                  <Col xl='9' lg='9'>
                    <div className='flex-div-sm align-items-center'>
                      <h4 style={{ textTransform: 'unset' }}>
                        {/* <Col xl='9' lg='9' md='9' sm='9' className='heding'>
                    <div className='flex-div-xs align-items-center heding'>
                      <h4> */}
                        <Image src={iconcompass} alt='Hot' /> Web 3 Directory
                      </h4>
                      <Link href='#' className='discover-btn'>
                        View More <i className='fa fa-angle-right'></i>
                      </Link>
                    </div>
                  </Col>
                </Row>
                <div className='spacer-20'></div>
                <div className='shadow-slider'>
                  <ProductSlider />
                </div>

                <div className='spacer-20'></div>
              </Col>
              <Col xxl='3' xl='5' lg='12' className='ld-cntnr'>
                <div className='heding'>
                  <h4>
                    <Image src={iconranking} alt='icon ranking' /> Leaderboard
                  </h4>
                </div>
                <LeadershipPost />
              </Col>
            </Row>
          </div>

          {/* Podcast Panel */}
          <div className='section scroll-anime' id='podcast'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-40'></div>
              </Col>
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
          <div className='section scroll-anime stories-container pb-4'>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='heding'>
                <h3>
                  <Image src={hot} alt='Hot' />
                  Top Webstories
                </h3>
                <div className='spacer-10'></div>
              </Col>
              <WebstoriesSlider />
            </Row>
          </div>
        </div>
        {/* Partners Site Panel */}
      </main>
    </>
  );
}
