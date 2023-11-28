'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import iconrelated from '@/assets/Img/Icons/icon-related.png';
import NavBar from '@/components/NavBar/NavBar';
import SidebarHome from '@/components/SideBarHome/SideBarHome';
import Footer from '@/components/Footer/Footer';
import LeadershipPost from '@/components/LeadershipPost/LeadershipPost';
import NFTArticlePost from '@/components/NFTArticlePost/NFTArticlePost';
import RelatedPost from '@/components/RelatedPost/RelatedPost';
import QuizPost from '@/components/QuizPost/QuizPost';
import { useRouter as useOldRouter } from 'next/router';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { NextSeo } from 'next-seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function article() {
  const [userImg, setUserImg] = useState<string | null>();
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const [entry, setEntry] = useState<any>();
  const [userId, setUserId] = useState();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');
  const router = useRouter();

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));

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

    newUser = await auth.actor.get_user_details([userId]);
    if (newUser.ok) {
      setUser(newUser.ok[1]);
      updateImg(newUser.ok[1].profileImg[0], 'user');
    }
  };

  const getEntry = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (articleId) {
      const tempEntry = await entryActor.getEntry(articleId);
      // const promted = await entryActor.getPromotedEntries();
      // logger(promted, 'PROMTED ENTRIES');
      logger(tempEntry, 'entries');
      if (tempEntry[0] && tempEntry[0].isDraft) {
        return router.push(`/addarticle?draftId=${articleId}`);
      }
      let tempUser = tempEntry[0].user?.toString();
      setUserId(tempUser);
      updateImg(tempEntry[0].image, 'feature');

      setEntry(tempEntry[0]);
      logger(tempEntry[0], 'Entries fetched from canister');
    }
  };
  const likeEntry = async () => {
    return new Promise(async (resolve, reject) => {
      if (!entry || !userId) reject('NO Entry or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeEntry(articleId, userCanisterId)
        .then(async (entry: any) => {
          logger(entry);

          await getEntry();
          resolve(entry);
        })
        .catch((err: any) => {
          logger(err);
          reject(err);
        });
    });
  };
  useEffect(() => {
    getEntry();
  }, []);
  useEffect(() => {
    if (userId && auth.actor) {
      getUser();
    }
  }, [userId, auth.actor]);

  // router.push('/route')
  return (
    <>
      <main id='main'>
        <div className='main-inner'>
          <div className='inner-content'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href='/'>HOME </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>
                    {entry?.category && entry?.category[0] ? (
                      <Link
                        href={`/categorydetail?category=${entry?.category[0]}`}
                      >
                        {entry?.category[0]}
                      </Link>
                    ) : (
                      ''
                    )}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>{entry?.title ?? ''}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xxl='7' xl='7' lg='12' md='12'>
                {entry && (
                  <NFTArticlePost
                    likeEntry={likeEntry}
                    article={{
                      entry: entry,
                      user: user,
                      featuredImage: featuredImage,
                      userImg: userImg,
                      userId: userId,
                      articleId: articleId,
                    }}
                  />
                )}
                <h3>
                  <Image src={iconrelated} alt='icon related' /> Related Posts
                </h3>
                <div className='spacer-20'></div>
                <div className='related-post-container rlf'>
                  <RelatedPost />
                </div>
              </Col>
              <Col xxl='5' xl='5' lg='12' md='12' className='text-right'>
                <QuizPost />
                {/* <LeadershipPost /> */}
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
// export const getStaticPaths = async () => {
//   // const paths = getAllArticleIds(); // Implement this function to get all article IDs
//   return {
//     paths,
//     fallback: true, // or false if you want to return a 404 page for unknown IDs
//   };
// };

// export const getStaticProps = async ({ params }) => {
//   // const article = await getArticleById(params.articleId);
//   return {
//     props: {
//       // article,
//     },
//   };
// };
