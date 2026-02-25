# Ant Design CSS 变量代码提示测试指南

## ✅ 已完成的配置

1. **TypeScript 类型定义** - `src/types/antd-css-vars.d.ts`
   - 为所有 Ant Design CSS 变量提供类型提示
   - 在 JSX/TSX 中使用 `style={{ color: 'var(--ant-...)' }}` 时会有自动补全

2. **VS Code CSS 自定义数据** - `.vscode/css-custom-data.json`
   - 包含所有 Ant Design CSS 变量的定义
   - 在 CSS 文件中使用 `var(--ant-...)` 时会有自动补全

3. **VS Code 设置** - `.vscode/settings.json`
   - 配置了 CSS 自定义数据路径
   - 启用了 CSS 验证和自动补全

## 🧪 测试步骤

### 测试 1: TypeScript/JSX 中的类型提示

1. 打开测试文件：`src/components/PoolChart/components/test-antd-vars.tsx`
2. 在 `testStyle` 对象中，尝试输入：
   ```typescript
   backgroundColor: 'var(--ant-
   ```
3. **预期结果**：应该看到所有以 `--ant-` 开头的 CSS 变量自动补全列表
4. 尝试输入完整的变量名，例如：
   ```typescript
   color: 'var(--ant-color-text)'
   ```
5. **预期结果**：鼠标悬停在变量名上时，应该看到 JSDoc 注释说明（如"文本颜色"）

### 测试 2: CSS 文件中的代码提示

1. 打开 CSS 文件：`src/components/PoolChart/components/dnd-panel.css`
2. 在任意样式规则中，尝试输入：
   ```css
   background-color: var(--ant-
   ```
3. **预期结果**：应该看到所有 Ant Design CSS 变量的自动补全列表
4. 选择任意变量后，应该看到变量的描述信息

### 测试 3: 验证现有代码

1. 查看 `dnd-panel.css` 文件
2. 将鼠标悬停在已使用的变量上，例如：
   - `var(--ant-color-bg-container)`
   - `var(--ant-color-text)`
   - `var(--ant-border-radius)`
3. **预期结果**：应该看到变量的描述信息（如"容器背景颜色"、"文本颜色"等）

## 🔧 如果代码提示不工作

### 对于 TypeScript/JSX 文件：

1. **重启 TypeScript 服务器**：
   - 在 VS Code 中按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入 "TypeScript: Restart TS Server"
   - 选择并执行

2. **检查 TypeScript 配置**：
   - 确保 `tsconfig.app.json` 中的 `include` 包含 `["src"]`
   - 确保类型定义文件在 `src/types/` 目录下

### 对于 CSS 文件：

1. **重启 VS Code**：
   - CSS 自定义数据需要在 VS Code 启动时加载
   - 完全关闭并重新打开 VS Code

2. **检查 VS Code 设置**：
   - 打开 `.vscode/settings.json`
   - 确保 `css.customData` 配置正确指向 `.vscode/css-custom-data.json`

3. **安装推荐的插件**（可选但推荐）：
   - **CSS Variables** (by phoenisx) - 提供 CSS 变量自动补全
   - **IntelliSense for CSS class names in HTML** - 增强 CSS 提示
   - **CSS Peek** - 支持查看 CSS 变量定义

## 📝 测试清单

- [ ] 在 TypeScript 文件中输入 `var(--ant-` 时看到自动补全
- [ ] 鼠标悬停在 CSS 变量上时看到描述信息
- [ ] 在 CSS 文件中输入 `var(--ant-` 时看到自动补全
- [ ] 所有常用的 antd CSS 变量都在补全列表中
- [ ] 没有 TypeScript 类型错误

## 🎯 常用 Ant Design CSS 变量示例

```css
/* 颜色 */
var(--ant-color-primary)           /* 主色 */
var(--ant-color-success)           /* 成功色 */
var(--ant-color-warning)           /* 警告色 */
var(--ant-color-error)             /* 错误色 */
var(--ant-color-text)              /* 文本颜色 */
var(--ant-color-text-secondary)    /* 次要文本颜色 */
var(--ant-color-bg-container)      /* 容器背景 */
var(--ant-color-border)            /* 边框颜色 */

/* 尺寸 */
var(--ant-border-radius)           /* 基础圆角 */
var(--ant-border-radius-sm)       /* 小号圆角 */
var(--ant-border-radius-lg)       /* 大号圆角 */
var(--ant-padding-xs)              /* 超小号内边距 */
var(--ant-padding-sm)              /* 小号内边距 */
var(--ant-padding)                 /* 基础内边距 */
var(--ant-padding-lg)              /* 大号内边距 */
var(--ant-margin-xs)               /* 超小号外边距 */
var(--ant-margin-sm)               /* 小号外边距 */
var(--ant-margin)                  /* 基础外边距 */
var(--ant-margin-lg)               /* 大号外边距 */

/* 阴影 */
var(--ant-box-shadow)              /* 基础阴影 */
var(--ant-box-shadow-secondary)    /* 次要阴影 */

/* 字体 */
var(--ant-font-size-base)          /* 基础字体大小 */
var(--ant-font-size-sm)            /* 小号字体 */
var(--ant-font-size-lg)            /* 大号字体 */
var(--ant-line-height-base)       /* 基础行高 */
```

## 📚 更多信息

- 完整的变量列表请查看：`src/types/antd-css-vars.d.ts`
- VS Code CSS 自定义数据：`.vscode/css-custom-data.json`
- 测试组件：`src/components/PoolChart/components/test-antd-vars.tsx`
