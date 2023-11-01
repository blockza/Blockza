'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import heroimg from '@/assets/Img/Heroimg.png';
import Step1 from '@/assets/Img/Icons/icon-events.png';
import Step2 from '@/assets/Img/Icons/icon-events1.png';
import Step3 from '@/assets/Img/Icons/icon-education.png';
import Step4 from '@/assets/Img/Icons/icon-education1.png';
import Step5 from '@/assets/Img/Icons/icon-hackathon.png';
import Step6 from '@/assets/Img/Icons/icon-hackathon1.png';
import icontwitter from '@/assets/Img/Icons/icon-twitter.png';
import icontwitter1 from '@/assets/Img/Icons/icon-twitter-1.png';
import iconfacebook from '@/assets/Img/Icons/icon-facebook.png';
import iconfacebook1 from '@/assets/Img/Icons/icon-facebook-1.png';
import iconyoutube from '@/assets/Img/Icons/icon-youtube.png';
import iconyoutube1 from '@/assets/Img/Icons/icon-youtube-1.png';
import iconlinkedin from '@/assets/Img/Icons/icon-linkedin.png';
import iconlinkedin1 from '@/assets/Img/Icons/icon-linkedin-1.png';
import iconinstagram from '@/assets/Img/Icons/icon-instagram.png';
import iconinstagram1 from '@/assets/Img/Icons/icon-instagram-1.png';
import icontelegram from '@/assets/Img/Icons/icon-telegram.png';
import icontelegram1 from '@/assets/Img/Icons/icon-telegram-1.png';
import hotnews from '@/assets/Img/Icons/icon-fire.png';
import podcast from '@/assets/Img/Icons/icon-podcast.png';
import podcastuser from '@/assets/Img/Profile/Podcast.png';
import BigPost from '@/components/BigPost/BigPost';
import videopost from "@/assets/Img/Posts/video.png";
import FeaturedPost from '@/components/FeaturedPost/FeaturedPost';
import TrendingPost from '@/components/ProductSlider/ProductSlider';
import SocialList from '@/components/SocialList/SocialList';
import Footer from '@/components/Footer/Footer';
import NavBar from '@/components/NavBar/NavBar';
import Step1 from '@/assets/Img/Icons/icon-events.png';
import Step2 from '@/assets/Img/Icons/icon-events1.png';
import Step3 from '@/assets/Img/Icons/icon-education.png';
import Step4 from '@/assets/Img/Icons/icon-education1.png';
import Step5 from '@/assets/Img/Icons/icon-hackathon.png';
import Step6 from '@/assets/Img/Icons/icon-hackathon1.png';
import ArticlesPost from '@/components/ArticlesPost/ArticlesPost';
import StoriesPost from '@/components/StoriesPost/StoriesPost';
import ReleasePost from '@/components/ReleasePost/ReleasePost';
import VideoPost from '@/components/VideoPost/VideoPost';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Nav, Navbar, Button, Modal } from 'react-bootstrap';
import logo from '@/assets/Img/Logo/Logo.png';
import logo2 from '@/assets/Img/Logo/Logo-2.png';
import Infinity from '@/assets/Img/Icons/infinity.png';
import Wallet from '@/assets/Img/Icons/plug-wallet.png';
import Connect from '@/components/Connect/Connect';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const router = useRouter();
  const [animatedElements, setAnimatedElements] = useState([]);

  function isElementInViewport(elem: any) {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const elemTop = elem.getBoundingClientRect().top + scroll;
    return elemTop - scroll < windowHeight;
  }

  function animateSections() {
    const elementsToAnimate = document.querySelectorAll('.scroll-anime');
    const elementsInViewport: any = [];
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
  // router.push('/route')

  const steps = [
    {
      img: Step1,
      img1: Step2,
      title: 'Education',
      description: 'Your Source for Web3, Blockchain, Crypto, and Metaverse AI News.',
    },
    {
      img: Step3,
      img1: Step4,
      title: 'Events',
      description: 'Mapping Top Blockchain & Crypto Events Worldwide.',
    },
    {
      img: Step5,
      img1: Step6,
      title: 'Hackathons',
      description: 'NFTStudio24: Global Partners in Organizing Hackathons.',
    },
  ];
  // Initialize the active step index in state
  const [activeStep, setActiveStep] = useState(0);
  // Function to update the active step every specified interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000); // Change the interval as needed (3000 milliseconds = 3 seconds)
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  // Initialize the active step index in state
  // Dark Theme
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>();

  // const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Function to toggle the class
  const toggleThemeClass = () => {
    setIsThemeActive(!isThemeActive);
  };
  // Dark Theme

  const steps = [
    {
      img: Step1,
      img1: Step2,
      title: 'Education',
      description: 'Your Source for Web3, Blockchain, Crypto, and Metaverse AI News.',
    },
    {
      img: Step3,
      img1: Step4,
      title: 'Events',
      description: 'Mapping Top Blockchain & Crypto Events Worldwide.',
    },
    {
      img: Step5,
      img1: Step6,
      title: 'Hackathons',
      description: 'NFTStudio24: Global Partners in Organizing Hackathons.',
    },
  ];
  // Initialize the active step index in state
  const [activeStep, setActiveStep] = useState(0);
  // Function to update the active step every specified interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000); // Change the interval as needed (3000 milliseconds = 3 seconds)
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  // Initialize the active step index in state
  return (
    <>

      <Navbar expand='lg'>
        <Container>
          <div className='nav-top'>
            <Button className='search-btn'>
              <i className='fa fa-search'></i>
              <span></span>
            </Button>
            <Navbar.Brand href='/'>
              <Image src={logo} alt='Logo' />
              <Image src={logo2} alt='Logo' />
            </Navbar.Brand>
            <div className='d-flex align-items-center justify-content-between '>
              <Button
                className={`themebtn ${isThemeActive ? 'active' : ''}`}
                onClick={() => {
                  toggleThemeClass();
                  handleButtonClick(); // Call your handleButtonClick function here
                }}
              >
                <i className='fa fa-sun-o'></i>
                <i className='fa fa-moon-o'></i>
              </Button>
              <Link href="javascript:void(0);" className='connect-btn' onClick={handleShow}>Connect</Link>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </div>
          </div>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav>
              <Nav.Link href='/'>Home</Nav.Link>
              <Nav.Link href='#'>News</Nav.Link>
              <Nav.Link href='#'>Press Release</Nav.Link>
              <Nav.Link href='#'>Interviews</Nav.Link>
              <Nav.Link href='#'>Expert Alliance</Nav.Link>
              <Nav.Link href='#'>Guide</Nav.Link>
              <Nav.Link href='#'>Forums</Nav.Link>
              <Nav.Link href='#'>Events</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Hot News Panel */}
      <Container className='news-post scroll-anime' fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='10' lg='10' md='12'>
                <Row>
                  <Col xl='12' lg='12' md='12' className='heading-pnl'>
                    <hr></hr>
                    <div className='spacer-20'></div>
                    <h1><Image src={hotnews} alt="Hot News" />Hot News</h1>
                    <p>The most interesting content collected by our team.</p>
                  </Col>
                  <Col xl='4' lg='4' md='6' sm='6'>
                    <TrendingPost />
                  </Col>
                  <Col xl='4' lg='4' md='6' sm='6'>
                    <TrendingPost />
                  </Col>
                  <Col xl='4' lg='4' md='6' sm='6'>
                    <TrendingPost />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Hot News Panel */}

      {/* Big Post */}
      <Container className='section scroll-anime' fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <BigPost />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Big Post */}

      {/* Articles Panel */}
      <Container className='article-pnl scroll-anime section' fluid>
        <Row>
          <Container>
            <Row>
              <Col xl="12" lg="12" className='heading-pnl'>
                <h1>Articles From Different Sites</h1>
                <p>
                  The most interesting content collected by our team.
                </p>
              </Col>
              <Col xl="3" lg="4" md="6">
                <ArticlesPost />
              </Col>
              <Col xl="3" lg="4" md="6" >
                <ArticlesPost />
              </Col>
              <Col xl="3" lg="4" md="6">
                <ArticlesPost />
              </Col>
              <Col xl="3" lg="4" md="6" >
                <ArticlesPost />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Articles Panel */}
      {/* Step Panel */}
      <Container className='scroll-anime' fluid>
        <Row>
          <Container>
            <Row>
              <ul id="steps" className='steps-list step-nav'>
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className={`step ${index === activeStep ? 'active' : ''}`}
                  >
                    <div className='steps-inner'>
                      <div className='img-pnl'>
                        <Image src={step.img} alt={`slide ${index}`} />
                        <Image src={step.img1} alt={`slide ${index}`} />
                      </div>
                      <div className='txt-pnl'>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Step Panel */}
      {/* Landing Panel */}
      <ul className='social-list'>
        <li>
          <Link href="/" className='twitter-li' target="_blank">
            <span>
              <Image src={icontwitter} alt="Twitter" />
              <Image src={icontwitter1} alt="Twitter" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/" className='facebook-li' target="_blank">
            <span>
              <Image src={iconfacebook} alt="facebook" />
              <Image src={iconfacebook1} alt="facebook" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/" className='linkedin-li' target="_blank">
            <span>
              <Image src={iconlinkedin} alt="linkedin" />
              <Image src={iconlinkedin1} alt="linkedin" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/" className='youtube-li' target="_blank">
            <span>
              <Image src={iconyoutube} alt="youtube" />
              <Image src={iconyoutube1} alt="youtube" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/" className='instagram-li' target="_blank">
            <span>
              <Image src={iconinstagram} alt="Instagram" />
              <Image src={iconinstagram1} alt="Instagram" />
            </span>
          </Link>
        </li>
        <li>
          <Link href="/" className='telegram-li' target="_blank">
            <span>
              <Image src={icontelegram} alt="icontelegram" />
              <Image src={icontelegram1} alt="icontelegram" />
            </span>
          </Link>
        </li>
      </ul>
      <Container className='landing' fluid>
        <Row>
          <Container>
            <div className='bottom-b1'></div>
            <div className='bottom-b2'></div>
            <div className='bottom-b3'></div>
            <Row>
              <Col xl='3' lg='3' md='12'>
                <h2>Featured</h2>
                <div className='spacer-20'></div>
                <Row>
                  <Col xl='12' lg='12' md='12'>
                    <FeaturedPost />
                  </Col>
                </Row>
              </Col>
              <Col xl='6' lg='6' md='12'>
                <div className='hero-panel'>
                  <Image src={heroimg} alt='HEro' />
                  <h1>Intro to Fashion, Web3, and AI</h1>
                  <h5>
                    Earn a free on-chain certificate by taking Decrypt U's free
                    course, Fashion, Web3, and AI. Learn how emerging
                    technologies are revolutionizing the fashion world in every
                    aspect from generative design to wearable tech. Decrypt will
                    cover the gas fees for the first 10,000 mints!
                  </h5>
                  <Link href='/' className='reg-btn'>
                    Go to Course <i className='fa fa-arrow-right'></i>
                  </Link>
                </div>
              </Col>
              <Col xl='3' lg='3' md='12'>
                <h2>Trending</h2>
                <div className='spacer-20'></div>
                <Row>
                  <Col xl='12' lg='12' md='6' sm='6'>
                    <TrendingPost />
                  </Col>
                  <Col xl='12' lg='12' md='6' sm='6'>
                    <TrendingPost />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Landing Panel */}
      {/* Connect Modal */}
      <Modal show={show} centered size="md" onHide={handleClose}>
        <Modal.Body>
          <div className='flex-div connect-heading-pnl'>
            <i className='fa fa-question-circle-o'></i>
            <p>Connect Wallet</p>
            <Button className='close-btn' onClick={handleClose}><i className='fa fa-close'></i></Button>
          </div>
          <div className='full-div'>
            <Button className='grey-btn'>
              <p>Plug Wallet</p>
              <Image src={Wallet} alt="Wallet" />
            </Button>
            <Link href="/entriesn" className='grey-btn'>
              <p>Internet Identity</p>
              <Image src={Infinity} alt="Infinity" />
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      {/* Connect Modal */}
      {/* Add Panel */}
      <Container className='add-panel scroll-anime' fluid>
        <Row>
          <Container>
            <Row>
              <Col xl="12" lg="12">
                <div className='add-pnl'>
                  <h1>Advertisement</h1>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Add Panel */}

      {/* Release Post Panel */}
      <Container className='section scroll-anime' fluid>
        <Row>
          <Container>
            <Row>
              <Col xl="12" lg="12" className='heading-pnl'>
                <h1>Press Releases</h1>
                <div className='spacer-20'></div>
                <ReleasePost />
                <div className='text-right-sm'>
                  <Link className='simple-btn' href="#">All Press Releases <i className='fa fa-angle-right'></i></Link>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Release Post Panel */}

      {/* Video Posts Panel */}
      <Container className='section videos-pnl scroll-anime' fluid>
        <Row>
          <Container>
            <Row>
              <Col xl="12" lg="12" className='heading-pnl'>
                <h1>Videos</h1>
                <h4 >Watch candid conversations, live event coverage, and on-the-street reporting.</h4>
                <div className='spacer-20'></div>
              </Col>
              <Col xl="9" lg="9">
                <Row>
                  <Col xl="12" lg="12">
                    <div className='Video-post big'>
                      <div className='Video-post-inner'>
                        <div className='img-pnl'>
                          <Link href="/"><Image src={videopost} alt="Post" /></Link>
                          <Button className="play-btn"><i className='fa fa-play-circle-o'></i></Button>
                        </div>
                        <div className='txt-pnl'>
                          <h5>HYPERVIEW: It's Estelle Flores World, We're Just Living In It</h5>
                          <div className='d-flex'>
                            <span>2 m 25s <i className='fa fa-clock-o'></i></span>
                            <span>September 30</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xl="4" lg="4" md="6">
                    <VideoPost />
                  </Col>
                  <Col xl="4" lg="4" md="6">
                    <VideoPost />
                  </Col>
                  <Col xl="4" lg="4" md="6">
                    <VideoPost />
                  </Col>
                </Row>
              </Col>
              <Col xl="3" lg="3">
                <VideoPost />
                <VideoPost />
                <VideoPost />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Video Posts Panel */}
    </>
  );
}
