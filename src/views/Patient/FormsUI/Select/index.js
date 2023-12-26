import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const Select = ({ name, options, getOptionLabel, getOptionValue, onChangeCallback, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);
    if (onChangeCallback) {
      onChangeCallback(value, setFieldValue);
      console.log('this is in index of select component ' + value);
    }
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange,
    size: 'small'
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {options && options.length === 0 ? (
        <MenuItem value="">No data</MenuItem>
      ) : (
        <MenuItem value="">{name === 'title' ? 'Select Title' : name === 'PatientGender' ? 'Select Gender' : 'Select'}</MenuItem>
      )}
      {options &&
        options.map((option) => (
          <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default Select;
