import { lazy } from 'react';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const Patient = Loadable(lazy(() => import('views/Patient/Patient')));
const Laboratory = Loadable(lazy(() => import('views/Laboratory/Laboratory')));
const Billing = Loadable(lazy(() => import('views/Billing/Billing')));
const Master = Loadable(lazy(() => import('views/Master/Master')));
const Services = Loadable(lazy(() => import('views/Services/Services')));
const TemplateMaster = Loadable(lazy(() => import('views/TemplateMaster/TemplateMaster')));
const SubTestMapping = Loadable(lazy(() => import('views/SubTestMapping/SubTestMapping')));
const TestMethod = Loadable(lazy(() => import('views/TestMethod/TestMethod')));
const TestReference = Loadable(lazy(() => import('views/TestReference/TestReference')));
const ContainerDefinitions = Loadable(lazy(() => import('views/ContainerDefinitions/ContainerDefinitions')));
const LabDashBoard = Loadable(lazy(() => import('views/LabDashBoard/LabDashBoard')));
const SamplecollectionSearch = Loadable(lazy(() => import('views/SamplecollectionSearch/SamplecollectionSearch')));
const ResultentrySearch = Loadable(lazy(() => import('views/ResultentrySearch/ResultentrySearch')));
const ResultentryIndex = Loadable(lazy(() => import('views/ResultentryIndex/ResultentryIndex')));
const SampleCollectionIndex = Loadable(lazy(() => import('views/SampleCollectionIndex/SampleCollectionIndex')));
const QueueManagement = Loadable(lazy(() => import('views/QueueManagement/QueueManagement')));
const NewPatient = Loadable(lazy(() => import('views/Patient/FormsUI/NewPatient')));
const NewVisit = Loadable(lazy(() => import('views/Patient/FormsUI/NewVisit')));
const Vitals = Loadable(lazy(() => import('views/QueueManagement/Vitals')));
const PurchaseOrder = Loadable(lazy(() => import('views/InventoryManagement/PurchaseOrder')));
const CreatePurchaseOrder = Loadable(lazy(() => import('views/InventoryManagement/CreatePurchaseOrder')));
const Edit = Loadable(lazy(() => import('views/Patient/FormsUI/EditRegistrationDetails/index')));
const BillingCreate = Loadable(lazy(() => import('views/Billing/BillingCreate')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'patient',
      children: [
        {
          path: '/patient',
          element: <Patient />
        },
        {
          path: 'Edit', // This is the new path for /Patient/Edit
          element: <Edit /> // Replace this with your component for editing a patient
        }
      ]
    },
    {
      path: 'Master/:patientId/:encounterId',
      element: <Master />
    },
    {
      path: 'NewPatient',
      element: <NewPatient />
    },
    {
      path: 'NewVisit',
      element: <NewVisit />
    },
    {
      path: 'queueManagement',
      element: <QueueManagement />
    },
    {
      path: 'CreatePurchaseOrder',
      element: <CreatePurchaseOrder />
    },
    {
      path: 'vitals',
      element: <Vitals />
    },

    {
      path: 'SampleCollectionIndex/:patientId/:encounterId/:labnumber',
      element: <SampleCollectionIndex />
    },
    {
      path: 'ResultentryIndex/:patientId/:encounterId/:labnumber',
      element: <ResultentryIndex />
    },
    {
      path: 'laboratory',
      children: [
        {
          path: 'laboratory',
          element: <Laboratory />
        }
      ]
    },
    {
      path: 'billing',
      children: [
        {
          path: '/billing',
          element: <Billing />
        },
        {
          path: 'Create',
          element: <BillingCreate />
        }
      ]
    },
    {
      path: 'purchaseOrder',
      children: [
        {
          path: '/purchaseOrder',
          element: <PurchaseOrder />
        }
      ]
    },
    {
      path: 'Services',
      children: [
        {
          path: '/Services',
          element: <Services />
        }
      ]
    },
    {
      path: 'TemplateMaster',
      children: [
        {
          path: '/TemplateMaster',
          element: <TemplateMaster />
        }
      ]
    },
    {
      path: 'SubTestMapping',
      children: [
        {
          path: '/SubTestMapping',
          element: <SubTestMapping />
        }
      ]
    },
    {
      path: 'LabDashBoard',
      children: [
        {
          path: '/LabDashBoard',
          element: <LabDashBoard />
        }
      ]
    },
    {
      path: 'TestMethod',
      children: [
        {
          path: '/TestMethod',
          element: <TestMethod />
        }
      ]
    },
    {
      path: 'TestReference',
      children: [
        {
          path: '/TestReference',
          element: <TestReference />
        }
      ]
    },
    {
      path: 'ContainerDefinitions',
      children: [
        {
          path: '/ContainerDefinitions',
          element: <ContainerDefinitions />
        }
      ]
    },
    {
      path: 'SamplecollectionSearch',
      children: [
        {
          path: '/SamplecollectionSearch',
          element: <SamplecollectionSearch />
        }
      ]
    },
    {
      path: 'ResultentrySearch',
      children: [
        {
          path: '/ResultentrySearch',
          element: <ResultentrySearch />
        }
      ]
    },

    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <Patient />
    }
  ]
};

export default MainRoutes;
