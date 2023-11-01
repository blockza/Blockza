import DashSidebar from '@/components/DashSidebar/DashSidebar';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import Sidebar from '@/components/SideBar/SideBar';
import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard with awesome default',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleButtonClick = () => {
    // setIsBlack(!isBlack);
  };
  return (
    <div className='dashboard-container'>
      {/* <DashSidebar /> */}
      <NavBarDash />
      <Sidebar />

      <div className='dashboard-content'>{children}</div>
    </div>
  );
}
