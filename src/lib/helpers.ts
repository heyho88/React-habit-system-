import { MISSIONS, ROUTINE_TYPE_META, CAT_META, type RoutineType } from './missions'

export interface SleepData {
  current_target?: string
  target_bedtime?: string
  [key: string]: unknown
}

export interface GrowthStage {
  emoji: string
  stage: number
}

export function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function multStr(n: number): string {
  return Math.pow(1.01, n).toFixed(2)
}

export function sleepTimeToMins(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return (h >= 12 ? h : h + 24) * 60 + m
}

export function minsToTimeStr(mins: number): string {
  const total = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTimeKorean(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const ms = String(m).padStart(2, '0')
  if (h === 0)   return `자정 0시 ${ms}분`
  if (h < 6)     return `새벽 ${h}시 ${ms}분`
  if (h < 12)    return `오전 ${h}시 ${ms}분`
  if (h === 12)  return `낮 12시 ${ms}분`
  if (h < 18)    return `오후 ${h - 12}시 ${ms}분`
  if (h < 21)    return `저녁 ${h - 12}시 ${ms}분`
  return `밤 ${h}시 ${ms}분`
}

export function isSleepMaxLevel(data: SleepData | null): boolean {
  if (!data || !data.current_target || !data.target_bedtime) return false
  return sleepTimeToMins(data.current_target) <= sleepTimeToMins(data.target_bedtime)
}

export function getExerciseMission(type: string, level: number): string {
  const arr = MISSIONS[type as keyof typeof MISSIONS]
  return arr ? arr[Math.min(level - 1, 6)] : ''
}

export function getPlantIcon(n: number): string {
  if (n >= 101) return '🌲'
  if (n >= 31)  return '🌳'
  if (n >= 8)   return '🌿'
  return '🌱'
}

export function getGrowthMsg(n: number): string {
  if (n >= 365) return '1년. 37.78배. 말이 필요 없어요.'
  if (n >= 100) return '100일. 2.70배. 진짜 달라졌어요.'
  if (n >= 30)  return '한 달. 이제 습관이 되고 있어요.'
  if (n >= 7)   return '일주일 됐어요. 1.07배가 됐어요.'
  return '첫 번째 1%. 시작이 전부예요.'
}

export function getGrowthStage(n: number): GrowthStage {
  if (n >= 61) return { emoji: '✨🌲', stage: 4 }
  if (n >= 31) return { emoji: '🌲',   stage: 3 }
  if (n >= 16) return { emoji: '🌳',   stage: 2 }
  if (n >= 6)  return { emoji: '🌿',   stage: 1 }
  return           { emoji: '🌱',   stage: 0 }
}

export function getCatIcon(cat: string, type?: string | null): string {
  if (cat === 'health') {
    if (type === 'gym')          return '🏋️'
    if (type === 'hometraining') return '🏠'
    if (type === 'walking')      return '🚶'
    return '🏃'
  }
  if (cat === 'routine' || isRoutineCat(cat)) {
    const t = type || (isRoutineCat(cat) ? getRoutineType(cat) : null)
    return ROUTINE_TYPE_META[t as RoutineType]?.icon || '📋'
  }
  return CAT_META[cat as keyof typeof CAT_META]?.icon || ''
}

export function getCatName(cat: string, type?: string | null): string {
  if (cat === 'health') {
    if (type === 'gym')          return '헬스장'
    if (type === 'hometraining') return '홈트'
    if (type === 'walking')      return '걷기/달리기'
    return '운동/건강'
  }
  if (cat === 'routine' || isRoutineCat(cat)) {
    const t = type || (isRoutineCat(cat) ? getRoutineType(cat) : null)
    return ROUTINE_TYPE_META[t as RoutineType]?.label || '루틴/생활습관'
  }
  return CAT_META[cat as keyof typeof CAT_META]?.label || ''
}

export function isRoutineCat(cat: string): boolean {
  return cat.startsWith('routine_')
}

export function getRoutineType(cat: string): string {
  return cat.replace('routine_', '')
}

export function getRoutineCat(type: string): string {
  return 'routine_' + type
}
