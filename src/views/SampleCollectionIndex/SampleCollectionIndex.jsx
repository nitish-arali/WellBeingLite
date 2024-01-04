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
import TablePagination from '@mui/material/TablePagination';
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
      marginTop: theme.spacing(2),
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
  };

  const encounterId1 = 0;
  return (
    <Box
      sx={{ width: '100%', backgroundColor: 'white', padding: '0', border: '2px solid #ccc', borderRadius: '10px', paddingBottom: '10px' }}
    >
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ backgroundColor: '#1E88E5', color: 'white', padding: '12px', borderRadius: '10px', fontSize: '20px', fontWeight: '400' }}
          >
            Sample Collection
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginRight: '16px' }}>
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
                <div style={{ border: '2px solid #ccc', padding: '10px', marginLeft: '16px', borderRadius: '5px' }}>
                  <Grid item xs={12} marginX={'5px'} borderRadius={'10px'}>
                    <div>
                      <PatientHeaderSingle patientdata={patientdata} encounterId={encounterId1} />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} marginLeft={'-10px'}>
                      <Grid item>
                        <MuiButton variant="contained" onClick={() => handleButtonClick('SampleCollection')}>
                          Sample Collection
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('ResultEntry')}>
                          Result Entry
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('Verification')}>
                          Verification
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('Report')}>
                          Report
                        </MuiButton>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        // width: '100%',
                        '& .super-app-theme--header': {
                          backgroundColor: 'rgba(0, 123, 255, 0.8)',
                          color: 'white', // Set the font color to white or any other color you prefer
                          fontWeight: 'bold' // Optionally, you can set the font weight
                        }
                      }}
                    >
                      <TableContainer component={Paper}>
                        <DataGrid
                          rows={chargeDetails}
                          columns={columns}
                          disableColumnFilter
                          getRowClassName={(params) => {
                            return params.row.IsSampleCollected ? 'highlight' : '';
                          }}
                          getRowId={(row) => row.SmpColHeaderId}
                          getRowHeight={() => 40} // Set the desired height here
                          columnHeaderHeight={40}
                          sx={{
                            marginLeft: '4px',
                            marginRight: '4px',
                            marginTop: '10px',
                            '.highlight': {
                              bgcolor: 'green',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: 'green'
                              }
                            },
                            '& .MuiDataGrid-cell': {
                              border: '1px solid #ccc',
                              borderBottom: '1px solid #ccc'
                            },
                            '& .MuiDataGrid-columnHeader': {
                              borderLeft: '1px solid #ccc',
                              borderTop: '1px solid #ccc'
                            }
                          }}
                          disableColumnSelector
                          hideFooterPagination
                          hideFooter
                          disableDensitySelector
                          disableRowSelectionOnClick
                          disablePagination
                          slots={{ toolbar: GridToolbar }}
                          slotProps={{
                            toolbar: {
                              showQuickFilter: false,
                              quickFilterProps: { debounceMs: 500 },
                              printOptions: { disableToolbarButton: true },
                              csvOptions: { disableToolbarButton: true }
                            }
                          }}
                        />
                      </TableContainer>
                      {/* <Grid item xs={6}></Grid>
                    <Grid item xs={5}></Grid> */}
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          // padding: '10px',
                          marginLeft: '0px',
                          marginTop: '0px',
                          paddingBottom: '20px',
                          // width: '100%',
                          // border: '1px solid #ccc',
                          // borderRadius: '5px',
                          // marginLeft: '18px',
                          marginRight: '0%'
                        }}
                      >
                        <Grid item xs={2}>
                          <TextField1 name="Container1" label="Container1" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField1 name="Container2" label="Container2" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField1 name="Container3" label="Container3" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField1 name="Container4" label="Container4" />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField1 name="Container5" label="Container5" />
                        </Grid>
                        <Grid item xs={1.8}>
                          <TextField1 name="Container6" label="Container6" />
                        </Grid>
                      </Grid>
                      <Grid container display={'flex'} justifyContent={'end'} marginTop={1}>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                          <MuiButton type="submit" style={{ width: '100%' }} variant="contained" color="primary">
                            Submit
                          </MuiButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </div>
              </Form>
            </Formik>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SampleCollectionIndex;
