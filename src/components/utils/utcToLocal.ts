// import axios from '@/components/axios/';
import logger from '@/lib/logger';
// import oAxios from 'axios';
// import { create } from 'ipfs-http-client';
import moment from 'moment';

const utcToLocal = (date: string, format: string) => {
  let stillUtc;

  if (date === '') {
    stillUtc = moment.utc();
  } else {
    stillUtc = moment.utc(parseInt(date)).toDate();
  }

  var local = moment(stillUtc).local().format(format);
  return local;
};

export { utcToLocal };
