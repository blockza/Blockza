'use client';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
  useFormikContext,
} from 'formik';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { User } from '@/types/profile';
import { date, object, string } from 'yup';
import { getImage } from '@/components/utils/getImage';
import defaultBanner from '@/assets/Img/default-banner.jpg';
import girl from '@/assets/Img/user-img.png';
import authMethods from '@/lib/auth';
import {
  MAX_AUTHOR_INFO_CHARACTERS,
  MAX_AUTHOR_META_DESC_CHARACTERS,
  MAX_AUTHOR_TITLE_CHARACTERS,
  MAX_IMAGE_SIZE,
  MAX_NAME_CHARACTERS,
} from '@/constant/validations';
import { toast } from 'react-toastify';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import logger from '@/lib/logger';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
function ScrollToError() {
  const formik = useFormikContext();
  const submitting = formik?.isSubmitting;

  useEffect(() => {
    const el = document.querySelector('.Mui-err');
    (el?.parentElement ?? el)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [submitting]);
  return null;
}

export default function ProfileDetails() {
  const [user, setUser] = useState<User | null>();
  // Both these are for profile Image
  const [tempImg, setTempImg] = useState({ imgUrl: '' });
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  // These are for Banner Image
  const [tempBannerImg, setTempBannerImg] = useState({ imgUrl: '' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerImg, setBannerImg] = useState<string | null>();
  const [profileImg, setProfileImg] = useState<string | null>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGender, setCurrentGender] = useState('Male');
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const formRef = useRef<FormikProps<FormikValues>>(null);
  // const bannerRef = useRef();
  const handleClose = () => {};

  const { auth, setAuth, setIdentity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    setIdentity: state.setIdentity,
  }));

  const methods = authMethods({
    useConnectPlugWalletStore,
    handleClose,
    setIsLoading,
  });

  const initialUser = {
    name: user?.name[0] ?? '',
    email: user?.email[0] ?? '',
    website: user?.website[0] ?? '',
    dob: user?.dob[0] ?? '',
    // gender: user?.gender[0] ? user?.gender[0] : '',
    facebook: user?.facebook[0] ?? '',
    twitter: user?.twitter[0] ?? '',
    instagram: user?.instagram[0] ?? '',
    linkedin: user?.linkedin[0] ?? '',
    authorInfo: user?.authorInfo[0] ?? '',
    authorTitle: user?.authorTitle[0] ?? '',
    authorDescription: user?.authorDescription[0] ?? '',

    // bio: user?.bio[0] ? user?.bio[0] : '',
    // externalLink: user?.externalLink[0] ? user?.externalLink[0] : '',
  };
  const userSchema = object().shape({
    // name: string()
    //   .required('Name is required')
    //   .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters'),
    name: string()
      .required('Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Only alphabets are allowed')
      .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters'),
    // email: string().email('Invalid Email').required('Email is required'),
    email: string()
      .required('Email is required')
      .trim()
      .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, 'Invalid Email'),
    website: string().url('Website Link must be a valid URL'),
    dob: date()
      .required('Birth Date is required')
      .max(new Date(), 'Date is not valid'),
    // gender: string().required('Gender is required'),
    facebook: string().url('Facebook Link must be a valid URL'),
    twitter: string().url('Twitter Link must be a valid URL'),
    instagram: string().url('Instagram Link must be a valid URL'),
    linkedin: string().url('Linkedin Link must be a valid URL'),
    authorInfo: string().max(
      MAX_AUTHOR_INFO_CHARACTERS,
      `Author Info can not be more than ${MAX_AUTHOR_INFO_CHARACTERS} characters`
    ),
    authorTitle: string().max(
      MAX_AUTHOR_TITLE_CHARACTERS,
      `Author Title can not be more than ${MAX_AUTHOR_TITLE_CHARACTERS} characters`
    ),
    authorDescription: string().max(
      MAX_AUTHOR_META_DESC_CHARACTERS,
      `Author Description can not be more than ${MAX_AUTHOR_META_DESC_CHARACTERS} characters`
    ),
    // bio: string()
    //   // .min(20, 'Bio Should be at least 20 characters long')
    //   .max(MAX_BIO_CHARACTERS, 'Bio can not be more than 300 characters'),
    // externalLink: string().url('Link must be a valid URL'),
    // bannerImg: mixed(),
    // profileImg: mixed(),
  });

  const validFileExtensions: any = {
    image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
  };

  function isValidFileType(fileName: string, fileType: any) {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
    );
  }
  //image change function

  const handleImageChange = async (e: any) => {
    const img = e.target.files[0];
    if (!img) return;
    const validType = isValidFileType(img && img.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error('Not a valid image type');
      return;
    }
    const validFileSize = img.size <= MAX_IMAGE_SIZE;
    if (!validFileSize) {
      toast.error('Max allowed size is 600KB');
      return;
    }

    const imgUrl = URL.createObjectURL(img);

    if (e.target.name === 'profileImg') {
      setTempImg({
        imgUrl,
      });
      setProfileFile(img);
    } else if (e.target.name === 'bannerImg') {
      // checking image height and width
      const img2 = document.createElement('img');
      const objectURL = URL.createObjectURL(img);
      img2.onload = await function handleLoad() {
        if (!(img2.width >= 820 && img2.height >= 320)) {
          toast.error(
            'Please upload an image with the resolution greater than  820 width x 320 height to avoid stretching.'
          );
          return;
        } else {
          if (e.target.name === 'profileImg') {
            setTempImg({
              imgUrl,
            });
            setProfileFile(img);
          } else if (e.target.name === 'bannerImg') {
            setTempBannerImg({
              imgUrl,
            });
            setBannerFile(img);
          }
        }

        URL.revokeObjectURL(objectURL);
      };
      img2.src = objectURL;
    }
  };
  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = await getImage(img);
      if (name === 'profile') {
        setProfileImg(tempImg);
      } else {
        setBannerImg(tempImg);
      }
    } else {
      if (name === 'profile') {
        setProfileFile(null);
        setProfileImg(null);
      } else {
        setBannerFile(null);
        setBannerImg(null);
      }
    }
  };

  const getUser = async (res?: any) => {
    let tempUser = null;
    let inputId = userId ? [userId] : [];

    if (res) {
      tempUser = await res.get_user_details(inputId);
    } else {
      tempUser = await auth.actor.get_user_details(inputId);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      setCurrentGender(tempUser.ok[1].gender[0] ?? 'Male');
      updateImg(tempUser.ok[1].profileImg[0], 'profile');
      updateImg(tempUser.ok[1].bannerImg[0], 'banner');
      setIsOwner(tempUser.ok[2]);
    }
  };
  useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
    } else {
      methods.initAuth().then(async (res) => {
        getUser(res.actor);
        if (!res.success) {
          // toast.error('Your session has expired please log in again', {
          //   autoClose: 1900,
          // });
          // setTimeout(() => {
          //   router.push('/');
          // }, 3000);
        } else {
        }
      });
      logger('User not authenticated');
    }
  }, []);
  useEffect(() => {
    if (auth.state === 'anonymous') {
      setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
    }
  }, [auth]);
  useEffect(() => {
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();
          setIsAuthenticated(true);
          setIdentity(identity);
        } else {
          router.replace('/');
          setIsAuthenticated(false);
        }
      }
    };
    getIdentity();
  }, [auth.client]);

  return (
    <main id='main'>
      {isAuthenticated && (
        <>
          <>
            <div className='main-inner home'>
              <Head>
                <title>Hi</title>
              </Head>
              <div className='section' id='top'>
                <Row>
                  {/* <Col xl='12' lg='12' md='12'>
                    <div className='flex-div'>
                      <h2>Edit profile</h2>
                      <Button
                        className='reg-btn blue empty'
                        onClick={() => formRef.current?.handleSubmit()}
                        disabled={isFormSubmitting}
                      >
                        {isFormSubmitting ? (
                          <Spinner
                            animation='border'
                            // variant='secondary'
                            // size='sm'
                            style={{
                              width: '1.2rem',
                              height: '1.2rem',
                              borderWidth: '0.2rem',
                            }}
                          />
                        ) : (
                          'Save'
                        )}
                      </Button>
                    </div>
                    <div className='spacer-20'></div>
                  </Col> */}
                  <Col xl='12' lg='12' md='12'>
                    <div className='pbg-pnl text-left'>
                      <Form>
                        <Form.Group>
                          <Row>
                            <Col className='mb-4' xl='12'>
                              <Form.Label>Change Cover Photo</Form.Label>
                              <input
                                id='bannerImgId'
                                className='d-none'
                                onChange={handleImageChange}
                                name='bannerImg'
                                type='file'
                              />
                              <div className='full-div'>
                                <div className='edit-banner-cntnr'>
                                  {/* <Image src={pic} alt='Pic' /> */}
                                  <div
                                    className='w-full'
                                    style={{ height: '252px' }}
                                  >
                                    {bannerFile ? (
                                      <Image
                                        fill={true}
                                        src={tempBannerImg.imgUrl}
                                        alt='Banner'
                                      />
                                    ) : (
                                      <Image
                                        src={
                                          bannerImg ? bannerImg : defaultBanner
                                        }
                                        alt='Banner'
                                        fill={true}
                                      />
                                    )}
                                  </div>
                                  <Form.Label htmlFor='bannerImgId'>
                                    <i className='fa fa-edit'></i> Edit Picture
                                  </Form.Label>
                                </div>
                              </div>
                            </Col>
                            <Col className='mb-4' xl='12'>
                              <Form.Label>Change Profile Picture</Form.Label>
                              <input
                                id='profileImg'
                                className='d-none'
                                // value={profileFile}
                                // onChange={(e) => handleImageChange(e)}
                                //  value={}
                                onChange={handleImageChange}
                                name='profileImg'
                                type='file'
                              />

                              <div className='full-div'>
                                <div className='edit-picture-cntnr'>
                                  {/* <Image src={pic} alt='Pic' /> */}
                                  <div style={{ width: 250, height: 130 }}>
                                    {profileFile ? (
                                      <Image
                                        fill={true}
                                        src={tempImg.imgUrl}
                                        alt='Profile'
                                      />
                                    ) : (
                                      <Image
                                        src={profileImg ? profileImg : girl}
                                        fill={true}
                                        alt='Profile'
                                      />
                                    )}
                                  </div>
                                  <Form.Label htmlFor='profileImg'>
                                    <i className='fa fa-edit'></i> Edit Picture
                                  </Form.Label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </div>
                    <Formik
                      initialValues={initialUser}
                      enableReinitialize={true}
                      validationSchema={userSchema}
                      innerRef={formRef}
                      onSubmit={async (values, { resetForm }) => {
                        setIsFormSubmitting(true);
                        // setUser(undefined);
                        logger('SUBMITNIG');
                        // TODO Just Using init auth for now, remove this and use session timeout and isAuthenticated after adding session Expiry
                        await methods.initAuth();
                        let fileArray = null;
                        let bannerArray = null;
                        if (profileFile !== null) {
                          fileArray = await fileToCanisterBinaryStoreFormat(
                            profileFile
                          );
                        }
                        if (bannerFile !== null) {
                          bannerArray = await fileToCanisterBinaryStoreFormat(
                            bannerFile
                          );
                        }

                        const newUser = await auth.actor.update_user({
                          name: values.name,
                          email: values.email,
                          website: values.website,
                          dob: values.dob,
                          gender: currentGender,
                          facebook: values.facebook,
                          twitter: values.twitter,
                          instagram: values.instagram,
                          // linkdin: values.linkedin,
                          linkedin: values.linkedin,
                          authorInfo: values.authorInfo,
                          authorTitle: values.authorTitle,
                          authorDescription: values.authorDescription,
                          bannerImg: bannerArray ? [bannerArray] : [],
                          profileImg: fileArray ? [fileArray] : [],
                        });
                        logger(newUser);
                        if (newUser.ok) {
                          setUser(newUser.ok[1]);
                          updateImg(newUser.ok[1].profileImg[0], 'profile');
                          updateImg(newUser.ok[1].bannerImg[0], 'banner');
                          // handleClose();
                          resetForm();
                          toast.success('User Updated Successfully');
                          // setSubmitting(false);
                          setIsFormSubmitting(false);

                          window.scrollTo(0, 0);
                          router.push('/profile');
                        } else {
                          window.scrollTo(0, 0);
                          setIsFormSubmitting(false);
                          toast.error(newUser.err);
                        }
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
                          <ScrollToError />
                          {/* <Field name='name'>
                          {({ field, formProps }: any) => (
                            <Form.Group className='mb-2' controlId='name'>
                              <h2>
                                Name <sup className='required'>Required</sup>
                              </h2>
                              <p>
                                What do you want to be known as? This can be
                                either you personally, or the name of a project
                                you’re looking to create
                              </p>
                              <Form.Control
                                type='text'
                                value={field.value}
                                onChange={handleChange}
                                placeholder='name'
                                maxLength={MAX_NAME_CHARACTERS}
                              />
                            </Form.Group>
                          )}
                        </Field> */}
                          {/* <div className='text-danger my-1'>
                          <ErrorMessage className="Mui-err"name='name' component='div' />
                        </div>
                        <Field name='bio'>
                          {({ field, formProps }: any) => (
                            <Form.Group className='mb-2' controlId='bio'>
                              <h2>
                                Bio <sup>Optional</sup>
                              </h2>
                              <p>
                                A brief summary of who you are. Accepts basic
                                markdown.
                              </p>
                              <Form.Control
                                as='textarea'
                                value={field.value}
                                onChange={handleChange}
                                placeholder='Message'
                                rows={3}
                                maxLength={MAX_BIO_CHARACTERS}
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger my-1'>
                          <ErrorMessage className="Mui-err"name='bio' component='div' />
                        </div>
                        <Field name='externalLink'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='externalLink'
                            >
                              <h2>
                                External Link <sup>Optional</sup>
                              </h2>
                              <p>Add an external link to your profile.</p>
                              <Form.Control
                                type='text'
                                value={field.value}
                                onChange={handleChange}
                                placeholder='url'
                              />
                            </Form.Group>
                          )}
                        </Field>

                        <div className='text-danger my-1'>
                          <ErrorMessage className="Mui-err"name='externalLink' component='div' />
                        </div> */}
                          {/* <Button
                          className='submit-btn d-flex align-items-center justify-content-center'
                          type='submit'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Spinner
                              animation='border'
                              // variant='secondary'
                              // size='sm'
                              style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                borderWidth: '0.3rem',
                              }}
                            />
                          ) : (
                            ' Save Settings'
                          )}
                        </Button> */}
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='name'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    {/* {('Hi', field)} */}
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='name'
                                      placeholder='Neha Ali'
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
                            </div>
                            <div className='mb-4'>
                              <Field name='email'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>Email (required)</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='email'
                                      placeholder='Johndoe@example.com'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='email'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='website'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='website'
                                      placeholder='https://example.com'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='website'
                                  component='div'
                                />
                              </div>
                            </div>
                          </div>
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='dob'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>Birth Date</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='date'
                                      name='dob'
                                      // max={new Date()}
                                      // max={new Date().toJSON().slice(0, 10)}
                                      placeholder='https://example.com'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='dob'
                                  component='div'
                                />
                              </div>
                            </div>
                            <Form.Label>Gender</Form.Label>
                            <Row>
                              <Col xxl='12' xl='12' lg='12' md='12' sm='12'>
                                <ul className='btn-list gender'>
                                  <li>
                                    <Button
                                      className={`gender-btn ${
                                        currentGender === 'Male' ? 'active' : ''
                                      }`}
                                      onClick={() => setCurrentGender('Male')}
                                    >
                                      Male
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className={`gender-btn ${
                                        currentGender === 'Female'
                                          ? 'active'
                                          : ''
                                      }`}
                                      onClick={() => setCurrentGender('Female')}
                                    >
                                      Female
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className={`gender-btn ${
                                        currentGender === 'Non-binary'
                                          ? 'active'
                                          : ''
                                      }`}
                                      onClick={() =>
                                        setCurrentGender('Non-binary')
                                      }
                                    >
                                      Non-binary
                                    </Button>
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          </div>
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='facebook'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      Facebook Profile URL{' '}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='facebook'
                                      placeholder='https://'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='facebook'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='twitter'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      Twitter Profile URL{' '}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='twitter'
                                      placeholder='https://'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='twitter'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='instagram'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      Instagram Profile URL
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='instagram'
                                      type='text'
                                      placeholder='https://'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='instagram'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='linkedin'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      Linkedin Profile URL
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='linkedin'
                                      type='text'
                                      placeholder='https://'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='linkedin'
                                  component='div'
                                />
                              </div>
                            </div>
                          </div>
                          {/* <div className='pbg-pnl text-left'>
                            <Field name='authorInfo'>
                              {({ field, formProps }: any) => (
                                <Form.Group className='mb-4'>
                                  <Form.Label>Author’s Info </Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    name='linkedin'
                                    as='textarea'
                                    rows={3}
                                    placeholder='Neha Ali'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger my-1'>
                              <ErrorMessage
                                className='Mui-err'
                                name='linkedin'
                                component='div'
                              />
                            </div>
                          </div> */}
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='authorInfo'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>Author’s Info </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='authorInfo'
                                      as='textarea'
                                      rows={3}
                                      placeholder='Neha Ali'
                                    />
                                  </Form.Group>
                                )}
                              </Field>{' '}
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='authorInfo'
                                  component='div'
                                />
                              </div>
                            </div>
                          </div>
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='authorTitle'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      Title to use for Author page
                                    </Form.Label>
                                    <Form.Control
                                      autoComplete='off'
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='authorTitle'
                                      type='text'
                                      placeholder='Title'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  name='authorTitle'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='authorDescription'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      Meta description to use for Author pages
                                    </Form.Label>
                                    <Form.Control
                                      as='textarea'
                                      name='authorDescription'
                                      rows={3}
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  name='authorDescription'
                                  component='div'
                                />
                              </div>
                            </div>
                            <Button
                              className='submit-btn d-flex align-items-center justify-content-center'
                              type='submit'
                              disabled={isFormSubmitting}
                              style={{ maxWidth: '250px' }}
                            >
                              {isFormSubmitting ? (
                                <Spinner
                                  animation='border'
                                  // variant='secondary'
                                  // size='sm'
                                  style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderWidth: '0.3rem',
                                  }}
                                />
                              ) : (
                                ' Save Settings'
                              )}
                            </Button>
                          </div>
                        </FormikForm>
                      )}
                    </Formik>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        </>
      )}
    </main>
  );
}
