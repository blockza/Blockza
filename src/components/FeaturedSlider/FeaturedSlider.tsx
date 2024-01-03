// import React, { useEffect, useState } from 'react';
// import 'slick-carousel/slick/slick.css';
// import post1 from '@/assets/Img/Posts/Post-1.png';
// import post2 from '@/assets/Img/Posts/Post-2.png';
// import logo from '@/assets/Img/Logo/Footer-logo.png';
// import box from '@/assets/Img/Icons/icon-giftbox.png';
// import Slider from 'react-slick';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useConnectPlugWalletStore } from '@/store/useStore';
// import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
// import logger from '@/lib/logger';
// import { getImage } from '@/components/utils/getImage';
// import { Spinner } from 'react-bootstrap';
// export default function FeaturedSlider() {
//   let [promotedArticle, setPromotedArticle] = useState([]);
//   let [isloaded, setIsloaded] = useState(true);

//   const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
//     auth: state.auth,
//     setAuth: state.setAuth,
//     identity: state.identity,
//   }));
//   const entryActor = makeEntryActor({
//     agentOptions: {
//       identity,
//     },
//   });
//   const userActor = makeUserActor({
//     agentOptions: {
//       identity,
//     },
//   });
//   // const responsive = {
//   //   desktop: {
//   //     breakpoint: { max: 3000, min: 992 },
//   //     items: 2
//   //   },
//   //   tablet: {
//   //     breakpoint: { max: 991, min: 767 },
//   //     items: 2
//   //   },
//   //   mobile: {
//   //     breakpoint: { max: 767, min: 0 },
//   //     items: 1
//   //   }
//   // };
//   var Featued = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: promotedArticle.length>1? 2:1,
//     slidesToScroll: 2,
//     responsive: [
//       {
//         breakpoint: 1400,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: false,
//         },
//       },
//       {
//         breakpoint: 991,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           infinite: false,
//         },
//       },
//       {
//         breakpoint: 767,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           infinite: false,
//         },
//       },
//       {
//         breakpoint: 575,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: false,
//         },
//       },
//     ],
//   };
//   //   useEffect(() => {
//   //     async function getFeaturedEntries() {
//   //       try {

//   //         let entrylist = await entryActor.getPromotedEntries(10);
//   // if(entrylist.length !=0){

//   //         for (let entry = 0; entry < entrylist.length; entry++) {
//   //           let id=entrylist[entry][1].user.toString();

//   //          let user=await getUser(id);
//   //          logger(user,"ttt")
//   //         //  entrylist[entry][1].newuser=user

//   //         }
//   //         setPromotedArticle(entrylist)
//   //         logger(entrylist[0][1].user.toString(), 'proooo');
//   //       }
//   //       } catch (error) {
//   //         console.error(error, 'proooo');
//   //       }
//   //     }

//   //     getFeaturedEntries();
//   //   }, []);
//   async function getFeaturedEntries() {
//     try {
//       let entrylist = await entryActor.getPromotedEntries(10);

//       if (entrylist.length !== 0) {
//         await Promise.all(
//           entrylist.map(async (entry: any, index: any) => {
//             let id = entry[1].user.toString();
//             let newUser = await userActor.get_user_details([id]);
//             if (newUser.ok) {
//               if (newUser.ok[1].profileImg.length != 0) {
//                 const tempImg = await getImage(newUser.ok[1].profileImg[0]);
//                 entry[1].userImg = tempImg;
//               }
//             entry[1].userName=newUser.ok[1].name;
//             }
//             let articalimg = await getImage(entry[1].image);
//             entry[1].image = articalimg;
//           })
//         );

//         setPromotedArticle(entrylist);
//         logger(entrylist, 'aaaa');
//         const timer = setTimeout(() => {
//           setIsloaded(false);
//         }, 2000);

//         return () => clearTimeout(timer);
//       }else{
//         setIsloaded(false);

//       }
//     } catch (error) {
//       console.error(error, 'proooo');
//     }
//   }
//   useEffect(() => {
//     getFeaturedEntries();
//   }, []);
//   return (
//     <>
//     {isloaded  && <div className='d-flex justify-content-center'><Spinner animation="border" /></div>}
//     {promotedArticle.length == 0 && !isloaded && <div className='d-flex justify-content-center'><p>No Articles found</p></div>}

//       {promotedArticle.length != 0 && (
//         <Slider
//           {...Featued}
//           lazyLoad='anticipated'
//           className={`${isloaded ? 'd-none' : ''}`}
//         >
//           {promotedArticle.map((entry: any, index) => {
//             return (
//               <div className='Post-padding' key={index}>
//                 <div className='Featured-Post'>
//                   <div
//                     className='Featured-Post-inner'
//                     style={{ height: '340px' }}
//                   >
//                     <div
//                       className='img-pnl d-flex align-items-center bg-dark'
//                       style={{ height: '192px' }}
//                     >
//                       <Link href={`/article?articleId=${entry[0]}`}>
//                         <Image
//                           src={entry[1].image ? entry[1].image : post1}
//                           alt='Post'
//                           height={100}
//                           width={100}
//                         />
//                       </Link>
//                     </div>
//                     <div className='txt-pnl'>
//                       <h5 style={{overflow: 'visible'}}>{entry[1]?.title.length >50? `${entry[1]?.title.slice(0,50)}...`:entry[1]?.title}</h5>
//                       <p className='d-flex'>
//                         <span>
//                           {/* <Image src={logo} alt='logo' /> */}
//                           <Link
//                             href={`/profile?userId=${entry[1].user.toString()}`}
//                             className='mylink'
//                           >
//                             <Image
//                               src={entry[1].userImg ? entry[1].userImg : logo}
//                               alt='logo'
//                               className='myimg'
//                               height={100}
//                               width={100}
//                             />
//                           </Link>
//                         </span>{' '}
//                         Created by{' '}
//                         <b>
//                           <Link
//                             href={`/profile?userId=${entry[1].user.toString()}`}
//                             className='mylink'
//                           >
//                             {entry[1]?.userName}
//                           </Link>
//                         </b>
//                       </p>
//                       <Link href={`/article?articleId=${entry[0]}`}>
//                         View Article
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//           {/* <div className='Post-padding'>
//           <div className='Featured-Post'>
//             <div className='Featured-Post-inner'>
//               <div className='img-pnl'>
//                 <Link href='/'>
//                   <Image src={post2} alt='Post' />
//                 </Link>
//               </div>
//               <div className='txt-pnl'>
//                 <h5>
//                   How Party Degen climbed the top ranking on OpenSea in 6 days
//                 </h5>
//                 <p>
//                   <span>
//                     <Image src={logo} alt='logo' />
//                   </span>{' '}
//                   Campaing of <b>NFTStudio24</b>
//                 </p>
//                 <Link href='#'>
//                   <Image src={box} alt='logo' /> 2500 USDT Up for Grabs!
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div> */}
//           {/* <div className='Post-padding'>
//           <div className='Featured-Post'>
//             <div className='Featured-Post-inner'>
//               <div className='img-pnl'>
//                 <Link href='/'>
//                   <Image src={post1} alt='Post' />
//                 </Link>
//               </div>
//               <div className='txt-pnl'>
//                 <h5>
//                   All You Need to Know about Superlative Secret Society NFT...
//                 </h5>
//                 <p>
//                   <span>
//                     <Image src={logo} alt='logo' />
//                   </span>{' '}
//                   Campaing of <b>NFTStudio24</b>
//                 </p>
//                 <Link href='#'>
//                   <Image src={box} alt='logo' /> 2500 USDT Up for Grabs!
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='Post-padding'>
//           <div className='Featured-Post'>
//             <div className='Featured-Post-inner'>
//               <div className='img-pnl'>
//                 <Link href='/'>
//                   <Image src={post2} alt='Post' />
//                 </Link>
//               </div>
//               <div className='txt-pnl'>
//                 <h5>
//                   How Party Degen climbed the top ranking on OpenSea in 6 days
//                 </h5>
//                 <p>
//                   <span>
//                     <Image src={logo} alt='logo' />
//                   </span>{' '}
//                   Campaing of <b>NFTStudio24</b>
//                 </p>
//                 <Link href='#'>
//                   <Image src={box} alt='logo' /> 2500 USDT Up for Grabs!
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div> */}
//         </Slider>
//       )}
//     </>
//   );
// }
import React from 'react';
import 'slick-carousel/slick/slick.css';
import post1 from '@/assets/Img/Posts/Post-1.png';
import post2 from '@/assets/Img/Posts/Post-2.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import box from '@/assets/Img/Icons/icon-giftbox.png';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
export default function FeaturedSlider() {
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
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
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
          slidesToShow: 2,
          slidesToScroll: 2,
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
  return (
    <>
      <Slider {...Featued}>
        <div className='Post-padding'>
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
        </div>
        <div className='Post-padding'>
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
        </div>
      </Slider>
    </>
  );
}
