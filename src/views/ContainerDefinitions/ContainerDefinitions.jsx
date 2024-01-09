// import React, { useState } from 'react';
// import { Button, TextField } from '@mui/material';

// import MuiButton from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';

// function ContainerDefinitions() {
//   const [selectedItem, setSelectedItem] = useState('');
//   const [error, setError] = useState(false);

//   const handleChange = (event) => {
//     const selectedValue = event.target.value;

//     // Check if an item is selected
//     setError(!selectedValue);

//     // Update selected item
//     setSelectedItem(selectedValue);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Check if an item is selected
//     if (!selectedItem) {
//       setError(true);
//       return;
//     }

//     setError(false); // Reset error if an item is selected
//     console.log('Selected Item:', selectedItem);
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <Select
//           label="Select Item"
//           value={selectedItem}
//           onChange={handleChange}
//           variant="outlined"
//           color="primary"
//           style={{ width: '200px' }}
//           error={error}
//         >
//           <MenuItem value="">Select an Item</MenuItem>
//           <MenuItem value="item1">Item 1</MenuItem>
//           <MenuItem value="item2">Item 2</MenuItem>
//           <MenuItem value="item3">Item 3</MenuItem>
//           {/* Add more MenuItem components as needed */}
//         </Select>
//         {error && <p style={{ color: 'red' }}>Please select an item</p>}
//         <MuiButton type="submit">Submit</MuiButton>
//       </form>
//     </>


// function ContainerDefinitions() {
//   const [value, setValue] = useState('');
//   const [error, setError] = useState(false);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (value.trim() === '') {
//       setError(true);
//     } else {
//       setError(false);
//       // Handle form submission here
//       console.log(value);
//     }
//   };

//   const handleChange = (event) => {
//     setValue(event.target.value);
//     if (event.target.value.trim() === '') {
//       setError(true);
//     } else {
//       setError(false);
//     }
//   };
//   const handleBlur = () => {
//     if (value.trim() === '') {
//       setError(true);
//     } else {
//       setError(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField
//         error={error}
//         helperText={error ? 'This field is required' : ''}
//         label="My TextField"
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />
//       <Button type="submit">Submit</Button>
//     </form>

//   );
// }

// export default ContainerDefinitions;
