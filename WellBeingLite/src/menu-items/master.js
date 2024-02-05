// assets
import { IconUserPlus,IconUsers } from '@tabler/icons';

// constant
const icons = { IconUserPlus,IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const patient = {
  id: 'dashboard',
  title: 'Master',
  type: 'group',
  children: [
    {
      id: 'Master',
      title: 'Master',
      type: 'item',
      url: '/Master',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
   
  ]
};

export default patient;