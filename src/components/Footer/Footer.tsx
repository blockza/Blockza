'use client';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import logo from '@/assets/Img/Logo/Logo-2.png';
import Footerlogo from '@/assets/Img/Logo/Footer-logo.png';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
export default function Footer() {
  const path = usePathname();
  const route = path.split('/')[1];
  return (
    <>
      {route !== 'superadmin' && (
        <>
          <div className='footer scroll-anime full-div'>
            <Row>
              <Col xl='3' lg='12' md='12'>
                <Link href='#;' className='footer-logo'>
                  <Image src={logo} alt='Logo' />
                </Link>
                <h4 className='blue-text'>
                  Y our go-to for Web3, Blockchain, Crypto, & Metaverse AI news
                  and insights. Stay informed and ahead with us!
                </h4>
              </Col>
              <Col xl='9' lg='12' md='12'>
                <Row>
                  <Col xl='3' lg='3' md='3'>
                    <h6>About Us</h6>
                    <ul>
                      <li>
                        <Link href='#;'>About Us</Link>
                      </li>
                      <li>
                        <Link href='#;'>About Hinza Asif</Link>
                      </li>
                      <li>
                        <Link href='#;'>Career</Link>
                      </li>
                      <li>
                        <Link href='#;'>Contact Us</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col xl='3' lg='3' md='3'>
                    <h6>Our Services</h6>
                    <ul>
                      <li>
                        <Link href='#;'>Advertise with Us</Link>
                      </li>
                      <li>
                        <Link href='#;'>Hackathon</Link>
                      </li>
                      <li>
                        <Link href='#;'>Web3 Accelerators</Link>
                      </li>
                      <li>
                        <Link href='#;'>Experts Alliance</Link>
                      </li>
                      <li>
                        <Link href='#;'>About Alliance</Link>
                      </li>
                      <li>
                        <Link href='#;'>Alliance Benefits</Link>
                      </li>
                      <li>
                        <Link href='#;'>Membership Requirements</Link>
                      </li>
                      <li>
                        <Link href='#;'>Apply Alliance</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col xl='3' lg='3' md='3'>
                    <h6>Top Categories</h6>
                    <ul>
                      <li>
                        <Link href='#;'>News</Link>
                      </li>
                      <li>
                        <Link href='#;'>Press Release</Link>
                      </li>
                      <li>
                        <Link href='#;'>NFT Collection Review</Link>
                      </li>
                      <li>
                        <Link href='#;'>Blockchain Game Review</Link>
                      </li>
                      <li>
                        <Link href='#;'>WEB3 Guide</Link>
                      </li>
                      <li>
                        <Link href='#;'>Events</Link>
                      </li>
                    </ul>
                  </Col>
                  <Col xl='3' lg='3' md='3'>
                    <h6>Our Policy</h6>
                    <ul>
                      <li>
                        <Link href='#;'>Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href='#;'>Terms of Use</Link>
                      </li>
                      <li>
                        <Link href='#;'>Ethics Policy</Link>
                      </li>
                      <li>
                        <Link href='#;'>Do Not Sell My Personal Info</Link>
                      </li>
                      <li>
                        <Link href='#;'>Disclaimer</Link>
                      </li>
                      <li>
                        <Link href='#;'>Contact Us</Link>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='flex-div-xs'>
                  <Image className='footer-logo' src={Footerlogo} alt='Logo' />
                  <div>
                    <ul className='footer-social-list'>
                      <li>
                        <h4>Follow Us</h4>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.facebook.com/nftstudio24.eth'
                        >
                          <i className='fa fa-facebook'></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://twitter.com/nftstudio24'
                        >
                          <i className='fa fa-twitter'></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.youtube.com/channel/UCO18Z_ft-kBWh4g7rXqqeLQ'
                        >
                          <i className='fa fa-youtube-play'></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.instagram.com/nftstudio24/'
                        >
                          <i className='fa fa-instagram'></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://www.linkedin.com/company/nftstudio24-com?trk=public_profile_experience-item_profile-section-card_image-click&originalSubdomain=ng'
                        >
                          <i className='fa fa-linkedin'></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href='https://t.me/NFTStudio24_official'
                        >
                          <i className='fa fa-telegram'></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='footer-bottom'>
                  <h6 className='m-0'>
                    © 2023 NFTStudio24.com . All Rights Reserved.
                  </h6>
                  <p className='m-0'>
                    Please note that our <Link href='#;'>privacy policy</Link>,{' '}
                    <Link href='#;'>terms of use</Link>, cookies, and{' '}
                    <Link href='#;'>do not sell my personal information</Link>{' '}
                    has been updated.
                  </p>
                  <p>
                    The leader in news and information on cryptocurrency,
                    digital assets and the future of money, NFTStudio24 is a
                    decentralized media outlet that strives for the highest
                    journalistic standards and abides by a{' '}
                    <Link href='#;'>strict set of editorial policies</Link>.
                    NFTStudio24 is an independent operating subsidiary of Diki
                    Co ltd Japan, which invests in cryptocurrencies and
                    blockchain startups. As part of their compensation, certain
                    NFTStudio24 employees, including editorial employees, may
                    receive exposure to Daiki Co Ltd equity in the form of stock
                    appreciation rights, which vest over a multi-year period.
                    NFTStudio24 journalists are not allowed to purchase stock
                    outright in Daiki Co Ltd.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}
