import React from 'react';
import { TextField } from '@mui/material';
import NumericTextBox from '../NumericTextBox/NumericTextBox';
import { useField } from 'formik';

const TextFieldWrapper = ({ name, numeric, ...otherProps }) => {
  const [field, meta] = useField(name);

  const InputComponent = numeric ? NumericTextBox : TextField;

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
    size: 'small',
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <InputComponent {...configTextField} />;
};

export default TextFieldWrapper;
