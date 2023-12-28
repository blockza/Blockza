'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Form, Button, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import loader from '@/assets/Img/Icons/icon-loader.png';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { utcToLocal } from '@/components/utils/utcToLocal';
import Tippy from '@tippyjs/react';
import { EntriesSizeObject, EntrySizeMap } from '@/types/dashboard';
import { ArticlesList } from '@/components/ArticlesList';
// import { usePopper } from 'react-popper';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function SearchArticlesList() {
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

  let itemsPerPage = 8;
  const endOffset = itemOffset + itemsPerPage;
  const entrySizeMap: EntrySizeMap = {
    All: 'all',
    Minted: 'all',
    Draft: 'draft',
    Mine: 'user',
  };

  const entrySizeKey: string = entrySizeMap[activeListName] || 'all';
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
        // let
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
        };
        if (user.ok) {
          newItem.userName = user.ok[1].name ?? entry[1].userName;
        }
        return newItem;
      })
    );

    return refinedPromise;
  };
  const getEntriesList = async (all?: string,reset?: boolean, draft: boolean = false) => {
    const categ = all ? all : selectedCategory;
    const startIndex = all ? 0 : forcePaginate * itemsPerPage;
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    logger({ categ, search }, 'Getting for this');
    const resp = await entryActor.getEntriesList(
      categ,
      draft,
      reset? '':search,
      startIndex,
      itemsPerPage
    );
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      [draft ? 'draft' : 'all']: amount,
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
      itemsPerPage
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
    } else if (activeListName === 'Mine') {
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
    } else if (tab === 'Mine') {
      list = await getUserEntries(true, false, 'All');
    } else if (tab === 'Draft') {
      list = await getEntriesList('All',false, true);
    }
    const tempList = await getRefinedList(list);
      setProcessedList(tempList);
    setIsGetting(false);
  };

  const filter = async (reset?:boolean) => {
    setForcePaginate(0);
    setIsGetting(true);
    let list = [];
    if (activeListName == 'All' || activeListName == 'Minted') {
      list = await getEntriesList();
    } else if (activeListName === 'Mine') {
      list = await getUserEntries(true);
    } else if (activeListName === 'Draft') {
      list = await getEntriesList('All',false, true);
    }  if(reset){
      list = await getEntriesList('All',true);
      logger(list,"oook")
    }
    const tempRefList = await getRefinedList(list);
      setProcessedList(tempRefList);
    setIsGetting(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    logger({ auth: auth.state, identity }, 'current auth');
    if (auth.state !== oldAuth) {
      setOldAuth(auth.state);
      handleTabChange('All');
      getEntriesList('All',false, true);
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
      <div className='section pt-0 ' id='top'>
        <Row>
          <Col xl='12' lg='12'>
            <div className='pbg-pnl no-shadow text-left pt-1 ps-4 '>
              <Row>
                <Col md='6' sm='6'  className=''>
                  <ul className='all-filters-list v2'>
                    <li>
                      <span
                        onClick={() => handleTabChange('All')}
                        className={activeListName === 'All' ? 'active' : ''}
                      >
                        <p>All</p>({entriesSize.all})
                      </span>
                    </li>

                    {/* {auth.state === 'initialized' && (
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
                        )} */}
                    <li>
                      <span
                        onClick={() => handleTabChange('Minted')}
                        className={activeListName === 'Minted' ? 'active' : ''}
                      >
                        <p>Minted articles</p>({entriesSize.all})
                      </span>
                    </li>
                    {/* <li>
                            <Link href='/'>
                              <p>Pending</p>
                              (8)
                            </Link>
                          </li> */}

                    {/* {auth.state === 'initialized' && (
                      <li>
                        <span
                          onClick={() => handleTabChange('Draft')}
                          className={activeListName === 'Draft' ? 'active' : ''}
                        >
                          <p> Drafts </p>({entriesSize.draft})
                        </span>
                      </li>
                    )} */}
                  </ul>
                </Col>
                <Col sm='6' lg='6' className='mt-2 mb-3'>
                  <div className='full-div text-right-md'>
                    <div>
                      {/* {auth.state === 'initialized' && (
                        <Button
                          className='default-btn'
                          onClick={() => router.push('/addarticle')}
                        >
                          <i className='fa fa-plus'></i> Create
                        </Button>
                      )} */}
                    </div>

                    <div>
                      <div className='search-post-pnl'>
                        <input
                          type='text'
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder='Search Articles'
                          onKeyDown={handleSearch}
                        />
                        {search.length >= 1 && (
                          <button onClick={() =>{ setSearch('');filter(true);}}>
                            <i className='fa-solid fa-xmark mx-1'></i>
                          </button>
                        )}
                        <button onClick={()=>filter()}>
                          <i className='fa fa-search'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xl='6' lg='12'>
                  <div className='full-div d-flex justify-content-center d-sm-inline-block'>
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
                          onChange={(e) => setSelectedCategory(e.target.value)}
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
                        <Button className='publish-btn' onClick={()=>filter()}>
                          Apply
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col xl='6' lg='12'>
                  <div className='pagination-container mystyle d-flex justify-content-end'>
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
    </>
  );
}
