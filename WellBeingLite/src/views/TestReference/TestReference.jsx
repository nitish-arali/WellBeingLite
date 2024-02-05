import {
  urlLoadTestReferenceGrid,
  urlSaveTestReference,
  // urlEditTestRef,
  urlTestReferencesIndex,
  urlDeleteTestRef
} from 'endpoints.ts';
import Button from 'views/Patient/FormsUI/Button';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
//import TextField from 'views/Patient/FormsUI/Textfield/index.js';
import TextField from '@mui/material/TextField';
import TextField1 from 'views/Patient/FormsUI/Textfield';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { TableContainer, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Typography, Button as MuiButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomSelect from 'views/Patient/FormsUI/CustomSelect';
//import Select from 'views/Patient/FormsUI/Select';
import ApiDropdown from 'views/Patient/FormsUI/ApiDropdown';
import Textarea from 'views/Patient/FormsUI/Textarea';
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  },
  deleteButton: {
    color: theme.palette.error.main
  }
}));

const FORM_VALIDATION = Yup.object().shape({
  // ... other validations
  // TestId: Yup.object().shape({
  //   ServiceId: Yup.number().required('Test is required')
  // }),
  Gender: Yup.string().required('Gender is required'),
  Duration: Yup.string().required('Duration is required'),
  FromAge: Yup.string().required('From Age is required'),
  ToAge: Yup.string().required('To Age is required'),
  Low: Yup.string().required('Low is required'),
  Operators: Yup.string().required('Operator is required')
});

function TestReference() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [allmethods, setAllmethods] = useState(null);
  const [AllTests, setAllTests] = useState([]);
  const [gender, setGender] = useState([]);
  const [testMethods, setTestmethods] = useState([]);
  const [duration, setDurations] = useState([]);
  const [loadTableGrid, setloadTableGrid] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [referenceIdToDelete, setReferenceIdToDelete] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const classes = useStyles();

  const [isHighFieldDisabled, setIsHighFieldDisabled] = useState(false);

  // useEffect(() => {
  //   // Disable "High" field if the selected operator is not "between"
  //   setIsHighFieldDisabled(selectedOption?.id !== '<>');
  // }, [selectedOption]);

  const [initialFormState, setInitialFormState] = useState({
    Gender: '',
    Duration: '',
    FromAge: '',
    ToAge: '',
    Operators: '',
    Low: '',
    High: ''
  });

  const SorceOperators = [
    { id: '<>', name: 'between (<>)' },
    { id: '<', name: 'less Than (<)' },
    { id: '>', name: 'greater Than (>)' },
    { id: '<=', name: 'less Than or Equal (<=)' },
    { id: '>=', name: 'greater Than or Equal (>=)' },
    { id: '==', name: 'equals to (==)' },
    { id: '!=', name: 'not equals to (!=)' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(`${urlTestReferencesIndex}`);
        if (response.status === 200) {
          // const SourceProfileTests = response.data.data.ProfileTests;
          const SourceSingleTests = response.data.data.SingleTests;
          const SorceGenders = response.data.data.Gender;
          const SorceTestMethods = response.data.data.ListTestMethodModel;
          const SorceDurations = response.data.data.Durations;
          //setOptions(SourceProfileTests);
          setAllTests(SourceSingleTests);
          setAllmethods(SorceTestMethods);
          setDurations(SorceDurations);
          setGender(SorceGenders);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // This will be triggered whenever selectedOption or selectedGender changes
    LoadTestReferenceGrid();
  }, [selectedOption, selectedGender, selectedOption1]);
  // ... (other functions)

  const handleDelete = (TestRefId) => {
    // debugger;
    setReferenceIdToDelete(TestRefId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await customAxios.delete(`${urlDeleteTestRef}?TestId=${selectedOption.ServiceId}&TestRefId=${referenceIdToDelete}`);
      if (response.status === 200 && response.data.data.Status !== '' && response.data.data.Status != null) {
        var message = response.data.data.Status;
        toast.success(message);
        // Reload the data after deletion
        await LoadTestReferenceGrid();
        // Reload the data after deletion
        //   LoadTestReferenceGrid();
      } else {
        toast.error('Failed to delete SubTest.');
      }
    } catch (error) {
      console.error('Error deleting SubTest:', error);
      toast.error('Error deleting SubTest.');
    } finally {
      setDeleteDialogOpen(false);
      setReferenceIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSubTestIdToDelete(null);
  };
  const handleOptionChange = async (
    event,
    newValue
    // { setFieldError }
  ) => {
    setSelectedOption(newValue);

    if (newValue !== null) {
      // Filter allmethods based on the selected TestId
      const filteredMethods = allmethods.filter((method) => method.TestID === newValue.ServiceId);
      // If filteredMethods is empty, clear setSelectedOption1
      if (filteredMethods.length === 0) {
        setSelectedOption1(null);
      }
      setTestmethods(filteredMethods);
      // Reset the error for the "Tests" field
      // Note: You need to use the name you assigned to the "Tests" field in your form
      // setFieldError('TestId', undefined);
    } else {
      setTestmethods([]);
      setSelectedOption1(null);
      setloadTableGrid([]);
    }
  };

  const handleOptionChange1 = (event, newValue) => {
    // debugger;

    setSelectedOption1(newValue);
  };
  const handleGenderChange = (newValue) => {
    // debugger;
    setSelectedGender(newValue);
    // Use the callback function to ensure selectedGender is updated before calling LoadTestReferenceGrid
  };

  const handleOperatorChange = (event) => {
    // Check the selected operator and enable/disable the High field accordingly
    setIsHighFieldDisabled(event.target.dataset.value !== '<>');

    // Set only the Operators field to an empty string in the initialFormState
    setInitialFormState((prevState) => ({
      ...prevState,
      High: ''
    }));
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { Gender, Duration, FromAge, ToAge, Operators, Low, High } = values;
      debugger;
      if (selectedOption == null) {
        // setFieldError('TestId.ServiceId', 'Test is required');
        toast.error('Test required');
        return;
      }
      const params = new URLSearchParams({
        TestId: selectedOption.ServiceId,
        TestMethodId: selectedOption1 ? selectedOption1.TestMethodID : '',
        PeriodsID: Duration,
        FromAge: FromAge,
        ToAge: ToAge,
        Low: Low,
        High: High,
        Description: textareaValue,
        Gender: Gender,
        OperatorType: Operators
      });

      const response = await customAxios.post(`${urlSaveTestReference}?${params}`, null, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.data.Status !== '') {
        var message = response.data.data.Status;
        if (message.includes('TestReference Saved Successfully.')) {
          LoadTestReferenceGrid();
          toast.success(message);
          // Reset only FromAge and ToAge
          resetForm({
            values: {
              ...values,
              FromAge: '',
              ToAge: '',
              Low: '',
              High: '',
              Operators: '',
              Duration: ''
            },
            isSubmitting: false
          });
          setTextareaValue('');
        } else {
          toast.warning(message);
          resetForm();

          setTextareaValue('');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting data.');
    }
  };

  const LoadTestReferenceGrid = async () => {
    // debugger;
    try {
      if (selectedOption?.ServiceId > 0 && selectedGender !== null) {
        const LoadReferenceGrid = await customAxios.get(
          `${urlLoadTestReferenceGrid}?TestId=${selectedOption.ServiceId}&TestMethodId=${
            selectedOption1 ? selectedOption1.TestMethodID : ''
          }&GenderId=${selectedGender}`
        );
        if (LoadReferenceGrid.data && Array.isArray(LoadReferenceGrid.data.data.ListTestReferenceModel)) {
          setloadTableGrid(LoadReferenceGrid.data.data.ListTestReferenceModel);
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

  const handleSelectChange1 = () =>
    // newValue
    {
      // debugger;
    };
  // State to manage the textarea value

  // Handler for textarea change
  const handleTextareaChange = (value) => {
    setTextareaValue(value);
  };
  const columns = [
    { field: 'PeriodName', headerName: 'Duration', flex: 1 },
    { field: 'FromAge', headerName: 'FromAge', flex: 1 },
    { field: 'ToAge', headerName: 'ToAge', flex: 1 },
    { field: 'Low', headerName: 'Low', flex: 1 },
    { field: 'High', headerName: 'High', flex: 1 },
    { field: 'Description', headerName: 'Description', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <IconButton color="secondary" onClick={() => handleDelete(params.row.TestRefId)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '0',
        marginTop: '0',
        borderRadius: '10px',
        border: '1px solid #DBDFEA'
      }}
    >
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ backgroundColor: '#1E88E5', color: 'white', padding: '12px', borderRadius: '10px' }}>
            Test Reference Management
          </Typography>
          <Grid item xs={12}>
            <Container maxWidth="xlg">
              <div className={classes.formWrapper}>
                <Formik
                  initialValues={{ ...initialFormState }}
                  validationSchema={FORM_VALIDATION}
                  onSubmit={handleSubmit}
                  // onChange={handleOperatorChange}
                >
                  <Form>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={1.5}></Grid> */}
                      <Grid item xs={4} md={4}>
                        <Autocomplete
                          value={selectedOption}
                          onChange={handleOptionChange}
                          options={AllTests}
                          getOptionLabel={(option) => option.LongName}
                          renderInput={(params) => <TextField {...params} label="Tests" size="small" variant="outlined" />}
                        />
                      </Grid>
                      <Grid item xs={4} md={4}>
                        <Autocomplete
                          value={selectedOption1}
                          onChange={handleOptionChange1}
                          options={testMethods}
                          getOptionLabel={(option) => option.MethodName}
                          renderInput={(params) => <TextField {...params} label="MethodName" size="small" variant="outlined" />}
                        />
                      </Grid>
                      <Grid item xs={4} md={4}>
                        <ApiDropdown
                          sx={{ width: '100%' }}
                          data={gender}
                          label="Gender"
                          name="Gender"
                          valueProp="LookupID"
                          labelProp="LookupDescription"
                          onSelectChange={handleGenderChange}
                        />
                      </Grid>
                      {/* <Grid item xs={1.5}></Grid> */}

                      <Box
                        sx={{
                          width: '100%',
                          backgroundColor: '#DBDFEA',
                          marginTop: '20px',
                          borderRadius: '10px',
                          boxShadow: '6px 5px 5px -6px rgba(13,0,13,1)'
                        }}
                      >
                        <Grid container padding={'20px'} rowSpacing={3}>
                          <Grid item xs={0.5}></Grid>

                          <Grid item xs={6} md={2}>
                            <ApiDropdown
                              data={duration}
                              label="Duration"
                              name="Duration"
                              valueProp="LookupID"
                              labelProp="LookupDescription"
                              onSelectChange={handleSelectChange1}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={6} md={2}>
                            <TextField1 name="FromAge" label="FromAge" numeric />
                          </Grid>
                          <Grid item xs={1}></Grid>

                          <Grid item xs={6} md={2}>
                            <TextField1 name="ToAge" label="ToAge" numeric />
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={6} md={2}>
                            <CustomSelect
                              name="Operators"
                              options={SorceOperators}
                              valueProp="id"
                              labelProp="name"
                              label="Select Operator"
                              onClick={handleOperatorChange}
                            />
                          </Grid>
                          <Grid item xs={0.5}></Grid>
                          <Grid item xs={0.5}></Grid>

                          <Grid item xs={6} md={2}>
                            <TextField1 name="Low" label="Low" numeric />
                          </Grid>
                          <Grid item xs={1}></Grid>

                          <Grid item xs={6} md={2}>
                            <TextField1 name="High" label="High" numeric disabled={isHighFieldDisabled} />
                          </Grid>
                          <Grid item xs={1}></Grid>

                          <Grid item xs={6} md={2}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Textarea value={textareaValue} onChange={handleTextareaChange} />
                            </div>
                          </Grid>
                          <Grid item xs={1}></Grid>

                          <Grid item xs={2} textAlign={'end'}>
                            <Button type="submit" style={{ width: '100%' }}>
                              Submit
                            </Button>
                          </Grid>
                          <Grid item xs={0.5}></Grid>
                        </Grid>
                      </Box>
                      <Grid item xs={10}></Grid>

                      <Grid item xs={12}>
                        <TableContainer component={Paper} style={{ borderRadius: '0px' }}>
                          <DataGrid
                            rows={loadTableGrid}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25]}
                            style={{
                              borderRadius: '0px'
                            }}
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            disableRowSelectionOnClick
                            slots={{ toolbar: GridToolbar }}
                            getRowId={(row) => row.TestRefId} // Specify the custom id property here
                            getRowClassName={() => 'custom-row'}
                            slotProps={{
                              toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                                printOptions: { disableToolbarButton: true },
                                csvOptions: { disableToolbarButton: true }
                              },
                              sx: {}
                            }}
                            sx={{
                              '& .custom-row .MuiDataGrid-cell': {
                                borderLeft: '1px solid #ddd'
                              },
                              '& .custom-row:last-child .MuiDataGrid-cell': {
                                borderLeft: '1px solid #ddd'
                              },
                              '& .MuiDataGrid-columnHeader': {
                                borderLeft: '1px solid #ddd',
                                borderTop: '1px solid #ddd'
                              }
                            }}
                          />
                        </TableContainer>
                      </Grid>
                      <Dialog open={isDeleteDialogOpen}>
                        <DialogTitle variant="h3">Confirm Delete</DialogTitle>
                        <DialogContent>Are you sure you want to delete this SubTest?</DialogContent>
                        <DialogActions>
                          <MuiButton onClick={cancelDelete}>Cancel</MuiButton>
                          <MuiButton onClick={confirmDelete} className={classes.deleteButton}>
                            Delete
                          </MuiButton>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  </Form>
                </Formik>
              </div>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TestReference;
