'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Form, Button, Spinner, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { EntrySizeMap } from '@/types/dashboard';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import Tippy from '@tippyjs/react';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import { toast } from 'react-toastify';
import {
  approvedArticleMessage,
  rejectedArticleMessage,
} from '@/constant/emailmessage';

function Article({
  article,
  handleRefetch,
}: {
  article: any;
  handleRefetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  rejectReason;
  const [action, setAction] = useState({
    status: true,
    id: '',
    userName: '',
    userId: '',
  });
  const [approving, setApproving] = useState(false);

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  let status = Object.keys(article.status)[0];
  logger(article);

  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleApprove = async (
    id: any,
    rejected: boolean,
    username?: string,
    reason?: string
  ) => {
    setApproving(true);
    const entryActorDefault = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const approved = await entryActorDefault.approveArticle(
      commentCanisterId,
      userCanisterId,
      action.id,
      action.status
    );
    if (approved.ok) {
      if (action.status) {
        // toast.success('Article approved');
        logger(approved, 'aaap');
        sendEmail(approved.ok[1].title, false, username);
      } else {
        // toast.success('Article rejected');
        sendEmail(approved.ok[1].title, true, username, reason);
      }
      handleClose();
      handleRefetch();
    } else {
      toast.error('Error while approving article');
    }
    setApproving(false);
  };
  // send email to user when his article is approved or rejeckted

  async function sendEmail(
    title: any,
    rejected: boolean,
    username?: string,
    reason?: string
  ) {
    const user = await userActor.get_user_details([action.userId]);
    if (user.ok) {
      logger(user);
      if (user.ok[1].email.length != 0) {
        let config = {
          SecureToken: process.env.EMIAL_SECRET,
          To: user.ok[1].email[0],
          From: process.env.EMIAL,
          Subject: 'Article Submission Update',
          Body: '',
        };
        if (rejected) {
          config.Body = rejectedArticleMessage(username, title, reason);
        } else {
          config.Body = approvedArticleMessage(username, title);
        }

        if ((window as any).Email) {
          (window as any).Email.send(config)
            .then((message: any) => {
              rejected
                ? toast.success(
                    'Article rejected , and an email with further details has been sent to the user.'
                  )
                : toast.success(
                    'Article approved, and an email with further details has been sent to the user.'
                  );
            })
            .catch((error: any) => {
              toast.error('Something went wrong while sending email');
            });
        }
      } else {
        rejected
          ? toast.success(
              'Article rejected , but no email is associated with the user to notify the reason of rejection.'
            )
          : toast.success(
              'Article approved, but no email is associated with the user to notify the reason of approval.'
            );
      }
    }
  }
  return (
    <>
      <tr>
        <td>
          <Link
            href={
              article.isDraft
                ? `/addarticle?draftId=${article.entryId}`
                : `/article?articleId=${article.entryId}`
            }
            target='_blank'
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
                  <Tippy content={<p className='mb-0'>Promoted article</p>}>
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
            target='_blank'
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
                  {article.categories.map((category: string, index: number) => (
                    <p className='category' key={index}>
                      {category}
                      {!(index === article.categories.length - 1) && ', '}
                    </p>
                  ))}
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
        <td className='text-center'>
          {status == 'pending' && (
            <ul className='btn-list'>
              <li>
                <Button
                  onClick={() => {
                    setAction({
                      status: true,
                      id: article.entryId,
                      userName: article.userName,
                      userId: article.userId,
                    });

                    handleShow();
                  }}
                  className='green'
                >
                  Approve
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => {
                    setAction({
                      status: false,
                      id: article.entryId,
                      userName: article.userName,
                      userId: article.userId,
                    });

                    handleShow();
                  }}
                  className='red'
                >
                  Reject
                </Button>
              </li>
            </ul>
          )}
          {status === 'approved' && (
            <p className='text-start text-success'>Approved</p>
          )}
          {status === 'rejected' && (
            <p className='text-start text-danger'>Rejected</p>
          )}
        </td>
      </tr>
      <Modal
        show={showModal}
        // size='md'
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h3 className='text-center'>
            {action.status ? 'Approve' : 'Reject'}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {action.status ? 'approve' : 'reject'} this
            article ?
          </p>
          {!action.status && (
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Reason to reject the article.</Form.Label>
              <Form.Control
                as='textarea'
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='publish-btn'
            onClick={(e) => {
              if (action.status) {
                handleApprove(action.id, false, action.userName);
              } else {
                if (rejectReason.length < 20) {
                  toast.error('Input must be at least 20 characters long.');
                } else if (rejectReason.length > 2000) {
                  toast.error('Input must be at least 2000 characters long.');
                } else {
                  handleApprove(
                    action.id,
                    false,
                    action.userName,
                    rejectReason
                  );
                }
              }
            }}
          >
            {approving ? (
              <Spinner size='sm' />
            ) : action.status ? (
              'Approve'
            ) : (
              'Reject'
            )}
          </Button>
          <Button
            disabled={approving}
            className='default-btn'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function Items({
  currentItems,
  handleRefetch,
}: {
  currentItems: any;
  handleRefetch: () => void;
}) {
  return (
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
                  <th className='d-flex align-items-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((article: any, index: number) => {
                  return (
                    <Article
                      handleRefetch={handleRefetch}
                      article={article}
                      key={index}
                    />
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Col>
  );
}

const statuses = ['pending', 'approved', 'rejected'];

export default function PendingList() {
  const [entriesList, setEntriesList] = useState<any[]>([]);
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
  const [selectedStatus, setSelectedStatus] = useState('pending');
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
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  let status: {
    pending?: null;
    approved?: null;
    rejected?: null;
  } = { pending: null };
  switch (selectedStatus) {
    case 'pending':
      status = { pending: null };
      break;
    case 'approved':
      status = { approved: null };
      break;
    case 'rejected':
      status = { rejected: null };
      break;
    default:
      status = { pending: null };
  }

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
        // const user = await auth.actor.get_user_details([userId]);
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
  const getEntriesList = async (reset?: boolean) => {
    const categ = selectedCategory;

    if (
      !userAuth.userPerms?.articleManagement ||
      auth.state !== 'initialized' ||
      !identity
    ) {
      return [];
    }

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    const resp = await entryActor.getReviewEntries(
      categ,
      userCanisterId,
      status,
      reset ? '' : search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    logger({ resp, categ, status, search }, 'got for this');
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      ['all']: amount,
    }));
    const tempList = resp.entries;
    setEntriesList(tempList);
    return tempList;
  };

  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);

    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % entriesSize.all;
    const resp = await entryActorDefault.getReviewEntries(
      selectedCategory,
      userCanisterId,
      status,
      search,
      newOffset,
      itemsPerPage
    );
    list = resp.entries;
    const tempList = await getRefinedList(list);
    setProcessedList(tempList);
    setIsGetting(false);
  };
  const handleTabChange = async (tab: string) => {
    // setIsGetting(true);
    // setSelectedCategory('All');
    // setActiveListName(tab);
    // setForcePaginate(0);
    // let list = [];
    // if (tab === 'All' || tab === 'Minted') {
    //   list = await getEntriesList('All');
    // } else if (tab === 'Mine') {
    //   // list = await getUserEntries(true, false, 'All');
    // } else if (tab === 'Draft') {
    //   list = await getEntriesList('All', true);
    // }
    // const tempList = await getRefinedList(list);
    // setProcessedList(tempList);
    // setIsGetting(false);
  };

  const filter = async (reset?: boolean) => {
    setForcePaginate(0);
    let list = [];
    // if (activeListName == 'All' || activeListName == 'Minted') {
    setIsGetting(true);
    list = await getEntriesList(reset);
    // } else if (activeListName === 'Mine') {
    //   list = await getUserEntries(true);
    // } else if (activeListName === 'Draft') {
    //   list = await getEntriesList('All', true);
    // }
    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);

    setIsGetting(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };
  const handleRefetch = async () => {
    setForcePaginate(0);
    setIsGetting(true);
    let list = await getEntriesList();
    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);
    setIsGetting(false);
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    async function getEntry() {
      setIsGetting(true);
      let list = await getEntriesList();
      const tempRefList = await getRefinedList(list);
      setProcessedList(tempRefList);
      setIsGetting(false);
    }
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement) {
        getEntry();
      } else {
        router.replace('/superadmin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/superadmin');
    }
  }, [identity, pathName, userAuth, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    userAuth.userPerms?.articleManagement && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className=''>
                    <Row>
                      <Col xl='8'>
                        <h1>
                          Articles Management{' '}
                          <i className='fa fa-arrow-right'></i>{' '}
                          <span>Pending Articles</span>
                        </h1>
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
                      </ul> */}
                      </Col>
                      <Col xl='6' lg='6' className='mb-0 mb-lg-5'>
                        <ul className='all-filters-list v2'>
                          {/* <li>
                          <span
                            onClick={() => handleTabChange('All')}
                            className={activeListName === 'All' ? 'active' : ''}
                          >
                            <p>Pe</p>({entriesSize.all})
                          </span>
                        </li> */}

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
                          {/* <li>
                          <span
                            onClick={() => handleTabChange('Minted')}
                            className={
                              activeListName === 'Minted' ? 'active' : ''
                            }
                          >
                            <p>Minted articles</p>({entriesSize.all})
                          </span>
                        </li> */}
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
                      <Col xl='6' lg='6' className='mb-4'>
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
                                <button
                                  onClick={(e: any) => {
                                    setSearch('');
                                    filter(true);
                                  }}
                                >
                                  <i className='fa-solid fa-xmark mx-1'></i>
                                </button>
                              )}
                              <button onClick={() => filter()}>
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
                              <Form.Select
                                aria-label='All Categories'
                                value={selectedStatus}
                                onChange={(e) =>
                                  setSelectedStatus(e.target.value)
                                }
                              >
                                {statuses.map((category: string, index) => (
                                  <option value={category} key={index}>
                                    <span className='text-capitalize m-0'>
                                      {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                    </span>
                                  </option>
                                ))}
                              </Form.Select>
                            </li>
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
                              <Button
                                className='publish-btn'
                                onClick={() => filter()}
                              >
                                Apply
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                      <Col xl='6' lg='12'>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                          {
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
                          }
                        </div>
                      </Col>
                      {/* <Col xl='4' lg='6' md='6' sm='12'>
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
                    </Col>
                    <Row>
                      <Col xxl='6' xl='6' lg='12'>
                        <div className='flex-div-sm'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select aria-label='Rejected'>
                                <option>Rejected</option>
                                <option value='1'>Rejected</option>
                                <option value='2'>Approve</option>
                              </Form.Select>
                            </li>
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
                    </Row> */}
                      {isGetting || showLoader ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : processedList.length > 0 ? (
                        <Items
                          currentItems={processedList}
                          handleRefetch={handleRefetch}
                        />
                      ) : (
                        <div className='d-flex justify-content-center w-ful'>
                          <h3>No Articles Found</h3>
                        </div>
                      )}
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </main>
      </>
    )
  );
}
