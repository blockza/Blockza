'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import inifinity from '@/assets/Img/coin-image.png';
import Circle from '@/assets/Img/circle.png';
import Image from 'next/image';
import Link from 'next/link';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeUserActor } from '@/dfx/service/actor-locator';
import { usePathname, useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { utcToLocal } from '@/components/utils/utcToLocal';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
export default function Reward() {
  const [rewards, setRewards] = useState<any>();

  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );

  const router = useRouter();
  const pathname = usePathname();

  const getUser = async (res?: any) => {
    let tempUser = null;
    if (res) {
      tempUser = await res.get_user_details([]);
    } else {
      tempUser = await auth.actor.get_user_details([]);
    }
    if (tempUser.ok) {
      setRewards(tempUser.ok[1]);
      logger(tempUser.ok[1]);
      // updateImg(tempUser.ok[1].profileImg[0]);
    }
  };
  useEffect(() => {
    if (auth.state === 'anonymous') {
      router.push('/');
      // setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
    }
  }, [auth, pathname]);

  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-20'></div>
                <Row>
                  <Col xl='12' lg='12' md='12'>
                    <div className='flex-div-xs align-items-center'>
                      <div>
                        <h2>My Rewards</h2>
                        <div className='spacer-20'></div>
                      </div>
                      <div>
                        <Button className='blue-button sm'>
                          Claim Rewards (
                          {rewards?.rewards && rewards?.rewards?.length
                            ? rewards?.rewards?.length / 10
                            : '0'}
                          $)
                        </Button>
                        <div className='spacer-20'></div>
                      </div>
                    </div>
                  </Col>
                  <Col xl='4' lg='6' md='6'>
                    <div
                      className='total-reward-panel'
                      style={{ backgroundColor: '#348BFB' }}
                    >
                      <h3>Total Rewards</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                        <h4>
                          {' '}
                          {rewards?.rewards && rewards.rewards.length
                            ? rewards.rewards.length
                            : '0'}
                        </h4>
                      </div>
                      <div className='text-right'>
                        <p
                          style={{
                            color: '#348BFB',
                          }}
                        >
                          .
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xl='4' lg='6' md='6'>
                    <Link
                      href='#'
                      className='total-reward-panel'
                      style={{ backgroundColor: '#FFE544' }}
                    >
                      <h3>Total Claimed</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                        <h4> 0</h4>
                      </div>
                      <div className='text-right'>
                        <p>---------</p>
                      </div>
                    </Link>
                  </Col>
                  <Col xl='4' lg='6' md='6'>
                    <div
                      className='total-reward-panel'
                      style={{ backgroundColor: '#FFAA7A' }}
                    >
                      <h3>Total Transactions</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                        <h4> 0</h4>
                      </div>
                      <div className='text-right'>
                        <p>---------</p>
                      </div>
                    </div>
                  </Col>
                  <Col xl='12' lg='12' md='12'>
                    <div className='spacer-20'></div>
                  </Col>
                  <Col xl='8' lg='12' md='12'>
                    <div className='table-container'>
                      <div className='table-container-inner sm'>
                        <div className='reward-table-panl'>
                          <div className='reward-tabel'>
                            <div className='reward-table-head'>
                              <Row>
                                <Col xs='4'>Transaction</Col>
                                <Col xs='2'>Amount</Col>
                                <Col xs='2'>Date</Col>
                                <Col xs='2'>Time</Col>
                                <Col xs='2'>Action</Col>
                              </Row>
                            </div>
                            <div className='reward-table-body'>
                              {rewards?.rewards &&
                              rewards?.rewards?.length > 0 ? (
                                rewards?.rewards.map((reward: any) => (
                                  <Row>
                                    <Col xs='4'>0x717d9eb1adb0...</Col>
                                    <Col xs='2'>0.1 ICP</Col>
                                    <Col xs='2'>
                                      {/* 20-05-2023{' '} */}
                                      {utcToLocal(
                                        reward.creation_time.toString(),
                                        'DD-MM-YYYY'
                                      )}
                                    </Col>
                                    <Col xs='2'>
                                      {
                                        // 09:06 AM
                                        utcToLocal(
                                          reward.creation_time.toString(),
                                          'hh-mm A'
                                        )
                                      }
                                    </Col>
                                    <Col xs='2'>UnClaimed</Col>
                                  </Row>
                                ))
                              ) : (
                                <p className='mt-3 text-center'>
                                  No Rewards found
                                </p>
                              )}
                              {/* <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row>
                              <Row>
                                <Col xs='4'>0x717d9eb1adb0...</Col>
                                <Col xs='2'>12 ICP</Col>
                                <Col xs='2'>20-05-2023</Col>
                                <Col xs='2'>09:06 AM</Col>
                                <Col xs='2'>Claimed</Col>
                              </Row> */}
                              <div style={{ height: 300 }}></div>
                            </div>
                          </div>
                          {/* <Table>
                        <thead>
                          <tr>
                            <th>Transaction</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>0x717d9eb1adb0...</td>
                            <td>12 ICP</td>
                            <td>20-05-2023</td>
                            <td>09:06 AM</td>
                            <td>Claimed</td>
                          </tr>
                          <tr>
                            <td>0x717d9eb1adb0...</td>
                            <td>12 ICP</td>
                            <td>20-05-2023</td>
                            <td>09:06 AM</td>
                            <td>Claimed</td>
                          </tr>
                          <tr>
                            <td>0x717d9eb1adb0...</td>
                            <td>12 ICP</td>
                            <td>20-05-2023</td>
                            <td>09:06 AM</td>
                            <td>Claimed</td>
                          </tr>
                          <tr>
                            <td>0x717d9eb1adb0...</td>
                            <td>12 ICP</td>
                            <td>20-05-2023</td>
                            <td>09:06 AM</td>
                            <td>Claimed</td>
                          </tr>
                          <tr>
                            <td>0x717d9eb1adb0...</td>
                            <td>12 ICP</td>
                            <td>20-05-2023</td>
                            <td>09:06 AM</td>
                            <td>Claimed</td>
                          </tr>
                        </tbody>
                      </Table> */}
                        </div>
                      </div>
                    </div>
                    <div className='spacer-30'></div>
                  </Col>
                  <Col xl='4' lg='6' md='12'>
                    <div className='total-pnl'>
                      <Image src={Circle} alt='Circle' />
                      <ul className='total-toal-list'>
                        <li>
                          <span style={{ backgroundColor: '#348BFB' }}></span>{' '}
                          total Rewards
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFE544' }}></span>{' '}
                          total Claimed
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFAA7A' }}></span>{' '}
                          Recent Rewards
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
                {/* <div className='pbg-pnl text-left'></div> */}
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
