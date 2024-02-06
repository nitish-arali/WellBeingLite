import { Box } from '@mui/system';
import customAxios from '../CustomAxios';
import React, { useRef, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Container } from '@mui/system';
import TextField from 'views/Patient/FormsUI/Textfield';
import Select from '../Select';
import DateTimePicker from '../DateTimePicker';
import Button from 'views/Patient/FormsUI/Button';
import Dialog from '@mui/material/Dialog';
import Pagination from '@mui/material/Pagination';
import MaterialUIPagination from '../MaterialUIPagination';
import PatientHeaderVisit from '../PatientHeaderVisit/indexvisit';
import { TableContainer, Paper, Grid, Typography, IconButton } from '@mui/material';
import CustomSelect from '../CustomSelect';
import MuiButton from '@mui/material/Button';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import CloseIcon from '@mui/icons-material/Cancel';
import CustomAutocomplete from '../Autocomplete';
import PaginationInfo from '../PaginationInfo';
import { useNavigate } from 'react-router';
import {
  urlGetAllPatients,
  urlGetPatientDetail,
  urlSearchPatientRecord,
  // urlGetAllVisitsToday,
  urlSearchUHID
} from 'endpoints.ts';

const containsDropdown = {
  1: 'Starts With',
  2: 'Ends With',
  3: 'Sounds Like',
  4: 'Anywhere'
};

const identifierType = [
  // { id: '1', name: 'Starts With' },
  // { id: '2', name: 'Ends With' },
  // { id: '3', name: 'Sounds Like' },
  // { id: '4', name: 'Anywhere' }
];

const NewVisit = () => {
  const [
    initialFormState1
    // , setInitialFormState1
  ] = useState({
    PatientName: '',
    Uhid: '',
    MobileNumber: '',
    Age: '',
    Gender: '',
    IdentifierType: '',
    IdentifierTypeValue: '',
    RegistrationFrom: '',
    RegistrationTo: '',
    City: '',
    DateOfBirth: '',
    NameFilter: ''
  });

  const [patientDropdown, setPatientDropdown] = useState({
    Gender: []
  });
  const formikRef = useRef(null);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [patientDetails, setPatientDetails] = useState([]);
  const [patientsearchDetails, setPatientSearchDetails] = useState([]);
  const [encounterId] = useState(null);
  const navigate = useNavigate();

  const [currentPage1, setCurrentPage1] = useState(1);
  const [patientsPerPage1] = useState(10); // Number of patients per page

  const indexOfLastPatient = currentPage1 * patientsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage1;
  const currentPatients = patientsearchDetails.slice(indexOfFirstPatient, indexOfLastPatient);

  useEffect(() => {
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
    });
  }, []);

  // Calculate the range information
  let startRange = 1;
  let endRange = patientsearchDetails.length;

  if (patientsearchDetails.length > 0) {
    startRange = indexOfFirstPatient + 1;
    endRange = Math.min(indexOfLastPatient, patientsearchDetails.length);
  }
  // Change page
  const onPageChange = (pageNumber) => {
    setCurrentPage1(pageNumber);
  };

  // Function to filter patients by name

  const totalPatientCountStyle = {
    textAlign: 'center', // Center the text
    marginTop: '10px',
    paddingLeft: '10px', // Adjust the margin as needed
    paddingRight: '10px' // Adjust the margin as needed
  };

  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log('Form submitted with values:', values);

    console.log('Form Values:', values);
    const uhid = selectedUhId ? selectedUhId.UhId : '';

    // ... Repeat for other parameters
    try {
      // Assuming postData1 is an object with your input values
      const postData1 = {
        Uhid: uhid === '' ? '""' : uhid, // Set to empty string when left blank
        NameFilter: values.NameFilter === '' ? '' : values.NameFilter,
        PatientName: values.PatientName === '' ? '""' : values.PatientName,
        DateOfBirth: values.DateOfBirth === '' ? '""' : values.DateOfBirth,
        RegistrationFrom: values.RegistrationFrom === '' ? '""' : values.RegistrationFrom,
        RegistrationTo: values.RegistrationTo === '' ? '""' : values.RegistrationTo,
        Age: values.Age === '' ? '' : values.Age, // A sample value
        Gender: values.Gender === '' ? '' : values.Gender, // A sample value
        MobileNumber: values.MobileNumber === '' ? '""' : values.MobileNumber,
        City: values.City === '' ? '""' : values.City,
        identifierType: values.IdentifierType === '' ? '' : values.IdentifierType,
        IdentifierTypeValue: values.IdentifierTypeValue === '' ? '""' : values.IdentifierTypeValue
      };
      customAxios
        .get(
          `${urlSearchPatientRecord}?Uhid=${postData1.Uhid}&NameFilter=${postData1.NameFilter}&PatientName=${postData1.PatientName}&DateOfBirth=${postData1.DateOfBirth}&RegistrationFrom=${postData1.RegistrationFrom}&RegistrationTo=${postData1.RegistrationTo}&Age=${postData1.Age}&Gender=${postData1.Gender}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}&IdentifierType=${postData1.identifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}`,
          null,
          {
            params: postData1,
            headers: {
              'Content-Type': 'application/json' // Replace with the appropriate content type if needed
            }
          }
        )
        .then((response) => {
          console.log('Response:', response.data);
          //resetForm();
          setPatientSearchDetails(response.data.data.Patients);
          setCurrentPage1(1);
        });
    } catch (error) {
      // Handle any errors here
      console.error('Error:', error);
    }
  };

  const handleClearForm = (event) => {
    if (event) {
      event.preventDefault();
    }
    setSelectedUhId(null);
    loadPatients();
    formikRef.current.resetForm();
  };

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleAutocompleteChange = (newValue) => {
    setSelectedUhId(newValue);
  };

  const fetchOptionsCallback = async (inputValue) => {
    try {
      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${inputValue}`);
      if (response.data && Array.isArray(response.data.data)) {
        setOptions(response.data.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOptions([]);
    }
  };

  function formatDate(inputDate) {
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  const handleBackToList = () => {
    const url = `/patient`;
    // Navigate to the new URL
    navigate(url);
  };
  const getOptionLabel = (option) => option.UhId;

  const isOptionEqualToValue = (option, value) => option.UhId === value.UhId;
  return (
    <Box>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <Formik
              initialValues={{ ...initialFormState1 }}
              onSubmit={handleSubmit}
              innerRef={formikRef} // Assign the ref to the Formik component
            >
              {() => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h3">Patient Search</Typography>
                      </div>
                      <div
                        style={{
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <IconButton edge="end" color="inherit" onClick={handleBackToList}>
                          <KeyboardDoubleArrowLeftRoundedIcon style={{ color: 'blue' }} />
                        </IconButton>
                        <Typography style={{ color: 'blue' }}> Back to list </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      {/* <TextField name="Uhid" label="Uhid" /> */}
                      <CustomAutocomplete
                        id="uhid-autocomplete"
                        label="UHID"
                        name="Uhid"
                        options={options}
                        value={selectedUhId}
                        onInputChange={handleInputChange}
                        onChange={handleAutocompleteChange}
                        fetchOptionsCallback={fetchOptionsCallback}
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CustomSelect
                        style={{ width: '100%' }}
                        name="NameFilter"
                        options={containsDropdown}
                        valueProp="id"
                        labelProp="name"
                        label="NameFilter"
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="PatientName" label="Name" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <DateTimePicker style={{ width: '100%' }} name="DateOfBirth" label="Date of Birth" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CustomSelect
                        style={{ width: '100%' }}
                        name="IdentifierType"
                        options={identifierType}
                        valueProp="id"
                        labelProp="name"
                        label="IdentifierType"
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="IdentifierTypeValue" label="Identifier Value" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <DateTimePicker style={{ width: '100%' }} name="RegistrationFrom" label="Registration From" />
                    </Grid>{' '}
                    <Grid item xs={6} md={3}>
                      <DateTimePicker style={{ width: '100%' }} name="RegistrationTo" label="Registration To" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="MobileNumber" label="Mobile Number" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="City" label="City" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="Age" label="Age" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        name="Gender"
                        label="Gender"
                        options={patientDropdown.Gender}
                      />
                    </Grid>
                    {/* Repeat the above Field block for other form fields */}
                    <Grid item xs={6}></Grid>
                    <Grid item xs={2} justifyContent={'end'}>
                      <Button type="submit" style={{ width: '100%' }}>
                        Search
                      </Button>
                    </Grid>
                    <Grid item xs={2} justifyContent={'end'}>
                      <MuiButton variant="contained" fullWidth color="primary" onClick={handleClearForm}>
                        Clear
                      </MuiButton>
                    </Grid>
                    {/*   <Grid item xs={2} justifyContent={'end'}>
                      <MuiButton color="primary" variant="contained" fullWidth onClick={}>
                        Cancel
                      </MuiButton>
                    </Grid> */}
                    {/* Display "Showing X-Y of Z" */}
                  </Grid>

                  {/* Display "Showing X-Y of Z" */}

                  <div style={totalPatientCountStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Showing {firstPatientIndex}-{lastPatientIndex} of {totalPatients} Patients */}
                      <PaginationInfo startRange={startRange} endRange={endRange} totalItems={patientsearchDetails.length} />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    {currentPatients.map((patient1, index) => (
                      // Render a PatientHeader for each patient in the list
                      <PatientHeaderVisit key={index} patientdata={patient1} />
                    ))}
                  </div>
                  {/* Pagination */}
                  <MaterialUIPagination
                    currentPage={currentPage1}
                    totalPages={Math.ceil(patientsearchDetails.length / patientsPerPage1)}
                    onPageChange={onPageChange}
                  />
                </Form>
              )}
            </Formik>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
export default NewVisit;
