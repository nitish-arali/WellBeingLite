import React from 'react';
import { BeatLoader } from 'react-spinners';

const CustomLoader = ({ loading, color, size }) => {
  return (
    <div className={`custom-loader ${loading ? 'show' : 'hide'}`}>
      <div className="loader-content">
        <BeatLoader
          color={color}
          size={size}
          loading={loading}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw', // Set width to cover the entire viewport
            height: '100vh', // Set height to cover the entire viewport
            backgroundColor: 'rgba(255, 255, 255, 0.8)' /* Background overlay color */,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999999 /* Set the z-index */,
            transition: 'opacity 0.3s'
          }}
        />
      </div>
    </div>
  );
};

export default CustomLoader;
