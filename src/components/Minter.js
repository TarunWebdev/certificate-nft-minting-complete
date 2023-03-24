import React, { useState } from 'react';
import certi from '../img/certi.png'
import html2canvas from "html2canvas";
import { pinataWrapper, sendFileToIPFS } from '../utils/pinata';
import { mintOperation } from '../utils/operation';
import { FormContainer , InputWrapper , Label ,Input ,Button} from './FormStyle';


const Minter = () => {

  const [name, setName] = useState('');
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);


  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  // TODO 7.1 - add a referance point to the canvas
  const printRef = React.useRef();

  // TODO 7.3 - capture the canvas using html2canvas
  const captureElement = async (element) => {
    const canvas = await html2canvas(element);
    return canvas;
  }

  // TODO 7.4 - getImageData from the html canvas to an image blob
  const getImageData = async (canvas) => {
    const imageBlob = await fetch(canvas.toDataURL("image/png")).then((res) => res.blob());
    return imageBlob;
  }

  // TODO 9 - get the Image IPFS by sending Image blob to pinata 
  const getImageIPFS = async () => {
    try {
      const canvas = await captureElement(printRef.current);
      const blob = await getImageData(canvas);
      const res = await sendFileToIPFS(blob)
      return res.Ipfs;
    } catch (error) {
      console.log(error) 
    }
    return ""

  }

  // TODO 11 - get complate metadata of NFT ready for minting
  const getMintingMetadata = async () => {
    const imageIPFS = getImageIPFS()
    try {
      const res = await pinataWrapper(name,eventName,imageIPFS)
      return res.Ipfs;
    } catch (error) 
    {
      console.log(error);
    }
    return ""
  }

  // TODO 12 - call the minting operation with the created metadata of the NFT
  const mintingOperation = async () => {
    const data = await getMintingMetadata();
    await mintOperation(data)
  };

  // TODO 13.1 - Add loading state to the minting button opetaion
  const handleMint = async (event) => {
    event.preventDefault();
    try{
      setLoading(true);
      await mintingOperation();
      alert("Mint succesful!");
    }
    catch(error){
      console.log(error);
    }
    setLoading(false);
  };


  return (
    <FormContainer autocomplete="off" onSubmit={handleMint}>
      <InputWrapper>
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
          required
        />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="eventName">Event Name:</Label>
        <Input
          type="text"
          id="eventName"
          name="eventName"
          autocomplete="off"
          value={eventName}
          onChange={handleEventNameChange}
          placeholder="Enter the event name"
          required
        />
      </InputWrapper>
      <br />
  
      {/* TODO 7.2 - call the referance point to the canvas */}

      <div id="downloadWrapper" ref={printRef}>
          <div id="certificateWrapper">
            <p className='name'>{name}</p>
            <p className='event'>{eventName}</p>
            <img src={certi} alt="Certificate" />
          </div>
        </div>
        <br />

      <Button type="submit">
        {/* TODO 13.2 - Add a loading state to the mint NFT button */}
         {loading ? "Loading..." : "Mint NFT"}
      </Button>
    </FormContainer>
  );
  }

  export default Minter;
