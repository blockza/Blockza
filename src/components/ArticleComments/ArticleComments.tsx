import { getImage } from '@/components/utils/getImage';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import girl from '@/assets/Img/user-img.png';
import logger from '@/lib/logger';

let ArticleComments: React.FC<any> = ({
  userArticleComments,
  totalcomment,
}) => {
  return (
    <>
      {' '}
      <p className='grey-txt'>comments ({totalcomment?.length ?? ''})</p>
      <ul className='comment-list'>
        {userArticleComments.length > 0 &&
          userArticleComments.map((comment: any, index: number) => {
            logger(comment, 'comment');
            let image = null;
            if (comment.user?.profileImg[0]) {
              image = getImage(comment.user?.profileImg[0]);
            }
            return (
              <li key={index}>
                <div className='user-inf-cntnr'>
                  <Link href={`/profile?userId=${comment?.userId}`}>
                    <div className='img-pnl'>
                      {/* <div
                  style={{
                    width: '20px',
                    height: '20x',
                    position: 'relative',
                  }}
                >
                  <Image src={image} fill alt='User' />
                </div> */}
                      <div
                        className='w-full'
                        style={{
                          height: '40px',
                          width: '40x',
                          position: 'relative',
                        }}
                      >
                        {image ? (
                          <Image fill={true} src={image} alt='Banner' />
                        ) : (
                          <Image src={girl} alt='Banner' fill={true} />
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className='txt-pnl'>
                    <Link
                      className='d-flex'
                      href={`/profile?userId=${comment?.userId}`}
                    >
                      <h6>{comment.user?.name[0] ?? ''}</h6>
                    </Link>
                    <span>{comment.creation_time ?? ''}</span>
                    <p>{comment.content ?? ''}</p>
                  </div>
                </div>
              </li>
            );
          })}

        {/* <li>
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
  </li> */}
      </ul>
    </>
  );
};
export default React.memo(ArticleComments);
