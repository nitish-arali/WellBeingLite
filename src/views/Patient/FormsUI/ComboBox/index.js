import React from 'react';
import { useField, useFormikContext } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const ComboBox = ({ name, label, options }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, touched, errors } = useFormikContext();

  const handleOptionChange = (event, newValue) => {
    setFieldValue(name, newValue);
  };

  const handleClearOption = () => {
    setFieldValue(name, null);
  };

  const configSelect = {
    ...field,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
  };

  if (touched[name] && errors[name]) {
    configSelect.error = true;
    configSelect.helperText = errors[name];
  }

  return (
    <div>
      <Autocomplete
        {...configSelect}
        value={field.value}
        onChange={handleOptionChange}
        options={options}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} label={label} />
        )}
      />
      <Button onClick={handleClearOption} variant="outlined" color="secondary">
        Clear
      </Button>
      {touched[name] && errors[name] && (
        <div style={{ color: 'red' }}>{errors[name]}</div>
      )}
    </div>
  );
};

export default ComboBox;
