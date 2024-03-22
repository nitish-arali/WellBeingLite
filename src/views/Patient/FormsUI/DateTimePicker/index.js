import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const DateTimePicker = ({ name, onChangeCallback, ...otherProps }) => {
  const [field, meta, helpers] = useField(name);

  // Calculate the current date dynamically
  const currentDate = new Date().toISOString().split('T')[0];

  const handleDateChange = (event) => {
    const { value } = event.target;

    // Update the formik field value
    helpers.setValue(value);

    // Call the provided onChangeCallback
    if (onChangeCallback) {
      onChangeCallback(value);
    }
  };

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    type: 'date',
    variant: 'outlined',
    size: 'small',
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    inputProps: {
      max: currentDate // Set the max attribute for the input to the current date
    },
    onChange: handleDateChange
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return <TextField {...configDateTimePicker} />;
};

export default DateTimePicker;
