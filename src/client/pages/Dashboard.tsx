import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, LineChart, BarChart } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state: any) => state.analytics);

  useEffect(() => {
    // Fetch analytics stats
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Requests"
              value={stats?.totalRequests || 0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Response Time"
              value={stats?.averageResponseTime || 0}
              suffix="ms"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={stats?.successRate || 0}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bandwidth Used"
              value={stats?.bandwidthUsed || 0}
              suffix="bytes"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Requests Over Time" loading={loading}>
            {/* LineChart component */}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Status Codes" loading={loading}>
            {/* BarChart component */}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
