'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Form, Button } from 'react-bootstrap';
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
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import SearchArticlesList from '@/components/SearchArticlesList';
import { ConnectPlugWalletSlice } from '@/types/store';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function ArticleList() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement) {
      } else {
        router.replace('/superadmin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/superadmin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.articleManagement && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='ms-4'>
                    <Row>
                      <Col xl='10' lg='8' md='12' >
                        <h1>
                          Article Management{' '}
                          <i style={{marginLeft: '5px', marginRight: '5px'}} className='fa fa-arrow-right'></i>{' '}
                          <span>Articles List</span>
                        </h1>
                      </Col>

                      {/* <ul className='all-filters-list'>
                        <li>
                          <span>
                            <b>All</b>(0)
                          </span>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>
                              <b>Minted article</b>
                            </p>
                            (1,658)
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>
                              <b>Pending</b>
                            </p>
                            (8)
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>
                              <b>Drafts</b>
                            </p>
                            (1)
                          </Link>
                        </li>
                      </ul>
                    </Col>
                    <Col xl='4' lg='6' md='6' sm='12'>
                      <div className='spacer-20'></div>
                      <div className='full-div text-right-md'>
                        <div className='search-post-pnl'>
                          <input type='text' placeholder='Search Posts' />
                          <button>
                            <i className='fa fa-search'></i>
                          </button>
                        </div>
                        <div className='spacer-20'></div>
                      </div>
                    <Row>
                      <Col xxl='6' xl='6' lg='12'>
                        <div className='flex-div-sm'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select aria-label='Categories'>
                                <option>Categories</option>
                                <option value='1'>Categories</option>
                                <option value='2'>Categories</option>
                              </Form.Select>
                            </li>
                            <li>
                              <Button className='reg-btn fill'>Apply</Button>
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
                    <Col xl='12' lg='12'>
                      <div className='full-div'>
                        <div className='table-container lg'>
                          <div className='table-inner-container'>
                            <Table striped hover className='article-table'>
                              <thead>
                                <tr>
                                  <th>
                                    <p>
                                      Title{' '}
                                      <Image
                                        className='arw'
                                        src={arrows}
                                        alt='arrow'
                                      />
                                    </p>
                                  </th>
                                  <th>Author</th>
                                  <th>Categories</th>
                                  <th>
                                    <p>
                                      Date{' '}
                                      <Image
                                        className='arw'
                                        src={arrows}
                                        alt='arrow'
                                      />
                                    </p>
                                  </th>
                                  <th className='d-flex align-items-center'>
                                    <Image src={loader} alt='loader' /> Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className='d-inline-flex align-items-start'>
                                      <Image src={post1} alt='Post' />
                                      <p>
                                        6 NFT Projects currently popular on
                                        the...
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
                                    <span className='red'>Drafted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-start'>
                                      <Image src={post2} alt='Post' />
                                      <p>
                                        6 NFT Projects currently popular on
                                        the...
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
                                    <span className='green'>Minted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-inline-flex align-items-start'>
                                      <Image src={post1} alt='Post' />
                                      <p>
                                        6 NFT Projects currently popular on
                                        the...
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
                                    <span className='red'>Drafted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-start'>
                                      <Image src={post2} alt='Post' />
                                      <p>
                                        6 NFT Projects currently popular on
                                        the...
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
                                    <span className='green'>Minted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-start'>
                                      <Image src={post3} alt='Post' />
                                      <p>
                                        Bitcoin Increases to Every Nigerian and
                                        Turkish Time Highs
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
                                    <span className='green'>Minted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-start'>
                                      <Image src={post4} alt='Post' />
                                      <p>
                                        SBF Testified in Court and Was
                                        Questioned About Deleted Messages
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
                                    <span className='green'>Minted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-start'>
                                      <Image src={post5} alt='Post' />
                                      <p>
                                        Aptos Ventures Abroad: Navigating Global
                                        Markets in the Web3 and Blockchain
                                        Sphere
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <p>Hinza Asif</p>
                                  </td>
                                  <td>
                                    <p>News</p>
                                  </td>
                                  <td>
                                    <span className='w-100'>Last Modified</span>
                                    <span>2023/11/08 at 06:52 pm</span>
                                  </td>
                                  <td className='text-center'>
                                    <span className='green'>Minted</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-start'>
                                      <Image src={post6} alt='Post' />
                                      <p>
                                        Japan Half-Hearted Approach to
                                        Stablecoins: A Looming Concern
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <p>Hinza Asif</p>
                                  </td>
                                  <td>
                                    <p>News</p>
                                  </td>
                                  <td>
                                    <span className='w-100'>Last Modified</span>
                                    <span>2023/11/08 at 06:52 pm</span>
                                  </td>
                                  <td className='text-center'>
                                    <span className='green'>Minted</span>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Col> */}
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
            <SearchArticlesList />
          </div>
        </main>
      </>
    )
  );
}
