import { create } from 'zustand'
import { getRoutineCat, sleepTimeToMins } from '../lib/helpers'

// ── localStorage 헬퍼 ──

export function getCatData(cat: string): Record<string, unknown> | null {
  try {
    const d = localStorage.getItem('sloo_' + cat)
    return d ? JSON.parse(d) : null
  } catch { return null }
}

export function setCatData(cat: string, obj: object): void {
  localStorage.setItem('sloo_' + cat, JSON.stringify(obj))
}

export function getRoutineSlots(): string[] {
  try { return JSON.parse(localStorage.getItem('sloo_routine_slots') || '[]') } catch { return [] }
}

export function setRoutineSlots(arr: string[]): void {
  localStorage.setItem('sloo_routine_slots', JSON.stringify(arr))
}

export function getRoutineUnlocked(): number {
  return parseInt(localStorage.getItem('sloo_routine_unlocked') || '1')
}

export function setRoutineUnlocked(n: number): void {
  localStorage.setItem('sloo_routine_unlocked', String(n))
}

export function getAllActiveCatKeys(): string[] {
  const base = ['health', 'sleep'] as const
  const keys = base.filter(c => getCatData(c) !== null).map(String)
  getRoutineSlots().forEach(type => keys.push(getRoutineCat(type)))
  return keys
}

// ── 프로필 ──

export interface ProfileData {
  displayName: string
  bio: string
  avatar: string | null
}

export function getProfile(): ProfileData {
  try {
    const raw = localStorage.getItem('sloo_profile')
    if (!raw) return { displayName: '', bio: '', avatar: null }
    const parsed = JSON.parse(raw)
    return {
      displayName: String(parsed.displayName || ''),
      bio: String(parsed.bio || ''),
      avatar: parsed.avatar ?? null,
    }
  } catch {
    return { displayName: '', bio: '', avatar: null }
  }
}

export function setProfile(p: Partial<ProfileData>): void {
  const cur = getProfile()
  localStorage.setItem('sloo_profile', JSON.stringify({ ...cur, ...p }))
}

// ── Store 타입 ──

type CategoryKey = 'health' | 'sleep' | 'routine' | null

interface AppState {
  screen: string
  category: CategoryKey
  currentMissionCategory: string | null
  currentOnboardingCategory: string | null
  obPendingType: string | null
  obPendingReason: number
  obSleepCurrentH: number
  obSleepCurrentM: number
  obSleepTargetH: number
  obSleepTargetM: number
  obMentalState: string | null
  obDigitalReason: string | null
  obReadingReason: string | null
  obMorningState: string | null
  obEveningState: string | null
  obSpaceReason: string | null
  obExerciseType: string | null
  obRoutineType: string | null
  obFailReason: number | null
  obDisplayName: string
  obBio: string
  obAvatar: string | null
  mainTab: 'dashboard' | 'missions' | 'analytics' | 'settings'
  dailyEnergy: string | null
  dailyMental: string | null
  pendingResetCategory: string | null
}

interface AppActions {
  setScreen: (screen: string) => void
  setCategory: (category: CategoryKey) => void
  setCurrentMissionCategory: (cat: string | null) => void
  setCurrentOnboardingCategory: (cat: string | null) => void
  setObPendingType: (type: string | null) => void
  setObExerciseType: (v: string) => void
  setObRoutineType: (v: string) => void
  setObFailReason: (v: number) => void
  setObSleepCurrentH: (v: number) => void
  setObSleepCurrentM: (v: number) => void
  setObSleepTargetH: (v: number) => void
  setObSleepTargetM: (v: number) => void
  setObDisplayName: (v: string) => void
  setObBio: (v: string) => void
  setObAvatar: (v: string | null) => void
  setMainTab: (v: 'dashboard' | 'missions' | 'analytics' | 'settings') => void
  commitProfile: () => void
  commitOnboardingData: () => void
  resetObState: () => void
  initializeApp: () => void
}

type AppStore = AppState & AppActions

// ── 초기 상태 ──

const initialObState: Pick<
  AppState,
  | 'currentOnboardingCategory'
  | 'obPendingType'
  | 'obPendingReason'
  | 'obSleepCurrentH'
  | 'obSleepCurrentM'
  | 'obSleepTargetH'
  | 'obSleepTargetM'
  | 'obMentalState'
  | 'obDigitalReason'
  | 'obReadingReason'
  | 'obMorningState'
  | 'obEveningState'
  | 'obSpaceReason'
  | 'obExerciseType'
  | 'obRoutineType'
  | 'obFailReason'
  | 'obDisplayName'
  | 'obBio'
  | 'obAvatar'
> = {
  currentOnboardingCategory: null,
  obPendingType: null,
  obPendingReason: 0,
  obSleepCurrentH: 2,
  obSleepCurrentM: 0,
  obSleepTargetH: 0,
  obSleepTargetM: 0,
  obMentalState: null,
  obDigitalReason: null,
  obReadingReason: null,
  obMorningState: null,
  obEveningState: null,
  obSpaceReason: null,
  obExerciseType: null,
  obRoutineType: null,
  obFailReason: null,
  obDisplayName: '',
  obBio: '',
  obAvatar: null,
}



// ── Store ──

export const useAppStore = create<AppStore>((set) => ({
  screen: 'landing',
  category: null,
  currentMissionCategory: null,
  mainTab: 'dashboard',
  dailyEnergy: null,
  dailyMental: null,
  pendingResetCategory: null,
  ...initialObState,

  setScreen: (screen) => set({ screen }),

  setCategory: (category) => set({ category }),

  setCurrentMissionCategory: (cat) => set({ currentMissionCategory: cat }),

  setCurrentOnboardingCategory: (cat) => set({ currentOnboardingCategory: cat }),

  setObPendingType: (type) => set({ obPendingType: type }),

  setObExerciseType:   (v) => set({ obExerciseType: v }),
  setObRoutineType:    (v) => set({ obRoutineType: v }),
  setObFailReason:     (v) => set({ obFailReason: v }),
  setObSleepCurrentH:  (v) => set({ obSleepCurrentH: v }),
  setObSleepCurrentM:  (v) => set({ obSleepCurrentM: v }),
  setObSleepTargetH:   (v) => set({ obSleepTargetH: v }),
  setObSleepTargetM:   (v) => set({ obSleepTargetM: v }),
  setObDisplayName:    (v) => set({ obDisplayName: v }),
  setObBio:            (v) => set({ obBio: v }),
  setObAvatar:         (v) => set({ obAvatar: v }),
  setMainTab:          (v) => set({ mainTab: v }),

  commitProfile: () => {
    const s = useAppStore.getState()
    setProfile({
      displayName: s.obDisplayName,
      bio: s.obBio,
      avatar: s.obAvatar,
    })
  },

  commitOnboardingData: () => {
    const s = useAppStore.getState()
    const cat = s.category
    if (!cat) return

    if (cat === 'health') {
      if (getCatData('health') !== null) return
      setCatData('health', {
        active: true,
        type: s.obExerciseType || 'hometraining',
        level: 1,
        growth_count: 0,
        total_count: 0,
        maintain_count: 0,
        last_date: null,
        history: [],
        fail_reason: s.obFailReason ?? 0,
        max_reached: false,
      })
      return
    }

    if (cat === 'sleep') {
      if (getCatData('sleep') !== null) return
      const curStr = `${String(s.obSleepCurrentH).padStart(2, '0')}:${String(s.obSleepCurrentM).padStart(2, '0')}`
      const tgtStr = `${String(s.obSleepTargetH).padStart(2, '0')}:${String(s.obSleepTargetM).padStart(2, '0')}`
      const diffMins = Math.max(0, sleepTimeToMins(curStr) - sleepTimeToMins(tgtStr))
      const alreadyDone = diffMins <= 0
      setCatData('sleep', {
        active: true,
        type: 'sleep',
        level: 1,
        growth_count: alreadyDone ? 1 : 0,
        total_count: 0,
        maintain_count: 0,
        last_date: null,
        history: [],
        fail_reason: 0,
        max_reached: false,
        current_bedtime: curStr,
        target_bedtime: tgtStr,
        current_target: alreadyDone ? tgtStr : curStr,
        total_minutes_diff: alreadyDone ? 0 : diffMins,
      })
      return
    }

    if (cat === 'routine') {
      const type = s.obRoutineType
      if (!type) return
      const slots = getRoutineSlots()
      if (!slots.includes(type)) {
        slots.push(type)
        setRoutineSlots(slots)
      }
      const routineCat = getRoutineCat(type)
      if (getCatData(routineCat) !== null) return
      setCatData(routineCat, {
        active: true,
        type,
        level: 1,
        growth_count: 0,
        total_count: 0,
        maintain_count: 0,
        last_date: null,
        history: [],
        fail_reason: s.obFailReason ?? 0,
        max_reached: false,
      })
    }
  },

  resetObState: () => set({ ...initialObState }),

  initializeApp: () => {
    const hasData =
      localStorage.getItem('sloo_health') !== null ||
      localStorage.getItem('sloo_routine_slots') !== null
    set({ screen: hasData ? 'home' : 'landing' })
  },
}))
