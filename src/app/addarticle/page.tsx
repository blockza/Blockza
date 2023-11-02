'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Accordion, Tab, Tabs } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import iconmedia from '@/assets/Img/Icons/icon-media.png';
import media from '@/assets/Img/media.png';
import Footer from '@/components/Footer/Footer';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function addarticle() {
  const allEventKeys = ['0', '1', '2'];
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xxl="8" xl="8" lg="12" md="12">
                <div className='pbg-pnl text-left'>
                  <Form>
                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                      <Form.Label>Add Title</Form.Label>
                      <Form.Control type="text" placeholder="Enter title here" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                      <Button className="grey-button"><Image src={iconmedia} alt="Media" /> Add Media</Button>
                      <div className="full-div">
                        <Image src={media} alt="Media" />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                      <div className="flex-div-xs ">
                        <Form.Label>SEO Title</Form.Label>
                        <div>
                          <Button className="grey-button"><i className='fa fa-smile-o'></i></Button>
                          <Button className="grey-button ml-5">Insert variable</Button>
                        </div>
                      </div>
                      <Form.Control type="text" placeholder="Title" />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                      <div className="flex-div-xs">
                        <Form.Label>Slug</Form.Label>
                        <div>
                          <Button className="grey-button"><i className='fa fa-smile-o'></i></Button>
                          <Button className="grey-button ml-5">Insert variable</Button>
                        </div>
                      </div>
                      <Form.Control type="text" placeholder="" />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                      <Form.Label>Meta Description</Form.Label>
                      <Form.Control className='small' as="textarea" rows={3} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Excerpt</Form.Label>
                      <Form.Control className='small' as="textarea" rows={3} />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
              <Col xxl="4" xl="4" className='text-left'>
                <Accordion defaultActiveKey={allEventKeys}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      Publish
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up'></i>
                        </li>
                        <li>
                          <i className='fa fa-angle-down'></i>
                        </li>
                        <li>
                          <i className='fa fa-caret-up'></i>
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="flex-div">
                        <Link className='grey-brdr-btn' href="#">Save Drift</Link>
                        <Link className='grey-brdr-btn' href="#">Preview</Link>
                      </div>
                      <p>
                        Status: <span>Draft</span> <Link href="#">Edit</Link>
                      </p>
                      <p>
                        Visibility:  <span>Public </span> <Link href="#">Edit</Link>
                      </p>
                      <p>
                        Publish  <span>Immediately </span> <Link href="#">Edit</Link>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <div className='linkeee'>
                    <div className="flex-div">
                      <Link className='red-link' href="#">Move To Trash</Link>
                      <Link className='publish-btn' href="#">Publish</Link>
                    </div>
                  </div>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      Categories
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up'></i>
                        </li>
                        <li>
                          <i className='fa fa-angle-down'></i>
                        </li>
                        <li>
                          <i className='fa fa-caret-up'></i>
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Tabs defaultActiveKey="AllCategories" id="uncontrolled-tab-example"
                        className="category-tabs"
                      >
                        <Tab eventKey="AllCategories" title="All Categories">
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                        </Tab>
                        <Tab eventKey="Mostused" title="Most used">
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                          <p>Category Name One</p>
                        </Tab>
                      </Tabs>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      Featured Image
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up'></i>
                        </li>
                        <li>
                          <i className='fa fa-angle-down'></i>
                        </li>
                        <li>
                          <i className='fa fa-caret-up'></i>
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        <Link href="#">See Featured Image</Link>
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </div>
        </div>
      </main>
      <Footer />

    </>
  );
}
