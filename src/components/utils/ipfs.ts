// import axios from '@/components/axios/';
import logger from '@/lib/logger';
// import oAxios from 'axios';
// import { create } from 'ipfs-http-client';
import moment from 'moment';

const getAllEntries = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const response = await axios.get('/entries/getAll');
      // const entries = response.data.data.entries;
      // const newEntriesPromise = entries.map(async (entry: any) => {
      //   const path = entry.metadata;
      //   const res = await oAxios.get(`https://ipfs.io/ipfs/${path}`);
      //   const obj = res.data;
      //   const utcDate = moment.utc(entry.created_at);
      //   const formattedDate = utcDate.format('MMMM Do, YYYY');
      //   const newEntry = {
      //     id: entry.id,
      //     user: entry.user,
      //     title: obj.title,
      //     description: obj.description,
      //     createdAt: formattedDate,
      //   };
      //   return newEntry;
      // });
      // Promise.all(newEntriesPromise).then((newEntries) => resolve(newEntries));
    } catch (error) {
      reject(error);
    }
  });
};

const uploadOnIpfs = async (values: object, img?: any) => {
  // const auth =
  //   'Basic ' +
  //   Buffer.from(
  //     process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET
  //   ).toString('base64');
  // const clientIPFS = create({
  //   host: 'ipfs.infura.io',
  //   port: 5001,
  //   protocol: 'https',
  //   headers: {
  //     authorization: auth,
  //     'Access-Control-Allow-Origin': '["http://127.0.0.1:8080/"]',
  //     Origin: 'https://ipfs.infura.io:5001/',
  //     'User-Agent': 'foo',
  //   },
  // });
  // if (img) {
  //   const reader = new FileReader();
  //   reader.readAsArrayBuffer(img);
  //   const onLoadPromise = new Promise((resolve) => {
  //     reader.onload = function () {
  //       var arrayBuffer = reader.result;
  //       var fileBuffer = new Uint8Array(arrayBuffer as ArrayBuffer);
  //       resolve(fileBuffer); // Resolve the Promise with the fileBuffer
  //     };
  //   });
  //   const fileBuffer = await onLoadPromise;
  //   const res = await clientIPFS.add(Buffer.from(fileBuffer as any));
  //   const response = await clientIPFS.add(
  //     JSON.stringify({ ...values, img: res.path })
  //   );
  //   return response.path;
  // }
  // logger('no image');
  // const res = await clientIPFS.add(JSON.stringify(values));
  // return res.path;
};

export { getAllEntries, uploadOnIpfs };
