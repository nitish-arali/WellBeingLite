import React from 'react';
import Avatar from '@mui/material/Avatar';
import male from '../../../../assets/images/m.png';
import female from '../../../../assets/images/f.png';
import defaultPic from '../../../../assets/images/defaultPic.png';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import FolderCopyTwoToneIcon from '@mui/icons-material/FolderCopyTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';
import Chip from '@mui/material/Chip'; // Import Chip component

function PatientHeaderSingle({ patientdata, encounterId }) {
  function showGenderPic(patientdata) {
    if (patientdata?.Gender === 7) {
      return male;
    }
    if (patientdata?.Gender === 8) {
      return female;
    } else {
      return defaultPic;
    }
  }

  function showGender(patientdata) {
    if (patientdata?.Gender === 7) {
      return 'Male';
    }
    if (patientdata?.Gender === 8) {
      return 'Female';
    } else {
      return 'N/A';
    }
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  const formattedDate = formatDate(patientdata?.DateOfBirth);
  const dateOfBirth = formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;

  function calculateAge(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    let yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
    let monthsDiff = currentDate.getMonth() - birthDate.getMonth();
    let daysDiff = currentDate.getDate() - birthDate.getDate();

    // Adjust age components based on negative values
    if (daysDiff < 0) {
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      daysDiff += lastDayOfMonth;
      monthsDiff--;
    }
    if (monthsDiff < 0) {
      monthsDiff += 12;
      yearsDiff--;
    }
    if (!yearsDiff) {
      return 'N/A';
    }
    return `${yearsDiff}Y ${monthsDiff}M ${daysDiff}D`;
  }
  const age = calculateAge(dateOfBirth);
  const encounterId1 = encounterId; // Extract encounterId from patientdata
  const en3 = patientdata?.GeneratedEncounterId;

  const patientContent = (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={1}>
        <Avatar src={showGenderPic(patientdata)} sx={{ width: 60, height: 60 }} />
      </Grid>
      <Grid item xs={3} sx={{ padding: '8px' }}>
        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '700' }}>UhId:</span> {patientdata?.UhId || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <span style={{ fontWeight: '700' }}>VisitId:</span>
          {en3 ? (
            <Chip label={en3} size="small" color="secondary" />
          ) : encounterId1 ? (
            <Chip label={encounterId1} size="small" color="secondary" />
          ) : (
            <span style={{ color: 'red' }}>N/A</span>
          )}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ padding: '8px' }}>
        <Typography variant="body1" sx={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '700' }}>{patientdata?.PatientName || 'N/A'}</span>
        </Typography>
        <Typography variant="body2">{age}</Typography>
      </Grid>
      <Grid item xs={1.5} sx={{ padding: '8px', position: 'relative' }}>
        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
          {showGender(patientdata)}
        </Typography>
        <Typography variant="body2">{dateOfBirth}</Typography>
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            bottom: 0,
            left: 'calc(100%)', // Add space between text and divider
            width: '1px',
            backgroundColor: 'black'
          }}
        ></Box>
      </Grid>
      <Grid item xs={2.5} sx={{ padding: '8px', display: 'flex', justifyContent: 'space-around' }}>
        <IconButton color="secondary" aria-label="add an alarm">
          <FolderCopyTwoToneIcon fontSize="large" />
        </IconButton>
        <IconButton color="secondary" aria-label="add an alarm">
          <InfoTwoToneIcon fontSize="large" />
        </IconButton>
        <IconButton color="secondary" aria-label="add an alarm">
          <RequestQuoteTwoToneIcon fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );

  return (
    <Box
      width={'100%'}
      height={'100px'}
      border={3}
      borderColor="#efebe9"
      //backgroundColor="#ECF2FF"
      // borderRadius={4}
      display="flex"
      alignItems="center"
      justifyContent="space-evenly"
      p={2}
      mb={2}
    >
      {patientContent}
    </Box>
  );
}

export default PatientHeaderSingle;
