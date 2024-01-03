import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Col, Spinner } from 'react-bootstrap';
import parse from 'html-react-parser';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import pressicon from '@/assets/Img/Icons/icon-press-release.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
export default React.memo(function EntryListNewHome({
  Entries,
  connectModel
}: {
  Entries: any[];
  connectModel:any
}) {
  let router = useRouter();
  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);
  };
  return (
    <>
      {Entries.map((ent: any) => {
        return (
          <Col xl='3' lg='3' md='6' sm='6' key={ent[0]}>
            <div className='general-post'>
              <Image
                src={ent[1].image}
                className='mb-2'
                alt='general post'
                width={100}
                height={100}
                style={{ height: '134px', width: '100%', cursor: 'pointer' }}
                onClick={() =>
                  openArticleLink(
                    `/article?articleId=${ent[0].length != 0 ? ent[0] : '#'}`
                  )
                }
              />

              <div className='txt-pnl'>
                <Link
                  href={`/article?articleId=${
                    ent[0].length != 0 ? ent[0] : '#'
                  }`}
                  target='_self'
                >
                  <h6>
                    {ent[1].isPromoted ? (
                      <Tippy content={<p className='mb-0'>Promoted article</p>}>
                        <Image
                          src={promotedIcon}
                          alt='promoted'
                          style={{ width: 20, height: 20 }}
                        />
                      </Tippy>
                    ) : // <span className='publish-btn table-btn'>
                    //   promotedIcon
                    // </span>
                    ent[1].pressRelease ? (
                      <Tippy content={<p className='mb-0'>Press Release</p>}>
                        <Image
                          src={pressicon}
                          alt='promoted'
                          style={{ width: 20, height: 20 }}
                        />
                      </Tippy>
                    ) : (
                      <></>
                    )}{' '}
                    {ent[1].title.length > 60
                      ? `${ent[1].title.slice(0, 60)}...`
                      : ent[1].title}
                  </h6>
                </Link>
                <p
                  style={{
                    maxHeight: '75px',
                    overflowY: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    openArticleLink(
                      `/article?articleId=${ent[0].length != 0 ? ent[0] : '#'}`
                    )
                  }
                >
                  {parse(ent[1].description ?? '')}
                </p>
                <ul className='thumb-list'>
                  <li>
                    <a  href='#' onClick={connectModel}>
                      <Image src={iconthumb} alt='Icon Thumb' />{' '}
                      {Number(ent[1].likes) != 0 ? Number(ent[1].likes) : 0}
                    </a>
                  </li>
                  <li>
                    <a href='#' onClick={connectModel}>
                      <Image src={iconmessage} alt='Icon Comment' /> 12 Comments
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        );
      })}
    </>
  );
});
