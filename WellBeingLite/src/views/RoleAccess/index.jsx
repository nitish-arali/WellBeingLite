import React, { useState, useEffect } from 'react';
import { Tree, AutoComplete, Form, Col, Button,Row,Input,notification  } from 'antd';
import { CloseSquareFilled } from '@ant-design/icons';
import {urlGetRoles} from 'endpoints.ts';
import customAxios from 'views/Patient/FormsUI/CustomAxios';

const { TreeNode } = Tree;

const leftMenuItems = {
  id: 'leftMenu',
  title: 'Root',
  children: [
    {
      id: 1,
      title: 'Masters',
      children: [
        {
          id: 15,
          title: 'General Master',
          children: [
            { id: 20, title: 'Lookup' },
            { id: 21, title: 'User Registration' },
          ],
        },
        {
          id: 16,
          title: 'Account Management',
          children: [{ id: 41, title: 'Services' }],
        },
        {
          id: 17,
          title: 'Laboratory Management',
          children: [
            { id: 42, title: 'TemplateMaster' },
            { id: 43, title: 'SubTestMapping' },
            { id: 44, title: 'TestMethod' },
            { id: 45, title: 'TestReference' },
            { id: 46, title: 'ContainerDefinitions' },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Identity management',
      children: [
        { id: 18, title: 'Patient Registration' },
        { id: 19, title: 'Encounter Creation' },
      ],
    },
    {
      id: 3,
      title: 'Account Management',
      children: [{ id: 27, title: 'Billing' }],
    },
    { id: 4, title: 'Claim Management' },
    { id: 5, title: 'Resource Scheduling' },
    { id: 6, title: 'Ward Management' },
    { id: 7, title: 'Inventory Management' },
    { id: 10, title: 'Pharmacy' },
    { id: 11, title: 'Clinical Documents' },
    {
      id: 12,
      title: 'Laboratory',
      children: [
        { id: 49, title: 'LabDashBoard' },
        { id: 47, title: 'SampleCollectionSearch' },
        { id: 48, title: 'ResultentrySearch' },
      ],
    },
    { id: 14, title: 'Report' },
  ],
};

const RoleAccess = () => {
  const [originalOptions, setOriginalOptions] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    debugger;
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

 



  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.id} />;
    });
  };

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
    debugger;
    if (value) {
      const filteredOptions = originalOptions.filter((option) => {
        const optionLabel = (option.LookupDescription  || '').toLowerCase(); // Handle undefined or null labels
        const lowercasedValue = value.toLowerCase();
        return optionLabel.includes(lowercasedValue);
      });
      setDisplayedOptions(filteredOptions);
    } else {
      setDisplayedOptions(originalOptions);
    }
  };
  
  
   const onSelect=(value, option) => {
    setSelectedId(option.key);
    
    const generatedTreeData = generateTreeData(leftMenuItems);
    setTreeData(generatedTreeData);
  };
 

  // const onSelect = (value) => {
  //   const selectedOption = displayedOptions.find((option) => option.label === value);
  //   if (selectedOption) {
  //     setSelectedId(selectedOption.key);
  //     const generatedTreeData = generateTreeData(leftMenuItems);
  //     setTreeData(generatedTreeData);
  //   }
  // };
  
  const generateTreeData = (data) => {
    const flatten = (item) => {
      const result = {
        title: item.title,
        key: item.id.toString(),
      };
  
      if (item.children) {
        result.children = item.children.map(flatten);
      }
  
      return result;
    };
  
    return [flatten(data)];
  };

  const handleSave = async () => {
    try {
      // Your validation logic here
      if (!selectedId) {
        // Validation failed, display an error message or take appropriate action
        //console.error('Please select a UserRole before saving.');
        notification.warning({
          message: 'Warning',
          description: 'Please select a UserRole before saving......',
        });
        return;
      }
  
      // Check if at least one menu item is checked
      if (checkedKeys.length === 0) {
        // Validation failed, display an error message or take appropriate action
        //console.error('Please select at least one menu item.');
        notification.warning({
          message: 'Warning',
          description: 'Please select at least one menu item......',
        });
        return;
      }else{
        notification.success({
          message: 'Success',
          description: 'we have checked menus......',
        });
      }
  

      // API call to save checked menu items for the selected user role
      // const response = await yourApiSaveFunction({
      //   userRoleId: selectedId,
      //   checkedKeys: checkedKeys,
      // });
      
  
 
    } catch (error) {
      console.error('Error while saving checked menu items:', error);
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
            onselect={onSelect}
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
            //size="large"
          >
            <Input.Search  placeholder="Search for a UserRole" enterButton />
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
