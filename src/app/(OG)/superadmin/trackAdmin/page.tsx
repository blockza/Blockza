'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Button, Spinner } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { ConnectPlugWalletSlice, UserPermissions } from '@/types/store';
import ReactPaginate from 'react-paginate';
import proimg from '@/assets/Img/promoted-icon.png'
import Tippy from '@tippyjs/react';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { Principal } from '@dfinity/principal';
import {
  Activity,
  AdminActivity,
  RefinedActivity,
  RefinedAdminActivity,
} from '@/types/profile';
import { utcToLocal } from '@/components/utils/utcToLocal';
import Link from 'next/link';
import Image from 'next/image';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

interface TrackingUser {
  name: string;
  id: string;
}
export default function TrackAdmin() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [usersSize, setUsersSize] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [activityForcePaginate, setActivityForcePaginate] = useState(0);
  const [trackUser, setTrackUser] = useState<null | TrackingUser>(null);
  const [isGettingActivity, setIsGettingActivity] = useState(false);
  const [userActivity, setUserActivity] = useState<[RefinedAdminActivity] | []>(
    []
  );
  const [tracebtnactive, setTraceBtnActive] = useState('');

  const router = useRouter();
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
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const activityActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  let itemsPerPage = 4;
  let activitiesPerPage = 10;

  const getUsersList = async () => {
    const tempList = await userActor.get_subAdmin_users(
      search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    if (tempList) {
      // if (tempList[1])

      const refinedList = await getRefinedList(tempList.users);
      setUsersList(refinedList);
      setUsersSize(parseInt(tempList.amount));

      logger(refinedList, 'Users List fetched from canister');
    }
    return tempList;
  };
  const getRefinedList = async (tempUsersList: any[]) => {
    if (tempUsersList.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempUsersList.map((item: any) => {
        const id = item[0].toString();
        return {
          0: id,
          1: item[1],
        };
      })
    );

    return refinedPromise;
  };
  const refineActivity = (activity: AdminActivity): RefinedAdminActivity => {
    if (!trackUser) {
      return {
        message: '',
        time: '',
        date: '',
        target: activity.target,
        name: '',
        isPromoted:false
      };
    }
    const refinedActivity: RefinedAdminActivity = {
      message: '',
      time: '',
      date: '',
      target: '',
      name: '',
      isPromoted:false
    };
    if (activity.activity_type.hasOwnProperty('block')) {
      refinedActivity.message = `${trackUser.name} blocked a User`;
      refinedActivity.name = activity.name;
      refinedActivity.target = `${window.location.origin}/profile?userId=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('unBlock')) {
      refinedActivity.message = `${trackUser.name} unBlocked a User`;
      refinedActivity.name = activity.name;
      refinedActivity.target = `${window.location.origin}/profile?userId=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('approve')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted=activity.isPromoted;
      refinedActivity.message = `${trackUser.name} approved an Article`;
      refinedActivity.target = `${window.location.origin}/article?articleId=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('reject')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted=activity.isPromoted;
      refinedActivity.message = `${trackUser.name} rejected an Article`;
      refinedActivity.target = `${window.location.origin}/article?articleId=${activity.target}`;
    }
    refinedActivity.time = utcToLocal(activity.time.toString(), 'hh:mm A');
    refinedActivity.date = utcToLocal(activity.time.toString(), 'DD-MM-yyyy');
    return refinedActivity;
  };
  const handleActivityPageClick = (event: any) => {
    setActivityForcePaginate(event.selected);
  };
  const endOffset = itemOffset + itemsPerPage;
  // const currentItems = usersList.slice(itemOffset, endOffset);
  // logger(currentItems, 'Entries That we are shownig');

  const pageCount = Math.ceil(usersSize / itemsPerPage);
  const activityPageCount = Math.ceil(userActivity.length / activitiesPerPage);
  // let endIndex =
  //   forcePaginate === 0
  //     ? activitiesPerPagesdfsdf
  //     : (forcePaginate * activitiesPerPage) % myActivity.length;
  let startIndex = activityForcePaginate * activitiesPerPage;

  let currentItems = userActivity.slice(startIndex, startIndex + 10);

  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    setIsGetting(true);
    const newOffset = (event.selected * itemsPerPage) % usersSize;
    // setItemOffset(newOffset);
    // const newItems = usersList.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await userActor.get_subAdmin_users(
      search,
      newOffset,
      itemsPerPage
    );
    if (tempList) {
      // if (tempList[1])
      const refinedList = await getRefinedList(tempList.users);
      logger({ refinedList, tempList, search, itemsPerPage, newOffset });
      setUsersList(refinedList);
      // setUsersSize(parseInt(tempList.amount));
    }
    setIsGetting(false);
  };
  const filter = async () => {
    setIsGetting(true);
    setForcePaginate(0);
    await getUsersList();
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
    await getUsersList();
    setIsGetting(false);
  };
  const getAdminActivity = async () => {
    setIsGettingActivity(true);
    if (trackUser) {
      const userPrincipal = Principal.fromText(trackUser.id);
      const activity = await activityActor.getAdminActivities(
        userPrincipal,
        userCanisterId
      );
      if (activity.ok) {
        let activities = activity.ok[0];
        for (let activit = 0; activit < activities.length; activit++) {
          if (
            activities[activit].activity_type.hasOwnProperty('block') ||
            activities[activit].activity_type.hasOwnProperty('unBlock')
          ) {
            let user = await userActor.get_user_details([
              activities[activit].target,
            ]);
            console.error(user);
            logger(activities[activit].target, 'uuuu');
            if (user.ok) activities[activit].name = user.ok[1].name[0];
          }

          if (
            activities[activit].activity_type.hasOwnProperty('reject') ||
            activities[activit].activity_type.hasOwnProperty('approve')
          ) {
            const tempEntry = await entryActor.getEntry(
              activities[activit].target
            );
            console.error(tempEntry);
            activities[activit].name = tempEntry[0].title;
            activities[activit].isPromoted = tempEntry[0].isPromoted;

            logger(tempEntry,'rrr')
          }
        }
        let refinedActivity: [RefinedAdminActivity] = activities.map(
          (activity: AdminActivity) => {
            return refineActivity(activity);
          }
        );
        setUserActivity(refinedActivity);
      } else {
        setUserActivity([]);
      }
      logger({ activity, trackUser }, 'activeee');
    }
    setIsGettingActivity(false);
  };
  useEffect(() => {
    if (userAuth.userPerms?.adminManagement) {
      getAdminActivity();
    }
    // const activities = await activityActor.getActivity();
  }, [trackUser]);
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement) {
        setIsGetting(true);
        const timer = setTimeout(() => {
          getUsersList();
          setIsGetting(false);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        router.replace('/superadmin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/superadmin');
    }
  }, [userAuth, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return userAuth.userPerms?.adminManagement ? (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row>
                    <Col xl='12' lg='12' md='12' sm='12'>
                      <h1>
                        Admin Management<i className='fa fa-arrow-right ms-2'></i>{' '}
                        <span>Track Admin</span>
                      </h1>
                      <div className='spacer-40'></div>
                    </Col>
                    <Col xl='6' lg='6' md='6' sm='12'>
                      <div className='spacer-10'></div>
                      <h5>Select Admin you want to track.</h5>
                    </Col>
                    <Col xl='6' lg='6' md='6' sm='12' className='mt-2'>
                      <div className='full-div text-right-md'>
                        <div className='search-post-pnl'>
                          <input
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder='Search Admin'
                          />
                           {search.length >= 1 &&  <button onClick={()=>setSearch('')}>
                          <i className="fa-solid fa-xmark mx-1"></i>
                          </button>}
                          <button onClick={filter}>
                            <i className='fa fa-search'></i>
                          </button>
                        </div>
                        <div className='spacer-20'></div>
                      </div>
                    </Col>
                    <Col xl='12' lg='12'>
                      <div className='full-div'>
                        <div className='table-container lg'>
                          <div className='table-inner-container'>
                            {isGetting || showLoader ? (
                              <div className='d-flex justify-content-center mt-5 w-full'>
                                <Spinner />
                              </div>
                            ) : usersList.length > 0 ? (
                              <Table className='article-table p-no'>
                                <thead>
                                  <tr>
                                    <th>
                                      <p>Name</p>
                                    </th>
                                    <th>
                                      <p>Wallet Address</p>
                                    </th>
                                    <th>
                                      <p>Rights</p>
                                    </th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {usersList.map((rawUser: any) => {
                                    let perms = [];
                                    let user = rawUser[1];
                                    if (
                                      user.role.hasOwnProperty('user_admin')
                                    ) {
                                      perms.push('User Management');
                                    } else if (
                                      user.role.hasOwnProperty('article_admin')
                                    ) {
                                      perms.push('Article Management');
                                    } else if (
                                      user.role.hasOwnProperty('sub_admin')
                                    ) {
                                      perms.push(
                                        'User Management',
                                        'Article Management'
                                      );
                                    }

                                    return (
                                      <tr key={rawUser[0]}>
                                        <td> {user.name[0] ?? ''}</td>
                                        <td>{rawUser[0] ?? ''}</td>
                                        <td>
                                          {' '}
                                          <Tippy
                                            content={
                                              <div>
                                                {perms.map((perm, index) => (
                                                  <span key={index}>
                                                    <span>{perm}</span>
                                                    {!(
                                                      index ===
                                                      perms.length - 1
                                                    ) && ', '}
                                                  </span>
                                                ))}
                                              </div>
                                            }
                                          >
                                            <p
                                              style={{
                                                color: 'rgb(133, 133, 133)',
                                              }}
                                            >
                                              {perms[0] + ' '}{' '}
                                              {perms.length > 1 &&
                                                '+' +
                                                  (perms.length - 1) +
                                                  ' more'}
                                            </p>
                                          </Tippy>
                                        </td>

                                        <td className='text-center'>
                                          <Button
                                            onClick={() => {
                                              setTrackUser({
                                                id: rawUser[0],
                                                name: user.name,
                                              });
                                              setTraceBtnActive(user.name);
                                            }}
                                            className={`reg-btn fill trackbtn ${
                                              tracebtnactive == user.name
                                                ? 'active'
                                                : ''
                                            }`}
                                          >
                                            Track
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  {/* <tr>
                                    <td>John Doe</td>
                                    <td>
                                      0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a
                                    </td>
                                    <td>User Management +1</td>
                                    <td className='text-center'>
                                      <Button href='#' className='reg-btn fill'>
                                        Track
                                      </Button>
                                    </td>
                                  </tr> */}
                                </tbody>
                              </Table>
                            ) : (
                              <div className='d-flex justify-content-center mt-5 w-full'>
                                <h4>No Users found</h4>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className='pagination-container mystyle d-flex justify-content-center justify-content-lg-end'>
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
                    <Col xl='12' lg='12' md='12' sm='12'>
                      <div className='spacer-20'></div>
                      {trackUser ? (
                        <h5>
                          Activities of <span>{trackUser.name}</span>
                        </h5>
                      ) : !isGetting && !showLoader ? (
                        <p className='h5 text-center'>
                          <p className='text-center'>
                            Please select an admin to track their activities
                          </p>
                        </p>
                      ) : null}
                    </Col>
                    {trackUser && (
                      <Col xl='12' lg='12'>
                        {isGettingActivity ? (
                          <div className='d-flex justify-content-center mt-5 w-full'>
                            <Spinner />
                          </div>
                        ) : currentItems && currentItems.length > 0 ? (
                          <div className='full-div'>
                            <div className='table-container lg'>
                              <div className='table-inner-container'>
                                <Table bordered className='article-table p-no'>
                                  <thead>
                                    <tr>
                                      <th>
                                        <p>Activities</p>
                                      </th>
                                      <th>
                                        <p>Date</p>
                                      </th>
                                      <th>
                                        <p>Time</p>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentItems?.map(
                                      (
                                        activity: RefinedAdminActivity,
                                        index: number
                                      ) => (
                                        <tr key={index}>
                                          <td>
                                           {activity.message}{' '}
                                           {activity.isPromoted  && <Tippy
                                  content={ <p className='mb-0'>Promoted article</p>}
                                >
                                     <Image src={proimg} alt='promoted icon' height={15} width={15} className='mx-1'/>
                                </Tippy>}
                                            <Link
                                              href={activity.target}
                                              target='_blank'
                                            >
                                              {activity.name.length > 20
                                                ? `${activity.name.slice(
                                                    0,
                                                    20
                                                  )}...`
                                                : activity.name}
                                            </Link> 
                                         

                                          </td>
                                          <td>{activity.date}</td>
                                          <td>{activity.time}</td>
                                        </tr>
                                      )
                                    )}
                                    {/* <tr>
                                    <td>John Doe Blocked @user _325</td>
                                    <td>23-11-2023</td>
                                    <td>12:31 PM</td>
                                  </tr> */}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className='text-center'>
                            No Activity Found for {trackUser.name}
                          </p>
                        )}
                      </Col>
                    )}
                    <div className='d-flex justify-content-end mt-2'>
                      <div
                        className='pagination-container'
                        style={{ width: 'auto' }}
                      >
                        <ReactPaginate
                          breakLabel='...'
                          nextLabel=''
                          onPageChange={handleActivityPageClick}
                          pageRangeDisplayed={5}
                          pageCount={activityPageCount}
                          previousLabel=''
                          renderOnZeroPageCount={null}
                          forcePage={activityForcePaginate}
                        />
                      </div>
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  ) : (
    <></>
  );
}
