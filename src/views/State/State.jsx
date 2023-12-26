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
import { urlSampleCollectionIndex, urlGetPatientHeaderWithPatientIAndEncounterId } from 'endpoints.ts';
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
//import { useFormikContext } from 'formik';





// ... (imports and other code)

const SampleCollectionIndex = () => {
    const { patientId, encounterId, labnumber } = useParams();
    const [patientdata, setPatientdata] = useState(null);
    const [chargeDetails, setChargeDetails] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [initialFormState, setInitialFormState] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await customAxios.get(`${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`);
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
            const response = await customAxios.get(`${urlSampleCollectionIndex}?PatientId=${patientId}&EncounterId=${encounterId}&SelclabId=${labnumber}`);
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

    const handleSubmit = async (values) => {
        // Handle form submission
    };

    const columns = [
        { field: 'checkbox', headerName: 'Sel',  flex: 1 },
        { field: 'TestName', headerName: 'Test Name', flex: 1 },
        { field: 'PatientNetAmount', headerName: 'Amount', flex: 1 },
        { field: 'LabNumber', headerName: 'Lab Number', flex: 1 }
    ];

    const handleSelectionChange = (newSelection) => {
        debugger;
        console.log('Selected rows:', newSelection);
        setSelectedRows(newSelection);
    };

    return (
        <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
            <Grid container width={'100%'}>
                <Grid item xs={12}>
                    <Container maxWidth="xlg">
                        <Typography variant="h5" gutterBottom>
                            Billing
                        </Typography>
                        <PatientHeaderSingle patientdata={patientdata} encounterId={encounterId} />

                        {/* Move DataGrid outside of Formik */}
                        <TableContainer component={Paper}>
                            <div>
                                <DataGrid
                                    rows={chargeDetails}
                                    columns={columns}
                                    checkboxSelection
                                    
                                    onSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                                    initialState={{
                                        ...chargeDetails.initialState,
                                        pagination: { paginationModel: { pageSize: 5 } },
                                    }}
                                    pageSizeOptions={[5, 10, 25]}
                                    disableColumnFilter
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableRowSelectionOnClick
                                    slots={{ toolbar: GridToolbar }}
                                    getRowId={(row) => row.SmpColHeaderId}
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

                        <Formik
                            initialValues={{ ...initialFormState }}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                {/* Other form elements */}
                            </Form>
                        </Formik>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SampleCollectionIndex;

