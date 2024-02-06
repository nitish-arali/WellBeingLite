// assets
import { IconMicroscope } from '@tabler/icons';

// constant
const icons = { IconMicroscope };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const laboratory = {
  id: 'dashboard',
  title: 'Laboratory',
  type: 'group',
  children: [
    {
      id: 'laboratory',
      title: 'Laboratory',
      type: 'item',
      url: '/laboratory',
      icon: icons.IconMicroscope,
      breadcrumbs: false
    }
  ]
};

export default laboratory;
