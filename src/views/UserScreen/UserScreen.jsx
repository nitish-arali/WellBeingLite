import React, { useEffect, useState } from 'react';
import { Button,  Input, Modal,notification,  Tooltip,Typography,Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { urlGetAllUsers,urlDeleteAppUser } from 'endpoints.ts';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import { useNavigate } from 'react-router';
const UserScreen = () => {
  const [loadUsers, setUserGrid] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(5); // Set your default pagination size


  const fetchData = async () => {
    try {
      const response = await customAxios.get(`${urlGetAllUsers}`);
      if (response.status === 200) {
        const sourceUserList = response.data.data;
        setUserGrid(sourceUserList);
        setFilteredData(sourceUserList);
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTemplate = () => {
    const AppId = 0;
    navigate('/CreateUser', { state: { AppId } });
};

  const handleEdit = (row) => {
    debugger;
    console.log('Editing row:', row);
    const AppId = row.AppUserId;
    navigate('/CreateUser', { state: { AppId } });

  };

  const handleDelete = async (row) => {
    debugger;
    console.log('Deleting row:', row);
  
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete this User: ${row.ProviderName}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      closable: true, 
      async onOk() {
        try {
          debugger;
          // Make API call
          const response = await customAxios.delete(`${urlDeleteAppUser}?AppuserId=${row.AppUserId}`);
          
          console.log('Delete successful:', response);
  
          if (response.data.data.Status === true) {
            var message1 = 'User Deleted Successfully..';
            notification.success({
              message: 'Success',
              description: message1,
            });
            fetchData();
          } else {
            notification.error({
              message: 'Error',
              description: 'Something Went Wrong.....',
            });
          }
  
          // Handle successful delete
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'An error occurred while deleting the user.',
          });
        }
      },
    });
  };
  

  const columns = [
    {
      title: 'Sl No',
      key: 'index',
      render: (text, record, index) => index + 1,
  },
    { 
      title: 'UserId', 
      dataIndex: 'UserId', 
      key: 'UserId',
      sorter: (a, b) => a.UserId - b.UserId,
      sortDirections: ['descend', 'ascend'],
    },
    { 
      title: 'UserName', 
      dataIndex: 'ProviderName', 
      key: 'ProviderName',
      sorter: (a, b) => a.ProviderName.localeCompare(b.ProviderName),
      sortDirections: ['descend', 'ascend'],
    },
    { 
      title: 'UserRole', 
      dataIndex: 'UserRoleName', 
      key: 'UserRoleName',
      sorter: (a, b) => a.UserRoleName.localeCompare(b.UserRoleName),
      sortDirections: ['descend', 'ascend'],
    },
    { 
      title: 'EmailId', 
      dataIndex: 'EmailId', 
      key: 'EmailId',
      sorter: (a, b) => a.EmailId.localeCompare(b.EmailId),
      sortDirections: ['descend', 'ascend'],
    },
    { 
      title: 'Phonenumber', 
      dataIndex: 'MobileNumber', 
      key: 'Phonenumber',
      sorter: (a, b) => a.MobileNumber.localeCompare(b.MobileNumber),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, row) => (
        <>
           <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(row)} />
          </Tooltip>
        </>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    if (value === '') {
      setFilteredData(loadUsers);
    } else {
      const filtered = loadUsers.filter(entry =>
        Object.values(entry).some(val => 
          val && val.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ backgroundColor: '#1E88E5', color: 'white', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
        User Management
        <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddTemplate}>
          Add User
        </Button>
      </Typography.Title>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Input.Search
          placeholder="Search"
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 200, marginBottom: 15 }}
        />
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          onChange: (current, pageSize) => {
              setPage(current);
              setPaginationSize(pageSize);
          },
          defaultPageSize: 5, // Set your default pagination size
          hideOnSinglePage: true,
          showSizeChanger: true,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
      }}
      
        rowKey={(row) => row.AppUserId} // Specify the custom id property here
        size="small"
        bordered
      />
    </div>
  );
};

export default UserScreen;
