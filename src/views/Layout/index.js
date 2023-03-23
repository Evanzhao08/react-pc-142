import React, { useEffect } from "react"
import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from "@/store"
import { observer } from "mobx-react-lite"

const { Header, Sider } = Layout

const GeekLayout = () => {
  const { pathname } = useLocation()
  const { userStore, loginStore, channelStore } = useStore()
  const itemList = [
    { label: '数据概览', icon: HomeOutlined, key: '/' },
    { label: '内容管理', icon: DiffOutlined, key: '/article' },
    { label: '发布文章', icon: EditOutlined, key: '/publish' }
  ]

  useEffect(() => {
    userStore.getUserInfo()
    channelStore.loadChannelList()
  }, [userStore, channelStore])
  //确定退出 
  const navigate = useNavigate()
  const confirm = () => {
    loginStore.loginOut()
    navigate('/login')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.useInfo.name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" onConfirm={confirm} okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={itemList.map(
              ({ icon, label, key }) => ({
                key,
                icon: React.createElement(icon),
                label: <Link to={key}>{label}</Link>,
              }),
            )}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/*  二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout) 