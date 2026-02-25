---
name: create-store
description: 创建新的 Zustand Store 状态管理模块。当用户要求创建 Store、添加全局状态管理、新增状态模块时使用。
---

# 创建 Zustand Store

## 步骤

### 1. 创建 Store 文件（`src/stores/useXxxStore.ts`）

文件名格式：`useXxxStore.ts`（camelCase，use 前缀）

模板：

```typescript
/**
 * Xxx 状态管理
 * 管理 xxx 相关状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'  // 如需持久化

/**
 * Xxx 状态接口
 */
interface XxxState {
  /** 字段说明 */
  fieldName: string
}

/**
 * Xxx 操作接口
 */
interface XxxActions {
  /** 设置字段 */
  setFieldName: (value: string) => void
  /** 重置状态 */
  reset: () => void
}

/** 初始状态 */
const initialState: XxxState = {
  fieldName: '',
}

/**
 * Xxx Store
 */
export const useXxxStore = create<XxxState & XxxActions>()(
  // 如需持久化，用 persist() 包裹；不需要则直接传 set 函数
  set => ({
    ...initialState,

    setFieldName: value => {
      set({ fieldName: value })
      console.log('[DEBUG_XXX] fieldName 已更新:', value)
    },

    reset: () => {
      set(initialState)
      console.log('[DEBUG_XXX] 状态已重置')
    },
  }),
)
```

> Console 前缀使用 `[DEBUG_模块名]` 格式，如 `[DEBUG_ORDER]`、`[DEBUG_CART]`。

### 2. 统一导出（`src/stores/index.ts`）

添加一行导出：

```typescript
export { useXxxStore } from './useXxxStore'
```
