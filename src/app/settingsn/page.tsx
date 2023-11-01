'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
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

  function isElementInViewport(elem) {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elemTop = elem.getBoundingClientRect().top + scroll;
    return elemTop - scroll < windowHeight;
  }

  function animateSections() {
    const elementsToAnimate = document.querySelectorAll('.scroll-anime');
    const elementsInViewport = [];
    elementsToAnimate.forEach((elem) => {
      if (isElementInViewport(elem)) {
        elem.classList.add('anime');
        elementsInViewport.push(elem);
      }
    });
    setAnimatedElements(elementsInViewport);
  }

  useEffect(() => {
    animateSections();
    window.addEventListener('scroll', animateSections);
    return () => {
      window.removeEventListener('scroll', animateSections);
    };
  }, []);
  const [isBlack, setIsBlack] = useState(false);
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  return (
    <>
      <main id='main' className={`inner-main ${isBlack ? 'black' : ''}`}>
        {/* NavBar */}
        <NavBarDash handleButtonClick={handleButtonClick} />
        {/* NavBar */}

        {/* SideBar */}
        <Sidebar />
        {/* SideBar */}

        <div className='Dashboard-main'>
          <div className='Dashboard-main-inner'>
            <Container fluid>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='spacer-20'></div>
                </Col>
                <Col xl='12' lg='12' md='12'>
                  <div className='form-pnl'>
                    <h2>Verify your email address</h2>
                    <p>
                      Connect and verify your email to receive notifications
                      from Mirror.
                    </p>
                    <Form>
                      <Row>
                        <Col xl='9' lg='9'>
                          <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput1'
                          >
                            <Form.Control
                              type='email'
                              placeholder='Enter email address'
                            />
                          </Form.Group>
                        </Col>
                        <Col xl='3' lg='3'>
                          <Button>Verify Email</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12'>
                  <div className='form-pnl'>
                    <h2>Twitter</h2>
                    <p>Link your Twitter account</p>
                    <Form>
                      <Row>
                        <Col xl='9' lg='9'>
                          <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput1'
                          >
                            <Form.Control
                              type='text'
                              placeholder='No Twitter account linked'
                            />
                          </Form.Group>
                        </Col>
                        <Col xl='3' lg='3'>
                          <Button>Authorize on Twitter</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12'>
                  <div className='form-pnl'>
                    <h2>ENS</h2>
                    <p className='m-0'>
                      Setting your Primary ENS name replaces the address in all
                      your links created on Mirror with your ENS name.
                    </p>
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12'>
                  <div className='form-pnl'>
                    <h2>Google Analytics Tag ID</h2>
                    <p>
                      Basic support for Google Analytics 4. Must be a Google
                      Analytics Tag ID.
                    </p>
                    <Form>
                      <Form.Group
                        className='mb-3'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Control type='text' placeholder='G-xxxxxxxxxxx' />
                      </Form.Group>
                    </Form>
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12' className='text-right'>
                  <Form>
                    <Button className='yellow-btn'>Save Settings</Button>
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </main>
    </>
  );
}
