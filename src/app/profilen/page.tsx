'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Form,
  Modal,
  Button,
  FormProps,
  Spinner,
} from 'react-bootstrap';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import bannerimg from '@/assets/Img/Profile/banner.png';
import bannerimg1 from '@/assets/Img/Profile/banner-1.png';
import profile from '@/assets/Img/Profile/profile-pic.png';
import TrendingPost from '@/components/ProductSlider/ProductSlider';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { User } from '@/types/profile';
import { toast } from 'react-toastify';
import {
  ErrorMessage,
  Field,
  FieldHelperProps,
  FieldProps,
  Formik,
  Form as FormikForm,
  useFormikContext,
} from 'formik';
import { mixed, object, string } from 'yup';
import {
  MAX_BIO_CHARACTERS,
  MAX_IMAGE_SIZE,
  MAX_NAME_CHARACTERS,
  VALID_IMAGE_EXTENSIONS,
} from '@/constant/validations';
import authMethods from '@/lib/auth';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import { getImage } from '@/components/utils/getImage';
import { makeEntryActor } from '@/dfx/service/actor-locator';

export default function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [animatedElements, setAnimatedElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState<User | null>();
  // Both these are for profile Image
  const [tempImg, setTempImg] = useState({ imgUrl: '' });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  // These are for Banner Image
  const [tempBannerImg, setTempBannerImg] = useState({ imgUrl: '' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [show, setShow] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>();
  const [bannerImg, setBannerImg] = useState<string | null>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const bannerRef = useRef();

  const { auth, setAuth, setIdentity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    setIdentity: state.setIdentity,
  }));
  const methods = authMethods({ auth, setAuth, setIsLoading });
  const initialUser = {
    name: user?.name[0] ? user?.name[0] : '',
    bio: user?.bio[0] ? user?.bio[0] : '',
    externalLink: user?.externalLink[0] ? user?.externalLink[0] : '',
  };

  const userSchema = object().shape({
    name: string()
      .required('Name is required')
      .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters'),
    bio: string()
      // .min(20, 'Bio Should be at least 20 characters long')
      .max(MAX_BIO_CHARACTERS, 'Bio can not be more than 300 characters'),
    externalLink: string().url('Link must be a valid URL'),
    // bannerImg: mixed(),
    // profileImg: mixed(),
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function isElementInViewport(elem: Element) {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elemTop = elem.getBoundingClientRect().top + scroll;
    return elemTop - scroll < windowHeight;
  }
  function animateSections() {
    const elementsToAnimate = document.querySelectorAll('.scroll-anime');
    const elementsInViewport: any = [];
    elementsToAnimate.forEach((elem) => {
      if (isElementInViewport(elem)) {
        elem.classList.add('anime');
        elementsInViewport.push(elem);
      }
    });
    setAnimatedElements(elementsInViewport);
  }
  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);

  const [isBlack, setIsBlack] = useState(false);
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  const handleLogout = () => {
    setUser(null);
    setProfileFile(null);
    setBannerFile(null);
  };
  const validFileExtensions: any = {
    image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
  };

  function isValidFileType(fileName: string, fileType: any) {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
    );
  }
  const handleImageChange = (e: any) => {
    const img = e.target.files[0];
    const validType = isValidFileType(img && img.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error('Not a valid image type');
      return;
    }
    const validFileSize = img.size <= MAX_IMAGE_SIZE;
    if (!validFileSize) {
      toast.error('Max allowed size is 100KB');
      return;
    }
    const imgUrl = URL.createObjectURL(img);
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
    if (res) {
      tempUser = await res.get_user_details(userId);
    } else {
      tempUser = await auth.actor.get_user_details(userId);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      updateImg(tempUser.ok[1].profileImg[0], 'profile');
      updateImg(tempUser.ok[1].bannerImg[0], 'banner');
      setIsOwner(tempUser.ok[2]);
    }
    console.log('GET_USER_DETAILS', tempUser);
  };
  useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
    } else {
      methods.initAuth().then(async (res) => {
        if (!res.success) {
          // toast.error('Your session has expired please log in again', {
          //   autoClose: 1900,
          // });
          // setTimeout(() => {
          //   router.push('/');
          // }, 3000);
          getUser(res.actor);
        } else {
          getUser(res.actor);
          console.log(res, auth.actor);
        }
      });
      console.log('User not authenticated');
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

  return (
    <>
      <main id='main' className={`inner-main ${isBlack ? 'black' : ''}`}>
        {/* NavBar */}
        <NavBarDash handleButtonClick={handleButtonClick} />
        {/* NavBar */}

        <Container fluid>
          <Row>
            <Container>
              <Row>
                <Col xl='12' lg='12' md='12' sm='12'>
                  <div className='profile-detail-pnl'>
                    <div className='banner-pnl' style={{ minHeight: 432 }}>
                      <Image
                        src={bannerImg ? bannerImg : bannerimg}
                        fill={true}
                        alt='Banner'
                      />
                    </div>
                    <div className='txt-pnl pb-2'>
                      {isOwner && (
                        <Button
                          className='edit-profile-btn'
                          onClick={handleShow}
                        >
                          Edit Profile
                        </Button>
                      )}
                      <div className='img-pnl'>
                        <div className='img'>
                          <Image
                            src={profileImg ? profileImg : profile}
                            fill={true}
                            alt='Profile'
                          />
                        </div>
                      </div>
                      <h1 className={user ? '' : 'shimmer'}>
                        {user ? user.name : 'User Name'}
                      </h1>
                      <p className={user ? '' : 'shimmer'}>
                        {user
                          ? user.bio
                          : 'Video games, both culturally and visually, have sparked the imagination of countless artists. Yet, when an artistVideo games, both culturally Video games, both culturally and visually, have sparked the imagination of countless artists. Yet, when an artistVideo games, both culturally...'}
                      </p>
                      {user &&
                        (isOwner ? (
                          <ul className='btn-list center'>
                            <li>
                              <a
                                onClick={(e) => {
                                  if (!user?.externalLink[0]) {
                                    e.preventDefault();
                                    handleShow();
                                  }
                                }}
                                href={user?.externalLink[0] || ''}
                                target='_blank'
                                className='border-0'
                              >
                                <i className='fa fa-link'></i>{' '}
                                {user?.externalLink[0]
                                  ? user?.externalLink[0].slice(0, 10) + '...'
                                  : 'Add Link'}
                              </a>
                            </li>
                            <li>
                              <Link href='/'>
                                <i className='fa fa-twitter'></i> Add Twitter
                              </Link>
                            </li>
                          </ul>
                        ) : (
                          <ul className='btn-list center'>
                            <li>
                              <a
                                href={user?.externalLink[0] || ''}
                                onClick={(e) => {
                                  if (!user?.externalLink[0]) {
                                    e.preventDefault();
                                  }
                                }}
                                target='_blank'
                                className='border-0'
                              >
                                <i className='fa fa-link'></i>{' '}
                                {user?.externalLink[0]
                                  ? user?.externalLink[0].slice(0, 10) + '...'
                                  : 'No Link'}
                              </a>
                            </li>
                            <li>
                              <a
                                href={user?.twitter[0] || ''}
                                onClick={(e) => {
                                  if (!user?.twitter[0]) {
                                    e.preventDefault();
                                  }
                                }}
                                target='_blank'
                              >
                                <i className='fa fa-twitter'></i>{' '}
                                {user?.twitter[0]
                                  ? user?.twitter[0]
                                  : 'No Twitter'}
                              </a>
                            </li>
                          </ul>
                        ))}
                    </div>
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12' sm='12'>
                  <Tabs
                    defaultActiveKey='Entries'
                    id='uncontrolled-tab-example'
                  >
                    <Tab eventKey='Entries' title='Entries'>
                      <Row>
                        <Col
                          xl={{ span: 10, offset: 1 }}
                          lg={{ span: 10, offset: 1 }}
                        >
                          <Row>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab eventKey='Collection' title='Collection'>
                      <Row>
                        <Col
                          xl={{ span: 10, offset: 1 }}
                          lg={{ span: 10, offset: 1 }}
                        >
                          <Row>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                            <Col xl='4' lg='4'>
                              <TrendingPost />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      </main>
      <Modal
        show={show}
        className='edit-profile-modal'
        centered
        size='lg'
        onHide={handleClose}
      >
        <Modal.Header>
          <div className='flex-div connect-heading-pnl m-0'>
            <Modal.Title>
              <p>Edit Profile</p>
            </Modal.Title>
            <Button className='close-btn' onClick={handleClose}>
              <i className='fa fa-close'></i>
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='full-div'>
            <div className='profile-detail-pnl'>
              <div className='banner-pnl'>
                <Button className='banner-edit-btn'>
                  <label style={{ cursor: 'pointer' }} htmlFor='bannerImgId'>
                    <i className='fa fa-edit'></i>
                  </label>
                </Button>
                {/* <Image src={bannerimg1} alt='Banner' /> */}
                {bannerFile ? (
                  <div className='w-full' style={{ height: '252px' }}>
                    <Image
                      fill={true}
                      src={tempBannerImg.imgUrl}
                      alt='Banner'
                    />
                  </div>
                ) : (
                  <div className='w-full' style={{ height: '252px' }}>
                    <Image
                      src={bannerImg ? bannerImg : bannerimg1}
                      alt='Banner'
                      fill={true}
                    />
                  </div>
                )}
                <input
                  id='bannerImgId'
                  className='d-none'
                  onChange={handleImageChange}
                  name='bannerImg'
                  type='file'
                />
              </div>
              <div className='txt-pnl'>
                <div className='img-pnl'>
                  <label className='h-full w-full' htmlFor='profileImg'>
                    <div className='img'>
                      {profileFile ? (
                        <Image fill={true} src={tempImg.imgUrl} alt='Profile' />
                      ) : (
                        <Image
                          src={profileImg ? profileImg : profile}
                          fill={true}
                          alt='Profile'
                        />
                      )}
                    </div>
                  </label>
                </div>
                <label htmlFor='profileImg'>
                  <h1>
                    <i className='fa fa-edit'></i>Edit Picture
                  </h1>
                </label>
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
              </div>
            </div>
          </div>
          <div className='profile-info-panel'>
            <Formik
              initialValues={initialUser}
              validationSchema={userSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                setUser(undefined);
                console.log('SUBMITNIG');
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
                  bio: values.bio ? values.bio : '',
                  email: '',
                  externalLink: values.externalLink ? values.externalLink : '',
                  twitter: '',
                  bannerImg: bannerArray ? [bannerArray] : [],
                  profileImg: fileArray ? [fileArray] : [],
                });
                console.log(newUser);
                setUser(newUser.ok[1]);
                updateImg(newUser.ok[1].profileImg[0], 'profile');
                updateImg(newUser.ok[1].bannerImg[0], 'banner');
                setSubmitting(false);
                handleClose();
                resetForm();
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
                  <Field name='name'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2' controlId='name'>
                        <h2>
                          Name <sup className='required'>Required</sup>
                        </h2>
                        <p>
                          What do you want to be known as? This can be either
                          you personally, or the name of a project you’re
                          looking to create
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
                  </Field>
                  <div className='text-danger my-1'>
                    <ErrorMessage name='name' component='div' />
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
                    <ErrorMessage name='bio' component='div' />
                  </div>
                  <Field name='externalLink'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2' controlId='externalLink'>
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
                    <ErrorMessage name='externalLink' component='div' />
                  </div>
                  <Button
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
                  </Button>
                </FormikForm>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
