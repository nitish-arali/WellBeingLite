import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { urlCreateNewService, urlGetServiceClassificationsForServiceGroup, urlAddNewService, urlGetAllServices } from 'endpoints.ts';
//import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Formik, Form } from 'formik';
//import * as Yup from 'yup';
import { Container } from '@mui/system';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { TableContainer, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
//import { TextField, MenuItem } from '@mui/material';
import Select from 'views/Patient/FormsUI/Select';
import Button from 'views/Patient/FormsUI/Button';
import CustomSelect from 'views/Patient/FormsUI/CustomSelect';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
//import customAxios from 'views/Patient/FormsUI/CustomAxios';
import CheckboxWrapper from 'views/Patient/FormsUI/CheckBox';
 
import * as Yup from 'yup';
import Textarea from 'views/Patient/FormsUI/Textarea/index.js';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

export default function Services() {
  const [patientDropdown, setPatientDropdown] = useState({
    ServiceGroups: [],
    Uoms: [],
    Category: [],
    templateListmodel: [],
    TestResultTypes: [],
    SampleTypes: []
  });

  
 
  const Status = [
    { id: 'true', name: 'Active' },
    { id: 'false', name: 'Hidden' },
   
  ];

  const [selectedValue, setSelectedValue] = useState('');

  const [secondDropdownData, setSecondDropdownData] = useState([]);

  useEffect(() => {
    axios.get(urlCreateNewService).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
    });
  }, []);

  const [serviceDetails, setServiceDetails] = useState([]);


  // State to manage the textarea value
  const [textareaValue, setTextareaValue] = useState('');

  // Handler for textarea change
  const handleTextareaChange = (value) => {
    setTextareaValue(value);
  };
  useEffect(() => {
    axios.get(urlGetAllServices).then((response) => {
      setServiceDetails(response.data.data.Services);
    });
  }, []);

  const loadservices = () => {
    axios.get(urlGetAllServices).then((response) => {
      setServiceDetails(response.data.data.Services);
    });
  };


  const fetchServiceClassificationOptions = async (selectedValue) => {
    try {
      const response = await axios.get(`${urlGetServiceClassificationsForServiceGroup}?ServiceGroupId=${selectedValue}`);
      if (response.status === 200) {
        const classification = response.data.data.ServiceClassifications;
        setSecondDropdownData(classification);
      }
    } catch (error) {
      console.error('Error fetching ServiceClassification options', error);
    }
  };

  const [prevValue, setPrevValue] = useState('');

  const handleFirstDropdownChange = (selectedValue, setFieldValue) => {
    if (selectedValue !== prevValue) {
      setFieldValue('ServiceClassification', '');
    }
    setSelectedValue(selectedValue);
    setPrevValue(selectedValue);
    if (selectedValue !== '') {
      fetchServiceClassificationOptions(selectedValue);
    }
    if (selectedValue == '') {
      setSecondDropdownData([]);
    }
  };

  const secondDropdownChange = () => {
    // if (secondDropdownData == []) {
    //   selectedValue = '';
    // }
  };

  const [initialFormState, setInitialFormState] = useState({
    ServiceGroup: '',
    ServiceClassification: '',
    ServiceCode: '',
    ServiceName: '',
    Uom: '',
    TestCategory: '',
    IsSubtest: false,
    IsRadiology: false,
    IsFromTestValues: false,
    ResultType: '',
    Templates: '',
    SampleType: '',
    // PatientType: '',
    Status: true,
    Price: 0.00,
    Textarea: ''
  });

  const classes = useStyles();
  const FORM_VALIDATION = Yup.object().shape({
    Price: Yup.number().typeError('Price must be a number').required('Price is required'),
    ServiceGroup: Yup.string().required('required'),
    ServiceClassification: Yup.string().required('required'),
    ServiceCode: Yup.string().required('required'),
    ServiceName: Yup.string().required('required'),
    Uom: Yup.string().required('required'),
    Status: Yup.string().required('required'),
  });

  const columns = [

    { field: 'ShortName', headerName: 'ShortName', flex: 1 },
    { field: 'LongName', headerName: 'LongName', flex: 1 },
    { field: 'Price', headerName: 'Price', flex: 1 }
  ];

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <div className={classes.formWrapper}>
              <Formik
                initialValues={{ ...initialFormState }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values, { resetForm }) => {
                  console.log(values);
                  const postData = {
                    ServiceClassificationId: values.ServiceClassification,
                    ShortName: values.ServiceCode,
                    LongName: values.ServiceName,
                    UomId: values.Uom,
                    CategoryId: values.TestCategory,
                    IsSubTest: values.IsSubtest,
                    IsRadiology: values.IsRadiology,
                    SampleTypeId: values.SampleType,
                    Status: values.Status,
                    Price: values.Price,
                    ResultType: values.ResultType,
                    FacilityId: 1,
                    Qty: 1,
                    IsFromTestValues: values.IsFromTestValues,
                    TestValues: textareaValue
                  };

                  axios
                    .post(urlAddNewService, null, {
                      params: postData,
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    })
                    .then((response) => {
                      console.log('Response:', response.data);
                      if (response.data === true) {
                        // debugger;
                        toast.success('Service Added Successful');
                        resetForm();
                        loadservices();
                        setTextareaValue('');
                        setSecondDropdownData([]);
                      } else {
                        alert('Invalid Login');
                      }
                    })
                    .catch((error) => {
                      resetForm();
                      setSecondDropdownData([]);
                      console.error('CustomError:', error);
                    });
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h3">Add Service</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        label={
                          <span>
                            Service Group <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        name="ServiceGroup"
                        options={patientDropdown.ServiceGroups}
                        onChangeCallback={handleFirstDropdownChange}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        getOptionLabel={(option) => option.LongName}
                        getOptionValue={(option) => option.ServiceClassificationId}
                        label={
                          <span>
                            Service Classification <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        name="ServiceClassification"
                        options={secondDropdownData}
                        onChangeCallback={secondDropdownChange}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="ServiceCode" label="ServiceCode" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="ServiceName"
                        label={
                          <span>
                            ServiceName<span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select style={{ width: '100%' }}
                        getOptionLabel={(option) => option.ShortName}
                        getOptionValue={(option) => option.UomId}
                        label={
                          <span>
                            Uom <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                          </span>
                        }
                        name="Uom" options={patientDropdown.Uoms} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select style={{ width: '100%' }} name="TestCategory" label="TestCategory"
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        options={patientDropdown.Category} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CustomSelect
                        name="Status"
                        options={Status}
                        valueProp="id"
                        labelProp="name"
                        label="Status"
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CheckboxWrapper name="IsSubtest" label="IsSubtest?" legend="TestType" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckboxWrapper name="IsRadiology" label="IsRadiology?" legend="Category" />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select style={{ width: '100%' }} name="ResultType"
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        label="ResultType" options={patientDropdown.TestResultTypes} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Select style={{ width: '100%' }} name="SampleType" label="SampleType"
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        options={patientDropdown.SampleTypes} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckboxWrapper name="IsFromTestValues" label="" legend="IsResult From Test Values?" />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="myTextarea">TestValues</label>
                        <Textarea value={textareaValue} onChange={handleTextareaChange} />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Price" label="Price" />
                    </Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={2} textAlign={'end'}>
                      <Button type="submit" style={{ width: '100%' }}>Submit</Button>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </div>
          </Container>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <div >
          <DataGrid
            rows={serviceDetails}
            columns={columns}
            initialState={{
              ...serviceDetails.initialState,
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row.ServiceId} // Specify the custom id property here
            style={{
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0px 2px 6px #aaa',
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },

              },
            }}
          />
        </div>
      </TableContainer>
    </Box>
  );
}
