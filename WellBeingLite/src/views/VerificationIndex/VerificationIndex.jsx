import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import Button from 'views/Patient/FormsUI/Button';
import MuiButton from '@mui/material/Button';
//import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form } from 'formik';
import clsx from 'clsx';
import BackButton from '@mui/icons-material/KeyboardBackspace';

import HeadingComponent from '../../components/HeadingComponent/index';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import {
  urlResultEntryIndex,
  urlGetPatientHeaderWithPatientIAndEncounterId,
  urlLoadTestReferenceForResEntry,
  urlGetSelectedTestDataForResEntered,
  urlSaveTestsResultEntry,
  urlSaveSampleColResult,
  urlLoadTestMethodGridData,
  urlLoadTestReferenceGrid,
  urlGetSelectedTestDataForResEntry
} from 'endpoints.ts';
//import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
import GeneralAutoComplete from 'views/Patient/FormsUI/GeneralAutoComplete';
import PatientHeaderSingle from 'views/Patient/FormsUI/PatientHeaderSingle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import { TableContainer, Paper } from '@mui/material';
//import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as Yup from 'yup';
//import Select from 'views/Patient/FormsUI/Select';
import { makeStyles } from '@mui/styles';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Select, MenuItem } from '@mui/material';
import { Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
//import Select from 'views/Patient/FormsUI/Select';
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import CKEditorComponent from 'views/Patient/FormsUI/CKEditorComponent';
const CustomCheckbox = ({ checked, onChange }) => <input type="checkbox" checked={checked} onChange={onChange} />;
const VerificationIndex = () => {
  const { patientId, encounterId, labnumber } = useParams();
  const [patientdata, setPatientdata] = useState(null);
  const [genderId, setGenderId] = useState([]);
  const [patientAge, setPatientAge] = useState([]);
  const [listTestMethodModel, setListTestMethodModel] = useState([]);
  const [chargeDetails, setChargeDetails] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadTableGrid, setloadTableGrid] = useState([]);
  const [refereneces, setReferences] = useState([]);
  const navigate = useNavigate();
  const [refrangedesc, setRefrangedesc] = useState([]);
  const [referenceRange, setReferenceRange] = useState([]);
  const [methodId, setMethodId] = useState([]);
  const [methodsByTestId, setMethodsByTestId] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editorData, setEditorData] = useState('');
  //const [selectedMethodValues, setSelectedMethodValues] = useState({});
  const [selectedMethodValues, setSelectedMethodValues] = useState({
    // other values...
    default: 'NoMethod' // add this line
  });
  const [initialFormState, setInitialFormState] = useState({
    // TestRefereynce:''
  });
  // const FORM_VALIDATION = Yup.object().shape({

  //     TestReference: Yup.string().required('required'),
  //   });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data.EncounterModel;
          setPatientdata(patientdetail);
          console.log('this' + patientdata);
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
      debugger;
      const response = await customAxios.get(
        `${urlResultEntryIndex}?PatientId=${patientId}&EncounterId=${encounterId}&SelclabId=${labnumber}`
      );
      if (response.status === 200) {
        const testdetails = response.data.data.ListOfSamplColTests;
        const age = response.data.data.PatientAge;
        const gender = response.data.data.GenderId;
        // const testmethods = response.data.data.ListTestMethodModel;

        setChargeDetails(testdetails);
        setPatientAge(age);
        setGenderId(gender);

        //  setListTestMethodModel(testmethods);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleBackButton = () => {
  //   navigate('/');
  // };

  useEffect(() => {
    fetchChargeDetails();
  }, [patientId, encounterId, labnumber]);

  const handleVerificationStatus = async (VerifyStatus) => {
    debugger;
    const intverifystatus = parseInt(VerifyStatus);

    let newBoolVerifyStatus;
    if (intverifystatus === 0) {
      newBoolVerifyStatus = false;
    } else if (intverifystatus === 1) {
      newBoolVerifyStatus = true;
    } else {
      toast.warn('There Is A Problem Verifying A Test.');
      return;
    }

    // setBoolverifyStatus(newBoolVerifyStatus);
    const row = selectedRows[0];

    if (row != null) {
      if (row.IsVerificationDone && intverifystatus === 1) {
        toast.warn('This Test Is Already Verified......');
        return false;
      } else if (!row.IsVerificationDone && intverifystatus === 0) {
        toast.warn('Please Verify the Test To Unverify.');
        return false;
      } else {
        if (row.IsResultEntryDone) {
          row.IsVerificationDone = newBoolVerifyStatus;
        }
      }
      if (row != null) {
        try {
          const response = await customAxios.post(urlSaveVerification, row, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data.data.Status !== '') {
            var message = response.data.data.Status;
            if (message.includes('Data Saved Successfully.')) {
              toast.success(message);
              // resetForm();

              setSelectedRows([]);
              setloadTableGrid([]);

              fetchChargeDetails();
            }
          } else {
            toast.error('Something Went Wrong....');
          }
        } catch (error) {
          alert('errorr');
        }
      }
    } else {
      toast.warn('Please Select Sample.....');
    }
  };

  const handleSelectionChange = (newSelection) => {
    debugger;

    // Check if the new selection is not empty
    if (newSelection.length > 0) {
      const selectedId = newSelection[0];

      // Check if the row is already selected
      const isSelected = selectedRows.some((row) => row.SmpColHeaderId === selectedId);

      // If it is selected, uncheck it; otherwise, uncheck the previously selected row and check the new one
      const newSelectedRows = isSelected ? [] : [{ SmpColHeaderId: selectedId }];

      console.log(
        'Selected IDs:',
        newSelectedRows.map((row) => row.SmpColHeaderId)
      );
      const selectedRowsData = newSelection
        .map((selectedId) => chargeDetails.find((row) => row.SmpColHeaderId === selectedId))
        .filter(Boolean);

      console.log('Selected Rows Data:', selectedRowsData);

      // Update the state with the new selection
      setSelectedRows(newSelectedRows);
      if (isSelected == true) {
        setloadTableGrid([]);
        setSelectedRows([]);
        setSelectedMethodValues([]);
        setRefrangedesc([]);
      } else {
        if (selectedRowsData[0].IsResultEntryDone == true) {
          LoadAlreadyResEnteredTests(selectedRowsData[0].TestId, selectedRowsData[0].ChargeId);
        } else {
          setloadTableGrid([]);
        }
      }
    } else {
      // If newSelection is empty, clear the selected rows
      setSelectedRows([]);
      setloadTableGrid([]);
      setSelectedMethodValues([]);
      setRefrangedesc([]);
    }
  };
  const useStyles = makeStyles((theme) => ({
    formWrapper: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(8)
    }
  }));
  const classes = useStyles();

  const handleTemplateClick = async (testId, ChargeId) => {
    debugger;
    const row = loadTableGrid.find((item) => item.ChargeId === ChargeId);
    const TempID = row.TemplateId;
    setEditorData(row.ObservedValues);
    setDialogOpen(true);
  };

  const CancelTemplate = () => {
    setDialogOpen(false);
    //setSubTestIdToDelete(null);
  };
  const LoadAlreadyResEnteredTests = async (TestId, ChargeId) => {
    debugger;
    try {
      if (TestId > 0 && ChargeId > 0) {
        const GetSelectedTestDataForResEntry = await customAxios.get(
          `${urlGetSelectedTestDataForResEntered}?TestId=${TestId}&ChargeId=${ChargeId}&PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (GetSelectedTestDataForResEntry.data && Array.isArray(GetSelectedTestDataForResEntry.data.data.ResultEntryList)) {
          setloadTableGrid(GetSelectedTestDataForResEntry.data.data.ResultEntryList);
        } else {
          setloadTableGrid([]);
        }
      } else {
        setloadTableGrid([]);
      }
    } catch (error) {
      console.error('Error fetching visits data:', error);
      setloadTableGrid([]);
    }
  };

  const handleEditorChange = (newData) => {
    debugger;
    // Check if CKEditor is not in read-only mode before updating the state
    if (!readOnly) {
      setEditorData(newData); // Update your state with the new data
    }
  };

  const columns = [
    {
      field: 'checkbox',
      headerName: '',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) =>
        params.row.IsSampleCollected && params.row.IsResultEntryDone ? (
          <CustomCheckbox
            checked={selectedRows.some((row) => row.SmpColHeaderId === params.row.SmpColHeaderId)}
            onChange={() => handleSelectionChange([params.row.SmpColHeaderId])}
          />
        ) : null
    },
    {
      field: 'TestName',
      headerClassName: 'super-app-theme--header',
      headerClassName: 'super-app-theme--header',
      headerName: 'Test Name',
      flex: 1
    },
    { field: 'PatientNetAmount', headerName: 'Amount', headerClassName: 'super-app-theme--header', flex: 1 },
    { field: 'LabNumber', headerName: 'Lab Number', headerClassName: 'super-app-theme--header', flex: 1 }
  ];

  const columns1 = [
    { field: 'TestName', headerName: 'Test Name', headerClassName: 'super-app-theme--header', flex: 1 },
    {
      field: 'ObservedValues',
      headerName: 'Observed Value',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => {
        if (params.row.IsTemplateTest) {
          return (
            <a href="#" onClick={() => handleTemplateClick(params.row.TestId, params.row.ChargeId)}>
              Template
            </a>
          );
        } else {
          return (
            <div
              style={{
                backgroundColor: params.row.IsResultNormal === false ? 'red' : 'none',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left'
              }}
            >
              {params.value}
            </div>
          );
        }
      }
    },
    { field: 'Units', headerName: 'Units', headerClassName: 'super-app-theme--header', flex: 1 },
    {
      field: 'MethodName',
      headerName: 'Method',
      flex: 1,
      headerClassName: 'super-app-theme--header'
    },
    {
      field: 'TestRefDescription',
      headerName: 'Normal Ranges',
      headerClassName: 'super-app-theme--header',
      flex: 1
    }
  ];

  const updateLoadTableGrid = (originalLoadTableGrid, refrangedesc, selectedMethodValues) => {
    debugger;
    const updatedLoadTableGrid = originalLoadTableGrid.map((entry) => {
      const refrangedescForTestId = refrangedesc[entry.TestId] || '';
      let methodForTestId = selectedMethodValues[entry.TestId] || '';

      if (methodForTestId === 'NoMethod' || methodForTestId === '') {
        methodForTestId = null;
      }
      return {
        ...entry,
        TestRefDescription: refrangedescForTestId,
        MethodsID: methodForTestId,
        PatientId: patientId,
        EncounterId: encounterId
      };
    });

    return updatedLoadTableGrid;
  };
  const handleSubmit = async (values, { resetForm }) => {
    debugger;
    console.log('data', loadTableGrid);
    if (loadTableGrid.length == 0) {
      toast.warning('Please Select Any One Test.');
    }
    const updatedLoadTableGrid1 = updateLoadTableGrid(loadTableGrid, refrangedesc, selectedMethodValues);
    // Check if any ObservedValues is null or an empty string
    //const hasNullObservedValues = updatedLoadTableGrid1.some(entry => entry.ObservedValues === null || entry.ObservedValues === '');
    const hasNullObservedValues = updatedLoadTableGrid1.some((entry) => {
      // Check if IsProfileTest is false and ObservedValues is null or empty
      return !entry.IsProfileTest && (entry.ObservedValues === null || entry.ObservedValues === '');
    });
    // Show alert if there are null or empty ObservedValues
    if (hasNullObservedValues) {
      //alert('ObservedValues cannot be null or empty.');
      toast.error('ObservedValues cannot be null or empty.');
      return;
    }
    console.log('data', updatedLoadTableGrid1);

    try {
      const response = await customAxios.post(urlSaveTestsResultEntry, updatedLoadTableGrid1, {
        params: {
          PatientAge: patientAge
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.data.Status !== '') {
        var message = response.data.data.Status;
        if (message.includes('Result Entry Saved Successfully.') || message.includes('Result Entry Updated Successfully.')) {
          toast.success(message);
          resetForm();

          setSelectedRows([]);
          setloadTableGrid([]);
          setSelectedMethodValues([]);
          setRefrangedesc([]);
          fetchChargeDetails();
        }
      } else {
        toast.error('Something Went Wrong....');
      }
    } catch (error) {
      alert('errorr');
    }
  };

  const handleButtonClick = (tab) => {
    debugger;
    if (tab == 'SampleCollection') {
      const url = `/SampleCollectionIndex/${patientId}/${encounterId}/${labnumber}`;
      navigate(url);
    } else if (tab == 'ResultEntry') {
      const url = `/ResultentryIndex/${patientId}/${encounterId}/${labnumber}`;
      navigate(url);
    }
  };
  const encounterId1 = 0;
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        padding: '0',
        border: '2px solid #ccc',
        borderRadius: '10px',
        paddingBottom: '10px'
      }}
    >
      <Grid container width={'100%'}>
        <Grid item xs={11}>
          <Typography
            variant="h4"
            sx={{
              backgroundColor: '#1E88E5',
              color: 'white',
              padding: '12px',
              borderTopLeftRadius: '10px',
              fontSize: '20px',
              fontWeight: '400'
            }}
          >
            Verification
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            backgroundColor: '#1E88E5',

            borderTopRightRadius: '10px',
            fontSize: '15px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            paddingRight: '10px'
          }}
        >
          <IconButton sx={{ color: 'white' }}>
            <BackButton
              sx={{ fontSize: '30px' }}
              // onClick={handleBackButton}
            />
          </IconButton>
        </Grid>
        <Grid item xs={12} sx={{ marginRight: '16px' }}>
          <div className={classes.formWrapper}>
            <Formik
              initialValues={{ ...initialFormState }}
              // validationSchema={FORM_VALIDATION}
              onSubmit={handleSubmit}
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
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('SampleCollection')}>
                          Sample Collection
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('ResultEntry')}>
                          Result Entry
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="contained" onClick={() => handleButtonClick('Verification')}>
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
                        // height: 300,
                        width: '100%',
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
                          //checkboxSelection
                          onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                          getRowClassName={(params) => {
                            return params.row.IsResultEntryDone ? 'highlight' : '';
                          }}
                          getRowHeight={() => 35} // Set the desired height here
                          columnHeaderHeight={35}
                          sx={{
                            marginLeft: '4px',
                            marginRight: '4px',
                            marginTop: '10px',
                            '.highlight': {
                              bgcolor: 'green',
                              color: 'white', // Set the font color to white or any other color you prefer
                              fontWeight: 'bold', // Optionally, you can set the font weight
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
                          hideFooterPagination
                          hideFooter
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          disableRowSelectionOnClick
                          slots={{ toolbar: GridToolbar }}
                          getRowId={(row) => row.SmpColHeaderId}
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
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        // height: 300,
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
                            autoHeight
                            rows={loadTableGrid}
                            columns={columns1}
                            hideFooterPagination
                            hideFooter
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            disableRowSelectionOnClick
                            slots={{ toolbar: GridToolbar }}
                            getRowId={(row) => row.TestId} // Specify the custom id property here
                            getRowClassName={(params) => {
                              return params.row.IsProfileTest ? 'highlight' : '';
                            }}
                            getRowHeight={() => 35} // Set the desired height here
                            columnHeaderHeight={35}
                            sx={{
                              marginLeft: '4px',
                              marginRight: '4px',
                              marginTop: '10px',
                              '.highlight': {
                                bgcolor: 'teal',
                                color: 'white', // Set the font color to white or any other color you prefer
                                fontWeight: 'bold', // Optionally, you can set the font weight
                                '&:hover': {
                                  bgcolor: 'teal'
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
                            slotProps={{
                              toolbar: {
                                showQuickFilter: false,
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
                  <Dialog open={dialogOpen} classes={{ paper: classes.dialog }} maxWidth={false}>
                    <DialogTitle variant="h3">Template</DialogTitle>
                    <DialogContent>
                      <Grid item xs={12}>
                        {/* Make CKEditor readonly */}
                        <CKEditorComponent data={editorData} onChange={handleEditorChange} readOnly={true} />
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <MuiButton variant="contained" color="primary" onClick={CancelTemplate}>
                        Cancel
                      </MuiButton>
                    </DialogActions>
                  </Dialog>

                  <Grid container display={'flex'} justifyContent={'end'} marginTop={2} marginRight={4}>
                    <Grid item xs={1}>
                      <MuiButton variant="contained" color="primary" onClick={() => handleVerificationStatus(1)}>
                        Verify
                      </MuiButton>
                    </Grid>
                    <Grid item xs={1}>
                      <MuiButton variant="contained" color="error" onClick={() => handleVerificationStatus(0)}>
                        UnVerify
                      </MuiButton>
                    </Grid>
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

export default VerificationIndex;
