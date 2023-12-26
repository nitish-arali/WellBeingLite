import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { useEffect, useState } from 'react';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(getSessionTimeRemaining());

  useEffect(() => {
    // Update session time remaining every second
    const interval = setInterval(() => {
      setSessionTimeRemaining(getSessionTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  function getSessionTimeRemaining() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return 'Session expired';

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp > currentTime) {
      const timeRemaining = decodedToken.exp - currentTime;

      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      const seconds = Math.round(timeRemaining % 60);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return 'Session expired';
    }
  }
  function getSessionTimeRemainingColor(sessionTimeRemaining) {
    if (sessionTimeRemaining === 'Session expired') {
      return '#e5554e'; // Red color for expired session
    } else {
      return '#1E88E5'; // Green color for active session
    }
  }

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          paddingTop: '0px',
          borderRadius: '5px',
          width: '150px',
          boxShadow: '0 1px 2px 0 rgba(1, 1, 1, 0.4)',
          height: 'auto',
          textAlign: 'center',
          background: '#f1f1f1',
          margin: 'auto'
        }}
      >
        <div
          style={{
            backgroundColor: getSessionTimeRemainingColor(sessionTimeRemaining),
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            padding: '5px',
            borderRadius: '5px 5px 0 0',
            fontSize: '20px',
            fontWeight: '700'
          }}
        >
          {sessionTimeRemaining}
        </div>
        <div style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Session  time</div>
      </Box>
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
