'use client';
import React, { useEffect, useState } from 'react';
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

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

function Items({ currentItems }: { currentItems: any[] }) {
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
                    <th>
                      <Image src={loader} alt='loader' /> Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((article) => (
                    <tr>
                      <td>
                        <Link href={`/article?articleId=${article.entryId}`}>
                          <div className='d-flex align-items-start'>
                            {article.image ? (
                              <div
                                style={{
                                  width: 89,
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
                              {article.title}
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
                        <p>
                          {article.categories[0] + ' '}{' '}
                          {article.categories.length > 1 &&
                            '+' + (article.categories.length - 1) + ' more'}
                        </p>
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
                      <td className='text-center'>
                        <span
                          className={`circle-span ${
                            article.isDraft ? 'red' : 'green'
                          }`}
                        ></span>
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

export default function superadmin() {
  const [entriesList, setEntriesList] = useState([]);
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [userArticleList, setUserArticleList] = useState<any[]>([]);
  const [activeList, setActiveList] = useState('All');
  const router = useRouter();
  const pathName = usePathname();
  const { auth, setAuth, identity } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
    })
  );
  const getEntriesList = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const tempList = await entryActor.getEntriesList();
    setEntriesList(tempList);
    logger(tempList, 'Entries List fetched from canister');
    return tempList;
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
  const getUserEntries = async (reset?: boolean) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const tempList = await entryActor.getUserEntriesList();
    setUserArticleList(tempList);
    if (reset) {
      const myEntries = await getRefinedList(tempList);
      setProcessedList(myEntries);
      setActiveList('User');
      return;
    }
    return;
    // logger(myEntries, 'Entries List fetched from canister');
  };
  const [itemOffset, setItemOffset] = useState(0);
  let itemsPerPage = 6;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = entriesList.slice(itemOffset, endOffset);
  logger(currentItems, 'Entries That we are shownig');

  const pageCount = Math.ceil(entriesList.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setIsGetting(true);
    const newOffset = (event.selected * itemsPerPage) % entriesList.length;
    // setItemOffset(newOffset);
    const newItems = entriesList.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await getRefinedList(newItems);
    setProcessedList(tempList);
    setIsGetting(false);
  };

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
  }, [entriesList]);

  useEffect(() => {
    getEntriesList();
    getUserEntries();
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
                      <div className='full-div d-flex justify-content-between'>
                        <div>
                          {auth.state === 'initialized' && (
                            <Button onClick={() => router.push('/addarticle')}>
                              Create Article
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
                        <li>
                          <span
                            onClick={async () => {
                              setIsGetting(true);
                              getEntriesList();
                              setActiveList('All');

                              // .then(async (res) => {
                              //   const newOffset =
                              //     (2 * itemsPerPage) % entriesList.length;
                              //   console.log(
                              //     `User requested page number ${1}, which is offset ${newOffset}`
                              //   );
                              //   // setItemOffset(newOffset);
                              //   const newItems = entriesList.slice(
                              //     newOffset,
                              //     newOffset + itemsPerPage
                              //   );
                              //   const tempList = await getRefinedList(newItems);
                              //   setProcessedList(tempList);
                              // });
                              setIsGetting(false);
                            }}
                            className={activeList === 'All' ? 'active' : ''}
                          >
                            <p>All</p>({entriesList.length})
                          </span>
                        </li>

                        {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => getUserEntries(true)}
                              className={activeList === 'User' ? 'active' : ''}
                            >
                              <p> Mine </p>({userArticleList?.length ?? '0'})
                            </span>
                          </li>
                        )}
                        <li>
                          <Link href='/'>
                            <p>Minted article</p>
                            (1,658)
                          </Link>
                        </li>
                        {/* <li>
                          <Link href='/'>
                            <p>Pending</p>
                            (8)
                          </Link>
                        </li> */}
                        <li>
                          <Link href='/'>
                            <p>Drafts</p>
                            (1)
                          </Link>
                        </li>
                      </ul>
                    </Col>
                    <Row>
                      <Col xxl='9' xl='12' lg='12'>
                        <div className='flex-div-sm'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select aria-label='Bulk Action'>
                                <option>Bulk Action</option>
                                <option value='1'>Draft</option>
                                <option value='2'>Delete</option>
                              </Form.Select>
                            </li>
                          </ul>
                          <ul className='filter-btn-list'>
                            <li>
                              <Button className='reg-btn fill-not small'>
                                Search By Article
                              </Button>
                            </li>
                            <li>
                              <Button className='reg-btn fill small'>
                                Apply
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xxl='9' xl='12' lg='12'>
                        <div className='spacer-10'></div>
                        <div className='flex-div-sm'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select aria-label='Select user'>
                                <option>Use Ajax Search bar</option>
                              </Form.Select>
                            </li>
                            <li>
                              <Button className='reg-btn fill-not small'>
                                Data
                              </Button>
                            </li>
                          </ul>
                          <ul className='filter-btn-list filter-list'>
                            <li>
                              <Form.Select aria-label='Select user'>
                                <option>Type of Article</option>
                                <option>Pending</option>
                                <option>Minted</option>
                              </Form.Select>
                            </li>
                            <li>
                              <Button className='reg-btn fill-not small'>
                                Collection Type
                              </Button>
                            </li>
                            <li>
                              <Button className='reg-btn fill small'>
                                Apply
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    <Row>
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
                          />
                        </div>
                      </Col>
                    </Row>
                    {isGetting ? (
                      <div className='d-flex justify-content-center w-full'>
                        <Spinner />
                      </div>
                    ) : processedList.length > 0 ? (
                      <Items currentItems={processedList} />
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
