import DashSidebar from '@/components/DashSidebar/DashSidebar';
import ProfileHeader from '@/components/profileHeader/page';
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
  return (
    <div className=''>
      <ProfileHeader />
      <div className=''>{children}</div>
    </div>
  );
}
