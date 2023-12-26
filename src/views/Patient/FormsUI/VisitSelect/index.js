import React, { useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const VisitSelect = ({ name, options, getOptionLabel, getOptionValue, onChangeCallback, onChangeVisit, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  useEffect(() => {
    // Set the default value to the first item in options array
    if (options.length > 0) {
      setFieldValue(name, getOptionValue(options[0]));
    }
  }, [options, name, setFieldValue]);

  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);

    if (onChangeCallback) {
      onChangeCallback(value, setFieldValue);
    }

    const selectedVisit = options.find((option) => getOptionValue(option) === value);
    if (onChangeVisit && selectedVisit) {
      onChangeVisit(selectedVisit);
    }
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange,
    size: 'small',
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {options.length > 0 ? (
        options.map((option) => (
          <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          No visits available
        </MenuItem>
      )}
    </TextField>
  );
};

export default VisitSelect;
