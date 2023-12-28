'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { ConnectPlugWalletSlice } from '@/types/store';
import { UserPermissions } from '@/types/store';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { array, boolean, object, string } from 'yup';
import { MAX_NAME_CHARACTERS } from '@/constant/validations';
import { Roles } from '@/types/profile';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
interface adminDetails {
  name: string;
  address: string;
  perms: UserPermissions;
}

export default function MakeAdmin() {
  const [adminDetails, setAdminDetails] = useState<adminDetails>({
    name: '',
    address: '',
    perms: {
      userManagement: false,
      articleManagement: false,
      adminManagement: false,
    },
  });
  let [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const initialDetails: { name: string; address: string; admin: string[] } = {
    name: '',
    address: '',
    admin: [],
  };
  const detailSchema = object().shape({
    name: string()
      .required('Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets are allowed')
      .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters'),
    address: string()
      .required('Wallet Address is required')
      .test('min', 'Not a valid address', (value) => {
        try {
          Principal.fromText(value as string);
          return true;
        } catch {
          return false;
        }
      }),
    admin: array().min(1, 'At least one right is required'),
  });

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement) {
      } else {
        router.replace('/superadmin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/superadmin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.adminManagement && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Admin Management <i className='fa fa-arrow-right'></i>{' '}
                    <span>Make Admin</span>
                  </h1>
                  <div className='spacer-20'></div>
                  <p>
                    Write name and wallet Address of the person you want to make
                    admin.
                  </p>
                  <Formik
                    initialValues={initialDetails}
                    validationSchema={detailSchema}
                    onSubmit={async (values, { resetForm, setFieldValue }) => {
                      const { admin: perms, name, address } = values;
                      setFormSubmiting(true);
                      let role: Roles = { authorized: null };
                      if (perms.includes('user') && perms.includes('article')) {
                        role = { sub_admin: null };
                      } else if (perms.includes('user')) {
                        role = { user_admin: null };
                      } else if (perms.includes('article')) {
                        role = { article_admin: null };
                      }
                      logger(
                        {
                          role,
                          perms,
                          fal: perms.includes('user'),
                          lel: perms.length,
                        },
                        'setting this'
                      );

                      const principal = Principal.fromText(address);
                      const assigned = await userActor.assign_role(
                        principal,
                        name,
                        role
                      );
                      logger(assigned);
                      if (assigned?.ok) {
                        const user = assigned.ok[1];
                        const role = user.role;
                        if (role.hasOwnProperty('user_admin')) {
                          toast.success(
                            `User management rights have been granted to "${user.name[0]}" `
                          );
                        } else if (role.hasOwnProperty('article_admin')) {
                          toast.success(
                            `Article management rights have been granted to "${user.name[0]}" `
                          );
                        } else if (role.hasOwnProperty('sub_admin')) {
                          toast.success(
                            `User & Article management rights have been granted to "${user.name[0]}" `
                          );
                        } else if (role.hasOwnProperty('sub_admin')) {
                          toast.success(
                            `${user.name[0]} is no longer an administrator`
                          );
                        }
                        resetForm();
                        // setFieldValue('admin', []);
                        logger(values);
                      } else if (assigned?.err) {
                        toast.error(assigned?.err);
                      } else {
                        toast.error('Error while creating Admin');
                      }
                      setFormSubmiting(false);
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
                            <Field name='name'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-3'
                                  controlId='formBasicEmail'
                                >
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='text'
                                    name='name'
                                    placeholder='John Doe'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='name'
                                component='div'
                              />
                            </div>
                          </Col>
                          <Col xl='6' lg='6' md='6'>
                            <Field name='address'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-3'
                                  controlId='formBasicPassword'
                                >
                                  <Form.Label>Wallet Address</Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='text'
                                    name='address'
                                    // placeholder='John Doe'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='address'
                                component='div'
                              />
                            </div>
                          </Col>
                          {/* <Col xl='3' lg='3' md='3'>
                            <Form.Group
                              className='mb-3'
                              controlId='formBasicPassword'
                            >
                              <div className='spacer-30'> </div>
                              <Button className='reg-btn fill-not ble-brdr'>
                                Make
                              </Button>
                            </Form.Group>
                          </Col> */}
                        </Row>
                        <div className='spacer-20'> </div>
                        <h6>Assign rights to the sub admin.</h6>
                        <div className='spacer-10'> </div>
                        <Form.Group className='mb-3'>
                          <Field name='admin'>
                            {({ field, formProps }: any) => (
                              <Form.Check // prettier-ignore
                                type={'checkbox'}
                                value={'user'}
                                onChange={handleChange}
                                onInput={handleBlur}
                                name='admin'
                                label='User Management'
                                checked={field.value.includes('user')}
                              />
                            )}
                          </Field>

                          <div className='spacer-10'> </div>
                          <Field name='admin'>
                            {({ field, formProps }: any) => (
                              <Form.Check
                                type={'checkbox'}
                                value={'article'}
                                onChange={handleChange}
                                onInput={handleBlur}
                                name='admin'
                                label='Article Management'
                                checked={field.value.includes('article')}
                              />
                            )}
                          </Field>
                          <div className='text-danger mt-2'>
                            <ErrorMessage
                              className='Mui-err'
                              name='admin'
                              component='div'
                            />
                          </div>
                          <div className='spacer-10'> </div>

                          {/* <Form.Check type={'checkbox'} label='Admin Management' /> */}
                        </Form.Group>
                        <Button
                          variant='primary'
                          className='reg-btn fill'
                          type='submit'
                          disabled={formSubmiting}
                        >
                          {formSubmiting ? (
                            <Spinner size='sm' />
                          ) : (
                            'Assign Rights'
                          )}
                        </Button>
                      </FormikForm>
                    )}
                  </Formik>
                </Col>
              </Row>
            </div>
          </div>
        </main>
      </>
    )
  );
}
