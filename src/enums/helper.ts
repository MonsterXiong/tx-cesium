/**
 * 枚举工具函数
 * 通过枚举名称（小驼峰）访问，找不到时静默返回空值
 */

import { enumRegistry } from './enumRegistry'
import type { EnumName } from './enumRegistry'
import type { EnumItem, EnumObject } from './types'

/**
 * 根据枚举名称获取枚举对象
 * @param name 枚举名称（小驼峰）
 * @returns 枚举对象，未找到返回 undefined
 */
export function getEnum(name: EnumName): EnumObject | undefined {
  return enumRegistry[name]
}

/**
 * 根据枚举名称和 value 获取 label
 * @param name 枚举名称（小驼峰）
 * @param value 枚举值
 * @returns 中文标签，未找到返回空字符串
 */
export function getLabel(name: EnumName, value: string): string {
  const enumObj = getEnum(name)
  if (!enumObj) return ''
  const item = Object.values(enumObj).find((e: EnumItem) => e.value === value)
  return item?.label ?? ''
}

/**
 * 根据枚举名称和 value 获取颜色
 * @param name 枚举名称（小驼峰）
 * @param value 枚举值
 * @returns 颜色值，未找到返回空字符串
 */
export function getColor(name: EnumName, value: string): string {
  const enumObj = getEnum(name)
  if (!enumObj) return ''
  const item = Object.values(enumObj).find((e: EnumItem) => e.value === value)
  return item?.color ?? ''
}

/**
 * 根据枚举名称和 value 获取完整枚举项
 * @param name 枚举名称（小驼峰）
 * @param value 枚举值
 * @returns 枚举项，未找到返回 undefined
 */
export function getItem(name: EnumName, value: string): EnumItem | undefined {
  const enumObj = getEnum(name)
  if (!enumObj) return undefined
  return Object.values(enumObj).find((e: EnumItem) => e.value === value)
}

/**
 * 获取枚举的 options 数组（用于 Select/Radio）
 * @param name 枚举名称（小驼峰）
 * @returns { value, label } 数组，未找到返回空数组
 */
export function getOptions(name: EnumName): { value: string; label: string }[] {
  const enumObj = getEnum(name)
  if (!enumObj) return []
  return Object.values(enumObj).map((e: EnumItem) => ({ value: e.value, label: e.label }))
}

/**
 * 获取枚举所有 value 数组
 * @param name 枚举名称（小驼峰）
 * @returns value 数组，未找到返回空数组
 */
export function getValues(name: EnumName): string[] {
  const enumObj = getEnum(name)
  if (!enumObj) return []
  return Object.values(enumObj).map((e: EnumItem) => e.value)
}
