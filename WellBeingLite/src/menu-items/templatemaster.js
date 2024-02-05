// assets
import { IconCurrencyDollar } from '@tabler/icons';

// constant
const icons = { IconCurrencyDollar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const templatemaster = {
  id: 'dashboard',
  title: 'TemplateMaster',
  type: 'group',
  children: [
    {
      id: 'templatemaster',
      title: 'TemplateMaster',
      type: 'item',
      url: '/TemplateMaster',
      icon: icons.IconCurrencyDollar,
      breadcrumbs: false
    }
  ]
};

export default templatemaster;
