import customAxios from '../Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlAutoCompleteProduct, urlAddNewPurchaseOrder } from 'endpoints.ts';
import Select from 'antd/es/select';
import { Col, Divider, Row, AutoComplete } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker, Spin } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const CreatePurchaseOrder = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: []
  });

  let [idCounter, setCounter] = useState(0);

  /*   const initialdata = [
    {
      key: idCounter.toString(),
      product: '',
      uom: '',
      poQty: '',
      bounsQty: '',
      poRate: '',
      discount: '',
      discountAmt: '',
      expectedMRP: '',
      cgst: '',
      cgstAmt: '',
      sgst: '',
      sgstAmt: '',
      amount: '',
      totalAmount: '',
      avlQty: '',
      deliverySchedule: ''
    }
  ];
 */
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [date, setDate] = useState();
  const today = moment();
  const [options, setOptions] = useState([]);

  const [inputValues, setInputValues] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUom, setSelectedUom] = useState({});

  const [autoCompleteOptions, setAutoCompleteOptions] = useState({});

  const [productIds, setProductIds] = useState({});

  const [isfirstRowCreated, setisfirstRowCreated] = useState(false);
  const [isloading, setLoading] = useState(true);

  useEffect(() => {
    debugger;
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
      handleAdd();
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    debugger;
    const fetchData = async () => {
      try {
        Object.entries(inputValues).forEach(async ([key, value]) => {
          if (value) {
            const response = await customAxios.get(`${urlAutoCompleteProduct}?Product=${value}`);
            const apiData = response.data.data;
            const newOptions = apiData.map((item) => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));

            setAutoCompleteOptions((prevState) => ({ ...prevState, [key]: newOptions }));
          }
        });
      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchData();
  }, [inputValues]);

  const handleReset = () => {
    form.resetFields();
  };

  const handleToPurchaseOrder = () => {
    const url = '/purchaseOrder';
    navigate(url);
  };

  const handleDelete = (record) => {
    const newData = data.filter((item) => item.key !== record.key);
    setData(newData);
  };

  const handleInputChange = (value, key) => {
    debugger;
    setInputValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleOnFinish = async (values) => {
    debugger;
    console.log('form values', values);

    const products = [];
    //? dayjs(`${currentDate}`).format(dateFormat) : values.PODate,
    // Create the PurchaseOrderModel for the header
    const purchaseOrder = {
      SupplierList: values.SupplierList === undefined ? '' : values.SupplierList,
      StoreDetails: values.StoreDetails === undefined ? '' : values.StoreDetails,
      DocumentType: values.DocumentType === undefined ? '' : values.DocumentType,
      PurchaseDate: values.PODate,

      PoStatus: values.POStatus === undefined ? 'created' : values.POStatus,
      Remarks: values.Remarks === undefined ? null : values.Remarks
    };

    // Create the list of PurchaseOrderModel for the products
    for (let i = 1; i <= idCounter; i++) {
      if (values[i] !== undefined) {
        values[i].product = productIds[i];
        const product = {
          productId: values[i].product,
          UomId: values[i].uom,
          PoQuantity: values[i].poQty,
          BonusQuantity: values[i].bounsQty === '' ? null : values[i].bounsQty,
          PoRate: values[i].poRate === '' ? null : values[i].poRate,
          DiscountRate: values[i].discount === '' ? null : values[i].discount,
          DiscountAmount: values[i].discountAmt === '' ? null : values[i].discountAmt,
          MrpExpected: values[i].expectedMRP === '' ? null : values[i].expectedMRP,
          TaxType1: values[i].cgst === '' ? null : values[i].cgst,
          TaxAmount1: values[i].cgstAmt === '' ? null : values[i].cgstAmt,
          TaxType2: values[i].sgst === '' ? null : values[i].sgst,
          TaxAmount2: values[i].sgstAmt === '' ? null : values[i].sgstAmt,
          LineAmount: values[i].amount === '' ? null : values[i].amount,
          PoTotalAmount: values[i].totalAmount === '' ? null : values[i].totalAmount,
          AvailableQuantity: values[i].avlQty === '' ? null : values[i].avlQty
        };
        products.push(product);
      }
    }

    //binding two parameter of list into one parameter
    const postdata = {
      newPurchaseOrderModel: purchaseOrder,
      PurchaseOrderDetails: products
    };

    // Call the API method
    try {
      const response = await customAxios.post(urlAddNewPurchaseOrder, postdata, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleSelect = (value, option, key) => {
    debugger;
    // Update the product value in the form
    form.setFieldsValue({ [key]: { product: value } });

    setProductIds((prevState) => ({ ...prevState, [key]: option.key }));

    // Set the selected UOM based on the selected product
    const matchingUom = DropDown.UOM.find((uomOption) => uomOption.UomId === option.UomId);

    if (matchingUom) {
      // If a matching UomId is found, set this as the selected Uom
      setSelectedUom((prevState) => {
        const newState = { ...prevState, [key]: matchingUom.UomId };
        console.log(newState); // Log the new state
        return newState;
      });

      // Update the UOM value in the form
      form.setFieldsValue({ [key]: { uom: matchingUom.UomId } });
    } else {
      // If no matching UomId is found, clear the selected Uom
      setSelectedUom((prevState) => {
        const newState = { ...prevState, [key]: null };
        console.log(newState); // Log the new state
        return newState;
      });

      // Clear the UOM value in the form
      form.setFieldsValue({ [key]: { uom: null } });
    }
  };

  useEffect(() => {
    debugger;
    console.log(selectedUom); // log the current state
  }, [selectedUom]); // run this effect whenever selectedUom changes

  const handleAdd = async () => {
    debugger;
    if (isfirstRowCreated) {
      setCounter(idCounter + 1);
      const newRowFields = form.validateFields().then(() => {
        const newRow = {
          key: (idCounter + 1).toString(),
          product: '',
          uom: '',
          poQty: '',
          bounsQty: '',
          poRate: '',
          discount: '',
          discountAmt: '',
          expectedMRP: '',
          cgst: '',
          cgstAmt: '',
          sgst: '',
          sgstAmt: '',
          amount: '',
          totalAmount: '',
          avlQty: '',
          deliverySchedule: ''
        }; // Define your new row data here
        setData([...data, newRow]);
      });
      form.setFieldsValue({
        [newRow.key]: newRowFields[newRow.key]
      });
    } else {
      // Validate the form fields for the newly added row

      setCounter(idCounter + 1);
      const newRow = {
        key: (idCounter + 1).toString(),
        product: '',
        uom: '',
        poQty: '',
        bounsQty: '',
        poRate: '',
        discount: '',
        discountAmt: '',
        expectedMRP: '',
        cgst: '',
        cgstAmt: '',
        sgst: '',
        sgstAmt: '',
        amount: '',
        totalAmount: '',
        avlQty: '',
        deliverySchedule: ''
      };

      // Define your new row data here
      setData([...data, newRow]);

      setisfirstRowCreated(true);
    }
  };

  const columns = [
    {
      title: 'Product',
      width: 200,
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => (
        <Form.Item
          name={[record.key, 'product']}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <AutoComplete
            options={autoCompleteOptions[record.key]}
            onSearch={(value) => handleInputChange(value, record.key)}
            onSelect={(value, option) => handleSelect(value, option, record.key)}
            placeholder="Search for a product"
          />
        </Form.Item>
      )
    },
    {
      title: 'UOM',
      width: 100,
      dataIndex: 'uom',
      key: 'uom',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'uom']}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <Select value={selectedUom[record.key]}>
            <Option value="">Select Value</Option>
            {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.FullName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'PO Qty',
      dataIndex: 'poQty',
      width: 100,
      key: 'poQty',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'poQty']}
          initialValue={text}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <InputNumber />
        </Form.Item>
      )
    },
    {
      title: 'Bonus Qty',
      dataIndex: 'bounsQty',
      width: 100,
      key: 'bounsQty',
      render: (text, record) => (
        <Form.Item name={[record.key, 'bounsQty']} initialValue={text}>
          <InputNumber />
        </Form.Item>
      )
    },
    {
      title: 'PO Rate',
      dataIndex: 'poRate',
      width: 100,
      key: 'poRate',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'poRate']}
          initialValue={text}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <InputNumber />
        </Form.Item>
      )
    },
    {
      title: 'Discount%',
      dataIndex: 'discount',
      width: 100,
      key: 'discount',
      render: (text, record) => (
        <Form.Item name={[record.key, 'discount']} initialValue={text}>
          <InputNumber />
        </Form.Item>
      )
    },
    {
      title: 'Discount Amount',
      dataIndex: 'discountAmt',
      width: 120,
      key: 'discountAmt',
      render: (text, record) => (
        <Form.Item name={[record.key, 'discountAmt']} initialValue={text}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'ExpectedMRP',
      dataIndex: 'expectedMRP',
      width: 100,
      key: 'expectedMRP',
      render: (text, record) => (
        <Form.Item name={[record.key, 'expectedMRP']} initialValue={text}>
          <InputNumber />
        </Form.Item>
      )
    },
    {
      title: 'CGST',
      dataIndex: 'cgst',
      width: 100,
      key: 'cgst',
      render: (text, record) => (
        <Form.Item name={[record.key, 'cgst']} initialValue={text}>
          <Select>
            <Option value="">Select value</Option>
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'CGST Amount',
      dataIndex: 'cgstAmt',
      width: 100,
      key: 'cgstAmt',
      render: (text, record) => (
        <Form.Item name={[record.key, 'cgstAmt']} initialValue={text}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'SGST',
      dataIndex: 'sgst',
      width: 100,
      key: 'sgst',
      render: (text, record) => (
        <Form.Item name={[record.key, 'sgst']} initialValue={text}>
          <Select>
            <Option value="">Select Value</Option>
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'SGST Amount',
      dataIndex: 'sgstAmt',
      width: 100,
      key: 'sgstAmt',
      render: (text, record) => (
        <Form.Item name={[record.key, 'sgstAmt']} initialValue={text}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      key: 'amount',
      render: (text, record) => (
        <Form.Item name={[record.key, 'amount']} initialValue={text}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      width: 100,
      key: 'totalAmount',
      render: (text, record) => (
        <Form.Item name={[record.key, 'totalAmount']} initialValue={text}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'Avl Qty',
      dataIndex: 'avlQty',
      width: 100,
      key: 'avlQty',
      render: (text, record) => (
        <Form.Item name={[record.key, 'avlQty']} initialValue={text}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'Delivery Schedule',
      dataIndex: 'deliverySchedule',
      width: 150,
      key: 'deliverySchedule',
      render: () => <a>Delivery Schedule</a>
    },
    {
      title: <Button type="primary" htmlType="submit" icon={<PlusOutlined />} onClick={handleAdd}></Button>,
      dataIndex: 'add',
      key: 'add',
      width: 50,
      render: (text, record) => <Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    }
  ];

  return (
    <>
      {isloading ? (
        // Skeleton Loading for Header
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Spin tip="Loading" size="large" style={{ textAlign: 'center' }}>
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <Layout style={{ zIndex: '999999999' }}>
          <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
            <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
              <Col span={16}>
                <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                  Create Purchase Order
                </Title>
              </Col>
              <Col offset={6} span={2}>
                <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleToPurchaseOrder}>
                  Back
                </Button>
              </Col>
            </Row>
            <Form
              layout="vertical"
              onFinish={handleOnFinish}
              variant="outlined"
              size="default"
              style={{
                maxWidth: 1500
              }}
              form={form}
              initialValues={{
                PODate: today
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item
                      label="Supplier"
                      name="SupplierList"
                      rules={[
                        {
                          required: true,
                          message: 'Please input!'
                        }
                      ]}
                    >
                      <Select allowClear>
                        <Option value="">Select Value</Option>
                        {DropDown.SupplierList.map((option) => (
                          <Select.Option key={option.VendorId} value={option.VendorId}>
                            {option.LongName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item
                      label="Procurement Store "
                      name="StoreDetails"
                      style={{ marginLeft: '10px' }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input!'
                        }
                      ]}
                    >
                      <Select allowClear>
                        <Option value="">Select Value</Option>
                        {DropDown.StoreDetails.map((option) => (
                          <Select.Option key={option.StoreServiceId} value={option.StoreServiceId}>
                            {option.StoreType}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item
                      label="Document Type"
                      name="DocumentType"
                      style={{ marginLeft: '10px' }}
                      rules={[
                        {
                          required: true,
                          message: 'Please input!'
                        }
                      ]}
                    >
                      <Select allowClear>
                        <Option value="">Select Value</Option>
                        {DropDown.DocumentType.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="Remarks" name="Remarks" style={{ marginLeft: '10px' }}>
                      <TextArea autoSize />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '0rem 2rem', marginTop: '0' }}>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="PO Date" name="PODate" style={{ marginLeft: '10px' }}>
                      <DatePicker defaultValue={date} style={{ width: '100%' }} format={'DD-MM-YYYY'} disabled />
                    </Form.Item>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="PO Status" name="POStatus">
                      <Select allowClear>
                        {' '}
                        <Option value="">Select Value</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
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

              <Divider style={{ marginTop: '0' }}></Divider>

              <Table columns={columns} dataSource={data} scroll={{ x: 2700 }} />
            </Form>
          </div>
        </Layout>
      )}
    </>
  );
};

// ReactDOM.render(<Edit, mountNode);
export default CreatePurchaseOrder;
