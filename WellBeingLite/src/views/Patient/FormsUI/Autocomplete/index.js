import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useField } from 'formik';

const CustomAutocomplete = ({
  id,
  label,
  options,
  value,
  onInputChange,
  onChange,
  fetchOptionsCallback,
  getOptionLabel,
  isOptionEqualToValue,
  ...props
}) => {
  const [field, meta, helpers] = useField('Uhid');
  const [inputValue, setInputValue] = useState(value ? getOptionLabel(value) : ''); // Initialize with getOptionLabel value if available

  useEffect(() => {
    if (inputValue !== '') {
      fetchOptionsCallback(inputValue);
    }
  }, [inputValue, fetchOptionsCallback]);

  return (
    <Autocomplete
      {...field}
      id={id}
      options={options}
      getOptionLabel={getOptionLabel}
      value={value}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        onInputChange(newInputValue);
      }}
      onChange={(event, newValue) => {
        helpers.setValue(newValue);
        onChange(newValue);
        setInputValue(newValue ? getOptionLabel(newValue) : '');
      }}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          size="small"
          error={meta.touched && !!meta.error}
          helperText={meta.touched ? meta.error : ''}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={getOptionLabel(option)}>
          {getOptionLabel(option)}
        </li>
      )}
    />
  );
};

export default CustomAutocomplete;
