import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import Head from 'next/head';

import * as React from 'react';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script src='https://smtpjs.com/v3/smtp.js'></script>
      <NavBarDash />
      <SideBarDash />

      {children}
    </>
  );
}
