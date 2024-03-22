import customAxios from '../Patient/FormsUI/CustomAxios';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlGetPurchaseOrderDetails } from 'endpoints.ts';
import Select from 'antd/es/select';
import { Col, Divider, Row, Spin } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { PlusCircleOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import moment from 'moment';

const PurchaseOrder = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: []
    // PurchaseListMessage: []
  });
  const [form] = Form.useForm();
  const { Title } = Typography;
  const navigate = useNavigate();
  const today = moment();
  const yesterday = moment().subtract(1, 'days');
  const [isloading, setLoading] = useState(true);

  useEffect(() => {
    debugger;
    customAxios.get(urlGetPurchaseOrderDetails).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
      setLoading(false);
    });
  }, []);

  const handleReset = () => {
    form.resetFields();
  };

  const handleToCreatePurchaseOrder = () => {
    const url = `/CreatePurchaseOrder`;
    // Navigate to the new URL
    navigate(url);
  };

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
                  Purchase Order
                </Title>
              </Col>
              <Col offset={6} span={2}>
                <Button icon={<PlusCircleOutlined />} style={{ marginBottom: 0 }} onClick={handleToCreatePurchaseOrder}>
                  ADD PO
                </Button>
              </Col>
            </Row>

            <Form
              layout="vertical"
              //onFinish={handleOnFinish}
              variant="outlined"
              size="default"
              style={{
                maxWidth: 1500
              }}
              initialValues={{
                FromDate: yesterday,
                ToDate: today
              }}
              form={form}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem' }}>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="Document Type" name="DocumentType" style={{ marginLeft: '10px' }}>
                      <Select allowClear>
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
                    <Form.Item label="Supplier" name="SupplierList">
                      <Select allowClear>
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
                    <Form.Item label="From Date " name="FromDate">
                      <DatePicker style={{ width: '100%' }} format={'DD-MM-YYYY'} />
                    </Form.Item>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="To Date" name="ToDate">
                      <DatePicker style={{ width: '95%' }} format={'DD-MM-YYYY'} />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '0rem 2rem' }}>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="Procurement Store " name="StoreDetails" style={{ marginLeft: '10px' }}>
                      <Select allowClear>
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
                    <Form.Item label="PO Number " name="PONumber">
                      <Input />
                    </Form.Item>
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div>
                    <Form.Item label="PO Status " name="POStatus">
                      <Select />
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
            </Form>
          </div>
        </Layout>
      )}
    </>
  );
};
export default PurchaseOrder;
