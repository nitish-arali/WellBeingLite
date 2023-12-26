import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const DateTimePicker = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  // Calculate the current date dynamically
  const currentDate = new Date().toISOString().split('T')[0];

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    type: 'date',
    variant: 'outlined',
    size: 'small',
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
    inputProps: {
      max: currentDate, // Set the max attribute for the input to the current date
    },
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return <TextField {...configDateTimePicker} />;
};

export default DateTimePicker;
