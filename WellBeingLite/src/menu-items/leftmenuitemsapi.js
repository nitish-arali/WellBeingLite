



const leftmenuitemsapi=  {
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
                url: '',
                target: false,
                breadcrumbs: false
              },
              {
                id: 21,
                title: 'User Registration',
                type: 'item',
                icon: null,
                children: [],
                url: '/UserRegistration',
                target: false, 
                breadcrumbs: false
              },
              {
                id: 1022,
                title: 'RoleAccess',
                type: 'item',
                icon: null,
                children: [],
                url: '/RoleAccess',
                target: false,
                breadcrumbs: false
              }
            ],
            url: null,
            target: false,
            breadcrumbs: false
          },
          {
            id: 16,
            title: 'Account Management',
            type: 'collapse',
            icon: null,
            children: [
              {
                id: 1023,
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
                id: 1024,
                title: 'TemplateMaster',
                type: 'item',
                icon: null,
                children: [],
                url: '/TemplateMaster',
                target: false,
                breadcrumbs: false
              },
              {
                id: 1025,
                title: "SubTestMapping",
                type: "item",
                icon: null,
                children: [],
                url: "/SubTestMapping",
                target: false,
                breadcrumbs: false
              },
              {
                id: 1026,
                title: "TestMethod",
                type: "item",
                icon: null,
                children: [],
                url: "/TestMethod",
                target: false,
                breadcrumbs: false
              },
              {
                id: 1027,
                title: "TestReference",
                type: "item",
                icon: null,
                children: [],
                url: "/TestReference",
                target: false,
                breadcrumbs: false
              },
              {
                id: 1028,
                title: "ContainerDefinitions",
                type: "item",
                icon: null,
                children: [],
                url: "/ContainerDefinitions",
                target: false,
                breadcrumbs: false
              }
            ],
            url: '',
            target: false,
            breadcrumbs: false
          }
        ],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 2,
        title: "Identity management",
        type: "collapse",
        icon: null,
        children: [
          {
            id: 18,
            title: "Patient Registration",
            type: "item",
            icon:null,
            children: [],
            url: "/Patient",
            target: false,
            breadcrumbs: false
          },
          {
            id: 19,
            title: "Encounter Creation",
            type: "item",
            icon: null,
            children: [],
            url: '',
            target: false,
            breadcrumbs: false
          }
        ],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 3,
        title: "Account Management",
        type: "collapse",
      icon: null,
        children: [
          {
            id: 1029,
            title: "Billing",
            type: "item",
            icon: null,
            children: [],
            url: "/Billing",
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
        title: "Claim Management",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 5,
        title: "Resource Scheduling",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 6,
        title: "Ward Management",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 7,
        title: "Inventory Management",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 10,
        title: "Pharmacy",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 11,
        title: "Clinical Documents",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      },
      {
        id: 12,
        title: "Laboratory",
        type: "collapse",
        icon: null,
        children: [
          {
            id: 1030,
            title: "LabDashBoard",
            type: "item",
            icon: null,
            children: [],
            url: "/LabDashBoard",
            target: false,
            breadcrumbs: false
          },
          {
            id: 1031,
            title: "SamplecollectionSearch",
            type: "item",
            icon: null,
            children: [],
            url: "/SamplecollectionSearch",
            target: false,
            breadcrumbs: false
          },
          {
            id: 1032,
            title: "ResultentrySearch",
            type: "item",
            icon: null,
            children: [],
            url: "/ResultentrySearch",
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
        title: "Report",
        type: "collapse",
        icon: null,
        children: [],
        url: '',
        target: false,
        breadcrumbs: false
      }
    ]
  };

  export default leftmenuitemsapi;