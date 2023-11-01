import React from 'react';
import Post from '@/assets/Img/Posts/post.png';
import user from '@/assets/Img/user.png';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import infinity from '@/assets/Img/Icons/icon-infinite2.png';
import iconcomment from '@/assets/Img/Icons/icon-comment.png';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function ExportPost() {
  const router = useRouter();
  return (
    <>
      <div className='expert-post'>
        <div className='img-pnl'>
          <Image src={Post} alt='Post' />
        </div>
        <div className='txt-pnl'>
          <div className='expert-post-head'>
            <div className='left-pnl'>
              <div className='img-pnl'>
                <Image src={user} alt='User' />
              </div>
              <div className='txet-pnl'>
                <h6>
                  By Hinza Asif {' '}
                  <Link href='#'>
                    <Image src={iconcap} alt='Cap' /> Expert
                  </Link>
                </h6>
              </div>
            </div>
          </div>
          <h2>Japan Half-Hearted Approach to Stablecoins: A Looming Concern</h2>
          <p>
            In June 2023, the world witnessed a significant development in the
            cryptocurrency realm as Japan passed a bill regarding stablecoins.
            This move, however, left many observers baffled, as it appeared that
            Japan had entered the stablecoin arena with
          </p>
          <Link
            href='/NFTArticle'
            onClick={(e) => e.preventDefault()}
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
                  <div>48</div>
                </li>
              </ul>
              <h6>
                <Image src={iconcomment} alt='Comment' /> 12 Comments
              </h6>
            </div>
            <div>
              <ul className='quiz-list'>
                <li>
                  <Image src={infinity} alt='infinity' /> <span>+500 ICP</span>
                </li>
                <li
                // style={{ cursor: 'pointer' }}
                // onClick={() => router.push('/NFTArticleQuiz')}
                >
                  <Link href="/NFTArticleQuiz">
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
