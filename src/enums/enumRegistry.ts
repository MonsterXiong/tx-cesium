/**
 * 枚举注册表
 * 此文件由 scripts/generate-enums.ts 自动生成，请勿手动修改
 */

import type { EnumObject } from './types'
import { orderStatus } from './modules/status'
import { test } from './modules/test'
import { userRole, userStatus } from './modules/user'

/** 所有已注册的枚举名称 */
export type EnumName = 'orderStatus' | 'test' | 'userRole' | 'userStatus'

/** 枚举名称到枚举对象的映射 */
export const enumRegistry: Record<EnumName, EnumObject> = {
  orderStatus,
  test,
  userRole,
  userStatus,
}
