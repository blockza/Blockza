'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import home1 from '@/assets/Img/Icons/icon-home-3.png';
import feedback from '@/assets/Img/Icons/icon-comment-1.png';
import plus1 from '@/assets/Img/Icons/icon-plus.png';
import logo from '@/assets/Img/Logo/logo-small.png';
import logo2 from '@/assets/Img/Logo/logo-small.png';
import Connect from '@/components/Connect/Connect';
import { useThemeStore } from '@/store/useStore';
import { usePathname } from 'next/navigation';
export default function NavBar() {
  // Dark Theme
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [toggle, settoggle] = React.useState(false);
  const location = usePathname();
  const [tab, setTab] = useState<any>('');
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { isBlack, setIsBlack, isOpen, setIsOpen } = useThemeStore((state) => ({
    isBlack: state.isBlack,
    isOpen: state.isOpen,
    setIsBlack: state.setIsBlack,
    setIsOpen: state.setIsOpen,
  }));

  // const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Function to toggle the class
  const toggleNavbar = () => {
    if (isOpen !== 'Sidebar') {
      settoggle((prev) => {
        if (!prev) {
          setIsOpen('Navbar');
          return true;
        } else {
          setIsOpen('');
          return false;
        }
      });
    } else {
      // settoggle((prev) => !prev);
    }
  };
  // Dark Theme
  const handleButtonClick = () => {
    setIsBlack(!isBlack);
  };
  React.useEffect(() => {
    const currentTab = location;
    setTab(currentTab);
    console.error(currentTab);
  }, [location]);
  return (
    <>
      <Navbar
        expand='lg'
        expanded={toggle}
        id='him'
        className='bg-body-tertiary my-nav dark'
        ref={navbarRef}
      >
        <Container fluid>
          <Navbar.Brand>
            <Link href='/'>
              <Image src={logo} alt='Logo' />
              <Image src={logo2} alt='Logo' />
            </Link>
          </Navbar.Brand>
        {(tab !== '/superadmin') && <div className='d-flex-mobee'>
            {/* <Connect hideRewards /> */}
            <Navbar.Toggle
              aria-controls='navbarScroll'
              onClick={toggleNavbar}
            />
          </div>}
          <Navbar.Collapse id='navbarScroll'>
            <Nav className='me-auto my-lg-0 my-2 d-flex' navbarScroll>
              {/* <Link href='/' className='nav-link' onClick={toggleNavbar}>
                <div className='img'>
                  <Image src={home1} alt='Home' />
                  <Image src={home1} alt='Home' />
                </div>
                Test Site
              </Link>
              <Nav.Link href='#;' onClick={toggleNavbar}>
                <div className='img'>
                  <Image src={feedback} alt='Directory' />
                  <Image src={feedback} alt='Directory' />
                </div>
                0
              </Nav.Link>
              <Nav.Link href='#;' onClick={toggleNavbar}>
                <div className='img'>
                  <Image src={plus1} alt='Diamond' />
                  <Image src={plus1} alt='Diamond' />
                </div>
                New
              </Nav.Link> */}
            </Nav>

            <div className='d-flex justify-content-end'>
              <Button
                className={`themebtn ${isThemeActive ? 'active' : ''}`}
                onClick={() => {
                  // toggleThemeClass();
                  handleButtonClick(); // Call your handleButtonClick function here
                }}
              >
                <i className='fa fa-sun-o'></i>
                <i className='fa fa-moon-o'></i>
              </Button>
              {/* <Link className='reg-btn yellow' href='#'>
                Sign Out
              </Link> */}
              <div
                style={
                  tab === '/superadmin'
                    ? {
                        position: 'absolute',
                        top: '10000px',
                      }
                    : {}
                }
              >
                <Connect hide={true} />
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
