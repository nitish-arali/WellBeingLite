import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, IconButton } from '@mui/material';
import Button from 'views/Patient/FormsUI/Button';
import MuiButton from '@mui/material/Button';
//import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import { urlSampleCollectionIndex, urlGetPatientHeaderWithPatientIAndEncounterId, urlSaveSampleColResult } from 'endpoints.ts';
//import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
import GeneralAutoComplete from 'views/Patient/FormsUI/GeneralAutoComplete';
import PatientHeaderSingle from 'views/Patient/FormsUI/PatientHeaderSingle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import { TableContainer, Paper } from '@mui/material';
//import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as Yup from 'yup';
import Select from 'views/Patient/FormsUI/Select';
import { useNavigate } from 'react-router';
import { makeStyles } from '@mui/styles';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
const CustomCheckbox = ({ checked, onChange }) => <input type="checkbox" checked={checked} onChange={onChange} />;
const SampleCollectionIndex = () => {
  const { patientId, encounterId, labnumber } = useParams();
  const [patientdata, setPatientdata] = useState(null);
  const [chargeDetails, setChargeDetails] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [initialFormState, setInitialFormState] = useState({
    Container1: '',
    Container2: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data.EncounterModel;
          setPatientdata(patientdetail);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [patientId, encounterId]);

  const fetchChargeDetails = async () => {
    try {
      const response = await customAxios.get(
        `${urlSampleCollectionIndex}?PatientId=${patientId}&EncounterId=${encounterId}&SelclabId=${labnumber}`
      );
      if (response.status === 200) {
        const patientdetail = response.data.data.ListOfSamplColTests;
        setChargeDetails(patientdetail);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChargeDetails();
  }, [patientId, encounterId, labnumber]);

  const handleSelectionChange = (SmpColHeaderId) => {
    debugger;
    // Check if the row is already selected
    // Check if the row is already selected
    const isSelected = selectedRows.some((row) => row.SmpColHeaderId === SmpColHeaderId);

    // If it is selected, remove it; otherwise, add it to the selection
    const newSelectedRows = isSelected
      ? selectedRows.filter((row) => row.SmpColHeaderId !== SmpColHeaderId)
      : [...selectedRows, { SmpColHeaderId }];

    // Filter the chargeDetails array to get the full row data for the selected rows
    const selectedRowsData = chargeDetails.filter((row) =>
      newSelectedRows.some((selectedRow) => selectedRow.SmpColHeaderId === row.SmpColHeaderId)
    );

    // Update the state with the new selection
    setSelectedRows(selectedRowsData);

    // Now, selectedRowsData contains the full row data for the selected rows
    console.log('Selected Rows Data:', selectedRowsData);
  };
  const useStyles = makeStyles((theme) => ({
    formWrapper: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(8)
    }
  }));
  const handleSelectAllChange = (checked) => {
    debugger;
    const allRows = chargeDetails.map((row) => ({ ...row })); // Copy all row details
    setSelectedRows(checked ? allRows : []);
  };
  const classes = useStyles();

  const columns = [
    {
      field: 'checkbox',
      headerName: 'Checkbox Header',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => (
        <CustomCheckbox checked={selectedRows.length === chargeDetails.length} onChange={(e) => handleSelectAllChange(e.target.checked)} />
      ),
      flex: 1,
      renderCell: (params) => {
        const { SmpColHeaderId, IsSampleCollected } = params.row;

        // If IsSampleCollected is true, display "Done"; otherwise, display a checkbox
        return IsSampleCollected ? (
          'Done'
        ) : (
          <CustomCheckbox
            checked={selectedRows.some((row) => row.SmpColHeaderId === SmpColHeaderId)}
            onChange={() => handleSelectionChange(SmpColHeaderId)}
          />
        );
      }
    },

    { field: 'TestName', headerName: 'Test Name', headerClassName: 'super-app-theme--header', flex: 1 },
    { field: 'PatientNetAmount', headerName: 'Amount', headerClassName: 'super-app-theme--header', flex: 1 },
    { field: 'LabNumber', headerName: 'Lab Number', headerClassName: 'super-app-theme--header', flex: 1 }
  ];
  const handleButtonClick = (tab) => {
    debugger;
    if (tab == 'ResultEntry') {
      const url = `/ResultentryIndex/${patientId}/${encounterId}/${labnumber}`;
      navigate(url);
    }
  else  if (tab == 'Verification') {
      const url = `/VerificationIndex/${patientId}/${encounterId}/${labnumber}`;
      navigate(url);
    }
  };

  const encounterId1 = 0;
  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <div className={classes.formWrapper}>
              <Formik
                initialValues={{ ...initialFormState }}
                // validationSchema={FORM_VALIDATION}
                onSubmit={async (values, { resetForm }) => {
                  debugger;
                  console.log('Form values:', values);
                  console.log('Selected rows:', selectedRows);

                  const updatedSelectedRowsData = selectedRows
                    .filter((row) => !row.IsSampleCollected) // Filter out rows where IsSampleCollected is true
                    .map((row) => ({
                      ...row,
                      ...values
                    }));
                  // Assuming your API endpoint is something like this
                  if (updatedSelectedRowsData.length == 0) {
                    toast.warning('SampleCollection Is Done For All Tests.. ');
                  } else {
                    const apiUrl = urlSaveSampleColResult;
                    try {
                      // Make an asynchronous Axios POST request to your API
                      const response = await customAxios.post(apiUrl, updatedSelectedRowsData);

                      console.log('API response:', response.data);

                      if (response.data.data.Status !== '') {
                        var message = response.data.data.Status;
                        if (message.includes('Sample Collection Saved Successfully.')) {
                          fetchChargeDetails();
                          toast.success(message);
                        } else {
                          toast.warning(message);
                        }
                      }
                      // Handle success if needed
                    } catch (error) {
                      console.error('API error:', error);
                      // Handle error if needed
                    }
                  }
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h3">SampleCollection</Typography>

                      <Grid container spacing={2}>
                        <Grid item>
                          <MuiButton variant="contained" onClick={() => handleButtonClick('SampleCollection')}>
                            Sample Collection
                          </MuiButton>
                        </Grid>
                        <Grid item>
                          <MuiButton variant="contained" onClick={() => handleButtonClick('ResultEntry')}>
                            Result Entry
                          </MuiButton>
                        </Grid>
                        <Grid item>
                          <MuiButton variant="contained" onClick={() => handleButtonClick('Verification')}>
                            Verification
                          </MuiButton>
                        </Grid>
                        <Grid item>
                          <MuiButton variant="contained" onClick={() => handleButtonClick('Report')}>
                            Report
                          </MuiButton>
                        </Grid>
                      </Grid>

                      <PatientHeaderSingle patientdata={patientdata} encounterId={encounterId1} />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          height: 250,
                          width: '100%',
                          '& .super-app-theme--header': {
                            backgroundColor: 'rgba(0, 123, 255, 0.8)',
                            color: 'white', // Set the font color to white or any other color you prefer
                            fontWeight: 'bold' // Optionally, you can set the font weight
                          }
                        }}
                      >
                        <TableContainer component={Paper}>
                          <div>
                            <DataGrid
                              rows={chargeDetails}
                              columns={columns}
                              pageSize={5}
                              disableColumnFilter
                              getRowClassName={(params) => {
                                return params.row.IsSampleCollected ? 'highlight' : '';
                              }}
                              sx={{
                                '.highlight': {
                                  bgcolor: 'green',
                                  color: 'white', // Set the font color to white or any other color you prefer
                                  fontWeight: 'bold', // Optionally, you can set the font weight
                                  '&:hover': {
                                    bgcolor: 'green'
                                  }
                                }
                              }}
                              disableColumnSelector
                              disableDensitySelector
                              disableRowSelectionOnClick
                              slots={{ toolbar: GridToolbar }}
                              getRowId={(row) => row.SmpColHeaderId}
                              slotProps={{
                                toolbar: {
                                  showQuickFilter: true,
                                  quickFilterProps: { debounceMs: 500 },
                                  printOptions: { disableToolbarButton: true },
                                  csvOptions: { disableToolbarButton: true }
                                }
                              }}
                            />
                          </div>
                        </TableContainer>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Container1" label="Container1" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Container2" label="Container2" />
                    </Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={2} textAlign={'end'}>
                      <Button type="submit" style={{ width: '100%' }}>
                        Submit
                      </Button>
                    </Grid>
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

export default SampleCollectionIndex;
