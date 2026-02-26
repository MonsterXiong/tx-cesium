import { defineConfig, presetAttributify, presetUno } from 'unocss'

/**
 * UnoCSS 配置
 * 使用 Tailwind 兼容语法 + Attributify 模式
 */
export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      text: 'var(--color-text)',
      'text-secondary': 'var(--color-text-secondary)',
      'text-disabled': 'var(--color-text-disabled)',
      bg: 'var(--color-bg)',
      'bg-container': 'var(--color-bg-container)',
      'bg-elevated': 'var(--color-bg-elevated)',
      border: 'var(--color-border)',
      'border-secondary': 'var(--color-border-secondary)',
    },
  },
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'transition-base': 'transition-all duration-300 ease-in-out',
    'card-base': 'rounded-lg bg-bg-container shadow-sm border border-border p-4',
    'btn-base': 'px-4 py-2 rounded cursor-pointer transition-base',
  },
  rules: [
    // bd-t-border → border-top: 1px solid var(--color-border)
    [
      /^bd-(t|r|b|l)-(.+)$/,
      ([, dir, color]) => {
        const dirMap: Record<string, string> = { t: 'top', r: 'right', b: 'bottom', l: 'left' }
        return { [`border-${dirMap[dir]}`]: `1px solid var(--color-${color})` }
      },
    ],
  ],
})

