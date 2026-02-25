/**
 * 状态相关枚举
 */

export const orderStatus = {
  PENDING: { value: 'pending', label: '待处理', color: 'orange' },
  PROCESSING: { value: 'processing', label: '处理中', color: 'blue' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'green' },
  CANCELLED: { value: 'cancelled', label: '已取消', color: 'red' },
} as const
