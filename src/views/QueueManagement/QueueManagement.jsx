import React, { useEffect, useState } from 'react';
import { Table, Input, Typography, Select, Pagination, Spin, Space, Card, Row, Col } from 'antd';
import CustomLoader from '../../views/Patient/FormsUI/CustomLoader/index';
import PatientHeaderQueue from '../../views/QueueManagement/PatientHeaderQueue/PatientHeaderQueue';
import customAxios from '../../views/Patient/FormsUI/CustomAxios';
import { urlGetAllQueues, urlGetAllProviders } from '../../endpoints.ts';

const { Option } = Select;
const { Search } = Input;

export default function QueueManagement() {
  const [patientQueueDetails, setPatientQueueDetails] = useState([]);
  const [ProviderDropDown, setProviderDropDown] = useState({
    Providers: []
  });

  const [encounterId] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [queueNumber, setQueueNumber] = useState();

  useEffect(() => {
    debugger;
    const pr1 = selectedProvider || 0;
    const fl1 = encounterId === '' ? '""' : encounterId;
    customAxios.get(`${urlGetAllQueues}?ProviderId=${pr1}&Flag=${fl1}`).then((response) => {
      setPatientQueueDetails(response.data.data.QueueModel);
      setQueueNumber(patientQueueDetails.length + 1);
    });
  }, []);

  useEffect(() => {
    customAxios.get(urlGetAllProviders).then((response) => {
      setProviderDropDown(response.data.data);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredPatients = patientQueueDetails.filter((patient) =>
    patient.PatientFirstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPatients = filteredPatients.length;
  const firstPatientIndex = (currentPage - 1) * patientsPerPage + 1;
  const lastPatientIndex = Math.min(currentPage * patientsPerPage, totalPatients);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleProviderChange = (Provider) => {
    debugger;
    const fl1 = encounterId === '' ? '""' : encounterId;
    customAxios.get(`${urlGetAllQueues}?ProviderId=${Provider}&Flag=${fl1}`).then((response) => {
      setPatientQueueDetails(response.data.data.QueueModel);
    });
  };

  /* const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'PatientFirstName',
      key: 'PatientFirstName'
    }
    // Add more columns as needed
  ]; */

  const totalPatientCountStyle = {
    textAlign: 'center',
    marginTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px'
  };

  return (
    <>
      <Card title="List of Patients in Visit">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8}>
            <div style={totalPatientCountStyle}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                Showing {firstPatientIndex}-{lastPatientIndex} of {totalPatients} Patients
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6} offset={10}>
            <div>
              <Select style={{ width: '100%' }} onChange={handleProviderChange} placeholder="Select Provider" allowClear>
                <Option value="">None</Option>
                {ProviderDropDown.Providers.map((provider) => (
                  <Option key={provider.ProviderId} value={provider.ProviderId}>
                    {provider.ProviderName}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        {/* Patient List Section */}
        <div style={{ marginTop: '20px' }}>
          {filteredPatients.slice((currentPage - 1) * patientsPerPage, currentPage * patientsPerPage).map((patient, index) => (
            <PatientHeaderQueue key={index} patientdata={patient} queueNumber={queueNumber + index} />
          ))}
        </div>
        {/* Pagination Section */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Pagination current={currentPage} pageSize={patientsPerPage} total={totalPatients} onChange={handleChangePage} />
        </div>
      </Card>
    </>
  );
}
