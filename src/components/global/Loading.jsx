import { useEffect, useState } from 'react';
import { Spinner, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';

const LoadingComponent = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate continuous loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Reset to 0 when reaching 100
        if (prevProgress >= 100) return 0;
        // Increment by a small amount
        return prevProgress + 2;
      });
    }, 1000); // Fast enough to look smooth
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      style={{ 
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      {/* Logo container with animation */}
      <motion.div 
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <img 
          src="/favicon_io/android-chrome-512x512.png" 
          alt="Loading" 
          style={{ width: '64px', height: '64px' }}
        />
      </motion.div>
      
      {/* Bootstrap progress bar */}
      <div style={{ width: '250px', maxWidth: '80%' }}>
        <ProgressBar 
          animated 
          now={progress} 
          style={{ height: '4px', backgroundColor: '#333' }}
        />
      </div>
      
      {/* Bootstrap spinner */}
      <div style={{ marginTop: '1rem' }}>
        <Spinner animation="border" variant="primary" size="sm" color='light' />
      </div>
    </div>
  );
};

export default LoadingComponent;