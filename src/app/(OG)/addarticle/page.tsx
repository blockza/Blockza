'use client';
import React, { useEffect, useRef, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import post1 from '@/assets/Img/placeholder-img.jpg';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';
import { useConnectPlugWalletStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import logger from '@/lib/logger';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  useFormikContext,
  FormikTouched,
  setNestedObjectValues,
} from 'formik';
import { Article } from '@/types/article';
import { number, object, string } from 'yup';
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
import Texteditor from '@/components/cutomeEditor/editor';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { E8S, GAS_FEE } from '@/constant/config';
import { BsMenuButton } from 'react-icons/bs';

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
  const [isPressRelease, setIsPressRelease] = useState(false);
  const [profileImg, setProfileImg] = useState<any>();
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [user, setUser] = useState<any>();
  const [value, setValue] = useState<any>('');
  const [draftArticleCreator, setDraftArticleCreator] = useState<any>();
  const [categories, setCategories] = useState<string[]>([
    'AI',
    'BlockChain',
    'Guide',
    'GameReview',
  ]);
  const [wannaPromote, setWannaPromote] = useState(false);
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

  let draftId = searchParams.get('draftId'); // Editor controlls
  const editor = useRef<any>();

  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  const defaultEntryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  let gasFee = GAS_FEE / E8S;

  const handleClose = () => {};
  const handleModalClose = () => {
    if (isArticleSubmitting || isDraftSubmitting) {
      return false;
    }
    setShowModal(false);
    setConfirmTransaction(false);
    setWannaPromote(false);
    setIsPromoted(false);
    setPromotionValues({
      icp: 0,
    });
  };
  const handlePreviewModalClose = () => {
    setShowPreviewModal(false);
  };
  const handleShowPreviewModal = () => {
    setShowPreviewModal(true);
  };
  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading,
    handleClose,
  });
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
      setIsPressRelease(tempEntry[0].pressRelease);
      setDraftPreviewImg(tempEntry[0].image);
      setDraftArticleCreator(tempEntry[0].user);
      setIsArticleDraft(true);

      // setEntry(tempEntry[0]);
      logger(tempEntry[0], 'Draft fetched from canister');
    }
  };
  async function getCategories() {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const categories = await entryActor.getCategories();
    setCategories(categories);
    logger(categories, 'CATTEEGG');
  }

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

  const handleImageChange = (e: any) => {
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
    const objectURL = URL.createObjectURL(img);
    const img2 = document.createElement('img');
    img2.onload = function handleLoad() {
      const targetAspectRatio = 9 / 4;

      // Calculate the actual aspect ratio of the uploaded image
      const actualAspectRatio = img2.width / img2.height;

      // Set a tolerance value for acceptable differences in aspect ratio
      const aspectRatioTolerance = 0.25; // You can adjust this value based on your needs

      // Check if the actual aspect ratio is within the acceptable range
      logger({ targetAspectRatio, actualAspectRatio }, 'key');
      if (
        actualAspectRatio < targetAspectRatio - aspectRatioTolerance ||
        actualAspectRatio > targetAspectRatio + aspectRatioTolerance
      ) {
        toast.error(
          'Please upload an image with a similar aspect ratio to 9 / 4 to avoid stretching.'
        );
      } else {
        setTempPreviewImg(imgUrl);
        setPreviewFile(img);
      }

      URL.revokeObjectURL(objectURL);
    };
    img2.src = objectURL;
    // setTempPreviewImg(imgUrl);
    // setPreviewFile(img);
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

  const uploadEntry = async (values: FormikValues) => {
    let previewArray = null;
    if (previewFile !== null) {
      previewArray = await fileToCanisterBinaryStoreFormat(previewFile);
    } else if (draftPreviewImg !== null) {
      previewArray = draftPreviewImg;
    } else {
      return toast.error('Please select a featured Image');
    }

    if (selectedCategory.length === 0) {
      return toast.error('Please select at least one  category');
    }
    if (isArticleDraft) {
      setIsDraftSubmitting(true);
    } else {
      setIsArticleSubmitting(true);
    }
    await methods.initAuth();

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let rewardConfig = await entryActor.get_reward();
    logger(rewardConfig);
    let reward = parseFloat(rewardConfig.master);
    let platform = parseFloat(rewardConfig.platform);
    let admin = parseFloat(rewardConfig.admin);

    let promotionE8S = promotionValues.icp * E8S;
    // TODO ADJUST THIS
    let gasInICP = gasFee * 5;
    let gasInE8S = gasInICP * E8S;
    let promotedICP = promotionE8S + gasInE8S;
    logger({ gasInE8S, promotedICP });
    // let promotedICP = (reward / 100) * (promotionValues.icp * E8S);

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
      isPromoted: false,
      userName: user.name[0],
      // promotionLikesTarget: promotionValues.likes,
      promotionICP: 0,
      pressRelease: isPressRelease,
    };
    if (isArticleDraft) {
    }
    let reviewMsg = confirmTransaction
      ? 'Your Promoted Article has been sent for review'
      : 'Your Article has been sent for review';
    if (draftId) {
      if (isArticleDraft) {
        article.isPromoted = false;
        article.promotionICP = 0;
      }
      entryActor
        .insertEntry(article, userCanisterId, true, draftId, commentCanisterId)
        .then((res: any) => {
          if (isArticleDraft) {
            article.isPromoted = false;
            article.promotionICP = 0;

            if (!confirmTransaction) toast.success('Draft Saved successfully');
          } else {
            logger(res, 'draft Published successfully');
            toast.success(reviewMsg);
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
        .insertEntry(article, userCanisterId, false, '', commentCanisterId)
        .then((res: any) => {
          logger(res, 'article Added successfully');
          draftId = res.ok[1];
          if (isArticleDraft) {
            if (!confirmTransaction) toast.success('Draft Saved successfully');
            setArticleStatus(false);
            router.replace(`/addarticle?draftId=${res.ok[1]}`);
          } else {
            toast.success(reviewMsg);
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
  const validateAndShowModal = async () => {
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
    const errors = await formikRef.current?.validateForm();
    if (errors && Object.keys(errors).length === 0) {
      // Form is valid, do any success call
      setShowModal(true);

      // setShowModal(true);
    } else {
      formikRef.current?.setTouched(
        setNestedObjectValues<FormikTouched<FormikValues>>(errors, true)
      );
    }
  };
  const handlePublish = async () => {
    setIsArticleDraft(false);
    formikRef.current?.handleSubmit();
    // const returniii = await formikRef.current?.validateForm();
    // logger(returniii, 'GOT VALIDATE');
  };
  const handleTransaction = async () => {
    try {
      setIsArticleSubmitting(true);
      setIsArticleDraft(true);

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
      logger(balance, 'weeeee');
      let rewardConfig = await defaultEntryActor.get_reward();
      logger(rewardConfig);
      let promotion = parseFloat(rewardConfig.master);
      let platform = parseFloat(rewardConfig.platform);
      let admin = parseFloat(rewardConfig.admin);
      let total = promotion + platform + admin;
      if (total !== 100) {
        setIsArticleSubmitting(false);
        setIsDraftSubmitting(false);
        handleModalClose();
        return toast.error('error during transaction');
      }
      // let promotedICP = (reward / 100) * promotionValues.icp;
      let promotionE8S = promotionValues.icp * E8S;
      let promotionICP = (promotion / 100) * promotionE8S;
      let platformICP = (platform / 100) * promotionE8S;
      let adminICP = (admin / 100) * promotionE8S;
      let balanceICP = parseInt(balance.e8s) / E8S;
      let gasInE8s = GAS_FEE;
      // TODO ADJUST THIS
      let gasInICP = gasFee * 5;
      let gasInE8S = gasInICP * E8S;
      let requiredICP = balanceICP + gasInICP;
      let approvingPromotionE8S = promotionE8S + gasInE8S;
      logger({ balance, balanceICP });
      if (balance.e8s < approvingPromotionE8S) {
        setIsArticleDraft(false);
        setConfirmTransaction(false);
        setIsArticleSubmitting(false);
        return toast.error(
          `Insufficient balance to promote. Current Balance: ${balanceICP}`
        );
      } else {
      }
      let masterPrincipal = Principal.fromText(
        process.env.NEXT_PUBLIC_MASTER_WALLET as string
      );
      let masterAcc: any = AccountIdentifier.fromPrincipal({
        principal: masterPrincipal,
        // subAccount: identity.getPrincipal(),
      });
      let platformPrincipal = Principal.fromText(
        process.env.NEXT_PUBLIC_PLATFORM_WALLET as string
      );
      let platformAcc: any = AccountIdentifier.fromPrincipal({
        principal: platformPrincipal,
        // subAccount: identity.getPrincipal(),
      });
      let adminPrincipal = Principal.fromText(
        process.env.NEXT_PUBLIC_ADMIN_WALLET as string
      );
      let adminAcc: any = AccountIdentifier.fromPrincipal({
        principal: adminPrincipal,
        // subAccount: identity.getPrincipal(),
      });
      if (!entryCanisterId) return toast.error('Error in transaction');
      let entryPrincipal = Principal.fromText(entryCanisterId);
      let approval = await ledgerActor.icrc2_approve({
        amount: approvingPromotionE8S,
        spender: {
          owner: entryPrincipal,
          subaccount: [],
        },
        fee: [GAS_FEE],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      });
      if (approval.Ok) {
        setIsArticleDraft(false);
        setTimeout(() => {
          formikRef?.current?.handleSubmit();
        }, 100);
      }
      logger(approval, 'APPPPPROVEEEE');
      setIsArticleSubmitting(false);
      setIsArticleDraft(false);
      // ledgerActor
      //   .transfer({
      //     to: masterAcc.bytes,
      //     fee: { e8s: gasInE8s },
      //     memo: 1,
      //     amount: { e8s: promotionICP },
      //     from_subaccount: [],
      //     created_at_time: [],
      //   })
      //   .then(async (res: any) => {
      //     ledgerActor
      //       .transfer({
      //         to: platformAcc.bytes,
      //         fee: { e8s: gasInE8s },
      //         memo: 1,
      //         amount: { e8s: platformICP },
      //         from_subaccount: [],
      //         created_at_time: [],
      //       })
      //       .then(async (res: any) => {
      //         let transfer = await ledgerActor.transfer({
      //           to: adminAcc.bytes,
      //           fee: { e8s: gasInE8s },
      //           memo: 1,
      //           amount: { e8s: adminICP },
      //           from_subaccount: [],
      //           created_at_time: [],
      //         });
      //         if (transfer.Ok) {
      //           setIsArticleDraft(false);
      //           setTimeout(() => {
      //             formikRef?.current?.handleSubmit();
      //           }, 100);
      //           logger({ balance, transfer });
      //           // setConfirmTransaction(false);
      //         } else if (transfer.Err) {
      //           if (transfer.Err.InsufficientFunds) {
      //             toast.error(`Insufficient funds.`);
      //           } else {
      //             toast.error(
      //               'An error occurred in the transaction please refresh the page and try again'
      //             );
      //           }
      //           setIsArticleSubmitting(false);
      //           setConfirmTransaction(false);
      //         }
      //         logger({ transfer }, 'DA transfer');
      //       });
      //   });
    } catch (e) {
      console.error(e);
      setIsArticleSubmitting(false);
      setIsArticleDraft(false);
    }
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
  // editor config

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
  useEffect(() => {
    if (auth.state == 'initialized' && identity) {
      getCategories();
    }
  }, [auth, identity]);

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

                      await uploadEntry(values);
                    }}
                  >
                    {({ errors, touched, handleChange, handleBlur }) => (
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
                                onInput={handleBlur}
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
                          <Texteditor
                            initialValue={articleContent}
                            value={articleContent}
                            onChangefn={setArticleContent}
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
                                onInput={handleBlur}
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
                                onInput={handleBlur}
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
                                onInput={handleBlur}
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
                                onInput={handleBlur}
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
                  <div className='linkeee p-0'>
                    <div
                      className='d-flex mb-3'
                      style={{
                        borderBottom: '2px solid #e9e9e9',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          marginBottom: 5,
                          paddingInline: 10,
                          paddingTop: 10,
                        }}
                      >
                        Creation Type
                      </p>
                    </div>
                    <div className='d-flex justify-content-center my-2 gap-3'>
                      <Button
                        className={`default-btn  ${
                          isPressRelease ? '' : 'active'
                        }`}
                        disabled={isDraftSubmitting || isArticleSubmitting}
                        onClick={() => setIsPressRelease(false)}
                      >
                        Article
                      </Button>
                      <Button
                        className={`default-btn  ${
                          isPressRelease ? 'active' : ''
                        }`}
                        disabled={isDraftSubmitting || isArticleSubmitting}
                        onClick={() => setIsPressRelease(true)}
                      >
                        Press Release
                      </Button>
                    </div>
                    <div className='flex-div p-2'>
                      <Button
                        className={`red-link  ${
                          isDraftSubmitting || isArticleSubmitting
                            ? 'disabledBtn'
                            : ''
                        }`}
                        disabled={isDraftSubmitting || isArticleSubmitting}
                        onClick={clearPost}
                      >
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
                        ].map(({ eventKey, title }, index) => (
                          <Tab eventKey={eventKey} title={title} key={index}>
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
              {selectedCategory.map((category: string, index: number) => (
                <li key={index}>
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
// {/* <Modal show={showModal} centered onHide={handleModalClose}>
// <Modal.Body>
//   {/* <div className='full-div'>
//     <Button className='grey-btn'>
//       <p>Plug Wallet</p>
//       <Image src={Wallet} alt='Wallet' />
//     </Button>
//     <Link
//       onClick={(e) => {
//         e.preventDefault();
//       }}
//       href='/entriesn'
//       className='grey-btn'
//     >
//       <p>Internet Identity</p>
//       <Image src={Infinity} alt='Infinity' />
//     </Link>
//   </div> */}
//   {!wannaPromote ? (
//     <>
//       <div className='flex-div connect-heading-pnl mb-3'>
//         {/* <i className='fa fa-question-circle-o'></i> */}
//         <p></p>
//         <p className='text-bold h5 fw-bold m-0'>Promote Article</p>
//         <i
//           style={{
//             cursor: 'pointer',
//           }}
//           onClick={handleModalClose}
//           className='fa fa-close'
//         ></i>
//         {/* <Button
//         className='close-btn'
//       ></Button> */}
//       </div>
//       <div>
//         <p className='text-center'>
//           Do you want to promote your article?
//         </p>
//       </div>
//       <div className='d-flex justify-content-center gap-3'>
//         <Button
//           className='default-btn'
//           disabled={isArticleSubmitting || isDraftSubmitting}
//           onClick={() => {
//             handleModalClose();
//             handlePublish();
//           }}
//           // type='submit'
//         >
//           Promote Later
//         </Button>
//         <Button
//           className='publish-btn'
//           disabled={isArticleSubmitting || isDraftSubmitting}
//           onClick={() => {
//             setWannaPromote(true);
//           }}
//           // type='submit'
//         >
//           {/* {isArticleSubmitting ? <Spinner size='sm' /> : 'Yes'} */}
//           Promote Now
//         </Button>
//       </div>
//     </>
//   ) : confirmTransaction ? (
//     <>
//       <div className='flex-div connect-heading-pnl mb-3'>
//         {/* <i className='fa fa-question-circle-o'></i> */}
//         <p></p>
//         <p className='text-bold h5 fw-bold m-0'>Confirm Transaction</p>
//         {/* <i onClick={handleModalClose} className='fa fa-close'></i> */}
//         <i
//           style={{
//             cursor: 'pointer',
//           }}
//           onClick={handleModalClose}
//           className='fa fa-close'
//         ></i>
//         {/* <Button
//           className='close-btn'
//         ></Button> */}
//       </div>
//       <div>
//         <p className='text-center'>
//           Are you sure you want to promote your article for{' '}
//           {promotionValues.icp + gasFee * 5} ICP tokens ?
//         </p>
//         <p className='text-secondary mb-0'>
//           Transaction fee: {gasFee * 5} ICP
//         </p>
//         <p className='text-secondary mb-1'>
//           <span
//             style={{
//               border: '2px',
//             }}
//           >
//             Promotion amount: {promotionValues.icp} ICP
//           </span>
//         </p>
//         <div
//           style={{
//             height: 1,
//             backgroundColor: 'gray',
//             width: '40%',
//           }}
//         ></div>
//         <p className='text-secondary mt-1 mb-0'>
//           Total: {promotionValues.icp + gasFee * 5} ICP
//         </p>
//       </div>
//       <div className='d-flex justify-content-center'>
//         <Button
//           className='publish-btn'
//           disabled={isArticleSubmitting || isDraftSubmitting}
//           onClick={handleTransaction}
//           // type='submit'
//         >
//           {isArticleSubmitting ? <Spinner size='sm' /> : 'Confirm'}
//         </Button>
//       </div>
//     </>
//   ) : (
//     <Formik
//       initialValues={initialPromoteVales}
//       // innerRef={formikRef}
//       // enableReinitialize
//       validationSchema={promotionSchema}
//       onSubmit={async (values, actions) => {
//         setPromotionValues({
//           icp: values.ICP,
//           // likes: values.likesCount,
//         });

//         setIsPromoted(true);
//         logger(values, 'SAT VALUES');
//         setConfirmTransaction(true);
//         // formikRef.current?.handleSubmit();
//         // await uploadEntry(values, actions);
//       }}
//     >
//       {({ errors, touched, handleChange }) => (
//         <FormikForm
//           className='flex w-full flex-col items-center justify-center'
//           // onChange={(e) => handleImageChange(e)}
//         >
//           <Field name='icp'>
//             {({ field, formProps }: any) => (
//               <Form.Group
//                 className='mb-2'
//                 controlId='exampleForm.ControlInput1'
//               >
//                 <div className='d-flex justify-content-between w-100'>
//                   <Form.Label>ICP</Form.Label>
//                   <i
//                     style={{
//                       cursor: 'pointer',
//                     }}
//                     onClick={handleModalClose}
//                     className='fa fa-close'
//                   ></i>
//                 </div>

//                 <Form.Control
//                   type='number'
//                   placeholder='Enter ICP Amount'
//                   value={field.value}
//                   onChange={handleChange}
//                   name='ICP'
//                 />
//               </Form.Group>
//             )}
//           </Field>
//           <div className='text-danger mb-2'>
//             <ErrorMessage
//               className='Mui-err'
//               name='ICP'
//               component='div'
//             />
//           </div>
//           {/* <Field name='likesCount'>
//           {({ field, formProps }: any) => (
//             <Form.Group
//               className='mb-2'
//               controlId='exampleForm.ControlInput1'
//             >
//               <Form.Label>Total likes reach count</Form.Label>
//               <Form.Control
//                 type='number'
//                 placeholder='Enter ICP Amount'
//                 value={field.value}
//                 onChange={handleChange}
//                 name='likesCount'
//               />
//             </Form.Group>
//           )}
//         </Field>
//         <div className='text-danger mb-2'>
//           <ErrorMessage
//             className='Mui-err'
//             name='likesCount'
//             component='div'
//           />
//         </div> */}
//           <Button
//             className='publish-btn'
//             disabled={isArticleSubmitting || isDraftSubmitting}
//             type='submit'
//           >
//             {isArticleSubmitting ? <Spinner size='sm' /> : 'Publish'}
//           </Button>
//         </FormikForm>
//       )}
//     </Formik>
//   )}
// </Modal.Body>
// </Modal>
