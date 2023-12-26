// CustomSelect.js
import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const CustomSelect = ({ name, options, valueProp, labelProp, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  React.useEffect(() => {
    // Set the initial value from the array if it exists
    if (options && options.length > 0 && !field.value) {
      setFieldValue(name, options[0][valueProp]);
    }
  }, [options, field.value, name, setFieldValue, valueProp]);

  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);
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

  let menuItems = [];

  if (options && options.length > 0) {
    menuItems = options.map((item) => (
      <MenuItem key={item[valueProp]} value={item[valueProp]}>
        {item[labelProp]}
      </MenuItem>
    ));
  } else {
    menuItems.push(
      <MenuItem key="no-data-option" value="" disabled>
        No Options Available
      </MenuItem>
    );
  }

  return (
    <TextField {...configSelect} value={field.value || ''}>
      {menuItems}
    </TextField>
  );
};

export default CustomSelect;
