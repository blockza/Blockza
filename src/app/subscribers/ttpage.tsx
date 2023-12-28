'use client';
import React from 'react';
import Head from 'next/head';
import {
  Row,
  Col,
  Table,
  Dropdown,
  Form,
} from 'react-bootstrap';


/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */


export default function subscribers() {
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <Head>
            <title>Hi</title>
          </Head>
          <div className='section' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className='pbg-pnl text-left'>
                  <Row>
                    <Col xl='12' lg='12'>
                      <div className='full-div text-right'>
                        <div className='search-post-pnl'>
                          <input type='text' placeholder='Search Posts' />
                          <button>
                            <i className='fa fa-search'></i>
                          </button>
                        </div>
                      </div>
                    </Col>
                    {/* <Col xl='12' lg='12'>
                      <ul className='all-filters-list'>
                        <li>
                          <span className='active'>
                            <p>All</p>
                          </span>
                        </li>
                        <li>
                          <span className='active'>
                            <p> Mine </p>
                          </span>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>Minted article</p>
                            (1,658)
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>Pending</p>
                            (8)
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>Drafts</p>
                            (1)
                          </Link>
                        </li>
                      </ul>
                    </Col> */}
                    <Col xl='6' lg='12'>
                      <div className='full-div'>
                        <ul className='filter-list'>
                          <li>
                            <Form.Select aria-label='All Dates'>
                              <option>All Dates</option>
                              <option value='1'>All Dates</option>
                              <option value='2'>All Dates</option>
                              <option value='3'>All Dates</option>
                            </Form.Select>
                          </li>
                          <li>
                            <Form.Select aria-label='All Categories'>
                              <option>All Categories</option>
                              <option value='1'>All Categories</option>
                              <option value='2'>All Categories</option>
                              <option value='3'>All Categories</option>
                            </Form.Select>
                          </li>
                          <li>
                            <Dropdown>
                              <Dropdown.Toggle id='dropdown-basic'>
                                Filter
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item href='#/action-1'>
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-2'>
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href='#/action-3'>
                                  Something else
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </li>
                        </ul>
                      </div>
                    </Col>
                    <Col xl='6' lg='12'>
                      <div className='pagination-container'>

                      </div>
                    </Col>
                    <Col xl="12" lg="12">
                      <div className='full-div'>
                        <div className='table-container lg'>
                          <div className='table-inner-container'>
                            <Table className='article-table simple'>
                              <thead>
                                <tr>
                                  <th>
                                    #
                                  </th>
                                  <th>
                                    Name
                                  </th>
                                  <th>
                                    Address
                                  </th>
                                  <th>
                                    Email
                                  </th>
                                  <th>
                                    Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>01</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>02</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>03</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>04</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>05</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>06</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>07</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>08</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>09</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                                <tr>
                                  <td>10</td>
                                  <td>Jphn Doe</td>
                                  <td>0x71deas222ass2222dj122115asd41114454411221sss</td>
                                  <td>JphnDoe@example.com</td>
                                  <td>20-01-2023</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
