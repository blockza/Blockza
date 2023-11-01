'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import entrypost from '@/assets/Img/Posts/nft-post.png';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import Sidebar from '@/components/SideBar/SideBar';

export default function Profile() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);

  const [isBlack, setIsBlack] = useState(false);
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  return (
    <>
      <main id='main' className={`inner-main ${isBlack ? 'black' : ''}`}>
        {/* NavBar */}
        {/* <NavBarDash handleButtonClick={handleButtonClick} /> */}
        {/* NavBar */}

        {/* SideBar */}
        {/* <Sidebar /> */}
        {/* SideBar */}
        <div className='Dashboard-main'>
          <Col xl='12' lg='12' md='12'>
            <Link href='/entriesn' className='back-btn'>
              <i className='fa fa-angle-left'></i> Back
            </Link>
            <Breadcrumb>
              <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Data</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <div className='Dashboard-main-inner'>
            <Container fluid>
              <Row>
                <Container>
                  <Row>
                    <Col xl='12' lg='12' md='12'>
                      <div className='entry-post'>
                        <div className='img-pnl'>
                          <Image src={entrypost} alt='Post' />
                        </div>
                        <div className='txt-pnl'>
                          <div className='flex-div'>
                            <div>
                              <h4>
                                HYPERVIEW: It's Estelle Flores World, We're Just
                                Living In It
                              </h4>
                              <p>
                                Video games, both culturally and visually, have
                                sparked the imagination of countless artists.
                                Yet, when an artistVideo games, both
                                culturally...
                              </p>
                            </div>
                            <div>
                              <DropdownButton
                                id='dropdown-basic-button'
                                className='dot-dropdown-btn'
                                title={<i className='fa fa-ellipsis-h'></i>}
                              >
                                <Dropdown.Item href='#/action-1'>
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-2'>
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-3'>
                                  Something else
                                </Dropdown.Item>
                              </DropdownButton>
                            </div>
                          </div>

                          <div className='flex-div'>
                            <span>September 30</span>
                            <Link className='angle-btn' href='#'>
                              <i className='fa fa-angle-right'></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className='entry-post'>
                        <div className='img-pnl'>
                          <Image src={entrypost} alt='Post' />
                        </div>
                        <div className='txt-pnl'>
                          <div className='flex-div'>
                            <div>
                              <h4>
                                HYPERVIEW: It's Estelle Flores World, We're Just
                                Living In It
                              </h4>
                              <p>
                                Video games, both culturally and visually, have
                                sparked the imagination of countless artists.
                                Yet, when an artistVideo games, both
                                culturally...
                              </p>
                            </div>
                            <div>
                              <DropdownButton
                                id='dropdown-basic-button'
                                className='dot-dropdown-btn'
                                title={<i className='fa fa-ellipsis-h'></i>}
                              >
                                <Dropdown.Item href='#/action-1'>
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-2'>
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-3'>
                                  Something else
                                </Dropdown.Item>
                              </DropdownButton>
                            </div>
                          </div>

                          <div className='flex-div'>
                            <span>September 30</span>
                            <Link className='angle-btn' href='#'>
                              <i className='fa fa-angle-right'></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className='entry-post'>
                        <div className='img-pnl'>
                          <Image src={entrypost} alt='Post' />
                        </div>
                        <div className='txt-pnl'>
                          <div className='flex-div'>
                            <div>
                              <h4>
                                HYPERVIEW: It's Estelle Flores World, We're Just
                                Living In It
                              </h4>
                              <p>
                                Video games, both culturally and visually, have
                                sparked the imagination of countless artists.
                                Yet, when an artistVideo games, both
                                culturally...
                              </p>
                            </div>
                            <div>
                              <DropdownButton
                                id='dropdown-basic-button'
                                className='dot-dropdown-btn'
                                title={<i className='fa fa-ellipsis-h'></i>}
                              >
                                <Dropdown.Item href='#/action-1'>
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-2'>
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-3'>
                                  Something else
                                </Dropdown.Item>
                              </DropdownButton>
                            </div>
                          </div>

                          <div className='flex-div'>
                            <span>September 30</span>
                            <Link className='angle-btn' href='#'>
                              <i className='fa fa-angle-right'></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className='entry-post'>
                        <div className='img-pnl'>
                          <Image src={entrypost} alt='Post' />
                        </div>
                        <div className='txt-pnl'>
                          <div className='flex-div'>
                            <div>
                              <h4>
                                HYPERVIEW: It's Estelle Flores World, We're Just
                                Living In It
                              </h4>
                              <p>
                                Video games, both culturally and visually, have
                                sparked the imagination of countless artists.
                                Yet, when an artistVideo games, both
                                culturally...
                              </p>
                            </div>
                            <div>
                              <DropdownButton
                                id='dropdown-basic-button'
                                className='dot-dropdown-btn'
                                title={<i className='fa fa-ellipsis-h'></i>}
                              >
                                <Dropdown.Item href='#/action-1'>
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-2'>
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-3'>
                                  Something else
                                </Dropdown.Item>
                              </DropdownButton>
                            </div>
                          </div>

                          <div className='flex-div'>
                            <span>September 30</span>
                            <Link className='angle-btn' href='#'>
                              <i className='fa fa-angle-right'></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className='entry-post'>
                        <div className='img-pnl'>
                          <Image src={entrypost} alt='Post' />
                        </div>
                        <div className='txt-pnl'>
                          <div className='flex-div'>
                            <div>
                              <h4>
                                HYPERVIEW: It's Estelle Flores World, We're Just
                                Living In It
                              </h4>
                              <p>
                                Video games, both culturally and visually, have
                                sparked the imagination of countless artists.
                                Yet, when an artistVideo games, both
                                culturally...
                              </p>
                            </div>
                            <div>
                              <DropdownButton
                                id='dropdown-basic-button'
                                className='dot-dropdown-btn'
                                title={<i className='fa fa-ellipsis-h'></i>}
                              >
                                <Dropdown.Item href='#/action-1'>
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-2'>
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-3'>
                                  Something else
                                </Dropdown.Item>
                              </DropdownButton>
                            </div>
                          </div>

                          <div className='flex-div'>
                            <span>September 30</span>
                            <Link className='angle-btn' href='#'>
                              <i className='fa fa-angle-right'></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </Row>
            </Container>
          </div>
        </div>
      </main>
    </>
  );
}
