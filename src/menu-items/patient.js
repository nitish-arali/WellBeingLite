// assets
import { IconUserPlus,IconUsers } from '@tabler/icons';

// constant
const icons = { IconUserPlus,IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const patient = {
  id: 'dashboard',
  title: 'Patient',
  type: 'group',
  children: [
    {
      id: 'patient',
      title: 'Patient',
      type: 'item',
      url: '/patient',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
   
  ]
};

export default patient;
