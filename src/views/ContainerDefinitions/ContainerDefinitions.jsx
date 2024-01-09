import React, { useState } from 'react';
import MuiButton from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function ContainerDefinitions() {
  const [selectedItem, setSelectedItem] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    // Check if an item is selected
    setError(!selectedValue);

    // Update selected item
    setSelectedItem(selectedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if an item is selected
    if (!selectedItem) {
      setError(true);
      return;
    }

    setError(false); // Reset error if an item is selected
    console.log('Selected Item:', selectedItem);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Select
          label="Select Item"
          value={selectedItem}
          onChange={handleChange}
          variant="outlined"
          color="primary"
          style={{ width: '200px' }}
          error={error}
        >
          <MenuItem value="">Select an Item</MenuItem>
          <MenuItem value="item1">Item 1</MenuItem>
          <MenuItem value="item2">Item 2</MenuItem>
          <MenuItem value="item3">Item 3</MenuItem>
          {/* Add more MenuItem components as needed */}
        </Select>
        {error && <p style={{ color: 'red' }}>Please select an item</p>}
        <MuiButton type="submit">Submit</MuiButton>
      </form>
    </>
  );
}

export default ContainerDefinitions;
