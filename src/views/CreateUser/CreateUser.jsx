import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Row, Col, AutoComplete, notification } from 'antd';
import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import customAxios from 'views/Patient/FormsUI/CustomAxios'; // Import your custom axios instance or use axios directly
import { urlGetRoles, urlGetAutocompleteProviders, urlAddUser, urlGetGetAppUserbyId } from 'endpoints.ts';
import { useLocation } from 'react-router-dom';

const CreateUser = () => {
  const location = useLocation();
  const AppId = location.state.AppId;
  console.log('appid', AppId);
  const navigate = useNavigate();
  const [originalOptions, setOriginalOptions] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [form] = Form.useForm(); // Ant Design Form hook




  useEffect(() => {
    debugger;
    const fetchData = async () => {
      if (AppId > 0) {
        try {
          const response = await customAxios.get(`${urlGetGetAppUserbyId}?AppuserId=${AppId}`);
          if (response.status === 200) {
            const data = response.data.data;
            // Set the data to the form fields here and update selectedId if needed
            // For example:
            // Update state and set form values
            setSelectedId(data.UserRoleId);
            setSelectedProviderId(data.ProviderId);
            form.setFieldsValue({
              UserId: data.UserId,
              EmailId: data.EmailId,

              UserRoleId: data.UserRoleName,
              ProviderId: data.ProviderName


              // ... other fields
            });
            //setSelectedId(data.someId); // Replace with the actual field from your response
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [AppId]); // Make sure to include AppId in the dependency array



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(urlGetRoles);
        if (response.status === 200) {
          const data = response.data.data.UserRoles;
          setOriginalOptions(data);
          setDisplayedOptions(data); // Initially display all data
        } else {
          console.error('Failed to fetch autocomplete data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);




  const validateUserRole = (rule, value) => {
    if (value) {
      const existsInOptions = originalOptions.some(option => option.LookupDescription === value);
      if (!existsInOptions) {
        return Promise.reject('Please select a valid UserRole from the list.');
      }
    }
    return Promise.resolve();
  };

  const handleSearch = (value) => {

    // Check if value is defined before filtering options
    if (value) {
      // You can perform additional filtering based on user input if needed
      const filteredOptions = originalOptions.filter((option) =>
        option.LookupDescription.toLowerCase().includes(value.toLowerCase())
      );

      setDisplayedOptions(filteredOptions);
    } else {
      // If value is not defined, reset options to the original data
      setDisplayedOptions(originalOptions);
    }
  };

  const onFinish = async (values) => {
    debugger;
    console.log('Success:', values);
    console.log('selectedidddd', selectedId);
    console.log('selectedidddd', selectedProviderId);
    message.success('All fields are Filled');

    values.UserRoleId = selectedId;
    values.ProviderId = selectedProviderId;
    values.AppUserId = AppId;


    try {
      const response = await customAxios.post(urlAddUser, values, {

        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.data.Status == true) {
        const message1 = AppId > 0 ? 'UserResistration Updated Successfully' : 'UserResistration Successfully Added';

        // Show Ant Design notification on success
        notification.success({
          message: 'Success',
          description: message1,
        });
        form.resetFields();
        const url = '/UserRegistration';
        navigate(url);

      } else {

        notification.error({
          message: 'Error',
          description: 'Something Went Wrong.....',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while adding the user.',
      });
    }
  };

  const onFinishFailed = ({ errorFields }) => {
    // console.log('Failed:', errorFields);
    message.error('Please fill all required fields!');
  };
  const handleReset = () => {
    form.resetFields(); // Reset the form fields to their initial values
  };

  const handleCancel=()=>{
    const url = '/UserRegistration';
        navigate(url);
  };





  const [options, setOptions] = useState([]);


  const handleSearchProvider = async (value) => {
    try {
      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
        return;
      }

      const response = await customAxios.get(`${urlGetAutocompleteProviders}?ProviderFirstName=${value}`);
      const responseData = response.data.data || [];

      // Ensure responseData is an array and has the expected structure
      if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].ProviderId !== undefined) {
        const newOptions = responseData.map(provider => ({
          value: provider.ProviderFirstName,
          label: provider.ProviderFirstName,
          key: provider.ProviderId
        }));
        setOptions(newOptions);
        // setOptions(responseData);
      } else {
        setOptions([]); // Set options to an empty array if the structure is not as expected
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setOptions([]); // Set options to an empty array in case of an error
    }
  };




  const handleSelect = (value, option) => {
    console.log('ProviderFirstName:', value);
    console.log('ProviderId:', option.key);
    setSelectedProviderId(option.key);
  };




  return (
    <Form
      form={form}
      //size='small'
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      layout="vertical"
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={6}>
          <Form.Item
            label="UserId"
            name="UserId"
            rules={[
              {
                required: true,
                message: 'Please input your UserId!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>



        <Col className="gutter-row" span={6}>
          <Form.Item
            name="Password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={6}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['Password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your Password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('Password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The new password that you entered do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={6}>
          <Form.Item
            name="EmailId"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>


      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={6}>
          <Form.Item
            name="UserRoleId"
            label="UserRole"
            //rules={[{ required: true, message: 'Please select an UserRole!' }]}
            rules={[
              { required: true, message: 'Please select a valid UserRole!' },
              { validator: validateUserRole },
            ]}
          >
            <AutoComplete
              //  style={{ width: 200 }}
              options={displayedOptions.map((option) => ({
                value: option.LookupDescription,
                label: option.LookupDescription,
                key: option.LookupID.toString(),
              }))}
              placeholder="Search for a UserRole"
              onSelect={(value, option) => {

                console.log('Selected:', value, option.label);
                setSelectedId(option.key); // Store the LookupID
                console.log('LookupID:', option.key); // This will log the LookupID
              }}
              onSearch={handleSearch}
              allowClear={{
                clearIcon: <CloseSquareFilled />,
              }}
            >

            </AutoComplete>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item
            label="Select Provider"
            name="ProviderId"
            rules={[
              {
                required: true,
                message: 'Please select a provider',
              },
            ]}
          >
            <AutoComplete
              // style={{ width: 200 }}
              options={options}
              onSearch={handleSearchProvider}
              onSelect={handleSelect}
              // onSubmit={handleSubmit}
              placeholder="Search for a provider"
              allowClear={{
                clearIcon: <CloseSquareFilled />,
              }}
            >

            </AutoComplete>

          </Form.Item>
        </Col>
      </Row>


      <Row justify="end">
        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {AppId > 0 ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            {AppId > 0 ? (
              <Button type="default" onClick={handleCancel}>
                Cancel
              </Button>
            ) : (
              <Button type="default" onClick={handleReset}>
                Reset
              </Button>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateUser;
