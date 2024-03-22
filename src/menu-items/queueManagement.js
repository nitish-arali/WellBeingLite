import { IconUserPlus, IconUsers } from '@tabler/icons';

// constant
const icons = { IconUserPlus, IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const patient = {
  id: 'dashboard',
  title: 'Queue ManageMent',
  type: 'group',
  children: [
    {
      id: 'queueManagement',
      title: 'Queue Management',
      type: 'item',
      url: '/queuemanagement',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
  ]
};

export default patient;
