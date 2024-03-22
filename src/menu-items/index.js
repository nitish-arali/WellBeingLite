import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import patient from './patient';
import laboratory from './laboratory';
import billing from './billing';
import master from './master';
import queueManagement from './queueManagement';
import purchaseOrder from './purchaseOrder';
//import templatemaster from './templatemaster';

// ==============================|| MENU ITEMS ||============================== //

const leftMenuitems = {
  id: 'leftMenu',
  type: 'group',
  children: [
    {
      id: 1,
      title: 'Masters',
      type: 'collapse',
      icon: null,
      children: [
        {
          id: 15,
          title: 'General Master',
          type: 'collapse',
          icon: null,
          children: [
            {
              id: 20,
              title: 'Lookup',
              type: 'item',
              icon: null,
              children: [],
              url: '/Master',
              target: false,
              breadcrumbs: false
            },
            {
              id: 21,
              title: 'User Registration',
              type: 'item',
              icon: null,
              children: [],
              url: '',
              target: false,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 16,
          title: 'Account Management',
          type: 'collapse',
          icon: null,
          children: [
            {
              id: 41,
              title: 'Services',
              type: 'item',
              icon: null,
              children: [],
              url: '/Services',
              target: false,
              breadcrumbs: false
            }
          ],
          url: '',
          target: false,
          breadcrumbs: false
        },
        {
          id: 17,
          title: 'Laboratory Management',
          type: 'collapse',
          icon: null,
          children: [
            {
              id: 42,
              title: 'TemplateMaster',
              type: 'item',
              icon: null,
              children: [],
              url: '/TemplateMaster',
              target: false,
              breadcrumbs: false
            },
            {
              id: 43,
              title: 'SubTestMapping',
              type: 'item',
              icon: null,
              children: [],
              url: '/SubTestMapping',
              target: false,
              breadcrumbs: false
            },
            {
              id: 44,
              title: 'TestMethod',
              type: 'item',
              icon: null,
              children: [],
              url: '/TestMethod',
              target: false,
              breadcrumbs: false
            },
            {
              id: 45,
              title: 'TestReference',
              type: 'item',
              icon: null,
              children: [],
              url: '/TestReference',
              target: false,
              breadcrumbs: false
            },
            {
              id: 49,
              title: 'ContainerDefinitions',
              type: 'item',
              icon: null,
              children: [],
              url: '/ContainerDefinitions',
              target: false,
              breadcrumbs: false
            }
          ],
          url: '',
          target: false,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 2,
      title: 'Identity management',
      type: 'collapse',
      icon: null,
      children: [
        {
          id: 18,
          title: 'Patient Registration',
          type: 'item',
          icon: null,
          children: [],
          url: '/Patient',
          target: false,
          breadcrumbs: false
        },
        {
          id: 19,
          title: 'Encounter Creation',
          type: 'item',
          icon: null,
          children: [],
          url: '',
          target: false,
          breadcrumbs: false
        },
        {
          id: 50,
          title: 'Queue Management',
          type: 'item',
          icon: null,
          children: [],
          url: '/QueueManagement',
          target: false,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 3,
      title: 'Account Management',
      type: 'collapse',
      icon: null,
      children: [
        {
          id: 27,
          title: 'Billing',
          type: 'item',
          icon: null,
          children: [],
          url: '/Billing',
          target: false,
          breadcrumbs: false
        }
      ],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 4,
      title: 'Claim Management',
      type: 'collapse',
      icon: null,
      children: [],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 5,
      title: 'Resource Scheduling',
      type: 'collapse',
      icon: null,
      children: [],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 6,
      title: 'Ward Management',
      type: 'collapse',
      icon: null,
      children: [],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 7,
      title: 'Inventory Management',
      type: 'collapse',
      icon: null,
      children: [
        {
          id: 51,
          title: 'Purchase Order',
          type: 'item',
          icon: null,
          children: [],
          url: '/purchaseOrder',
          target: false,
          breadcrumbs: false
        }
      ],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 10,
      title: 'Pharmacy',
      type: 'collapse',
      icon: null,
      children: [],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 11,
      title: 'Clinical Documents',
      type: 'collapse',
      icon: null,
      children: [],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 12,
      title: 'Laboratory',
      type: 'collapse',
      icon: null,
      children: [
        {
          id: 46,
          title: 'LabDashBoard',
          type: 'item',
          icon: null,
          children: [],
          url: '/LabDashBoard',
          target: false,
          breadcrumbs: false
        },
        {
          id: 47,
          title: 'SampleCollectionSearch',
          type: 'item',
          icon: null,
          children: [],
          url: '/SamplecollectionSearch',
          target: false,
          breadcrumbs: false
        },
        {
          id: 48,
          title: 'ResultentrySearch',
          type: 'item',
          icon: null,
          children: [],
          url: '/ResultentrySearch',
          target: false,
          breadcrumbs: false
        }
      ],
      url: '',
      target: false,
      breadcrumbs: false
    },
    {
      id: 14,
      title: 'Report',
      type: 'collapse',
      icon: null,
      children: [],
      url: '',
      target: false,
      breadcrumbs: false
    }
  ]
};

const menuItems = {
  items: [dashboard, leftMenuitems, patient, master, laboratory, billing, purchaseOrder, queueManagement, pages, utilities, other]
};

export default menuItems;
