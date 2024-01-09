import React, { useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Formik, Form, useField } from 'formik';
import { Container } from '@mui/system';
import Select from '../Select';
import DateTimePicker from '../DateTimePicker';
import Box from '@mui/material/Box';
import TextField from 'views/Patient/FormsUI/Textfield';
import Button from 'views/Patient/FormsUI/Button';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import customAxios from '../CustomAxios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';

import {
  urlGetPatientDetail,
  urlAddNewPatient,
  urlGetDepartmentBasedOnPatitentType,
  urlGetProviderBasedOnDepartment,
  urlGetServiceLocationBasedonId
} from 'endpoints.ts';
import { makeStyles } from '@mui/styles';
import * as Yup from 'yup';
import { Grid, Typography } from '@mui/material';

const FORM_VALIDATION = Yup.object().shape({
  PatientFirstName: Yup.string().required('required'),
  PatientMiddleName: Yup.string(),
  PatientLastName: Yup.string().required('required'),
  FatherHusbandName: Yup.string(),
  EmailId: Yup.string().email('invalid email'),
  MobileNumber: Yup.number().integer().typeError('Please enter a valid mobile number').required('required'),
  PermanentAddress1: Yup.string(),
  Occupation: Yup.string(),
  ReligionId: Yup.string(),
  Height: Yup.number().typeError('Please enter valid height in cms'),
  Weight: Yup.number().typeError('Please enter valid Weight in kg'),
  Address: Yup.string(),
  PermanentPinCode: Yup.number(),
  dob: Yup.date().required('required'),
  PatientGender: Yup.string().required('required'),
  title: Yup.string().required('required'),
  PatientType: Yup.string().required('required'),
  Department: Yup.string().required('required'),
  Provider: Yup.string().required('required'),
  ServiceLocation: Yup.string().required('required')
});
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

const NewPatient = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);

  const [selectedPatientType, setSelectedPatientType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedServiceLocation, setSelectedServiceLocation] = useState('');

  const [patientId, setPatientId] = useState(null);
  const [encounterId, setEncounterId] = useState(null);

  const navigate = useNavigate();
  const [initialFormState] = useState({
    PatientFirstName: '',
    PatientMiddleName: '',
    PatientLastName: '',
    FatherHusbandName: '',
    Height: '',
    Weight: '',
    PermanentAddress1: '',
    PermanentPinCode: '',
    MobileNumber: '',
    EmailId: '',
    Occupation: '',
    ReligionId: '',
    country: '',
    state: '',
    city: '',
    dob: '',
    check: '',
    title: '',
    PatientGender: '',
    MaritalStatus: '',
    PermanentStateId: '',
    PermanentPlaceId: '',
    PermanentAreaId: '',
    PatientType: '',
    Department: '',
    Provider: '',
    ServiceLocation: ''
  });

  const [patientDropdown, setPatientDropdown] = useState({
    Title: [],
    Gender: [],
    BloodGroup: [],
    MaritalStatus: [],
    Countries: [],
    Statesnew: [],
    PatientType: [],
    KinTitle: [],
    VisitType: []
  });

  useEffect(() => {
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
    });
  }, []);

  // Your other state declarations...

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPatientType) {
        try {
          const response = await customAxios.get(`${urlGetDepartmentBasedOnPatitentType}?PatientType=${selectedPatientType}`);
          if (response.status === 200) {
            const dept = response.data.data.Department;
            setDepartments(dept);
          } else {
            console.error('Failed to fetch departments');
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
      } else {
        // Reset the department dropdown if no patient type is selected
        setDepartments([]);
        setSelectedDepartment('');
      }
    };

    fetchData();
  }, [selectedPatientType, setSelectedDepartment, setDepartments]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data for the "provider" and "servicelocation" dropdowns when "selectedDepartment" changes
      if (selectedDepartment) {
        try {
          const providerResponse = await customAxios.get(`${urlGetProviderBasedOnDepartment}?DepartmentId=${selectedDepartment}`);
          const serviceLocationResponse = await customAxios.get(
            `${urlGetServiceLocationBasedonId}?DepartmentId=${selectedDepartment}&patienttype=${selectedPatientType}`
          );

          if (providerResponse.status === 200) {
            const provider = providerResponse.data.data.Provider;
            setProviders(provider);
          } else {
            console.error('Failed to fetch providers');
          }

          if (serviceLocationResponse.status === 200) {
            const serviceloc = serviceLocationResponse.data.data.ServiceLocation;
            setServiceLocations(serviceloc);
          } else {
            console.error('Failed to fetch service locations');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        // Reset the provider and servicelocation dropdowns if no department is selected
        setProviders([]);
        setServiceLocations([]);
        setSelectedProvider('');
        setSelectedServiceLocation('');
      }
    };

    fetchData();
  }, [selectedDepartment, selectedPatientType]);

  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    setSelectedState('');
    setSelectedCity('');
    // Filter states based on the selected country
    const statesForCountry = patientDropdown.Statesnew.filter((state) => state.CountryId === newCountry);
    setFilteredStates(statesForCountry);
    setFilteredCities([]); // Clear the city dropdown
  };
  // Handle state change
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setSelectedCity('');
    // Filter cities based on the selected state
    const citiesForState = patientDropdown.Placenew.filter((city) => city.StateId === newState);
    setFilteredCities(citiesForState);
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

  const navigateToBilling = () => {
    // debugger;
    if (patientId !== null && encounterId !== null) {
      const url = `/Master/${patientId}/${encounterId}`;
      // Navigate to the new URL
      navigate(url);
    } else {
      console.error('patientId or encounterId is null');
    }
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <div className={useStyles.formWrapper}>
              <Formik
                initialValues={{ ...initialFormState }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values, { resetForm }) => {
                  debugger;
                  console.log(values);
                  const formattedDate = formatDate(values.dob);
                  const postData = {
                    PatientFirstName: values.PatientFirstName,
                    PatientMiddleName: values.PatientMiddleName,
                    PatientLastName: values.PatientLastName,
                    FacilityId: 1,
                    MobileNumber: values.MobileNumber,
                    PatientTitle: values.title,
                    Gender: values.PatientGender,
                    DateOfBirthstring: formattedDate,
                    PatientType: values.PatientType,
                    FacilityDepartmentId: values.Department,
                    FacilityDepartmentServiceLocationId: values.ServiceLocation,
                    ProviderId: values.Provider
                  };

                  customAxios
                    .post(urlAddNewPatient, null, {
                      params: postData,
                      headers: {
                        'Content-Type': 'application/json' // Replace with the appropriate content type if needed
                        // Add any other required headers here
                      }
                    })
                    .then((response) => {
                      // Handle the response data here

                      console.log('Response:', response.data);

                      //alert(JSON.stringify(response.data));
                      if (response.data.data.EncounterModel != null) {
                        // setSuccessToastMessage('Patient registration successful.');

                        const encounterId = response.data.data.EncounterModel.EncounterId;
                        const patientId = response.data.data.EncounterModel.PatientId;

                        // Update the state
                        setEncounterId(response.data.data.EncounterModel.EncounterId);
                        setPatientId(response.data.data.EncounterModel.PatientId);

                        navigateToBilling(patientId, encounterId);

                        toast.success('Patient Registration Successful');

                        // handleResetFormInitialFormState(); // Call the custom reset function
                        resetForm(); // Reset the form using Formik's resetForm function
                        // Reset the selectedCountry and selectedState states
                        setSelectedPatientType('');
                        setSelectedDepartment('');
                        setSelectedServiceLocation('');
                        setSelectedProvider('');
                        setSelectedCountry('');
                        setSelectedState('');
                        setSelectedCity('');
                      } else {
                        alert('Invalid Login');
                      }
                    })
                    .catch((error) => {
                      // Handle errors here
                      console.error('Error:', error);

                      //navigate('/error')
                    });
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h3" style={{ color: 'blue' }}>
                          Register New Patient
                        </Typography>
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
                    <Grid item xs={12}>
                      <Typography variant="h3">Patient Details</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        name="title"
                        label={
                          <span>
                            Title <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        options={patientDropdown.Title}
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                      />
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <TextField
                        name="PatientFirstName"
                        label={
                          <span>
                            First Name <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="PatientMiddleName" label="Middle Name" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="PatientLastName"
                        label={
                          <span>
                            Last Name<span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        label={
                          <span>
                            Gender <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        name="PatientGender"
                        options={patientDropdown.Gender}
                      />
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <TextField name="FatherHusbandName" label="Father / Husband Name" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        name="MaritalStatus"
                        label="Patient Marital Status"
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        options={patientDropdown.MaritalStatus}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="Height"
                        label="Height"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">Cms</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="Weight"
                        label="Weight"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">Kg</InputAdornment>
                        }}
                      />
                    </Grid>

                    <Grid item xs={24} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <DateTimePicker
                            style={{ width: '100%' }}
                            label={
                              <span>
                                Date of Birth <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                              </span>
                            }
                            name="dob"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}></Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h3">Address</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField name="PermanentAddress1" label="Address" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        name="country"
                        label="country"
                        options={patientDropdown.Countries}
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        onChangeCallback={handleCountryChange}
                        value={selectedCountry || ''}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        label="State"
                        options={filteredStates}
                        name="state"
                        getOptionLabel={(option) => option.StateName}
                        getOptionValue={(option) => option.StateID}
                        onChangeCallback={handleStateChange}
                        //onChangeCallback={(newState) => setSelectedState(newState)}
                        value={selectedState || ''} // Ensure that selectedState reflects the user's selection
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        name="city"
                        label="City"
                        options={filteredCities}
                        getOptionLabel={(option) => option.PlaceName}
                        getOptionValue={(option) => option.PlaceId}
                        // onChange={(event) => setSelectedCity(event.target.value)}
                        onChangeCallback={(newCity) => setSelectedCity(newCity)}
                        value={selectedCity || ''} // Ensure that selectedState reflects the user's selection
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="PermanentPinCode" label="Pin Code" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h3">Contact Details</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="MobileNumber"
                        label={
                          <span>
                            Mobile Number <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="EmailId" placeholder="abc@gmail.com" label="Email ID" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField name="Occupation" label="Occupation" />
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Select
                        name="ReligionId"
                        style={{ width: '100%' }}
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        label="Religion"
                        options={patientDropdown.Religion}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h3">VisitDetails</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        label={
                          <span>
                            Patient Type <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        options={patientDropdown.PatientType}
                        name="PatientType"
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        onChangeCallback={setSelectedPatientType}
                        value={selectedPatientType}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        label={
                          <span>
                            Department <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        options={departments}
                        name="Department"
                        getOptionLabel={(option) => option.DepartmentName}
                        getOptionValue={(option) => option.DepartmentId}
                        onChangeCallback={setSelectedDepartment}
                        value={selectedDepartment}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        label={
                          <span>
                            Provider <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        options={providers}
                        name="Provider"
                        getOptionLabel={(option) => option.ProviderName}
                        getOptionValue={(option) => option.ProviderId}
                        onChangeCallback={setSelectedProvider}
                        value={selectedProvider}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        label={
                          <span>
                            Service Location <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        options={serviceLocations}
                        name="ServiceLocation"
                        getOptionLabel={(option) => option.ServiceLocationName}
                        getOptionValue={(option) => option.FacilityDepartmentServiceLocationId}
                        onChangeCallback={setSelectedServiceLocation}
                        value={selectedServiceLocation}
                      />
                    </Grid>

                    <Grid item xs={8}></Grid>
                    <Grid item xs={2} textAlign={'end'}>
                      <Button type="submit">Submit</Button>
                    </Grid>
                    <Grid item xs={2} justifyContent={'end'}></Grid>
                  </Grid>
                </Form>
              </Formik>
            </div>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
export default NewPatient;
