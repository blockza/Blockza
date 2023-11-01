import React from 'react';
import post1 from '@/assets/Img/Banner/Banner.png';
import iconhyper from '@/assets/Img/Posts/icon-hypertina.png';
import user1 from '@/assets/Img/Posts/user-1.png';
import user2 from '@/assets/Img/Posts/user-2.png';
import user3 from '@/assets/Img/Posts/user-3.png';
import Link from 'next/link';
import Image from 'next/image';
export default function BigPost() {
    return (
        <>
            <div className='big-post scroll-anime'>
                <div className='heading-pnl'>
                    <h1>Featured</h1>
                    <p>The most interesting content collected by our team.</p>
                </div>
                <h1>HYPERVIEW: It's Estelle Flores World, We're Just Living In It</h1>
                <div className='spacer-20'></div>
                <div className='Product-post big'>
                    <div className='Product-post-inner'>
                        <div className='img-pnl'>
                            <Link href="/"><Image src={post1} alt="Post" /></Link>
                            <div className='absolute-pnl'>
                                <div>
                                    <span><Image src={iconhyper} alt="Post" /> Hyperretina</span>
                                    <span>September 30</span>
                                </div>
                                <div>
                                    <ul className='user-list'>
                                        <li>
                                            <Link href="/"><Image src={user1} alt="user" /></Link>
                                        </li>
                                        <li>
                                            <Link href="/"><Image src={user2} alt="user" /></Link>
                                        </li>
                                        <li>
                                            <Link href="/"><Image src={user3} alt="user" /></Link>
                                        </li>
                                        <li>
                                            <span>5 Collected</span>
                                        </li>
                                    </ul>
                                    <Link href="/" className='dark-btn-small'>Mint</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h4>Video games, both culturally and visually, have sparked the imagination of countless artists. Yet, when an artistVideo games, both culturally and visually, have sparked the imagination of countless artists. Yet, when an artistVideo games, both culturally and visually, have sparked the imagination of countless artists. Yet, when an artist</h4>
                <h4>Video games, both culturally and visually, have sparked the imagination of countless artists. Yet, when an artistVideo games, both culturally and visually, have sparked the imagination of countless artists.</h4>
            </div>
        </>
    );
}