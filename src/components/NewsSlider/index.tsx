import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-1.png';
import post2 from '@/assets/Img/Posts/Post-2.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import box from '@/assets/Img/Icons/icon-giftbox.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import generalpost1 from '@/assets/Img/event-5.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import generalpost2 from '@/assets/Img/event-6.png';
import parse from 'html-react-parser';
import iconcoin from '@/assets/Img/coin-image.png';
import { Spinner } from 'react-bootstrap';
export default function NewsSlider() {
  let [promotedArticle, setPromotedArticle] = useState([]);
  let [isloaded, setIsloaded] = useState(true);

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  // const responsive = {
  //   desktop: {
  //     breakpoint: { max: 3000, min: 992 },
  //     items: 2
  //   },
  //   tablet: {
  //     breakpoint: { max: 991, min: 767 },
  //     items: 2
  //   },
  //   mobile: {
  //     breakpoint: { max: 767, min: 0 },
  //     items: 1
  //   }
  // };
  var Featued = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: promotedArticle.length > 1 ? 2 : 1,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };
  //   useEffect(() => {
  //     async function getFeaturedEntries() {
  //       try {

  //         let entrylist = await entryActor.getPromotedEntries(10);
  // if(entrylist.length !=0){

  //         for (let entry = 0; entry < entrylist.length; entry++) {
  //           let id=entrylist[entry][1].user.toString();

  //          let user=await getUser(id);
  //          logger(user,"ttt")
  //         //  entrylist[entry][1].newuser=user

  //         }
  //         setPromotedArticle(entrylist)
  //         logger(entrylist[0][1].user.toString(), 'proooo');
  //       }
  //       } catch (error) {
  //         console.error(error, 'proooo');
  //       }
  //     }

  //     getFeaturedEntries();
  //   }, []);
  async function getPressReleaseEntries() {
    try {
      let tempList = await entryActor.getAllEntries();
      let entrylist = tempList.slice(0, 10);
      if (entrylist.length !== 0) {
        await Promise.all(
          entrylist.map(async (entry: any, index: any) => {
            let id = entry[1].user.toString();
            logger(entry[1], 'MAHHH ENTRY');
            let newUser = await userActor.get_user_details([id]);
            if (newUser.ok) {
              if (newUser.ok[1].profileImg.length != 0) {
                const tempImg = await getImage(newUser.ok[1].profileImg[0]);
                entry[1].userImg = tempImg;
              }
              entry[1].userName = newUser.ok[1].name;
            }
            let articalimg = await getImage(entry[1].image);
            entry[1].image = articalimg;
            entry[1].likes = parseInt(entry[1].likes);
          })
        );

        setPromotedArticle(entrylist);
        logger(entrylist, 'aaaa');
        const timer = setTimeout(() => {
          setIsloaded(false);
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        setIsloaded(false);
      }
    } catch (error) {
      console.error(error, 'proooo');
    }
  }
  useEffect(() => {
    getPressReleaseEntries();
  }, []);
  return (
    <>
      {isloaded && (
        <div className='d-flex justify-content-center mb-4'>
          <Spinner animation='border' />
        </div>
      )}
      {promotedArticle.length == 0 && !isloaded && (
        <div className='d-flex justify-content-center'>
          <p>No Articles found</p>
        </div>
      )}

      {promotedArticle.length != 0 && (
        <Slider
          {...Featued}
          lazyLoad='anticipated'
          className={`${isloaded ? 'd-none' : ''}`}
        >
          {promotedArticle.map((entry: any, index) => {
            return (
              <div className='Post-padding' key={index}>
                <div className='general-post slider'>
                  <Link href={`/article?articleId=${entry[0]}`}>
                    <div
                      className='position-relative'
                      style={{ width: 370, height: 250 }}
                    >
                      <Image
                        src={entry[1].image ? entry[1].image : post1}
                        fill
                        sizes=''
                        alt='Post'
                      />
                    </div>
                  </Link>
                  <div className='txt-pnl'>
                    <Link href='#'>
                      <h6>
                        {entry[1]?.title.length > 50
                          ? `${entry[1]?.title.slice(0, 50)}...`
                          : entry[1]?.title}
                      </h6>
                    </Link>
                    <p style={{ maxHeight: 200, overflowY: 'hidden' }}>
                      {entry ? parse(entry[1].description ?? '') : 'loading...'}
                    </p>
                    <ul className='thumb-list flex'>
                      <li>
                        <a href={`${entry ? entry[0]? `/article?articleId=${entry[0]}`:"#":`#`}`} className='mr-3'>
                          <Image src={iconthumb} alt='Icon Thumb' />
                          {entry ? entry[1]?.likes ?? 0 : 0}
                        </a>
                        <a href={`${entry ? entry[0]? `/article?articleId=${entry[0]}&route=comments`:"#":`#`}`}>
                          <Image src={iconmessage} alt='Icon Comment' /> 12
                          Comments
                        </a>
                      </li>
                      <li>
                        <Image src={iconcoin} alt='Icon Comment' /> +500 NS24
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
          {/* <div className='Post-padding'>
          <div className='Featured-Post'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Link href='/'>
                  <Image src={post2} alt='Post' />
                </Link>
              </div>
              <div className='txt-pnl'>
                <h5>
                  How Party Degen climbed the top ranking on OpenSea in 6 days
                </h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
                <Link href='#'>
                  <Image src={box} alt='logo' /> 2500 USDT Up for Grabs!
                </Link>
              </div>
            </div>
          </div>
        </div> */}
          {/* <div className='Post-padding'>
          <div className='Featured-Post'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Link href='/'>
                  <Image src={post1} alt='Post' />
                </Link>
              </div>
              <div className='txt-pnl'>
                <h5>
                  All You Need to Know about Superlative Secret Society NFT...
                </h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
                <Link href='#'>
                  <Image src={box} alt='logo' /> 2500 USDT Up for Grabs!
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='Post-padding'>
          <div className='Featured-Post'>
            <div className='Featured-Post-inner'>
              <div className='img-pnl'>
                <Link href='/'>
                  <Image src={post2} alt='Post' />
                </Link>
              </div>
              <div className='txt-pnl'>
                <h5>
                  How Party Degen climbed the top ranking on OpenSea in 6 days
                </h5>
                <p>
                  <span>
                    <Image src={logo} alt='logo' />
                  </span>{' '}
                  Campaing of <b>NFTStudio24</b>
                </p>
                <Link href='#'>
                  <Image src={box} alt='logo' /> 2500 USDT Up for Grabs!
                </Link>
              </div>
            </div>
          </div>
        </div> */}
        </Slider>
      )}
    </>
  );
}
