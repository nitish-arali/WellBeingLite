
import { urlLoadTestForMapping, urlLoadTestMethodGridData,urlDeleteTestMethod,urlSaveTestMethod} from 'endpoints.ts';
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
import {Grid,Typography,Button as MuiButton,Dialog,DialogTitle,DialogContent,DialogActions,} from '@mui/material';
import { makeStyles } from '@mui/styles';
//import Select from 'views/Patient/FormsUI/Select';
const useStyles = makeStyles((theme) => ({
    formWrapper: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(8)
    },
    deleteButton: {
        color: theme.palette.error.main,
    },
}));
const FORM_VALIDATION = Yup.object().shape({
    MethodName: Yup.string().required('required'),
    Unit: Yup.string().required('required'),

});

function TestMethod() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [AllTests, setAllTests] = useState([]);
    const [TestMethodMapData, setTestMethodMapData] = useState([]);
    const classes = useStyles();
    // ... (other state variables)

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testMethodIdToDelete, setTestMethodIdToDelete] = useState(null);

    // ... (other functions)

    const handleDelete = (testmethodId) => {
      setTestMethodIdToDelete(testmethodId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await customAxios.delete(
                `${urlDeleteTestMethod}?testmethodId=${testMethodIdToDelete}`
            );
            if (response.status === 200 && response.data.data.Status !== '' && response.data.data.Status != null) {
                var message = response.data.data.Status;
                toast.success(message);
                // Reload the data after deletion
                LoadTestMethodGrid(selectedOption.ServiceId);
            } else {
                toast.error('Failed to delete SubTest.');
            }
        } catch (error) {
            console.error('Error deleting SubTest:', error);
            toast.error('Error deleting SubTest.');
        } finally {
            setDeleteDialogOpen(false);
            setTestMethodIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setTestMethodIdToDelete(null);
    };

    const handleOptionChange = (event, newValue) => {
        debugger;
        setSelectedOption(newValue);
        if (newValue != null) {
          LoadTestMethodGrid(newValue.ServiceId);
        }
        else {
          setTestMethodMapData([]);
        }
    };
 
    const [initialFormState, setInitialFormState] = useState({
        MethodName: '',
        Unit:''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await customAxios.get(`${urlLoadTestForMapping}`);
                if (response.status === 200) {
                   // const SourceProfileTests = response.data.data.ProfileTests;
                    const SourceAllTests = response.data.data.AllDiagnosticTests;
                    //setOptions(SourceProfileTests);
                    setAllTests(SourceAllTests);
                } else {
                    console.error('Failed to fetch patient details');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        debugger;
        try {
            const { MethodName,Unit } = values;
            if (selectedOption == null ) {
                toast.error('Test required');
                return;
            }
            const params = new URLSearchParams({
              TestID: selectedOption.ServiceId,
              MethodName: MethodName,
              Unit:Unit
            });
            const response = await customAxios.post(`${urlSaveTestMethod}?${params}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.data.Status !== '') {
              var message = response.data.data.Status;
              if(message.includes("Data Saved Succesfully."))
              {
                toast.success(message);
                LoadTestMethodGrid(selectedOption.ServiceId);
                  //  setSelectedOption1(null);
                    resetForm();
              }
              else if(message.includes("Method Name Is Already Exists."))
              {
                toast.warning(message);
                resetForm();
              }
              else{
                  ShowWarnalert(message);
                  resetForm();
              }
            }
        } catch (error) {
            alert("errorr");
        }
    };

    const LoadTestMethodGrid = async (TestId) => {
        debugger;
        try {
            const visitsResponse = await customAxios.get(`${urlLoadTestMethodGridData}?TestId=${TestId}`);
            if (visitsResponse.data && Array.isArray(visitsResponse.data.data.ListTestMethodModel)) {
              setTestMethodMapData(visitsResponse.data.data.ListTestMethodModel);
            } else {
              setTestMethodMapData([]);
            }
        } catch (error) {
            console.error('Error fetching visits data:', error);
            setTestMethodMapData([]);
        }
    };
    const columns = [
        { field: 'MethodName', headerName: 'MethodName', flex: 1 },

        { field: 'Unit', headerName: 'Unit', flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => (
                <IconButton color="secondary" onClick={() => handleDelete(params.row.TestMethodID)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];
    return (
        <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
            <Grid container width={'100%'}>
                <Grid item xs={12}>
                    <Container maxWidth="xlg">
                        <Formik
                            initialValues={{ ...initialFormState }}
                            validationSchema={FORM_VALIDATION}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h3">TestMethod</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Autocomplete
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                            options={AllTests}
                                            getOptionLabel={(option) => option.LongName}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Tests" size='small' variant="outlined" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <TextField1 name="MethodName" label="MethodName"  />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <TextField1 name="Unit" label="Unit"  />
                                    </Grid>
                                    <Grid item xs={10}></Grid>
                                    <Grid item xs={2} textAlign={'end'}>
                                        <Button type="submit" style={{ width: '100%' }}>Submit</Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TableContainer component={Paper}>
                                            <div >
                                                <DataGrid
                                                    rows={TestMethodMapData}
                                                    columns={columns}
                                                    initialState={{
                                                        ...TestMethodMapData.initialState,
                                                        pagination: { paginationModel: { pageSize: 5 } },
                                                    }}
                                                    pageSizeOptions={[5, 10, 25]}
                                                    disableColumnFilter
                                                    disableColumnSelector
                                                    disableDensitySelector
                                                    disableRowSelectionOnClick
                                                    slots={{ toolbar: GridToolbar }}
                                                    getRowId={(row) => row.TestMethodID} // Specify the custom id property here
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
                                    </Grid>
                                    <Dialog open={isDeleteDialogOpen} onClose={cancelDelete} disableBackdropClick  >
                                        <DialogTitle>Confirm Delete</DialogTitle>
                                        <DialogContent>
                                            Are you sure you want to delete this TestMethod?
                                        </DialogContent>
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
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
}

export default TestMethod;
