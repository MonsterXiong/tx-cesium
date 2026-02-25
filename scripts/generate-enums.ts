/**
 * 枚举自动生成脚本
 * 扫描 src/enums/modules/ 下的枚举定义，生成 enumRegistry.ts 和 index.ts
 *
 * 使用方式：npm run gen:enums
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '..')
const ENUMS_DIR = path.join(ROOT_DIR, 'src/enums')
const MODULES_DIR = path.join(ENUMS_DIR, 'modules')

const LOG_PREFIX = '[generate-enums]'

/**
 * 递归扫描目录下所有 .ts 文件
 */
function scanTsFiles(dir: string): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...scanTsFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath)
    }
  }
  return files
}

/**
 * 从文件内容中解析 export const xxx = 的导出名（小驼峰）
 */
function parseExports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const names: string[] = []
  const regex = /export\s+const\s+(\w+)\s*=\s*\{/g
  let match
  while ((match = regex.exec(content)) !== null) {
    names.push(match[1])
  }
  return names
}

/**
 * 根据文件路径生成相对 modules 的 import 路径（无扩展名）
 */
function getModuleImportPath(filePath: string): string {
  const relative = path.relative(MODULES_DIR, filePath)
  return './modules/' + relative.replace(/\.ts$/, '').replace(/\\/g, '/')
}

async function main() {
  console.log(`${LOG_PREFIX} 开始扫描枚举...`)

  const moduleFiles = scanTsFiles(MODULES_DIR)
  const registryEntries: { modulePath: string; exports: string[] }[] = []

  for (const filePath of moduleFiles) {
    const exports = parseExports(filePath)
    if (exports.length > 0) {
      const modulePath = getModuleImportPath(filePath)
      registryEntries.push({ modulePath, exports })
    }
  }

  // 生成 enumRegistry.ts
  const registryImports: string[] = []
  const registryKeys: string[] = []

  for (const { modulePath, exports } of registryEntries) {
    const importNames = exports.join(', ')
    registryImports.push(`import { ${importNames} } from '${modulePath}'`)
    registryKeys.push(...exports)
  }

  // 生成 EnumName 联合类型
  const enumNameType = registryKeys.map(k => `'${k}'`).join(' | ')

  const enumRegistryContent = `/**
 * 枚举注册表
 * 此文件由 scripts/generate-enums.ts 自动生成，请勿手动修改
 */

import type { EnumObject } from './types'
${registryImports.join('\n')}

/** 所有已注册的枚举名称 */
export type EnumName = ${enumNameType}

/** 枚举名称到枚举对象的映射 */
export const enumRegistry: Record<EnumName, EnumObject> = {
  ${registryKeys.join(',\n  ')},
}
`

  fs.writeFileSync(path.join(ENUMS_DIR, 'enumRegistry.ts'), enumRegistryContent, 'utf-8')
  console.log(`${LOG_PREFIX} ✓ 生成 enumRegistry.ts`)

  // 生成 index.ts
  const indexExports: string[] = []
  for (const { modulePath, exports } of registryEntries) {
    indexExports.push(`export { ${exports.join(', ')} } from '${modulePath}'`)
  }

  const indexContent = `/**
 * 枚举统一导出
 * 此文件由 scripts/generate-enums.ts 自动生成，请勿手动修改
 */

export { enumRegistry } from './enumRegistry'
export type { EnumName } from './enumRegistry'
export type { EnumItem, EnumObject } from './types'
${indexExports.join('\n')}
export * from './helper'
`

  fs.writeFileSync(path.join(ENUMS_DIR, 'index.ts'), indexContent, 'utf-8')
  console.log(`${LOG_PREFIX} ✓ 生成 index.ts`)

  console.log(`${LOG_PREFIX} 完成！共 ${registryKeys.length} 个枚举`)
}

main().catch((err: Error) => {
  console.error(`${LOG_PREFIX} 执行出错:`, err)
  process.exit(1)
})
