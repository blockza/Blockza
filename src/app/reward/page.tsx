'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import inifinity from '@/assets/Img/coin-image.png';
import inifinity2 from '@/assets/Img/infinity.png';
import Image from 'next/image';
import Link from 'next/link';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import {
  E8S,
  GAS_FEE,
  MIN_REWARD_CLAIM,
  MIN_REWARD_CLAIM_ICP,
} from '@/constant/config';
import Tippy from '@tippyjs/react';
import { toast } from 'react-toastify';
import updateBalance from '@/components/utils/updateBalance';
import updateReward from '@/components/utils/updateReward';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
export default function Reward() {
  const [rewards, setRewards] = useState<any>();
  const [likeReward, setLikeReward] = useState<number>();
  const [showModal, setShowModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<any>();
  const [unlaimedRewards, setUnClaimedRewards] = useState<any>();
  const [rewardAmount, setRewardAmount] = useState({
    all: 0,
    claimed: 0,
    unclaimed: 0,
  });

  const [chartData, setChartData] = useState({
    labels: ['Total Rewards', 'Total Claimed', 'Total unClaimed'],
    datasets: [
      {
        backgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
        hoverBackgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
        data: [0, 0, 0],
      },
    ],
  });
  const { auth, setAuth, identity, principal, setReward, setBalance } =
    useConnectPlugWalletStore((state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
      setReward: state.setReward,
      setBalance: state.setBalance,
    }));

  const router = useRouter();
  const pathname = usePathname();

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  const handleShow = () => {
    if (rewardAmount.unclaimed < MIN_REWARD_CLAIM_ICP) {
      return toast.error(
        `You need to have atleast ${MIN_REWARD_CLAIM_ICP} unclaimed rewards to claim them`
      );
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    if (isClaiming) return;

    setShowModal(false);
  };
  const getUser = async (res?: any) => {
    let tempUser = null;
    if (res) {
      tempUser = await res.get_user_details([]);
    } else {
      tempUser = await auth.actor.get_user_details([]);
    }
    if (tempUser.ok) {
      const tempRewards = tempUser.ok[1].rewards;
      setRewards(tempRewards.reverse());
      const claimedArray = [];
      const unClaimedArray = [];
      let allAmount = 0;
      let claimedAmount = 0;
      let unClaimedAmount = 0;
      for (let i = 0; i < tempRewards.length; i++) {
        const reward = tempRewards[i];
        const amount = parseInt(reward.amount) / E8S;
        allAmount += amount;
        if (reward.isClaimed) {
          claimedArray.push(reward);
          claimedAmount += amount;
        } else {
          unClaimedAmount += amount;
          unClaimedArray.push(reward);
        }
      }
      setRewardAmount({
        all: allAmount,
        claimed: claimedAmount,
        unclaimed: unClaimedAmount,
      });
      // const claimedRewards = tempRewards.filter((reward: any) => {
      //   return reward.isClaimed;
      // });
      // const unClaimedRewards = tempRewards.filter((reward: any) => {
      //   return !reward.isClaimed;
      // });
      setClaimedRewards(claimedArray);
      setUnClaimedRewards(unClaimedArray);
      logger({ tempRewards, unClaimedArray, claimedArray });

      // updateImg(tempUser.ok[1].profileImg[0]);
    }
  };
  // chart conig
  let ifNoVal = {
    labels: ['No Rewards'],
    datasets: [
      {
        backgroundColor: ['#c0c0c0'],
        hoverBackgroundColor: ['#c0c0c0'],
        data: [1],
      },
    ],
  };
  const handleClaim = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    if (rewardAmount.unclaimed < MIN_REWARD_CLAIM_ICP) {
      return toast.error(
        `You need to have atleast ${MIN_REWARD_CLAIM_ICP} unclaimed rewards to claim them`
      );
    }
    try {
      setIsClaiming(true);
      const claim = await auth.actor.claim_rewards(entryCanisterId);
      getUser();
      toast.success('You have successfully claimed your rewards');
      updateBalance({ identity, setBalance, auth });
      updateReward({ identity, setReward, auth });
      setIsClaiming(false);
      handleModalClose();
    } catch (err) {
      setIsClaiming(false);
      handleModalClose();
    }
  };
  let claimableReward = rewardAmount.unclaimed.toFixed(5);
  let gasFee = GAS_FEE / E8S;
  useEffect(() => {
    if (auth.state === 'anonymous') {
      router.push('/');
      // setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
    }
  }, [auth, pathname]);

  useEffect(() => {
    const getLikeR = async () => {
      const tempLike = await entryActor.get_like_reward();
      const likeR = parseInt(tempLike);
      setLikeReward(likeR / E8S);
    };
    if (identity && auth.state === 'initialized') {
      getLikeR();
    }
  }, [auth, identity, pathname]);
  useEffect(() => {
    setChartData({
      labels: ['Total Rewards', 'Total Claimed', 'Total Unclaimed'],
      datasets: [
        {
          backgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
          hoverBackgroundColor: ['#348BFB', '#FFE544', '#FFAA7A'],
          data: [
            rewardAmount ? rewardAmount.all : 0,
            rewardAmount ? rewardAmount.claimed : 0,
            rewardAmount ? rewardAmount.unclaimed : 0,
          ],
        },
      ],
    });
    if (rewards) logger(rewards, 'test');
  }, [rewardAmount]);
  ChartJS.register(ArcElement, Tooltip);
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
                      <div className='d-flex flex-column align-items-end rewardbtn'>
                        <Button
                          onClick={handleShow}
                          disabled={isClaiming}
                          className='blue-button sm'
                        >
                          Claim Rewards ({claimableReward}
                          <Image
                            src={inifinity2}
                            alt='inifinity'
                            style={{ height: '10px', width: '20px' }}
                          />
                          )
                        </Button>
                        <p className='text-secondary mt-2'>
                          * The minimum requirement for claiming is{' '}
                          {MIN_REWARD_CLAIM_ICP} unclaimed rewards
                        </p>
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
                        <p className='reward-text'>
                          {/* {rewards && rewards.length ? rewards.length : '0'} */}
                          {rewardAmount.all.toFixed(5) ?? 0}
                        </p>
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
                        <p className='reward-text'>
                          {/* {claimedRewards ? claimedRewards.length : 0} */}
                          {rewardAmount?.claimed > 0
                            ? rewardAmount.claimed.toFixed(5)
                            : 0}
                        </p>
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
                      <h3>Total Unclaimed</h3>
                      <div className='flex-div-xs align-items-center'>
                        <Image src={inifinity} alt='inifinity' />
                        <p className='reward-text'>
                          {/* 0 */}
                          {rewardAmount.unclaimed.toFixed(5) ?? 0}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p>---------</p>
                      </div>
                    </div>
                  </Col>
                  <Col xl='4' lg='6' md='6'>
                    <div className='total-pnl'>
                      {/* <Image src={Circle} alt='Circle' /> */}
                      <div className='d-flex justify-content-center'>
                        {rewards && rewards.length == 0 ? (
                          <div style={{ width: '200px' }}>
                            <Doughnut data={ifNoVal} />
                          </div>
                        ) : (
                          <div style={{ width: '200px' }}>
                            <Doughnut data={chartData} />
                          </div>
                        )}
                      </div>
                      <ul className='total-toal-list '>
                        <li>
                          <span style={{ backgroundColor: '#348BFB' }}></span>{' '}
                          Total Rewards
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFE544' }}></span>{' '}
                          Total Claimed
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFAA7A' }}></span>{' '}
                          Total Unclaimed
                        </li>
                      </ul>
                    </div>
                  </Col>
                  {/* <Col xl='12' lg='12' md='12'>
                    <div className='spacer-20'></div>
                  </Col> */}
                  <Col xl='8' lg='12' md='12'>
                    <div className='table-container'>
                      <div
                        className='table-container-inner sm'
                        style={{ borderRadius: '20px' }}
                      >
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
                              {rewards && rewards?.length > 0 ? (
                                rewards?.map((reward: any, index: number) => (
                                  <Row key={index}>
                                    <Col xs='4'>
                                      {reward.creation_time.toString()}
                                    </Col>
                                    <Col xs='2'>
                                      {reward.amount
                                        ? parseInt(reward.amount) / E8S
                                        : 0}{' '}
                                      ICP
                                    </Col>
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
                                          'hh:mm A'
                                        )
                                      }
                                    </Col>
                                    <Col xs='2'>
                                      {reward.isClaimed ? (
                                        <Tippy
                                          content={
                                            <div>
                                              {utcToLocal(
                                                reward.claimed_at[0].toString(),
                                                'DD-MM-yyyy hh:mm A'
                                              )}
                                            </div>
                                          }
                                        >
                                          <span>Claimed</span>
                                        </Tippy>
                                      ) : (
                                        'UnClaimed'
                                      )}
                                    </Col>
                                  </Row>
                                ))
                              ) : (
                                <p className='mt-3 text-center'>
                                  No Rewards found
                                </p>
                              )}

                              <div style={{ height: 300 }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='spacer-30'></div>
                  </Col>
                  {/* <Col xl='4' lg='6' md='12'>
                    <div className='total-pnl'>
                      {/* <Image src={Circle} alt='Circle' /> */}
                  {/* <div className='d-flex justify-content-center'>

                    
                     {(rewards && rewards.length == 0) ? <Doughnut data={ifNoVal} />:<div style={{width:'200px'}}><Doughnut data={chartData} /></div> }
                     </div>
                      <ul className='total-toal-list'>
                        <li>
                          <span style={{ backgroundColor: '#348BFB' }}></span>{' '}
                          Total Rewards
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFE544' }}></span>{' '}
                          Total Claimed
                        </li>
                        <li>
                          <span style={{ backgroundColor: '#FFAA7A' }}></span>{' '}
                          Recent Rewards
                        </li>
                      </ul>
                    </div>
                  </Col> */}
                </Row>
                {/* <div className='pbg-pnl text-left'></div> */}
              </Col>
            </Row>
          </div>
        </div>
      </main>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Body>
          <>
            <div className='flex-div connect-heading-pnl mb-3'>
              {/* <i className='fa fa-question-circle-o'></i> */}
              <p></p>
              <p className='text-bold h5 fw-bold m-0'>Claim Rewards</p>
              {/* <i onClick={handleModalClose} className='fa fa-close'></i> */}
              <i
                style={{
                  cursor: 'pointer',
                }}
                onClick={handleModalClose}
                className='fa fa-close'
              ></i>
              {/* <Button
                  className='close-btn'
                ></Button> */}
            </div>
            <div>
              <p className='text-center'>
                Are you sure you want to claim {claimableReward} ICP tokens ?
              </p>

              <p className='text-secondary mb-1'>
                <span
                  style={{
                    border: '2px',
                  }}
                >
                  Reward: {claimableReward} ICP
                </span>
              </p>
              <p className='text-secondary mb-0'>
                Transaction fee: {gasFee} ICP
              </p>
              <div
                style={{
                  height: 1,
                  backgroundColor: 'gray',
                  width: '40%',
                }}
              ></div>
              <p className='text-secondary mt-1 mb-0'>
                Total: {(parseFloat(claimableReward) - gasFee).toFixed(8)} ICP
              </p>
            </div>
            <div className='d-flex justify-content-center'>
              <Button
                className='publish-btn'
                disabled={isClaiming || isClaiming}
                onClick={handleClaim}
                // type='submit'
              >
                {isClaiming ? <Spinner size='sm' /> : 'Confirm'}
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
}
