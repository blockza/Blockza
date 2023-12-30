'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { ArticlesList } from '@/components/ArticlesList';
import { EntrySizeMap } from '@/types/dashboard';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function Reward() {
  const [entriesList, setEntriesList] = useState([]);
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [userArticleList, setUserArticleList] = useState<any[]>([]);
  const [activeListName, setActiveListName] = useState('All');
  const [activeList, setActiveList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userDraftList, setUserDraftList] = useState<any[]>([]);
  const [oldAuth, setOldAuth] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);

  const [showLoader, setShowLoader] = useState(true);
  // const [entriesSize, setEntriesSize] = useState(0);
  // const [userEnriesSize, setUserEnriesSize] = useState(0);
  const [entriesSize, setEntriesSize] = useState<any>({
    all: 0,
    user: 0,
    draft: 0,
  });
  const [settings, setSettings] = useState({
    type: 'All',
  });

  const router = useRouter();
  const pathName = usePathname();
  const { auth, setAuth, identity } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
    })
  );

  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  let itemsPerPage = 6;
  const endOffset = itemOffset + itemsPerPage;
  const entrySizeMap: EntrySizeMap = {
    All: 'all',
    Minted: 'all',
    Draft: 'draft',
    Mine: 'user',
    MyMinted: 'user',
  };

  const entrySizeKey = entrySizeMap[activeListName] || 'all';
  const pageCount = Math.ceil(entriesSize[entrySizeKey] / itemsPerPage);

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
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        if (entry[1].image) {
          image = getImage(entry[1].image);
        }
        const userId = entry[1].user.toString();

        const user = await userActor.get_user_details([userId]);
        let newItem = {
          entryId: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          categories: entry[1].category,
          title: entry[1].title,
          isDraft: entry[1].isDraft,
          isPromoted: entry[1].isPromoted,
          userName: entry[1].userName,
          minters: entry[1].minters,
          userId,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
        };
        if (user.ok) {
          newItem.userName = user.ok[1].name ?? entry[1].userName;
        }
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
    const resp = await entryActor.getEntriesList(
      categ,
      false,
      search,
      forcePaginate * itemsPerPage,
      6
    );
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      all: amount,
    }));
    const tempList = resp.entries;
    setEntriesList(tempList);
    logger(tempList, 'Entries List');
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
    const resp = await entryActor.getUserEntriesList(
      all ? 'All' : selectedCategory,
      draft,
      search,
      forcePaginate * itemsPerPage,
      6
    );
    const tempList = resp.entries;
    // setEntriesSize();
    let amount = parseInt(resp.amount);

    if (draft) {
      setUserDraftList(tempList);
      setEntriesSize((prev: any) => ({
        ...prev,
        draft: amount,
      }));
    } else {
      setEntriesSize((prev: any) => ({
        ...prev,
        user: amount,
      }));
      setUserArticleList(tempList);
    }
    logger(tempList, 'JUST SAT THIS');
    if (reset) {
      return tempList;
    }
    return tempList;
    // logger(myEntries, 'Entries List fetched from canister');
  };
  const getEntriesSize = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let size = await entryActor.getEntriesLength();
    // setEntriesSize(parseInt(size));
    logger(size, ' SIZEE');
  };
  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);
    // setItemOffset(newOffset);
    // if ()
    let list: any = [];
    if (activeListName === 'All' || activeListName === 'Minted') {
      const newOffset = (event.selected * itemsPerPage) % entriesSize.all;
      const resp = await entryActorDefault.getEntriesList(
        selectedCategory,
        false,
        search,
        newOffset,
        itemsPerPage
      );
      list = resp.entries;
    } else if (activeListName === 'Mine' || activeListName === 'MyMinted') {
      const newOffset = (event.selected * itemsPerPage) % entriesSize.user;

      const resp = await entryActorDefault.getUserEntriesList(
        selectedCategory,
        false,
        search,
        newOffset,
        itemsPerPage
      );
      list = resp.entries;
    } else if (activeListName === 'Draft') {
      const newOffset = (event.selected * itemsPerPage) % entriesSize.draft;
      const resp = await entryActorDefault.getUserEntriesList(
        selectedCategory,
        true,
        search,
        newOffset,
        itemsPerPage
      );
      list = resp.entries;
    }
    // const newItems = tempList2.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await getRefinedList(list);
    // logger({ newOffset, list, newItems: 'hi', tempList }, 'EEEEVENTTT');
    setProcessedList(tempList);
    setIsGetting(false);
  };
  const handleTabChange = async (tab: string) => {
    setIsGetting(true);
    setSelectedCategory('All');
    setActiveListName(tab);
    setForcePaginate(0);
    let list = [];
    if (tab === 'All' || tab === 'Minted') {
      list = await getEntriesList('All');
    } else if (tab === 'Mine' || tab === 'MyMinted') {
      list = await getUserEntries(true, false, 'All');
    } else if (tab === 'Draft') {
      list = await getUserEntries(true, true, 'All');
    }
    const tempList = await getRefinedList(list);
    setProcessedList(tempList);
    setIsGetting(false);
  };

  const filter = async () => {
    setForcePaginate(0);
    let list = [];
    if (activeListName == 'All' || activeListName == 'Minted') {
      list = await getEntriesList();
    } else if (activeListName === 'Mine') {
      list = await getUserEntries(true);
    } else if (activeListName === 'Draft') {
      list = await getUserEntries(true, true);
    }
    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };

  // useEffect(() => {}, [selectedCategory]);

  // useEffect(() => {
  //   if (auth.client) {
  //     const tempFun = async () => {
  //       setIsGetting(true);
  //       const tempList = await getRefinedList(currentItems);
  //       logger(tempList, 'Entries   THIS IS ITTT');
  //       setProcessedList(tempList);
  //       setIsGetting(false);
  //     };

  //     tempFun();
  //   }
  // }, [entriesList, activeList]);

  useEffect(() => {
    // if ()
    // getEntriesList();
    getCategories();
  }, []);

  // useEffect(() => {
  //   if (auth.client) {
  //     const tempFun = async () => {
  //       setIsGetting(true);
  //       const tempList = await getRefinedList(currentItems);
  //       setProcessedList(tempList);
  //       setIsGetting(false);
  //     };

  //     tempFun();
  //   }
  // }, [auth, pathName]);

  useEffect(() => {
    logger({ auth: auth.state, identity }, 'current auth');
    if (identity) {
      if (auth.state !== oldAuth) {
        getUserEntries();
        handleTabChange('Mine');
        getUserEntries(false, true);
        setOldAuth(auth.state);
        getEntriesList();
      }
    } else if (auth.state === 'anonymous') {
      handleTabChange('All');
    }
  }, [identity, pathName, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
                            <input
                              type='text'
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder='Search Posts'
                              onKeyDown={handleSearch}
                            />
                            <button onClick={filter}>
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
                              <p>All</p>({entriesSize.all})
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
                              <p> All </p>({entriesSize.user})
                            </span>
                          </li>
                        )}
                        {auth.state !== 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('Minted')}
                              className={
                                activeListName === 'Minted' ? 'active' : ''
                              }
                            >
                              <p>Minted articles</p>({entriesSize.all})
                            </span>
                          </li>
                        )}{' '}
                        {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('MyMinted')}
                              className={
                                activeListName === 'MyMinted' ? 'active' : ''
                              }
                            >
                              <p>Minted articles</p>({entriesSize.user})
                            </span>
                          </li>
                        )}
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
                              <p> Drafts </p>({entriesSize.draft ?? '0'})
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
                              {categories.map((category, index) => (
                                <option value={category} key={index}>
                                  {category}
                                </option>
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
                    {isGetting || showLoader ? (
                      <div className='d-flex justify-content-center w-full'>
                        <Spinner />
                      </div>
                    ) : processedList.length > 0 ? (
                      <ArticlesList
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
