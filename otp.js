
import React, { useState, useEffect, useRef } from 'react';

const OtpInput = ({ length, onChange, onComplete, onReset }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef(new Array(length).fill().map(() => React.createRef()));

  useEffect(() => {
    // Focus the first input element on mount
    inputRefs.current[0].current.focus();
  }, []);

  const handleChange = (element, index) => {
  const newOtp = [...otp];
  newOtp[index] = element.value;
  setOtp(newOtp);
  onChange(newOtp.join(''));

  // Add logging to debug
  console.log(`Current OTP: ${newOtp.join('')}`);

  // Focus next input on entry
  if (element.value && index < length - 1) {
    inputRefs.current[index + 1].current.focus();
  }

  // Check if all fields are filled and then trigger completion
  if (newOtp.every(val => val) && newOtp.join('').length === length) {
    onComplete(newOtp.join('')); // Call onComplete when all fields are filled
  }
};

const handlePaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData('text').slice(0, length).split('');
  if (pasteData.length === length) {
    setOtp(pasteData);
    onChange(pasteData.join(''));
    inputRefs.current[length - 1].current.focus();
    // Check immediately after paste if all are filled
    if (pasteData.every(val => val)) {
      onComplete(pasteData.join(''));
    }
  }
};


  const handleBackspace = (event, index) => {
    if (event.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1].current.focus();
      }
    }
  };


  const resetOtp = () => {
    const clearedOtp = Array(length).fill('');
    setOtp(clearedOtp);
    inputRefs.current[0].current.focus();
    onReset();
  };

  return (
    <div onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          ref={inputRefs.current[index]}
          type="text"
          value={data}
          maxLength="1"
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleBackspace(e, index)}
          onFocus={e => e.target.select()}
          style={{ width: '40px', marginRight: '6px', textAlign: 'center' }}
        />
      ))}
      <button onClick={resetOtp} style={{ marginTop: '20px' }}>Reset OTP</button>
    </div>
  );
};

export default OtpInput;



export function App(props) {
    const [otp, setOtp] = useState('');

  const handleOtpChange = otp => {
    setOtp(otp);
  };

  const handleOtpComplete = otp => {
    console.log('OTP Complete:', otp);
    // Here you can call an API to verify the OTP
  };

  const handleOtpReset = () => {
    console.log('OTP Reset');
    setOtp('');
  };
  return (
     <div className="App">
      <h1>Enter OTP</h1>
        <OtpInput
        length={6}
        onChange={handleOtpChange}
        onComplete={handleOtpComplete}
        onReset={handleOtpReset}
      />
      <p>OTP Entered: {otp}</p>
    </div>
  );
}

// Log to console
console.log('Hello console')