import { create } from 'zustand'
import { getRoutineCat } from '../lib/helpers'

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
}



// ── Store ──

export const useAppStore = create<AppStore>((set) => ({
  screen: 'landing',
  category: null,
  currentMissionCategory: null,
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

  resetObState: () => set({ ...initialObState }),

  initializeApp: () => {
    const hasData =
      localStorage.getItem('sloo_health') !== null ||
      localStorage.getItem('sloo_routine_slots') !== null
    set({ screen: hasData ? 'home' : 'landing' })
  },
}))
