import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import patient from './patient';
import laboratory from './laboratory';
import billing from './billing'; 
import master from './master';
//import templatemaster from './templatemaster';

// ==============================|| MENU ITEMS ||============================== //

const leftMenuitems = JSON.parse(sessionStorage.getItem('leftmenu'));

const menuItems = {
  items: [dashboard,leftMenuitems, patient, master, laboratory, billing, pages, utilities, other]
};

export default menuItems;
