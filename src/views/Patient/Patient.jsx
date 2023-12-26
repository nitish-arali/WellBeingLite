import customAxios from './FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { TableContainer, Paper, Grid, Typography, IconButton } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import PersonAdd from '@mui/icons-material/PersonAddAlt1Rounded';
import PersonVisit from '@mui/icons-material/HowToRegRounded';
import Box from '@mui/material/Box';
import calendarIcon from '../../assets/images/icons/calendar_icon.png';
import {
  urlGetAllPatients,
  urlGetPatientDetail,
  urlAddNewPatient,
  urlSearchPatientRecord,
  // urlGetAllVisitsToday,
  urlSearchUHID,
  urlGetDepartmentBasedOnPatitentType,
  urlGetServiceLocationBasedonId,
  urlGetProviderBasedOnDepartment
} from '../../endpoints.ts';
import InputAdornment from '@mui/material/InputAdornment';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container } from '@mui/system';
import TextField from './FormsUI/Textfield';
import Select from './FormsUI/Select';
import DateTimePicker from './FormsUI/DateTimePicker/index.js';
import Button from './FormsUI/Button/index.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSelect from './FormsUI/CustomSelect';
import { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Pagination from '@mui/material/Pagination';
import MaterialUIPagination from './FormsUI/MaterialUIPagination/index.js';
import Stack from '@mui/material/Stack';
import PaginationInfo from './FormsUI/PaginationInfo/index.js';
import CloseIcon from '@mui/icons-material/Cancel';
import useLoader from '../../hooks/useLoader';
import CustomAutocomplete from './FormsUI/Autocomplete/index.js';
import PatientHeader from './FormsUI/PatientHeader/index.js';
import PatientHeaderVisit from './FormsUI/PatientHeaderVisit/indexvisit.js';
import CustomLoader from './FormsUI/CustomLoader/index';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));
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

// const containsDropdown = {
//   1: 'Starts With',
//   2: 'Ends With',
//   3: 'Sounds Like',
//   4: 'Anywhere'
// };
const containsDropdown = [
  { id: '1', name: 'Starts With' },
  { id: '2', name: 'Ends With' },
  { id: '3', name: 'Sounds Like' },
  { id: '4', name: 'Anywhere' },

];

const identifierType = [
  // { id: '1', name: 'Starts With' },
  // { id: '2', name: 'Ends With' },
  // { id: '3', name: 'Sounds Like' },
  // { id: '4', name: 'Anywhere' },

];

export default function Patient() {
  const [patientDetails, setPatientDetails] = useState([]);
  const [patientsearchDetails, setPatientSearchDetails] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);

  const [selectedPatientType, setSelectedPatientType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedServiceLocation, setSelectedServiceLocation] = useState('');
  const [encounterId] = useState(null);

  const [
    initialFormState
    // ,     setInitialFormState
  ] = useState({
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

  // const handleResetFormInitialFormState = () => {
  //   setInitialFormState({
  //     PatientFirstName: '',
  //     PatientMiddleName: '',
  //     PatientLastName: '',
  //     FatherHusbandName: '',
  //     Height: '',
  //     Weight: '',
  //     PermanentAddress1: '',
  //     PermanentPinCode: '',
  //     MobileNumber: '',
  //     EmailId: '',
  //     Occupation: '',
  //     ReligionId: '',
  //     country: '',
  //     state: '',
  //     city: '',
  //     dob: '',
  //     check: '',
  //     title: '',
  //     PatientGender: '',
  //     MaritalStatus: '',
  //     PermanentStateId: '',
  //     PermanentPlaceId: '',
  //     PermanentAreaId: '',
  //     PatientType: '',
  //     Department: '',
  //     Provider: '',
  //     ServiceLocation: ''
  //   });
  //   // Reset any other state variables related to the form
  //   setSelectedCountry('');
  //   setSelectedState('');
  //   setSelectedCity('');
  // };

  // const handleResetFormInitialFormState1 = () => {
  //   setInitialFormState1({
  //     PatientName: '',
  //     Uhid: '',
  //     MobileNumber: '',
  //     Age: '',
  //     Gender: '',
  //     IdentifierType: '',
  //     IdentifierTypeValue: '',
  //     RegistrationFrom: '',
  //     RegistrationTo: '',
  //     City: '',
  //     DateOfBirth: '',
  //     NameFilter: ''
  //   });
  // };

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  //   if (newValue === '1') {
  //     handleResetFormInitialFormState();
  //     handleResetFormInitialFormState1();
  //     handleResetFormInitialFormState2();
  //     setSelectedCountry('');
  //     setSelectedState('');
  //     setSelectedCity('');
  //     setSelectedUhId(null);
  //     loadPatients();
  //   } else if (newValue === '2') {
  //     handleResetFormInitialFormState(); // Call the custom reset function
  //     handleResetFormInitialFormState1();
  //     handleResetFormInitialFormState2();
  //     setSelectedCountry('');
  //     setSelectedState('');
  //     setSelectedCity('');
  //     setSelectedUhId(null);
  //   } else {
  //     handleResetFormInitialFormState();
  //     handleResetFormInitialFormState1();
  //     handleResetFormInitialFormState2(); // Call the custom reset function
  //     setSelectedCountry('');
  //     setSelectedState('');
  //     setSelectedCity('');
  //     setSelectedUhId(null);
  //   }
  // };
  const { loaderLoading, startLoading, stopLoading } = useLoader();
  useEffect(() => {
    customAxios.get(urlGetAllPatients).then((response) => {
      setPatientDetails(response.data.data.Patients);
    });
  }, []);

  useEffect(() => {
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
    });
  }, []);

  useEffect(() => {
    if (selectedPatientType) {
      fetchDept(selectedPatientType);
    } else {
      // Reset the department dropdown if no patient type is selected
      setDepartments([]);
      setSelectedDepartment('');
    }
  }, [selectedPatientType]);

  const fetchDept = async (selectedPatientType) => {
    try {
      // Make an API call to fetch patient details using patientId
      startLoading();
      const response = await customAxios.get(`${urlGetDepartmentBasedOnPatitentType}?PatientType=${selectedPatientType}`);
      if (response.status === 200) {
        const dept = response.data.data.Department;
        setDepartments(dept);
        stopLoading();
      } else {
        stopLoading();
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      stopLoading();
      console.error('Error fetching patient details:', error);
    }
  };

  useEffect(() => {
    // Fetch data for the "provider" and "servicelocation" dropdowns when "selectedDepartment" changes
    if (selectedDepartment) {
      fetchProvider(selectedDepartment);
      fetchServicelocation(selectedDepartment, selectedPatientType);

      // customAxios.get(`${urlGetProviderBasedOnDepartment}?DepartmentId=${selectedDepartment}`)
      //   .then((data) => setProviders(data.Provider))
      //   .catch((error) => console.error('Error fetching providers:', error));

      // customAxios.get(`${urlGetServiceLocationBasedonId}?DepartmentId=${selectedDepartment}?patienttype=${selectedPatientType}`)
      //   .then((data) => setServiceLocations(data.ServiceLocation))
      //   .catch((error) => console.error('Error fetching service locations:', error));
    } else {
      // Reset the provider and servicelocation dropdowns if no department is selected
      setProviders([]);
      setServiceLocations([]);
      setSelectedProvider('');
      setSelectedServiceLocation('');
    }
  }, [selectedDepartment]);

  const fetchProvider = async (selectedDepartment) => {
    try {
      // Make an API call to fetch patient details using patientId
      const response = await customAxios.get(`${urlGetProviderBasedOnDepartment}?DepartmentId=${selectedDepartment}`);
      if (response.status === 200) {
        const provider = response.data.data.Provider;
        setProviders(provider);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };
  const fetchServicelocation = async (selectedDepartment, selectedPatientType) => {
    try {
      // Make an API call to fetch patient details using patientId
      const response = await customAxios.get(
        `${urlGetServiceLocationBasedonId}?DepartmentId=${selectedDepartment}&patienttype=${selectedPatientType}`
      );
      if (response.status === 200) {
        const serviceloc = response.data.data.ServiceLocation;
        setServiceLocations(serviceloc);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };
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

  const [selectedUhId, setSelectedUhId] = useState(null);
  // const [setInputValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
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

  const formikRef = useRef(null);
  const loadPatients = () => {
    customAxios.get(urlGetAllPatients).then((response) => {
      setPatientDetails(response.data.data.Patients);
    });
  };
  // const loadvisits = () => {
  //   customAxios.get(urlGetAllVisitsToday).then((response) => {
  //     setVisitDetails(response.data.data.EncounterModelList);
  //   });
  // };

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

  const [openAddPatientDialog, setOpenAddPatientDialog] = useState(false);
  const [openCreateVisitDialog, setOpenCraeteVisitDialog] = useState(false);

  let shouldCloseDialog = false; // Initialize the condition
  let shouldVisitCloseDialog = false; // Initialize the condition

  const handleOpenAddPatientDialog = () => {
    setOpenAddPatientDialog(true);
  };
  const handleOpenCreateVisitDialog = () => {
    setOpenCraeteVisitDialog(true);
  };

  const handleCustomClose = () => {
    // Set the condition to true when you want to close the dialog
    shouldCloseDialog = true;
    handleCloseAddPatientDialog();
  };

  const handleCustomVisitClose = () => {
    // Set the condition to true when you want to close the dialog
    loadPatients();
    shouldVisitCloseDialog = true;
    handleCloseCreateVisitDialog();
    setSelectedUhId(null);
  };

  const handleCloseAddPatientDialog = () => {
    // Add a condition to check if the dialog should be closed
    if (shouldCloseDialog) {
      setOpenAddPatientDialog(false);
    }
  };

  const handleCloseCreateVisitDialog = () => {
    // Add a condition to check if the dialog should be closed
    if (shouldVisitCloseDialog) {
      setOpenCraeteVisitDialog(false);
      setPatientSearchDetails([]);
    }
  };

  const [currentPage1, setCurrentPage1] = useState(1);
  const [patientsPerPage1] = useState(10); // Number of patients per page

  const indexOfLastPatient = currentPage1 * patientsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage1;
  const currentPatients = patientsearchDetails.slice(indexOfFirstPatient, indexOfLastPatient);

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

  //pagination and x-y of z and totalcountof patient
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Function to filter patients by name
  const filteredPatients = patientDetails.filter((patient) => patient.PatientFirstName.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPatients = filteredPatients.length;
  const firstPatientIndex = (currentPage - 1) * patientsPerPage + 1;
  const lastPatientIndex = Math.min(currentPage * patientsPerPage, totalPatients);
  // Function to change the current page
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const totalPatientCountStyle = {
    textAlign: 'center', // Center the text
    marginTop: '10px',
    paddingLeft: '10px', // Adjust the margin as needed
    paddingRight: '10px' // Adjust the margin as needed
  };
  const searchInputStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
    // marginBottom: '5px',
  };

  const classes = useStyles();
  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TableContainer component={Paper}>
          <div style={{ width: '100%' }}>
            <div>
              <Box
                width={'100%'}
                height={'80px'}
                // border={2}
                // borderColor="#efebe9"
                backgroundColor="#d1c4e9"
                // borderRadius={4}
                display="flex"
                alignItems="center"
                justifyContent="space-evenly"
                p={2}
                mb={2}
              >
                <Grid container width={'100%'} justifyContent="space-between" alignItems="center">
                  <Grid item xs={3}>
                    <MuiButton variant="contained" startIcon={<PersonAdd />} onClick={handleOpenAddPatientDialog}>
                      Add Patient
                    </MuiButton>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" justifyContent="center" alignItems="center" marginBottom="5px">
                      <Grid container justifyContent="center" alignItems="center">
                        <img src={calendarIcon} alt="Patient count" height="40px" />
                        <div
                          style={{
                            height: '30px',
                            width: '30px',
                            color: 'black',
                            backgroundColor: '#fff',
                            padding: '5px',
                            fontSize: '15px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '10px',
                            fontWeight: 'bolder'
                          }}
                        >
                          {filteredPatients.length}
                        </div>

                        <Grid item xs={12} display="flex" justifyContent="center">
                          <Typography variant="p">Visits for Today</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={1}>
                    <MuiButton variant="contained" startIcon={<PersonVisit />} onClick={handleOpenCreateVisitDialog}>
                      Visit
                    </MuiButton>
                  </Grid>
                </Grid>
              </Box>
              <Grid container width={'100%'} paddingBottom="20px">
                <Grid item xs={4}>
                  <Typography variant="h3" sx={{ paddingLeft: '20px' }}>
                    List of Patients in Visit
                  </Typography>
                  <div style={totalPatientCountStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                      Showing {firstPatientIndex}-{lastPatientIndex} of {totalPatients} Patients
                    </div>
                  </div>
                </Grid>

                <Grid item xs={5}></Grid>

                <Grid item xs={3}>
                  <div style={searchInputStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Search by patient name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{
                          marginRight: '10px',
                          borderRadius: '5px', // Add border radius
                          padding: '10px 5px', // Add padding
                          border: '3px solid #ccc' // Add border for styling
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                {loaderLoading ? (
                  <CustomLoader loading={loaderLoading} color="#007bff" size={15} />
                ) : (
                  <>
                    {filteredPatients.slice((currentPage - 1) * patientsPerPage, currentPage * patientsPerPage).map((patient, index) => (
                      <PatientHeader key={index} patientdata={patient} encounterId={encounterId} />
                    ))}
                  </>
                )}
                {/* Pagination */}
                <Stack direction="row" spacing={2} justifyContent="end">
                  <Pagination
                    count={Math.ceil(filteredPatients.length / patientsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Stack>
              </div>
            </div>
          </div>
        </TableContainer>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {/* Same as */}
        <ToastContainer />
      </Box>
      <Dialog
        open={openAddPatientDialog}
        onClose={handleCloseAddPatientDialog}
        PaperProps={{
          style: {
            maxWidth: '1300px',
            height: '600px' // Set your desired custom max-width here
          }
        }}
      >
        <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
          <Grid container width={'100%'}>
            <Grid item xs={12}>
              <Container maxWidth="xlg">
                <div className={classes.formWrapper}>
                  <Formik
                    initialValues={{ ...initialFormState }}
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values, { resetForm }) => {
                      setLoading(true);
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
                          setLoading(false);
                          //alert(JSON.stringify(response.data));
                          if (response.data == true) {
                            // setSuccessToastMessage('Patient registration successful.');

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
                            setOpenAddPatientDialog(false);
                            loadPatients();
                          } else {
                            alert('Invalid Login');
                          }
                        })
                        .catch((error) => {
                          // Handle errors here
                          console.error('Error:', error);
                          setLoading(false);
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <IconButton edge="end" color="inherit" onClick={handleCustomClose}>
                              <CloseIcon />
                            </IconButton>
                          </div>
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
                        {/* <Grid item xs={6} md={3}>
                              <Select style={{ width: '100%' }} name="bggroup" label="Blood Group" options={patientDropdown.BloodGroup} />
                            </Grid> */}
                        <Grid item xs={6} md={3}>
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

                        {loading && (
                          <div className="loader-container">
                            <ScaleLoader
                              color={'#36d646'}
                              loading={loading}
                              css={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh' // Make the loader cover the entire viewport height
                              }}
                              size={150}
                            />
                            {/* <RingLoader color={'#123abc'} loading={loading} css={{ margin: 'auto' }} size={150} /> */}
                          </div>
                        )}
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2} textAlign={'end'}>
                          <Button>Submit</Button>
                        </Grid>
                        <Grid item xs={2} justifyContent={'end'}>
                          <MuiButton color="primary" variant="contained" fullWidth onClick={handleCustomClose}>
                            Cancel
                          </MuiButton>
                        </Grid>
                      </Grid>
                    </Form>
                  </Formik>
                </div>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      <Dialog
        open={openCreateVisitDialog}
        onClose={handleCloseCreateVisitDialog}
        PaperProps={{
          style: {
            maxWidth: '1000px',
            height: '600px' // Set your desired custom max-width here
          }
        }}
      >
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <IconButton edge="end" color="inherit" onClick={handleCustomVisitClose}>
                            <CloseIcon />
                          </IconButton>
                        </div>

                        {/* <Button onClick={handleAddPatientClick} >Add Patient</Button> */}
                      </Grid>
                      <Grid item xs={6} md={3}>
                        {/* <TextField name="Uhid" label="Uhid" /> */}
                        <CustomAutocomplete
                          id="uhid-autocomplete"
                          label="UHID"
                          options={options}
                          value={selectedUhId}
                          onInputChange={handleInputChange}
                          onChange={handleAutocompleteChange}
                          fetchOptionsCallback={fetchOptionsCallback}
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
                      <Grid item xs={2} justifyContent={'end'}>
                        <MuiButton color="primary" variant="contained" fullWidth onClick={handleCustomVisitClose}>
                          Cancel
                        </MuiButton>
                      </Grid>
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
      </Dialog>
    </>
  );
}
