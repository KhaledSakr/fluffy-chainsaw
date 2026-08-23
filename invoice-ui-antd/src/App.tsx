import React from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { UserOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons'; // Removed HistoryOutlined
import { Routes, Route, Link, useLocation } from 'react-router-dom';
// Removed InvoiceGenerator import as it's now modal-based
import MyInvoicesList from './features/my-invoices/MyInvoicesList'; // Renamed import
import UserProfile from './features/profile/UserProfile';
import RecipientManagement from './features/recipients/RecipientManagement';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// Helper function to determine selected key based on path
const getSelectedKey = (pathname: string): string => {
  // Removed history check
  if (pathname.startsWith('/recipients')) return '2'; // Key is now '2'
  if (pathname.startsWith('/profile')) return 'profile';
  return '1'; // Default to My Invoices
};

function App() {
  const location = useLocation();
  const selectedKey = getSelectedKey(location.pathname);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '0 24px' }}>
        <Title level={3} style={{ margin: 0 }}>Invoice Master</Title>
        <Link to="/profile">
          <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} />
        </Link>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<FileTextOutlined />}> {/* Updated Icon/Text */}
              <Link to="/">My Invoices</Link> {/* Updated Path/Text */}
            </Menu.Item>
            {/* Removed Invoice History */}
            <Menu.Item key="2" icon={<TeamOutlined />}> {/* Key is now '2' */}
              <Link to="/recipients">Recipients</Link>
            </Menu.Item>
            {/* Profile link is in the header */}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: '16px 0 0 0',
              minHeight: 280,
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            <Routes>
              <Route path="/" element={<MyInvoicesList />} /> {/* Root path now shows MyInvoicesList */}
              {/* Removed /history route */}
              {/* Removed /my-invoices/new route as generator is modal */}
              <Route path="/recipients" element={<RecipientManagement />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;

