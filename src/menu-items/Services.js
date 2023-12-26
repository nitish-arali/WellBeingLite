// assets
// import { IconCurrencyDollar } from '@tabler/icons';

// constant
// const icons = { IconCurrencyDollar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const Services= {
  id: 'dashboard',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'Services',
      title: 'Services',
      type: 'item',
      url: '/Services',
    //   icon: icons.IconCurrencyDollar,
      breadcrumbs: false
    }
  ]
};

export default Services;
