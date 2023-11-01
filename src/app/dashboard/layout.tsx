import DashSidebar from '@/components/DashSidebar/DashSidebar';
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
    <div className='dashboard-container'>
      <DashSidebar />
      <div className='dashboard-content'>{children}</div>
    </div>
  );
}
