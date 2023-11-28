'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Head from 'next/head';
import {
  Row,
  Col,
  Form,
  Button,
  Accordion,
  Tab,
  Tabs,
  Spinner,
  Modal,
} from 'react-bootstrap';
import girl from '@/assets/Img/user-img.png';
import iconshare from '@/assets/Img/Icons/icon-share.png';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import post1 from '@/assets/Img/placeholder-img.jpg';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';
import iconmedia from '@/assets/Img/Icons/icon-media.png';
import media from '@/assets/Img/media.png';
import Footer from '@/components/Footer/Footer';
import { useConnectPlugWalletStore } from '@/store/useStore';
import Infinity from '@/assets/Img/Icons/infinity.png';
import Wallet from '@/assets/Img/Icons/plug-wallet.png';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form as FormikForm,
  Field,
  FieldProps,
  FormikValues,
  ErrorMessage,
  useFormikContext,
  FormikTouched,
  setNestedObjectValues,
} from 'formik';
import { Article } from '@/types/article';
import { mixed, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import {
  makeEntryActor,
  makeLedgerCanister,
} from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { isValidFileType } from '@/constant/image';
import { MAX_IMAGE_SIZE } from '@/constant/validations';
import { getImage } from '@/components/utils/getImage';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { FaTruckField } from 'react-icons/fa6';

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
export default function AddArticle() {
  const [isLoading, setIsLoading] = useState(false);
  const [articleContent, setArticleContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [isArticleSubmitting, setIsArticleSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(5);
  const [tempPreviewImg, setTempPreviewImg] = useState('');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isArticleDraft, setIsArticleDraft] = useState(true);
  const [draftPreviewImg, setDraftPreviewImg] = useState<File | null>(null);
  const [initialArticleContent, setInitialArticleContent] = useState('');
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [articleStatus, setArticleStatus] = useState(false);
  const [profileImg, setProfileImg] = useState<any>();
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [user, setUser] = useState<any>();
  const [draftArticleCreator, setDraftArticleCreator] = useState<any>();
  const [promotionValues, setPromotionValues] = useState({
    icp: 0,
    // likes: 0,
  });
  const [draftContent, setDraftContent] = useState({
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoSlug: '',
    seoExcerpt: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const searchParams = useSearchParams();

  const draftId = searchParams.get('draftId');

  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const handleClose = () => {};
  const handleModalClose = () => {
    setShowModal(false);
    setConfirmTransaction(false);
  };
  const handlePreviewModalClose = () => {
    setShowPreviewModal(false);
  };
  const handleShowPreviewModal = () => {
    setShowPreviewModal(true);
  };
  const methods = authMethods({ auth, setAuth, setIsLoading, handleClose });
  const updateImg = async (img: any, profile?: boolean) => {
    if (profile) {
      if (img) {
        const tempImg = await getImage(img);

        setProfileImg(tempImg);
      } else {
        // setProfileFile(null);
        setProfileImg(null);
      }
    } else {
      if (img) {
        const tempImg = await getImage(img);
        setTempPreviewImg(tempImg);
      } else {
        // setProfileFile(null);
        setTempPreviewImg('');
      }
    }
  };
  const getEntry = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (draftId) {
      const tempEntry = await entryActor.getEntry(draftId);
      // let tempUser = tempEntry[0].user?.toString();
      // setUserId(tempUser);
      // updateImg(tempEntry[0].image, 'feature');
      let articleCreator = tempEntry[0].user.toString();
      if (articleCreator !== principal) return router.replace('/');

      if (!tempEntry[0].isDraft) {
        toast.error('This action is not allowed');
        return router.push('/');
      }
      setDraftContent(tempEntry[0]);
      // setInitialArticleContent(tempEntry[0].description);
      setArticleContent(tempEntry[0].description);
      // setArticleContent(tempEntry[0].description);
      setSelectedCategory(tempEntry[0].category);
      updateImg(tempEntry[0].image);
      setDraftPreviewImg(tempEntry[0].image);
      setDraftArticleCreator(tempEntry[0].user);
      setIsArticleDraft(true);

      // setEntry(tempEntry[0]);
      logger(tempEntry[0], 'Draft fetched from canister');
    }
  };

  // Form

  const initialValues: Article = {
    title: draftContent.title ?? '',
    // description: '',
    seoTitle: draftContent.seoTitle ?? '',
    seoDescription: draftContent.seoDescription ?? '',
    seoExcerpt: draftContent.seoExcerpt ?? '',
    seoSlug: draftContent.seoSlug ?? '',
  };
  const initialPromoteVales = {
    ICP: 0,
  };
  const promotionSchema = object().shape({
    ICP: number().min(1, 'ICP cannot be less than 1'),
  });
  const articleSchema = object().shape({
    title: string()
      .required('Title is required')
      .max(150, 'Title cannot be more than 100 characters'),
    // description: string().required('Description is required'),
    seoTitle: string()
      .required('Seo Title is required')
      .max(100, 'Seo Title cannot be more than 100 characters'),
    seoDescription: string()
      .required('Seo Description is required')
      .max(250, 'Seo Description cannot be more than 250 characters'),
    seoExcerpt: string()
      .required('Seo Excerpt is required')
      .max(160, 'Seo Excerpt cannot be more than 160 characters'),
    seoSlug: string()
      .required('Seo Slug is required')
      .max(100, 'Seo Slug cannot be more than 100 characters'),
    // img: mixed().required('Image is required'),
  });

  const categories = ['AI', 'BlockChain', 'Guide', 'GameReview'];
  const handleImageChange = (e: any) => {
    const img = e.target.files[0];
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

    setTempPreviewImg(imgUrl);
    setPreviewFile(img);
  };
  const clearPost = () => {
    formikRef.current?.resetForm();
    const newKey = editorKey * 45;
    // setEditorKey(newKey);
    setSelectedCategory([]);
    setPreviewFile(null);
    setArticleContent('');
    setDraftPreviewImg(null);
    setDraftContent({
      title: '',
      seoTitle: '',
      seoDescription: '',
      seoSlug: '',
      seoExcerpt: '',
    });
  };
  // Form

  const uploadEntry = async (
    values: FormikValues,
    actions: FormikHelpers<FormikValues>
  ) => {
    if (articleContent?.length <= 0) {
      return toast.error('You can not save an empty article');
    }

    if (selectedCategory.length === 0) {
      return toast.error('Please select at least one  category');
    }
    let previewArray = null;
    if (previewFile !== null) {
      previewArray = await fileToCanisterBinaryStoreFormat(previewFile);
    } else if (draftPreviewImg !== null) {
      previewArray = draftPreviewImg;
    } else {
      return toast.error('Please select a featured Image');
    }
    if (isArticleDraft) {
      setIsDraftSubmitting(true);
    } else {
      setIsArticleSubmitting(true);
    }
    await methods.initAuth();

    const article = {
      title: values.title,
      description: articleContent,
      seoTitle: values.seoTitle,
      seoSlug: values.seoSlug,
      seoDescription: values.seoDescription,
      seoExcerpt: values.seoExcerpt,
      category: selectedCategory,
      subscription: true,
      image: previewArray,
      isDraft: isArticleDraft,
      isPromoted,
      // promotionLikesTarget: promotionValues.likes,
      promotionICP: promotionValues.icp,
    };
    if (isArticleDraft) {
    }

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (draftId) {
      if (isArticleDraft) {
        article.isPromoted = false;
        article.promotionICP = 0;
      }
      entryActor
        .insertEntry(article, userCanisterId, true, draftId)
        .then((res: any) => {
          if (isArticleDraft) {
            article.isPromoted = false;
            article.promotionICP = 0;

            logger(res, 'draft Saved successfully');
            toast.success('Draft Saved successfully');
          } else {
            logger(res, 'draft Published successfully');
            toast.success('Article Published successfully');
          }
          if (isArticleDraft) {
            setIsDraftSubmitting(false);
            setArticleStatus(false);
          } else {
            setIsArticleSubmitting(false);
            setArticleStatus(true);
            router.replace(`/article?articleId=${res.ok[1]}`);
            clearPost();
          }
          // setIsArticleSubmitting(false);

          window.scrollTo(0, 0);
        })
        .catch((err: string) => {
          logger(err);
          // setIsArticleSubmitting(false);
          setArticleStatus(false);

          if (isArticleDraft) {
            setIsDraftSubmitting(false);
          } else {
            setIsArticleSubmitting(false);
          }
        });
    } else {
      if (isArticleDraft) {
        article.isPromoted = false;
        article.promotionICP = 0;
      }
      entryActor
        .insertEntry(article, userCanisterId, false, '')
        .then((res: any) => {
          logger(res, 'article Added successfully');
          if (isArticleDraft) {
            toast.success('Draft Saved successfully');
            setArticleStatus(false);

            router.replace(`/addarticle?draftId=${res.ok[1]}`);
          } else {
            toast.success('Article created successfully');
            setArticleStatus(true);

            clearPost();
            router.replace(`/article?articleId=${res.ok[1]}`);
          }
          // setIsArticleSubmitting(false);
          if (isArticleDraft) {
            setIsDraftSubmitting(false);
          } else {
            setIsArticleSubmitting(false);
          }

          window.scrollTo(0, 0);
        })
        .catch((err: string) => {
          logger(err);
          // setIsArticleSubmitting(false);
          if (isArticleDraft) {
            setIsDraftSubmitting(false);
          } else {
            setIsArticleSubmitting(false);
          }
          setArticleStatus(false);
        });
    }

    logger(article, 'Article Added successfully');
    /* // setUser(newUser.ok[1]);
    // updateImg(newUser.ok[1].profileImg[0], 'profile');
    // updateImg(newUser.ok[1].bannerImg[0], 'banner');
    // handleClose();
    // resetForm();
    // toast.success('User Updated Successfully');
    // setSubmitting(false);
    // setIsFormSubmitting(false);

    // router.push('/profile');

    // actions.setSubmitting(false); 

    */
  };
  const saveDraft = async () => {
    // if (false) {
    //   toast.error('This draft is already saved');
    // } else {
    setIsArticleDraft(true);
    setIsPromoted(false);
    setPromotionValues({
      icp: 0,
    });
    await formikRef.current?.handleSubmit();
    // }
  };

  const handlePublish = async () => {
    setIsArticleDraft(false);
    formikRef.current?.handleSubmit();
    // const returniii = await formikRef.current?.validateForm();
    // logger(returniii, 'GOT VALIDATE');
    // const errors = await formikRef.current?.validateForm();
    // if (errors && Object.keys(errors).length === 0) {
    //   // Form is valid, do any success call
    //   setShowModal(true);

    //   // setShowModal(true);
    // } else {
    //   formikRef.current?.setTouched(
    //     setNestedObjectValues<FormikTouched<FormikValues>>(errors, true)
    //   );
    // }
  };
  const handleTransaction = async () => {
    setIsArticleSubmitting(true);
    setIsArticleDraft(false);
    let ledgerActor = await makeLedgerCanister({
      agentOptions: {
        identity,
      },
    });

    let acc: any = AccountIdentifier.fromPrincipal({
      principal: identity.getPrincipal(),
      // subAccount: identity.getPrincipal(),
    });

    let balance = await ledgerActor.account_balance({
      account: acc.bytes,
    });
    let replicaPrincipal = Principal.fromText(
      'ae25j-iwln7-esrn6-abfzr-p2plk-ow2pg-n2iuh-7ebfd-3drqw-m4cuq-zae'
    );
    let replicaAcc: any = AccountIdentifier.fromPrincipal({
      principal: replicaPrincipal,
      // subAccount: identity.getPrincipal(),
    });
    let transfer = await ledgerActor.transfer({
      to: replicaAcc.bytes,
      fee: { e8s: 10000 },
      memo: 1,
      amount: { e8s: promotionValues.icp * 100000000 },
      from_subaccount: [],
      created_at_time: [],
    });
    if (transfer.Ok) {
      formikRef?.current?.handleSubmit();
      logger({ balance, transfer });
      // setConfirmTransaction(false);
    } else if (transfer.Err) {
      if (transfer.Err.InsufficientFunds) {
        toast.error(`Insufficient funds, ${'s'}`);
      } else {
        toast.error(
          'An error occurred in the transaction please refresh the page and try again'
        );
      }
      setIsArticleSubmitting(false);
      setConfirmTransaction(false);
    }
    logger({ transfer }, 'DA transfer');
  };

  const getUser = async (res?: any) => {
    let tempUser = null;
    if (res) {
      tempUser = await res.get_user_details([]);
    } else {
      tempUser = await auth.actor.get_user_details([]);
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      updateImg(tempUser.ok[1].profileImg[0], true);
    }
  };
  useEffect(() => {
    if (auth.state === 'anonymous') {
      router.push('/');
    }
  }, [auth]);
  useEffect(() => {
    if (principal) getEntry();
  }, [principal]);
  React.useEffect(() => {
    if (auth.state === 'anonymous') {
      // setIsOwner(false);
      // setIdentity(null);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
      // getII();
    }
  }, [auth]);
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xxl='8' xl='8' lg='12' md='12'>
                <div className='pbg-pnl text-left'>
                  <Formik
                    initialValues={initialValues}
                    innerRef={formikRef}
                    enableReinitialize
                    validationSchema={articleSchema}
                    onSubmit={async (values, actions) => {
                      // uploadEntry(values);
                      // hello.greet(values.title).then((res) => {
                      //   logger('GET GREETED KID::::::', res);
                      // });

                      await uploadEntry(values, actions);
                    }}
                  >
                    {({ errors, touched, handleChange }) => (
                      <FormikForm
                        className='flex w-full flex-col items-center justify-center'
                        // onChange={(e) => handleImageChange(e)}
                      >
                        <Field name='title'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Label>Add Title</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='Enter title here'
                                autoComplete='off'
                                value={field.value}
                                onChange={(e) => {
                                  formikRef?.current?.setFieldValue(
                                    'seoTitle',
                                    e.target.value
                                  );
                                  formikRef?.current?.setFieldValue(
                                    'seoSlug',
                                    e.target.value
                                  );
                                  handleChange(e);
                                }}
                                name='title'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='title'
                            component='div'
                          />
                        </div>
                        <div className='full-div my-3'>
                          {/* <Image src={media} alt='Media' /> */}
                          <Editor
                            onEditorChange={(e) => {
                              setArticleContent(e);
                            }}
                            apiKey='b7qxcjq0278booyzwv8umu13oowd7bet1oxjydazlwgsj2rq'
                            key={editorKey}
                            onChange={(e) => {}}
                            value={articleContent}
                            // onEditorChange={}
                            init={() => ({
                              plugins:
                                'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
                              toolbar:
                                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                              tinycomments_mode: 'embedded',
                              tinycomments_author: 'Author name',
                              mergetags_list: [
                                { value: 'First.Name', title: 'First Name' },
                                { value: 'Email', title: 'Email' },
                              ],
                              ai_request: (request: any, respondWith: any) =>
                                respondWith.string(() =>
                                  Promise.reject(
                                    'See docs to implement AI Assistant'
                                  )
                                ),
                            })}
                            // initialValue={initialArticleContent}
                          />
                        </div>
                        <Field name='seoTitle'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlInput1'
                            >
                              <div className='flex-div-xs '>
                                <Form.Label>SEO Title</Form.Label>
                                <div className='smile-btns'>
                                  <Button className='grey-button gry'>
                                    <i className='fa fa-smile-o'></i>
                                  </Button>
                                  <Button className='grey-button gry ml-5'>
                                    Insert variable
                                  </Button>
                                </div>
                              </div>
                              <Form.Control
                                type='text'
                                placeholder='Title'
                                value={field.value}
                                onChange={handleChange}
                                name='seoTitle'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoTitle'
                            component='div'
                          />
                        </div>
                        <Field name='seoSlug'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlInput1'
                            >
                              <div className='flex-div-xs'>
                                <Form.Label>Slug</Form.Label>
                                <div className='smile-btns'>
                                  <Button className='grey-button gry'>
                                    <i className='fa fa-smile-o'></i>
                                  </Button>
                                  <Button className='grey-button gry ml-5'>
                                    Insert variable
                                  </Button>
                                </div>
                              </div>
                              <Form.Control
                                type='text'
                                placeholder=''
                                value={field.value}
                                onChange={handleChange}
                                name='seoSlug'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoSlug'
                            component='div'
                          />
                        </div>
                        <Field name='seoDescription'>
                          {({ field, formProps }: any) => (
                            <Form.Group className='mb-2'>
                              <Form.Label>Meta Description</Form.Label>
                              <Form.Control
                                className='small'
                                as='textarea'
                                rows={3}
                                value={field.value}
                                onChange={handleChange}
                                name='seoDescription'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoDescription'
                            component='div'
                          />
                        </div>
                        <Field name='seoExcerpt'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='exampleForm.ControlTextarea1'
                            >
                              <Form.Label>Excerpt</Form.Label>
                              <Form.Control
                                className='small'
                                as='textarea'
                                rows={3}
                                value={field.value}
                                onChange={handleChange}
                                name='seoExcerpt'
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='seoExcerpt'
                            component='div'
                          />
                        </div>

                        {/* <Button
                          type='submit'
                          className='flex w-1/6 justify-center'
                        >
                          Submits
                        </Button> */}
                        <ScrollToError />
                      </FormikForm>
                    )}
                  </Formik>
                </div>
              </Col>
              <Col xxl='4' xl='4' className='text-left'>
                <Accordion defaultActiveKey={'0'}>
                  <Accordion.Item eventKey='0'>
                    <Accordion.Header>
                      Publish
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up'></i>
                        </li>
                        <li>
                          <i className='fa fa-angle-down'></i>
                        </li>
                        <li>
                          <i className='fa fa-caret-up'></i>
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className='flex-div'>
                        <Button
                          className='grey-brdr-btn'
                          disabled={isDraftSubmitting || isArticleSubmitting}
                          onClick={saveDraft}
                        >
                          {isDraftSubmitting ? (
                            <Spinner size='sm' />
                          ) : (
                            'Save Draft '
                          )}
                        </Button>
                        <Button
                          className='grey-brdr-btn'
                          onClick={handleShowPreviewModal}
                        >
                          Preview
                        </Button>
                      </div>
                      <p>
                        Status:{' '}
                        <span>{articleStatus ? 'Published' : 'Draft'}</span>{' '}
                        {/* <Link >Edit</Link> */}
                        {/* <Button
                          onClick={() => setIsArticleDraft((prev) => !prev)}
                        >
                          Change
                        </Button> */}
                      </p>
                      {/* <p>
                        Visibility: <span>Public </span>{' '}
                        <Link href='#'>Edit</Link>
                      </p>
                      <p>
                        Publish <span>Immediately </span>{' '}
                        <Link href='#'>Edit</Link>
                      </p> */}
                    </Accordion.Body>
                  </Accordion.Item>
                  <div className='linkeee'>
                    <div className='flex-div'>
                      <Button className='red-link' onClick={clearPost}>
                        Move To Trash
                      </Button>
                      <Button
                        className='publish-btn'
                        disabled={isArticleSubmitting || isDraftSubmitting}
                        onClick={handlePublish}
                      >
                        {isArticleSubmitting ? (
                          <Spinner size='sm' />
                        ) : (
                          'Publish'
                        )}
                      </Button>
                    </div>
                  </div>
                </Accordion>
                <Accordion defaultActiveKey={'1'}>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>
                      Categories
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up'></i>
                        </li>
                        <li>
                          <i className='fa fa-angle-down'></i>
                        </li>
                        <li>
                          <i className='fa fa-caret-up'></i>
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Tabs
                        defaultActiveKey='AllCategories'
                        id='uncontrolled-tab-example'
                        className='category-tabs'
                      >
                        {[
                          {
                            eventKey: 'AllCategories',
                            title: 'All Categories',
                          },
                          {
                            eventKey: 'Mostused',
                            title: 'Most used',
                          },
                        ].map(({ eventKey, title }) => (
                          <Tab eventKey={eventKey} title={title}>
                            {categories.map((category, index) => (
                              <p
                                className={`category ${
                                  selectedCategory.includes(category)
                                    ? 'active'
                                    : ''
                                }`}
                                key={category}
                                onClick={() => {
                                  let tempCategories = [...selectedCategory]; // Create a copy to avoid mutating state directly

                                  if (tempCategories.includes(category)) {
                                    let filtered = tempCategories.filter(
                                      (item: string) => item !== category
                                    );
                                    setSelectedCategory(filtered);
                                  } else {
                                    tempCategories.push(category);
                                    setSelectedCategory(tempCategories);
                                  }
                                }}
                              >
                                {category}
                              </p>
                            ))}
                          </Tab>
                        ))}
                        {/* <Tab eventKey='Mostused' title='Most used'>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                        </Tab> */}
                      </Tabs>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Accordion defaultActiveKey={'2'}>
                  <Accordion.Item eventKey='2'>
                    <Accordion.Header>
                      Featured Image
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up'></i>
                        </li>
                        <li>
                          <i className='fa fa-angle-down'></i>
                        </li>
                        <li>
                          <i className='fa fa-caret-up'></i>
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      {(previewFile || draftPreviewImg) && (
                        <div
                          style={{
                            // height: '252px',
                            width: '250px',
                            // overflow: 'hidden',
                          }}
                        >
                          <Image
                            // fill={true}
                            // style={{ maxHeight: '200px', maxWidth: '200px' }}
                            width={250}
                            height={250}
                            // fill={true}
                            src={tempPreviewImg}
                            alt='Banner'
                          />
                        </div>
                      )}
                      <input
                        id='previewImg'
                        className='d-none'
                        onChange={handleImageChange}
                        name='bannerImg'
                        type='file'
                      />
                      <p>
                        <label htmlFor='previewImg'>
                          Select Featured Image
                        </label>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </div>
        </div>
      </main>
      <Modal show={showModal} centered onHide={handleModalClose}>
        <Modal.Body>
          {/* <div className='full-div'>
            <Button className='grey-btn'>
              <p>Plug Wallet</p>
              <Image src={Wallet} alt='Wallet' />
            </Button>
            <Link
              onClick={(e) => {
                e.preventDefault();
              }}
              href='/entriesn'
              className='grey-btn'
            >
              <p>Internet Identity</p>
              <Image src={Infinity} alt='Infinity' />
            </Link>
          </div> */}
          {confirmTransaction ? (
            <>
              <div className='flex-div connect-heading-pnl mb-3'>
                {/* <i className='fa fa-question-circle-o'></i> */}
                <p></p>
                <p className='text-bold h5 fw-bold m-0'>Confirm Transaction</p>
                <i
                  onClick={() => {
                    setConfirmTransaction(false);
                    // handleModalClose();
                  }}
                  className='fa fa-close'
                ></i>
                {/* <Button
                  className='close-btn'
                ></Button> */}
              </div>
              <div>
                <p className='text-center'>
                  Are you sure you want to promote your article for{' '}
                  {promotionValues.icp} ICP tokens ?
                </p>
              </div>
              <div className='d-flex justify-content-center'>
                <Button
                  className='publish-btn'
                  disabled={isArticleSubmitting || isDraftSubmitting}
                  onClick={handleTransaction}
                  // type='submit'
                >
                  {isArticleSubmitting ? <Spinner size='sm' /> : 'Confirm'}
                </Button>
              </div>
            </>
          ) : (
            <Formik
              initialValues={initialPromoteVales}
              // innerRef={formikRef}
              // enableReinitialize
              validationSchema={promotionSchema}
              onSubmit={async (values, actions) => {
                setPromotionValues({
                  icp: values.ICP,
                  // likes: values.likesCount,
                });

                setIsPromoted(true);
                logger(values, 'SAT VALUES');
                setConfirmTransaction(true);
                // formikRef.current?.handleSubmit();
                // await uploadEntry(values, actions);
              }}
            >
              {({ errors, touched, handleChange }) => (
                <FormikForm
                  className='flex w-full flex-col items-center justify-center'
                  // onChange={(e) => handleImageChange(e)}
                >
                  <Field name='icp'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Label>ICP</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Enter ICP Amount'
                          value={field.value}
                          onChange={handleChange}
                          name='ICP'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='ICP'
                      component='div'
                    />
                  </div>
                  {/* <Field name='likesCount'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2'
                      controlId='exampleForm.ControlInput1'
                    >
                      <Form.Label>Total likes reach count</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter ICP Amount'
                        value={field.value}
                        onChange={handleChange}
                        name='likesCount'
                      />
                    </Form.Group>
                  )}
                </Field>
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='likesCount'
                    component='div'
                  />
                </div> */}
                  <Button
                    className='publish-btn'
                    disabled={isArticleSubmitting || isDraftSubmitting}
                    // onClick={handlePublish}
                    type='submit'
                  >
                    {isArticleSubmitting ? <Spinner size='sm' /> : 'Publish'}
                  </Button>
                </FormikForm>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
      <Modal size='lg' show={showPreviewModal} onHide={handlePreviewModalClose}>
        <Modal.Body>
          <div className='article-detail-pnl'>
            <div className='top-img'>
              {/* <Image src={post1} alt='Post' /> */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  margin: '0 auto',
                  height: '400px',
                }}
              >
                <Image
                  src={tempPreviewImg ? tempPreviewImg : post1}
                  className='backend-img'
                  fill={true}
                  alt='Profileicon'
                />
              </div>
            </div>
            <div className='post-info-head'>
              <div className='user-inf-cntnr'>
                <Link href={`/`} onClick={(e) => e.preventDefault()}>
                  <div className='img-pnl'>
                    <div
                      style={{
                        position: 'relative',
                        width: '45px',
                        margin: '0 auto',
                        height: '45px',
                      }}
                    >
                      <Image
                        src={profileImg ?? girl}
                        className='backend-img'
                        fill={true}
                        alt='Profileicon'
                      />
                    </div>
                  </div>
                </Link>
                <div className='txt-pnl'>
                  <h6>
                    <Link href={`/`} onClick={(e) => e.preventDefault()}>
                      By {user?.name[0] ?? ''}{' '}
                    </Link>
                    {/* <Button>
                      <Image src={iconcap} alt='Cap' /> Expert
                    </Button> */}
                    {/* {entry?.isPromoted && (
                    <Button>
                      <Image src={iconcap} alt='Cap' /> Expert
                    </Button>
                  )} */}
                  </h6>
                  <p>
                    Content Felow of <b>NFTStudio24</b>
                  </p>
                  <span className='small'>
                    {' '}
                    {/* {user
                    ?  */}
                    {utcToLocal('', 'MMMM Do, YYYY, hh:mm A')}
                    {/* : 'Oct 19, 2023, 23:35'} */}
                  </span>
                </div>
              </div>
              <div className='count-description-pnl'>
                <div className='d-flex sm'>
                  {/* {auth.state === 'initialized' && (
                  <MintButton
                    isMinted={isMinted}
                    isMinting={isMinting}
                    mintNft={mintNft}
                    entry={entry}
                    commentsLength={userArticleComments.length}
                    tempLike={tempLike}
                  />
                )} */}
                  {/* <VoteButton
                  isLiked={isLiked}
                  isLiking={isLiking}
                  handleLikeEntry={handleLikeEntry}
                  entry={entry}
                  commentsLength={userArticleComments.length}
                  tempLike={tempLike}
                /> */}

                  <Link href='#' className='share-btn'>
                    Share <Image src={iconshare} alt='share' />
                  </Link>
                </div>
              </div>
            </div>

            <div className='text-detail-pnl'>
              <h3>{formikRef?.current?.values?.title ?? ''}</h3>
              {parse(articleContent ?? '')}
              <div className='spacer-20'></div>
            </div>
            <ul className='hash-list'>
              {selectedCategory.map((category: string) => (
                <li>
                  <span>#</span> {category}
                </li>
              )) ?? ''}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
