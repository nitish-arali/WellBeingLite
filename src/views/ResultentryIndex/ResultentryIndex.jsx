import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'views/Patient/FormsUI/Button';
import MuiButton from '@mui/material/Button';
//import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Container } from '@mui/system';
import { TextField } from '@mui/material';
import BackButton from '@mui/icons-material/KeyboardBackspace';

import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form } from 'formik';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import {
  urlResultEntryIndex,
  urlGetPatientHeaderWithPatientIAndEncounterId,
  urlLoadTestReferenceForResEntry,
  urlGetSelectedTestDataForResEntered,
  urlSaveTestsResultEntry,
  urlSaveSampleColResult,
  urlLoadTestMethodGridData,
  urlLoadTestReferenceGrid,
  urlGetSelectedTestDataForResEntry,
  urlGetTemplateDataByTemplateId
} from 'endpoints.ts';
//import CustomAutocomplete from 'views/Patient/FormsUI/Autocomplete';
import GeneralAutoComplete from 'views/Patient/FormsUI/GeneralAutoComplete';
import PatientHeaderSingle from 'views/Patient/FormsUI/PatientHeaderSingle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import { TableContainer, Paper } from '@mui/material';
//import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import * as Yup from 'yup';
//import Select from 'views/Patient/FormsUI/Select';
import { makeStyles } from '@mui/styles';
import TextField1 from 'views/Patient/FormsUI/Textfield/index.js';
import { Select, MenuItem } from '@mui/material';
//import Select from 'views/Patient/FormsUI/Select';
import { useNavigate } from 'react-router';
import CKEditorComponent from 'views/Patient/FormsUI/CKEditorComponent';
const CustomCheckbox = ({ checked, onChange }) => <input type="checkbox" checked={checked} onChange={onChange} />;
const ResultentryIndex = () => {
  const { patientId, encounterId, labnumber } = useParams();
  const [patientdata, setPatientdata] = useState(null);
  const [genderId, setGenderId] = useState([]);
  const [patientAge, setPatientAge] = useState([]);
  const [listTestMethodModel, setListTestMethodModel] = useState([]);
  const [chargeDetails, setChargeDetails] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadTableGrid, setloadTableGrid] = useState([]);
  const [refereneces, setReferences] = useState([]);
  const navigate = useNavigate();
  const [refrangedesc, setRefrangedesc] = useState([]);
  const [referenceRange, setReferenceRange] = useState([]);
  const [methodId, setMethodId] = useState([]);
  const [methodsByTestId, setMethodsByTestId] = useState({});
  const [editorData, setEditorData] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateTid, setTemplateTid] = useState([]);
  const [chargeId, setChargeId] = useState([]);
  //const [selectedMethodValues, setSelectedMethodValues] = useState({});
  const [selectedMethodValues, setSelectedMethodValues] = useState({
    // other values...
    default: 'NoMethod' // add this line
  });
  const [initialFormState, setInitialFormState] = useState({
    // TestReference:''
  });
  // const FORM_VALIDATION = Yup.object().shape({

  //     TestReference: Yup.string().required('required'),
  //   });

  // const styles = {
  //   abnormalResult: {
  //     border: '5px solid red' // Change this to the desired color
  //     // Add other styles as needed
  //   },
  //   normalResult: {
  //     backgroundColor: 'white' // Change this to the desired color
  //     // Add other styles as needed
  //   }
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data.EncounterModel;
          setPatientdata(patientdetail);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [patientId, encounterId]);

  const fetchChargeDetails = async () => {
    try {
      debugger;
      const response = await customAxios.get(
        `${urlResultEntryIndex}?PatientId=${patientId}&EncounterId=${encounterId}&SelclabId=${labnumber}`
      );
      if (response.status === 200) {
        const testdetails = response.data.data.ListOfSamplColTests;
        const age = response.data.data.PatientAge;
        const gender = response.data.data.GenderId;
        // const testmethods = response.data.data.ListTestMethodModel;

        setChargeDetails(testdetails);
        setPatientAge(age);
        setGenderId(gender);

        //  setListTestMethodModel(testmethods);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChargeDetails();
  }, [patientId, encounterId, labnumber]);

  const handleSelectionChange = (newSelection) => {
    debugger;

    // Check if the new selection is not empty
    if (newSelection.length > 0) {
      const selectedId = newSelection[0];

      // Check if the row is already selected
      const isSelected = selectedRows.some((row) => row.SmpColHeaderId === selectedId);

      // If it is selected, uncheck it; otherwise, uncheck the previously selected row and check the new one
      const newSelectedRows = isSelected ? [] : [{ SmpColHeaderId: selectedId }];

      console.log(
        'Selected IDs:',
        newSelectedRows.map((row) => row.SmpColHeaderId)
      );
      const selectedRowsData = newSelection
        .map((selectedId) => chargeDetails.find((row) => row.SmpColHeaderId === selectedId))
        .filter(Boolean);

      console.log('Selected Rows Data:', selectedRowsData);

      // Update the state with the new selection
      setSelectedRows(newSelectedRows);
      if (isSelected == true) {
        setloadTableGrid([]);
        setSelectedRows([]);
        setSelectedMethodValues([]);
        setRefrangedesc([]);
      } else {
        if (selectedRowsData[0].IsResultEntryDone == true) {
          LoadAlreadyResEnteredTests(selectedRowsData[0].TestId, selectedRowsData[0].ChargeId);
        } else {
          LoadResEntryGridBasedOnTestId(selectedRowsData[0].TestId, selectedRowsData[0].ChargeId, selectedRowsData[0].LabStatusId);
          setSelectedMethodValues([]);
          setRefrangedesc([]);
        }
      }
    } else {
      // If newSelection is empty, clear the selected rows
      setSelectedRows([]);
      setloadTableGrid([]);
      setSelectedMethodValues([]);
      setRefrangedesc([]);
    }
  };
  const useStyles = makeStyles((theme) => ({
    formWrapper: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(8)
    },
    dialog: {
      width: '70%', // Set the width
      height: '70%' // Set the height
    }
  }));
  const classes = useStyles();

  const LoadResEntryGridBasedOnTestId = async (TestId, ChargeId, LabStatusId) => {
    debugger;
    try {
      if (TestId > 0 && ChargeId > 0 && LabStatusId > 0) {
        const GetSelectedTestDataForResEntry = await customAxios.get(
          `${urlGetSelectedTestDataForResEntry}?TestId=${TestId}&ChargeId=${ChargeId}&LabstatusId=${LabStatusId}&GenderId=${patientdata.Gender}`
        );
        if (GetSelectedTestDataForResEntry.data && Array.isArray(GetSelectedTestDataForResEntry.data.data.ResultEntryList)) {
          setloadTableGrid(GetSelectedTestDataForResEntry.data.data.ResultEntryList);
          // Iterate over the ResultEntryList and call LoadmethodsForSelectedTest for each TestId
          for (const entry of GetSelectedTestDataForResEntry.data.data.ResultEntryList) {
            if (!entry.IsFromTestValues) {
              await LoadmethodsForSelectedTest(entry.TestId, null);
            }
          }
          // Call LoadReferenceForSelectedTest for each TestId
          for (const entry of GetSelectedTestDataForResEntry.data.data.ResultEntryList) {
            // Check if IsFromTestValues is true
            if (entry.IsFromTestValues) {
              // Use ResultEntryList.NormalValForTestVal directly
              setRefrangedesc((prevMap) => ({
                ...prevMap,
                [entry.TestId]: entry.NormalValForTestVal
              }));
            } else {
              // Continue with the existing logic if IsFromTestValues is false
              const references = await LoadReferenceForSelectedTest(entry.TestId, methodId, genderId);
              if (references != null) {
                const matchingref = GetMatchingTestReference(references);
                if (matchingref != undefined && matchingref != '' && matchingref.length > 0) {
                  if (matchingref[0].OperatorType == '<>') {
                    setReferenceRange(matchingref[0].Low + '-' + matchingref[0].High);
                    // Update refrangedescMap for the current TestId
                    setRefrangedesc((prevMap) => ({
                      ...prevMap,
                      [entry.TestId]: matchingref[0].Description
                    }));
                  } else {
                    setReferenceRange(matchingref[0].OperatorType + ' ' + matchingref[0].Low);
                    // Update refrangedescMap for the current TestId
                    setRefrangedesc((prevMap) => ({
                      ...prevMap,
                      [entry.TestId]: matchingref[0].Description
                    }));
                  }
                }
              }
            }
          }
        } else {
          setloadTableGrid([]);
        }
      } else {
        setloadTableGrid([]);
      }
    } catch (error) {
      console.error('Error fetching visits data:', error);
      setloadTableGrid([]);
    }
  };

  const LoadAlreadyResEnteredTests = async (TestId, ChargeId) => {
    debugger;
    try {
      if (TestId > 0 && ChargeId > 0) {
        const GetSelectedTestDataForResEntry = await customAxios.get(
          `${urlGetSelectedTestDataForResEntered}?TestId=${TestId}&ChargeId=${ChargeId}&PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (GetSelectedTestDataForResEntry.data && Array.isArray(GetSelectedTestDataForResEntry.data.data.ResultEntryList)) {
          setloadTableGrid(GetSelectedTestDataForResEntry.data.data.ResultEntryList);

          // Iterate over the ResultEntryList and call LoadmethodsForSelectedTest for each TestId
          for (const entry of GetSelectedTestDataForResEntry.data.data.ResultEntryList) {
            //await LoadmethodsForSelectedTest(entry.TestId, entry.MethodsID);
            if (!entry.IsFromTestValues) {
              await LoadmethodsForSelectedTest(entry.TestId, entry.MethodsID);
            }
          }

          // Call LoadReferenceForSelectedTest for each TestId
          for (const entry of GetSelectedTestDataForResEntry.data.data.ResultEntryList) {
            if (entry.IsFromTestValues) {
              // Use ResultEntryList.NormalValForTestVal directly
              setRefrangedesc((prevMap) => ({
                ...prevMap,
                [entry.TestId]: entry.NormalValForTestVal
              }));
            }
            const references = await LoadReferenceForSelectedTest(entry.TestId, entry.MethodsID, genderId);
            if (references != null) {
              const matchingref = GetMatchingTestReference(references);
              if (matchingref != undefined && matchingref != '' && matchingref.length > 0) {
                if (matchingref[0].OperatorType == '<>') {
                  setReferenceRange(matchingref[0].Low + '-' + matchingref[0].High);
                  // Update refrangedescMap for the current TestId
                  setRefrangedesc((prevMap) => ({
                    ...prevMap,
                    [entry.TestId]: matchingref[0].Description
                  }));
                } else {
                  setReferenceRange(matchingref[0].OperatorType + ' ' + matchingref[0].Low);
                  // Update refrangedescMap for the current TestId
                  setRefrangedesc((prevMap) => ({
                    ...prevMap,
                    [entry.TestId]: matchingref[0].Description
                  }));
                }
              }
            }
          }
        } else {
          setloadTableGrid([]);
        }
      } else {
        setloadTableGrid([]);
      }
    } catch (error) {
      console.error('Error fetching visits data:', error);
      setloadTableGrid([]);
    }
  };

  const LoadmethodsForSelectedTest = async (TestId, MethodId) => {
    debugger;
    try {
      const response = await customAxios.get(`${urlLoadTestMethodGridData}?TestId=${TestId}`);
      if (response.status === 200) {
        const testmethods = response.data.data.ListTestMethodModel;

        // Update the state to store methods for the current TestId
        setMethodsByTestId((prevMethods) => ({
          ...prevMethods,
          [TestId]: testmethods
        }));
        // If MethodId is available, set the selected method value
        if (MethodId && !selectedMethodValues[TestId]) {
          setSelectedMethodValues((prevValues) => ({
            ...prevValues,
            [TestId]: MethodId
          }));
        }
      } else {
        console.error('Failed to fetch test methods');
      }
    } catch (error) {
      console.error('Error fetching test methods:', error);
    }
  };

  const LoadReferenceForSelectedTest = async (TestId, MethodID, genderId) => {
    debugger;
    if (MethodID == null) {
      MethodID = '';
    }
    try {
      const response = await customAxios.get(
        `${urlLoadTestReferenceForResEntry}?TestId=${TestId}&TestMethodId=${MethodID}&GenderId=${genderId}`
      );

      if (response.status === 200) {
        const testListReferences = response.data.data.ListTestReferenceModel;
        return testListReferences;
      } else {
        console.error('Failed to fetch test references');
        return []; // or handle error as needed
      }
    } catch (error) {
      console.error('Error fetching test references:', error);
      throw error; // Throw the error to be caught by the calling code
    }
  };

  function GetMatchingTestReference(references) {
    debugger;
    if (references !== undefined && references !== null && references.length > 0) {
      let Year;
      let Month;
      let days;

      if (patientAge !== undefined && patientAge !== '') {
        const ageArray = patientAge.split(' ');

        if (ageArray.length > 0) {
          Year = ageArray[0];
          Month = ageArray[1];
          days = ageArray[2];

          Year = Year.slice(0, -1);
          Month = Month.slice(0, -1);
          days = days.slice(0, -1);

          if (Year !== undefined && Year !== '' && parseInt(Year) > 0) {
            const YearsList = references.filter((f) => f.PeriodName === 'Years');

            if (YearsList !== undefined && YearsList.length > 0) {
              const yearsRes = YearsList.filter((f) => parseInt(f.FromAge) <= Year && parseInt(f.ToAge) >= Year);
              return yearsRes;
            } else {
              return '';
            }
          } else if (Month !== undefined && Month !== '' && parseInt(Month) > 0) {
            const monthsList = references.filter((f) => f.PeriodName === 'Months');

            if (monthsList !== undefined && monthsList.length > 0) {
              const monthsRes = monthsList.filter((f) => parseInt(f.FromAge) <= Month && parseInt(f.ToAge) >= Month);
              return monthsRes;
            } else {
              return '';
            }
          } else {
            const daysList = references.filter((f) => f.PeriodName === 'Days');

            if (daysList !== undefined && daysList.length > 0) {
              const daysRes = daysList.filter((f) => parseInt(f.FromAge) <= days && parseInt(f.ToAge) >= days);
              return daysRes;
            } else {
              return '';
            }
          }
        }
      }
    } else {
      return '';
    }
  }

  const handleTemplateClick = async (testId, ChargeId) => {
    debugger;

    const row = loadTableGrid.find((item) => item.ChargeId === ChargeId);
    const TempID = row.TemplateId;
    setTemplateTid(TempID);
    setChargeId(ChargeId);
    if (row.ResId > 0) {
      setEditorData(row.ObservedValues);
      setDialogOpen(true);
    } else {
      try {
        const response = await customAxios.get(`${urlGetTemplateDataByTemplateId}?Tid=${TempID}`);

        if (response.status === 200) {
          const testListReferences = await response.data.data.TempData;
          setEditorData(testListReferences);
          setDialogOpen(true);
        } else {
          console.error('Failed to fetch test references');
          setTemplateTid([]);
          setEditorData('');
          return []; // or handle error as needed
        }
      } catch (error) {
        setTemplateTid([]);
        setEditorData('');
        console.error('Error fetching test references:', error);
        throw error; // Throw the error to be caught by the calling code
      }
    }
  };

  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  const SaveTemplate = async () => {
    try {
      // Update the ResultEntryList by mapping over it
      const updatedResultEntryList = loadTableGrid.map((entry) => {
        if (entry.ChargeId === chargeId) {
          const updatedEntry = { ...entry, ObservedValues: editorData };

          return updatedEntry;
        }
        return entry;
      });

      // Update the state with the new ResultEntryList
      setloadTableGrid(updatedResultEntryList);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error deleting SubTest:', error);
      toast.error('Error deleting SubTest.');
    } finally {
      // setDeleteDialogOpen(false);
      // setReferenceIdToDelete(null);
    }
  };

  const CancelTemplate = () => {
    setDialogOpen(false);
    //setSubTestIdToDelete(null);
  };

  const handleObservedValueChange = (TestId, newValue) => {
    debugger;

    // Update the ResultEntryList by mapping over it
    const updatedResultEntryList = loadTableGrid.map((entry) => {
      if (entry.TestId === TestId) {
        const updatedEntry = { ...entry, ObservedValues: newValue };

        // Check condition for IsFromTestValues and ObservedValues
        if (updatedEntry.IsFromTestValues && updatedEntry.ObservedValues === updatedEntry.NormalValForTestVal) {
          // If the condition is true, set IsResultNormal to true
          return { ...updatedEntry, IsResultNormal: true };
        } else {
          // If the condition is false, set IsResultNormal to false
          return { ...updatedEntry, IsResultNormal: false };
        }
      }
      return entry;
    });

    // Update the state with the new ResultEntryList
    setloadTableGrid(updatedResultEntryList);

    // Conditionally call validateResult based on IsFromTestValues
    if (!updatedResultEntryList.find((entry) => entry.TestId === TestId)?.IsFromTestValues) {
      validateResult(TestId, newValue);
    }
  };

  const validateResult = async (TestId, newValue) => {
    debugger;
    try {
      // Assuming refrangedesc is already loaded in the state
      const refrangedescForTestId = refrangedesc[TestId] || '';
      const matchingRow = loadTableGrid.find((row) => row.TestId === TestId);
      const isValid = IsResultWithinRefRange(newValue, refrangedescForTestId);

      // // Update the state with the new isNormal value
      setloadTableGrid((prevGrid) => {
        return prevGrid.map((entry) => {
          if (entry.TestId === TestId) {
            return { ...entry, IsResultNormal: isValid ? true : false };
          }
          return entry;
        });
      });
    } catch (error) {
      console.error('Error validating result:', error);
    }
  };

  const IsResultWithinRefRange = (newValue, refrange) => {
    debugger;
    if (refrange && refrange !== '') {
      const resval = newValue;
      let result = false;

      if (refrange.includes('-')) {
        const [low, high] = refrange.split('-').map(parseFloat);
        result = resval >= low && resval <= high;
      } else {
        const [operator, compareVal] = refrange.split(' ');
        switch (operator) {
          case '<':
            result = resval < parseFloat(compareVal);
            break;
          case '>':
            result = resval > parseFloat(compareVal);
            break;
          case '<=':
            result = resval <= parseFloat(compareVal);
            break;
          case '>=':
            result = resval >= parseFloat(compareVal);
            break;
          case '==':
            result = resval === parseFloat(compareVal);
            break;
          case '!=':
            result = resval !== parseFloat(compareVal);
            break;
          default:
            result = true;
        }
      }

      return result;
    } else {
      return true;
    }
  };
  const handlemethodValueChange = async (rowId, newValue) => {
    debugger;
    const matchingRow1 = loadTableGrid.find((row) => row.TestId === rowId);
    // Update the state to store the selected value for the specific row
    setSelectedMethodValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [rowId]: newValue
    }));
    if (newValue == 'NoMethod') {
      newValue = methodId;
    }

    const references = await LoadReferenceForSelectedTest(rowId, newValue, genderId);
    if (references.length > 0) {
      if (references != null) {
        const matchingref = GetMatchingTestReference(references);

        if (matchingref != undefined && matchingref.length > 0) {
          if (matchingref[0].OperatorType == '<>') {
            setReferenceRange(matchingref[0].Low + '-' + matchingref[0].High);
          } else {
            setReferenceRange(matchingref[0].OperatorType + ' ' + matchingref[0].Low);
          }

          // Update refrangedescMap for the current TestId
          setRefrangedesc((prevMap) => ({
            ...prevMap,
            [rowId]: matchingref[0].Description
          }));

          const isValid = IsResultWithinRefRange(matchingRow1.ObservedValues, matchingref[0].Description || '');

          // // Update the state with the new isNormal value
          setloadTableGrid((prevGrid) => {
            return prevGrid.map((entry) => {
              if (entry.TestId === rowId) {
                return { ...entry, IsResultNormal: isValid ? true : false };
              }
              return entry;
            });
          });
        } else {
          // If matchingref is empty, set refrangedesc as empty for the specific rowId
          setRefrangedesc((prevMap) => ({
            ...prevMap,
            [rowId]: ''
          }));
          setloadTableGrid((prevGrid) => {
            return prevGrid.map((entry) => {
              if (entry.TestId === rowId) {
                return { ...entry, IsResultNormal: true };
              }
              return entry;
            });
          });
        }
      } else {
        // If references is null, set refrangedesc as empty for the specific rowId
        setRefrangedesc((prevMap) => ({
          ...prevMap,
          [rowId]: ''
        }));
        setloadTableGrid((prevGrid) => {
          return prevGrid.map((entry) => {
            if (entry.TestId === rowId) {
              return { ...entry, IsResultNormal: true };
            }
            return entry;
          });
        });
      }
    } else {
      // If references is null, set refrangedesc as empty for the specific rowId
      setRefrangedesc((prevMap) => ({
        ...prevMap,
        [rowId]: ''
      }));
      setloadTableGrid((prevGrid) => {
        return prevGrid.map((entry) => {
          if (entry.TestId === rowId) {
            return { ...entry, IsResultNormal: true };
          }
          return entry;
        });
      });
    }

    // You don't need to update listTestMethodModel here
  };

  const columns = [
    {
      field: 'checkbox',
      headerName: '',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) =>
        params.row.IsSampleCollected ? (
          <CustomCheckbox
            checked={selectedRows.some((row) => row.SmpColHeaderId === params.row.SmpColHeaderId)}
            onChange={() => handleSelectionChange([params.row.SmpColHeaderId])}
          />
        ) : null
    },
    {
      field: 'TestName',
      headerClassName: 'super-app-theme--header',
      headerClassName: 'super-app-theme--header',
      headerName: 'Test Name',
      flex: 1
    },
    { field: 'PatientNetAmount', headerName: 'Amount', headerClassName: 'super-app-theme--header', flex: 1 },
    { field: 'LabNumber', headerName: 'Lab Number', headerClassName: 'super-app-theme--header', flex: 1 }
  ];

  const columns1 = [
    { field: 'TestName', headerName: 'Test Name', headerClassName: 'super-app-theme--header', flex: 1 },

    {
      field: 'ObservedValues',
      headerName: 'Observed Value',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) =>
        params.row.IsProfileTest ? (
          <div></div>
        ) : params.row.IsTemplateTest ? (
          <a href="#" onClick={() => handleTemplateClick(params.row.TestId, params.row.ChargeId)}>
            Template
          </a>
        ) : params.row.IsFromTestValues ? (
          <Select
            style={{ width: '100%', height: '30px', border: params.row.IsResultNormal === false ? '2px solid #ff0000' : '' }}
            size="small"
            value={params.row.ObservedValues ?? ''}
            onChange={(e) => handleObservedValueChange(params.row.TestId, e.target.value)}
          >
            {params.row.TestValues.split('|').map((item, index) => (
              <MenuItem key={index} value={item.trim()}>
                {item.trim()}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField1
            name="ObservedValues"
            value={params.row.ObservedValues ?? ''}
            onChange={(e) => handleObservedValueChange(params.row.TestId, e.target.value)}
            size="small"
            style={{
              border: params.row.IsResultNormal === false ? '5px solid #ff0000' : '',
              borderRadius: '10px',
              overflow: 'hidden',
              height: 'min-content',
              width: '100%',
              flexGrow: 1
            }}
          />
        )
    },
    { field: 'Units', headerName: 'Units', headerClassName: 'super-app-theme--header', flex: 1 },
    {
      field: 'Method',
      headerName: 'Method',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) =>
        params.row.IsProfileTest || params.row.IsTemplateTest ? (
          <div></div>
        ) : (
          <Select
            style={{ width: '100%', size: 'small', height: '30px' }}
            name="Method"
            label="Method"
            size="small"
            value={selectedMethodValues[params.row.TestId] ?? 'NoMethod'}
            onChange={(e) => handlemethodValueChange(params.row.TestId, e.target.value)}
          >
            <MenuItem value="NoMethod">NoMethod</MenuItem>
            {(methodsByTestId[params.row.TestId] || []).map((method) => (
              <MenuItem key={method.TestMethodID} value={method.TestMethodID}>
                {method.MethodName}
              </MenuItem>
            ))}
          </Select>
        )
    },
    {
      field: 'Normal Ranges',
      headerName: 'Normal Ranges',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      renderCell: (params) =>
        params.row.IsProfileTest || params.row.IsTemplateTest ? (
          // Render only the header name for IsProfileTest rows
          <div></div>
        ) : (
          <TextField1 name="NormalRanges" value={refrangedesc[params.row.TestId] ?? ''} disabled style={{ height: 'min-content' }} />
        )
    }
  ];
  const updateLoadTableGrid = (originalLoadTableGrid, refrangedesc, selectedMethodValues) => {
    debugger;
    const updatedLoadTableGrid = originalLoadTableGrid.map((entry) => {
      const refrangedescForTestId = refrangedesc[entry.TestId] || '';
      let methodForTestId = selectedMethodValues[entry.TestId] || '';

      if (methodForTestId === 'NoMethod' || methodForTestId === '') {
        methodForTestId = null;
      }
      return {
        ...entry,
        TestRefDescription: refrangedescForTestId,
        MethodsID: methodForTestId,
        PatientId: patientId,
        EncounterId: encounterId
      };
    });

    return updatedLoadTableGrid;
  };
  const handleSubmit = async (values, { resetForm }) => {
    debugger;
    console.log('data', loadTableGrid);
    if (loadTableGrid.length == 0) {
      toast.warning('Please Select Any One Test.');
    }
    const updatedLoadTableGrid1 = updateLoadTableGrid(loadTableGrid, refrangedesc, selectedMethodValues);
    // Check if any ObservedValues is null or an empty string
    //const hasNullObservedValues = updatedLoadTableGrid1.some(entry => entry.ObservedValues === null || entry.ObservedValues === '');
    const hasNullObservedValues = updatedLoadTableGrid1.some((entry) => {
      // Check if IsProfileTest is false and ObservedValues is null or empty
      return !entry.IsProfileTest && (entry.ObservedValues === null || entry.ObservedValues === '');
    });
    // Show alert if there are null or empty ObservedValues
    if (hasNullObservedValues) {
      //alert('ObservedValues cannot be null or empty.');
      toast.error('ObservedValues cannot be null or empty.');
      return;
    }
    console.log('data', updatedLoadTableGrid1);

    try {
      const response = await customAxios.post(urlSaveTestsResultEntry, updatedLoadTableGrid1, {
        params: {
          PatientAge: patientAge
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.data.Status !== '') {
        var message = response.data.data.Status;
        if (message.includes('Result Entry Saved Successfully.') || message.includes('Result Entry Updated Successfully.')) {
          toast.success(message);
          resetForm();

          setSelectedRows([]);
          setloadTableGrid([]);
          setSelectedMethodValues([]);
          setRefrangedesc([]);
          fetchChargeDetails();
        }
      } else {
        toast.error('Something Went Wrong....');
      }
    } catch (error) {
      alert('errorr');
    }
  };

  const handleButtonClick = (tab) => {
    debugger;
    if (tab == 'SampleCollection') {
      const url = `/SampleCollectionIndex/${patientId}/${encounterId}/${labnumber}`;
      navigate(url);
    } else if (tab == 'Verification') {
      const url = `/VerificationIndex/${patientId}/${encounterId}/${labnumber}`;
      navigate(url);
    }
  };
  const encounterId1 = 0;
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        padding: '0',
        border: '2px solid #ccc',
        borderRadius: '10px',
        paddingBottom: '10px'
      }}
    >
      <Grid container width={'100%'}>
        <Grid item xs={11}>
          <Typography
            variant="h4"
            sx={{
              backgroundColor: '#1E88E5',
              color: 'white',
              padding: '12px',
              borderTopLeftRadius: '10px',
              fontSize: '20px',
              fontWeight: '400'
            }}
          >
            Result Entry
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            backgroundColor: '#1E88E5',

            borderTopRightRadius: '10px',
            fontSize: '15px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            paddingRight: '10px'
          }}
        >
          <IconButton sx={{ color: 'white' }}>
            <BackButton sx={{ fontSize: '30px' }} 
            // onClick={handleBackButton} 
            />
          </IconButton>
        </Grid>
        <Grid item xs={12} sx={{ marginRight: '16px' }}>
          <div className={classes.formWrapper}>
            <Formik
              initialValues={{ ...initialFormState }}
              // validationSchema={FORM_VALIDATION}
              onSubmit={handleSubmit}
            >
              <Form>
                <div style={{ border: '2px solid #ccc', padding: '10px', marginLeft: '16px', borderRadius: '5px' }}>
                  <Grid item xs={12} marginX={'5px'} borderRadius={'10px'}>
                    <div>
                      <PatientHeaderSingle patientdata={patientdata} encounterId={encounterId1} />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} marginLeft={'-10px'}>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('SampleCollection')}>
                          Sample Collection
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="contained" onClick={() => handleButtonClick('ResultEntry')}>
                          Result Entry
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('Verification')}>
                          Verification
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton variant="outlined" onClick={() => handleButtonClick('Report')}>
                          Report
                        </MuiButton>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        // height: 300,
                        width: '100%',
                        '& .super-app-theme--header': {
                          backgroundColor: 'rgba(0, 123, 255, 0.8)',
                          color: 'white', // Set the font color to white or any other color you prefer
                          fontWeight: 'bold' // Optionally, you can set the font weight
                        }
                      }}
                    >
                      <TableContainer component={Paper}>
                        <DataGrid
                          rows={chargeDetails}
                          columns={columns}
                          onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                          getRowClassName={(params) => {
                            return params.row.IsResultEntryDone ? 'highlight' : '';
                          }}
                          getRowHeight={() => 35} // Set the desired height here
                          columnHeaderHeight={35}
                          sx={{
                            marginLeft: '4px',
                            marginRight: '4px',
                            marginTop: '10px',
                            '.highlight': {
                              bgcolor: 'green',
                              color: 'white',
                              fontWeight: 'bold',
                              '&:hover': {
                                bgcolor: 'green'
                              }
                            },
                            '& .MuiDataGrid-cell': {
                              border: '1px solid #ccc',
                              borderBottom: '1px solid #ccc'
                            },
                            '& .MuiDataGrid-columnHeader': {
                              borderLeft: '1px solid #ccc',
                              borderTop: '1px solid #ccc'
                            }
                          }}
                          disableColumnFilter
                          hideFooterPagination
                          hideFooter
                          disableColumnSelector
                          disableDensitySelector
                          disableRowSelectionOnClick
                          slots={{ toolbar: GridToolbar }}
                          getRowId={(row) => row.SmpColHeaderId}
                          slotProps={{
                            toolbar: {
                              showQuickFilter: false,
                              quickFilterProps: { debounceMs: 500 },
                              printOptions: { disableToolbarButton: true },
                              csvOptions: { disableToolbarButton: true }
                            }
                          }}
                        />
                      </TableContainer>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        // height: 300,
                        width: '100%',
                        '& .super-app-theme--header': {
                          backgroundColor: 'rgba(0, 123, 255, 0.8)',
                          color: 'white', // Set the font color to white or any other color you prefer
                          fontWeight: 'bold' // Optionally, you can set the font weight
                        }
                      }}
                    >
                      <TableContainer component={Paper}>
                        <div>
                          <DataGrid
                            autoHeight
                            rows={loadTableGrid}
                            columns={columns1}
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            disableRowSelectionOnClick
                            hideFooterPagination
                            hideFooter
                            slots={{ toolbar: GridToolbar }}
                            getRowId={(row) => row.TestId} // Specify the custom id property here
                            getRowClassName={(params) => {
                              if (params.row.IsProfileTest) {
                                return 'highlight';
                              } else if (!params.row.IsResultNormal) {
                                return 'abnormalResult';
                              }
                              return '';
                            }}
                            getRowHeight={() => 45} // Set the desired height here
                            columnHeaderHeight={35}
                            sx={{
                              marginLeft: '4px',
                              marginRight: '4px',
                              marginTop: '10px',
                              '.highlight': {
                                bgcolor: 'green',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': {
                                  bgcolor: 'green'
                                }
                              },
                              '& .MuiDataGrid-cell': {
                                border: '1px solid #ccc',
                                borderBottom: '1px solid #ccc'
                              },
                              '& .MuiDataGrid-columnHeader': {
                                borderLeft: '1px solid #ccc',
                                borderTop: '1px solid #ccc'
                              }
                              // '.abnormalResult .MuiDataGrid-cell': styles.abnormalResult

                              // '.abnormalResult .MuiDataGrid-cell': {
                              //   border: '2px solid #ff0000'

                              // }
                            }}
                            slotProps={{
                              toolbar: {
                                showQuickFilter: false,
                                quickFilterProps: { debounceMs: 500 },
                                printOptions: { disableToolbarButton: true },
                                csvOptions: { disableToolbarButton: true }
                              }
                            }}
                          />
                        </div>
                      </TableContainer>
                    </Box>
                    <Dialog open={dialogOpen} classes={{ paper: classes.dialog }} maxWidth={false}>
                      <DialogTitle variant="h3">Template</DialogTitle>
                      <DialogContent>
                        <Grid item xs={12}>
                          <CKEditorComponent data={editorData} onChange={handleEditorChange} />
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <MuiButton variant="contained" color="primary" onClick={SaveTemplate}>
                          Save
                        </MuiButton>
                        <MuiButton variant="contained" color="primary" onClick={CancelTemplate}>
                          Cancel
                        </MuiButton>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                  <Grid container display={'flex'} justifyContent={'end'} marginTop={2} marginRight={4}>
                    <Grid item xs={2}>
                      <Button type="submit" style={{ width: '100%' }}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Form>
            </Formik>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultentryIndex;
