import { Metadata } from 'next';
import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { siteConfig } from '@/constant/config';
import '@/styles/App.scss';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    // creator: '@th_clarence',
  },
  // authors: [
  //   {
  //     name: 'Theodorus Clarence',
  //     url: 'https://theodorusclarence.com',
  //   },
  // ],
};
import { ToastContainer } from 'react-toastify';
import SidebarHome from '@/components/SideBarHome/SideBarHome';
import NavBar from '@/components/NavBar/NavBar';
import { useThemeStore } from '@/store/useStore';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&family=Literata:opsz,wght@7..72,300;7..72,400;7..72,500;7..72,600;7..72,700;7..72,800&display=swap'
          rel='stylesheet'
        />
        <script src='http://localhost:8097'></script>
      </head>
      <body>
        <SidebarHome />
        <NavBar />

        {children}

        <ToastContainer theme='light' autoClose={3000} />
      </body>
    </html>
  );
}
