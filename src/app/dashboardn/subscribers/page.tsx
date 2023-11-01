'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import entrypost from '@/assets/Img/Posts/entry-post.png';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import Sidebar from '@/components/SideBar/SideBar';

export default function Profile() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);

  // function isElementInViewport(elem) {
  //   const scroll = window.pageYOffset || document.documentElement.scrollTop;
  //   const windowHeight = window.innerHeight;
  //   const elemTop = elem.getBoundingClientRect().top + scroll;
  //   return elemTop - scroll < windowHeight;
  // }

  // function animateSections() {
  //   const elementsToAnimate = document.querySelectorAll('.scroll-anime');
  //   const elementsInViewport = [];
  //   elementsToAnimate.forEach((elem) => {
  //     if (isElementInViewport(elem)) {
  //       elem.classList.add('anime');
  //       elementsInViewport.push(elem);
  //     }
  //   });
  //   setAnimatedElements(elementsInViewport);
  // }

  // useEffect(() => {
  //   animateSections();
  //   window.addEventListener('scroll', animateSections);
  //   return () => {
  //     window.removeEventListener('scroll', animateSections);
  //   };
  // }, []);
  const [isBlack, setIsBlack] = useState(false);
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  return (
    <>
      <main id='main' className={`inner-main ${isBlack ? 'black' : ''}`}>
        <div className='Dashboard-main'>
          <div className='Dashboard-main-inner'>
            <Col xl='12' lg='12' md='12'>
              <h1>Subscribers</h1>
              <div className='spacer-20'></div>
            </Col>
            <Container fluid>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John doe</td>
                        <td>0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a</td>
                        <td>Johndoe@example.com</td>
                        <td>20-05-2023</td>
                        <td>
                          {' '}
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
                        </td>
                      </tr>
                      <tr>
                        <td>John doe</td>
                        <td>0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a</td>
                        <td>Johndoe@example.com</td>
                        <td>20-05-2023</td>
                        <td>
                          {' '}
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
                        </td>
                      </tr>
                      <tr>
                        <td>John doe</td>
                        <td>0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a</td>
                        <td>Johndoe@example.com</td>
                        <td>20-05-2023</td>
                        <td>
                          {' '}
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
                        </td>
                      </tr>
                      <tr>
                        <td>John doe</td>
                        <td>0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a</td>
                        <td>Johndoe@example.com</td>
                        <td>20-05-2023</td>
                        <td>
                          {' '}
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
                        </td>
                      </tr>
                      <tr>
                        <td>John doe</td>
                        <td>0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a</td>
                        <td>Johndoe@example.com</td>
                        <td>20-05-2023</td>
                        <td>
                          {' '}
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
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </main>
    </>
  );
}
