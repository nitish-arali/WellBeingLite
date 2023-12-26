import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, IconButton } from '@mui/material';
//import Button from 'views/Patient/FormsUI/Button';
import MuiButton from '@mui/material/Button';
//import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import {
  urlGetPatientHeaderWithPatientIAndEncounterId,
  urlServiceAutocomplete,
  urlAddNewCharge,
  urlAddNewBill,
  urlGetPatientAccountChargesWithPatientIdAndEncounterId
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
import Select from 'views/Patient/FormsUI/Select';
import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
//import { useFormikContext } from 'formik';

const FORM_VALIDATION = Yup.object().shape({
  PaymentTypeId: Yup.string().required('Service is required'),
  Amount: Yup.number().required('Price is required').positive('Price must be a positive number')
});

const Master = () => {
  const { patientId, encounterId } = useParams();
  const [patientdata, setPatientdata] = useState(null);
  const [chargeDetails, setChargeDetails] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the URL with parameters
        const response = await customAxios.get(
          `${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data.EncounterModel;
          setPatientdata(patientdetail);
          console.log(patientdetail);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the asynchronous function
    fetchData();
  }, [patientId, encounterId]);
  const fetchChargeDetails = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientAccountChargesWithPatientIdAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
      );
      if (response.status === 200) {
        const patientdetail = response.data.data.PatientAccountChargeModel;
        const paymenttype = response.data.data.PaymentType;
        setChargeDetails(patientdetail);
        setPaymentDetails(paymenttype);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Initial data fetch
    fetchChargeDetails();
  }, [patientId, encounterId]);

  const [resetInput, setResetInput] = useState(false);
  const [clearSelectedValue, setClearSelectedValue] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceSelect = (selectedService, setFieldValue) => {
    console.log('Selected service:', selectedService);
    const Priceup = selectedService?.Price || '';
    const ServiceId = selectedService?.ServiceId || '';
    setFieldValue('Price', Priceup);
    setFieldValue('Service', ServiceId);
  };

  const handleSubmit = async (values, { resetForm }) => {
    debugger;
    console.log('hi');
    try {
      const { Service, Price, Date } = values;
      const { PatientType } = patientdata || {};
      if (Service === '' || Price === '') {
        // Show toaster message for required fields
        toast.error('Service and Price are required');
        return; // Stop the submission process
      }
      const params = new URLSearchParams({
        ServiceId: Service,
        Amount: Price,
        PatientId: patientId,
        EncounterId: encounterId,
        FacilityId: 1,
        ActiveFlag: true,
        ServiceQuantity: 1
      });
      const response = await customAxios.post(`${urlAddNewCharge}?${params}`, null, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.data.Status === 'true') {
        fetchChargeDetails();
        toast.success('Charge Added Successful');
        resetForm({
          values: {
            ...values,
            Service: '', // Reset Service field
            Price: '' // Reset Price field
          }
        });
        setResetInput(true);
        setClearSelectedValue(true);
      } else {
        toast.error('Something Went Wrong');
      }
    } catch (error) {
      resetForm();
      console.error('Error:', error);
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const updateDateAtMidnight = () => {
      setCurrentDate(new Date().toISOString().split('T')[0]);
    };
    const intervalId = setInterval(updateDateAtMidnight, 1000 * 60 * 60 * 24); // 24 hours in milliseconds
    updateDateAtMidnight();
    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    { field: 'ServiceName', headerName: 'ServiceName', flex: 1 },
    {
      field: 'ServiceDate',
      headerName: 'ServiceDate',
      flex: 1,
      valueGetter: (params) => {
        const dateString = params.row.ServiceDate;
        try {
          const dateObject = new Date(dateString);
          const year = dateObject.getFullYear();
          const month = String(dateObject.getMonth() + 1).padStart(2, '0');
          const day = String(dateObject.getDate()).padStart(2, '0');
          const formattedDate = `${day}-${month}-${year}`;
          return formattedDate;
        } catch (error) {
          console.error('Invalid date format:', dateString);
          return 'Invalid Date';
        }
      }
    },
    { field: 'Amount', headerName: 'Amount', flex: 1 }
  ];

  const totalAmount = chargeDetails.reduce((total, row) => total + row.Amount, 0);

  const handleSubmit1 = async (values, chargeDetails, { resetForm }) => {
    debugger;
    try {
      const data = {
        PatientAccountReceiptModel: {
          ReceiptAmount: values.Amount,
          PatientId: patientId,
          EncounterId: encounterId,
          FacilityId: 1,
          ActiveFlag: true
        },
        PatientAccountReceiptInstrumentModel: {
          PaymentTypeId: values.PaymentTypeId,
          InstrumentAmount: values.Amount
        },
        PatientAccountChargeModel: chargeDetails // Assuming chargeDetails is an array of charge details
      };

      const response = await customAxios.post(urlAddNewBill, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.data.Status === 'true') {
        fetchChargeDetails();

        toast.success('Billed');
        resetForm(); // Reset the second form
      } else {
        toast.error('Something Went Wrong');
      }
      // ... rest of your logic
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  const fetchOptionsCallback = async (inputValue) => {
    try {
      const response = await customAxios.get(`${urlServiceAutocomplete}?Description=${inputValue}`);
      if (response.status === 200) {
        const patientdetail = response.data.data;
        setOptions(patientdetail);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getOptionLabel = (option) => option.LongName;

  const isOptionEqualToValue = (option, value) => option.LongName === value.LongName;

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <Formik
              initialValues={{ Service: '', Price: '', Date: currentDate }}
              // validationSchema={FORM_VALIDATION}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h5" gutterBottom>
                        Billing
                      </Typography>
                      <PatientHeaderSingle patientdata={patientdata} encounterId={encounterId} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      {/* <GeneralAutoComplete
                        apiUrl={urlServiceAutocomplete}
                        label="Service"
                        name="Service"
                        onServiceSelect={(selectedService) => handleServiceSelect(selectedService, formik.setFieldValue)}
                        clearInputValue={formik.submitCount > 0} // Clear input value on each submission
                        clearSelectedValue={clearSelectedValue}
                      /> */}
                      <CustomAutocomplete
                        id="service-autocomplete"
                        label="Service"
                        options={options}
                        name="Service"
                        value={selectedService}
                        onInputChange={(newInputValue) => {
                          if (newInputValue.trim() !== '') {
                            fetchOptionsCallback(newInputValue);
                          }
                        }}
                        onChange={(newValue) => {
                          setSelectedService(newValue);
                          handleServiceSelect(newValue, formik.setFieldValue); // Replace with your handleServiceSelect function
                        }}
                        fetchOptionsCallback={fetchOptionsCallback}
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Date" label="Date" type="date" value={currentDate} InputLabelProps={{ shrink: true }} disabled />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Price" label="Price" value={formik.values.Price} disabled />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <IconButton type="submit">
                        <AddCircleIcon style={{ color: 'green', fontSize: '2rem' }} />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <div>
                          <DataGrid
                            rows={chargeDetails}
                            columns={columns}
                            initialState={{
                              ...chargeDetails.initialState,
                              pagination: { paginationModel: { pageSize: 5 } }
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            disableRowSelectionOnClick
                            slots={{ toolbar: GridToolbar }}
                            getRowId={(row) => row.ChargeID} // Specify the custom id property here
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '5px',
                              boxShadow: '0px 2px 6px #aaa'
                            }}
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
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1
                        name="Date"
                        label="ReceiptDate"
                        type="date"
                        value={currentDate}
                        InputLabelProps={{ shrink: true }}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Date" label="ReceiptAmount" value={totalAmount} disabled />
                    </Grid>

                    <Grid item xs={10}></Grid>
                    <Grid item xs={2} textAlign={'end'}>
                      <Typography variant="body1" fontWeight="bold">
                        Receipt Amount: {totalAmount}
                      </Typography>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
            <Formik
              initialValues={{ PaymentTypeId: '', Amount: '' }}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values, { resetForm }) => handleSubmit1(values, chargeDetails, { resetForm })}
            >
              {(formik) => (
                <Form>
                  <Grid container spacing={2}>
                    {/* Add your form fields for the second section here */}
                    <Grid item xs={6} md={3}>
                      <Select
                        style={{ width: '100%' }}
                        name="PaymentTypeId"
                        label="PaymentType"
                        getOptionLabel={(option) => option.LookupDescription}
                        getOptionValue={(option) => option.LookupID}
                        options={paymentDetails}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="Amount" label="Amount" />
                    </Grid>
                    <Grid item xs={2} justifyContent={'end'}>
                      <MuiButton variant="contained" fullWidth color="primary" type="submit">
                        SaveBill
                      </MuiButton>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Master;
