"use client";
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const RandomQRCode = () => {
  const [randomData, setRandomData] = useState(generateRandomData());

  // Function to generate random data for the QR code
  function generateRandomData() {
    return Math.random().toString(36).substr(2, 12); // Random alphanumeric string
  }

  const refreshQRCode = () => {
    setRandomData(generateRandomData());
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div className='inline-block relative'>
        <QRCodeCanvas className='w-full h-full' value={randomData} size={256} onClick={refreshQRCode} />
        <img
          src="./bea.png"  
          alt="center-icon"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
        />
      </div>
    </div>
  )
}

export default RandomQRCode;
