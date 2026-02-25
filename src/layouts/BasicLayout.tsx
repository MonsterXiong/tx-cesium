/**
 * 基础布局组件
 * 带侧边栏和头部的标准布局，支持多级菜单
 */

import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Switch, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { appConfig } from '@/config'
import { useThemeStore, useAppStore } from '@/stores'
import { menuConfig, menuToAntdItems } from '@/routes/menu'

const { Header, Sider, Content } = Layout

/**
 * 递归查找菜单项的所有父级 key
 * @param items 菜单配置
 * @param targetPath 目标路径
 * @param parentKeys 父级 key 数组
 * @returns 父级 key 数组
 */
function findParentKeys(
  items: typeof menuConfig,
  targetPath: string,
  parentKeys: string[] = []
): string[] {
  for (const item of items) {
    const currentKey = item.path || item.id
    if (item.path === targetPath) {
      return parentKeys
    }
    if (item.children?.length) {
      const found = findParentKeys(item.children, targetPath, [...parentKeys, currentKey])
      if (found.length > parentKeys.length) {
        return found
      }
    }
  }
  return parentKeys
}

/**
 * 基础布局组件
 * @returns React 组件
 */
const BasicLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { mode, toggleMode } = useThemeStore()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const systemTitle = appConfig.systemName
  const systemIconText = appConfig.systemIconText || ''
  const systemIconUrl = appConfig.systemIconUrl

  // 从菜单配置生成 Antd Menu items（支持多级）
  const menuItems = menuToAntdItems(menuConfig)

  // 计算当前展开的子菜单
  const openKeys = findParentKeys(menuConfig, location.pathname)

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  /**
   * 菜单点击处理
   * @param key 菜单项 key（路由路径）
   */
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    // 检查是否为外链
    const findMenuItem = (items: typeof menuConfig, targetKey: string): (typeof menuConfig)[0] | null => {
      for (const item of items) {
        if (item.path === targetKey || item.id === targetKey) {
          return item
        }
        if (item.children?.length) {
          const found = findMenuItem(item.children, targetKey)
          if (found) return found
        }
      }
      return null
    }

    const menuItem = findMenuItem(menuConfig, key)
    if (menuItem?.external && menuItem.externalUrl) {
      window.open(menuItem.externalUrl, menuItem.target || '_blank')
    } else {
      navigate(key)
    }
  }

  /**
   * 用户菜单点击处理
   * @param key 菜单项 key
   */
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      console.log('[DEBUG_APP] 用户退出登录')
      // 这里可以添加退出登录逻辑
    }
  }

  /**
   * 渲染系统图标
   * @returns 系统图标节点
   */
  const renderSystemIcon = (): React.ReactNode => {
    if (systemIconUrl) {
      return (
        <img
          src={systemIconUrl}
          alt={systemTitle}
          className="w-6 h-6 object-contain"
        />
      )
    }
    return <span className="text-xl leading-none">{systemIconText}</span>
  }

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <Sider trigger={null} collapsible collapsed={sidebarCollapsed} className="shadow-md">
        <div className="h-16 text-[var(--color-text-heading)] font-bold">
          {sidebarCollapsed ? (
            <div className="h-full flex-center">{renderSystemIcon()}</div>
          ) : (
            <div className="h-full flex items-center gap-2 px-4">
              <span className="flex-center w-7 h-7 rounded-md bg-[var(--color-primary-bg)] overflow-hidden">
                {renderSystemIcon()}
              </span>
              <span className="text-lg truncate">{systemTitle}</span>
            </div>
          )}
        </div>
        <Menu
          theme={mode === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={sidebarCollapsed ? [] : openKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* 头部 */}
        <Header className="bg-bg-container border-b border-border flex-between px-4 shadow-sm">
          <div className="flex items-center">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              className="text-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* 主题切换 */}
            <div className="flex items-center gap-2">
              <SunOutlined className={mode === 'light' ? 'text-primary' : ''} />
              <Switch
                checked={mode === 'dark'}
                onChange={toggleMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
              <MoonOutlined className={mode === 'dark' ? 'text-primary' : ''} />
            </div>

            {/* 用户信息 */}
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <Button type="text" icon={<UserOutlined />}>
                用户
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="m-2 bg-bg-container rounded-lg h-[calc(100vh-112px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
