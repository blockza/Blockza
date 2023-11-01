'use client';
import * as React from 'react';
import Button from '@/components/buttons/Button';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
// import { create } from 'ipfs-http-client';
import { uploadOnIpfs } from '@/components/utils/ipfs';
// import { hello } from '../../declarations/hello';
import { object, string, number, date, InferType, mixed } from 'yup';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import {
  resizeImage,
  fileToCanisterBinaryStoreFormat,
} from '@/dfx/utils/image';
import { v4 as uuidv4 } from 'uuid';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
interface MyFormValues {
  title: string;
  description: string;
  img: string;
}
const initialValues: MyFormValues = { title: '', description: '', img: '' };

export default function Write() {
  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: state.identity,
  }));
  const entrySchema = object().shape({
    title: string().required(),
    description: string().required(),
    img: mixed().required('Image is required'),
  });

  const location = usePathname();
  const router = useRouter();
  const formikRef = React.useRef<any>();
  const [tempImg, setTempImg] = React.useState({ imgName: '', imgUrl: '' });
  const [file, setFile] = React.useState(null);

  React.useEffect(() => {
    if (!window.ic) {
      toast.error('Install Plug Wallet');
    } else {
      window.ic.plug.isConnected().then((res: boolean) => {
        if (!res) {
          router.push('/');
        }
      });
    }
  }, [location]);

  const handleClose = () => {
    setFile(null);
    setTempImg({ imgName: '', imgUrl: '' });
  };

  const uploadEntry = async (values: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      if (file === null) {
        return;
      }
      const fileArray = await fileToCanisterBinaryStoreFormat(file);
      const entry = {
        title: values.title,
        user: 'abdull',
        description: values.description,
        image: fileArray,
        subscription: false,
      };
      console.log(identity);
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });
      entryActor
        .insertEntry(entry, userCanisterId)
        .then(() => resolve('Entry Added successfuly'))
        .catch((err: string) => reject(err));
    });
  };

  const handleImageChange = (e: any) => {
    if (e.target.name === 'img') {
      const img = e.target.files[0];
      const imgUrl = URL.createObjectURL(img);
      setTempImg({
        imgName: img.name,
        imgUrl,
      });
      setFile(img);
    }
  };

  return (
    <div className='m-2 flex '>
      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        validationSchema={entrySchema}
        onSubmit={async (values, actions) => {
          // uploadEntry(values);
          // hello.greet(values.title).then((res) => {
          //   console.log('GET GREETED KID::::::', res);
          // });

          const msg = await uploadEntry(values);
          toast.success(msg);
          handleClose();

          actions.resetForm();

          actions.setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
          <Form
            className='flex w-full flex-col items-center justify-center'
            onChange={(e) => handleImageChange(e)}
          >
            <div className='my-4 flex w-1/6 flex-col'>
              <label htmlFor='title'>Title</label>
              <Field id='title' name='title' placeholder='Title' />
              {errors.title && touched.title ? (
                <div className='text-red-600'>{errors.title}</div>
              ) : null}
            </div>
            <div className='my-4 flex w-1/6 flex-col'>
              <label htmlFor='description'>Description</label>

              <Field
                id='description'
                name='description'
                placeholder='description'
              />
              {errors.description && touched.description ? (
                <div className='text-red-600'>{errors.description}</div>
              ) : null}
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-2xl font-semibold'>Entry image</p>
              <p className='opacity-60'>Upload a entry image.</p>

              <label
                className='flex w-full items-center gap-5 rounded-xl border-2 border-gray-300 p-5 opacity-70'
                htmlFor='img'
              >
                <div className='icon'>
                  <img
                    src={
                      tempImg.imgUrl !== ''
                        ? tempImg.imgUrl
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJgO12xqOwt3vcZwldiNXl7oO7H_l5-DzUyN7_6U&s'
                    }
                    className='w-20'
                    alt=''
                  />
                </div>
                <div className='text'>
                  <p className=''>
                    {' '}
                    {tempImg.imgName !== ''
                      ? tempImg.imgName
                      : 'Upload a file or drag and drop'}
                  </p>
                </div>
              </label>
              <Field
                className='hidden w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
                id='img'
                // value={file}
                // onChange={(e) => handleImageChange(e)}
                name='img'
                type='file'
              />
              {errors.img && touched.img ? (
                <div className='text-red-600'>{errors.img as string}</div>
              ) : null}
            </div>

            <Button type='submit' className='flex w-1/6 justify-center'>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
