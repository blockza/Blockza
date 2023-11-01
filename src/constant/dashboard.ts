import { BiSolidFileBlank } from 'react-icons/bi';
import { PiStarFourFill } from 'react-icons/pi';
import { MdPeopleAlt } from 'react-icons/md';
import { FaGear } from 'react-icons/fa6';
import { BsFillPersonFill } from 'react-icons/bs';
import user2 from '@/assets/Img/Icons/user-2.png';
import Entires2 from '@/assets/Img/Icons/entries-2.png';
import Nft2 from '@/assets/Img/Icons/Nft-2.png';
import subscribe2 from '@/assets/Img/Icons/subscribe-2.png';
import setting2 from '@/assets/Img/Icons/setting-2.png';

export const sidebarItems = [
  { icon: Entires2, name: 'Entries', route: '/dashboardn' },
  { icon: Nft2, name: 'Nfts', route: '/dashboardn/nfts' },
  { icon: subscribe2, name: 'Subscribers', route: '/dashboardn/subscribers' },
  { icon: setting2, name: 'Settings', route: '/dashboardn/settings' },
  { icon: user2, name: 'Profile', route: '/profilen' },
];
export const PASS_KEY = 'ksyan2';
