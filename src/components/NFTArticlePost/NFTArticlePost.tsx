import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import post1 from '@/assets/Img/Posts/Post-17.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import infinity from '@/assets/Img/Icons/icon-infinite.png';
import icpimage from '@/assets/Img/coin-image.png';
import iconcomment from '@/assets/Img/Icons/icon-comment.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconshare from '@/assets/Img/Icons/icon-share.png';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import logger from '@/lib/logger';
import parse from 'html-react-parser';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import girl from '@/assets/Img/user-img.png';

import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  useFormikContext,
  FormikTouched,
  setNestedObjectValues,
} from 'formik';
import {
  makeCommentActor,
  makeDIP721Canister,
  makeEntryActor,
  makeLedgerCanister,
} from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { toast } from 'react-toastify';
import { getImage } from '@/components/utils/getImage';
import Tippy from '@tippyjs/react';
import ArticleComments from '@/components/ArticleComments/ArticleComments';
import { E8S, GAS_FEE } from '@/constant/config';
import { number, object } from 'yup';
import { Principal } from '@dfinity/principal';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { usePathname, useRouter } from 'next/navigation';
import PromotedSVG from '@/components/PromotedSvg/Promoted';
import updateReward from '@/components/utils/updateReward';
import updateBalance from '@/components/utils/updateBalance';

function VoteButton({
  isLiking,
  isLiked,
  handleLikeEntry,
  entry,
  commentsLength,
  tempLike,
}: {
  isLiking: boolean;
  isLiked: boolean;
  handleLikeEntry: () => void;
  entry: any;
  commentsLength: number;
  tempLike: number;
}) {
  const likeEntryMiddleWare = () => {
    if (entry.isPromoted && isLiked) return;
    handleLikeEntry();
    // setToggleLiked((prev) => !prev);
  };
  const disabled = isLiking || (entry.isPromoted && isLiked);

  return (
    <>
      {/* <ul className='vote-comment-list'> */}
      {/* <li
      > */}
      <h6
        className={` ${disabled ? 'disabled' : ''}  ${isLiked ? ' liked' : ''}`}
        onClick={likeEntryMiddleWare}
        style={{
          pointerEvents: disabled ? 'none' : 'all',
          marginTop: 7,
          cursor: 'pointer',
        }}
      >
        {isLiked ? (
          <Image
            src={'/images/liked.svg'}
            alt='Icon Thumb'
            style={{ maxWidth: 25 }}
            height={25}
            width={25}
          />
        ) : (
          // <i className='fa fa-like'></i>
          // <i
          //   className='fa-solid  fa-thumbs-up my-fa'
          //   style={{ fontSize: 20, height: 25, width: 25, maxWidth: 25 }}
          // ></i>
          <Image
            src={'/images/like.svg'}
            alt='Icon Thumb'
            style={{ maxWidth: 25 }}
            height={25}
            width={25}
          />
          // <i
          //   className='fa-regular  fa-thumbs-up  my-fa'
          //   style={{ fontSize: 20, height: 25, width: 25, maxWidth: 25 }}
          // ></i>
        )}{' '}
        {parseInt(entry?.likes ?? '0') + tempLike}
      </h6>
      {/* </li> */}
      {/* </ul> */}
      <h6>
        <Image
          src={iconcomment}
          alt='Comment'
          style={{ height: 25, width: 25, maxWidth: 25 }}
        />{' '}
        {commentsLength ?? ''} Comments
      </h6>
    </>
  );
}

function MintButton({
  isMinting,
  isMinted,
  mintNft,
  entry,
  commentsLength,
  tempLike,
}: {
  isMinting: boolean;
  isMinted: boolean;
  mintNft: () => void;
  entry: any;
  commentsLength: number;
  tempLike: number;
}) {
  return (
    <>
      <ul className='vote-comment-list'>
        <Button
          onClick={mintNft}
          disabled={isMinted || isMinting}
          className='blue-button'
        >
          {isMinting ? (
            <Spinner size='sm'></Spinner>
          ) : isMinted ? (
            'Minted'
          ) : (
            'Mint'
          )}
        </Button>
      </ul>
    </>
  );
}

export default function NFTArticlePost({
  article,
  likeEntry,
}: {
  article: any;
  likeEntry: () => Promise<unknown>;
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [tempLike, setTempLike] = useState(0);
  const [articleComments, setArticleComments] = useState([]);
  const [userArticleComments, setUserArticleComments] = useState<any>([]);
  const [loadmorecomments, setloadMoreComments] = useState<any>([]);
  const [countcomments, setcountcomments] = useState<number>(2);
  const [isArticleSubmitting, setIsArticleSubmitting] = useState(false);
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [promotionValues, setPromotionValues] = useState({
    icp: 0,
    // likes: 0,
  });
  const [userArticleCommentsLoading, setUserArticleCommentsLoading] =
    useState<boolean>(true);
  let gasFee = GAS_FEE / E8S;

  const { entry, user, userImg, featuredImage, userId, articleId, getEntry } =
    article;
  logger(entry, 'ENTRY THAT WE GOT');

  const { auth, setAuth, identity, principal, setReward, setBalance } =
    useConnectPlugWalletStore((state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
      setReward: state.setReward,
      setBalance: state.setBalance,
    }));
  const statusString = Object.keys(entry.status)[0];
  const isPending = statusString == 'pending';
  const isRejected = statusString == 'rejected';
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const initialPromoteVales = {
    ICP: 0,
  };
  const promotionSchema = object().shape({
    ICP: number().min(1, 'ICP cannot be less than 1'),
  });
  const router = useRouter();
  const handleShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    if (isArticleSubmitting) {
      return false;
    }
    setShowModal(false);
    setConfirmTransaction(false);
    setPromotionValues({
      icp: 0,
    });
  };

  const isConnected = () => {
    if (auth.state === 'anonymous') {
      toast.error(
        'To perform this action, kindly connect to Internet Identity.',
        {}
      );
      return false;
    }
    return true;
  };
  const handleLikeEntry = async () => {
    if (!isConnected()) return;

    setIsLiking(true);
    setIsLiked((prev) => {
      if (prev) {
        setTempLike(-1);
      } else {
        setTempLike(1);
      }
      return !prev;
    });

    likeEntry()
      .then((res: any) => {
        logger('tried to start update');
        updateReward({ identity, auth, setReward });
        if (res[1]) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
        setIsLiking(false);
        setTempLike(0);
      })
      .catch(() => {
        setTempLike(0);
        setIsLiking(false);
      });
    // logger(result, 'LIKED THE DAMN ENTRY ');
  };
  const getComments = async () => {
    const commentsActor = makeCommentActor({
      agentOptions: {
        identity,
      },
    });
    const comments = await commentsActor.getComments(articleId);
    if (comments.ok) {
      setArticleComments(comments.ok[0]);
      logger({ Comment: comments.ok[0], identity }, 'THEM DOMMENTS');
    }
    setUserArticleCommentsLoading(false);
    if (userArticleComments.length > 10) {
      setloadMoreComments(userArticleComments.slice(0, 10));
    } else {
      setloadMoreComments(userArticleComments);
    }
  };
  const handleCommented = () => {
    setIsCommenting(false);
    setCurrentComment('');
  };

  const mintNft = async () => {
    if (!isConnected()) return;
    setIsMinting(true);
    const DIP721Actor = makeDIP721Canister({
      agentOptions: {
        identity,
      },
    });

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let metadata = {
      purpose: {
        Rendered: null,
      },
      key_val_data: [
        {
          key: 'name',
          val: {
            TextContent: entry.title,
          },
        },
        {
          key: 'contentType',
          val: {
            TextContent: entry.description,
          },
        },
        {
          key: 'locationType',
          val: {
            TextContent: articleId,
          },
        },
        {
          key: 'location',
          val: {
            TextContent:
              'blob:http://localhost:3000/fced82b4-377a-444a-a46b-2f9f96f6e9fd',
          },
        },
      ],
      data: [],
    };
    //console.log(await nftCanister.getMetadataDip721(receipt.Ok.token_id))
    // await window.ic.plug.agent.fetchRootKey()

    // let p = Principal.fromUint8Array(principal_id._arr)
    let receipt = await DIP721Actor.mintDip721(identity._principal, [metadata]);
    try {
      if (receipt.Ok) {
        let newNft = await DIP721Actor.getMetadataDip721(receipt.Ok.token_id);
        let minted = await entryActor.mintEntry(articleId, userCanisterId);
        setIsMinting(false);
        setIsMinted(true);
        logger(minted);
      } else if (receipt.Err) {
        setIsMinting(false);

        toast.error(
          'Sorry, there was an error while minting please reload the page and try again'
        );
      }
    } catch (error) {
      setIsMinting(false);
    }
  };
  const handleIsMinted = async () => {
    setIsMinting(true);
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let minted = await entryActor.mintEntry(articleId, userCanisterId);
    setIsMinting(false);
    setIsMinted(true);
  };
  const addComment = async () => {
    try {
      if (!isConnected()) return;

      setIsCommenting(true);
      const commentsActor = makeCommentActor({
        agentOptions: {
          identity,
        },
      });
      const addedComment = await commentsActor.addComment(
        currentComment,
        userCanisterId,
        articleId
      );
      const user = await auth.actor.get_user_details([principal]);
      // const dateNow = moment.utc().format('MMMM Do, YYYY');
      const newComment = {
        creation_time: utcToLocal('', 'MMMM Do, YYYY, HH:mm'),
        user: user.ok[1],
        content: currentComment,
        userId: principal,
      };
      setUserArticleComments((prev: any) => {
        return [newComment, ...prev];
      });

      logger(addedComment, 'Domment added');
      handleCommented();
    } catch (err) {
      logger(err, 'ERR');
      handleCommented();
    }
  };
  const getUserComments = async () => {
    const tempComments = await Promise.all(
      articleComments.reverse().map(async (comment: any) => {
        const userId = comment?.user.toString();
        const user = await auth.actor.get_user_details([userId]);
        const newComment = {
          creation_time: utcToLocal(
            comment.creation_time.toString(),
            'MMMM Do, YYYY, HH:mm'
          ),
          user: user.ok[1],
          userId: userId,
          content: comment.content,
        };
        return newComment;
      })
    );
    return tempComments;
  };
  // loadmore comments
  let loadMoreComments = () => {
    if (userArticleComments.length >= loadmorecomments.length) {
      setloadMoreComments(userArticleComments.slice(0, 10 * countcomments));
      setcountcomments((pre: any) => pre + 1);
    } else {
      toast.error('All comments has been loaded.');
    }
  };

  const handlePromote = async () => {
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
    // let gasInICP = gasFee * 5;
    // let gasInE8S = gasInICP * E8S;
    // let promotedICP = promotionE8S + gasInE8S;
    logger({ promotionE8S });
    // let promotedICP = (reward / 100) * (promotionValues.icp * E8S);

    const article = {
      title: entry.title,
      description: entry.description,
      seoTitle: entry.seoTitle,
      seoSlug: entry.seoSlug,
      seoDescription: entry.seoDescription,
      seoExcerpt: entry.seoExcerpt,
      category: entry.category,
      subscription: entry.subscription,
      image: entry.image,
      isDraft: entry.isDraft,
      isPromoted: true,
      userName: entry.userName,
      imageTags: entry.imageTags,
      caption: entry.caption,
      tags: entry.tags,
      // promotionLikesTarget: promotionentry.likes,
      promotionICP: promotionE8S,
      pressRelease: entry.pressRelease,
    };
    entryActor
      .insertEntry(article, userCanisterId, true, articleId, commentCanisterId)
      .then((res: any) => {
        logger(res, 'draft Published successfully');
        toast.success('Your article has been promoted successfuly');
        updateBalance({ identity, auth, setBalance });
        setIsArticleSubmitting(false);
        getEntry();
        handleModalClose();
        // router.replace(`/article?articleId=${res.ok[1]}&promote=true`);

        // setIsArticleSubmitting(false);

        window.scrollTo(0, 0);
      })
      .catch((err: string) => {
        logger(err);
        // setIsArticleSubmitting(false);

        setIsArticleSubmitting(false);
      });
  };
  const handleTransaction = async () => {
    try {
      setIsArticleSubmitting(true);
      const defaultEntryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
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
      let gasInICP = gasFee * 2 + gasFee / 5;
      let gasInE8S = gasInICP * E8S;
      let requiredICP = balanceICP + gasInICP;
      let approvingPromotionE8S = promotionE8S + gasInE8S;
      logger({ balance, balanceICP });
      if (balance.e8s < approvingPromotionE8S) {
        setConfirmTransaction(false);
        setIsArticleSubmitting(false);
        return toast.error(
          `Insufficient balance to promote. Current Balance: ${balanceICP}`
        );
      } else {
      }

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
        setTimeout(() => {
          handlePromote();
        }, 100);
      }
      logger(approval, 'APPPPPROVEEEE');
    } catch (e) {
      console.error(e);
      setIsArticleSubmitting(false);
    }
  };

  useEffect(() => {
    if (entry?.likedUsers && identity && entry?.minters) {
      setIsMinted(false);

      const likedarray: any = [];
      entry?.likedUsers.map((likedUser: any) => {
        const likedUserText = likedUser.toString();
        likedarray.push(likedUserText);

        if (likedUserText === identity._principal.toString()) {
          setIsLiked(true);
        }
      });
      const mintersArray: any = [];
      entry?.minters.map((minter: any) => {
        const minterUserText = minter.toString();
        mintersArray.push(minterUserText);
        if (minterUserText === identity._principal.toString()) {
          setIsMinted(true);
        }
      });
    }
  }, [entry, identity, auth]);
  useEffect(() => {
    if (auth.client) {
      getComments();
    }
  }, [auth]);

  useEffect(() => {
    if (articleComments.length > 0) {
      const tempFun = async () => {
        const newComments = await getUserComments();
        setUserArticleComments(newComments);
        logger(newComments, 'WE GOT THEM COMMENTS');
      };
      setUserArticleCommentsLoading(false);

      tempFun();
    }
  }, [articleComments]);
  useEffect(() => {
    if (userArticleComments.length > 10) {
      setloadMoreComments(userArticleComments.slice(0, 10));
    } else {
      setloadMoreComments(userArticleComments);
    }
  }, [userArticleComments]);
  // copy atrical link to  share
  let copyArticleLink = (e: any) => {
    e.preventDefault();
    const currentURL = window.location.href;
    window.navigator.clipboard.writeText(currentURL);
    toast.success('URL copied to clipboard');
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const routeValue = urlParams.get('route');
    if (routeValue == 'comments' && !userArticleCommentsLoading && entry) {
      const scrollOptions: any = {
        behavior: 'smooth',
      };

      if (window.innerWidth >= 768) {
        // Scroll to 200px from the top on laptops
        scrollOptions.top = 1400;
      } else {
        // Scroll to 400px from the top on mobile devices
        scrollOptions.top = 1600;
      }

      window.scrollTo(scrollOptions);
    }
  }, [userArticleCommentsLoading, entry]);
  return (
    <>
      <div className='article-detail-pnl '>
        {entry ? (
          <>
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
                {(isPending || isRejected) && (
                  <div className='status-tip'>
                    <Tippy
                      content={
                        <div>
                          <p className='m-0'>
                            {isPending && 'Your Article will be reviewed soon'}
                            {isRejected &&
                              'Your Article Review has been rejected'}
                          </p>
                        </div>
                      }
                    >
                      <p className={`${statusString} status`}>{statusString}</p>
                    </Tippy>
                  </div>
                )}
                {entry?.isPromoted && (
                  <div className='promotedlable'>
                    <PromotedSVG />
                    {/* <Image
                      src={promotedIcon2}
                      alt='promoted icon'
                      height={25}
                      width={25}
                      className='me-2 '
                    />{' '} */}
                    <p className='mb-0' style={{ fontWeight: '600' }}>
                      Promoted Article
                    </p>
                  </div>
                )}

                <Image
                  src={featuredImage ? featuredImage : post1}
                  className='backend-img'
                  fill={true}
                  alt='Profileicon'
                />
              </div>
            </div>
            <div className='post-info-head'>
              <div className='user-inf-cntnr'>
                <Link href={`/profile?userId=${userId}`}>
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
                        src={userImg ? userImg : girl}
                        className='backend-img'
                        fill={true}
                        alt='Profileicon'
                      />
                    </div>
                  </div>
                </Link>
                <div className='txt-pnl'>
                  <h6>
                    <Link href={`/profile?userId=${userId}`}>
                      By {user?.name[0] ?? ''}{' '}
                    </Link>
                    {/* <Button>
                      <Image src={iconcap} alt='Cap' /> Expert
                    </Button> */}
                    {entry?.isPromoted && (
                      <Button>
                        <Image src={iconcap} alt='Cap' /> Expert
                      </Button>
                    )}
                  </h6>
                  <p>
                    {/* Content Felow of <b>NFTStudio24</b> */}
                    {user?.designation[0] ?? ''}
                  </p>
                  <span className='small'>
                    {' '}
                    {user
                      ? utcToLocal(
                          entry.creation_time.toString(),
                          'MMMM Do, YYYY, HH:mm '
                        )
                      : 'Oct 19, 2023, 23:35'}
                  </span>
                </div>
              </div>
              <div className='count-description-pnl'>
                {!(statusString == 'pending' || statusString == 'rejected') && (
                  <div className='d-flex sm gap-3' id='articlecls1'>
                    {auth.state === 'initialized' && (
                      <MintButton
                        isMinted={isMinted}
                        isMinting={isMinting}
                        mintNft={mintNft}
                        entry={entry}
                        commentsLength={userArticleComments.length}
                        tempLike={tempLike}
                      />
                    )}
                    <VoteButton
                      isLiked={isLiked}
                      isLiking={isLiking}
                      handleLikeEntry={handleLikeEntry}
                      entry={entry}
                      commentsLength={userArticleComments.length}
                      tempLike={tempLike}
                    />

                    <h6
                      style={{
                        marginTop: 7,
                      }}
                      onClick={copyArticleLink}
                    >
                      <Image
                        src={iconshare}
                        alt='share'
                        style={{ height: 25, width: 25, maxWidth: 25 }}
                      />{' '}
                      Share
                    </h6>
                  </div>
                )}
              </div>
            </div>

            <div className='text-detail-pnl'>
              <div
                style={{ maxHeight: '70vh', overflowY: 'auto' }}
                id='articalPrev'
              >
                <h3>{entry?.title ?? ''}</h3>
                {parse(entry?.description ?? '')}
                <div className='spacer-20 '></div>
              </div>

              <ul className='hash-list'>
                {entry?.category.map((category: string, index: number) => (
                  <li key={index}>
                    <span>#</span> {category}
                  </li>
                )) ?? ''}
              </ul>
              <div className='count-top'></div>

              {!(isPending || isRejected) && (
                <>
                  <div className='count-description-pnl'>
                    <div className='d-flex gap-3'>
                      <VoteButton
                        isLiked={isLiked}
                        isLiking={isLiking}
                        handleLikeEntry={handleLikeEntry}
                        entry={entry}
                        commentsLength={userArticleComments?.length}
                        tempLike={tempLike}
                      />
                    </div>
                    {/* <div>
                      <ul className='quiz-list'>
                        <li>
                          <Image src={icpimage} alt='icpimage' />{' '}
                          <span>+500 ICP</span>
                        </li>
                        <li>
                          Take Quiz <i className='fa fa-angle-right'></i>
                        </li>
                      </ul>
                    </div> */}
                    {!entry.isPromoted &&
                      !entry.pressRelease &&
                      identity &&
                      identity._principal.toString() === userId && (
                        <div>
                          <Button className='publish-btn' onClick={handleShow}>
                            Promote Article
                          </Button>
                        </div>
                      )}
                  </div>
                  {/* Count Description Panel */}
                  {/* Comment Panel */}
                  <div className='full-div comment-pnl'>
                    <div className='flex-div'>
                      <h4>Leave a comment</h4>
                      <h6>{currentComment.length}/400</h6>
                    </div>
                    <textarea
                      className='form-control'
                      id='comment'
                      placeholder='What do you think about this article?'
                      maxLength={400}
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                    />
                    {/* <p className='text-danger'>
                {currentComment.length === 400 && 'What the fu** do you want'}
              </p> */}
                    <div className='text-right'>
                      <Button
                        // className='grey-button'
                        disabled={
                          isCommenting || currentComment.trim().length === 0
                        }
                        onClick={addComment}
                      >
                        {isCommenting ? (
                          // <div className='loader-container'>
                          <Spinner size='sm' />
                        ) : (
                          // </div>
                          'Add Comment'
                        )}
                      </Button>
                    </div>
                    {userArticleCommentsLoading ? (
                      <div className='d-flex justify-content-center'>
                        {' '}
                        <Spinner animation='border' variant='primary' />
                      </div>
                    ) : (
                      <ArticleComments
                        userArticleComments={loadmorecomments}
                        totalcomment={userArticleComments}
                      />
                    )}
                    {userArticleComments.length >= 10 && (
                      <div className='txt-center mt-2'>
                        <Button
                          className='grey-button loadmore'
                          onClick={loadMoreComments}
                          disabled={
                            userArticleComments.length <=
                            loadmorecomments.length
                              ? true
                              : false
                          }
                        >
                          Load more comments
                        </Button>
                      </div>
                    )}
                  </div>{' '}
                </>
              )}
            </div>
          </>
        ) : (
          <div className='d-flex justify-content-center my-4'>
            <Spinner
              animation='border'
              variant='secondary'
              // size='sm'
              // style={{
              //   width: '1.5rem',
              //   height: '1.5rem',
              //   borderWidth: '0.3rem',
              // }}
              // className='spinner-black'
            />
          </div>
        )}
      </div>
      <div id='comments'></div>

      <Modal show={showModal} centered onHide={handleModalClose}>
        <Modal.Body>
          {confirmTransaction ? (
            <>
              <div className='flex-div connect-heading-pnl mb-3'>
                {/* <i className='fa fa-question-circle-o'></i> */}
                <p></p>
                <p className='text-bold h5 fw-bold m-0'>Confirm Transaction</p>
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
                <p className='text-secondary'>
                  Are you sure you want to promote your article for{' '}
                  {(promotionValues.icp + gasFee * 2 + gasFee / 5).toFixed(6)} ICP tokens ?
                </p>
                <p className=' d-flex  justify-content-between mb-0'>
                  <span>Transaction fee:</span>{' '}
                  <span className='text-secondary'>
                    {gasFee * 2 + gasFee / 5} ICP
                  </span>
                </p>
                <p className='d-flex justify-content-between mb-1'>
                  {/* <span
                    style={{
                      border: '2px',
                    }}
                  > */}
                  <span>Promotion amount:</span>{' '}
                  <span className='text-secondary'>
                    {promotionValues.icp} ICP
                  </span>
                  {/* </span> */}
                </p>
                <div
                  style={{
                    height: 1,
                    backgroundColor: 'gray',
                    width: '100%',
                  }}
                ></div>
                <p className=' mt-1 mb-0 d-flex justify-content-between'>
                 <span > Total:</span> <span className='text-secondary'>{(promotionValues.icp + gasFee * 2 + gasFee / 5).toFixed(6)} ICP</span>
                </p>
              </div>
              <div className='d-flex justify-content-center mt-2'>
                <Button
                  className='publish-btn w-100 mt-2 py-2'
                  disabled={isArticleSubmitting}
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
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>ICP</Form.Label>
                          <i
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={handleModalClose}
                            className='fa fa-close'
                          ></i>
                        </div>

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
                  <Button
                    className='publish-btn'
                    disabled={isArticleSubmitting}
                    type='submit'
                  >
                    {isArticleSubmitting ? <Spinner size='sm' /> : 'Promote'}
                  </Button>
                </FormikForm>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
