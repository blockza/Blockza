import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import post1 from '@/assets/Img/Posts/Post-17.png';
import post2 from '@/assets/Img/Posts/Post-18.png';
import post3 from '@/assets/Img/Posts/Post-19.png';
import iconrise from '@/assets/Img/Icons/icon-rise.png';
import infinity from '@/assets/Img/Icons/icon-infinite.png';
import iconcomment from '@/assets/Img/Icons/icon-comment.png';
import iconshare from '@/assets/Img/Icons/icon-share.png';
import user from '@/assets/Img/user.png';
import user1 from '@/assets/Img/user-1.png';
import iconcap from '@/assets/Img/Icons/icon-cap.png';
import { Button } from 'react-bootstrap';
export default function NFTArticlePost() {
  return (
    <>
      <div className='article-detail-pnl'>
        <div className='top-img'>
          <Image src={post1} alt='Post' />
        </div>
        <div className='post-info-head'>
          <div className='user-inf-cntnr'>
            <div className='img-pnl'>
              <Image src={user} alt='User' />
            </div>
            <div className='txt-pnl'>
              <h6>
                By Hinza Asif{' '}
                <Link href='#'>
                  <Image src={iconcap} alt='Cap' /> Expert
                </Link>
              </h6>
              <p>
                Content Felow of <b>NFTStudio24</b>
              </p>
              <span className='small'>Oct 19, 2023, 23:35</span>
            </div>
          </div>
          <div className='count-description-pnl'>
            <div className='d-flex sm'>
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
              <Link href='#' className='share-btn'>
                Share <Image src={iconshare} alt='share' />
              </Link>
            </div>
          </div>
        </div>
        <div className='text-detail-pnl'>
          <h3>
            NIGERIAN LOCAL TRADERS COMMENT ON THE USE OF CRYPTOCURRENCY FOR
            RECEIVING PAYMENTS
          </h3>
          <p>
            "Why should I put my money in a system I cannot trust? One minute,
            I'm rich. The next minute, I'm poor. Cryptocurrency is so
            unpredictable. If I lose my money now, who would I turn to? Nobody.
            You see that crypto? I'm not doing it."
          </p>
          <p>
            These were the exact words of Chuka Bassey, an electronic gadget
            trader who was asked if he would rather use cryptocurrency as a
            means of payment than the traditional cash or bank transfer system.
          </p>
          <p>
            Over the years, cryptocurrency is a term that has gained widespread
            traction in Nigeria. The term; <b>"I'm into crypto"</b> seems like
            one of the coolest things to say among the Nigerian youth populace.
            And even though the Central Bank of Nigeria (CBN) issued a circular
            to close accounts of persons or entities involved in cryptocurrency
            transactions within financial and non-financial systems in 2021,
            cryptocurrency has not stopped gaining traction.
          </p>
          <p>
            According to a survey conducted by Statista in 2020, 32% of
            Nigerians have admitted to using and owning cryptocurrencies. The
            reason for this is not far-fetched- "In Nigeria, interest in bitcoin
            and stablecoin increased when the naira's value plunged,
            particularly during the most extreme drops in June and July of
            2023."- Chainalysis, 2023.
          </p>
          <p>
            This statement would also support the findings from Coinbase 2022
            research report, <b>"International Survey of Web 3 Adoption</b>."
            Coinbase report highlighted that people in emerging markets often
            turn to borderless cryptocurrencies for remittances and as a store
            of value, especially through periods of high inflation when access
            to fiat currencies like the US dollar is limited.
          </p>
          <p>
            From this, we can deduce that Nigerians perfer keeping their assets
            as stable crypto tokens due to the volatility of the naira and the
            high inflationary periods. This shows that crypto, once perceived
            negatively, is now serving as a financial lifeline for the average
            Nigerian.
          </p>
          <p>
            But is that all there is to it? Are Nigerians fully embracing the
            idea and concept of cryptocurrency? Or are there still some
            perceived notions around it, like that of Chuka Bassey, the
            electronic gadget trader who swore never to use cryptocurrency?
          </p>
          <p>
            During a WhatsApp conversation with RG Fries, a food vendor based in
            Akure, she expressed a preference for customers to send USDT as
            payment for her services rather than using traditional cash. This
            conversation sparked my curiosity, making me wonder if other traders
            shared her perspective. So, last week, I ventured into the stores of
            traders in Lagos, engaging them in casual conversations to know if
            they would opt for cryptocurrency as a means of payment over
            conventional fiat currency. And many of them had a lot of things to
            say about that.
          </p>
          <div className='image-panel'>
            <Image src={post2} alt='Post' />
          </div>
          <p>
            A trader identified as Emeka said: "Make I collect crypto, make
            people go tell police say I dey do yahoo? Abeg Abeg"
          </p>
          <p>
            Iya Seyi, a provision store owner, shared her perspective in Yoruba,
            a native Nigerian language, saying, "Se kii se nkan ti awon boys ma
            fin gba ara ilu oyinbo niyen?" which translates to, "Is that not the
            tool most of these boys use to defraud foreigners?"
          </p>
          <p>
            Another trader, Dennis, showed some interest in cryptocurrency,
            saying he wouldn't mind learning more about it and possibly
            integrating it into his business's payment system. However, he
            pointed out that many cryptocurrency apps he had seen appeared to be
            very complex.
          </p>
          <p>
            While there were some positive responses, negative opinions seemed
            more prevalent. Some traders believed cryptocurrency was another
            form of a Ponzi scheme, some assumed fraudsters primarily used it,
            and others found crypto apps challenging. Many admitted to having
            heard of cryptocurrency but have limited knowledge about it.
          </p>
          <p>
            Chuka Bassey's response, however, stood out among the various
            opinions. He appeared to have little knowledge about the volatility
            of cryptocurrencies and tokens. But from his conversation, it became
            clear that he needed more understanding of stablecoins like USD,
            which tend to maintain a stable value with minimal price
            fluctuations.
          </p>
          <p>
            The responses of these traders highlight the presence of numerous
            misconceptions about cryptocurrency, even in a country like Nigeria,
            often considered a cryptocurrency hub. While many are involved in
            cryptocurrency, a significant portion remains uninformed. There are
            still people who, upon hearing that someone is involved in crypto,
            might react with suspicion, assuming the person’s involvement is
            linked to fraudulent activities. Also, many still find it
            challenging to operate cryptocurrency apps, even though these same
            people can efficiently use their bank apps like Opay, Palmpay, and
            Moniepoint.
          </p>
          <div className='image-panel'>
            <Image src={post3} alt='Post' />
          </div>
          <p>
            Undoubtedly, Nigerians are increasingly embracing the concept of
            cryptocurrency. However, the question arises: is it just for a
            select few? Does cryptocurrency remain within the reach of only the
            highly informed? What about the likes of Mr. Dennis, who expressed
            interest but needs help with the complexity of most cryptocurrency
            apps? And what about Iya Seyi, who holds a negative perception that
            cryptocurrency users are all fraudsters? Also, how do we address the
            ignorance that leads some to believe it's just another Ponzi scheme?
          </p>
          <p>
            With the responses gotten from this experiment, it is evident that
            we ought to proactively work towards bridging the gaps in the way
            people perceive cryptocurrency through education and enlightenment
            initiatives. And we also have to focus on developing cryptocurrency
            apps with enhanced user-friendliness and flexibility. Apps with
            seamless interface- one that people can find easy to use.
          </p>
          <p>
            So yes, blockchain and cryptocurrencies are gaining wide traction.
            But the essential question is: among whom?
          </p>
          <Link href='#' className='show-more-link'>
            Show less <i className='fa fa-caret-up'></i>
          </Link>
          <div className='spacer-20'></div>
          {/* Grey Panel */}
          <div className='grey-panel'>
            <p>
              This is a really good piece Peculiar, Cryptocurrency was (still
              is) seen as a get-rich- quick scheme. The consistant “crashing”
              which is typical with every other scheme, reinforced this view.
            </p>
            <div className='user-inf-cntnr'>
              <div className='img-pnl'>
                <Image src={user} alt='Post' />
              </div>
              <div className='txt-pnl'>
                <h6>By Hinza Asif</h6>
                <p>
                  Comment Follow of <b>NFTStudios 24</b>
                </p>
              </div>
            </div>
          </div>
          {/* Grey Panel */}
          {/* Hash List */}
          <ul className='hash-list'>
            <li>
              <span>#</span> Blockchain in Nigeria
            </li>
            <li>
              <span>#</span> cryto{' '}
            </li>
            <li>
              <span>#</span> Cryptocurrency
            </li>
            <li>
              <span>#</span> education{' '}
            </li>
            <li>
              <span>#</span> Nigeria
            </li>
            <li>
              <span>#</span> Expert
            </li>
            <li>
              <span>#</span> Post
            </li>
            <li>
              <span>#</span> Quiz
            </li>
          </ul>
          {/* Hash List */}

          {/* Count Description Panel */}
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
                <li>
                  Take Quiz <i className='fa fa-angle-right'></i>
                </li>
              </ul>
            </div>
          </div>
          {/* Count Description Panel */}
          {/* Comment Panel */}
          <div className='full-div comment-pnl'>
            <div className='flex-div'>
              <h4>Leave a comment</h4>
              <h6>0/400</h6>
            </div>
            <textarea
              className='form-control'
              id='comment'
              placeholder='What do you think about this article?'
            ></textarea>
            <div className='text-right'>
              <Button className='grey-button'>Add comment</Button>
            </div>
            <p className='grey-txt'>comments (6)</p>
            <ul className='comment-list'>
              <li>
                <div className='user-inf-cntnr'>
                  <div className='img-pnl'>
                    <Image src={user} alt='User' />
                  </div>
                  <div className='txt-pnl'>
                    <h6>
                      By Hinza Asif{' '}
                      <Link href='#'>
                        <Image src={iconcap} alt='Cap' /> Expert
                      </Link>
                    </h6>
                    <span>Oct 19, 2023, 23:35</span>
                    <p>This is a really good piece Peculiar.</p>
                    <div className='spacer-10'></div>
                    <p>
                      Cryptocurrency was (still is) seen as a get-rich-quick
                      scheme. The consistent "crashing" which is typical with
                      every other scheme, reinforced this view.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className='user-inf-cntnr'>
                  <div className='img-pnl'>
                    <Image src={user1} alt='User' />
                  </div>
                  <div className='txt-pnl'>
                    <h6>Rita</h6>
                    <span>Oct 19, 2023, 23:35</span>
                    <p>Insightful piece</p>
                  </div>
                </div>
              </li>
              <li>
                <div className='user-inf-cntnr'>
                  <div className='img-pnl'>
                    <Image src={user1} alt='User' />
                  </div>
                  <div className='txt-pnl'>
                    <h6>Promise Njoku</h6>
                    <span>Oct 19, 2023, 23:35</span>
                    <p>Nice One</p>
                  </div>
                </div>
              </li>
              <li>
                <div className='user-inf-cntnr'>
                  <div className='img-pnl'>
                    <Image src={user1} alt='User' />
                  </div>
                  <div className='txt-pnl'>
                    <h6>Edidiong</h6>
                    <span>Oct 19, 2023, 23:35</span>
                    <p>Cool</p>
                  </div>
                </div>
              </li>
            </ul>
            <div className='txt-center'>
              <Button className='grey-button'>Load more comments</Button>
            </div>
          </div>
          {/* Comment Panel */}
        </div>
      </div>
    </>
  );
}
