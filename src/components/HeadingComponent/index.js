import React from 'react';
import { Typography } from '@mui/material';

function HeadingComponent({ heading }) {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          backgroundColor: '#1E88E5',
          color: 'white',
          padding: '12px',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          fontSize: '20px',
          fontWeight: '400'
        }}
      >
        {heading}
      </Typography>
    </>
  );
}

export default HeadingComponent;
