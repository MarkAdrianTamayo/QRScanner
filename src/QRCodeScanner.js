import React, { useState, useRef, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      // 10 seconds cooldown para maangas
      setTimeLeft(10);
      timeoutRef.current = setTimeout(() => {
        setIsScanning(false);
      }, 10000);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      clearTimeout(timeoutRef.current);
      clearInterval(timerRef.current);
    }
    
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(timerRef.current);
    };
  }, [isScanning]);

  const handleScan = (result) => {
    setResult(result);
    setIsScanning(false);
  };

  const restartScan = () => {
    setResult('');
    setIsScanning(true);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>QR Scanner</h2>
      
      {isScanning && (
        <div style={{ 
          marginBottom: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: timeLeft <= 3 ? 'red' : 'inherit'
        }}>
          Scanning stops in: {timeLeft}s
        </div>
      )}
      
      {isScanning ? (
        <Scanner
          onStatusChange={(status) => {
            console.log('Scanner status:', status);
          }}
          onDecode={handleScan}
          onError={(error) => {
            console.error(error);
            setIsScanning(false);
          }}
          constraints={{ facingMode: 'environment' }}
          containerStyle={{ border: '2px solid blue' }}
          scanDelay={isScanning ? 300 : false}
        />
      ) : (
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          border: '2px dashed #ccc'
        }}>
          <p>Scanner inactive</p>
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0' }}>
          <h3>Scanned Result:</h3>
          <p>{result}</p>
        </div>
      )}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={restartScan}
          disabled={isScanning}
          style={{ padding: '10px 15px', background: '#4CAF50', color: 'white' }}
        >
          Start Scan
        </button>
        
        <button 
          onClick={() => setIsScanning(false)}
          disabled={!isScanning}
          style={{ padding: '10px 15px', background: '#f44336', color: 'white' }}
        >
          Stop Now
        </button>
      </div>
      
      <div style={{ marginTop: '15px' }}>
        {isScanning ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Scanning</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Scanner paused</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;