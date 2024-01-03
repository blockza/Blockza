'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Dropdown, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import hot from '@/assets/Img/Icons/icon-flame-1.png';
import stars from '@/assets/Img/Icons/icon-start.png';
import press from '@/assets/Img/Icons/icon-press-release.png';
import iconcompass from '@/assets/Img/Icons/icon-compass.png';
import iconrss from '@/assets/Img/Icons/icon-rss.png';
import iconevents from '@/assets/Img/Icons/icon-event.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import iconranking from '@/assets/Img/Icons/icon-ranking.png';
import iconnotice from '@/assets/Img/Icons/icon-notice.png';
import iconshare from '@/assets/Img/Icons/icon-share-o.png';
import iconfeed from '@/assets/Img/Icons/icon-feed.png';
import iconinfo from '@/assets/Img/Icons/icon-infor.png';
import iconcrown from '@/assets/Img/Icons/icon-crown.png';
import iconretweet from '@/assets/Img/Icons/icon-retweet.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import iconcoin from '@/assets/Img/coin-image.png';
import post1 from '@/assets/Img/event-7.png';
import post2 from '@/assets/Img/event-8.png';
import post3 from '@/assets/Img/event-9.png';
import icongirl from '@/assets/Img/Icons/icon-girl-1.png';
import generalpost1 from '@/assets/Img/event-5.png';
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
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import parse from 'html-react-parser';
import EntryListNewHome from '@/components/EntryListNewHome/EntryListNewHome';
import { Router } from 'lucide-react';
import GeneralSlider from '@/components/GeneralSlider/GeneralSlider';
import NewsSlider from '@/components/NewsSlider';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConnectModal from '@/components/Modal';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

function UnAuthenticated() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);
  const [Entries, setEntries] = useState<any>([]);
  const [connectLink, setConnectLink] = useState('/');
  const [latestEntry, setLatestEntry] = useState<any>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isArticleLoading, setIsArticleLoading] = useState<any>(true);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));

  const searchParams = useSearchParams();
  let cRoute = searchParams.get('route');
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );

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
          newUser.ok[1].profileImg = await updateImg(
            newUser.ok[1].profileImg[0]
          );
        }
        entriesList[entry][1].userId = authorId;
        entriesList[entry][1].user = newUser.ok[1];
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
      if (tempEntries.length > 5) {
        const filteredEntries = tempEntries.slice(5, 10);
        let refined = await refineEntries(filteredEntries);
        setLatestEntry(refined[0]);
        let [bcaa, ...restEntries] = refined;
        setEntries(restEntries);
        setIsArticleLoading(false);
      } else if (tempEntries.length != 0) {
        let refined = await refineEntries(tempEntries);
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
  const handleConnectModal = (e: string) => {
    // e.preventDefault();
    setShowConnectModal(true);
    setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };
  useEffect(() => {
    console.log('reee');
    getEntries();
  }, []);
  useEffect(() => {
    if (cRoute && auth.state === 'initialized') {
      const targetElement = document.getElementById(cRoute);

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
      }
    }
  }, [cRoute, auth]);

  // router.push('/route')
  return (
    <>
      <main id='main' className='new-home pt-0'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section ' id='top'>
            <Row>
              <Col xl='6' lg='6' md='12'>
                <div className='anime-left bdrd-pnl'>
                  <Row>
                    <Col
                      id='campaign'
                      xl='12'
                      lg='12'
                      md='12'
                      className='heding'
                    >
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
                    <Col
                      xl='12'
                      lg='12'
                      md='12'
                      className='heding'
                      id='pressRelease'
                    >
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
                            <a
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
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
                            <a
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
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
                            <a
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                            >
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
                                latestEntry[1]?.user?.profileImg?.length != 0
                                  ? latestEntry[1]?.user?.profileImg
                                  : girl
                              }
                              width={60}
                              height={60}
                              alt='user'
                            />
                          </div>
                          <div className='txte-pnl d-flex align-items-center'>
                            <h5
                              onClick={() =>
                                openArticleLink(
                                  `/profile?userId=${latestEntry[1].userId}`
                                )
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              By{' '}
                              {latestEntry.length != 0
                                ? latestEntry[1].user.name[0]
                                : 'User'}
                              <p className='m-0'>
                                {latestEntry[0]
                                  ? latestEntry[0][1].user?.designation[0] ?? ''
                                  : ''}
                              </p>
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
                              {/* {latestEntry.length != 0
                                ? latestEntry[1].category[0]
                                : 'category'} */}
                              Binance
                              <p className='mb-0'>Crypto Exchange Platform</p>
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
                            ? latestEntry[1].title.length > 58
                              ? `${latestEntry[1].title.slice(0, 58)}...`
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
                          <div className='count-description-pnl'>
                            <li
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleConnectModal(
                                  `/article?articleId=${
                                    latestEntry.length != 0
                                      ? latestEntry[0]
                                      : '#'
                                  }`
                                )
                              }
                            >
                              <span className='myanch'>
                                <Image
                                  src={'/images/like.svg'}
                                  width={25}
                                  height={25}
                                  alt='Icon Thumb'
                                  style={{ height: '22px', width: '22px' }}
                                />{' '}
                                {latestEntry.length != 0
                                  ? Number(latestEntry[1].likes)
                                  : 0}
                              </span>
                            </li>
                            <li
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleConnectModal(
                                  `/article?articleId=${
                                    latestEntry.length != 0
                                      ? latestEntry[0]
                                      : '#'
                                  }`
                                )
                              }
                            >
                              <p>
                                <Image src={iconmessage} alt='Icon Comment' />{' '}
                                12 Comments
                              </p>
                            </li>
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
                                  <Link
                                    href='#'
                                    style={{
                                      pointerEvents: 'none',
                                    }}
                                  >
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
                            <a
                              style={{
                                pointerEvents: 'none',
                              }}
                              href='#'
                            >
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a
                              style={{
                                pointerEvents: 'none',
                              }}
                              href='#'
                            >
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
                            <a
                              style={{
                                pointerEvents: 'none',
                              }}
                              href='#'
                            >
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a
                              style={{
                                pointerEvents: 'none',
                              }}
                              href='#'
                            >
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
                            <a
                              style={{
                                pointerEvents: 'none',
                              }}
                              href='#'
                            >
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a
                              style={{
                                pointerEvents: 'none',
                              }}
                              href='#'
                            >
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
              ) : // TODO:::
              Entries.length !== 0 ? (
                <>
                  <Col
                    xl='12'
                    lg='12'
                    md='12'
                    className='heding'
                    id='blockchain'
                  >
                    <h4>
                      <Image src={iconrss} alt='RSS' /> Blockchain News
                    </h4>
                    <div className='spacer-20'></div>
                  </Col>
                  <EntryListNewHome
                    Entries={Entries}
                    connectModel={() =>
                      handleConnectModal(
                        `/article?articleId=${
                          latestEntry.length != 0 ? latestEntry[0] : '#'
                        }`
                      )
                    }
                  />
                </>
              ) : (
                <div className='d-flex justify-content-center'>
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
                          <Image src={"/images/like.svg"} width={25} height={25} alt='Icon Thumb' /> 11
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
                          <Image src={"/images/like.svg"} width={25} height={25} alt='Icon Thumb' /> 11
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
                          <Image src={"/images/like.svg"} width={25} height={25} alt='Icon Thumb' /> 11
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
                          <Image src={"/images/like.svg"} width={25} height={25} alt='Icon Thumb' /> 11
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
              <Col
                xxl='12'
                xl='12'
                lg='12'
                md='12'
                className='heding'
                id='event'
              >
                <div className='custome-flex-div'>
                  <div className='upcoming-post-container'>
                    <h4 style={{ textTransform: 'unset' }}>
                      <Image src={iconevents} alt='Hot' /> Events
                    </h4>
                    <div className='spacer-20'></div>
                    <div className='flex-div-xs'>
                      <Link
                        href='#'
                        style={{
                          pointerEvents: 'none',
                        }}
                        className='upcoming-btn text-capitalize'
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
                  </div>
                  <div className='custome-slider-pnl heding'>
                    <Row>
                      <Col xl='9' lg='9' md='9' id='web3'>
                        <div className='flex-div-sm align-items-center'>
                          <h4 style={{ textTransform: 'unset' }}>
                            {/* <Col xl='9' lg='9' md='9' sm='9' className='heding'>
                    <div className='flex-div-xs align-items-center heding'>
                      <h4> */}
                            <Image src={iconcompass} alt='Hot' /> Web 3
                            Directory
                          </h4>
                          <Link
                            href='#'
                            style={{
                              pointerEvents: 'none',
                            }}
                            className='discover-btn'
                          >
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
                  </div>
                  <div className='leadership-cntnr ld-cntnr'>
                    <div className='heding'>
                      <h4>
                        <Image src={iconranking} alt='icon ranking' />{' '}
                        Leaderboard
                      </h4>
                    </div>
                    <LeadershipPost />
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Podcast Panel */}
          <div className='section scroll-anime' id='podcast'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-40'></div>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='podcast-survey-container'>
                  <PodcastPost />
                  <SurveyPost />
                </div>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-50'></div>
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
      <ConnectModal
        handleClose={handleConnectModalClose}
        showModal={showConnectModal}
        link={connectLink}
      />
    </>
  );
}
function Authenticated() {
  const router = useRouter();
  const [Entries, setEntries] = useState<any>([]);
  const [latestEntry, setLatestEntry] = useState<any>([]);
  const [lastIndex, setLastIndex] = useState(3);
  const [paginatedEntries, setPaginatedEntries] = useState<any[]>([]);
  const [entriesAmount, setEntriesAmount] = useState(0);
  const [isArticleLoading, setIsArticleLoading] = useState<any>(true);
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  const searchParams = useSearchParams();
  let cRoute = searchParams.get('route');
  const path = usePathname();
  let updateImg = async (img: any, name?: string) => {
    if (img) {
      let tempImg = await getImage(img);
      return tempImg;
    }
  };
  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);
  };
  let refineEntries = async (entriesList: any) => {
    const userAcotr = makeUserActor({
      agentOptions: {
        identity,
      },
    });

    const commentsActor = makeCommentActor({
      agentOptions: {
        identity,
      },
    });

    for (let entry = 0; entry < entriesList.length; entry++) {
      let newUser = null;
      var authorId = entriesList[entry][1].user.toString();
      newUser = await userAcotr.get_user_details([authorId]);
      const comments = await commentsActor.getComments(entriesList[entry][0]);
      logger(comments, 'LOLLLLLL');
      entriesList[entry][1].comment = false;

      if (comments.ok) {
        // setArticleComments(comments.ok[0]);
        let tempComments = comments.ok[0];

        let tempComment = tempComments[0];
        let commenterId = tempComment.user;
        let authorDetails = await userAcotr.get_user_name(commenterId);
        if (authorDetails[0]?.image.length > 0) {
          tempComment.image = await updateImg(authorDetails[0].image[0]);
        } else {
          tempComment.image = false;
        }
        logger({ authorDetails }, 'Name of comments');
        tempComment.author = authorDetails[0].name;
        tempComment.comments = tempComments.length;
        entriesList[entry][1].comment = tempComment;
        // logger({ Comment: comments.ok[0], identity }, 'THEM DOMMENTS');
      }
      if (newUser.ok) {
        if (newUser.ok[1].profileImg.length != 0) {
          newUser.ok[1].profileImg = await updateImg(
            newUser.ok[1].profileImg[0]
          );
        }
        entriesList[entry][1].userId = authorId;

        entriesList[entry][1].user = newUser.ok[1];
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

      const resp = await entryActor.getPaginatedEntries(0, 6);
      logger(resp, 'REsp of paginations');
      let tempEntries = resp.entries;
      if (tempEntries.length > 5) {
        const filteredEntries = tempEntries;
        let refined = await refineEntries(filteredEntries);
        setLatestEntry(refined);
        // let [bcaa, ...restEntries] = refined;
        // setEntries(restEntries);
        setIsArticleLoading(false);
      } else if (tempEntries.length != 0) {
        let refined = await refineEntries(tempEntries);
        // let [bcaa, ...restEntries] = refined;
        // setEntries(restEntries);

        setLatestEntry(refined);
        setIsArticleLoading(false);
        // setIsArticleLoading(false)
        // setLatestEntry(refined[0]);
      } else {
        setIsArticleLoading(false);
      }
      // setEntryId(templatestEntry[0]);
      // logger('pop');
    } catch (err) {
      setIsArticleLoading(false);
      // logger('pop');
    }
  };
  const getNewEntries = async () => {
    logger('new entries were called');
    try {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      let startIndex = paginatedEntries.length + 3;
      // if (entriesAmount > 5) {
      //   startIndex = lastIndex > entriesAmount ? entriesAmount - 1 : lastIndex;
      // }

      logger(startIndex, 'getting for diddd');
      const resp = await entryActor.getPaginatedEntries(startIndex, 3);
      logger(resp, 'Paginatein RESP of paginations');
      let tempEntries = resp.entries;
      setEntriesAmount(parseInt(resp.amount));
      if (tempEntries) {
        const filteredEntries = tempEntries;
        let refined = await refineEntries(filteredEntries);

        setLastIndex((prev) => prev + 3);
        // setLatestEntry();
        setPaginatedEntries((prev: any) => [...prev, ...refined]);
        // let [bcaa, ...restEntries] = refined;
        // setEntries(restEntries);
        setIsArticleLoading(false);
      } else {
        setIsArticleLoading(false);
      }
      // setEntryId(templatestEntry[0]);
      // logger('pop');
    } catch (err) {
      setIsArticleLoading(false);
      // logger('pop');
    }
  };
  let copyToClipboard = (e: any, link: string) => {
    e.preventDefault();
    let newPath = path.split('/');
    // newPath = newPath + link;
    const currentURL = window.location.href.split('/');
    const fetched = currentURL[2] + '/';
    logger(currentURL, 'PEPEPEPEPEP');
    let location = window.navigator.clipboard.writeText(fetched + link);
    toast.success('URL copied to clipboard');
  };
  useEffect(() => {
    getNewEntries();
    getEntries();
  }, []);
  useEffect(() => {
    if (cRoute && auth.state === 'initialized') {
      const targetElement = document.getElementById(cRoute);

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 3000);
      }
    }
  }, [cRoute, auth]);
  // router.push('/route')
  return (
    <>
      <main id='main' className='new-home pt-0'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section scroll-anime anime-down' id='news'>
            <Row>
              <Col xxl='3' xl='4' lg='12' md='12' sm='12'>
                <Row>
                  <Col
                    xxl='12'
                    xl='12'
                    lg='12'
                    md='12'
                    className='heding icp-leadership-pnl'
                    id='event'
                  >
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
                  <Col xxl='12' xl='12' lg='12' className='ld-cntnr'>
                    <div className='flex-div align-items-center heding'>
                      <h4>
                        <Image src={iconfeed} alt='icon feed' /> Add Your feed
                      </h4>
                      <Link
                        href='#'
                        style={{
                          pointerEvents: 'none',
                        }}
                        className='story-btn v2'
                      >
                        Coming Soon
                      </Link>
                      <h4>
                        <Image src={iconinfo} alt='icon info' />
                      </h4>
                    </div>
                    <div className='spacer-20'></div>
                    <ul className='follow-list'>
                      <li>
                        <div className='user-panel'>
                          <div className='img-pnl'></div>
                          <div className='txty-pnl'>
                            <h4>JPYC.Inc</h4>
                            <p>Company Information Services</p>
                            <Link
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                              className='follow-btn'
                            >
                              + Follow
                            </Link>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='user-panel'>
                          <div className='img-pnl'></div>
                          <div className='txty-pnl'>
                            <h4>JPYC.Inc</h4>
                            <p>Company Information Services</p>
                            <Link
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                              className='follow-btn'
                            >
                              + Follow
                            </Link>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='user-panel'>
                          <div className='img-pnl'></div>
                          <div className='txty-pnl'>
                            <h4>JPYC.Inc</h4>
                            <p>Company Information Services</p>
                            <Link
                              href='#'
                              style={{
                                pointerEvents: 'none',
                              }}
                              className='follow-btn'
                            >
                              + Follow
                            </Link>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Col>
                  <Col xxl='12' xl='12' lg='12' className='ld-cntnr heding'>
                    <h4>
                      <Image src={iconranking} alt='icon ranking' /> Leaderboard
                    </h4>
                    <LeadershipPost />
                  </Col>
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

                      {/* <Dropdown.Menu>
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
                  <Col xxl='12' xl='12' lg='6' md='6' sm='6'>
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
                            <a href='https://nftstudio24.com/news/'>
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a href='https://nftstudio24.com/news/'>
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='12' lg='6' md='6' sm='6'>
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
                            <a href='https://nftstudio24.com/news/'>
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a href='https://nftstudio24.com/news/'>
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='12' lg='6' md='6' sm='6'>
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
                            <a href='https://nftstudio24.com/news/'>
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a href='https://nftstudio24.com/news/'>
                              <Image src={iconmessage} alt='Icon Comment' /> 12
                              Comments
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xxl='12' xl='12' lg='6' md='6' sm='6'>
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
                            <a href='https://nftstudio24.com/news/'>
                              <Image
                                src={'/images/like.svg'}
                                width={25}
                                height={25}
                                alt='Icon Thumb'
                              />{' '}
                              11
                            </a>
                          </li>
                          <li>
                            <a href='https://nftstudio24.com/news/'>
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
              <Col xxl='9' xl='8' lg='12' md='12' className='log-home'>
                <div className='anime-right'>
                  <Row>
                    {isArticleLoading ? (
                      <div className='d-flex justify-content-center'>
                        <Spinner />
                      </div>
                    ) : (
                      latestEntry.length > 0 && (
                        <HomeArticle article={latestEntry[0]} />
                      )
                    )}
                    <div className='spacer-40'></div>
                    <Col
                      xl='12'
                      lg='12'
                      md='12'
                      className='heding'
                      id='blockchain'
                    >
                      <h4>
                        <Image src={iconrss} alt='RSS' /> Blockchain News
                      </h4>
                      <div className='spacer-20'></div>
                      {/* <GeneralSlider /> */}
                      <NewsSlider />
                    </Col>
                    {isArticleLoading ? (
                      <div
                        style={{
                          width: '100%',
                          height: 1100,
                        }}
                      ></div>
                    ) : (
                      latestEntry.length > 1 && (
                        <HomeArticle article={latestEntry[1]} />
                      )
                    )}

                    <div className='spacer-40'></div>
                    <Col xl='12' lg='12' md='12'>
                      <div className='anime-right'>
                        <Row>
                          <Col
                            xl='12'
                            lg='12'
                            md='12'
                            className='heding'
                            id='pressRelease'
                          >
                            <div className='spacer-30'></div>

                            <h4>
                              <Image src={press} alt='Hot' /> Press Release
                            </h4>
                            <div className='spacer-20'></div>
                          </Col>
                          <ReleaseSlider />
                        </Row>
                      </div>
                    </Col>
                    <div className='spacer-30'></div>
                    {isArticleLoading ? (
                      <div
                        style={{
                          width: '100%',
                          height: 1100,
                        }}
                      ></div>
                    ) : (
                      latestEntry.length > 2 && (
                        <HomeArticle article={latestEntry[2]} />
                      )
                    )}

                    <div className='spacer-40'></div>
                    <Col xl='12' lg='12' md='12'>
                      <div className='anime-left'>
                        <Row>
                          <Col
                            xl='12'
                            lg='12'
                            md='12'
                            className='heding'
                            id='campaign'
                          >
                            <div className='spacer-30'></div>
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
                  </Row>
                </div>
              </Col>
            </Row>
            <InfiniteScroll
              dataLength={paginatedEntries.length} //This is important field to render the next data
              next={getNewEntries}
              scrollThreshold={'10px'}
              hasMore={true}
              style={{ overflow: 'unset' }}
              loader={
                <div className='d-flex justify-content-center mt-4'>
                  <Spinner />
                </div>
              }
              // endMessage={<p>DUDE WHAT U WATCHING ?? ITS GONE</p>}
              // below props only if you need pull down functionality
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
                //  className='d-flex flex-row flex-wrap gap-5'
              >
                {paginatedEntries.map((mappedEntry: any) =>
                  isArticleLoading ? (
                    <div className='d-flex justify-content-center'>
                      <Spinner />
                    </div>
                  ) : (
                    paginatedEntries.length > 0 && (
                      <HomeArticle article={mappedEntry} small={true} />
                    )
                  )
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
        {/* Partners Site Panel */}
        <div className='spacer-40'></div>
      </main>
    </>
  );
}
function HomeArticle({ article, small }: { article: any; small?: boolean }) {
  let [likeCount, setLikeCount] = useState(0 ?? Number(article[1].likes));
  let [commentVal, setCommentVal] = useState('');
  let [commentsLength, setCommentsLength] = useState(
    article[1].comment.comments ?? 0
  );
  const [isCommenting, setIsCommenting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  let [isliked, setIsLiked] = useState(
    article[1].likedUsers.some((u: any) => u.toString() == article[1].userId)
  );

  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  const router = useRouter();
  const path = usePathname();

  const fouceOnInputField = async (e: any) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isConnected = () => {
    if (auth.state === 'anonymous') {
      toast.error(
        'To perform this action, kindly connect to Internet Identity.',
        {}
      );
      return false;
    }
    return true;
  };
  const sendcomment = async (e: any) => {
    e.preventDefault();
    logger(commentVal.trim().length, 'c2');
    if (commentVal.trim().length < 1) {
      return toast.error("Comment can't be empty.");
    }
    if (commentVal.trim().length > 400) {
      return toast.error("Comment can't be more then 400 charactors.");
    }
    try {
      if (!isConnected()) return;

      setIsCommenting(true);
      const commentsActor = makeCommentActor({
        agentOptions: {
          identity,
        },
      });
      const addedComment = await commentsActor.addComment(
        commentVal,
        userCanisterId,
        article[0]
      );
      // const user = await auth.actor.get_user_details([principal]);
      // const dateNow = moment.utc().format('MMMM Do, YYYY');
      // const newComment = {
      //   creation_time: utcToLocal('', 'MMMM Do, YYYY, HH:mm'),
      //   user: user.ok[1],
      //   content: currentComment,
      //   userId: principal,
      // };
      // setUserArticleComments((prev: any) => {
      //   return [newComment, ...prev];
      // });
      if (addedComment.ok) {
        setIsCommenting(false);
        setCommentsLength((pre: any) => pre + 1);
        setCommentVal('');
        toast.success('Comment added successfully.');
      } else {
        setIsCommenting(false);
        toast.error('Something went wrong.');
      }
      logger(addedComment, 'comment1');
      // handleCommented();
    } catch (err) {
      logger(err, 'ERR');
      setIsCommenting(false);

      // handleCommented();
    }
  };
  const likeEntry = async () => {
    if (!isliked) {
      setLikeCount((pre) => pre + 1);
      setIsLiked(true);
    } else {
      setLikeCount((pre) => pre - 1);
      setIsLiked(false);
    }

    return new Promise(async (resolve, reject) => {
      if (!article || !article[1].userId)
        reject('NO Entry or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeEntry(article[0], userCanisterId, commentCanisterId)
        .then(async (entry: any) => {
          logger(entry, 'een');
          resolve(entry);
        })
        .catch((err: any) => {
          logger(err);
          if (!isliked) {
            setLikeCount((pre) => pre + 1);
            setIsLiked(true);
          } else {
            setLikeCount((pre) => pre - 1);
            setIsLiked(false);
          }
          reject(err);
        });
    });
  };
  let copyToClipboard = (e: any, link: string) => {
    e.preventDefault();
    let newPath = path.split('/');
    // newPath = newPath + link;
    const currentURL = window.location.href.split('/');
    const fetched = currentURL[2] + '/';
    logger(currentURL, 'PEPEPEPEPEP');
    let location = window.navigator.clipboard.writeText(fetched + link);
    toast.success('URL copied to clipboard');
  };

  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);
  };
  useEffect(() => {
    setLikeCount(Number(article[1].likes));
  }, [article]);
  return (
    <Col
      xl={small ? '9' : '12'}
      lg='12'
      md='12'
      className={small ? 'my-5' : ''}
    >
      <div className='social-space-post'>
        {article[1]?.comment && (
          <div className='header-pnl'>
            {/* <div className='img-pnl'></div> */}
            {article[1].comment.image ? (
              <Image
                alt='commenter'
                src={article[1].comment.image}
                width={60}
                height={60}
              />
            ) : (
              <Image alt='commenter' src={icongirl} width={60} height={60} />
            )}
            <div className='txt-pnl'>
              <p>
                <b>{article[1].comment.author}</b> commented on this article
              </p>
              <ul>
                <li>
                  <Link
                    style={{ pointerEvents: 'none' }}
                    href='https://nftstudio24.com/news/'
                  >
                    <i className='fa fa-ellipsis-h'></i>
                  </Link>
                </li>
                <li>
                  <Link
                    style={{ pointerEvents: 'none' }}
                    href='https://nftstudio24.com/news/'
                  >
                    <i className='fa fa-close'></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        <div className='top-text-pnl'>
          <div className='flex-div-xs'>
            <div className='user-panel'>
              <Image
                src={
                  article[1].user?.profileImg.length != 0
                    ? article[1].user?.profileImg
                    : girl
                }
                alt='User'
                width={60}
                height={60}
              />

              <div className='txty-pnl'>
                <h6>By</h6>
                <h4
                  onClick={() =>
                    openArticleLink(`/profile?userId=${article[1].userId}`)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {article[1].user?.name ?? 'User name  '}
                </h4>
                <p className='m-0'>
                  {article ? article[1].user.designation[0] ?? '' : ''}
                </p>
              </div>
            </div>
            <div className='user-panel'>
              <div>
                <Image src={iconbnb} alt='BNB' />
              </div>
              <Link href='#' className='txty-pnl'>
                <h6>On</h6>
                <h4 className='mb-0' style={{ lineHeight: 1 }}>
                  Binance
                  {/* {article[1]?.category ? article[1].category[0] : 'category'} */}
                </h4>
                <p>Crypto Exchange Platform</p>
              </Link>
            </div>
          </div>
          <p
            onClick={() =>
              openArticleLink(
                `/article?articleId=${article[0] ?? 'noarticlefound'}`
              )
            }
            style={{
              overflowX: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            }}
          >
            {article[1]?.title ? article[1].title : 'Article Title '}
          </p>
        </div>
        <div
          className='post-image-pnl'
          style={{
            position: 'relative',
            width: '100%',
            height: 470,
          }}
        >
          {/* <Image src={post1} alt='Post' /> */}
          {article[1]?.image && (
            <Link
              href={`/article?articleId=${article[0] ?? '#'}`}
              target='_self'
            >
              <Image src={article[1]?.image} fill={true} alt='articleimage' />
            </Link>
          )}
        </div>
        <div className='grey-text-pln '>
          <div>
            <h4>
              Bitcoin Dips Below $26K, Ether Surges 11% after ETF Futures
              Prospects
            </h4>
            <h6>NFTSTudio24.com</h6>
          </div>
          <Link href='https://nftstudio24.com/news/' className='learn-more-btn'>
            {' '}
            Learn more
          </Link>
        </div>
        <div className='txt-pnl'>
          <ul className='post-comment-list'>
            <li>
              <Image src={iconcoin} alt='Icon Comment' /> +500 NS24
            </li>
            <li>
              <a href={`/article?articleId=${article[0]}`} className='mr-3'>
                <Image
                  src={`${isliked ? '/images/liked.svg' : '/images/like.svg'}`}
                  width={25}
                  height={25}
                  alt='Icon Thumb'
                />{' '}
                {likeCount ?? 0}
              </a>
            </li>
            <li>
              <a href={`/article?articleId=${article[0]}&route=comments`}>
                <Image src={iconmessage} alt='Icon Comment' />{' '}
                {commentsLength ?? 0} Comments
              </a>
            </li>
          </ul>
          <ul className='post-comment-info-list'>
            {/* <li>
              <div className='d-flex'>
                <ul className='vote-comment-list'>
                  <li>
                    <div>
                      <Image src={iconrise} alt='Rise' /> Vote
                    </div>
                    <div>{Number(article[1].likes) ?? 0}</div>
                  </li>
                </ul>
              </div>
            </li> */}
            <li>
              <div
                className='d-flex align-items-center gap-1'
                style={{ cursor: 'pointer' }}
                onClick={likeEntry}
              >
                <Image
                  src={`${isliked ? '/images/liked.svg' : '/images/like.svg'}`}
                  width={25}
                  height={25}
                  alt='Icon Thumb'
                />
                <a
                  href='#'
                  onClick={(e: any) => e.preventDefault()}
                  className='mr-3'
                >
                  {' '}
                  {likeCount ?? 0} Like
                </a>
              </div>
            </li>
            <li>
              <a href='#' onClick={fouceOnInputField}>
                <Image src={iconmessage} alt='Icon Comment' />{' '}
                {commentsLength ?? 0} Comments
              </a>
            </li>
            {/* <li>
              <a
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
              >
                <Image src={iconretweet} alt='Icon Comment' /> Repost
              </a>
            </li> */}
            <li>
              <a
                href='#'
                onClick={(e) =>
                  copyToClipboard(e, `article?articleId=${article[0]}`)
                }
              >
                <Image src={iconshare} alt='Icon Comment' /> Share
              </a>
            </li>
          </ul>
          <div className='grey-text-pln round'>
            <Image className='mx-2' src={iconnotice} alt='Icon Notice' />{' '}
            <p>
              Boost your expertise, contribute now!{' '}
              <Image className='pic' src={iconcrown} alt='Icon Crown' />{' '}
              <span>Earn the Web3 Expert Badge</span> for your insights in this
              field. – your path to distinction is just a click away!{' '}
              <Link
                href='#'
                style={{
                  pointerEvents: 'none',
                }}
                className='story-btn v2'
              >
                Coming Soon
              </Link>
            </p>
          </div>
        </div>
        <div
          className='footer-pnl'
          // onClick={() =>
          //   openArticleLink(`/article?articleId=${article[0]}&route=comments`)
          // }
        >
          <div className='img-pnl'></div>
          <div className='txt-pnl'>
            <input
              type='text'
              placeholder='add a comment'
              value={commentVal}
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendcomment(e);
                }
              }}
              onChange={(e) => setCommentVal(e.target.value)}
            />
            {commentVal.length > 0 ? (
              <ul>
                <li>
                  {isCommenting ? (
                    <Spinner animation='border' size='sm' />
                  ) : (
                    <Link href='#' onClick={sendcomment}>
                      <i className='fa fa-send'></i>
                    </Link>
                  )}
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <Link
                    href='#'
                    style={{ pointerEvents: 'none' }}
                    className='disabled'
                  >
                    <i className='fa fa-send'></i>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </Col>
  );
}
export default function HomePage() {
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  useEffect(() => {}, []);
  return (
    <main>
      {auth.isLoading ? (
        <main id='main' className='new-home'>
          <div className='main-inner home'>
            <div className='d-flex justify-content-center'>
              <Spinner />
            </div>
          </div>
        </main>
      ) : identity ? (
        <Authenticated />
      ) : (
        <UnAuthenticated />
      )}
    </main>
  );
}
