---
name: 创建 Cursor Skills
overview: 为项目创建一份 Skills 使用指南文档，以及 3 个最实用的项目级 Skill：创建新页面、添加 API 接口、创建 Zustand Store。所有 Skill 模板都精确匹配你项目的现有代码模式。
todos:
  - id: skills-guide
    content: 创建 docs/Skills使用指南.md — Skills 概念讲解、格式说明、编写技巧、最佳实践
    status: completed
  - id: skill-create-page
    content: 创建 .cursor/skills/create-page/SKILL.md — 新建页面完整工作流（目录+组件+路由注册）
    status: completed
  - id: skill-add-api
    content: 创建 .cursor/skills/add-api/SKILL.md — 添加 API 接口工作流（类型+接口+JSDoc）
    status: completed
  - id: skill-create-store
    content: 创建 .cursor/skills/create-store/SKILL.md — 创建 Zustand Store 工作流（State+Actions+导出）
    status: completed
isProject: false
---

# 创建 Cursor Skills 指南与示例

## 要创建的文件

### 1. Skills 使用指南

文件：[docs/Skills使用指南.md](docs/Skills使用指南.md)

内容包括：

- Skills 是什么、和 Rules 的区别
- 存放位置（个人级 vs 项目级）
- SKILL.md 文件格式说明
- description 编写技巧（决定 AI 何时触发）
- 如何创建自己的 Skill
- 最佳实践和注意事项

### 2. Skill: 创建新页面

目录：`.cursor/skills/create-page/SKILL.md`

完整工作流：

- 在 `src/pages/` 下创建 kebab-case 目录 + `index.tsx`（或 `index.jsx`）
- 生成符合项目规范的页面组件模板（文件头注释、JSDoc、fade-in 动画类名）
- 在 [src/routes/config.tsx](src/routes/config.tsx) 中添加 lazy import、routeConfig 条目、routeComponents 映射
- 从 `@ant-design/icons` 选择合适图标

### 3. Skill: 添加 API 接口

目录：`.cursor/skills/add-api/SKILL.md`

完整工作流：

- 在 [src/types/api.d.ts](src/types/api.d.ts) 中定义请求参数和响应类型
- 在 [src/services/api/index.ts](src/services/api/index.ts) 中添加 API 方法（使用 `request` 封装）
- 遵循现有代码模式：按模块分组导出对象、每个方法带 JSDoc + 泛型

### 4. Skill: 创建 Zustand Store

目录：`.cursor/skills/create-store/SKILL.md`

完整工作流：

- 在 `src/stores/` 下创建 `useXxxStore.ts`
- 模板包含：State 接口 + Actions 接口 + `create()` + 可选 `persist` 中间件
- 在 [src/stores/index.ts](src/stores/index.ts) 中添加统一导出
- Console 使用对应的 `[DEBUG_模块]` 前缀

## 关键设计原则

- 所有 Skill 模板都从项目**现有代码**中提炼，确保风格一致
- 支持用户选择 `.tsx` 或 `.jsx`（因为用户当前在从 JS 向 TS 过渡）
- 每个 SKILL.md 控制在 50 行以内，保持精简

