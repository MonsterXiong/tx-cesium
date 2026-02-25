<<<<<<< HEAD
# react-template
=======
# React Template

基于 React 18 + Vite 5 + Antd 6 + Cesium + TypeScript 的现代化前端框架

## ✨ 特性

- 🚀 **极速开发**: Vite 5 提供极致的开发体验
- 📦 **开箱即用**: 内置路由、状态管理、主题系统等常用功能
- 🎨 **现代化 UI**: Ant Design 6 企业级组件库
- 🗺️ **3D 地图**: 集成 Cesium 3D 地图引擎
- 🎯 **TypeScript**: 完整的类型支持
- 🎨 **UnoCSS**: 高性能原子化 CSS
- 🌈 **主题切换**: 支持亮色/暗色主题
- 📱 **响应式**: 适配各种屏幕尺寸

## 📦 技术栈

### 核心框架
- React 18.x
- TypeScript 5.x
- Vite 5.x

### UI 组件库
- Ant Design 6.x

### 路由管理
- React Router v6.x (配置式路由)

### 状态管理
- Zustand 4.x (轻量级状态管理)

### CSS 方案
- UnoCSS (原子化 CSS)
- CSS Variables (主题系统)

### 地图引擎
- Cesium 1.x

### 其他
- Axios (HTTP 请求)
- dayjs (日期处理)

## 🚀 快速开始

### 安装依赖

\`\`\`bash
npm install
# 或
pnpm install
# 或
yarn install
\`\`\`

### 开发环境

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 预览生产版本

\`\`\`bash
npm run preview
\`\`\`

### 代码检查

\`\`\`bash
npm run lint
\`\`\`

## 📁 项目结构

\`\`\`
react-template/
├── public/                 # 静态资源
├── src/
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   ├── pages/             # 页面组件
│   │   ├── home/         # 首页
│   │   ├── dashboard/    # 仪表盘
│   │   ├── cesium-view/  # Cesium 地图页面
│   │   └── not-found/    # 404 页面
│   ├── layouts/           # 布局组件
│   │   ├── BasicLayout.tsx    # 基础布局
│   │   └── BlankLayout.tsx    # 空白布局
│   ├── components/        # 通用组件
│   │   ├── common/       # 基础组件
│   │   └── business/     # 业务组件
│   ├── routes/            # 路由配置
│   │   ├── index.tsx     # 路由主配置
│   │   └── config.tsx    # 路由元信息
│   ├── stores/            # Zustand 状态管理
│   │   ├── useUserStore.ts    # 用户状态
│   │   ├── useThemeStore.ts   # 主题状态
│   │   ├── useAppStore.ts     # 应用状态
│   │   └── index.ts           # 统一导出
│   ├── services/          # API 服务层
│   │   ├── request.ts    # Axios 封装
│   │   └── api/          # API 接口
│   ├── hooks/             # 自定义 Hooks
│   │   ├── useTheme.ts   # 主题 Hook
│   │   └── useCesium.ts  # Cesium Hook
│   ├── cesium/            # Cesium 封装
│   │   ├── CesiumViewer.tsx   # Viewer 组件
│   │   ├── config.ts          # Cesium 配置
│   │   └── utils/             # 工具函数
│   ├── utils/             # 工具函数
│   │   ├── storage.ts    # 本地存储
│   │   └── helpers.ts    # 辅助函数
│   ├── styles/            # 全局样式
│   │   ├── variables.css # CSS Variables
│   │   ├── reset.css     # 样式重置
│   │   └── global.css    # 全局样式
│   └── types/             # TypeScript 类型
│       ├── global.d.ts   # 全局类型
│       └── api.d.ts      # API 类型
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
├── uno.config.ts          # UnoCSS 配置
├── package.json           # 依赖配置
└── docs/                  # 项目文档
    ├── 文档导航.md        # 文档导航（从这里开始）
    ├── 快速开始.md        # 快速开始指南
    ├── 项目概览.md        # 项目架构说明
    └── ...                # 更多文档
\`\`\`

## 🔧 配置说明

### 环境变量

创建 \`.env.development\` 和 \`.env.production\` 文件：

\`\`\`env
# 应用配置
VITE_APP_TITLE=React Template
VITE_APP_BASE_API=/api

# Cesium 配置
VITE_CESIUM_BASE_URL=/cesium
VITE_CESIUM_ACCESS_TOKEN=your_token_here
\`\`\`

### Cesium Token

1. 访问 [Cesium Ion](https://ion.cesium.com/)
2. 注册账号并创建 Access Token
3. 将 Token 配置到环境变量中

## 📚 文档

更多详细文档请查看 [docs/文档导航.md](./docs/文档导航.md)

- 📖 [快速开始](./docs/快速开始.md) - 详细的快速开始指南
- 🏗️ [项目概览](./docs/项目概览.md) - 完整的项目架构说明
- 📝 [代码规范](./docs/代码规范.md) - 代码开发规范
- 🌐 [内网部署](./docs/内网部署说明.md) - 内网环境部署指南

## 📝 开发指南

### 添加新页面

1. 在 \`src/pages/\` 目录下创建页面组件
2. 在 \`src/routes/config.tsx\` 中添加路由配置
3. 在 \`src/routes/config.tsx\` 中添加组件映射

### 添加新的状态管理

1. 在 \`src/stores/\` 目录下创建新的 Store
2. 在 \`src/stores/index.ts\` 中导出

### 主题定制

在 \`src/styles/variables.css\` 中修改 CSS Variables：

\`\`\`css
:root {
  --color-primary: #1677ff;
  /* 更多变量... */
}
\`\`\`

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
>>>>>>> 8d19ee7 (init)
