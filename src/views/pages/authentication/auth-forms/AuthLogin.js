import { useState } from 'react';
import { urlLogin } from '../../../../endpoints.ts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLoader from '../../../../hooks/useLoader.js';
import CustomLoader from '../../../Patient/FormsUI/CustomLoader';

import { useTheme } from '@mui/material/styles';
import '../../../../css/loader.css';
import { jwtDecode } from 'jwt-decode';
import customAxios from 'views/Patient/FormsUI/CustomAxios/index.js';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ============================|| FIREBASE - LOGIN ||============================ //

const Login = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);

  const { loading, startLoading, stopLoading } = useLoader();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: 'admin',
          password: '123456',
          submit: null
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              startLoading();

              const postData = {
                userId: values.email,
                password: values.password
              };
              // Making the POST request using Axios
              customAxios
                .post(urlLogin, null, {
                  params: postData,
                  headers: {
                    'Content-Type': 'application/json' // Replace with the appropriate content type if needed
                    // Add any other required headers here
                  }
                })
                .then((response) => {
                  // Handle the response data here
                  console.log('Response:', response.data);
                  stopLoading();
                  //alert(JSON.stringify(response.data));
                  if (response.data.header.userContext.isAuthenticated == true) {
                    const token = response.data;
                    sessionStorage.setItem('authToken', token.data);
                    const token1 = sessionStorage.getItem('authToken');
                    navigate('/dashboard');
                    // const isuser = isUserAuthenticated();

                    const decodedToken = jwtDecode(token1);
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp <= currentTime) {
                      // Token has expired, log the user out
                      alert('session close');
                      sessionStorage.removeItem('authToken'); // Remove the token
                    }
                  } else {
                    toast.error('Invalid Login Credentials');
                    stopLoading();
                  }
                })
                .catch((error) => {
                  // Handle errors here
                  stopLoading();
                  console.error('Error:', error);
                  navigate('/error');
                });
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                sx={{ height: '40px' }} // Adjust the width to make it smaller
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                sx={{ height: '40px' }} // Adjust the width to make it smaller
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              />
              <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <CustomLoader loading={loading} color="#007bff" size={15} />

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
