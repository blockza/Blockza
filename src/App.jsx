import { useEffect, useState, useRef } from 'react';
import './index.css';
import motokoLogo from './assets/motoko_moving.png';
// import motokoShadowLogo from './assets/motoko_shadow.png';
import motokoShadowLogo from './assets/nftlogo.webp';
import { DIP721, createActor } from './declarations/DIP721';
import { idlFactory as nftFactory } from './declarations/DIP721';
// import { idlFactory as storageFactory } from "./lib/storage.did.js"
import { Principal } from '@dfinity/principal';
import Card from './components/Card';
import { create } from "ipfs-http-client";
import { toast } from 'react-toastify';
import { Nat64 } from '@dfinity/candid/lib/cjs/idl';
import {  Form, Button, Modal } from "react-bootstrap";

let clientIPFS;
if (window.ic) {
  const projectId = "2NxypsJ5XEQ07prpeSQFPCqfpqc";
  const projectSecret = "c388aa5fea94beee3f2b4795309d5480";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  clientIPFS = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
      "Access-Control-Allow-Origin": '["http://127.0.0.1:8000"]',
      Origin: "https://ipfs.infura.io:5001",
      "User-Agent": "foo",
    },
  });
}


async function getUint8Array(file) {
  const arrayBuffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function () {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
  });
  const uint8Array = new Uint8Array(arrayBuffer);
  return uint8Array
}


const isSupportedType = (type) => {
  const types = ['image', 'audio', 'audio', 'video']
  for (let e of types) {
    if (e === type.split('/')[0])
      return true
  }
  return false;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [cycleAlert, setCycleAlert] = useState(false);
  const [nftCanister, setNftCanister] = useState(null);
  const [storageCanister, setStorageCanister] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [description, setDescription] = useState(null);
  const [nfts, setNfts] = useState([]);
  const nftNameField = useRef(null)
  const nftDescriptionField = useRef(null)

  const verifyConnection = async () => {
    if (!window.ic) {
      toast("Please download the Plug wallet first!", { theme: "dark" });
      return
    }
    const connected = await window.ic.plug.isConnected();
    if (connected) {
      disconnect()
    };
    // Whitelist
    const whitelist = [
      process.env.DIP721_CANISTER_ID,
    ];

    let host = "https://mainnet.dfinity.network"
    if (process.env.DFX_NETWORK !== "ic") {
      host = "http://127.0.0.1:4943";

    }
    console.log(`Network: ${host}`)
    console.log(process.env.DIP721_CANISTER_ID)
    // Callback to print sessionData
    const onConnectionUpdate = async () => {
      disconnect()
      // console.log(window.ic.plug.sessionManager.sessionData)
      // let principal = await window.ic.plug.getPrincipal()
      // setPrincipal(principal)
      //initActors()
    }
    // Make the request
    try {
      const publicKey = await window.ic.plug.requestConnect({
        whitelist,
        host,
        onConnectionUpdate,
        timeout: 50000
      });

      console.log(`The connected user's public key is:`, publicKey);
    } catch (e) {
    }
    let principal = await window.ic.plug.getPrincipal()
    setPrincipal(principal)
    //initActors()
  };


  const connect = () => {
    if (!window.ic || window.ic == null) {
      toast("Please install the Plug wallet first!", { theme: "dark" });
      return
    }
    verifyConnection()
  }

  const disconnect = async () => {
    //clean up state
    setPrincipal(null)
    setNftCanister(null)
    setStorageCanister(null)
    setLoading(null)
    setFile(null)
    setCycleAlert(false)
    setNfts([])
    window.ic.plug.sessionManager.disconnect()

  }

  // const createStorageActor = async (id) => {
  //   const storageCanisterId = 'pxwkf-oaaaa-aaaap-abfjq-cai'
  //   console.log(`Storage Canister ID: ${storageCanisterId}`)
  //   const storageActor = await window.ic.plug.createActor({
  //     canisterId: storageCanisterId,
  //     interfaceFactory: storageFactory,
  //   });
  //   //console.log(nftActor)
  //   console.log(`NFT Canister ID: ${process.env.DIP721_CANISTER_ID}`)
  //   setStorageCanister(storageActor)
  // }

  async function fetchId() {
    return new Promise((resolve, reject) => {
      let intervalId = setInterval(async () => {
        const res = await DIP721.get_storage_canister_id();
        if (res.ok) {
          clearInterval(intervalId);
          resolve(res.ok)
        }

        // if (res.err) {
        //   clearInterval(intervalId);
        //   reject(res.err)
        // }
      }, 500);
    });
  }

  const initActors = async () => {
    setCycleAlert(false)
    console.log("Init Actors")
    if (principal === null) return;
    let isProd = true
    if (process.env.DFX_NETWORK !== "ic") {
      isProd = false;
    }


    const nft721 = createActor(process.env.DIP721_CANISTER_ID)
    const nftCanisterId = process.env.DIP721_CANISTER_ID
    if (!window.ic) {
      toast("Please download the Plug wallet first!", { theme: "dark" });
      return
    }
    const nftActor = await window.ic.plug.createActor({
      canisterId: nftCanisterId,
      interfaceFactory: nftFactory,
    });

    setNftCanister(nftActor)

    // const res = await DIP721.get_storage_canister_id();//gets storage canister id and if it doesnt exist it creates one
    // if (res.ok) {
    //   createStorageActor(res.ok)
    //   setNftCanister(nftActor)
    // } else if (res.err.nostorageid === null) {
    //   const res1 = await DIP721.create_storage_canister(isProd);//gets storage canister id and if it doesnt exist it creates one
    //   if (res1.ok) {
    //     createStorageActor(res1.ok)
    //     setNftCanister(nftActor)
    //   } else if (res.err.awaitingid === null) {
    //     fetchId()
    //       .then(id => {
    //         console.log(`The valid id is ${id}`);
    //         createStorageActor(id)
    //         setNftCanister(nftActor)
    //       })
    //       .catch(error => {
    //         console.error(`Error fetching the id: ${error}`);
    //       });
    //   } else if (res.err.notenoughcycles === null) {
    //     setCycleAlert(true)
    //   }
    // } else if (res.err.awaitingid === null) {
    //   fetchId()
    //     .then(id => {
    //       createStorageActor(id)
    //       setNftCanister(nftActor)
    //     })
    //     .catch(error => {
    //       console.error(`Error fetching the id: ${error}`);
    //     });
    // }
  }

  // function handleFileUpload(event) {
  //   const selectedFile = event.target.files[0];
  //   // console.log(selectedFile)
  //   validateFile(selectedFile);
  // }

  const handleFileUpload = (event) => {


    if (event.target.files[0].length !== 0) {
      const objectUrl = URL.createObjectURL(event.target.files[0]);

      const reader = new FileReader();
      reader.readAsArrayBuffer(event.target.files[0]);
      console.log("Buffering...");
      reader.onload = async function () {
        var arrayBuffer = reader.result;
        var fileBuffer = new Uint8Array(arrayBuffer);
        const img = await clientIPFS.add(Buffer.from(fileBuffer));
        console.log('image uploaded...', `https://ipfs.io/ipfs/${img.path}`);
        setFile(`https://ipfs.io/ipfs/${img.path}`);
      };
    }
  };

  function handleDrop(event) {
    handleFileUpload(event)
    setDragging(false);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }

  function handleShow(event, i) {
    event.preventDefault();
    setData(i)
    setShow((bool)=> !bool);
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragging(false);
  }

  function validateFile(file) {
    const maxSize = 1024 * 1024 * 10; // 10 MB
    if (file.size > maxSize) {
      setError('File size exceeds 10 MB');
      setFile(null);
    } else {
      setError(null);
      setFile(file);
    }
  }

  function FileRenderer(props) {
    const { mimeType, src } = props;

    // switch (mimeType.split('/')[0]) {
    // case 'image':
    return <img className=' object-fill h-72 w-96' src={src} alt="Image" />;
    // case 'audio':
    // return <audio className=' object-fill h-56 w-96' controls><source src={src} type={mimeType} /></audio>;
    // case 'video':
    // return <video className=' object-fill h-56 w-96' controls><source src={src} type={mimeType} /></video>;
    // default:
    // return <div>Unsupported file type</div>;
    // }
  }

  const uploadImage = async () => {
    let chunk_ids = [];
    let batch_id = Math.random().toString(36).substring(2, 7);

    const uploadChunk = async ({ chunk, order }) => {
      console.log("UPLOADING CHUNKS")
      return storageCanister.create_chunk(batch_id, Array.from(chunk), order);
    };
    const asset_unit8Array = await getUint8Array(file)
    //console.log(asset_unit8Array)
    const promises = [];
    const chunkSize = 2000000;

    for (
      let start = 0, index = 0;
      start < asset_unit8Array.length;
      start += chunkSize, index++
    ) {
      const chunk = asset_unit8Array.slice(start, start + chunkSize);
      promises.push(
        uploadChunk({
          chunk,
          order: index,
        })
      );
    }

    chunk_ids = await Promise.all(promises);


    const asset_filename = file.name;
    const asset_content_type = file.type
    console.log("COMMIT BATCH")
    const { ok: asset_id } = await storageCanister.commit_batch(
      batch_id,
      chunk_ids,
      {
        filename: asset_filename,
        content_encoding: "gzip",
        content_type: asset_content_type,
      }
    );
    if (!asset_id) {
      console.log("Upload failed, not authorized")
      setError("Upload failed, not authorized")
      return null
    }
    //console.log(asset_id);
    console.log("GETTING ID")
    const { ok: asset } = await storageCanister.get(asset_id);
    //console.log(asset);
    //setUploaded(asset.url)
    console.log("RETURNING ASSET")
    return asset;
  }

  const transferNft = async (id, address) => {
    console.log(`Transfer to: ${address} NFT with id: ${id}`)
    let receipt = await nftCanister.transferFromDip721(principal, Principal.fromText(address), id)
    if (!receipt.Ok) return;
    setNfts((oldNfts) => {
      return oldNfts.filter((item, i) => item.token_id !== id);
    })
  }

  const mintNft = async () => {
    if (!window.ic) {
      toast("Please download the Plug wallet first!", { theme: "dark" });
      return
    }

    setError(null)
    if (!nftCanister) {
      console.log("init error!")
      return
    }

    if (file == null) {
      console.log("No File selected")
      setError("No File selected")
      return
    }

    // if (!isSupportedType(file.type)) {
    //   console.log("Unsupported File Type")
    //   setError("Unsupported File Type")
    //   return
    // }
    //upload image
    setLoading(true)
    // const onChainFile = await uploadImage()
    // if (!onChainFile) return;
    //mint nft
    console.log('filefilefile', file);
    let metadata = {
      purpose: {
        Rendered: null
      },
      key_val_data: [
        {
          key: "name",
          val: {
            TextContent: nftNameField.current.value || "Article"
          }
        },
        {
          key: "contentType",
          val: {
            TextContent: nftDescriptionField.current.value
          }
        },
        {
          key: "locationType",
          val: {
            TextContent: principal.toHex().toLowerCase()
          }
        },
        {
          key: "location",
          val: {
            TextContent: file
          }
        },

      ],
      data: []
    }
    let p = Principal.fromUint8Array(principal._arr)
    //console.log(await nftCanister.getMetadataDip721(receipt.Ok.token_id))
    // let p =  await window.ic.plug.agent.fetchRootKey()



    // console.log('pagent::::', Principal.fromUint8Array(await window.ic.plug.agent.fetchRootKey()));
    let receipt = await nftCanister.mintDip721(p, [metadata])
    console.log("receipt")
    console.log(receipt)
    //if minting fails, delete uploaded image
    if (receipt.Err) {
      // const res = await storageCanister.delete_asset(onChainFile.id)
      // console.log(res)
      setError(receipt.Err)
    }

    if (receipt.Ok) {
      console.log("succesful mint")
      console.log(receipt.Ok)
      console.log(receipt.Ok.token_id)
      let newNft = await nftCanister.getMetadataDip721(receipt.Ok.token_id)
      console.log(newNft)
      setNfts((oldNfts) => {
        newNft.Ok.token_id = receipt.Ok.token_id
        return [newNft.Ok, ...oldNfts]
      })
    }
    setLoading(false)
  }

  const fetAllNfts = async () => {
    console.log('in it');
    if (nftCanister === null || !principal === null) return
    let arr = []
    const supply = await nftCanister.totalSupplyDip721()

    for (let index = 0; index < supply; index++) {
      const ownerOfDip721 = await ownerOfDip721(index)
      console.log('ownerOfDip721', ownerOfDip721);
      arr.push(ownerOfDip721)
    }
  }


  const fetchData = async () => {
    if (nftCanister === null || !principal === null) return

    console.log(`principal ${principal}`)
    // console.log("nftCanister:::::::")
    console.log(nftCanister)

    // console.log('await nftCanister.getTokenIdsForUserDip721(principal)',nftCanister.getTokenIdsForUserDip721(principal))

    const ids = await nftCanister.getTokenIdsForUserDip721(principal)
    const newNfts = await Promise.all(ids.map(async (item) => {
      let value = await nftCanister.getMetadataDip721(item)
      value.Ok.token_id = item
      return value.Ok
    }))
    console.log(newNfts)
    setNfts(newNfts)
  }

  useEffect(() => {
    const init = async () => {
      fetchData();
    }
    init()
    const intervalId = setInterval(async () => {
      fetchData()
    }, 15000);
    return () => clearInterval(intervalId);
  }, [nftCanister, principal]);

  useEffect(() => {
    initActors()
    // createStorageActor()

  }, [principal]);

  // useEffect(() => {
  //   // createStorageActor()
  //   fetAllNfts()

  // }, [nftCanister, principal]);


  return (
    <div className="bg-gray-900 w-screen h-[90vh] flex flex-col overflow-auto ">
      <div className="flex flex-row">
        {/* <div className="self-start p-8 font-bold">
          <h1>NFTStudio24</h1>
        </div> */}
        <div className="self-end p-8 ml-auto">
          {principal && <button onClick={disconnect}>Disconnect</button>}
          {!principal && <button onClick={connect}>Connect Plug</button>}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center">
        <a
          href="https://nftstudio24.com/"
          target="_blank"
        >
          <span className="logo-stack">
            <img
              src={motokoShadowLogo}
              className="logo motoko-shadow"
              alt="nft24 logo"
            />
            {/* <img src={motokoLogo} className="logo motoko" alt="Motoko logo" /> */}
          </span>
        </a>
      </div>
      {cycleAlert && <p>WARNING: Not enough cycles to spin up storage canister</p>}
      {nftCanister &&
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={dragging ? 'dragging' : ''}
          >
            <div className='flex flex-col items-center justify-center gap-6 max-w-md mx-auto mb-10'>
              <div className='flex flex-col items-start gap-2 w-full'>
                <p className='text-[12px] font-thin opacity-70'>Title</p>

                <input type="text" id="nftname" name="nftname" className="px-2 py-1 rounded-lg w-full" ref={nftNameField} placeholder="Title" />
              </div>
              <div className='flex flex-col items-start gap-2 w-full'>
                <p className='text-[12px] font-thin opacity-70'>Article</p>
                <textarea type="text" id="nftname" name="nftname" className="px-2 py-1 rounded-lg w-full" ref={nftDescriptionField} placeholder="What's on your mind?" />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <p className='text-[12px] font-thin opacity-70'>Image</p>

                <input className="w-full" type="file" onChange={handleFileUpload} />
              </div>

              <div className="flex flex-row justify-center items-center w-full">
                <button className='bg-[#0C93EA] w-full' onClick={mintNft}>Mint Article</button>
              </div>
              {error && <p>{error}</p>}
              {loading && <p>Minting Article...</p>}

            </div>
            {
              nfts.length > 0 ? (
                <div className="flex flex-row flex-wrap px-10">
                  {
                    nfts.map((e, i) => {
                      let name, url, mimeType, desc;
                      e[0].key_val_data.forEach((item, index) => {
                        if (item.key == "name") name = item.val.TextContent;
                        else if (item.key == "location") url = item.val.TextContent;
                        else if (item.key == "contentType") mimeType = item.val.TextContent;
                        else if (item.key == "locationType") desc = item.val.TextContent;
                      })
                      return (
                        //key={url} name={name} url={url} desc={desc} 
                        // <Card ></Card>
                        <div onClick={(ev)=>handleShow(ev, e[0].key_val_data[2].val.TextContent)} className='flex flex-col le-cardo items-center justify-center h-fit p-6 max-w-md rounded-lg border-indigo-800 border gap-4 m-7'>
                          <div className='full-div'>
                            <div className='small-card'>
                              <div className='img-pnl'>
                                <FileRenderer src={url} mimeType={mimeType}></FileRenderer>
                              </div>
                              <div className='txt-pnl'>
                                <p className="font-bold heading">{name}
                                </p>
                                <div className='article-cntnr'>
                                  {/* <span>{mimeType}</span> */}
                                  <div className='txty'>
                                    <h6>Article Writing</h6>
                                    <p>{desc?.slice(0, 5) + '...' + desc?.slice(52, desc.length - 1)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>


                          <span className="span-font">{mimeType}</span>
                        </div>
                      )
                    })
                  }
                </div>) : (<div className="flex justify-center items-center" >You don't have any Articles..</div>)
            }
          </div>
        </>
      }

      {
        !principal && <>
          <p>Login to interact...</p>
        </>
      }

      <Modal show={show} size="md" centered onHide={handleShow}>
        <Modal.Header>
          <Modal.Title>Article Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="formPlaintextPassword">
            <Form.Label>Owner Principal: {data?.slice(0, 10)+'...'+ data?.slice(50, data?.length - 1)}</Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPlaintextPassword">
            <Form.Label>Canister ID: {'y64lm-eiaaa-aaaag-absgq-cai'}</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="reg-btn w-100 grey" onClick={handleShow}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div >


  );
}

export default App;