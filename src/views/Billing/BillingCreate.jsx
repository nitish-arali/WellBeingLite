import {
  urlSearchUHID,
  urlGetAllVisitsForPatientId,
  urlGetPatientHeaderWithPatientIAndEncounterId,
  urlGetServiceClassificationsForServiceGroup,
  urlServiceAutocomplete,
  urlGetAllProviders,
  urlGetServiceCharge
} from 'endpoints.ts';
import customAxios from 'views/Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import VisitSelect from 'views/Patient/FormsUI/VisitSelect/index.js';
import { useNavigate } from 'react-router';
import { Form, Row, Col, AutoComplete, Input, Select, Button, Layout, DatePicker } from 'antd';
import Title from 'antd/es/typography/Title';
import { Table, Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import PatientHeaderSingle from 'views/Patient/FormsUI/PatientHeaderSingle';
import 'css/PatientHeader.css';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { color } from '@mui/system';

const BillingCreate = () => {
  const location = useLocation();

  const patientId = location.state.patientId;
  const encounterId = location.state.encounterId;
  const [patientdata, setPatientdata] = useState(null);
  const { TabPane } = Tabs;
  const today = moment();
  let [counter, setCounter] = useState(0);
  const [consultationdetails, setconsultantsdata] = useState([]);
  const [defaultActiveKey, setdefaultActiveKey] = useState('1041');
  const [options, setOptions] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState({});

  const [isfirstRowCreated, setisfirstRowCreated] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  let [totalConsultationsCharges, setTotalConsultationCharges] = useState(0);
  let [totalServiceCharges, setTotalServiceCharges] = useState(0);
  let [totalInvestigationCharges, setTotalInvestigationsCharges] = useState(0);
  const [viewtotalBillAmount, setViewTotalBillAmount] = useState(0);

  let [SingleItemCharge, setSingleItemCharge] = useState({});
  let [SingleItemAmount, setSingleItemAmount] = useState({});

  const [viewtotalAmount, setviewTotalAmount] = useState(0);

  const [NetAmount, setNetAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the URL with parameters
        const response = await customAxios.get(
          `${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data.EncounterModel;
          setPatientdata(patientdetail);
          console.log(patientdetail);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the asynchronous function
    fetchData();
  }, [patientId, encounterId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(`${urlGetAllProviders}`);
        const responseData = response.data.data.Providers || [];

        // Ensure responseData is an array and has the expected structure
        if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].ProviderId !== undefined) {
          const newOptions = responseData.map((option) => ({
            value: option.ProviderId,
            label: option.ProviderName,
            key: option.ProviderId
          }));
          setProviderOptions(newOptions);
          handleAdd();
          // setOptions(responseData);
        } else {
          setProviderOptions([]); // Set options to an empty array if the structure is not as expected
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setProviderOptions([]); // Set options to an empty array in case of an error
      }
    };
    // Call the asynchronous function
    fetchData();
  }, []);

  useEffect(() => {
    debugger;
    handleForm1Change();
  }, [totalConsultationsCharges, viewtotalBillAmount]);

  const handleAutoCompleteChange = async (value, key) => {
    debugger;
    try {
      if (!value.trim()) {
        setOptions([]); // Set options to an empty array key

        const newSingleItemAmount = { ...SingleItemAmount, [key]: 0 };

        setSingleItemAmount(newSingleItemAmount);

        // Recalculate the total consultation charges
        totalConsultationsCharges = 0;
        for (let item of newData) {
          totalConsultationsCharges += newSingleItemAmount[item.key];
        }
        setTotalConsultationCharges(totalConsultationsCharges);
        const calculateTotal = totalConsultationsCharges + totalServiceCharges + totalInvestigationCharges;
        setViewTotalBillAmount(calculateTotal);

        return;
      }

      const response = await customAxios.get(`${urlServiceAutocomplete}?Description=${value}`);
      const responseData = response.data.data || [];

      // Ensure responseData is an array and has the expected structure
      if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].ServiceId !== undefined) {
        const newOptions = responseData.map((option) => ({
          value: option.LongName,
          label: option.LongName,
          key: option.ServiceId
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

  const handleSelect = async (value, option, key) => {
    debugger;
    if (value) {
      try {
        // Construct the URL with parameters
        const response = await customAxios.get(
          `${urlGetServiceCharge}?ServiceId=${option.key}&PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data;
          const dataToUpdate = Array.isArray(patientdetail) ? patientdetail[0] : patientdetail;

          const matchingProvider = providerOptions.find((providerOption) => providerOption.key === dataToUpdate.ProviderID);

          if (matchingProvider) {
            // If a matching UomId is found, set this as the selected Uom
            setSelectedProviderId((prevState) => {
              const newState = { ...prevState, [key]: matchingProvider.key };
              console.log(newState); // Log the new state
              return newState;
            });

            // Update the UOM value in the form
            form.setFieldsValue({
              [key]: {
                ProviderID: matchingProvider.key,
                consultants: option.value,

                Amount: dataToUpdate.Amount,
                ChargeAmount: dataToUpdate.ChargeAmount,
                NetAmount: dataToUpdate.Amount
              }
            });
            setSingleItemCharge((prevCharges) => ({ ...prevCharges, [key]: dataToUpdate.ChargeAmount }));
            setSingleItemAmount((prevAmounts) => ({ ...prevAmounts, [key]: dataToUpdate.ChargeAmount }));
            const newTotalConsultationCharges = totalConsultationsCharges + dataToUpdate.ChargeAmount;
            setTotalConsultationCharges(newTotalConsultationCharges);
            // form1.setFieldsValue({ ConsultantCharges: newTotalConsultationCharges });
            console.log('total charges amount ', newTotalConsultationCharges);
            // setConsultationCharges((prevtotal) => prevtotal + dataToUpdate.Amount);

            setOptions([]);
            const total = newTotalConsultationCharges + totalInvestigationCharges + totalServiceCharges;
            setViewTotalBillAmount(total);
            // const NetTotal = total - discount;
            // setNetAmount(NetTotal);
            // form1.setFieldsValue({ ConsultantCharges: newTotalCharges, totalAmount: total, NetAmount: NetTotal });
            // // updateAmount();
            // console.log(patientdetail);
          }
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleDiscountChange = (e, key) => {
    debugger;
    let discountValue = e.target.value;
    let discountAmount;

    // Check if the discount value includes a '%' sign
    if (discountValue.includes('%')) {
      // Remove the '%' sign and convert to a number
      discountValue = Number(discountValue.replace('%', ''));
      // Calculate the discount amount as a percentage of the ChargeAmount
      discountAmount = (SingleItemAmount[key] * discountValue) / 100;
    } else {
      // Convert the discount value to a number
      discountValue = Number(discountValue);
      // The discount amount is the discount value
      discountAmount = discountValue;
    }

    if (!isNaN(discountAmount)) {
      const ItemAmount = SingleItemAmount[key] - discountAmount;
      form.setFieldsValue({ [key]: { NetAmount: ItemAmount, discount: discountAmount } });
    }
  };

  const handleQtyChange = (e, key) => {
    const getQtyValue = Number(e.target.value);
    if (!isNaN(getQtyValue)) {
      const calculateItemAmount = SingleItemCharge[key] * getQtyValue;

      // Create a new object to hold the new state
      const newSingleItemAmount = { ...SingleItemAmount, [key]: calculateItemAmount };

      setSingleItemAmount(newSingleItemAmount);
      form.setFieldsValue({ [key]: { Amount: calculateItemAmount, NetAmount: calculateItemAmount } });

      // Update the total consultation charges when a quantity is changed
      let totalConsultationsCharges = 0;
      for (let key in newSingleItemAmount) {
        totalConsultationsCharges += newSingleItemAmount[key];
      }
      setTotalConsultationCharges(totalConsultationsCharges);
      const total = totalConsultationsCharges + totalInvestigationCharges + totalServiceCharges;
      setViewTotalBillAmount(total);
    }
  };

  const handleDelete = (record) => {
    debugger;
    const newData = consultationdetails.filter((item) => item.key !== record.key);
    setconsultantsdata(newData);
    const newSingleItemAmount = { ...SingleItemAmount, [record.key]: 0 };

    setSingleItemAmount(newSingleItemAmount);

    // Recalculate the total consultation charges
    totalConsultationsCharges = 0;
    for (let item of newData) {
      totalConsultationsCharges += SingleItemAmount[item.key];
    }
    setTotalConsultationCharges(totalConsultationsCharges);
    const total = totalConsultationsCharges + totalInvestigationCharges + totalServiceCharges;
    setViewTotalBillAmount(total);
  };

  const handleAdd = async () => {
    debugger;
    if (isfirstRowCreated) {
      // Validate the form fields for the first row
      const fields = await form.validateFields();
      if (!fields) {
        // Handle validation failure, if needed
        return;
      }
      setCounter(counter + 1);
      const newRow = {
        key: (counter + 1).toString(),
        consultants: '',
        date: '',
        ProviderID: '',
        ChargeAmount: '',
        quantity: '',
        Amount: '',
        discount: '',
        discountReason: '',
        NetAmount: ''
      };
      setconsultantsdata([...consultationdetails, newRow]);
    } else {
      setCounter(counter + 1);
      const newRow = {
        key: (counter + 1).toString(),
        consultants: '',
        date: '',
        ProviderID: '',
        ChargeAmount: '',
        quantity: '',
        Amount: '',
        discount: '',
        discountReason: '',
        NetAmount: ''
      };
      setconsultantsdata([...consultationdetails, newRow]);
      setisfirstRowCreated(true);
    }
  };

  const handleForm1Change = async () => {
    form1.setFieldsValue({ ConsultantCharges: totalConsultationsCharges, totalAmount: viewtotalBillAmount });
  };

  const consultantsColumns = [
    {
      title: 'Sl no',
      key: 'index',
      width: 80,
      render: (text, record, index) => {
        const serialNumber = index + 1;
        return <Input value={serialNumber} size="small" variant="borderless" />;
      }
    },
    {
      title: 'Consultants',
      dataIndex: 'consultants',
      key: 'consultants',
      width: 350,
      render: (text, record) => (
        <Form.Item name={[record.key, 'consultants']} rules={[{ required: true, message: 'Select any consultants' }]}>
          <AutoComplete
            id="consultants-service-autocomplete"
            options={options}
            placeholder="Search Services"
            onSearch={(value) => handleAutoCompleteChange(value, record.key)}
            onSelect={(value, option) => handleSelect(value, option, record.key)}
            filterOption={(inputValue, option) => option.value.toUpperCase().includes(inputValue.toUpperCase())}
            // style={{ width: '100%' }}
            size="small"
            // variant="borderless"
            allowClear
            showSearch
          />
        </Form.Item>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      render: (text, record) => (
        <Form.Item name={[record.key, 'date']}>
          <DatePicker defaultValue={today} format="DD-MM-YYYY" size="small" variant="borderless" suffixIcon disabled />
        </Form.Item>
      )
    },
    {
      title: 'Provider',
      dataIndex: 'ProviderID',
      key: 'ProviderID',
      width: 200,
      render: (text, record) => (
        <Form.Item name={[record.key, 'ProviderID']} rules={[{ required: true, message: 'select the Provider' }]}>
          <Select
            showSearch
            placeholder="Search Providers"
            optionFilterProp="children"
            value={selectedProviderId[record.key]?.ProviderID}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
            options={providerOptions}
            allowClear
            variant="borderless"
          ></Select>
        </Form.Item>
      )
    },
    {
      title: 'Charges',
      dataIndex: 'ChargeAmount',
      key: 'ChargeAmount',
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'ChargeAmount']}>
          <Input size="small" variant="borderless" />
        </Form.Item>
      )
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (text, record) => (
        <Form.Item name={[record.key, 'quantity']}>
          <Input size="small" variant="borderless" onInput={(value) => handleQtyChange(value, record.key)} />
        </Form.Item>
      )
    },
    {
      title: 'Amt',
      dataIndex: 'Amount',
      key: 'Amount',
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'Amount']}>
          <Input size="small" variant="borderless" />
        </Form.Item>
      )
    },
    {
      title: 'Disc',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'discount']}>
          <Input size="small" variant="borderless" onChange={(value) => handleDiscountChange(value, record.key)} />
        </Form.Item>
      )
    },
    {
      title: 'Disc Reason',
      dataIndex: 'discountReason',
      key: 'discountReason',
      width: 150,
      render: (text, record) => (
        <Form.Item name={[record.key, 'discountReason']}>
          <Input size="small" variant="borderless" />
        </Form.Item>
      )
    },
    {
      title: 'Net Amt',
      dataIndex: 'NetAmount',
      key: 'NetAmount',
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'NetAmount']} rules={[{ required: true, message: 'Add the amount' }]}>
          <Input size="small" variant="borderless" />
        </Form.Item>
      )
    },
    {
      title: <Button type="default" htmlType="submit" icon={<PlusOutlined />} onClick={handleAdd}></Button>,
      dataIndex: 'add',
      key: 'add',
      width: 50,
      render: (text, record) => <Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    }
  ];

  const dataSource = [
    {
      key: '1',
      name: 'John Doe',
      age: 32,
      address: '10 Downing Street'
    }
    // ... more data
  ];

  const handleReset = () => {
    form.resetFields();
    setOptions([]);
  };

  const handleOnSubmit = (values) => {
    debugger;
    // form.resetFields();
  };

  // Define the columns for the table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    }
    // ... more columns
  ];

  return (
    <>
      <Layout style={{ zIndex: '999999999' }}>
        <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
          <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
            <Col span={16}>
              <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                Billing
              </Title>
            </Col>
          </Row>

          <div style={{ width: '100%', backgroundColor: '#d9d9d9', height: '70px', borderRadius: '0px 0px 10px 10px ' }}>
            <Form
              layout="vertical"
              // onFieldsChange={handleFieldChange}
              // onFinish={handleOnSubmit}
              // variant="outlined"
              initialValues={{
                ConsultantCharges: 0,
                ServiceCharges: 0,
                InvestigationCharges: 0,
                totalAmount: 0,
                Discount: 0,
                NetAmount: 0
              }}
              size="small"
              form={form1}
            >
              <Row gutter={{ xs: 8, ms: 16, md: 25, lg: 32 }}>
                <Col className="gutter-row" span={3} style={{ marginLeft: '10px' }}>
                  <Form.Item name="ConsultantCharges" label="Cons Chrgs">
                    <Input style={{ border: '2px solid black' }} size="small" value={totalConsultationsCharges} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={3}>
                  <Form.Item name="ServiceCharges" label="Serv Chrgs">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={3}>
                  <Form.Item name="InvestigationCharges" label="Test Chrgs">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={3}>
                  <Form.Item name="totalAmount" label="TotBillAmt">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={2}>
                  <Form.Item name="viewItemDiscount" label="Item Disc">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={2}>
                  <Form.Item name="ViewBillDiscount" label="Bill Disc">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={2}>
                  <Form.Item name="Discount" label="Tot Disc">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>

                <Col className="gutter-row" span={3}>
                  <Form.Item name="NetAmount" label="Net BillAmt">
                    <Input style={{ border: '2px solid black' }} size="small" value={NetAmount} />
                  </Form.Item>
                </Col>

                <Col className="gutter-row" span={2}>
                  <Form.Item name="BalanceAmount" label="Bal Amt">
                    <Input style={{ border: '2px solid black' }} size="small" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={23} style={{ marginLeft: '20px', marginTop: ' 20px' }}>
              <PatientHeaderSingle patientdata={patientdata} encounterId={encounterId} />
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={24}>
              <Tabs type="card" defaultActiveKey={defaultActiveKey}>
                <TabPane tab="Consultants" key="1041">
                  <Form
                    layout="vertical"
                    onFinish={handleOnSubmit}
                    // variant="outlined"
                    size="small"
                    form={form}
                  >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col className="gutter-row" span={22} offset={1}>
                        <Table
                          dataSource={consultationdetails}
                          columns={consultantsColumns}
                          className="custom-table"
                          // rowKey={(row) => row.PatientId}
                          size="small"
                          // onChange={(pagination) => {
                          //   setCurrentPage(pagination.current);
                          //   setItemsPerPage(pagination.pageSize);
                          // }}
                          bordered
                        />
                      </Col>
                      {/* <Col className="gutter-row" span={1}></Col> */}
                    </Row>
                    <Row justify="end" style={{ padding: '0rem 1rem' }}>
                      <Col style={{ marginRight: '10px' }}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
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
                </TabPane>
                <TabPane tab="Services" key="2">
                  <Table dataSource={dataSource} columns={columns} className="custom-table" size="small" />
                </TabPane>
                <TabPane tab="Investigations" key="3">
                  <Table dataSource={dataSource} columns={columns} />
                </TabPane>
                <TabPane tab="Payments" key="4">
                  <Table dataSource={dataSource} columns={columns} />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </Layout>
    </>
  );
};
export default BillingCreate;
