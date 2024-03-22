// assets
import { IconCurrencyDollar } from '@tabler/icons';

// constant
const icons = { IconCurrencyDollar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const purchaseOrder = {
  id: 'dashboard',
  title: 'Purchase Order',
  type: 'group',
  children: [
    {
      id: 'purchaseOrder',
      title: 'Purchase Order',
      type: 'item',
      url: '/PurchaseOrder',
      icon: icons.IconCurrencyDollar,
      breadcrumbs: false
    }
  ]
};

export default purchaseOrder;
