
import { urlLoadAllDropDownsTemplate,urlSaveNewTemplate,urlEditTemplate } from 'endpoints.ts';
import { Grid, Typography } from '@mui/material';
import Button from 'views/Patient/FormsUI/Button';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container, fontSize } from '@mui/system';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import CKEditorComponent from 'views/Patient/FormsUI/CKEditorComponent/index.js';
import IconButton from '@mui/material/IconButton';
import Select from 'views/Patient/FormsUI/Select';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));


const FORM_VALIDATION = Yup.object().shape({

  FacilityID: Yup.string().required('required'),
  TempGroupID: Yup.string().required('required'),
  ProviderID: Yup.string().required('required'),
  TempName: Yup.string().required('required'),

});
function ShowTemplate() {
  const { Tid } = useParams(); // Extract Tid from the URL
  const [templateGroups, setTemplateGroups] = useState([]);
  const [providers, setProviders] = useState([]);
  const [facility, setFacility] = useState([]);
  const [editorData, setEditorData] = useState('');
  const [editTempdata, setEditTempdata] = useState([]);
  const navigate = useNavigate();



  const [initialFormState, setInitialFormState] = useState({
    FacilityID: '',
    TempGroupID: '',
    ProviderID: '',
    TempName: ''
  });

  const classes = useStyles();



 useEffect(() => {
  debugger;
    const fetchData = async () => {
      try {
        const response = await customAxios.get(`${urlLoadAllDropDownsTemplate}`);
        if (response.status === 200) {
          // const SourceProfileTests = response.data.data.ProfileTests;
          const SourceTemplateGroups = response.data.data.TemplateGroups;
          const SourceProviders = response.data.data.Provider;
          const SourceFacilitys = response.data.data.AllFacility;

          //setOptions(SourceProfileTests);
          setTemplateGroups(SourceTemplateGroups);
          setProviders(SourceProviders);
          setFacility(SourceFacilitys);

          // Fetch template data if Tid is provided
          if (Tid > 0) {
            GetTemplateDataForEditing(Tid);
          }
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [Tid]); // Add Tid as a dependency to re-run the effect when Tid changes

  const GetTemplateDataForEditing = async (Tid) => {
    try {
      if (Tid != null) {
        const response = await customAxios.get(`${urlEditTemplate}?Tid=${Tid}`); // Replace with your actual endpoint
        if (response.status === 200) {
          const templateData = response.data.data.templatemodel;
          setEditTempdata(response.data.data.templatemodel);
  
          setInitialFormState({
            FacilityID: templateData.FacilityID,
            TempGroupID: templateData.TempGroupID,
            ProviderID: templateData.ProviderID,
            TempName: templateData.TempName
          });
          setEditorData(templateData.TempData);
          setEditTempdata(templateData);
        } else {
          console.error('Failed to fetch template data');
        }
      }
    } catch (error) {
      console.error('Error fetching template data:', error);
      setEditTempdata([]);
      setEditorData([]);
    }
  };

  const handleBackIcon = () => {
    debugger;

    const url = `/TemplateMaster`;

    // Navigate to the new URL
    navigate(url);

  };




  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  const handleSubmit = async (values, { resetForm }) => {
    debugger;
    try {
      console.log(values, editorData);
 
      const tempmodalData = {
        ...values,
        TempData: editorData,
        TID:Tid
      };
      const response = await customAxios.post(urlSaveNewTemplate, tempmodalData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.data.Status !== '') {
        var message = response.data.data.Status;
        if (message) {
          toast.success(message);
          if(Tid>0)
          {
            const url = `/TemplateMaster`;
            navigate(url);
          }
          resetForm();
          setEditorData('');
        }
      } else {
        toast.error('Something Went Wrong....');
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("error");
    }
  };

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
            Add Template
            <IconButton aria-label="add an alarm" sx={{ color: 'white' }} onClick={handleBackIcon} >
            <KeyboardBackspaceIcon  />
            </IconButton >
          </Typography>
          <Grid item xs={12}>
            <Container maxWidth="xlg">
              <div className={classes.formWrapper}>
                <Formik
                enableReinitialize 
                  initialValues={{ ...initialFormState }}
                  validationSchema={FORM_VALIDATION}
                  onSubmit={handleSubmit}
                // onChange={handleOperatorChange}
                >
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Select
                          style={{ width: '100%' }}
                          getOptionLabel={(option) => option.FacilityName}
                          getOptionValue={(option) => option.FacilityId}
                          label={
                            <span>
                              Facility <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                            </span>
                          }
                          name="FacilityID"
                          options={facility}
                        // onChangeCallback={handleFirstDropdownChange}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Select
                          style={{ width: '100%' }}
                          getOptionLabel={(option) => option.LookupDescription}
                          getOptionValue={(option) => option.LookupID}
                          label={
                            <span>
                              Template Group <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                            </span>
                          }
                          name="TempGroupID"
                          options={templateGroups}
                        // onChangeCallback={handleFirstDropdownChange}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Select
                          style={{ width: '100%' }}
                          getOptionLabel={(option) => option.ProviderName}
                          getOptionValue={(option) => option.ProviderId}
                          label={
                            <span>
                              Providers <span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                            </span>
                          }
                          name="ProviderID"
                          options={providers}
                        //onChangeCallback={handleFirstDropdownChange}
                        />
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <TextField1 name="TempName"
                          label={
                            <span>
                              Template Name<span style={{ color: 'red', paddingLeft: '2px' }}>*</span>
                            </span>
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <CKEditorComponent data={editorData} onChange={handleEditorChange} />
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
      </Grid>
    </Box>
  );
}

export default ShowTemplate;
