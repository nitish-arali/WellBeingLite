// MyAutocomplete.js
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useField, useFormikContext } from 'formik';

const MyAutocomplete = ({ options, onInputChange, getOptionLabel, label, name, onSelectChange }) => {
  const [inputValue, setInputValue] = useState('');
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  useEffect(() => {
    // You can add additional logic here if needed
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.ServiceId || newValue : '';
    setFieldValue(name, selectedValue);
    onSelectChange(selectedValue); // call the parent component function with the selected value
  };

  const configSelect = {
    ...field,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
  };

  if (meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel} // Use the getOptionLabel prop
      onChange={handleChange}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        onInputChange(newInputValue); // pass the input value to the parent component
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} name={name} variant="outlined" fullWidth {...configSelect} />
      )}
    />
  );
};

export default MyAutocomplete;
