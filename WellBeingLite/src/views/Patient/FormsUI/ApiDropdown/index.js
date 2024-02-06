import React from 'react';
import { useField } from 'formik';
import { FormControl, MenuItem, TextField } from '@mui/material';

const ApiDropdown = ({ data, label, name, valueProp, labelProp, onSelectChange, ...otherProps }) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (event) => {
    const { value } = event.target;
    helpers.setValue(value);
    onSelectChange(value);
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
    <FormControl fullWidth>
      <TextField
        id={`api-dropdown-${name}`}
        {...configSelect}
        label={label}
        sx={{ width: '100%' }} // Set your desired width here
      >
        <MenuItem value="">
          <em>Select an option</em>
        </MenuItem>

        {data.map((item) => (
          <MenuItem key={item[valueProp]} value={item[valueProp]}>
            {item[labelProp]}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default ApiDropdown;
