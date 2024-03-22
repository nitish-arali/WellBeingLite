import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import {
  urlGetVisitDetailsWithPHeader,
  urlGetProviderBasedOnDepartment,
  urlGetDepartmentBasedOnPatitentType,
  urlGetServiceLocationBasedonId
} from 'endpoints.ts';
import { Col, Row, Spin } from 'antd';
import { Select } from 'antd';
import Form from 'antd/es/form';
import { Modal } from 'antd';

import PatientHeaderSingle from 'views/Patient/FormsUI/PatientHeaderVisit/indexvisit';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import { BrowserRouter as Router } from 'react-router-dom';

const { confirm } = Modal;

const VisitModal = ({ handleCloseConfirmationModal, selectedRow }) => {
  const { Option } = Select;
  const [form] = Form.useForm();

  const [selectedPatientId, setPatientId] = useState(selectedRow.PatientId);

  const [patientTypes, setPatientTypes] = useState([]);
  const [selectedPatientType, setSelectedPatientType] = useState('');
  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedServiceLocation, setSelectedServiceLocation] = useState('');

  const [encounterId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedRow != null) {
      // Make an API call to fetch patient details using patientId
      const fetchPatientDetails = async () => {
        try {
          const response = await customAxios.get(`${urlGetVisitDetailsWithPHeader}?PatientId=${selectedPatientId}`);
          if (response.status === 200) {
            const pttype = response.data.data.PatientType;
            setPatientTypes(pttype);
            setLoading(false);
          } else {
            console.error('Failed to fetch patient details');
          }
        } catch (error) {
          setLoading(false);
          console.error('Error fetching patient details:', error);
        }
      };

      fetchPatientDetails();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      debugger;
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
      debugger;
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

  const handlePatientTypeChange = (value) => {
    // Handle the change event for Patient Type
    setSelectedPatientType(value);
  };

  if (loading) {
    // Render a loading spinner while data is being fetched
    return <Spin size="large" />;
  }

  const handleDepartmentChange = (value) => {
    // Update the selected department when the "Department" dropdown value changes
    setSelectedDepartment(value);
  };

  confirm({
    content: (
      <>
        <div>
          <Router>
            <div>
              <PatientHeaderSingle patientdata={selectedRow} />
            </div>
          </Router>
        </div>
        <Form
          layout="vertical"
          //onFinish={handleOnFinish}
          variant="outlined"
          size="large"
          /* style={{
            maxWidth: 1500
          }} */
          form={form}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6} offset={3}>
              <div>
                <Form.Item label="Patient Type" name="PatientType" rules={[{ required: true, message: 'Please Input!' }]}>
                  {patientTypes.length > 0 && (
                    <Select onChange={handlePatientTypeChange} allowClear>
                      {patientTypes.map((option) => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6} offset={3}>
              <div>
                <Form.Item label="Department" name="Department" rules={[{ required: true, message: 'Please Input!' }]}>
                  <Select onChange={handleDepartmentChange} allowClear>
                    {departments.map((option) => (
                      <Select.Option key={option.DepartmentId} value={option.DepartmentId}>
                        {option.DepartmentName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6} offset={3}>
              <div>
                <Form.Item label="Provider" name="Provider" rules={[{ required: true, message: 'Please Input!' }]}>
                  <Select allowClear>
                    {providers.map((option) => (
                      <Select.Option key={option.ProviderId} value={option.ProviderId}>
                        {option.ProviderName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6} offset={3}>
              <div>
                <Form.Item label="Service Location" name="ServiceLocation" rules={[{ required: true, message: 'Please Input!' }]}>
                  <Select allowClear>
                    {serviceLocations.map((option) => (
                      <Select.Option key={option.FacilityDepartmentServiceLocationId} value={option.FacilityDepartmentServiceLocationId}>
                        {option.ServiceLocationName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </>
    ),
    onOk() {
      handleCloseConfirmationModal();

      // Handle the confirmation action here
    },
    onCancel() {
      console.log('Close');
      handleCloseConfirmationModal();
      // Handle the cancellation action here
    },
    width: 950,
    icon: null
  });
};

export default VisitModal;
