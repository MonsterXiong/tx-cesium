---
name: create-page
description: 在项目中创建新页面组件并注册路由。当用户要求新建页面、添加页面模块、创建新路由时使用。
---

# 创建新页面

## 步骤

### 1. 创建页面目录和组件

在 `src/pages/` 下创建 **kebab-case** 命名的目录，主文件为 `index.tsx`（或 `index.jsx`）。

页面组件模板：

```tsx
/**
 * 页面名称
 * 页面功能描述
 */

const XxxPage = () => {
  return (
    <div className="fade-in">
      页面内容
    </div>
  )
}

export default XxxPage
```

如果页面有专用子组件，放在 `src/pages/页面名/components/` 目录下。

### 2. 注册路由

在 `src/routes/config.tsx` 中完成三处修改：

**a) 顶部添加 lazy import：**

```tsx
const XxxPage = lazy(() => import('@/pages/xxx-page'))
```

> 如果是 `.jsx` 文件，import 路径需要带扩展名：`import('@/pages/xxx-page/index.jsx')`

**b) 在 `routeConfig` 数组中添加配置：**

```tsx
{
  path: '/xxx-page',
  meta: {
    title: '页面标题',
    icon: <XxxOutlined />,  // 从 @ant-design/icons 选择合适图标
  },
},
```

**c) 在 `routeComponents` 映射中添加：**

```tsx
'/xxx-page': XxxPage,
```
