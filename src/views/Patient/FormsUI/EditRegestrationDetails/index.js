//import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
//import TextField from '@mui/material/TextField';
import TextField from '../Textfield/index.js';
//import Button from '@mui/material/Button';
import Button from '../Button/index.js';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import Select from '../Select/index.js';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container } from '@mui/system';
import CloseIcon from '@mui/icons-material/Cancel';
import DateTimePicker from '../DateTimePicker/index.js';
import InputAdornment from '@mui/material/InputAdornment';
import { makeStyles } from '@mui/styles';
import { urlGetPatientDetail,urlAddNewPatient } from 'endpoints.ts';
import customAxios from '../CustomAxios/index.js'
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
    //country: Yup.string().required('required'),
});
function EditRegistrationDialog({ open, onClose, selectedRow }) {
    debugger;
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [editPatientDetail, setEditPatientDetail] = useState([]);
    const useStyles = makeStyles((theme) => ({
        formWrapper: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(8)
        }
    }));
    const classes = useStyles();
    const formatDateToYYYYMMDD = (dateString) => {
        // Convert the date to the 'yyyy-MM-dd' format
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

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
        const fetchData = async () => {
          try {
            const response = await customAxios.get(`${urlGetPatientDetail}?PatientId=${selectedRow.PatientId}`);
            if (response.status === 200) {
                const apiData = response.data.data; // Assuming your API response structure matches the provided data
                const updateddata=response.data.data.AddNewPatient;
                setPatientDropdown(apiData);
                setEditPatientDetail(updateddata);
    
            } else {
              console.error('Failed to fetch patient details');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);

    function formatDate(inputDate) {
        const dateParts = inputDate.split('-');
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts;
            return `${day}-${month}-${year}`;
        }
        return inputDate; // Return as is if not in the expected format
    }
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
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const handleCancelClick = () => {
        onClose();
    };
    const handleCrossIconClick = () => {
        onClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{
            style: {
                maxWidth: '1300px',
                height: '600px' // Set your desired custom max-width here
            },
        }}>
            <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
                <Grid container width={'100%'}>
                    <Grid item xs={12}>
                        <Container maxWidth="xlg">
                            <div className={classes.formWrapper}>
                                <Formik
                                    // initialValues={initialFormStateEdit}
                                    enableReinitialize={true} // Add this prop
                                    initialValues={{
                                        PatientFirstName: editPatientDetail.PatientFirstName || '',
                                        PatientMiddleName: editPatientDetail.PatientMiddleName || '',
                                        PatientLastName: editPatientDetail.PatientLastName || '',
                                        FatherHusbandName: editPatientDetail.FatherHusbandName || '',
                                        Height: editPatientDetail.Height || '',
                                        Weight: editPatientDetail.Weight || '',
                                        PermanentAddress1: editPatientDetail.PermanentAddress1 || '',
                                        PermanentPinCode: editPatientDetail.PermanentPinCode || '',
                                        MobileNumber: editPatientDetail.MobileNumber || '',
                                        EmailId: editPatientDetail.EmailId || '',
                                        Occupation: editPatientDetail.Occupation || '',
                                        ReligionId: editPatientDetail.ReligionId || '',
                                        country: editPatientDetail.PermanentCountryId || '',
                                        state: editPatientDetail.PermanentStateId || '',
                                        city: editPatientDetail.PermanentPlaceId || '',
                                        dob: editPatientDetail.DateOfBirth ? formatDateToYYYYMMDD(editPatientDetail.DateOfBirth) : '',
                                        title: editPatientDetail.PatientTitle || '',
                                        PatientGender: editPatientDetail.Gender || '',
                                        MaritalStatus: editPatientDetail.MaritalStatus || '',
                                        PermanentStateId: editPatientDetail.PermanentStateId || '',
                                        PermanentPlaceId: editPatientDetail.PermanentPlaceId || '',
                                        PermanentAreaId: editPatientDetail.PermanentAreaId || '',
                                    }}
                                    validationSchema={FORM_VALIDATION}
                                    onSubmit={(values, { resetForm }) => {
                                        debugger;
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
                                            PatientId: selectedRow.PatientId
                                        };

                                        customAxios.post(urlAddNewPatient, null,
                                            {
                                                params: postData,
                                                headers: {
                                                    'Content-Type': 'application/json', // Replace with the appropriate content type if needed
                                                    // Add any other required headers here
                                                },
                                            })
                                            .then(response => {
                                                console.log('UpdatedResponse:', response.data);
                                               
                                                //alert(JSON.stringify(response.data));
                                                if (response.data == true) {
                                                    resetForm(); // Reset the form using Formik's resetForm function
                                                    setSelectedCountry('');
                                                    setSelectedState('');
                                                    setSelectedCity('');
                                                    onClose(); // Close the dialog here
                                                } else {
                                                    alert("Invalid Login");
                                                }

                                            })
                                            .catch(error => {
                                                // Handle errors here
                                                console.error('Error:', error);
                                                
                                                //navigate('/error')
                                            });
                                    }
                                    }
                                >
                                    <Form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>


                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="h3" style={{ color: 'blue' }}>Register New Patient</Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <IconButton edge="end" color="inherit" onClick={handleCrossIconClick}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </div>
                                                <Typography variant="h3">Patient Details</Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Select
                                                    style={{ width: '100%' }} name="title"
                                                    label={
                                                        <span>
                                                            Title <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                                                        </span>
                                                    }
                                                    options={patientDropdown.Title} // Provide a fallback option
                                                    getOptionLabel={(option) => option.LookupDescription}
                                                    getOptionValue={(option) => option.LookupID}
                                                />

                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField name="PatientFirstName"
                                                    label={
                                                        <span>
                                                            First Name <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                                                        </span>
                                                    }


                                                />
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField name="PatientMiddleName" label="Middle Name"
                                                />


                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField name="PatientLastName"
                                                    label={
                                                        <span>
                                                            Last Name<span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                                                        </span>
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Select style={{ width: '100%' }}
                                                    getOptionLabel={(option) => option.LookupDescription}
                                                    getOptionValue={(option) => option.LookupID}
                                                    label={
                                                        <span>
                                                            Gender <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                                                        </span>
                                                    }
                                                    name="PatientGender"
                                                    options={patientDropdown.Gender} // Provide a fallback option
                                                />
                                            </Grid>

                                            <Grid item xs={6} md={3}>
                                                <DateTimePicker style={{ width: '100%' }}
                                                    label={
                                                        <span>
                                                            Date of Birth <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                                                        </span>
                                                    }
                                                    name="dob" />
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
                                                    value={selectedCountry || ""}
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
                                                    value={selectedState || ""} // Ensure that selectedState reflects the user's selection
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
                                                    value={selectedCity || ""} // Ensure that selectedState reflects the user's selection
                                                />

                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField name="PermanentPinCode" label="Pin Code" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="h3">Contact Details</Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField name="MobileNumber"
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
                                                <Select name="ReligionId" style={{ width: '100%' }}
                                                    getOptionLabel={(option) => option.LookupDescription}
                                                    getOptionValue={(option) => option.LookupID} label="Religion" options={patientDropdown.Religion} />
                                            </Grid>

                                            <Grid item xs={8}></Grid>
                                            <Grid item xs={2} textAlign={'end'}>
                                                <Button>Submit</Button>
                                            </Grid>
                                            <Grid item xs={2} justifyContent={'end'}>
                                                <button
                                                    style={{
                                                        backgroundColor: "#2196F3",
                                                        color: "#fff",
                                                        fontFamily: "'Roboto',sans-serif",
                                                        fontSize: "0.875rem",
                                                        lineHeight: "1.75",
                                                        minWidth: "64px",
                                                        padding: "6px 16px",
                                                        transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                                                        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                                                        width: "80%",
                                                        fontWeight: "500",
                                                        borderRadius: "4px",
                                                        border: "none",
                                                    }}
                                                    type="button"
                                                    onClick={handleCancelClick}
                                                >
                                                    Cancel
                                                </button>
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
    );
}

export default EditRegistrationDialog;
