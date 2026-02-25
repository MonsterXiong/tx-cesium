/**
 * 页面自动生成脚本
 * 根据菜单配置自动创建缺失的页面文件
 *
 * 使用方式：npm run gen:pages
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM 下获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')

// 日志前缀
const LOG_PREFIX = '[generate-pages]'

/**
 * 菜单项接口（简化版，仅用于脚本）
 */
interface MenuItemInfo {
  id: string
  path?: string
  title: string
  componentPath: string
}

/**
 * 页面模板（生成 JSX 文件）
 * @param title 页面标题
 * @param pageName 组件名称
 * @returns 页面文件内容
 */
function getPageTemplate(title: string, pageName: string): string {
  return `/**
 * ${title}
 * 页面功能描述
 */

/**
 * ${title}页面组件
 * @returns React 组件
 */
const ${pageName} = () => {
  return (
    <div className="fade-in p-4">
      <h1 className="text-2xl font-bold mb-4">${title}</h1>
      <p className="text-secondary">页面内容待开发...</p>
    </div>
  )
}

export default ${pageName}
`
}

/**
 * 根据路径生成 PascalCase 组件名
 * @param routePath 路由路径，如 /system/user
 * @returns PascalCase 组件名，如 SystemUserPage
 */
function pathToComponentName(routePath: string): string {
  return (
    routePath
      .split('/')
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join('') + 'Page'
  )
}

/**
 * 根据 component 路径解析页面目录
 * @param componentPath 组件路径，如 @/pages/system/user
 * @returns 实际文件目录，如 src/pages/system/user
 */
function resolvePageDir(componentPath: string): string {
  // 将 @/pages/xxx 转换为 src/pages/xxx
  // 移除可能的 /index.jsx 后缀
  let cleanPath = componentPath.replace(/\/index\.jsx$/, '')
  const relativePath = cleanPath.replace(/^@\//, 'src/')
  return path.join(ROOT_DIR, relativePath)
}

/**
 * 检查页面文件是否存在（支持 .jsx 和 .tsx）
 * @param pageDir 页面目录路径
 * @returns 是否存在
 */
function pageExists(pageDir: string): boolean {
  const jsxPath = path.join(pageDir, 'index.jsx')
  const tsxPath = path.join(pageDir, 'index.tsx')
  return fs.existsSync(jsxPath) || fs.existsSync(tsxPath)
}

/**
 * 递归创建目录
 * @param dirPath 目录路径
 */
function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * 创建页面文件
 * @param pageDir 页面目录
 * @param title 页面标题
 * @param componentName 组件名称
 */
function createPage(pageDir: string, title: string, componentName: string): void {
  ensureDir(pageDir)
  const filePath = path.join(pageDir, 'index.jsx')
  const content = getPageTemplate(title, componentName)
  fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * 从菜单文件内容中解析所有带 component 的菜单项
 * 使用简单的行扫描方式，查找 id、title、path、component 的组合
 * @param content 文件内容
 * @returns 菜单项信息数组
 */
function parseMenuFile(content: string): MenuItemInfo[] {
  const results: MenuItemInfo[] = []

  // 先找出所有 lazy(() => import('xxx')) 的位置和路径
  const lazyImportRegex = /lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g
  let match

  while ((match = lazyImportRegex.exec(content)) !== null) {
    const componentPath = match[1]
    const importEndIndex = match.index + match[0].length

    // 向前搜索找到包含这个 component 的对象块
    // 查找最近的 { 开始位置
    let braceCount = 0
    let blockStart = match.index

    // 向前找到对象块的开始
    for (let i = match.index; i >= 0; i--) {
      if (content[i] === '}') braceCount++
      if (content[i] === '{') {
        if (braceCount === 0) {
          blockStart = i
          break
        }
        braceCount--
      }
    }

    // 向后找到对象块的结束
    braceCount = 1
    let blockEnd = importEndIndex
    for (let i = blockStart + 1; i < content.length; i++) {
      if (content[i] === '{') braceCount++
      if (content[i] === '}') {
        braceCount--
        if (braceCount === 0) {
          blockEnd = i + 1
          break
        }
      }
    }

    const block = content.substring(blockStart, blockEnd)

    // 从块中提取 id、title、path
    const idMatch = block.match(/id\s*:\s*['"]([^'"]+)['"]/)
    const titleMatch = block.match(/title\s*:\s*['"]([^'"]+)['"]/)
    const pathMatch = block.match(/path\s*:\s*['"]([^'"]+)['"]/)

    if (idMatch) {
      results.push({
        id: idMatch[1],
        title: titleMatch ? titleMatch[1] : idMatch[1],
        path: pathMatch ? pathMatch[1] : undefined,
        componentPath,
      })
    }
  }

  return results
}

/**
 * 递归扫描目录下所有 .ts/.tsx 文件
 * @param dir 目录路径
 * @returns 文件路径数组
 */
function scanFilesRecursively(dir: string): string[] {
  const results: string[] = []

  if (!fs.existsSync(dir)) {
    return results
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...scanFilesRecursively(fullPath))
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      results.push(fullPath)
    }
  }

  return results
}

/**
 * 扫描所有菜单文件并解析
 * @returns 所有菜单项信息
 */
function scanMenuFiles(): MenuItemInfo[] {
  const modulesDir = path.join(SRC_DIR, 'routes/menu/modules')
  const files = scanFilesRecursively(modulesDir)

  const allItems: MenuItemInfo[] = []

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const items = parseMenuFile(content)
    allItems.push(...items)
  }

  return allItems
}

/**
 * 主函数：扫描菜单并生成缺失页面
 */
async function main(): Promise<void> {
  console.log(`${LOG_PREFIX} 开始扫描菜单配置...`)

  const menuItems = scanMenuFiles()

  console.log(`${LOG_PREFIX} 找到 ${menuItems.length} 个需要页面的菜单项`)

  let createdCount = 0
  let skippedCount = 0

  for (const item of menuItems) {
    const pageDir = resolvePageDir(item.componentPath)
    const componentName = pathToComponentName(item.path || item.id)

    if (pageExists(pageDir)) {
      console.log(`${LOG_PREFIX} - 跳过已存在: ${pageDir.replace(ROOT_DIR + '/', '')}/index.jsx`)
      skippedCount++
    } else {
      createPage(pageDir, item.title, componentName)
      console.log(`${LOG_PREFIX} ✓ 创建页面: ${pageDir.replace(ROOT_DIR + '/', '')}/index.jsx`)
      createdCount++
    }
  }

  console.log(`${LOG_PREFIX} 完成！新建 ${createdCount} 个页面，跳过 ${skippedCount} 个已存在页面`)
}

// 执行
main().catch(err => {
  console.error(`${LOG_PREFIX} 执行出错:`, err)
  process.exit(1)
})
