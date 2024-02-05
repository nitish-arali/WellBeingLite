import { AutoComplete, Button, Col, Form, Layout, Row, Select } from 'antd';

import Title from 'antd/es/typography/Title';
import { urlSearchUHID } from 'endpoints.ts';
import { keyBy } from 'lodash';
import React from 'react';
import { useState } from 'react';
import customAxios from 'views/Patient/FormsUI/CustomAxios';

export default function ContainerDefinitions() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  const [selectedUhId, setSelectedUhId] = useState(null);

  const fetchOptionsCallback = async (inputValue) => {
    try {
      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${inputValue}`);
      if (response.data && Array.isArray(response.data.data)) {
        setOptions(response.data.data);
        console.log(response.data.data);
        // Update the state with the received data for PatientName
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOptions([]);
    }
  };

  const handleAutocompleteChange = (newValue) => {
    setSelectedUhId(newValue);
  };
  const onSelect = (data) => {
    console.log('onSelect', data);
  };
  return (
    <>
      <Layout style={{ zIndex: '999999999' }}>
        <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
          <Row style={{ padding: '0.5rem 2rem 0rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
            <Col span={16}>
              <Title level={4} style={{ color: 'white', fontWeight: 500 }}>
                Laboratory DashBoard
              </Title>
            </Col>
          </Row>

          <div style={{ border: '2px solid #ccc', borderRadius: '10px', padding: '10px' }}>
            <Form
              layout="vertical"
              form={form}
              name="labDashboard"
              // onFinish={handleOnFinish}
              scrollToFirstError
              style={{ padding: '0rem 2rem' }}
            >
              <Row gutter={14}>
                <Col span={5}>
                  <Form.Item name="Uhid" label="UHID">
                    <AutoComplete
                      value={selectedUhId}
                      options={options.map((option) => (
                        <Select.Option key={option.PatientId} value={option.UhId}>
                          {option.UhId}
                        </Select.Option>
                      ))}
                      onSelect={onSelect}
                      onSearch={(inputValue) => fetchOptionsCallback(inputValue)}
                      onChange={handleAutocompleteChange}
                      placeholder="Search UhId"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Layout>
    </>
  );
}
