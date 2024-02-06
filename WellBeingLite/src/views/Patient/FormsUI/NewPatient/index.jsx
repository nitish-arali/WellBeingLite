import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, DatePicker, Divider, notification } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
const { Option } = Select;
import {
  urlGetPatientDetail,
  urlAddNewPatient,
  urlGetDepartmentBasedOnPatitentType,
  urlGetProviderBasedOnDepartment,
  urlGetServiceLocationBasedonId
} from 'endpoints.ts';
import customAxios from '../CustomAxios/index';
import Title from 'antd/es/typography/Title';

const NewPatient = () => {
  const [patientDropdown, setPatientDropdown] = useState({
    Title: [],
    Gender: [],
    BloodGroup: [],
    MaritalStatus: [],
    Countries: [],
    Statesnew: [],
    PatientType: [],
    KinTitle: [],
    VisitType: [],
    Religion: []
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [age, setAge] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selecteddob, setdob] = useState('');
  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [selectedPatientType, setSelectedPatientType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedServiceLocation, setSelectedServiceLocation] = useState('');
  const [loadings, setLoadings] = useState(false);
  //Default Patient data

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  function formatDate(inputDate) {
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  const handleDateChange = (date, dateString) => {
    const dateinput = formatDate(dateString);
    setdob(dateinput);
    if (date) {
      setSelectedDate(date);
      const calculatedAge = calculateAge(dateString);
      setAge(calculatedAge);
    } else {
      setSelectedDate(null);
      setAge(null);
    }
  };

  const handleAgeChange = (value) => {
    if (value) {
      setAge(value);
      const newDateOfBirth = updateDateOfBirth(value);
      setSelectedDate(newDateOfBirth);
    } else {
      setSelectedDate(null);
    }
  };

  const calculateAge = (dateString) => {
    const currentDate = new Date();
    const birthDate = new Date(dateString);
    const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();
    return ageDiff;
  };

  const updateDateOfBirth = (inputAge) => {
    const currentDate = new Date();
    const newYear = currentDate.getFullYear() - inputAge;
    const newDateOfBirth = new Date(newYear, currentDate.getMonth(), currentDate.getDate());
    const formattedDate = `${newDateOfBirth.getFullYear()}-${('0' + (newDateOfBirth.getMonth() + 1)).slice(-2)}-${(
      '0' + newDateOfBirth.getDate()
    ).slice(-2)}`;
    return formattedDate;
  };
  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);

    if (!newCountry) {
      // If newCountry is undefined, clear states and selected state
      setFilteredStates([]);
      setSelectedState(null);
    } else {
      // Filter states based on the selected country
      const statesForCountry = patientDropdown.Statesnew.filter((state) => state.CountryId === newCountry);
      setFilteredStates(statesForCountry);

      // Check if the selected state is not in the filtered states, and if so, clear selected state
      if (selectedState && !statesForCountry.some((state) => state.StateID === selectedState)) {
        setSelectedState(null);
      }
    }
  };
  const handleReset = () => {
    form.resetFields();
  };

  // Handle state change
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setSelectedCity('');
    // Filter cities based on the selected state
    const citiesForState = patientDropdown.Placenew.filter((city) => city.StateId === newState);
    setFilteredCities(citiesForState);
  };
  const handlePatientTypeChange = (value) => {
    // Handle the change event for Patient Type
    setSelectedPatientType(value);
  };

  const handleDepartmentChange = (value) => {
    // Update the selected department when the "Department" dropdown value changes
    setSelectedDepartment(value);
  };

  useEffect(() => {
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
      console.log(apiData.Religion.map((option) => option.LookupDescription));
      console.log(apiData.Title.map((option) => option.LookupDescription));
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPatientType) {
        try {
          const response = await customAxios.get(`${urlGetDepartmentBasedOnPatitentType}?PatientType=${selectedPatientType}`);
          if (response.status === 200) {
            const dept = response.data.data.Department;
            setDepartments(dept);
          } else {
            console.error('Failed to fetch departments');
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
      } else {
        // Reset the department dropdown if no patient type is selected
        setDepartments([]);
        setSelectedDepartment('');
      }
    };

    fetchData();
  }, [selectedPatientType, setSelectedDepartment, setDepartments]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data for the "provider" and "servicelocation" dropdowns when "selectedDepartment" changes
      if (selectedDepartment) {
        try {
          const providerResponse = await customAxios.get(`${urlGetProviderBasedOnDepartment}?DepartmentId=${selectedDepartment}`);
          const serviceLocationResponse = await customAxios.get(
            `${urlGetServiceLocationBasedonId}?DepartmentId=${selectedDepartment}&patienttype=${selectedPatientType}`
          );

          if (providerResponse.status === 200) {
            const provider = providerResponse.data.data.Provider;
            setProviders(provider);
          } else {
            console.error('Failed to fetch providers');
          }

          if (serviceLocationResponse.status === 200) {
            const serviceloc = serviceLocationResponse.data.data.ServiceLocation;
            setServiceLocations(serviceloc);
          } else {
            console.error('Failed to fetch service locations');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        // Reset the provider and servicelocation dropdowns if no department is selected
        setProviders([]);
        setServiceLocations([]);
        setSelectedProvider('');
        setSelectedServiceLocation('');
      }
    };

    fetchData();
  }, [selectedDepartment, selectedPatientType]);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleBackToList = () => {
    debugger;
    const url = `/patient`;
    // Navigate to the new URL
    navigate(url);
  };
  // const onFinish = (values) => {
  //   console.log('Received values of form: ', values);
  // };
  const handleOnFinish = async (values) => {
    setLoadings(true);
    console.log('Received values from form: ', values);
    values.dob = selecteddob;
    const postData = {
      PatientFirstName: values.PatientFirstName,
      PatientMiddleName: values.PatientMiddleName,
      PatientLastName: values.PatientLastName,
      FacilityId: 1,
      MobileNumber: values.MobileNumber,
      PatientTitle: values.title,
      Gender: values.PatientGender,
      // FatherHusbandName: values.FatherHusbandName,
      PatientType: values.PatientTypeName,
      FacilityDepartmentId: values.DepartmentName,
      FacilityDepartmentServiceLocationId: values.ServiceLocationName,
      ProviderId: values.ProviderId,
      DateOfBirthstring: values.dob,
      // ReligionId: values.Religion,
      // Height: values.Height,
      // Weight: values.Weight,
      // MaritalStatus: values.MaritalStatus,
      PresentAddress1: values.Address,
      EmailId: values.EmailId
      // PermanentCountryId: values.country,
      // PermanentStateId: values.state,
      // PermanentPlaceId: values.city,
      // PermanentPinCode: values.PermanentPinCode,
      // LandlineNumber: values.LandlineNumber,
      // Occupation: values.Occupation,
      // EthnicityId: values.EthnicityId,
      // PrimaryLanguageId: values.PrimaryLanguageId,
      // CanSpeakEnglish: values.CanSpeakEnglish,
      // BirthPlace: values.BirthPlace,
      // BirthIdentification: values.BirthIdentification
    };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddNewPatient, postData, {
        headers: {
          'Content-Type': 'application/json' // Replace with the appropriate content type if needed
          // Add any other required headers here
        }
      });

      // Check if the request was successful
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      // Process the response data (this assumes the server responds with JSON)
      const data = response.data;
      // const encounterId = response.data.data.EncounterId;
      // const patientId = response.data.data.PatientId;

      // navigateToBilling(patientId, encounterId);
      console.log('Response data: ', data);

      // Display success notification
      notification.success({
        message: 'Patient Registration Successful',
        description: 'The patient details have been successfully registered.'
      });
      setLoadings(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to send data to server: ', error);

      // Display error notification
      notification.error({
        message: 'Error',
        description: 'Failed to register patient. Please try again later.'
      });
      setLoadings(false);
    }
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
      
        <Row style={{ padding: '0.5rem 2rem 0rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500 }}>
              Register New Patient
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button icon={<LeftOutlined />} onClick={handleBackToList}>
              Back To List
            </Button>
          </Col>
        </Row>
        <Divider orientation="left">Patient Details</Divider>

        <Form
          layout="vertical"
          form={form}
          name="register"
          onFinish={handleOnFinish}
        
          scrollToFirstError
          style={{ padding: '0rem 2rem' }}
        >
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item
                name="title"
                label="Title"
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please select title'
                  }
                ]}
              >
                <Select allowClear>
                  {patientDropdown.Title.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="PatientFirstName"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: 'Please add First Name'
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="PatientMiddleName" label="Middle Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="PatientLastName"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: 'Please add Last Name'
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                name="PatientGender"
                label="Gender"
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please select gender'
                  }
                ]}
              >
                <Select allowClear>
                  {patientDropdown.Gender.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                format={'DD/MM/YYYY'}
                rules={[
                  {
                    required: true,
                    message: 'Please select Date Of Birth'
                  }
                ]}
              >
                <DatePicker style={{ width: '100%' }} value={selectedDate} onChange={handleDateChange} disabledDate={disabledDate} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label="Age">
                <InputNumber style={{ width: '100%' }} placeholder="Enter Age" min={1} max={100} value={age} onChange={handleAgeChange} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="Age" label="Months">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="Age" label="Days">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="FatherHusbandName" label="Father / Spouse Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="Height" label="Height">
                <Input suffix="Cms" type="number" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="Weight" label="Weight">
                <Input suffix="Kgs" type="number" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="MaritalStatus" label="Marital Status">
                <Select allowClear>
                  {patientDropdown.MaritalStatus.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Address</Divider>
          <Row gutter={14}>
            <Col span={8}>
              <Form.Item name="PermanentAddress1" label="Address">
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="country" label="Country">
                <Select value={selectedCountry || ''} onChange={handleCountryChange} allowClear>
                  {patientDropdown.Countries.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="state" label="State">
                <Select value={selectedState || ''} onChange={handleStateChange} allowClear>
                  {filteredStates.map((option) => (
                    <Select.Option key={option.StateID} value={option.StateID}>
                      {option.StateName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="city" label="City">
                <Select value={selectedCity || ''} onChange={(value) => setSelectedCity(value)} allowClear>
                  {filteredCities.map((option) => (
                    <Select.Option key={option.PlaceId} value={option.PlaceId}>
                      {option.PlaceName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="PermanentPinCode" label="Pin Code">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Contact Details</Divider>
          <Row gutter={14}>
            <Col span={6}>
              <Form.Item
                name="MobileNumber"
                label="Mobile Number"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your mobile number.'
                  },
                  {
                    pattern: new RegExp(/^(\+\d{1,3})?\d{10,12}$/),
                    message: 'Invalid mobile number!'
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="LandlineNumber" label="Landline Number">
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="EmailId"
                label="Email Id"
                rules={[
                  {
                    type: 'email',
                    message: 'Please input valid E-mail'
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Occupation" label="Occupation">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={14}>
            <Col span={4}>
              <Form.Item name="Religion" label="Religion">
                <Select allowClear>
                  {patientDropdown.Religion.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="EthnicityId" label="Ethnicity">
                <Select placeholder="Select Ethnicity">
                  <Option value="china">Hindu</Option>
                  <Option value="usa">Muslim</Option>
                  <Option value="us">Christian</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="PrimaryLanguageId" label="Primary Language">
                <Select placeholder="Select Language">
                  <Option value="china">Hindi</Option>
                  <Option value="usa">English</Option>
                  <Option value="us">Kannada</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="CanSpeakEnglish" label="Can speak English?">
                <Select defaultValue={'Yes'}>
                  <Option value="china">Yes</Option>
                  <Option value="usa">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="BirthPlace" label="Birth Place">
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="BirthIdentification" label="Birth Identification">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Visit Details</Divider>
          <Row gutter={14}>
            <Col span={6}>
              <Form.Item
                name="PatientTypeName"
                label="Patient Type"
                rules={[
                  {
                    required: true,
                    message: 'Please select Patient Type'
                  }
                ]}
              >
                <Select onChange={handlePatientTypeChange} allowClear>
                  {patientDropdown.PatientType.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="DepartmentName"
                label="Department Type"
                rules={[
                  {
                    required: true,
                    message: 'Please select Department Type'
                  }
                ]}
              >
                <Select onChange={handleDepartmentChange} allowClear>
                  {departments.map((option) => (
                    <Select.Option key={option.DepartmentId} value={option.DepartmentId}>
                      {option.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="ProviderId"
                label="Provider"
                rules={[
                  {
                    required: true,
                    message: 'Please select Provider'
                  }
                ]}
              >
                <Select allowClear>
                  {providers.map((option) => (
                    <Select.Option key={option.ProviderId} value={option.ProviderId}>
                      {option.ProviderName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="ServiceLocationName"
                label="Service Location"
                rules={[
                  {
                    required: true,
                    message: 'Please select Service Location'
                  }
                ]}
              >
                <Select allowClear>
                  {serviceLocations.map((option) => (
                    <Select.Option key={option.FacilityDepartmentServiceLocationId} value={option.FacilityDepartmentServiceLocationId}>
                      {option.ServiceLocationName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col style={{ marginRight: '10px' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadings}>
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" onClick={handleReset}>
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};
export default NewPatient;
