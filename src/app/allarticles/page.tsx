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
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { utcToLocal } from '@/components/utils/utcToLocal';
// import { usePopper } from 'react-popper';
import Tippy from '@tippyjs/react';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

function Items({
  currentItems,
  currentTab,
}: {
  currentItems: any[];
  currentTab: string;
}) {
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
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                    <th>
                      <p>
                        Title <Image className='arw' src={arrows} alt='arrow' />
                      </p>
                    </th>
                    <th>Author</th>
                    <th>Categories</th>
                    <th>
                      <p>
                        Date <Image className='arw' src={arrows} alt='arrow' />
                      </p>
                    </th>
                    {currentTab === 'Minted' && <th>Minted</th>}
                    <th className='text-center'>
                      <div className='d-flex align-items-center justify-content-center'>
                        <Image src={loader} alt='loader' /> Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((article) => (
                    <tr key={article.entryId}>
                      <td>
                        <Link
                          href={
                            article.isDraft
                              ? `/addarticle?draftId=${article.entryId}`
                              : `/article?articleId=${article.entryId}`
                          }
                        >
                          <div className='d-flex align-items-start'>
                            {article.image ? (
                              <div
                                style={{
                                  minWidth: 89,
                                  height: 46,
                                  position: 'relative',
                                  marginRight: 10,
                                }}
                              >
                                <Image
                                  src={article.image}
                                  fill
                                  sizes='(max-width: 2000px) 89px,46px'
                                  alt='Post'
                                />
                              </div>
                            ) : (
                              <Image src={post1} alt='Post' />
                            )}
                            <p style={{ maxWidth: 480 }}>
                              {article.title.slice(0, 75)}
                              {article.title.length > 75 && '...'}{' '}
                              {article.isDraft && <span>| Draft </span>}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Link href={`/profile?userId=${article.userId}`}>
                          <p>{article?.user.name}</p>
                        </Link>
                      </td>
                      <td>
                        <Tippy
                          content={
                            article?.categories?.length > 0 ? (
                              <div className='categories'>
                                {article.categories.map(
                                  (category: string, index: number) => (
                                    <p className='category'>
                                      {category}
                                      {!(
                                        index ===
                                        article.categories.length - 1
                                      ) && ', '}
                                    </p>
                                  )
                                )}
                              </div>
                            ) : (
                              ''
                            )
                          }
                        >
                          <p>
                            {article.categories[0] + ' '}{' '}
                            {article.categories.length > 1 &&
                              '+' + (article.categories.length - 1) + ' more'}
                          </p>
                        </Tippy>
                        {/* <div ref={boxRef}></div>
                          <div
                            ref={tooltipRef}
                            className='my-tooltip'
                            style={styles.popper}
                            {...attributes.popper}
                          >
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Beatae, modi?
                          </div> */}
                      </td>
                      <td>
                        <span className='w-100'>Created At</span>
                        {/* 2023/11/08 at 06:52 pm */}
                        <span>
                          {utcToLocal(
                            article.creation_time,
                            'YYYY/MM/DD  hh:mm a'
                          )}
                        </span>
                      </td>
                      {currentTab === 'Minted' && (
                        <td>
                          {/* 2023/11/08 at 06:52 pm */}
                          <span>
                            {article?.minters?.length
                              ? article?.minters?.length + 1
                              : '0'}
                          </span>
                        </td>
                      )}

                      <td className='text-center'>
                        <div className='d-flex align-items-center gap-1'>
                          <span
                            className={`circle-span m-0 ${
                              article.isDraft ? 'red' : 'green'
                            }`}
                          ></span>
                          <p> {article.isDraft ? 'Draft' : 'Minted'}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* <tr>
                      <td>
                        <div className='d-flex align-items-start'>
                          <Image src={post2} alt='Post' />
                          <p>
                            6 NFT Projects currently popular on the Tezos
                            marketplace{' '}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p>NFTStudio24</p>
                      </td>
                      <td>
                        <p>News</p>
                      </td>
                      <td>
                        <span className='w-100'>Last Modified</span>
                        <span>2023/11/08 at 06:52 pm</span>
                      </td>
                      <td className='text-center'>
                        <span className='circle-span green'></span>
                      </td>
                    </tr>
                          */}
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

  let itemsPerPage = 6;
  const endOffset = itemOffset + itemsPerPage;
  let currentItems = activeList.slice(itemOffset, endOffset);
  let pageCount = Math.ceil(activeList.length / itemsPerPage);

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
        logger(entry);
        // let
        let newItem = {
          entryId: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          categories: entry[1].category,
          title: entry[1].title,
          isDraft: entry[1].isDraft,
          user: user.ok[1],
          minters: entry[1].minters,
          userId,
        };
        return newItem;
      })
    );

    return refinedPromise;
  };
  const getEntriesList = async (all?: string) => {
    const categ = all ? all : selectedCategory;

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    logger(categ, 'Getting for this');
    const tempList = await entryActor.getEntriesList(categ);
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
    const newOffset = (event.selected * itemsPerPage) % activeList.length;
    // setItemOffset(newOffset);
    const newItems = activeList.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await getRefinedList(newItems);
    logger({ newOffset, activeList, newItems, tempList }, 'EEEEVENTTT');
    setProcessedList(tempList);
    setIsGetting(false);
  };
  const handleTabChange = (tab: string) => {
    setIsGetting(true);
    setSelectedCategory('All');
    setActiveListName(tab);
    setForcePaginate(0);
    if (tab === 'All' || tab === 'Minted') {
      getEntriesList('All');
    } else if (tab === 'Mine') {
      getUserEntries(true, false, 'All');
    } else if (tab === 'Draft') {
      getUserEntries(true, true, 'All');
    }
    setIsGetting(false);
  };

  const filter = () => {
    if (activeListName == 'All' || activeListName == 'Minted') {
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
        const tempList = await getRefinedList(currentItems);
        logger(tempList, 'Entries   THIS IS ITTT');
        setProcessedList(tempList);
        setIsGetting(false);
      };

      tempFun();
    }
  }, [entriesList, activeList]);

  useEffect(() => {
    // if ()
    // getEntriesList();
    getCategories();
  }, []);

  useEffect(() => {
    if (auth.client) {
      const tempFun = async () => {
        setIsGetting(true);
        const tempList = await getRefinedList(currentItems);
        setProcessedList(tempList);
        setIsGetting(false);
      };

      tempFun();
    }
  }, [auth, pathName]);

  useEffect(() => {
    if (identity) {
      setSelectedCategory('Mine');
      setActiveListName('Mine');
      getUserEntries();
      handleTabChange('Mine');
      getUserEntries(false, true);
    } else if (auth.state === 'anonymous') {
      setSelectedCategory('All');
      setActiveListName('All');
      handleTabChange('All');

      getEntriesList();
    }
  }, [identity, pathName, auth]);

  return (
    <>
      <main id='main'>
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
                      <div className='flex-div-sm'>
                        <div>
                          {auth.state === 'initialized' && (
                            <Button
                              className='default-btn'
                              onClick={() => router.push('/addarticle')}
                            >
                              <i className='fa fa-plus'></i> Create Article
                            </Button>
                          )}
                        </div>

                        <div>
                          <div className='search-post-pnl'>
                            <input type='text' placeholder='Search Posts' />
                            <button>
                              <i className='fa fa-search'></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12'>
                      <ul className='all-filters-list'>
                        {auth.state !== 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('All')}
                              className={
                                activeListName === 'All' ? 'active' : ''
                              }
                            >
                              <p>All</p>({entriesList.length})
                            </span>
                          </li>
                        )}

                        {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('Mine')}
                              className={
                                activeListName === 'Mine' ? 'active' : ''
                              }
                            >
                              <p> All </p>({userArticleList?.length ?? '0'})
                            </span>
                          </li>
                        )}
                        <li>
                          <span
                            onClick={() => handleTabChange('Minted')}
                            className={
                              activeListName === 'Minted' ? 'active' : ''
                            }
                          >
                            <p>Minted article</p>({entriesList.length})
                          </span>
                        </li>
                        {/* <li>
                          <Link href='/'>
                            <p>Pending</p>
                            (8)
                          </Link>
                        </li> */}

                        {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('Draft')}
                              className={
                                activeListName === 'Draft' ? 'active' : ''
                              }
                            >
                              <p> Drafts </p>({userDraftList?.length ?? '0'})
                            </span>
                          </li>
                        )}
                      </ul>
                    </Col>
                    <Col xl='6' lg='12'>
                      <div className='full-div'>
                        <ul className='filter-list'>
                          {/* <li>
                            <Form.Select aria-label='All Dates'>
                              <option>All Dates</option>
                              <option value='1'>All Dates</option>
                              <option value='2'>All Dates</option>
                              <option value='3'>All Dates</option>
                            </Form.Select>
                          </li> */}
                          <li>
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
                          </li>
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
                    ) : processedList.length > 0 ? (
                      <Items
                        currentTab={activeListName}
                        currentItems={processedList}
                      />
                    ) : (
                      <p>No Articles Found</p>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
