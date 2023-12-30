import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import survey from '@/assets/Img/Icons/icon-survey.png';
import iconclock from '@/assets/Img/Icons/icon-clock.png';
import iconquestion from '@/assets/Img/Icons/icon-question.png';
import user from '@/assets/Img/Profile/user.png';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import iconshare from '@/assets/Img/Icons/icon-share.png';
import infinite from '@/assets/Img/Icons/infinity.png';
import icpimage from '@/assets/Img/coin-image.png';
export default function SurveyPost() {
  return (
    <>
      <div className='servey-post'>
        <div className='servey-post-inner'>
          <div className='servey-post-head'>
            <div className='left-pnl'>
              <div className='img-pnl'>
                <Image src={user} alt='User' />
              </div>
              <div className='txt-pnl'>
                <h6>
                  Dev Singh
                  {/* <Link href="#"><Image src={iconcap} alt="Cap" />Expert</Link> */}
                </h6>
                <p>
                  Content by <span>NFTStudio24</span>
                </p>
              </div>
            </div>
            <div className='share'>
              <h2 className='comingsoonlb1'>Coming Soon</h2>
            </div>
          </div>
          <div className='servey-post-body'>
            <Image src={survey} alt='Survey' />
            <p>NFTStudio24 Survey</p>
            <h3>Major Attractions in Web3</h3>
            <h4>
              <Image src={icpimage} alt='infinite' /> +500 NS24
            </h4>
            <ul>
              <li>
                <Image src={iconclock} alt='infinite' /> 15 minutes
              </li>
              <li>
                <Image src={iconquestion} alt='infinite' /> 5 questions
              </li>
            </ul>
            <Link
              href='#'
              style={{
                pointerEvents: 'none',
              }}
              className='servey-btn'
            >
              Do Survey
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
