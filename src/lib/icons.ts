// 导出所有 lucide-vue-next 图标
export * from 'lucide-vue-next'

// 项目中常用的图标集合
export const COMMON_ICONS = {
  // 认证相关
  LogIn: 'LogIn',
  Mail: 'Mail',
  Lock: 'Lock',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  User: 'User',
  UserPlus: 'UserPlus',
  UserCheck: 'UserCheck',

  // 导航相关
  ArrowRight: 'ArrowRight',
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ChevronDown: 'ChevronDown',
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',
  ChevronUp: 'ChevronUp',

  // 状态相关
  CheckCircle: 'CheckCircle',
  XCircle: 'XCircle',
  AlertCircle: 'AlertCircle',
  Info: 'Info',
  Check: 'Check',
  Close: 'X',

  // 主题和界面
  Sun: 'Sun',
  Moon: 'Moon',
  Globe: 'Globe',
  Languages: 'Languages',
  Shield: 'Shield',
  Home: 'Home',
  Settings: 'Settings',

  // OAuth 相关
  Chrome: 'Chrome',
  Github: 'Github',
  Facebook: 'Facebook',
  Twitter: 'Twitter',

  // 文件和上传
  Download: 'Download',
  Upload: 'Upload',
  File: 'File',
  Folder: 'Folder',
  Trash: 'Trash',

  // 加载和操作
  Loader2: 'Loader2',
  RefreshCw: 'RefreshCw',
  Search: 'Search',
  Filter: 'Filter',
  Edit: 'Edit',
  Save: 'Save',

  // 布局
  Menu: 'Menu',
  Plus: 'Plus',
  Minus: 'Minus',

  // 其他
  HelpCircle: 'HelpCircle',
  ExternalLink: 'ExternalLink',
  Copy: 'Copy',
  Share: 'Share',
  Heart: 'Heart',
  Star: 'Star',
} as const

// 图标名称类型
export type CommonIconName = (typeof COMMON_ICONS)[keyof typeof COMMON_ICONS]

// 获取图标名称的辅助函数
export function getIconName(iconName: string): CommonIconName | null {
  return COMMON_ICONS[iconName as keyof typeof COMMON_ICONS] || null
}

// 检查是否为常用图标
export function isCommonIcon(iconName: string): iconName is CommonIconName {
  return Object.values(COMMON_ICONS).includes(iconName as CommonIconName)
}
