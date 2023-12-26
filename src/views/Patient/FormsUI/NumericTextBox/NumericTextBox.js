// NumericTextBox.js
import React from 'react';
import TextField from '@mui/material/TextField';

const NumericTextBox = ({ ...otherProps }) => {
  // Set the type attribute to 'number' for numeric input
  return <TextField type="number" {...otherProps} />;
};

export default NumericTextBox;
