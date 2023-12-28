'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import {  EntrySizeMap } from '@/types/dashboard';
import { ArticlesList } from '@/components/ArticlesList';
import SearchArticlesList from '@/components/SearchArticlesList';
// import { usePopper } from 'react-popper';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function Search() {
  return (
    <>
      <main id='main'>
        <div className='main-inner home'>
          <SearchArticlesList />
        </div>
      </main>
    </>
  );
}
