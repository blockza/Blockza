'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Spinner, Form, Button, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { UsersList } from '@/components/UsersList';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
} from 'formik';
import { bool, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function UserManagment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    likeReward: 0,
    promotion: 0,
    platform: 0,
    admin: 0,
  });
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const likeRewardRef = useRef<FormikProps<FormikValues>>(null);
  const pathname = usePathname();
  const feeValues = {
    promotion: initialValues.promotion,
    platform: initialValues.platform,
    admin: initialValues.admin,
  };
  const likeRewardValues = {
    likeReward: initialValues.likeReward,
  };
  const likeRewardSchema = object().shape({
    likeReward: number()
      .required('Please Enter Reward Amount')
      .min(10, 'Reward Amount can not be less than 10')
      .test(
        'is-multiple-of-10',
        'Reward Ammount must be a multiple of 10',
        (value) => value % 10 === 0
      ),
  });

  const feeSchema = object().shape({
    promotion: number()
      .min(1, 'Promotion poll is required')
      .max(100, 'Promotion value cannot be greater than 100')
      .integer('Number must be a whole value'),

    platform: number()
      .min(1, 'Platform fee is required')
      .max(100, 'Platform value cannot be greater than 100')
      .integer('Number must be a whole value'),

    admin: number()
      .min(1, 'Admin fee is required')
      .max(100, 'Admin value cannot be greater than 100')
      .integer('Number must be a whole value'),

    // Add a custom test to check the sum
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const handleShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    if (isLikeLoading) return;

    setShowModal(false);
  };
  const handleRewardDistributionUpdate = async (values: FormikValues) => {
    let sum = values.admin + values.platform + values.promotion;
    if (sum !== 100) {
      return toast.error('The sum of these values must be 100');
    }
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsLoading(true);

      let newRewardConfig = {
        master: values.promotion,
        admin: values.admin,
        platform: values.platform,
      };
      let updated = await entryActor.update_reward(
        userCanisterId,
        newRewardConfig
      );
      // if (updated)
      logger(updated, 'UPPPPPPppp');
      toast.success('Distribution Values have been updated successfully');
      formikRef?.current?.resetForm();
      getInitValues();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      logger(error);
    }
  };
  const handleLikeRewardUpdate = async () => {
    if (!identity || auth.state !== 'initialized') return;
    try {
      setIsLikeLoading(true);

      let newReward = likeRewardRef?.current?.values.likeReward;
      let updated = await entryActor.update_like_reward(
        userCanisterId,
        newReward
      );
      // if (updated)
      logger(updated, 'UPPPPPPppp');
      toast.success('Vote Reward has been updated successfully');
      handleModalClose();
      getInitValues();
      likeRewardRef?.current?.resetForm();
      setIsLikeLoading(false);
    } catch (error) {
      logger(error);
      setIsLikeLoading(false);
    }
  };
  const getInitValues = async () => {
    if (!identity || auth.state !== 'initialized') return;

    const likeReward = await entryActor.get_like_reward();
    const config = await entryActor.get_reward();
    setInitialValues((prev) => {
      return {
        likeReward: parseInt(likeReward),
        admin: parseInt(config.admin),
        platform: parseInt(config.platform),
        promotion: parseInt(config.master),
      };
    });

    logger({ likeReward, config }, 'REERERERE');
  };
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement) {
        getInitValues();
      } else {
        router.replace('/superadmin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/superadmin');
    }
  }, [userAuth, auth, pathname]);

  return userAuth.userPerms?.adminManagement ? (
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
                  <Row className='mb-5'>
                    <Col xl='8' lg='6' md='6'>
                      <h1>Reward Management</h1>
                    </Col>
                  </Row>
                  <div>
                    <Formik
                      initialValues={feeValues}
                      validationSchema={feeSchema}
                      enableReinitialize
                      innerRef={formikRef}
                      onSubmit={async (values) => {
                        handleRewardDistributionUpdate(values);
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        validateForm,
                        /* and other goodies */
                      }) => (
                        <FormikForm onSubmit={handleSubmit}>
                          <Row>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='promotion'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      Article Promotion Pool
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Percentage of icp that will go to
                                              the pool of article which will
                                              then be used to reward the users
                                              who vote on the article.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info'></i>
                                        </span>
                                      </Tippy>
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='number'
                                      name='promotion'
                                      placeholder='Enter % value'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div
                                style={{ height: 35 }}
                                className='text-danger mt-2'
                              >
                                <ErrorMessage
                                  className='Mui-err'
                                  name='promotion'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='platform'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      Platform Fee
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Percentage of icp that will go to
                                              the platform wallet to maintain
                                              the platform.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info'></i>
                                        </span>
                                      </Tippy>
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='number'
                                      name='platform'
                                      placeholder='Enter % value'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div
                                style={{ height: 35 }}
                                className='text-danger mt-2'
                              >
                                <ErrorMessage
                                  className='Mui-err'
                                  name='platform'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='admin'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      Admin Fee
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                              Percentage of icp that will go to
                                              the super admin wallet.
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info'></i>
                                        </span>
                                      </Tippy>
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='number'
                                      name='admin'
                                      placeholder='Enter % value'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div
                                style={{ height: 35 }}
                                className='text-danger mt-2'
                              >
                                <ErrorMessage
                                  className='Mui-err'
                                  name='admin'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Col xs='4'>
                              <Button
                                disabled={isLoading}
                                className='publish-btn'
                                type='submit'
                              >
                                {isLoading ? <Spinner size='sm' /> : 'Apply'}
                              </Button>
                            </Col>
                          </Row>
                        </FormikForm>
                      )}
                    </Formik>
                  </div>
                </div>
              </Col>
              <Col xl='10' lg='12'>
                <div className='mt-5'>
                  <Formik
                    initialValues={likeRewardValues}
                    enableReinitialize={true}
                    validationSchema={likeRewardSchema}
                    innerRef={likeRewardRef}
                    onSubmit={async (values) => {
                      handleShow();
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      validateForm,
                      /* and other goodies */
                    }) => (
                      <FormikForm onSubmit={handleSubmit}>
                        <Row>
                          <Col xl='3' lg='3' md='3'>
                            <Field name='likeReward'>
                              {({ field, formProps }: any) => (
                                <Form.Group controlId='formBasicEmail'>
                                  <Form.Label>
                                    Vote Reward
                                    <Tippy
                                      content={
                                        <div>
                                          <p className='mb-0'>
                                            Vote Reward is amount of ICP in e8s
                                          </p>
                                          <p className='mb-0'>
                                            {' '}
                                            100000000 e8s = 1 ICP
                                          </p>
                                        </div>
                                      }
                                    >
                                      <span className='ps-1'>
                                        <i className='fa fa-circle-info'></i>
                                      </span>
                                    </Tippy>
                                  </Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='number'
                                    name='likeReward'
                                    placeholder='eg. 1000 e8s'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div
                              style={{ height: 35 }}
                              className='text-danger '
                            >
                              <ErrorMessage
                                className='Mui-err '
                                name='likeReward'
                                component='div'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col xs='4' className='d-flex align-items-end'>
                          <Button
                            disabled={isLikeLoading}
                            className='publish-btn'
                            type='submit'
                          >
                            {isLikeLoading ? <Spinner size='sm' /> : 'Apply'}
                          </Button>
                        </Col>
                      </FormikForm>
                    )}
                  </Formik>
                </div>
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
              <p className='text-bold h5 fw-bold text-danger m-0'>
                Update Vote Rewards
              </p>
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
              <p className='text-danger text-center'>
                Be Carefull changing the reward per vote can have serious impact
                on the platform!
              </p>
            </div>
            <div className='d-flex justify-content-center'>
              <Button
                className='publish-btn'
                disabled={isLikeLoading}
                onClick={handleLikeRewardUpdate}
                // type='submit'
              >
                {isLikeLoading ? <Spinner size='sm' /> : 'Confirm'}
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  ) : (
    <></>
  );
}
