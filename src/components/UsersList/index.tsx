import React, { useState } from 'react';
import { Button, Col, Modal, Spinner, Table } from 'react-bootstrap';
import Image from 'next/image';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { ListUser } from '@/types/profile';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { toast } from 'react-toastify';

export function UsersList({
  currentItems,
  handleRefetch,
}: {
  currentItems: any[];
  handleRefetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState({ status: true, id: '', name: '' });
  const [approving, setApproving] = useState(false);

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleBlock = async () => {
    setApproving(true);
    if (action.status) {
      const blocked = await userActor.block_user(action.id, commentCanisterId);
      logger(blocked);
      if (blocked.ok) {
        handleRefetch();
        toast.success(blocked.ok[0]);
        handleClose();
      } else {
        toast.error(blocked.err);
      }
    } else {
      const unblocked = await userActor.unBlock_user(
        action.id,
        commentCanisterId
      );
      logger(unblocked);
      if (unblocked.ok) {
        handleRefetch();
        toast.success(unblocked.ok[0]);
        handleClose();
      } else {
        toast.error(unblocked.err);
      }
    }
    setApproving(false);
  };
  // const tooltipRef = useRef<HTMLDivElement | null>(null);
  // const boxRef = useRef<HTMLDivElement | null>(null);
  // const [showTip, setShowTip] = useState(false);

  // const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current);
  return (
    <>
      <Col xl='12' lg='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                    <th>
                      <p>Name</p>
                    </th>
                    <th>
                      <p>Email</p>
                    </th>
                    <th>
                      <p>Wallet Address</p>
                    </th>
                    <th>
                      <p>
                        Joining Date{' '}
                        <Image className='arw' src={arrows} alt='arrow' />
                      </p>
                    </th>
                    <th className='d-flex align-items-center'>
                      <p>Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user: ListUser) => (
                    <tr>
                      <td>
                        <div className='d-inline-flex align-items-start'>
                          {user[1].name[0] ?? ''}
                        </div>
                      </td>
                      <td>{user[1].email[0] ?? 'no email'}</td>
                      <td>{user[0] ?? ''}</td>
                      <td>
                        {utcToLocal(
                          user[1].joinedFrom.toString(),
                          'DD-MM-YYYY'
                        )}
                      </td>
                      <td className=''>
                        {user[1].isBlocked ? (
                          <i
                            className='fa fa-unlock ms-3'
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setAction({
                                status: false,
                                id: user[0],
                                name: user[1].name[0],
                              });
                              handleShow();
                            }}
                          ></i>
                        ) : (
                          <i
                            className='fa fa-ban ms-3'
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setAction({
                                status: true,
                                id: user[0],
                                name: user[1].name[0],
                              });
                              handleShow();
                            }}
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))}
                  <Modal
                    show={showModal}
                    // size='md'
                    centered
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton>
                      <h3 className='text-center'>
                        {action.status ? 'Block' : 'UnBlock'}
                      </h3>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
                        Are you sure you want to{' '}
                        {action.status ? 'block' : 'unblock'} {action.name}?
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className='publish-btn' onClick={handleBlock}>
                        {approving ? (
                          <Spinner size='sm' />
                        ) : action.status ? (
                          'Block'
                        ) : (
                          'UnBlock'
                        )}
                      </Button>
                      <Button
                        disabled={approving}
                        className='default-btn'
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}
