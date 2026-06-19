import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Switch, Space } from 'antd';
import { BugOutlined, DatabaseOutlined, SettingOutlined, LogoutOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import RequestsPage from './pages/RequestsPage';
import BreakpointsPage from './pages/BreakpointsPage';
import MocksPage from './pages/MocksPage';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'requests':
        return <RequestsPage />;
      case 'breakpoints':
        return <BreakpointsPage />;
      case 'mocks':
        return <MocksPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
        <div className="logo" style={{ color: 'white', padding: '16px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          🔍 HTTP Toolkit
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={[
            { key: 'dashboard', icon: <DatabaseOutlined />, label: 'Dashboard' },
            { key: 'requests', icon: <BugOutlined />, label: 'Requests' },
            { key: 'breakpoints', icon: <SettingOutlined />, label: 'Breakpoints' },
            { key: 'mocks', icon: <SettingOutlined />, label: 'Mocks' },
          ]}
          onClick={(e) => setCurrentPage(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Button type="text" onClick={() => setCollapsed(!collapsed)} />
          <Space>
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
            <Button type="text" danger icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
