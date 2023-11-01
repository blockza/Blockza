import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import quiz from '@/assets/Img/quiz.png';
import Infinite from '@/assets/Img/Icons/infinity.png';
import icontest from '@/assets/Img/Icons/icon-test.png';
import iconcheck from '@/assets/Img/Icons/icon-check.png';
import iconrefresh from '@/assets/Img/Icons/icon-refresh.png';
import { Button } from 'react-bootstrap';
export default function QuizPost() {
  return (
    <>
      <div className="Quiz-Post-pnl">
        <Image src={quiz} alt="Quiz" />
        <div className="grey-heading">
          <h2>
            NIGERIAN LOCAL TRARDERS COMMENT
            ON THE USE OF CRYPTOCURRENCY
            FOR RECIECVING PAYMENTS
          </h2>
        </div>
        <span className='blue-span'>
          <h3>About the <b>Quiz</b></h3>
        </span>
        <p>
          A review of crucial points stated in the article
        </p>
        <ul>
          <li>
            <div className="img-pnl">
              <Image src={iconcheck} alt="icon test" />
            </div>
            <p>
              You need to answer
              all questions in the
              quiz to earn 500 XP
            </p>
          </li>
          <li>
            <div className="img-pnl">
              <Image src={icontest} alt="icon test" />
            </div>
            <p>
              Each quiz will
              have single or multiple
              correct answers,
              choose wisely.
            </p>
          </li>
          <li>
            <div className="img-pnl">
              <Image src={iconrefresh} alt="icon test" />
            </div>
            <p>
              You will be able to
              retry multiple times if
              you fail the quiz.
            </p>
          </li>
        </ul>

        <h6><Image src={Infinite} alt="Infinite" /> +500 ICP</h6>
        <Button className='blue-button'>Take Quiz</Button>
      </div>
    </>
  );
}