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
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
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

export default function ManageCategory() {
  const [adminDetails, setAdminDetails] = useState<adminDetails>({
    name: '',
    address: '',
    perms: {
      userManagement: false,
      articleManagement: false,
      adminManagement: false,
    },
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
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
  const initialCategoryValues: { categoryName: string } = {
    categoryName: '',
  };
  const categorySchema = object().shape({
    categoryName: string()
      .required('Category Name is required')
      .matches(/^[a-zA-Z0-9\s]+$/, 'Only AlphaNumeric characters are allowed')
      .max(MAX_NAME_CHARACTERS, 'Category can not be more than 40 characters'),
  });
  async function getCategories() {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const categories = await entryActor.getCategories();
    setCategories(categories);
    logger(categories, 'CATEGGG');
  }

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement) {
        getCategories();
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
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Article Management <i className='fa fa-arrow-right'></i>{' '}
                    <span>Manage Category</span>
                  </h1>
                  <div className='spacer-20'></div>
                  <p>Write name of the category you want to add</p>
                  <Formik
                    initialValues={initialCategoryValues}
                    validationSchema={categorySchema}
                    onSubmit={async (values, { resetForm, setFieldValue }) => {
                      const { categoryName } = values;
                      setFormSubmiting(true);
                      const entryActor = makeEntryActor({
                        agentOptions: {
                          identity,
                        },
                      });
                      const newCategories = await entryActor.addCategory(
                        categoryName,
                        userCanisterId
                      );
                      setCategories(newCategories);
                      logger(newCategories, 'ADED');
                      setFormSubmiting(false);
                      resetForm();
                      // if (perms.includes('user') && perms.includes('article')) {
                      //   role = { sub_admin: null };
                      // } else if (perms.includes('user')) {
                      //   role = { user_admin: null };
                      // } else if (perms.includes('article')) {
                      //   role = { article_admin: null };
                      // }
                      // logger(
                      //   {
                      //     role,
                      //     perms,
                      //     fal: perms.includes('user'),
                      //     lel: perms.length,
                      //   },
                      //   'setting this'
                      // );

                      // const principal = Principal.fromText(address);
                      // const assigned = await userActor.assign_role(
                      //   principal,
                      //   name,
                      //   role
                      // );
                      // logger(assigned);
                      // if (assigned?.ok) {
                      //   const user = assigned.ok[1];
                      //   const role = user.role;
                      //   if (role.hasOwnProperty('user_admin')) {
                      //     toast.success(
                      //       `User management rights have been granted to "${user.name[0]}" `
                      //     );
                      //   } else if (role.hasOwnProperty('article_admin')) {
                      //     toast.success(
                      //       `Article management rights have been granted to "${user.name[0]}" `
                      //     );
                      //   } else if (role.hasOwnProperty('sub_admin')) {
                      //     toast.success(
                      //       `User & Article management rights have been granted to "${user.name[0]}" `
                      //     );
                      //   } else if (role.hasOwnProperty('sub_admin')) {
                      //     toast.success(
                      //       `${user.name[0]} is no longer an administrator`
                      //     );
                      //   }
                      //   resetForm();
                      //   // setFieldValue('admin', []);
                      //   logger(values);
                      // } else if (assigned?.err) {
                      //   toast.error(assigned?.err);
                      // } else {
                      //   toast.error('Error while creating Admin');
                      // }
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
                      isValid,
                      dirty,
                      validateForm,
                      /* and other goodies */
                    }) => (
                      <FormikForm onSubmit={handleSubmit}>
                        <Row>
                          <Col xl='3' lg='3' md='3'>
                            <Field name='categoryName'>
                              {({ field, formProps }: any) => (
                                <Form.Group
                                  className='mb-3'
                                  controlId='formBasicEmail'
                                >
                                  <Form.Label>Category</Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    onInput={handleBlur}
                                    type='text'
                                    name='categoryName'
                                    placeholder='Enter Category Name'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger mt-2'>
                              <ErrorMessage
                                className='Mui-err'
                                name='categoryName'
                                component='div'
                              />
                            </div>
                          </Col>

                          <Col xl='3' lg='3' md='3'>
                            <Form.Group
                              className='mb-3'
                              controlId='formBasicPassword'
                            >
                              <div className='spacer-30'> </div>
                              <Button
                                className='reg-btn fill-not ble-brdr'
                                type='submit'
                                disabled={isSubmitting || !(isValid && dirty)}
                              >
                                {isSubmitting ? (
                                  <Spinner size='sm' />
                                ) : (
                                  'Add Category'
                                )}
                              </Button>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className='spacer-20'> </div>
                      </FormikForm>
                    )}
                  </Formik>
                </Col>
              </Row>
              <div className='mt-4'></div>
              <div className='d-flex flex-row'>
                <div className='d-flex justify-content-center flex-column border-1 '>
                  <Form.Label className='p-1'>Current Categories</Form.Label>
                  <div className='d-flex flex-wrap gap-3'>
                    {categories &&
                      categories.map((category: any, index) => (
                        <div
                          style={{
                            border: '1px #1e5fb3 solid ',
                            borderRadius: '15px',
                          }}
                          className='px-3 py-1'
                        >
                          <p className='m-0'>{category}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  );
}
