import React, { useEffect, useState, useParams } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Box, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import PatientHeaderSingle from '../../views/Patient/FormsUI/PatientHeaderSingle/index.js';
import { useNavigate } from 'react-router';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CaptureVitals from './CaptureVitals/index.js';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
const Vitals = () => {
  const location = useLocation();
  const selectedRow = location.state.selectedRow;

  const navigate = useNavigate();
  const [encounterId, setEncounterID] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [isVitalCaptureOpen, setVitalCaptureDialogOpen] = useState(false);

  useEffect(() => {
    debugger;
    if (selectedRow != null) {
      setEncounterID(selectedRow.EncounterId);
    }
  }, [selectedRow]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEndConsultation = () => {
    // Perform the end consultation logic here
    handleCloseDialog();
  };

  const handleOpenCaptureVitalDialog = () => {
    // Ensure that the dialog is not already open before opening it
    if (!isVitalCaptureOpen) {
      setVitalCaptureDialogOpen(true);
    }
  };

  const handleCloseCaptureVitalDialog = () => {
    // Close the EditRegistrationDialog and clear the selected patient data
    setVitalCaptureDialogOpen(false);
  };

  const handleBackToList = () => {
    const url = `/queueManagement`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleChange = (event, newValue) => {
    // Handle tab change logic if needed
  };

  return (
    <>
      <Box sx={{ width: '100%', backgroundColor: '#d1c4e9', margin: '4px', borderRadius: '10px' }}>
        <Grid xs={12}>
          <Typography style={{ padding: '20px', color: 'black', display: 'flex', alignContent: 'flex-start', fontSize: '33px' }}>
            Patient Details
          </Typography>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', backgroundColor: 'white', padding: '0' }}>
        <Grid container spacing={1}>
          <Grid item XS={2}>
            {' '}
            <div
              style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <IconButton edge="end" color="inherit" onClick={handleBackToList}>
                <KeyboardDoubleArrowLeftRoundedIcon style={{ color: 'blue' }} />
              </IconButton>
              <Typography style={{ color: 'blue' }}> Back to list </Typography>
            </div>
          </Grid>
          <Grid item xs={9}>
            <PatientHeaderSingle patientdata={selectedRow} encounterId={encounterId} />
          </Grid>
          <Grid item XS={1}>
            {' '}
            <div
              style={{
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <Typography style={{ color: 'blue' }}> Send for Consultation </Typography>
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm End Consultation</DialogTitle>
                <DialogContent>
                  <Typography>Are you sure you want to end the consultation?</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    No
                  </Button>
                  <Button onClick={handleEndConsultation} color="primary">
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={4}>
            <div>
              <Button variant="contained" color="primary">
                Previous Vital Signs
              </Button>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <Button onClick={handleOpenCaptureVitalDialog} variant="contained" color="primary">
                Capture Vitals
              </Button>
              <Grid>{isVitalCaptureOpen && <CaptureVitals open={isVitalCaptureOpen} onClose={handleCloseCaptureVitalDialog} />}</Grid>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Vitals;
