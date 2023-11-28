'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Row,
  Col,
  Table,
  Dropdown,
  Form,
  Breadcrumb,
  Button,
  Spinner,
} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import loader from '@/assets/Img/Icons/icon-loader.png';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import post2 from '@/assets/Img/Posts/small-post-11.png';
import post3 from '@/assets/Img/Posts/small-post-12.png';
import post4 from '@/assets/Img/Posts/small-post-13.png';
import post5 from '@/assets/Img/Posts/small-post-14.png';
import post6 from '@/assets/Img/Posts/small-post-15.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeEntryActor,
  makeSubscriberActor,
} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { utcToLocal } from '@/components/utils/utcToLocal';
// import { usePopper } from 'react-popper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
let itemsPerPage = 6;

function Items({
  currentItems,
  pageNum,
}: {
  currentItems: any[];
  pageNum: number;
}) {
  const startIndex = pageNum * itemsPerPage + 1;
  // const tooltipRef = useRef<HTMLDivElement | null>(null);
  // const boxRef = useRef<HTMLDivElement | null>(null);
  // const [showTip, setShowTip] = useState(false);

  // const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current);
  return (
    <>
      <Col xl='12' lg='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table className='article-table simple'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((sub: any, index) => {
                    let email = sub.email;
                    if (email.length <= 0) {
                      email = 'no email found';
                    } else if (email.length <= 18) {
                      email = sub.email;
                    } else {
                      email =
                        email.substring(0, 5) +
                        '...' +
                        email.substring(email.length - 10, email.length);
                    }
                    return (
                      <tr>
                        <td>{startIndex + index}</td>
                        <td>{sub.name}</td>
                        <td>{sub.id}</td>
                        <Tippy
                          disabled={sub.email.length <= 18}
                          content={
                            <div>
                              <p className='mt-2'>{sub.email}</p>
                            </div>
                          }
                        >
                          <td>{email}</td>
                        </Tippy>
                        <td>
                          {utcToLocal(
                            sub.subscribedOn.toString(),
                            'MM-DD-YYYY'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {/* <tr>
                    <td>02</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>03</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>04</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>05</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>06</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>07</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>08</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>09</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Jphn Doe</td>
                    <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                    <td>JphnDoe@example.com</td>
                    <td>20-01-2023</td>
                  </tr> */}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}

export default function AllArticles() {
  const [entriesList, setEntriesList] = useState([]);
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [userArticleList, setUserArticleList] = useState<any[]>([]);
  const [activeListName, setActiveListName] = useState('All');
  const [subscribersList, setSubscribersList] = useState<any[]>([]);
  const [refinedSubscribersList, setRefinedSubscribersList] = useState<any[]>(
    []
  );
  const [activeList, setActiveList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userDraftList, setUserDraftList] = useState<any[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const router = useRouter();
  const pathName = usePathname();
  const { auth, setAuth, identity } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
    })
  );

  const endOffset = itemOffset + itemsPerPage;
  let currentItems = subscribersList.slice(itemOffset, endOffset);
  let pageCount = Math.ceil(subscribersList.length / itemsPerPage);

  const getSubscribers = async () => {
    const subscriberActor = makeSubscriberActor({
      agentOptions: {
        identity,
      },
    });
    const tempSubs = await subscriberActor.getSubscribers();
    if (tempSubs.ok) {
      setSubscribersList(tempSubs.ok[0]);
    } else {
      logger(tempSubs);
    }
    logger(tempSubs, 'SUBBBBBB');
  };
  const getRefinedSubscribers = async (tempSubList: any[]) => {
    if (tempSubList.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempSubList.map(async (sub: any) => {
        const userId = sub.user.toString();

        const user = await auth.actor.get_user_details([userId]);
        logger(user, 'This is user');
        return {
          id: userId,
          subscribedOn: sub.subscribed_on,
          name: user.ok[1].name[0] ?? '',
          email: user.ok[1].email[0] ?? '',
        };
      })
    );
    return refinedPromise;
  };
  const getCategories = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const tempCat = await entryActor.getCategories();
    setCategories(tempCat);
  };
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        if (entry[1].image) {
          image = getImage(entry[1].image);
        }
        const userId = entry[1].user.toString();

        const user = await auth.actor.get_user_details([userId]);

        // let
        let newItem = {
          entryId: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          categories: entry[1].category,
          title: entry[1].title,
          isDraft: entry[1].isDraft,
          user: user.ok[1],
          userId,
        };
        return newItem;
      })
    );

    return refinedPromise;
  };
  const getEntriesList = async (all?: string) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const tempList = await entryActor.getEntriesList(
      all ? all : selectedCategory
    );
    setEntriesList(tempList);
    setActiveList(tempList);
    logger(tempList, 'Entries List');

    // logger(
    //   tempList.slice(0, itemsPerPage),
    //   'Entries List fetched from canister'
    // );
    // const myEntries = await getRefinedList(tempList.slice(0, itemsPerPage));
    // setProcessedList(myEntries);
    return tempList;
  };

  const getUserEntries = async (
    reset?: boolean,
    draft: boolean = false,
    all?: string
  ) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const tempList = await entryActor.getUserEntriesList(
      all ? all : selectedCategory,
      draft
    );
    if (draft) {
      setUserDraftList(tempList);
    } else {
      setUserArticleList(tempList);
    }
    logger(tempList, 'JUST SAT THIS');
    if (reset) {
      setActiveList(tempList);

      // const myEntries = await getRefinedList(tempList);
      // setProcessedList(myEntries);
      // setActiveListName(draft ? 'Draft' : 'User');
      return;
    }
    return;
    // logger(myEntries, 'Entries List fetched from canister');
  };

  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * itemsPerPage) % subscribersList.length;
    // setItemOffset(newOffset);
    const newItems = subscribersList.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await getRefinedSubscribers(newItems);
    logger({ newOffset, subscribersList, newItems, tempList }, 'EEEEVENTTT');
    setRefinedSubscribersList(tempList);
    setIsGetting(false);
  };
  const handleTabChange = (tab: string) => {
    setIsGetting(true);
    setSelectedCategory('All');
    setActiveListName(tab);
    setForcePaginate(0);
    if (tab === 'All') {
      // getEntriesList('All');
    } else if (tab === 'Mine') {
      // getUserEntries(true, false, 'All');
    } else if (tab === 'Draft') {
      // getUserEntries(true, true, 'All');
    }
    setIsGetting(false);
  };

  const filter = () => {
    if (activeListName == 'All') {
      getEntriesList();
    } else if (activeListName === 'Mine') {
      getUserEntries(true);
    } else if (activeListName === 'Draft') {
      getUserEntries(true, true);
    }
  };

  // useEffect(() => {}, [selectedCategory]);

  useEffect(() => {
    if (auth.client) {
      const tempFun = async () => {
        setIsGetting(true);
        const tempList = await getRefinedSubscribers(currentItems);
        setRefinedSubscribersList(tempList);
        setIsGetting(false);
      };
      tempFun();
    }
  }, [subscribersList]);

  useEffect(() => {
    // getEntriesList();
    // getCategories();
  }, []);

  useEffect(() => {
    if (auth.client) {
      const tempFun = async () => {
        setIsGetting(true);
        const tempList = await getRefinedSubscribers(currentItems);
        setRefinedSubscribersList(tempList);
        setIsGetting(false);
      };
      tempFun();
    }
    if (auth.state !== 'initialized') {
      router.replace('/');
    }
  }, [auth, pathName]);

  useEffect(() => {
    if (identity) {
      // getUserEntries();
      getSubscribers();
      // getUserEntries(false, true);
    }
  }, [identity, pathName]);

  return (
    <>
      <main id='main'>
        {auth.state === 'initialized' && (
          <div className='main-inner home'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='pbg-pnl text-left'>
                    <Row>
                      <Col xl='12' lg='12'>
                        <div className='full-div d-flex justify-content-end mb-5'>
                          {/* <div>
                          {auth.state === 'initialized' && (
                            <Button
                              className='default-btn'
                              onClick={() => router.push('/addarticle')}
                            >
                              <i className='fa fa-plus'></i> Create Article
                            </Button>
                          )}
                        </div> */}
                          {/* <div></div> */}

                          <div>
                            <div className='search-post-pnl'>
                              <input type='text' placeholder='Search Users' />
                              <button>
                                <i className='fa fa-search'></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xl='6' lg='12'>
                        <div className='full-div'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select aria-label='All Dates'>
                                <option>All Dates</option>
                                <option value='1'>All Dates</option>
                                <option value='2'>All Dates</option>
                                <option value='3'>All Dates</option>
                              </Form.Select>
                            </li>
                            {/* <li>
                            <Form.Select
                              aria-label='All Categories'
                              value={selectedCategory}
                              onChange={(e) =>
                                setSelectedCategory(e.target.value)
                              }
                            >
                              <option value={'All'}>All Categories</option>
                              {categories.map((category) => (
                                <option value={category}>{category}</option>
                              ))}
                            </Form.Select>
                          </li> */}
                            <li>
                              <Button className='filter-btn' onClick={filter}>
                                Filter
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                      <Col xl='6' lg='12'>
                        <div className='pagination-container'>
                          <ReactPaginate
                            breakLabel='...'
                            nextLabel=''
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel=''
                            renderOnZeroPageCount={null}
                            forcePage={forcePaginate}
                          />
                        </div>
                      </Col>
                      {isGetting ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : refinedSubscribersList.length > 0 ? (
                        <Items
                          pageNum={forcePaginate}
                          currentItems={refinedSubscribersList}
                        />
                      ) : (
                        <p className='text-center'>No Subscribers Found</p>
                      )}
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
