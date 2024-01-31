import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

function ContainerDefinitions() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.trim() === '') {
      setError(true);
    } else {
      setError(false);
      // Handle form submission here
      console.log(value);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    if (event.target.value.trim() === '') {
      setError(true);
    } else {
      setError(false);
    }
  };
  const handleBlur = () => {
    if (value.trim() === '') {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        error={error}
        helperText={error ? 'This field is required' : ''}
        label="My TextField"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      
      <Button type="submit">Submit</Button>
    </form>
  );
}

// export default ContainerDefinitions;
