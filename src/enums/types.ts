/**
 * 枚举相关类型定义
 */

/** 枚举项结构（value、label、可选 color） */
export interface EnumItem {
  /** 枚举值 */
  value: string
  /** 显示标签 */
  label: string
  /** 颜色（用于 Tag、Badge 等） */
  color?: string
}

/** 枚举对象结构：键为枚举键名，值为 EnumItem */
export type EnumObject = Record<string, EnumItem>
