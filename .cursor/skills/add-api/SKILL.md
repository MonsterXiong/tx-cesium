---
name: add-api
description: 添加新的 API 接口，包括类型定义和接口方法。当用户要求添加接口、对接后端 API、创建请求方法时使用。
---

# 添加 API 接口

## 步骤

### 1. 定义类型（`src/types/api.d.ts`）

为请求参数和响应数据添加 interface，每个字段带 `/** */` 注释：

```typescript
/** Xxx 请求参数 */
export interface XxxParams {
  /** 字段说明 */
  fieldName: string
}

/** Xxx 响应数据 */
export interface XxxResponse {
  /** 字段说明 */
  fieldName: string
}
```

如需分页，复用 `global.d.ts` 中的 `PaginationParams` 和 `PaginationResponse<T>` 泛型。

### 2. 添加接口方法（`src/services/api/index.ts`）

按业务模块分组，导出对象。每个方法必须有 JSDoc + 泛型返回类型：

```typescript
import { request } from '../request'
import type { XxxParams, XxxResponse } from '@/types/api'

/**
 * Xxx 模块 API
 */
export const xxxApi = {
  /**
   * 获取列表
   * @param params 查询参数
   * @returns 列表数据
   */
  getList(params: XxxParams): Promise<XxxResponse[]> {
    return request.get('/xxx/list', { params })
  },

  /**
   * 创建记录
   * @param data 创建数据
   * @returns 新记录 ID
   */
  create(data: XxxParams): Promise<{ id: string }> {
    return request.post('/xxx/create', data)
  },
}
```

所有请求必须使用 `request` 封装（来自 `src/services/request.ts`），禁止直接使用 axios。
