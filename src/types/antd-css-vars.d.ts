/**
 * Ant Design CSS 变量类型定义
 * 为所有 Ant Design CSS 变量提供类型提示和自动补全
 *
 * 使用方法：
 * 1. 在 CSS 文件中：var(--ant-color-primary)
 * 2. 在 JSX/TSX 中：style={{ color: 'var(--ant-color-primary)' }}
 *
 * 注意：CSS 文件中的代码提示需要安装 VS Code 插件（见文件末尾说明）
 */

declare namespace CSS {
  interface Properties {
    // ============ 颜色变量 ============

    /** 主色 */
    '--ant-color-primary'?: string
    /** 主色悬停状态 */
    '--ant-color-primary-hover'?: string
    /** 主色激活状态 */
    '--ant-color-primary-active'?: string
    /** 主色轮廓 */
    '--ant-color-primary-outline'?: string
    /** 主色浅色变体 1-7 */
    '--ant-color-primary-1'?: string
    '--ant-color-primary-2'?: string
    '--ant-color-primary-3'?: string
    '--ant-color-primary-4'?: string
    '--ant-color-primary-5'?: string
    '--ant-color-primary-6'?: string
    '--ant-color-primary-7'?: string

    /** 成功色 */
    '--ant-color-success'?: string
    /** 成功色悬停状态 */
    '--ant-color-success-hover'?: string
    /** 成功色激活状态 */
    '--ant-color-success-active'?: string
    /** 成功色轮廓 */
    '--ant-color-success-outline'?: string
    /** 成功色背景（已废弃） */
    '--ant-color-success-bg'?: string
    /** 成功色边框（已废弃） */
    '--ant-color-success-border'?: string

    /** 警告色 */
    '--ant-color-warning'?: string
    /** 警告色悬停状态 */
    '--ant-color-warning-hover'?: string
    /** 警告色激活状态 */
    '--ant-color-warning-active'?: string
    /** 警告色轮廓 */
    '--ant-color-warning-outline'?: string
    /** 警告色背景（已废弃） */
    '--ant-color-warning-bg'?: string
    /** 警告色边框（已废弃） */
    '--ant-color-warning-border'?: string

    /** 错误色 */
    '--ant-color-error'?: string
    /** 错误色悬停状态 */
    '--ant-color-error-hover'?: string
    /** 错误色激活状态 */
    '--ant-color-error-active'?: string
    /** 错误色轮廓 */
    '--ant-color-error-outline'?: string
    /** 错误色背景（已废弃） */
    '--ant-color-error-bg'?: string
    /** 错误色边框（已废弃） */
    '--ant-color-error-border'?: string

    /** 信息色 */
    '--ant-color-info'?: string
    /** 信息色背景（已废弃） */
    '--ant-color-info-bg'?: string
    /** 信息色边框（已废弃） */
    '--ant-color-info-border'?: string

    // ============ 文本颜色 ============

    /** 文本颜色 */
    '--ant-color-text'?: string
    /** 次要文本颜色 */
    '--ant-color-text-secondary'?: string
    /** 禁用文本颜色 */
    '--ant-color-text-disabled'?: string
    /** 标题文本颜色 */
    '--ant-color-text-heading'?: string
    /** 禁用颜色 */
    '--ant-color-disabled'?: string
    /** 禁用文本颜色（已废弃） */
    '--ant-color-disabled-text'?: string

    // ============ 背景颜色 ============

    /** 背景颜色 */
    '--ant-color-bg'?: string
    /** 容器背景颜色 */
    '--ant-color-bg-container'?: string
    /** 提升背景颜色 */
    '--ant-color-bg-elevated'?: string
    /** 布局背景颜色 */
    '--ant-color-bg-layout'?: string
    /** 聚光灯背景颜色 */
    '--ant-color-bg-spotlight'?: string
    /** 基础背景颜色（已废弃） */
    '--ant-color-bg-base'?: string

    // ============ 边框颜色 ============

    /** 边框颜色 */
    '--ant-color-border'?: string
    /** 次要边框颜色 */
    '--ant-color-border-secondary'?: string
    /** 基础边框颜色（已废弃） */
    '--ant-color-border-base'?: string

    // ============ 分割线颜色 ============

    /** 分割线颜色 */
    '--ant-color-split'?: string

    // ============ 字体大小 ============

    /** 基础字体大小 */
    '--ant-font-size-base'?: string
    /** 小号字体 */
    '--ant-font-size-sm'?: string
    /** 大号字体 */
    '--ant-font-size-lg'?: string
    /** 超大号字体 */
    '--ant-font-size-xl'?: string
    /** 标题字体大小 */
    '--ant-font-size-heading-1'?: string
    '--ant-font-size-heading-2'?: string
    '--ant-font-size-heading-3'?: string
    '--ant-font-size-heading-4'?: string
    '--ant-font-size-heading-5'?: string

    // ============ 行高 ============

    /** 基础行高 */
    '--ant-line-height-base'?: string
    /** 小号行高 */
    '--ant-line-height-sm'?: string
    /** 大号行高 */
    '--ant-line-height-lg'?: string

    // ============ 圆角 ============

    /** 基础圆角 */
    '--ant-border-radius'?: string
    /** 基础圆角（已废弃） */
    '--ant-border-radius-base'?: string
    /** 小号圆角 */
    '--ant-border-radius-sm'?: string
    /** 大号圆角 */
    '--ant-border-radius-lg'?: string

    // ============ 内边距 ============

    /** 超小号内边距 */
    '--ant-padding-xs'?: string
    /** 小号内边距 */
    '--ant-padding-sm'?: string
    /** 基础内边距 */
    '--ant-padding'?: string
    /** 基础内边距（已废弃） */
    '--ant-padding-base'?: string
    /** 大号内边距 */
    '--ant-padding-lg'?: string
    /** 超大号内边距 */
    '--ant-padding-xl'?: string

    // ============ 外边距 ============

    /** 超小号外边距 */
    '--ant-margin-xs'?: string
    /** 小号外边距 */
    '--ant-margin-sm'?: string
    /** 基础外边距 */
    '--ant-margin'?: string
    /** 基础外边距（已废弃） */
    '--ant-margin-base'?: string
    /** 大号外边距 */
    '--ant-margin-lg'?: string
    /** 超大号外边距 */
    '--ant-margin-xl'?: string

    // ============ 阴影 ============

    /** 基础阴影 */
    '--ant-box-shadow'?: string
    /** 基础阴影（已废弃） */
    '--ant-box-shadow-base'?: string
    /** 次要阴影 */
    '--ant-box-shadow-secondary'?: string

    // ============ 动画 ============

    /** 动画持续时间 */
    '--ant-motion-duration-slow'?: string
    /** 动画持续时间基础 */
    '--ant-motion-duration-base'?: string
    /** 动画持续时间快速 */
    '--ant-motion-duration-fast'?: string
    /** 动画缓动函数 */
    '--ant-motion-ease-in-out'?: string
    '--ant-motion-ease-out'?: string
    '--ant-motion-ease-in'?: string

    // ============ 组件特定变量 ============

    /** Layout 头部背景 */
    '--ant-layout-header-bg'?: string
    /** Layout 侧边栏背景 */
    '--ant-layout-sider-bg'?: string
    /** Layout 主体背景 */
    '--ant-layout-body-bg'?: string

    /** Menu 项背景 */
    '--ant-menu-item-bg'?: string
    /** Menu 子菜单项背景 */
    '--ant-menu-sub-item-bg'?: string

    /** Button 默认背景 */
    '--ant-btn-default-bg'?: string
    /** Button 默认边框颜色 */
    '--ant-btn-default-border-color'?: string

    /** Input 背景 */
    '--ant-input-bg'?: string
    /** Input 边框颜色 */
    '--ant-input-border-color'?: string

    /** Card 背景 */
    '--ant-card-bg'?: string
    /** Card 边框颜色 */
    '--ant-card-border-color'?: string

    /** Table 背景 */
    '--ant-table-bg'?: string
    /** Table 边框颜色 */
    '--ant-table-border-color'?: string

    /** Modal 背景 */
    '--ant-modal-bg'?: string
    /** Modal 遮罩背景 */
    '--ant-modal-mask-bg'?: string

    /** Drawer 背景 */
    '--ant-drawer-bg'?: string
    /** Drawer 遮罩背景 */
    '--ant-drawer-mask-bg'?: string

    /** Tooltip 背景 */
    '--ant-tooltip-bg'?: string
    /** Tooltip 文本颜色 */
    '--ant-tooltip-color'?: string

    /** Popover 背景 */
    '--ant-popover-bg'?: string

    /** Select 背景 */
    '--ant-select-bg'?: string
    /** Select 边框颜色 */
    '--ant-select-border-color'?: string

    /** DatePicker 背景 */
    '--ant-picker-bg'?: string
    /** DatePicker 边框颜色 */
    '--ant-picker-border-color'?: string
  }
}

/**
 * VS Code 插件推荐（用于 CSS 文件中的代码提示）：
 *
 * 1. CSS Variables (by phoenisx)
 *    - 提供 CSS 变量自动补全
 *    - 支持跳转到变量定义
 *
 * 2. IntelliSense for CSS class names in HTML
 *    - 增强 CSS 类名和变量的提示
 *
 * 3. CSS Peek
 *    - 支持查看 CSS 变量定义
 *
 * VS Code 设置（.vscode/settings.json）：
 * {
 *   "css.customData": [".vscode/css-custom-data.json"]
 * }
 *
 * 然后创建 .vscode/css-custom-data.json 文件，包含所有 antd CSS 变量定义
 */
