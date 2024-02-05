// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const menu = useSelector((state) => state.customization);
  console.log('store', menu.leftMenuItems);
  console.log('og', menuItem);
  const sessionMenuItems = JSON.parse(sessionStorage.getItem('leftmenu'));
  console.log('session', sessionMenuItems);

  // const navItems = menu.leftMenuItems.items.map((item, index) => {

  if (sessionMenuItems) {
    const navItems = sessionMenuItems.items.map((item, index) => {
      switch (item.type) {
        case 'group':
          return <NavGroup key={index} item={item} />;
        default:
          return (
            <Typography key={index} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

    return <>{navItems}</>;
  } else {
    const navItems = menu.leftMenuItems.items.map((item, index) => {
      switch (item.type) {
        case 'group':
          return <NavGroup key={index} item={item} />;
        default:
          return (
            <Typography key={index} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

    return <>{navItems}</>;
  }
};

export default MenuList;
