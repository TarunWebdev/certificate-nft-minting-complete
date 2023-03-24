import React, { useState } from 'react';
import styled from 'styled-components';
import certi from '../img/certi.png'
import { exportComponentAsPNG } from "react-component-export-image";
import html2canvas from "html2canvas";
import * as ReactDOM from 'react-dom';
import { pinataWrapper, sendFileToIPFS } from '../utils/pinata';
import { mintOperation } from '../utils/operation';
// import { sendFileToIPFS } from '../utils/pinata';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin: 20px;
  position: relative;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  width: 220px;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px #4CAF50;
  }

  @media (max-width: 600px) {
    width: calc(100% - 20px);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #3E8E41;
  }

  &:active {
    background-color: #3E8E41;
    transform: scale(0.95);
  }
`;


const Form = () => {
  const [name, setName] = useState('');
  const [eventName, setEventName] = useState('');

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

  const createMetadata = async () => {

    const canvas = await captureElement(printRef.current);
    const blob = await fetch(canvas.toDataURL("image/png")).then((res) => res.blob());
    
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const metadata = await createMetadata();
    }
    catch(error){
      console.log(error);
    }
    // Do whatever you want with metadata here
  };


  return (
    <FormContainer onSubmit={handleSubmit}>
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

      <Button type="submit">Submit</Button>
    </FormContainer>
  );
  }

  export default Form;
