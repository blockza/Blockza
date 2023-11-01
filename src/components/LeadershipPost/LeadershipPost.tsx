import React from 'react';
import 'slick-carousel/slick/slick.css';
import infinity from '@/assets/Img/Icons/icon-infinite.png';
import infinity1 from '@/assets/Img/Icons/icon-infinite3.png';
import iconcalender from '@/assets/Img/Icons/icon-calender.png';
import user from '@/assets/Img/user-bg.png';
import cup from '@/assets/Img/icon-cup.png';
import Girl from '@/assets/Img/Icons/icon-woman.png';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
export default function LeadershipPost({ more }: { more: boolean }) {
  return (
    <>
      <div className='leader-ship-pnl'>
        <Image src={infinity} alt='Infinity' />
        <h1>ICP Leaderboard</h1>
        <h6> Additional Weekly ICP Tracks</h6>
        <ul className='winner-list'>
          <li>
            <div className='winner-post second-p'>
              <div className='img-pnl'>
                <Image src={user} alt='user' />
              </div>
              <div className='txt-pnl'>
                <h2>Name</h2>
                <h3>#54513</h3>
                <h4>+364,500</h4>
              </div>
            </div>
          </li>
          <li>
            <div className='winner-post first-p'>
              <div className='cup-pnl'>
                <Image src={cup} alt='Cup' />
              </div>
              <div className='img-pnl'>
                <Image src={user} alt='user' />
              </div>
              <div className='txt-pnl'>
                <h2>Name</h2>
                <h3>#54513</h3>
                <h4>+364,500</h4>
              </div>
            </div>
          </li>
          <li>
            <div className='winner-post third-p'>
              <div className='img-pnl'>
                <Image src={user} alt='user' />
              </div>
              <div className='txt-pnl'>
                <h2>Name</h2>
                <h3>#54513</h3>
                <h4>+364,500</h4>
              </div>
            </div>
          </li>
        </ul>
        <div className='table-container'>
          <div className='table-container-inner'>
            <Table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Highest Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <div className='calender-pnl'>
                      <ul>
                        <li>
                          <Image src={iconcalender} alt='Calender' /> Oct 11 -
                          Oct 18
                        </li>
                        <li>
                          End in <span>1d : 18h : 18m</span>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                {more ?
                  <>
                    <tr>
                      <td>
                        <b>4</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='Infinity' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='Infinity' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>5</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='Infinity' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='Infinity' />
                      </td>
                    </tr><tr>
                      <td>
                        <b>6</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='Infinity' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='Infinity' />
                      </td>
                    </tr><tr>
                      <td>
                        <b>7</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='Infinity' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='Infinity' />
                      </td>
                    </tr>
                  </> : <>
                    <tr>
                      <td>
                        <b>1</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='Infinity' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='Infinity' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>2</b>
                      </td>
                      <td>
                        <div className='d-flex'>
                          <div className='img-pnl'>
                            <Image src={Girl} alt='Infinity' />
                          </div>
                          <div className='txt-pnl'>
                            <h4>Mfo imo</h4>
                            <h5>#54134</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        +364,500 <Image src={infinity1} alt='Infinity' />
                      </td>
                    </tr>
                  </>
                }
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
