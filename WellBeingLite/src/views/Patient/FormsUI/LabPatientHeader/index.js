//import React from 'react';
import Avatar from '@mui/material/Avatar';
import male from '../../../../assets/images/m.png';
import female from '../../../../assets/images/f.png';
import defaultPic from '../../../../assets/images/defaultPic.png';
import { Box, Grid, Typography, IconButton } from '@mui/material';
// import FolderCopyTwoToneIcon from '@mui/icons-material/FolderCopyTwoTone';
// import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
// import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip'; // Import Chip component
import { Divider } from '@mui/material';
import React, { useState } from 'react';
import BiotechIcon from '@mui/icons-material/Biotech';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MuiButton from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router';
import AllDone from '@mui/icons-material/CheckCircleTwoTone';
import PartiallyDone from '@mui/icons-material/ControlPointTwoTone';
import NotDone from '@mui/icons-material/RemoveCircleTwoTone';
function LabPatientHeader({
  patientdata
  // encounterId
}) {
  // debugger;
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
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const SampleCollection = () => {
    // Handle the "Create Visit" action here

    const url = `/SampleCollectionIndex/${patientdata.PatientId}/${patientdata.EncounterId}/${patientdata.PatientLabStatusID}`;

    // Navigate to the new URL
    navigate(url);
    handleMenuClose();
  };

  const ResultEntry = () => {
    // Handle the "More Details" action here

    const url = `/ResultentryIndex/${patientdata.PatientId}/${patientdata.EncounterId}/${patientdata.PatientLabStatusID}`;

    // Navigate to the new URL
    navigate(url);
    handleMenuClose();
  };

  const Verification = () => {
    // Handle the "Edit Reg Details" action here 
    const url = `/VerificationIndex/${patientdata.PatientId}/${patientdata.EncounterId}/${patientdata.PatientLabStatusID}`;

    // Navigate to the new URL
    navigate(url);

    handleMenuClose();
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  const formattedDate = formatDate(patientdata?.DateOfBirth);
  const dateOfBirth = formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;

  const OrederDate1 = formatDate(patientdata?.CreatedDateTime);
  const OrederDate = OrederDate1 === 'Invalid Date' ? 'N/A' : OrederDate1;

  const visitedDateTimeNew = patientdata.VisitedDateTime; // Your date and time string

  // const visitedDateTime = "2023-10-25T13:19:39.663"; // Your date and time string

  // Create a JavaScript Date object
  const dateObject = new Date(visitedDateTimeNew);

  // Define options for formatting the date
  const dateOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };

  // Define options for formatting the time in 12-hour format with AM/PM
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true // Use 12-hour format with AM/PM
  };

  // Format the date and time separately
  const formattedDate1 = dateObject.toLocaleString('en-US', dateOptions);
  const formattedTime = dateObject.toLocaleString('en-US', timeOptions);

  // Combine date and time with a comma
  const combinedDateTime = `${formattedDate1}, ${formattedTime}`;

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
  // const encounterId1 = encounterId; // Extract encounterId from patientdata
  // const en3 = patientdata?.GeneratedEncounterId;

  const patientContent = (
    <>
      <Grid container xs={10} spacing={1} alignItems="center" justifyContent={'start '}>
        <Grid item xs={1}>
          <Avatar src={showGenderPic(patientdata)} sx={{ width: 60, height: 60 }} />
        </Grid>
        <Grid item xs={2} sx={{ padding: '8px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: '700' }}>UhId:</span> {patientdata?.UhId || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>VisitId:</span> {patientdata?.Encounter || 'N/A'}
          </Typography>
        </Grid>

        <Grid item xs={2} sx={{ padding: '8px' }}>
          <Typography variant="body1" sx={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: '700' }}>{patientdata?.PatientFullName || 'N/A'}</span>
          </Typography>
          <Typography variant="body2">{age}</Typography>
        </Grid>
        <Grid item xs={3} sx={{ padding: '8px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: '700' }}>OrderedDate:</span> {OrederDate}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ padding: '8px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            {showGender(patientdata)}
          </Typography>
          <Typography variant="body2">{dateOfBirth}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{ padding: '1px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'start' }}
        ></Grid>
        <Divider sx={{ width: '95%' }} />
        <Grid item xs={1}></Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}></span> {patientdata?.PatientType || 'N/A'}
            {/* <Chip label={patientdata?.PatientTypeName || 'N/A'} size="small" color="primary" /> */}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>Lab Technician</span>
          </Typography>
          {/* <Typography variant="body2">
          <span style={{ fontWeight: '400' }}> {patientdata?.ProviderName || 'N/A'}</span>
        </Typography> */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BiotechIcon />
            <Typography variant="body2">
              <span style={{ fontWeight: '300' }}>To Check Up</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={3} sx={{ flexDirection: 'column' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>LabNumber:</span> {patientdata?.LabNumber || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>BillStatus:</span> {patientdata?.BillStatus || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ flexDirection: 'column' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>Visited Date & Time</span>
          </Typography>
          {combinedDateTime ? <Chip label={combinedDateTime} size="small" color="primary" /> : 'N/A'}
        </Grid>
      </Grid>
      <Grid container xs={2}>
        <Grid item xs={10} display={'flex'} alignItems="start" fontSize={'16px'} justifyContent={'space-evenly'} flexDirection={'column'}>
          <Link
            component={patientdata.IsAllSampleCollected ? '' : 'button'}
            underline={patientdata.IsAllSampleCollected ? 'none' : 'hover'}
            onClick={patientdata.IsAllSampleCollected ? '' : SampleCollection}
            sx={{ marginBottom: '10px', color: patientdata.IsAllSampleCollected ? 'grey' : '#2196F3' }}
          >
            Sample Collection
          </Link>
          <Link
            component={patientdata.IsAllResEntryDone ? '' : 'button'}
            underline={patientdata.IsAllResEntryDone ? 'none' : 'hover'}
            onClick={patientdata.IsAllResEntryDone ? '' : ResultEntry}
            sx={{ marginBottom: '10px', color: patientdata.IsAllResEntryDone ? 'grey' : '#2196F3' }}
          >
            Result Entry
          </Link>
          <Link
            component={patientdata.IsAllVerificationDone ? '' : 'button'}
            underline={patientdata.IsAllVerificationDone ? 'none' : 'hover'}
            onClick={patientdata.IsAllVerificationDone ? '' : Verification}
            sx={{ marginBottom: '10px', color: patientdata.IsAllVerificationDone ? 'grey' : '#2196F3' }}
          >
            Verification
          </Link>
          <Link underline="none" color="grey" sx={{ marginBottom: '5px' }}>
            Reports
          </Link>
        </Grid>
        <Grid item xs={2}>
          <div>
            {(() => {
              if (patientdata.IsAllSampleCollected) {
                return <AllDone style={{ color: '#008000' }} />;
              } else if (patientdata.IsSmpPartiallyCollected) {
                return <PartiallyDone style={{ color: '#ED7D31' }} />;
              } else {
                return <NotDone style={{ color: '#994D1C' }} />;
              }
            })()}
          </div>
          <div>
            {(() => {
              if (patientdata.IsAllResEntryDone) {
                return <AllDone style={{ color: '#008000' }} />;
              } else if (patientdata.IsResEntryPartiallyDone) {
                return <PartiallyDone style={{ color: '#FF6C22' }} />;
              } else {
                return <NotDone style={{ color: '#994D1C' }} />;
              }
            })()}
          </div>
          <div>
            {(() => {
              if (patientdata.IsAllVerificationDone) {
                return <AllDone style={{ color: '#008000' }} />;
              } else if (patientdata.IsVerificationPartiallyDone) {
                return <PartiallyDone style={{ color: '#FF6C22' }} />;
              } else {
                return <NotDone style={{ color: '#994D1C' }} />;
              }
            })()}
          </div>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Box
      width={'100%'}
      height={'140px'}
      overflow={'hidden'}
      // border={2}
      // borderColor="#fff"
      // backgroundColor="#ECF2FF"
      borderRadius={2}
      display="flex"
      alignItems="center"
      justifyContent="space-evenly"
      p={2}
      mb={2}
      boxShadow={'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;'}
    >
      {patientContent}
    </Box>
  );
}

export default LabPatientHeader;
