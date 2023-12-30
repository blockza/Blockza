import React, { useEffect, useState } from 'react';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import infinity from '@/assets/Img/Icons/icon-infinite2.png';
import icpimage from '@/assets/Img/coin-image.png';
import Link from 'next/link';
import Image from 'next/image';
import girl from '@/assets/Img/user-img.png';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import { useConnectPlugWalletStore } from '@/store/useStore';
import pressicon from '@/assets/Img/Icons/icon-press-release.png';
import { getImage } from '@/components/utils/getImage';
import { User } from '@/types/profile';
import parse from 'html-react-parser';
import { Button, Spinner } from 'react-bootstrap';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import PromotedSVG from '@/components/PromotedSvg/Promoted';
import Tippy from '@tippyjs/react';

export default function ExportPost({
  entry,
  entryId,
}: {
  entry: any;
  entryId: string;
}) {
  const [userImg, setUserImg] = useState<string | null>();
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const router = useRouter();

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));

  const authorId = entry?.user?.toString();

  // logger();

  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = await getImage(img);
      if (name === 'user') setUserImg(tempImg);
      else {
        setFeaturedImage(tempImg);
      }
    } else {
      // setProfileFile(null);
      if (name === 'user') setUserImg(null);
      else {
        setFeaturedImage(null);
      }
    }
  };
  const getUser = async () => {
    let newUser = null;

    newUser = await auth.actor.get_user_details([authorId]);

    if (newUser.ok) {
      setUser(newUser.ok[1]);
      updateImg(newUser.ok[1].profileImg[0], 'user');
      updateImg(entry.image, 'feature');

      logger(newUser, 'This is the User of post');
    }
  };

  useEffect(() => {
    if (authorId && auth.actor) {
      getUser();
    }
  }, [authorId, auth.actor]);
  return (
    <>
      <div className='expert-post'>
        <div
          className='img-pnl'
          style={{ cursor: 'pointer' }}
          onClick={() => router.push(`/article?articleId=${entryId}`)}
        >
          {/* <Image src={Post} alt='Post' /> */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              margin: '0 auto',
              height: '220px',
              overflow: 'hidden',
              background: '#000',
              borderRadius: '15px 15px 0 0',
            }}
          >
            {entry?.isPromoted && (
              <div className='promotedlable'>
                <PromotedSVG />{' '}
                <p className='mb-0' style={{ fontWeight: '600' }}>
                  Promoted Article
                </p>
              </div>
            )}
            {featuredImage ? (
              <Image
                src={featuredImage}
                className='backend-img expert-header-img '
                fill={true}
                alt='Profileicon'
                style={{
                  maxHeight: '100%',
                  // height: 'auto',
                  borderRadius: '15px 15px 0 0',
                  margin: '0 auto',
                }}
              />
            ) : (
              <Spinner animation='border' variant='warning' />
            )}
          </div>
        </div>
        <div className='txt-pnl'>
          <div className='expert-post-head'>
            <div className='left-pnl'>
              <div className='img-pnl'>
                {/* <Image src={defaultUser} alt='User' /> */}
                <Link href={`/profile?userId=${authorId}`}>
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
                      className='backend-img '
                      fill={true}
                      alt='Profileicon'
                    />
                  </div>
                </Link>
              </div>
              <div className='txet-pnl'>
                <h6>
                  <Link href={`/profile?userId=${authorId}`}>
                    By {user?.name[0] ?? ''}{' '}
                  </Link>
                  <Button>
                    <Image src={iconcap} alt='Cap' /> Expert
                  </Button>
                </h6>
              </div>
            </div>
          </div>
          {/* <h2>Japan Half-Hearted Approach to Stablecoins: A Looming Concern</h2>
          <p>
            In June 2023, the world witnessed a significant development in the
            cryptocurrency realm as Japan passed a bill regarding stablecoins.
            This move, however, left many observers baffled, as it appeared that
            Japan had entered the stablecoin arena with
          </p> */}
          <div className='cut'>
            <h2
              onClick={() => router.push(`/article?articleId=${entryId}`)}
              style={{ cursor: 'pointer' }}
            >
              {entry?.pressRelease && (
                <Tippy content={<p className='mb-0'>Press Release</p>}>
                  <Image
                    src={pressicon}
                    alt='pressicon'
                    style={{ width: 22, height: 22 }}
                  />
                </Tippy>

                // <span className='publish-btn table-btn'>
                //   promotedIcon
                // </span>
              )}{' '}
              {entry?.title ?? ''}
            </h2>
            {/* <div
              dangerouslySetInnerHTML={{ __html: entry?.description ?? '' }}
            /> */}
            {parse(entry?.description ?? '')}
            <div style={{ minHeight: 300 }}></div>
          </div>
          <Link
            href={`/article?articleId=${entryId}`}
            // onClick={(e) => e.preventDefault()}
            className='show-more-link'
          >
            Show more <i className='fa fa-caret-down'></i>
          </Link>
          <div className='count-description-pnl'>
            <div className='d-flex'>
              <ul className='vote-comment-list'>
                <li>
                  <div>
                    <Image src={iconrise} alt='Rise' /> Vote
                  </div>
                  <div>{parseInt(entry?.likes ?? '0')}</div>
                </li>
              </ul>
              {/* <h6>
                <Image src={iconcomment} alt='Comment' /> 12 Comments
              </h6> */}
            </div>
            <div>
              <ul className='quiz-list'>
                <li>
                  <Image
                    src={icpimage}
                    alt='icpImage'
                    style={{ height: '25px', width: '30px' }}
                  />{' '}
                  <span>+500 ICP</span>
                </li>
                <li
                // style={{ cursor: 'pointer' }}
                // onClick={() => router.push('/NFTArticleQuiz')}
                >
                  <Link href={`/article?articleId=${entryId}`}>
                    Take Quiz <i className='fa fa-angle-right'></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
