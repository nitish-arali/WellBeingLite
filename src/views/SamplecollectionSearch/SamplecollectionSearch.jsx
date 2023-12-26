
import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
import { urlSearchUHID, urlGetAllVisitsForPatientId,urlGetLabNumbers } from 'endpoints.ts';
import { Grid, Typography, Select, MenuItem } from '@mui/material';
import Button from 'views/Patient/FormsUI/Button';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import VisitSelect from 'views/Patient/FormsUI/VisitSelect/index.js';
import { useNavigate } from 'react-router';

//import CKEditorComponent from 'views/Patient/FormsUI/CKEditorComponent/index.js';
//import Select from 'views/Patient/FormsUI/Select';
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

function SamplecollectionSearch() {
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const [labnumbres, setLabnumbers] = useState([]);
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState('');
  const [initialFormState, setInitialFormState] = useState({
    PatientName: '',
    Uhid: '',
    visit:'',
    Labnumber:''

  });
  
  const classes = useStyles();
  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleAutocompleteChange = (newValue) => {
    debugger;
    // Initialize selectedOption to null if newValue is null
    let selectedOption = null;

    // Update selectedOption only if newValue is not null
    if (newValue !== null) {
      selectedOption = options.find((option) => option.UhId === newValue.UhId);
    }

    // Update both selectedUhId and PatientName in the state
    setSelectedUhId(newValue);
    console.log('uhid',selectedUhId);
    setInitialFormState((prevState) => ({
      ...prevState,
      PatientName: newValue ? (selectedOption ? selectedOption.PatientFirstName : '') : '', // Set PatientName to the value from the selected option if newValue is not null
    }));
    if (selectedOption && selectedOption.PatientId) {
      debugger;

      getencounters(selectedOption.PatientId);
      //setSelectedPatientId(selectedOption.PatientId);
    }
    else {
      setVisits([]);
      setLabnumbers([]);
      //  setSelectedPatientId(null);
      setInitialFormState({
        PatientName: '',
        visit:''
      });
    }

  };
  const getencounters = async (patientid) => {
    debugger;
    try {
      const visitsResponse = await customAxios.get(`${urlGetAllVisitsForPatientId}?PatientId=${patientid}`);
      if (visitsResponse.data && Array.isArray(visitsResponse.data.data.EncounterModellist)) {
        setVisits(visitsResponse.data.data.EncounterModellist);
           // Call getlabnumber function with the selected visit value
      if (visitsResponse.data.data.EncounterModellist.length > 0) {
        const selectedVisit = visitsResponse.data.data.EncounterModellist[0];
        getlabnumber(selectedVisit);
      }
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error('Error fetching visits data:', error);
      setVisits([]);
    }
  };

  const getlabnumber =async (selectedVisit) => {
    debugger;
   
    try {
      if(selectedVisit!=null)
      {
        const listoflabnums = await customAxios.get(`${urlGetLabNumbers}?PatientId=${selectedVisit.PatientId}&EncounterId=${selectedVisit.EncounterId}`);
        if (listoflabnums.data && Array.isArray(listoflabnums.data.data.ListOfLabNumbers) && listoflabnums.data.data.ListOfLabNumbers.length > 0){
          setLabnumbers(listoflabnums.data.data.ListOfLabNumbers);
             // Call getlabnumber function with the selected visit value
        
        } else {
          setLabnumbers([]);
        
        }
      }
     
    } catch (error) {
      console.error('Error fetching visits data:', error);
      setLabnumbers([]);
    }
  };

  const handleSubmit = (values) => {
    debugger;
    console.log('Form submitted with values:', values);
    const uhid = selectedUhId ? selectedUhId.UhId : '';
    const patientId = selectedUhId ? selectedUhId.PatientId : '';
    const PatientName = selectedUhId ? selectedUhId.PatientFirstName : '';
    const encounterId = values.visit;
    const labNumber = values.Labnumber;
  const url = `/SampleCollectionIndex/${patientId}/${encounterId}/${labNumber}`;

  // Navigate to the new URL
  navigate(url);
    
  };

  const fetchOptionsCallback = async (inputValue) => {
    try {
      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${inputValue}`);
      if (response.data && Array.isArray(response.data.data)) {
        setOptions(response.data.data);
        // Update the state with the received data for PatientName

      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOptions([]);
    }
  };
  const handleVisitChange = (selectedVisit) => {
    debugger;
    getlabnumber(selectedVisit);
  };


 
  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <div className={classes.formWrapper}>
            <Formik
                initialValues={{ ...initialFormState }}
                onSubmit={handleSubmit}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h3">Search</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      {/* <TextField name="Uhid" label="Uhid" /> */}
                      <CustomAutocomplete
                        id="uhid-autocomplete"
                        label="UHID"
                        options={options}
                        value={selectedUhId}
                        onInputChange={handleInputChange}
                        onChange={handleAutocompleteChange}
                        fetchOptionsCallback={fetchOptionsCallback}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="PatientName" label="Name" value={initialFormState.PatientName} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <VisitSelect name="visit" 
                      style={{ width: '100%' }}
                      options={visits}
                      label="Visits"
                      getOptionLabel={(option) => option.GeneratedEncounterId}
                      getOptionValue={(option) => option.EncounterId}
                      onChangeVisit={handleVisitChange}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <VisitSelect name="Labnumber" 
                      style={{ width: '100%' }}
                      options={labnumbres}
                      label="Labnumber"
                      getOptionLabel={(option) => option.LabNumber}
                      getOptionValue={(option) => option.LabStatusId}
                      />
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

    </Box>
  );
}

export default SamplecollectionSearch;
