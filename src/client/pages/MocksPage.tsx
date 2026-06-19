import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

function MocksPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { mocks, loading } = useSelector((state: any) => state.mocks);

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'URL Pattern', dataIndex: 'urlPattern', ellipsis: true },
    { title: 'Status Code', dataIndex: 'statusCode' },
    { title: 'Method', dataIndex: 'method' },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} style={{ marginBottom: '16px' }}>
        New Mock
      </Button>
      <Table columns={columns} dataSource={mocks} loading={loading} />
      <Modal title="Create Mock" open={modalVisible} onCancel={() => setModalVisible(false)}>
        <Form form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="URL Pattern" name="urlPattern" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Status Code" name="statusCode" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item label="Method" name="method">
            <Select options={[{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }]} />
          </Form.Item>
          <Form.Item label="Response Body" name="responseBody">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MocksPage;
