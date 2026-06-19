import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Input, Select, Tabs } from 'antd';
import { DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

function RequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state: any) => state.requests);

  const columns = [
    { title: 'Method', dataIndex: 'method', width: 80 },
    { title: 'URL', dataIndex: 'url', ellipsis: true },
    { title: 'Status', dataIndex: 'statusCode', width: 80 },
    { title: 'Duration', dataIndex: 'duration', width: 100, render: (val: number) => `${val}ms` },
    {
      title: 'Actions',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedRequest(record); setDetailsVisible(true); }} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: '16px' }}>
        <Input placeholder="Search URL..." style={{ width: '300px' }} />
        <Select placeholder="Filter by status" style={{ width: '200px' }} />
        <Button icon={<DownloadOutlined />}>Export</Button>
      </Space>
      <Table columns={columns} dataSource={requests} loading={loading} pagination={{ pageSize: 50 }} />
      <Modal title="Request Details" open={detailsVisible} onCancel={() => setDetailsVisible(false)} width={900}>
        <Tabs>
          <Tabs.TabPane tab="Headers" key="headers">
            {/* Headers details */}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Body" key="body">
            {/* Body details */}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Response" key="response">
            {/* Response details */}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

export default RequestsPage;
