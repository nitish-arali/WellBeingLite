import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP ||============================== //

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('authToken')) {
      navigate('/login');
    }
    // Check the token expiration every minute
    const tokenCheckInterval = setInterval(checkTokenExpiration, 30000);
    // Clear the interval when the component unmounts
    return () => clearInterval(tokenCheckInterval);
  }, []);

  function checkTokenExpiration() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp <= currentTime) {
        // Token has expired, log the user out
        alert('Please Login In');
        logout();
      }
    }
  }
  function logout() {
    sessionStorage.removeItem('authToken'); // Remove the token
    //localStorage.removeItem('userData');   // Remove user data or any other stored information
    // Redirect to the login page or perform any other logout-related actions
    navigate('/login'); // Redirect to the login page
  }
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          transition={Flip}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
