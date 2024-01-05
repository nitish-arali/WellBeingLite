
import { urlGetAllTemplates } from 'endpoints.ts';
import { Grid, Typography, TableContainer, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
//import MuiButton from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

function TemplateMaster() {
  const [loadTemplateGrid, setloadTemplateGrid] = useState([]);

  const navigate = useNavigate();

  const [initialFormState, setInitialFormState] = useState({

  });

  const classes = useStyles();


  const handleAddTemplate = () => {
    debugger;
    const Tid=0;
    const url = `/ShowTemplate/${Tid}`;
    
    navigate(url);

  };

  const handleEdit = (row) => {
    debugger;
    console.log("Editing row: ", row);
    const EditTid=row.TID;
    const url = `/ShowTemplate/${EditTid}`;
    
    navigate(url);

    // Add your edit logic here
  };
  
  const handleDelete = (row) => {
    console.log("Deleting row: ", row);
    // Add your delete logic here
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(`${urlGetAllTemplates}`);
        if (response.status === 200) {
          const SourceTemplateList = response.data.data.templateListModel;
          setloadTemplateGrid(SourceTemplateList);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);



  const columns = [
    {
      field: 'TempName',
      headerName: 'TemplateName',
      headerClassName: 'super-app-theme--header',
      headerClassName: 'super-app-theme--header',
      flex: 1
    },
    { field: 'TempGroupName', headerName: 'TempGroupName', headerClassName: 'super-app-theme--header', flex: 1 },
    { field: 'ProviderName', headerName: 'ProviderName', headerClassName: 'super-app-theme--header', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      renderCell: (params) => (
        <strong>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </strong>
      ),
    },
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
          <Typography variant="h3" sx={{ backgroundColor: '#1E88E5', color: 'white', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
            Templates Management
            <IconButton aria-label="add an alarm" sx={{ color: 'white' }} onClick={handleAddTemplate} >
              <AddCircleOutlineIcon />
            </IconButton >
          </Typography>
          <Grid item xs={12}>
            <Container maxWidth="xlg">
              <div className={classes.formWrapper}>
                <Formik
                  initialValues={{ ...initialFormState }}
                >
                  <Form>
                    <Grid container spacing={2}>
                      <Box
                        sx={{
                          width: '100%',
                          backgroundColor: '#DBDFEA',
                          marginTop: '20px',
                          borderRadius: '10px',
                          boxShadow: '6px 5px 5px -6px rgba(13,0,13,1)'
                        }}
                      >
                      </Box>
                      <Grid item xs={12}>
                        <TableContainer component={Paper} style={{ borderRadius: '0px' }}>
                          <DataGrid
                            rows={loadTemplateGrid}
                            onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                            columns={columns}
                            pageSize={10} // Set initial rows per page to 10
                            pageSizeOptions={[5, 10, 25]}
                            style={{
                              borderRadius: '0px'
                            }}
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            disableRowSelectionOnClick
                            slots={{ toolbar: GridToolbar }}
                            getRowId={(row) => row.TID} // Specify the custom id property here
                            getRowClassName={() => 'custom-row'}
                            slotProps={{
                              toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                                printOptions: { disableToolbarButton: true },
                                csvOptions: { disableToolbarButton: true }
                              },

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

export default TemplateMaster;
