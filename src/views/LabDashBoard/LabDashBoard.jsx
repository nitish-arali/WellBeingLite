import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
import { urlSearchUHID, urlSearchPatientsForLab } from 'endpoints.ts';
import { Grid, Typography, Select, MenuItem, TextField } from '@mui/material';

import { Grid, Typography, Select, MenuItem,TextField } from '@mui/material';

import Button from 'views/Patient/FormsUI/Button';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MuiButton from '@mui/material/Button';
import DateTimePicker from 'views/Patient/FormsUI/DateTimePicker';
import Pagination from '@mui/material/Pagination';
import LabPatientHeader from 'views/Patient/FormsUI/LabPatientHeader';
import Stack from '@mui/material/Stack';
import { TableContainer, Paper } from '@mui/material';
import calendarIcon from '../../assets/images/icons/calendar_icon.png';
import useLoader from '../../hooks/useLoader';
import AllDone from '@mui/icons-material/CheckCircleTwoTone';
import PartiallyDone from '@mui/icons-material/ControlPointTwoTone';
import NotDone from '@mui/icons-material/RemoveCircleTwoTone';

//import CKEditorComponent from 'views/Patient/FormsUI/CKEditorComponent/index.js';
//import Select from 'views/Patient/FormsUI/Select';
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

function LabDashboard() {
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState('');
  const [patientDetails, setPatientDetails] = useState([]);
  const [initialFormState, setInitialFormState] = useState({
    Name: '',
    Uhid: '',
    MobileNumber: '',
    LabNumber: '',
    FromDate: '',
    ToDate: ''
  });

  const classes = useStyles();
  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
  };

  useEffect(() => {
    // This code will run when the component mounts

    // Call handleSubmit with the initial form state values
    handleSubmit(initialFormState);
  }, []); // Empty dependency array ensures that useEffect runs only when the component m
  // ... (other JSX and return statement)

  const handleAutocompleteChange = (newValue) => {
    setSelectedUhId(newValue);
  };
  const fetchOptionsCallback = async (inputValue) => {
    try {
      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${inputValue}`);
      if (response.data && Array.isArray(response.data.data)) {
        setOptions(response.data.data);
        // Update the state with the received data for PatientName
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOptions([]);
    }
  };


  const handleClearForm = (formik) => {
    setSelectedUhId(null);
    formik.resetForm({ values: { ...initialFormState } });
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
  const filteredPatients = patientDetails.filter((patient) => patient.PatientFullName.toLowerCase().includes(searchTerm.toLowerCase()));
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
  const { loaderLoading, startLoading, stopLoading } = useLoader();

  const getOptionLabel = (option) => option.UhId;

  const isOptionEqualToValue = (option, value) => option.UhId === value.UhId;

  const handleSubmit = (values) => {
    debugger;

    const uhid = selectedUhId ? selectedUhId.UhId : '';

    // Function to format date to "dd-MM-yyyy"
    const formatDateString = (date) => {
        if (!date) return '""';
        let d = new Date(date);
        return ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + d.getFullYear();
    }

    try {
      const postData1 = {
        Uhid: uhid === '' ? '""' : uhid,
        PatientName: values.Name === '' ? '""' : values.Name,
        MobileNumber: values.MobileNumber === '' ? '""' : values.MobileNumber,
        LabNumber: values.LabNumber === '' ? '""' : values.LabNumber,
        Fromdate: formatDateString(values.FromDate),
        Todate: formatDateString(values.ToDate),
      };

      customAxios
        .get(
          `${urlSearchPatientsForLab}?uhid=${postData1.Uhid}&PName=${postData1.PatientName}&PMobNum=${postData1.MobileNumber}&LabNumber=${postData1.LabNumber}&fromdate=${postData1.Fromdate}&Todate=${postData1.Todate}`,
          null,
          {
            params: postData1,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log('Response:', response.data);
          setPatientDetails(response.data.data.LabPatientsList);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box
      sx={{ width: '100%', backgroundColor: 'white', padding: '0', border: '2px solid #ccc', borderRadius: '10px', paddingBottom: '10px' }}
    >
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ backgroundColor: '#1E88E5', color: 'white', padding: '12px', borderRadius: '10px' }}>
            LabDashBoard
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <div className={classes.formWrapper}>
              <Formik initialValues={{ ...initialFormState }} onSubmit={handleSubmit}
              >
                {(formik) => (

                  <Form style={{ marginBottom: '-40px' }}>
                    <Grid container spacing={2} style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '10px' }}>
                      <Grid item xs={3}>
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
                      <Grid item xs={3}>
                        <TextField1 name="Name" label="Name" />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField1 name="MobileNumber" label="Mobile Number" />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField1 name="LabNumber" label="LabNumber" />
                      </Grid>
                      <Grid item xs={3}>
                        <DateTimePicker style={{ width: '100%' }} name="FromDate" label="FromDate" />
                      </Grid>
                      <Grid item xs={3}>
                        <DateTimePicker style={{ width: '100%' }} name="ToDate" label="ToDate" />
                      </Grid>
                      <Grid item xs={1} textAlign={'end'}>
                        <Button type="submit" style={{ width: '100%' }}>
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={1} textAlign={'end'}>
                      <MuiButton variant="contained"  color="primary" onClick={() => handleClearForm(formik)}>
                        Clear
                      </MuiButton>
                      </Grid>
                      
                     
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1.2} style={{ marginTop: '20px' }}>
                        <div>Partially Done</div>
                        <div style={{ marginTop: '10px' }}>Not Done</div>
                        <div style={{ marginTop: '10px' }}>All Done</div>
                      </Grid>
                      <Grid
                        item
                        xs={0.8}
                        style={{ marginTop: '20px', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                      >
                        <div>
                          <PartiallyDone style={{ color: '#FF6C22' }} />
                        </div>
                        <div>
                          <NotDone style={{ color: '#994D1C' }} />
                        </div>
                        <div>
                          <AllDone style={{ color: '#008000' }} />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid item xs={2}></Grid>
                    <Grid item xs={1.2} style={{ marginTop: '20px' }}>
                      <div>Partially Done</div>
                      <div style={{ marginTop: '10px' }}>Not Done</div>
                      <div style={{ marginTop: '10px' }}>All Done</div>
                    </Grid>

                    <Grid
                      item
                      xs={0.8}
                      style={{ marginTop: '20px', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                    >
                      <div>
                        <PartiallyDone style={{ color: '#FF6C22' }} />
                      </div>
                      <div>
                        <NotDone style={{ color: '#994D1C' }} />
                      </div>
                      <div>
                        <AllDone style={{ color: '#008000' }} />
                      </div>
                    </Grid>
                  </Grid>
                </Form>

                  </Form>
                )}

              </Formik>
            </div>
          </Container>

          <TableContainer component={Paper}>
            <Box
              width={'100%'}
              height={'50px'}
              // border={2}
              // borderColor="#efebe9"
              backgroundColor="#d1c4e9"
              // borderRadius={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Grid container width={'100%'} justifyContent="space-between" alignItems="start">
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Grid container justifyContent="center" alignItems="center">
                      <img src={calendarIcon} alt="Patient count" height="30px" />
                      <div
                        style={{
                          height: '25px',
                          width: '25px',
                          color: 'black',
                          backgroundColor: '#fff',
                          fontSize: '17px',
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
                    <LabPatientHeader key={index} patientdata={patient} />
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
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LabDashboard;
