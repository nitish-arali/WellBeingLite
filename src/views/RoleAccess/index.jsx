import React, { useState, useEffect } from 'react';
import { Tree, AutoComplete, Form, Col, Button, Row, Input, notification } from 'antd';
import { CloseSquareFilled } from '@ant-design/icons';
import { urlGetRoles, urlGetAllMenusBasedOnRoleId } from 'endpoints.ts';
import customAxios from 'views/Patient/FormsUI/CustomAxios';

const { TreeNode } = Tree;

const RoleAccess = () => {
  const [originalOptions, setOriginalOptions] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);

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

  const onCheck = (keys) => {
    setCheckedKeys(keys);
  };

  const validateUserRole = (rule, value) => {
    if (value) {
      const existsInOptions = originalOptions.some(option => option.LookupDescription === value);
      if (!existsInOptions) {
        setTreeData([]);
        return Promise.reject('Please select a valid UserRole from the list.');
      }
    }
    return Promise.resolve();
  };

  const handleSearch = (value) => {
    if (value) {
      const filteredOptions = originalOptions.filter((option) => {
        const optionLabel = (option.LookupDescription || '').toLowerCase(); // Handle undefined or null labels
        const lowercasedValue = value.toLowerCase();
        return optionLabel.includes(lowercasedValue);
      });
      setDisplayedOptions(filteredOptions);
    } else {
      setDisplayedOptions(originalOptions);
    }
  };

  const handleSave = async () => {
    debugger;
    try {
      if (!selectedId) {
        notification.warning({
          message: 'Warning',
          description: 'Please select a UserRole before saving......',
        });
        return;
      }
  
      // Check if at least one menu item is checked
      if (checkedKeys.length === 0) {
        notification.warning({
          message: 'Warning',
          description: 'Please select at least one menu item......',
        });
        return;
      } else {
        // Placeholder for the actual API call to save checked menu items
        const response = await yourApiSaveFunction({
          userRoleId: selectedId,
          checkedKeys: checkedKeys,
        });
  
        // Check the response and show appropriate notification
        if (response.status === 200) {
          notification.success({
            message: 'Success',
            description: 'Menu items saved successfully.',
          });
        } else {
          console.error('Failed to save checked menu items:', response);
          notification.error({
            message: 'Error',
            description: 'Failed to save checked menu items. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Error while saving checked menu items:', error);
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };
  

  const accessStatusTrueIds = [];
  const hasFalseDescendants = (item) => {
    if (item.children && item.children.length > 0) {
      return item.children.some(child => child.AccessStatus === false || hasFalseDescendants(child));
    }
    return false;
  };

  const SelectedTreeData = (data) => {
    data.forEach((item) => {
      const hasFalseChildren = hasFalseDescendants(item);
      if (item.AccessStatus === true && !hasFalseChildren) {
        accessStatusTrueIds.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        SelectedTreeData(item.children);
      }
    });
};

  
  
  
  

  const onSelect = async (value, option) => {
    try {
      setSelectedId(option.key);
      const roleId =6; //parseInt(option.key, 10);
      const response = await customAxios.get(`${urlGetAllMenusBasedOnRoleId}?RoleId=${roleId}`);
      if (response.status === 200) {
        const roleAccessData = response.data.data.AllMenusOnRoleId;
        //const { treeData, checkedKeys } = generateTreeData(roleAccessData);
        const treeData = roleAccessData;
        
        SelectedTreeData(roleAccessData);
        console.log(accessStatusTrueIds);
        const checkedKeys = accessStatusTrueIds;
        setTreeData(treeData);
        setCheckedKeys(checkedKeys);
      } else {
        console.error('Failed to fetch role access data');
      }
    } catch (error) {
      console.error('Error fetching role access data:', error);
    }
  };

  return (
    <Form>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="UserRoleId"
            label="UserRole"
            rules={[
              { required: true, message: 'Please select a valid UserRole!' },
              { validator: validateUserRole },
            ]}
          >
            <AutoComplete
              popupMatchSelectWidth={252}
              style={{ width: '100%' }}
              options={displayedOptions.map((option) => ({
                value: option.LookupDescription,
                label: option.LookupDescription,
                key: option.LookupID.toString(),
              }))}
              onSelect={onSelect}
              onSearch={handleSearch}
              onChange={(value) => {
                if (!value) {
                  setTreeData([]);
                }
              }}
              allowClear={{
                clearIcon: (
                  <CloseSquareFilled
                    style={{ marginLeft: '-8em' }}
                  />
                ),
              }}
            >
              <Input.Search placeholder="Search for a UserRole" enterButton />
            </AutoComplete>
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={12}>
          <Form.Item>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col className="gutter-row" span={24}>
          <Tree
            checkable
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            treeData={treeData}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default RoleAccess;
