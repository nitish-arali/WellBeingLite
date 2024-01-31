import React, { useState } from 'react';
import { AutoComplete, Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, DatePicker } from 'antd';
import Layout, { Header } from 'antd/es/layout/layout';
import HeadingComponent from 'components/HeadingComponent';
const { Option } = Select;

const ContainerDefinition = () => {
  const [age, setAge] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select
        style={{
          width: 70
        }}
      >
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const calculateAge = (dateString) => {
    if (dateString) {
      const today = new Date();
      const birthDate = new Date(dateString);
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
      }
      if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }
      return `${years} years ${months} months ${days} days`;
    }
    return '';
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    setAge(calculateAge(dateString));
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <HeadingComponent heading={'Patient Registration'} />
        <Form
          layout="vertical"
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={
            {
              // residence: ['zhejiang', 'hangzhou', 'xihu'],
              // prefix: '86'
            }
          }
          scrollToFirstError
          style={{ padding: '0rem 1rem' }}
        >
          <h3>Patient Details</h3>
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
                <Select placeholder="Title">
                  <Option value="china">Mr.</Option>
                  <Option value="usa">Mrs.</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
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
            <Col span={7}>
              <Form.Item name="PatientMiddleName" label="Middle Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={7}>
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
          </Row>
          <Row gutter={16}>
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
                <Select placeholder="Title">
                  <Option value="china">Male</Option>
                  <Option value="usa">Female</Option>
                  <Option value="usa">Others</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="FatherHusbandName" label="Father / Spouse Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="dob" label="Date of Birth">
                <DatePicker
                  onChange={handleDateChange}
                  disabledDate={(current) => current && current.valueOf() > Date.now()}
                  width={'100%'}
                  format={'DD-MM-YYYY'}
                  popupStyle={{
                    height: '100px'
                  }}
                />
                {/* <Input disabled value={age} /> */}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="age" label="Age">
                <Input placeholder={age} value={age} />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item> */}

          <Form.Item
            name="nickname"
            label="Nickname"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!'
              }
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: '100%'
              }}
            />
          </Form.Item>

          <Form.Item
            name="donation"
            label="Donation"
            rules={[
              {
                required: true,
                message: 'Please input donation amount!'
              }
            ]}
          >
            <InputNumber
              addonAfter={suffixSelector}
              style={{
                width: '100%'
              }}
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label="Intro"
            rules={[
              {
                required: true,
                message: 'Please input Intro'
              }
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: 'Please select gender!'
              }
            ]}
          >
            <Select placeholder="select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};
export default ContainerDefinition;
