// CreateVisitDialog.jsx
//import React from 'react';
import { Dialog, DialogContent, Typography, Grid } from '@mui/material';
import Button from '../Button/index.js';
import Select from '../Select/index.js';
import CloseIcon from '@mui/icons-material/Cancel';
import { Formik, Form } from 'formik';
import { Container } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  urlGetVisitDetailsWithPHeader,
  urlGetDepartmentBasedOnPatitentType,
  urlGetServiceLocationBasedonId,
  urlGetProviderBasedOnDepartment,
  urlAddNewVisit
} from 'endpoints.ts';
import { useRef } from 'react';
import customAxios from '../CustomAxios/index.js';
import * as Yup from 'yup';
import PatientHeaderSingle from '../PatientHeaderSingle/index.js';

const FORM_VALIDATION1 = Yup.object().shape({
  PatientType: Yup.string().required('required'),
  Department: Yup.string().required('required'),
  Provider: Yup.string().required('required'),
  ServiceLocation: Yup.string().required('required')
});

function CreateVisitDialog({ isOpen, onClose, selectedRow }) {
  const [initialFormState, setInitialFormState] = useState({
    PatientType: '',
    Department: '',
    Provider: '',
    ServiceLocation: ''
  });

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      // Only close the dialog when clicking outside the content area
      formikRef1.current.resetForm();
      onClose();
      //setInitialFormState([]);
      setSelectedPatientType('');
      setSelectedDepartment('');
      setSelectedProvider('');
      setSelectedServiceLocation('');
    }
  };

  const handleCancelClick = () => {
    formikRef1.current.resetForm();
    //setInitialFormState([]);
    // Handle your "Cancel" button click logic here
    // Close the dialog or perform other actions
    onClose();
    setSelectedPatientType('');
    setSelectedDepartment('');
    setSelectedProvider('');
    setSelectedServiceLocation('');
  };

  const handleCrossIconClick = () => {
    // setInitialFormState([]);
    formikRef1.current.resetForm();
    // Handle the cross IconButton click logic here
    // Close the dialog or perform other actions
    onClose();
    setSelectedPatientType('');
    setSelectedDepartment('');
    setSelectedProvider('');
    setSelectedServiceLocation('');
  };
  const fetchPatientDetails = async (patientId) => {
    try {
      // Make an API call to fetch patient details using patientId
      const response = await customAxios.get(`${urlGetVisitDetailsWithPHeader}?PatientId=${patientId}`);
      if (response.status === 200) {
        const pttype = response.data.data.PatientType;

        // Assuming your API response structure matches the provided data
        setPatientTypes(pttype);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };
  useEffect(() => {
    if (selectedRow != null) {
      fetchPatientDetails(selectedRow.PatientId);
    }
  }, [selectedRow]);

  const [patientTypes, setPatientTypes] = useState([]);
  const [selectedPatientType, setSelectedPatientType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedServiceLocation, setSelectedServiceLocation] = useState('');
  const [encounterId, setEncounterId] = useState(null);
  const formikRef1 = useRef(null);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);

  /* const handleSubmit = (values) => {
    // Set the form submission state to true
    setIsFormSubmitted(true);
  }; */

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
      const response = await customAxios.get(`${urlGetDepartmentBasedOnPatitentType}?PatientType=${selectedPatientType}`);
      if (response.status === 200) {
        const dept = response.data.data.Department;
        setDepartments(dept);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
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

  // Handle form field changes and submit here

  // const handleClearForm1 = (event) => {
  //   if (event) {
  //     event.preventDefault();
  //   }
  //   // setSelectedUhId(null); // Reset the selected value to null
  //   //setInputUhidValue(''); // Reset the input value
  //   //setSelectedUhId('');
  //   // setSelectedOption(null); // Clear the selected option
  //   // Add any other logic to clear other form fields if needed
  //   // loadPatients();
  //   formikRef1.current.resetForm();
  // };
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxWidth: '800px',
          height: '500px' // Set your desired custom max-width here
        }
      }}
    >
      <DialogContent>
        <Grid container width={'100%'}>
          <Grid item xs={12}>
            <Container maxWidth="xlg">
              <Formik
                initialValues={{ ...initialFormState }}
                validationSchema={FORM_VALIDATION1}
                onSubmit={(values, { resetForm }) => {
                  //setLoading(true);
                  setIsSaveButtonDisabled(true);
                  console.log(values);

                  //  setLoading(true);
                  console.log(values);
                  //  const formattedDate = formatDate(values.dob);
                  const postData = {
                    PatientId: selectedRow.PatientId,
                    PatientType: values.PatientType,
                    FacilityDepartmentId: values.Department,
                    FacilityDepartmentServiceLocationId: values.ServiceLocation,
                    ProviderId: values.Provider
                  };

                  customAxios
                    .post(urlAddNewVisit, null, {
                      params: postData,
                      headers: {
                        'Content-Type': 'application/json' // Replace with the appropriate content type if needed
                        // Add any other required headers here
                      }
                    })
                    .then((response) => {
                      // Handle the response data here

                      console.log('Response:', response.data);
                      // setLoading(false);
                      //alert(JSON.stringify(response.data));
                      if (response.data != null) {
                        const genen = response.data.data.EncounterModel.GeneratedEncounterId;
                        setEncounterId(genen);
                        toast.success('Patient visit created Successfully');
                      } else {
                        alert('Invalid Login');
                      }
                    })
                    .catch((error) => {
                      // Handle errors here
                      console.error('Error:', error);
                      toast.error(' Something went wrong! ');

                      //navigate('/error')
                    });
                  resetForm();
                }}
                innerRef={formikRef1}
              >
                {() => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <IconButton edge="end" color="inherit" onClick={handleCrossIconClick}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                        <Typography variant="h5" gutterBottom>
                          Create Visit
                        </Typography>
                        <PatientHeaderSingle patientdata={selectedRow} encounterId={encounterId} />
                      </Grid>

                      <Grid item xs={6} md={6}>
                        <Select
                          label={
                            <span>
                              Patient Type <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                            </span>
                          }
                          options={patientTypes}
                          name="PatientType"
                          getOptionLabel={(option) => option.LookupDescription}
                          getOptionValue={(option) => option.LookupID}
                          onChangeCallback={setSelectedPatientType}
                          value={selectedPatientType}
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
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
                      <Grid item xs={6} md={6}>
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
                      <Grid item xs={6} md={6}>
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

                      {/* Repeat the above Field block for other form fields */}
                      <Grid item xs={8}></Grid>

                      <Grid item xs={2} justifyContent={'end'}>
                        <Button style={{ width: '80%' }} isDisabled={isSaveButtonDisabled} type="submit">
                          Save
                        </Button>
                      </Grid>

                      <Grid item xs={2} justifyContent={'end'}>
                        <button
                          style={{
                            backgroundColor: '#2196F3',
                            color: '#fff',
                            fontFamily: "'Roboto',sans-serif",
                            fontSize: '0.875rem',
                            lineHeight: '1.75',
                            minWidth: '64px',
                            padding: '6px 16px',
                            transition:
                              'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                            boxShadow:
                              '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                            width: '80%',
                            fontWeight: '500',
                            borderRadius: '4px',
                            border: 'none'
                          }}
                          type="button"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </Grid>
                      {/* <Button onClick={handleAddPatientClick} >Add Patient</Button> */}
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Container>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default CreateVisitDialog;
