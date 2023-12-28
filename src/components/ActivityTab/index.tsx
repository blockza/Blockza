'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tab, Nav, Table, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import comment from '@/assets/Img/Icons/icon-writer.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import proimg from '@/assets/Img/promoted-icon.png';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import ExportPost from '@/components/ExportPost/ExportPost';
import { Activity, RefinedActivity } from '@/types/profile';
import { utcToLocal } from '@/components/utils/utcToLocal';
import ReactPaginate from 'react-paginate';
import Tippy from '@tippyjs/react';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
const articleTabName = 'Articles';
const activityTabName = 'Activity';
const tabs = [
  activityTabName,
  'Comments',
  'Favorite Posts',
  'Favorite product Communities',
  articleTabName,
];

export default function ActivityTab({}: {}) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myActivity, setMyActivity] = useState<RefinedActivity[]>([]);
  const [forcePaginate, setForcePaginate] = useState(0);

  // const { isBlack } = useThemeStore((state) => ({
  //   isBlack: state.isBlack,
  // }));
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  const activityActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  let itemsPerPage = 10;

  const pageCount = Math.ceil(myActivity.length / itemsPerPage);
  // let endIndex =
  //   forcePaginate === 0
  //     ? itemsPerPage
  //     : (forcePaginate * itemsPerPage) % myActivity.length;
  let startIndex = forcePaginate * itemsPerPage;

  let currentItems = myActivity.slice(startIndex, startIndex + 10);
  logger({ currentItems, myActivity, startIndex }, 'THESEEE');
  const refineActivity = (activity: Activity): RefinedActivity => {
    logger(activity, 'POP');
    const refinedActivity: RefinedActivity = {
      message: '',
      time: '',
      date: '',
      title: '',
      target: '',
      isPromoted: false,
    };
    if (activity.activity_type.hasOwnProperty('subscribe')) {
      refinedActivity.message = 'You subscribed to a User';
      refinedActivity.title = activity.title;
    } else if (activity.activity_type.hasOwnProperty('comment')) {
      refinedActivity.message = 'You Commented on an Article';
      refinedActivity.title = activity.title;
    } else if (activity.activity_type.hasOwnProperty('like')) {
      refinedActivity.message = 'You liked an Article';
      refinedActivity.title = activity.title;
    } else if (activity.activity_type.hasOwnProperty('create')) {
      refinedActivity.message = activity.isPromoted
        ? 'You Promoted an Article'
        : 'You Created an Article';
      refinedActivity.title = activity.title;
    }
    refinedActivity.target = activity.target;
    refinedActivity.isPromoted = activity.isPromoted;

    refinedActivity.time = utcToLocal(activity.time.toString(), 'hh:mm A');
    refinedActivity.date = utcToLocal(activity.time.toString(), 'DD-MM-yyyy');
    return refinedActivity;
  };
  const getActivities = async () => {
    const myActivities = await activityActor.getActivities();
    if (myActivities.ok) {
      let activities = myActivities.ok[0];
      logger(myActivities, 'Active Raw');
      for (const activity of activities) {
        if (activity.activity_type.hasOwnProperty('subscribe')) {
          let user = await userActor.get_user_details([activity.target]);
          if (user.ok) {
            logger(user, 'ccc');
            activity.title = user.ok[1].name;
          }
          logger(user, 'ccc');
        } else {
          let entry = await entryActor.getEntry(activity.target);
          logger(entry, 'ccc');
          if (entry.length > 0) {
            activity.title = entry[0].title;
            activity.isPromoted = entry[0].isPromoted;
            // if (entry[0].)
          } else {
            activity.title = 'not-found';
            activity.isPromoted = false;
          }
        }
      }
      let refinedActivities: [RefinedActivity] = activities.map(
        (activity: Activity) => {
          return refineActivity(activity);
        }
      );
      setIsLoading(false);
      setMyActivity(refinedActivities);
      logger(refinedActivities, 'Active Refined');
    }
  };
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
  };
  useEffect(() => {
    // let endIndex = (forcePaginate * itemsPerPage) % myActivity.length;
    // currentItems = myActivity.slice(forcePaginate, endIndex);
  }, [myActivity]);
  useEffect(() => {
    // if (auth.state === 'initialized') {
    // logger(userId);
    if (auth.state === 'initialized') {
      getActivities();
    }
  }, [auth]);
  useEffect(() => {
    if (auth.state === 'initialized') {
      getActivities();
    }
  }, []);

  return (
    <div>
      <div
        className='profile-comment-pnl m-0 p-0'
        style={{ boxShadow: 'none' }}
      >
        {currentItems?.length > 0 ? (
          <Table className='activity-table mb-0'>
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
              {currentItems.map((activity: RefinedActivity) => (
                <tr>
                  <td>
                    <div className='d-inline-flex align-items-start'>
                      {activity.message ?? ''}
                      {activity.isPromoted && (
                        <Tippy
                          content={<p className='mb-0'>Promoted article</p>}
                        >
                          <Image
                            src={proimg}
                            alt='promoted icon'
                            height={15}
                            width={15}
                            className='mx-2 mt-1'
                          />
                        </Tippy>
                      )}
                      <Link
                        href={
                          activity.message == 'You subscribed to a User'
                            ? `/profile?userId=${activity.target}`
                            : `/article?articleId=${activity.target}`
                        }
                        className='ms-1'
                      >
                        {' '}
                        {activity.title.length < 20
                          ? activity.title
                          : `${activity.title.slice(0, 20)}...` ?? ''}
                      </Link>
                    </div>
                  </td>
                  <td>{activity.date ?? ''}</td>
                  <td>{activity.time ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className='my-3'>
            {isLoading ? (
              <Spinner />
            ) : (
              <p className='h5 m-0'>No Recent Activity Found</p>
            )}
          </div>
        )}
      </div>
      <div className='d-flex justify-content-end mt-2'>
        <div className='pagination-container' style={{ width: 'auto' }}>
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
      </div>
    </div>
  );
}
