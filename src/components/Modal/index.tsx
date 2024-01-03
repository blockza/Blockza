'use client';
import Connect from '@/components/Connect/Connect';
import authMethods from '@/lib/auth';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import Image from 'next/image';
import React, { useState } from 'react';
import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

function ConnectModal({
  handleClose,
  showModal,
  link,
}: {
  handleClose: () => void;
  showModal: boolean;
  link?: string;
}) {
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  const handleConnectClose = () => {
    setIsConnectLoading(false);
  };

  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading: setIsConnectLoading,
    handleClose: handleConnectClose,
  });
  const connect = async () => {
    setIsConnectLoading(true);
    const login = await methods.login();
    logger(link, 'logged in ');
    if (link) router.push(link);
  };
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <h4 className='mb-0'>Connect With Internet Identity</h4>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex justify-content-center gap-2'>
          <Button
            onClick={connect}
            className='connect-btn'
            style={{
              height: '50px',
              width: '150px',
              background: '#eaca08',
              border: 'none',
            }}
            disabled={isConnectLoading}
          >
            <span style={{ width: '30px', height: '30px' }} className='me-2'>
              <Image src={iconlogo} alt='Logo' height={25} width={25} />
            </span>
            {isConnectLoading ? (
              <Spinner size='sm' className='ms-4 text-primary' />
            ) : connected ? (
              <span className='text-black'>Disconnect</span>
            ) : (
              <span className='text-black'>Connect</span>
            )}
          </Button>
          {/* <Button className='default-btn' onClick={handleClose}>
            Cancel
          </Button> */}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConnectModal;
