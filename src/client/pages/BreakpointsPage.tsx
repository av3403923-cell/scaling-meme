import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

function BreakpointsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { breakpoints, loading } = useSelector((state: any) => state.breakpoints);

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Condition', dataIndex: 'condition', ellipsis: true },
    { title: 'Match Type', dataIndex: 'matchType' },
    { title: 'Action', dataIndex: 'action' },
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
        New Breakpoint
      </Button>
      <Table columns={columns} dataSource={breakpoints} loading={loading} />
      <Modal title="Create Breakpoint" open={modalVisible} onCancel={() => setModalVisible(false)}>
        <Form form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Condition" name="condition" rules={[{ required: true }]}>
            <Input placeholder="URL pattern or regex" />
          </Form.Item>
          <Form.Item label="Match Type" name="matchType" rules={[{ required: true }]}>
            <Select options={[{ label: 'Contains', value: 'contains' }, { label: 'Regex', value: 'regex' }, { label: 'Exact', value: 'exact' }]} />
          </Form.Item>
          <Form.Item label="Action" name="action" rules={[{ required: true }]}>
            <Select options={[{ label: 'Pause', value: 'pause' }, { label: 'Modify', value: 'modify' }, { label: 'Block', value: 'block' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BreakpointsPage;
