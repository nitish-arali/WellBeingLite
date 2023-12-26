
import { urlLoadTestForMapping, urlSaveNewSubTestmap, urlLoadSubTestMapGridData, urlDeleteSubTest } from 'endpoints.ts';
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
import {
    Grid,
    Typography,
    Button as MuiButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
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
    TestOrder: Yup.string().required('required'),

});

function SubTestMapping() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption1, setSelectedOption1] = useState(null);
    const [options, setOptions] = useState([]);
    const [AllTests, setAllTests] = useState([]);
    const [subTestMapdata, setSubTestMapdata] = useState([]);

    const classes = useStyles();
    // ... (other state variables)

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subTestIdToDelete, setSubTestIdToDelete] = useState(null);

    // ... (other functions)

    const handleDelete = (subTestId) => {
        setSubTestIdToDelete(subTestId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await customAxios.delete(
                `${urlDeleteSubTest}?subtestId=${subTestIdToDelete}`
            );
            if (response.status === 200 && response.data.data.Status !== '' && response.data.data.Status != null) {
                var message = response.data.data.Status;
                toast.success(message);
                // Reload the data after deletion
                LoadTestMapGrid(selectedOption.ServiceId);
            } else {
                toast.error('Failed to delete SubTest.');
            }
        } catch (error) {
            console.error('Error deleting SubTest:', error);
            toast.error('Error deleting SubTest.');
        } finally {
            setDeleteDialogOpen(false);
            setSubTestIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSubTestIdToDelete(null);
    };

    const handleOptionChange = (event, newValue) => {
        debugger;
        setSelectedOption(newValue);
        if (newValue != null) {
            LoadTestMapGrid(newValue.ServiceId);
        }
        else {
            setSubTestMapdata([]);
        }
    };
    const handleOptionChange1 = (event, newValue) => {
        setSelectedOption1(newValue);
    };
    const [initialFormState, setInitialFormState] = useState({
        TestOrder: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await customAxios.get(`${urlLoadTestForMapping}`);
                if (response.status === 200) {
                    const SourceProfileTests = response.data.data.ProfileTests;
                    const SourceAllTests = response.data.data.AllDiagnosticTests;
                    setOptions(SourceProfileTests);
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
            const { TestOrder } = values;
            if (TestOrder == '' || selectedOption == null || selectedOption1 == null) {
                toast.error('ProfileTest and TestOrder Both required');
                return;
            }
            const params = new URLSearchParams({
                MainTestID: selectedOption.ServiceId,
                SubTestId: selectedOption1.ServiceId,
                TestOrder: TestOrder
            });
            const response = await customAxios.post(`${urlSaveNewSubTestmap}?${params}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.data.Status !== '') {
                var message = response.data.data.Status;
                if (message.includes("SubTest Mapped Successfully.")) {
                    toast.success(message);
                    LoadTestMapGrid(selectedOption.ServiceId);
                    setSelectedOption1(null);
                    resetForm();
                } else if (message.includes("Test Order Is Already Exists.")) {
                    toast.warning(message);
                    resetForm();
                } else {
                    toast.warning(message);
                    resetForm();
                }
            }
        } catch (error) {
            alert("errorr");
        }
    };

    const LoadTestMapGrid = async (SubTestId) => {
        debugger;
        try {
            const visitsResponse = await customAxios.get(`${urlLoadSubTestMapGridData}?MainTestId=${SubTestId}`);
            if (visitsResponse.data && Array.isArray(visitsResponse.data.data.SubTestMappingList)) {
                setSubTestMapdata(visitsResponse.data.data.SubTestMappingList);
            } else {
                setSubTestMapdata([]);
            }
        } catch (error) {
            console.error('Error fetching visits data:', error);
            setSubTestMapdata([]);
        }
    };
    const columns = [
        { field: 'SubTestName', headerName: 'SubTestName', flex: 1 },

        { field: 'TestOrder', headerName: 'TestOrder', flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => (
                <IconButton color="secondary" onClick={() => handleDelete(params.row.SubTestId)}>
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
                                        <Typography variant="h3">SubTestMapping</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Autocomplete
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                            options={options}
                                            getOptionLabel={(option) => option.LongName}
                                            renderInput={(params) => (
                                                <TextField {...params} label="ProfileTests" size='small' variant="outlined" />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={3}>
                                        <Autocomplete
                                            value={selectedOption1}
                                            onChange={handleOptionChange1}
                                            options={AllTests}
                                            getOptionLabel={(option) => option.LongName}
                                            renderInput={(params) => (
                                                <TextField {...params} label="SubTests" size='small' variant="outlined" />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={3}>
                                        <TextField1 name="TestOrder" label="TestOrder" numeric />
                                    </Grid>
                                    <Grid item xs={10}></Grid>
                                    <Grid item xs={2} textAlign={'end'}>
                                        <Button type="submit" style={{ width: '100%' }}>Submit</Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TableContainer component={Paper}>
                                            <div >
                                                <DataGrid
                                                    rows={subTestMapdata}
                                                    columns={columns}
                                                    initialState={{
                                                        ...subTestMapdata.initialState,
                                                        pagination: { paginationModel: { pageSize: 5 } },
                                                    }}
                                                    pageSizeOptions={[5, 10, 25]}
                                                    disableColumnFilter
                                                    disableColumnSelector
                                                    disableDensitySelector
                                                    disableRowSelectionOnClick
                                                    slots={{ toolbar: GridToolbar }}
                                                    getRowId={(row) => row.SubTestId} // Specify the custom id property here
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
                                    <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}  disableBackdropClick={true}>
                                        <DialogTitle>Confirm Delete</DialogTitle>
                                        <DialogContent>
                                            Are you sure you want to delete this SubTest?
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

export default SubTestMapping;
