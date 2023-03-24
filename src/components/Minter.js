import React, { useState } from 'react';
import styled from 'styled-components';
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

  const printRef = React.useRef();

  const captureElement = async (element) => {
    const canvas = await html2canvas(element);
    return canvas;
  }

  const getImageData = async (canvas) => {
    const imageBlob = await fetch(canvas.toDataURL("image/png")).then((res) => res.blob());
    return imageBlob;
  }
  const mintingOperation = async () => {

    const canvas = await captureElement(printRef.current);
    const blob = await getImageData(canvas);
    
    const res = await sendFileToIPFS(blob)

    const res2 = await pinataWrapper(name,eventName,res.Ipfs)

    const mint = await mintOperation(res2.Ipfs)


    const metadata = {
      name,
      eventName,
      certi : res2.Ipfs
    };
    // const res = await sendFileToIPFS(certi);
    console.log(metadata)
    return metadata;
  };

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
      <div id="downloadWrapper" ref={printRef}>
          <div id="certificateWrapper">
            <p className='name'>{name}</p>
            <p className='event'>{eventName}</p>
            <img src={certi} alt="Certificate" />
          </div>
        </div>
        <br />

      <Button type="submit">
         {loading ? "Loading..." : "Mint NFT"}
      </Button>
    </FormContainer>
  );
  }

  export default Minter;
