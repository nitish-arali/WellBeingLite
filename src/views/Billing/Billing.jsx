import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
import { urlSearchUHID, urlGetAllVisitsForPatientId } from 'endpoints.ts';
import { Grid, Typography, Select, MenuItem } from '@mui/material';
import Button from 'views/Patient/FormsUI/Button';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import VisitSelect from 'views/Patient/FormsUI/VisitSelect/index.js';
import { useNavigate } from 'react-router';
import { ErrorMessage } from 'formik';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8)
  }
}));

function Billing() {
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState('');
  const [initialFormState, setInitialFormState] = useState({
    PatientName: '',
    Uhid: '',
    visit: ''
  });

  const validationSchema = Yup.object({
    Uhid: Yup.object().nullable().required('UHID is required')
  });

  const initialValues = {
    Uhid: ''
    // Add other fields as needed
  };

  const classes = useStyles();
  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleAutocompleteChange = (newValue) => {
    // Initialize selectedOption to null if newValue is null
    let selectedOption = null;

    // Update selectedOption only if newValue is not null
    if (newValue !== null) {
      selectedOption = options.find((option) => option.UhId === newValue.UhId);
    }

    // Update both selectedUhId and PatientName in the state
    setSelectedUhId(newValue);
    console.log('uhid', selectedUhId);
    setInitialFormState((prevState) => ({
      ...prevState,
      PatientName: newValue ? (selectedOption ? selectedOption.PatientFirstName : '') : '' // Set PatientName to the value from the selected option if newValue is not null
    }));
    if (selectedOption && selectedOption.PatientId) {
      // debugger;

      getencounters(selectedOption.PatientId);
      //setSelectedPatientId(selectedOption.PatientId);
    } else {
      setVisits([]);
      //  setSelectedPatientId(null);
      setInitialFormState({
        PatientName: '',
        visit: ''
      });
    }
  };
  const getencounters = async (patientid) => {
    try {
      const visitsResponse = await customAxios.get(`${urlGetAllVisitsForPatientId}?PatientId=${patientid}`);
      if (visitsResponse.data && Array.isArray(visitsResponse.data.data.EncounterModellist)) {
        setVisits(visitsResponse.data.data.EncounterModellist);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error('Error fetching visits data:', error);
      setVisits([]);
    }
  };
  const handleSubmit = (values) => {
    // debugger;
    console.log('Form submitted with values:', values);
    const uhid = selectedUhId ? selectedUhId.UhId : '';
    const patientId = selectedUhId ? selectedUhId.PatientId : '';
    const PatientName = selectedUhId ? selectedUhId.PatientFirstName : '';
    const encounterId = values.visit;
    // Include the CKEditor content in the form submission
    console.log('Editor Data:', editorData);
    //  navigate(`/Master/${patientId}/${encounterId}`);
    // Construct the URL with query parameters
    const url = `/Master/${patientId}/${encounterId}`;
    console.log(url);
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

  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  const getOptionLabel = (option) => option.UhId;

  const isOptionEqualToValue = (option, value) => option.UhId === value.UhId;

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
      <Grid container width={'100%'}>
        <Grid item xs={12}>
          <Container maxWidth="xlg">
            <div className={classes.formWrapper}>
              <Formik initialValues={{ ...initialFormState }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h3">Billing</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CustomAutocomplete
                        id="uhid-autocomplete"
                        label="UHID"
                        name="Uhid"
                        options={options}
                        value={selectedUhId}
                        onInputChange={handleInputChange}
                        onChange={handleAutocompleteChange}
                        fetchOptionsCallback={fetchOptionsCallback}
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField1 name="PatientName" label="Name" value={initialFormState.PatientName} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <VisitSelect
                        name="visit"
                        style={{ width: '100%' }}
                        options={visits}
                        label="Visits"
                        getOptionLabel={(option) => option.GeneratedEncounterId}
                        getOptionValue={(option) => option.EncounterId}
                      />
                    </Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={2} textAlign={'end'}>
                      <Button type="submit" style={{ width: '100%' }}>
                        Submit
                      </Button>
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

export default Billing;
