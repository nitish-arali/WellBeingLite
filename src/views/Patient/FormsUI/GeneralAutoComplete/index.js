import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import customAxios from '../CustomAxios';

const GeneralAutoComplete = ({ apiUrl, label, onServiceSelect, clearInputValue, clearSelectedValue }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await customAxios.get(`${apiUrl}?Description=${inputValue}`);
        if (response.status === 200) {
          const patientdetail = response.data.data;
          setServices(patientdetail);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch services only if there is an input value and clearInputValue is false
    if (inputValue.trim() !== '' && !clearInputValue) {
      fetchServices();
    }
  }, [apiUrl, inputValue, clearInputValue]);

  const handleServiceSelect = (event, newValue) => {
    // Update the selected value
    setSelectedValue(newValue);
    // Invoke the callback function provided by the parent component
    onServiceSelect(newValue);
  };

  useEffect(() => {
    // Clear input value and selected value when clearInputValue or clearSelectedValue changes
    if (clearInputValue || clearSelectedValue) {
      setInputValue('');
      setSelectedValue(null);
    }
  }, [clearInputValue, clearSelectedValue]);

  return (
    <div>
      {/* Material-UI Autocomplete component */}
      <Autocomplete
        options={services}
        getOptionLabel={(option) => option.LongName}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onChange={handleServiceSelect}
        value={selectedValue}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" size="small" />
        )}
      />
    </div>
  );
};

export default GeneralAutoComplete;
