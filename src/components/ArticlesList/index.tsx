import React from 'react';
import { Col, Table } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import loader from '@/assets/Img/Icons/icon-loader.png';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import { utcToLocal } from '@/components/utils/utcToLocal';
import Tippy from '@tippyjs/react';
import logger from '@/lib/logger';

export function ArticlesList({
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
                    {(currentTab === 'Minted' || currentTab === 'MyMinted') && (
                      <th>Minted</th>
                    )}
                    <th className='text-center'>
                      <div className='d-flex align-items-center justify-content-center'>
                        <Image src={loader} alt='loader' /> Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((article) => {
                    let status = article.isDraft
                      ? 'draft'
                      : Object.keys(article.status)[0];
                    return (
                      <tr key={article.entryId}>
                        <td>
                          
                          <Link
                            href={
                              article.isDraft
                                ? `/addarticle?draftId=${article.entryId}`
                                : `/article?articleId=${article.entryId}`
                            }
                            target={`${currentTab == 'All'? '_blank':'_self'}`}
                            className='removeUl'
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
                                {article.isPromoted && (
                                  
                                  <Tippy
                                  content={ <p className='mb-0'>Promoted article</p>}
                                >
                                     <Image
                                      src={promotedIcon}
                                      alt='promoted'
                                      style={{ width: 22, height: 22 }}
                                    />
                                </Tippy>
                                
                                  // <span className='publish-btn table-btn'>
                                  //   promotedIcon
                                  // </span>
                                )}
                                {article.title.slice(0, 75)}
                                {article.title.length > 75 && '...'}{' '}
                                {article.isDraft && <span>| Draft </span>}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td>
                          <Link
                            href={`/profile?userId=${article.userId}`}
                            target={`${currentTab == 'All'? '_blank':'_self'}`}
                            className='removeUl'
                          >
                            <p>{article?.userName}</p>
                          </Link>
                        </td>
                        <td>
                          <Tippy
                            content={
                              article?.categories?.length > 0 ? (
                                <div className='categories'>
                                  {article.categories.map(
                                    (category: string, index: number) => (
                                      <p className='category d-inline-block' key={index}>
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
                            <p className='d-inline-block'>
                              {article.categories[0] + ' '}{' '}
                              {article.categories.length > 1 &&
                                '+' + (article.categories.length - 1) + ' more'}
                            </p>
                          </Tippy>
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
                        {(currentTab === 'Minted' ||
                          currentTab === 'MyMinted') && (
                          <td className='text-center'>
                            {/* 2023/11/08 at 06:52 pm */}
                            <span>
                              {article?.minters?.length >= 0
                                ? article?.minters?.length + 1
                                : '0'}
                            </span>
                          </td>
                        )}

                        <td className='text-center'>
                          <div className='d-flex align-items-center justify-content-center gap-1'>
                            <span
                              className={`circle-span m-0 ${status}`}
                            ></span>
                            <p className={`status-text ${status}`}>
                              {' '}
                              {status.replace('approved', 'minted')}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
