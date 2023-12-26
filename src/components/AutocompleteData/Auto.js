import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Field, useField, useFormikContext } from 'formik';

const AutoCompleteSelect = ({
  name,
  options,
  getOptionLabel,
  getOptionValue,
  onChangeCallback,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [, meta] = useField(name);

  const handleChange = (_, value) => {
    setFieldValue(name, value);
    if (onChangeCallback) {
      onChangeCallback(value);
    }
  };

  const isOptionEqualToValue = (option, value) => {
    // Customize this function based on how you want to compare the option and value
    return option[getOptionValue(option)] === value[getOptionValue(option)];
  };

  const configAutocomplete = {
    fullWidth: true,
    onChange: handleChange,
    options,
    getOptionLabel,
    getOptionValue,
    renderInput: (params) => (
      <TextField {...params} label={name} variant="outlined" error={meta.touched && !!meta.error} helperText={meta.touched && meta.error} />
    ),
    isOptionEqualToValue, // Use the custom equality function
    ...otherProps,
  };

  return (
    <Field name={name}>
      {({ field }) => (
        <Autocomplete
          {...field}
          {...configAutocomplete}
        />
      )}
    </Field>
  );
};

export default AutoCompleteSelect;
