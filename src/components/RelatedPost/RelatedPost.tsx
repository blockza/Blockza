import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/Posts/Small-Post-4.png';
import logger from '@/lib/logger';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { getImage } from '@/components/utils/getImage';
import { useSearchParams } from 'next/navigation';
interface MyComponentProps {
  catagorytype: string[];
}

let RelatedPost: React.FC<MyComponentProps> = ({ catagorytype }) => {
  const [entriesByCategory, setEntriesByCategory] = useState([]);

  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');
  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: state.identity,
  }));
  const getEntriesList = async (selectedCategory?: string) => {
    const categ = selectedCategory;
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.getEntriesList(categ, false, '', 0, 4);
    const tempList = resp.entries;
    let filterd=tempList.filter((e:any)=>e[0] != articleId);
    if (filterd.length >3) {
      const firstitems = filterd.slice(0, 3);
    setEntriesByCategory(firstitems);
      
    }else{
      setEntriesByCategory(filterd);

    }
    logger(tempList, 'Entries List');
    return tempList;
  };
  useEffect(() => {
    if (catagorytype) {
      getEntriesList(catagorytype[0]);
    }
  }, [catagorytype, articleId]);
  return (
    <>
    {entriesByCategory.length==0 && <div className=''><p className='text-center fs-5'>No related posts</p></div>}
      {entriesByCategory &&
        entriesByCategory.map((entry: any, index) => {
          let dateformat = (t: any) => {
            const date = new Date(Number(t));
            return date.toDateString();
          };
          logger({ MAH: entry[1] }, 'DHARTI MERI MAAAA');
          let image = null;
          if (entry[1].image) {
            image = getImage(entry[1].image);
          }
          return (
            <div className='related-post' key={index}>
              <div className='related-post-inner'>
                <div className='img-pnl'>
                  <Link href={`/article?articleId=${entry[0]}`} >
                    <Image
                      src={image ? image : smallpost1}
                      width={100}
                      height={60}
                      style={{height:"194px",width: "259px"}}
                      alt='Post'
                    />
                  </Link>
                </div>
                <div className='txt-pnl'>
                  <Link href={`/article?articleId=${entry[0]}`}className='rmLine'>
                    {entry[1].title}
                  </Link>
                  <span>by {' '}<Link href={`/profile?userId=${entry[1].user.toString()}`}  className='rmLine'>{entry[1].userName}</Link></span>
                  <span>{dateformat(entry[1].creation_time)}</span>
                </div>
              </div>
            </div>
          );
        })}
      {/* <div className='related-post'>
<div className='related-post-inner'>
<div className='img-pnl'>
<Link href="/"><Image src={smallpost2} alt="Post" /></Link>
</div>
<div className='txt-pnl'>
<Link href="#">NFTs and African Art: Empowering Creativity in the
Digital Age</Link>
<p>by Michael Saturday</p>
<span>Oct 20, 2023</span>
</div>
</div>
</div>
<div className='related-post'>
<div className='related-post-inner'>
<div className='img-pnl'>
<Link href="/"><Image src={smallpost3} alt="Post" /></Link>
</div>
<div className='txt-pnl'>
<Link href="#">Announcing the Scholarship Programme for African
women by SCA x GWG</Link>
<p>by Michael Saturday</p>
<span>Oct 20, 2023</span>
</div>
</div>
</div> */}
    </>
  );
};
export default RelatedPost;
