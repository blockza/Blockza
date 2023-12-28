import React, {  useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ExportPost from '@/components/ExportPost/ExportPost';
import { useConnectPlugWalletStore } from '@/store/useStore';
import iconfilter from '@/assets/Img/Icons/icon-filter.png';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import {
  Carousel,
  Col,
  Dropdown,
  Nav,
  Row,
  Tab,
} from 'react-bootstrap';

export default function Articles() {
  const [entries, setEntries] = useState<[]>([]);
  const [entryId, setEntryId] = useState<string>();
  const [categories, setCategories] = useState([]);
  const [entriesByCategory, setEntriesByCategory] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const divRef = useRef<HTMLDivElement | null>(null);
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );

  const getEntries = async (category?: string | null) => {
    try {
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      if (category) {
        const tempEntries = await entryActor.getEntriesByCategory(category);
        if (tempEntries.length >= 5) {
          const filteredEntries = tempEntries.slice(0, 5);
          setEntriesByCategory(filteredEntries);
        } else {
          setEntriesByCategory(tempEntries);
        }
        logger(tempEntries, 'BY CATEGROY BOIII');
      } else {
        const tempCategories = await entryActor.getCategories();
        setCategories(tempCategories);
        const tempEntries = await entryActor.getAllEntries();
        logger({ tempEntries, tempCategories }, 'HERE WE GOOO');
        // const filteredEntries = tempEntries.slice(0, 5);
        // setEntries(filteredEntries);
        if (tempEntries.length >= 5) {
          const filteredEntries = tempEntries.slice(0, 5);
          setEntries(filteredEntries);
        } else {
          setEntries(tempEntries);
        }
        // setEntryId(tempEntries[0][0]);
      }
    } catch (err) {
      logger(err);
    }
  };
  const handleTabChange = (tab: string | null) => {
    if (tab !== 'All Content') getEntries(tab);
  };
  const scrollForward = () => {
    if (divRef.current) {
      const scrollAmount = 200; // You can adjust this value
      const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;
      logger({ maxScroll, scrollPosition });

      // Calculate the new scroll position
      const newScroll = scrollPosition + scrollAmount;

      if (newScroll >= maxScroll) {
        // If we reach the end, reset the scroll position
        setScrollPosition(-100);
      } else {
        setScrollPosition(newScroll);
      }

      // Set the new scroll position
      divRef.current.scrollLeft = newScroll;
    }
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.pageX - divRef.current.offsetLeft);
      setScrollLeft(divRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      const x = e.pageX - divRef.current!.offsetLeft;
      const walk = (x - startX) * 2; // You can adjust the scrolling speed
      divRef.current!.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  useEffect(() => {
    // if (auth.state === 'initialized') {
    getEntries();
    // }
  }, [auth]);
  return (
    <>
      {/* {entries && (
        <div>
          <ExportPost entry={entries} entryId={entryId as string} />
        </div>
      )} */}

      {categories.length > 0 && (
        <Tab.Container
          id='left-tabs-example'
          defaultActiveKey={'All Content'}
          onSelect={handleTabChange}
        >
          <Row>
            <Col sm={12} className='d-flex'>
              <Nav
                variant='tabs'
                className='tabs-fill scrollable-tabs'
                ref={divRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <Nav.Item key={'All'}>
                  <Nav.Link
                    eventKey={'All Content'}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    All Content
                  </Nav.Link>
                </Nav.Item>
                {categories &&
                  categories?.map((cate, index) => {
                    return (
                      <Nav.Item key={index}>
                        <Nav.Link eventKey={cate}>{cate}</Nav.Link>
                      </Nav.Item>
                    );
                  })}

                {/* <Nav.Item>
                <Nav.Link eventKey='second'>Tab 2</Nav.Link>
              </Nav.Item> */}
              </Nav>
              <ul className='tabs-list min filter'>
                <li>
                  <Link
                    href={'#'}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollForward();
                    }}
                    className='arrow-link'
                  >
                    <i className='fa fa-angle-right'></i>
                  </Link>
                </li>
                <li className='d-flex align-items-center'>
                  <div className='dropdown'>
                    <Link
                      href={'/categorydetail?category=All_Categories'}
                      className='dropdown-toggle view-all mb-0'
                    >
                      <i className='fa fa-eye'></i> View All
                    </Link>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle id='dropdown-basic'>
                      <Image src={iconfilter} alt='Icon Filter' /> Filter
                    </Dropdown.Toggle>
                  </Dropdown>
                </li>
              </ul>
            </Col>
            <Col sm={12}>
              <Tab.Content>
                {categories.map((c, i) => (
                  <Tab.Pane key={i} eventKey={c}>
                    {entriesByCategory && entriesByCategory?.length > 0 ? (
                      // <div>
                      //   <ExportPost
                      //     key={entriesByCategory[0]}
                      //     entry={entriesByCategory[1]}
                      //     entryId={entriesByCategory[0] as string}
                      //   />
                      // </div>
                      <Carousel
                        className='article-carousle'
                        activeIndex={index}
                        onSelect={handleSelect}
                      >
                        {entriesByCategory?.map((entry,index) => (
                          <Carousel.Item key={index}>
                            <div>
                              <ExportPost
                                key={entry[0]}
                                entry={entry[1]}
                                entryId={entry[0] as string}
                              />
                            </div>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      <div className='d-flex justify-content-center w-full'>
                        <p className='mt-5 text-center' style={{fontWeight:"600"}}>No Articles Found</p>
                      </div>
                    )}
                  </Tab.Pane>
                ))}
                <Tab.Pane eventKey={'All Content'}>
                  {entries && entries?.length > 0 ? (
                    <Carousel
                      className='article-carousle'
                      activeIndex={index}
                      onSelect={handleSelect}
                    >
                      {entries?.length > 0 &&
                        entries?.map((entry,index) => (
                          <Carousel.Item key={index}>
                            <div>
                              <ExportPost
                                key={entry[0]}
                                entry={entry[1]}
                                entryId={entry[0] as string}
                              />
                            </div>
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  ) : (
                    <div className='mt-5'><p className='mt-5 text-center' style={{fontWeight:"600"}}> No entries found</p></div>
                  )}
                </Tab.Pane>
                {/* <Tab.Pane eventKey='second'>Second tab content</Tab.Pane> */}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </>
  );
}
{
  /* <Tabs
defaultActiveKey='allcontent'
id='uncontrolled-tab-example'
className='tabs-fill'
>
<Tab eventKey='allcontent' title='All Content'>
  <Row>
    <Col xl='12' lg='12' md='12'>
    </Col>
  </Row>
</Tab>
<Tab eventKey='features' title='Features'>
  <Row>
    <Col xl='12' lg='12' md='12'>
    </Col>
  </Row>
</Tab>
<Tab eventKey='Quiz' title='Quiz'>
  <Row>
    <Col xl='12' lg='12' md='12'>
    </Col>
  </Row>
</Tab>
<Tab eventKey='Podcasts' title='Podcasts'>
  <Row>
    <Col xl='12' lg='12' md='12'>
    </Col>
  </Row>
</Tab>
<Tab eventKey='Guide' title='Guide'>
  <Row>
    <Col xl='12' lg='12' md='12'>
    </Col>
  </Row>
</Tab>
</Tabs> */
}
