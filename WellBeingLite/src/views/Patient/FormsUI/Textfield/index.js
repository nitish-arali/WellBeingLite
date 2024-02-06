import React from 'react';
import { TextField } from '@mui/material';
import NumericTextBox from '../NumericTextBox/NumericTextBox';
import { useField } from 'formik';

const TextFieldWrapper = ({ name, numeric, placeholder, ...otherProps }) => {
  const [field, meta] = useField(name);

  const InputComponent = numeric ? NumericTextBox : TextField;

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
    size: 'small',
    placeholder: placeholder || '' // Use the provided placeholder or an empty string
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <InputComponent {...configTextField} />;
};

export default TextFieldWrapper;
