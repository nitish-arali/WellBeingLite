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
import { urlGetAllPatients, urlGetPatientDetail } from '../../endpoints.ts';
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
import { useNavigate } from 'react-router';
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

export default function Patient() {
  const [patientDetails, setPatientDetails] = useState([]);
  const [patientsearchDetails, setPatientSearchDetails] = useState([]);

  const [encounterId] = useState(null);
  const navigate = useNavigate();

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

  const [selectedUhId, setSelectedUhId] = useState(null);

  const loadPatients = () => {
    customAxios.get(urlGetAllPatients).then((response) => {
      setPatientDetails(response.data.data.Patients);
    });
  };

  const navigateToNewPatient = () => {
    const url = `/NewPatient`;
    // Navigate to the new URL
    navigate(url);
  };

  const navigateToNewVisit = () => {
    const url = `/NewVisit`;
    // Navigate to the new URL
    navigate(url);
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
                    <MuiButton variant="contained" startIcon={<PersonAdd />} onClick={navigateToNewPatient}>
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
                    <MuiButton variant="contained" startIcon={<PersonVisit />} onClick={navigateToNewVisit}>
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
    </>
  );
}
