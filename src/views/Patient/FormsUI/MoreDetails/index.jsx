// CreateVisitDialog.jsx
//import React from 'react';
import { Dialog, DialogContent, Typography, Grid } from '@mui/material';
import Button from '../Button/index.js';
//import PatientHeader from './PatientHeader';
import PatientHeader from '../PatientHeader/index.js';
import Select from '../Select/index.js';
import CloseIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Formik, Form } from 'formik';
import { Container } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import customAxios from '../CustomAxios/index.js';
import * as Yup from 'yup';
import PatientHeaderSingle from '../PatientHeaderSingle/index.js';
import Patient from 'views/Patient/Patient.jsx';
import NewVisit from '../NewVisit/index.jsx';
import { urlGetVisitDetailsWithPHeader } from 'endpoints.ts';

function MoreDetailsDialog({ isOpen, onClose, selectedRow }) {
  const [moreDetails, setMoreDetails] = useState({
    PermanentAddress1: '',
    MaritalStatus: '',
    FatherHusbandName: '',
    Occupation: ''
  });
  const [encounterId] = useState(null);

  const fetchPatientDetails = async (patientId) => {
    try {
      debugger;
      // Make an API call to fetch patient details using patientId
      const response = await customAxios.get(`${urlGetVisitDetailsWithPHeader}?PatientId=${patientId}`);
      if (response.status === 200) {
        const patientDetail = response.data.data.PatientDetail;
        // Assuming your API response structure matches the provided data

        setMoreDetails({
          PermanentAddress1: patientDetail.PermanentAddress1,
          MaritalStatus: patientDetail.MaritalStatus,
          FatherHusbandName: patientDetail.FatherHusbandName,
          Occupation: patientDetail.Occupation
        });
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  useEffect(() => {
    if (selectedRow != null) {
      fetchPatientDetails(selectedRow.PatientId);
    }
  }, [selectedRow]);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxWidth: '800px',
          height: '500px' // Set your desired custom max-width here
        }
      }}
    >
      <DialogContent>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h5" gutterBottom>
                {' '}
                Patient Details{' '}
              </Typography>
              <PatientHeaderSingle patientdata={selectedRow} encounterId={encounterId} />
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <LocationOnIcon /> <strong>Permanent Address:</strong>
                <br /> <br />
                {moreDetails.PermanentAddress1}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Marital Status:</strong> {moreDetails.MaritalStatus}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Occupation:</strong> {moreDetails.Occupation}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Father/Husband Name:</strong> {moreDetails.FatherHusbandName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
}

export default MoreDetailsDialog;
