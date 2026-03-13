export const STATUS_COLORS = {
  success: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  warning: {
    text: 'text-amber-400', 
    bg: 'bg-amber-500/15',
  },
  info: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  error: {
    text: 'text-red-400',
    bg: 'bg-red-500/15',
  },
  neutral: {
    text: 'text-slate-400',
    bg: 'bg-slate-500/15',
  },
  primary: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
  },
  purple: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/15',
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/15',
  },
  green: {
    text: 'text-green-400',
    bg: 'bg-green-500/15',
  },
} as const

export type StatusColorKey = keyof typeof STATUS_COLORS

export function getStatusColor(key: string): { text: string; bg: string } {
  return STATUS_COLORS[key as StatusColorKey] || STATUS_COLORS.neutral
}
