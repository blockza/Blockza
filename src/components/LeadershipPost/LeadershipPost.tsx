import React from 'react';
import 'slick-carousel/slick/slick.css';
import icpimage from '@/assets/Img/coin-image.png';
// import infinity1 from '@/assets/Img/Icons/icon-infinite3.png';
import infinity1 from '@/assets/Img/coin-image.png';
import iconcalender from '@/assets/Img/Icons/icon-calender.png';
import user from '@/assets/Img/user-bg.png';
import cup from '@/assets/Img/icon-cup.png';
import Girl from '@/assets/Img/Icons/icon-woman.png';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
export default function LeadershipPost({ more }: { more?: boolean }) {
  return (
    <>
      <div className='leader-ship-pnl'>
        <div className='text-right'>
          <a href='#' className='learn-more-btn'>
            Learn More
            <span>
              <i className='fa fa-angle-right'></i>
            </span>
          </a>
        </div>
        <h1>Leaderboard</h1>
        <h6> Additional Weekly ICP Tracks</h6>

        <div className='table-container'>
          <div className='table-container-inner'>
            <Table>
              <tbody>
                {more ? (
                  <>
                    <tr>
                      <td>
                        <b>5</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>6</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>7</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td>
                        <b>1</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>2</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>3</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <b>4</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='icp' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='icp' />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </div>
        </div>
        <div className='text-center'>
          <Link href='/NFTArticleLeaderboard' className='show-more-link'>
            Show more <i className='fa fa-caret-down'></i>
          </Link>
        </div>
      </div>
    </>
  );
}
