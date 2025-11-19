import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    GiftOutlined,
    BranchesOutlined,
    DollarCircleOutlined,
    LogoutOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";

const { Header, Sider, Content } = Layout;
const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    const cookies = new Cookies();

    const { pathname } = useLocation();
    const logoutFunc = () => {
        sessionStorage.removeItem("userInfo");
        cookies.remove("authToken");
        navigate("/");
    }
    console.log(pathname);
    const items = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/currency',
            icon: <DollarCircleOutlined />,
            label: <Link to="/admin/currency">Currency</Link>,
        },
        {
            key: '/admin/branch',
            icon: <BranchesOutlined />,
            label: <Link to="/admin/branch">Branch</Link>,
        },

        {
            key: '/admin/branding',
            icon: <GiftOutlined />,
            label: <Link to="/admin/branding">Brandings</Link>
        },
        {
            key: '/admin/new-employee',
            icon: <UserOutlined />,
            label: <Link to="/admin/new-employee">New Employee</Link>
        },
        {
            key: '/admin/new-account',
            icon: <UserAddOutlined />,
            label: <Link to="/admin/new-account">New Account</Link>
        },
        {
            key: '/admin/new-transaction',
            icon: <UserAddOutlined />,
            label: <Link to="/admin/new-transaction">New Transaction</Link>
        },
        {
            key: '/admin/logout',
            icon: <LogoutOutlined />,
            label: <Button
                type="text"
                className="!text-gray-300 !font-semibold"
                onClick={logoutFunc}

            >Logout</Button>
        }
    ];
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout className="!min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[pathname]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;