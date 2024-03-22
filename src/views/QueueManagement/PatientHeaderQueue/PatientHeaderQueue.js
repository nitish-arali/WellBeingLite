//import React from 'react';
import Avatar from '@mui/material/Avatar';
import male from '../../../assets/images/m.png';
import female from '../../../assets/images/f.png';
import defaultPic from '../../../assets/images/defaultPic.png';
import { Box, Grid, Typography, IconButton } from '@mui/material';
// import FolderCopyTwoToneIcon from '@mui/icons-material/FolderCopyTwoTone';
// import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
// import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip'; // Import Chip component
import { Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import BiotechIcon from '@mui/icons-material/Biotech';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MuiButton from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { Modal } from 'antd';
import PatientHeaderVisit from 'views/Patient/FormsUI/PatientHeaderVisit/indexvisit';
import { Row, Col, InputNumber } from 'antd';
import Form from 'antd/es/form';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import { urlGetMarkArrival } from 'endpoints.ts';
import { BrowserRouter as Router } from 'react-router-dom';

function PatientHeader({
  patientdata,
  queueNumber
  // encounterId
}) {
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

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [fetchedTokenNo, setFetchedTokenNo] = useState(null);
  const [fetchedQueueLength, setFetchedQueueLength] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateToCaptureVitals = () => {
    setSelectedPatient(patientdata);
    const url = `/vitals`;
    // Navigate to the new URL with state
    navigate(url, { state: { selectedRow: patientdata } });
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  const formattedDate = formatDate(patientdata?.DateOfBirth);
  const dateOfBirth = formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;

  const visitedDateTimeNew = patientdata.RegistrationTime; // Your date and time string

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

  const fetchDataAndShowConfirm = async () => {
    try {
      let encounter = patientdata.GeneratedEncounterId.replace(/"/g, '');

      const QId = patientdata.QId; // replace with your QId
      const PatientID = patientdata.PatientId; // replace with your PatientID
      const ProviderId = patientdata.ProviderId; // replace with your ProviderId
      const Flag = 'All'; // replace with your Flag
      const Encounter = encounter;
      customAxios
        .get(`${urlGetMarkArrival}?QId=${QId}&Flag=${Flag}&Encounter=${Encounter}&PatientID=${PatientID}&ProviderId=${ProviderId}`)
        .then((response) => {
          //fetchedpatientData(response.data.data.NewQueueModel);
          setFetchedTokenNo(response.data.data.NewQueueModel.TokenNo);
          form.setFieldsValue({
            TokenNo: response.data.data.NewQueueModel.TokenNo,
            QLength: response.data.data.NewQueueModel.QLength
          });
          setFetchedQueueLength(response.data.data.NewQueueModel.QLength);

          if (response.status === 200) {
            showConfirm();
          } else {
            console.error('Failed to fetch providers');
          }
        })
        .catch((error) => {
          console.error(error);
          // Handle errors here
        });
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };

  const { confirm } = Modal;

  const showConfirm = () => {
    debugger;
    const handleTokenNoChange = (value) => {
      // Update the TokenNo in the form values
      form.setFieldsValue({
        TokenNo: value
      });
    };

    const handleQLengthChange = (value) => {
      // Update the TokenNo in the form values
      form.setFieldsValue({
        QLength: value
      });
    };
    confirm({
      content: (
        <>
          <div>
            <Router>
              <div>
                <PatientHeaderVisit patientdata={patientdata} />
              </div>
            </Router>

            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8} style={{ marginBottom: '20px' }}>
                <div>
                  <Typography>
                    <span style={{ fontWeight: '700' }}>Service Location</span>
                    <div style={{ paddingTop: '5%' }}>{patientdata?.Service_Location || 'N/A'}</div>
                  </Typography>
                </div>
              </Col>

              <Col className="gutter-row" span={8}>
                <div>
                  <Typography>
                    <span style={{ fontWeight: '700' }}>Visit Reason </span>
                    <div style={{ paddingTop: '5%' }}>{patientdata?.Reason || 'N/A'}</div>
                  </Typography>
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div>
                  <Typography>
                    <span style={{ fontWeight: '700' }}>Appointment Time</span>
                    <div style={{ paddingTop: '5%' }}>{patientdata?.AppointmentTime || 'N/A'}</div>
                  </Typography>
                </div>
              </Col>
            </Row>
            <Form form={form} layout="vertical" variant="outlined" size="default">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={8}>
                  <div>
                    <Form.Item label="Token No" name="TokenNo" style={{ fontWeight: '700' }}>
                      <InputNumber style={{ width: '100%' }} min={1} max={1000} onChange={handleTokenNoChange} />
                    </Form.Item>
                  </div>
                </Col>

                <Col className="gutter-row" span={8}>
                  <div>
                    <Form.Item label="Current Queue Length" name="QLength" style={{ fontWeight: '700' }}>
                      <InputNumber style={{ width: '100%' }} disabled onChange={handleQLengthChange} />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </>
      ),
      onOk() {
        form.submit();

        // Handle the confirmation action here
      },
      onCancel() {
        console.log('Close');
        // Handle the cancellation action here
      },
      width: 1000,
      icon: null
    });
  };

  const patientContent = (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent={'center'}>
        <Grid item xs={1}>
          <Avatar src={showGenderPic(patientdata)} sx={{ width: 60, height: 60 }} />
        </Grid>
        <Grid item xs={3} sx={{ padding: '8px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: '700' }}>UhId:</span> {patientdata?.UhId || 'N/A'}
          </Typography>

          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>VisitId:</span> {patientdata?.GeneratedEncounterId || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ padding: '8px' }}>
          <Typography variant="body1" sx={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: '700' }}>{patientdata?.PatientName || 'N/A'}</span>
          </Typography>
          <Typography variant="body2">{age}</Typography>
        </Grid>
        <Grid item xs={2} sx={{ padding: '8px' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            {showGender(patientdata)}
          </Typography>
          <Typography variant="body2">{dateOfBirth}</Typography>
        </Grid>

        <Grid item xs={2} sx={{ padding: '8px', display: 'flex', justifyContent: 'space-around' }}>
          <IconButton aria-label="more" aria-controls="patient-menu" aria-haspopup="true" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="large" />
          </IconButton>
          <Menu id="patient-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={navigateToCaptureVitals}>Capture Vitals</MenuItem>
            <MenuItem onClick={fetchDataAndShowConfirm}>Mark Arrival</MenuItem>
          </Menu>
        </Grid>

        <Divider sx={{ width: '100%' }} />
        <Grid item xs={1.5}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}></span> {patientdata?.PatientTypeName || 'N/A'}
            {/* <Chip label={patientdata?.PatientTypeName || 'N/A'} size="small" color="primary" /> */}
          </Typography>
        </Grid>
        <Grid item xs={2.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>Lab Technician</span>
          </Typography>
          <Typography variant="body2">
            <span style={{ fontWeight: '400' }}> {patientdata?.ProviderName || 'N/A'}</span>
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BiotechIcon />
            <Typography variant="body2">
              <span style={{ fontWeight: '300' }}>To Check Up</span>
            </Typography>
          </div>
        </Grid>

        <Grid item xs={2} sx={{ display: 'flex', color: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Chip
            variant="outlined"
            avatar={<Avatar sx={{ backgroundColor: 'green' }}>{queueNumber}</Avatar>}
            label={<Typography sx={{ color: 'green' }}>Queue No.</Typography>}
            sx={{ backgroundColor: 'transparent', borderColor: 'green', color: 'white' }}
          />
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>Status</span>
          </Typography>
          <Chip label="Waiting" size="small" color="primary" sx={{ width: 'min-content' }} />
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body2">
            <span style={{ fontWeight: '700' }}>Visited Date & Time</span>
          </Typography>
          {combinedDateTime ? <Chip label={combinedDateTime} size="small" color="primary" /> : 'N/A'}
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body2">
            {/* <span style={{ fontWeight: '700' }}>Start Consultation</span> */}
            <MuiButton variant="outlined" color="secondary" endIcon={<KeyboardDoubleArrowRightIcon />}>
              Start Consultation
            </MuiButton>
          </Typography>
          {/* {combinedDateTime ? <Chip label={combinedDateTime} size="small" color="primary" /> : 'N/A'} */}
        </Grid>
      </Grid>
    </>
  );

  return (
    <Box
      width={'100%'}
      height={'180px'}
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

export default PatientHeader;
