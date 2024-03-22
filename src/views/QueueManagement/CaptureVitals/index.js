//import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Textarea from 'views/Patient/FormsUI/Textarea/index.js';
import { Formik, Form, useField } from 'formik';
import Button from '../../Patient/FormsUI/Button/index.js';
import { Box, Grid, Typography, IconButton, TextareaAutosize } from '@mui/material';
import { Container } from '@mui/system';
import { makeStyles } from '@mui/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function CaptureVitals({ open, onClose }) {
  const useStyles = makeStyles((theme) => ({
    // formWrapper: {
    //   marginTop: theme.spacing(5),
    //   marginBottom: theme.spacing(8)
    // }
  }));
  const classes = useStyles();

  const currentDate = new Date();
  const currentTimeString = currentDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });

  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleCancelClick = () => {
    onClose();
  };

  const handleCrossIconClick = () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxWidth: '100%', // Adjust the max-width as needed
          width: '80%', // Adjust the width as needed
          height: '80%' // Adjust the height as needed
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          padding: '0',
          marginTop: '2%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid container width={'100%'} spacing={2}>
          <Grid item xs={12}>
            <Typography
              style={{
                padding: '20px',
                backgroundColor: '#d1c4e9',
                color: 'black',
                display: 'flex',
                alignContent: 'flex-start'
              }}
            >
              You are capturing vitals for the above patient on
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                {currentTimeString}
                <AccessTimeIcon style={{ marginLeft: '5px' }} />
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4} md={2}>
                <TextField
                  id="outlined-basic"
                  label="Height"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="outlined-basic"
                  label="Weight"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">in Kgs</InputAdornment>
                  }}
                />
              </Grid>
              <Grid xs={2}></Grid>

              <Grid item xs={2}>
                <TextField id="outlined-basic" label="Body mass index" variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={3}>
                {' '}
                <TextField
                  id="outlined-basic"
                  label="Head Circumference"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">in cm</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                {' '}
                <TextField id="outlined-basic" label="Axellery temperature(f)" variant="outlined" />
              </Grid>
              <Grid item xs={6} md={3}>
                {' '}
                <TextField id="outlined-basic" label="Periperal pulse rate (bpm)" variant="outlined" />
              </Grid>
              <Grid item xs={6} md={3}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={3}>
                {' '}
                <TextField id="outlined-basic" label="Systolic BP(mmHg)" variant="outlined" />
              </Grid>
              <Grid item xs={6} md={3}>
                {' '}
                <TextField id="outlined-basic" label="Diastolic BP(mmHg)" variant="outlined" />
              </Grid>
              <Grid item xs={8} md={3}>
                {' '}
                <TextField id="outlined-basic" label="Mean Atrial Pressure(mmHg)" variant="outlined" />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl component="fieldset">
                  <FormLabel id="demo-controlled-radio-buttons-group">Position</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                    row // This makes the radio buttons display horizontally
                  >
                    <FormControlLabel value="sitting" control={<Radio />} label="Sitting" />
                    <FormControlLabel value="sleeping" control={<Radio />} label="Sleeping" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={3}>
                <TextField id="outlined-basic" label="Respiratory rate(br/min)" variant="outlined" />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField id="outlined-basic" label="SPO2%" variant="outlined" />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormGroup row>
                  <FormControlLabel control={<Switch />} label="Oedema" />
                  <FormControlLabel control={<Switch />} label="Pallor" />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Textarea aria-label="minimum height" minRows={3} placeholder="Other comments(if any)" />
          </Grid>

          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              style={{
                backgroundColor: '#2196F3',
                color: '#fff',
                fontFamily: "'Roboto',sans-serif",
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                padding: '3px ',
                transition:
                  'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                width: '10%',
                fontWeight: '500',
                borderRadius: '4px',
                border: 'none'
              }}
              type="button"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default CaptureVitals;
