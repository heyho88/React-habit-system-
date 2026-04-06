import { create } from 'zustand'

type Category = 'health' | 'sleep' | 'routine' | null

interface OnboardingStore {
  screen: string
  category: Category
  type: string | null
  failReason: number
  level: number
  growthCount: number
  totalCount: number
  lastDate: string | null
  sleepHour: number
  sleepMinute: number

  setScreen: (screen: string) => void
  setCategory: (category: Category) => void
  setType: (type: string | null) => void
  setFailReason: (reason: number) => void
  setSleepTime: (hour: number, minute: number) => void
  completeMission: () => void
  passMission: () => void
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  screen: 'category',
  category: null,
  type: null,
  failReason: -1,
  level: 0,
  growthCount: 0,
  totalCount: 0,
  lastDate: null,
  sleepHour: 23,
  sleepMinute: 0,

  setScreen: (screen) => set({ screen }),
  setCategory: (category) => set({ category }),
  setType: (type) => set({ type }),
  setFailReason: (reason) => set({ failReason: reason }),
  setSleepTime: (hour, minute) => set({ sleepHour: hour, sleepMinute: minute }),

  completeMission: () =>
    set((state) => ({
      growthCount: state.growthCount + 1,
      totalCount: state.totalCount + 1,
      lastDate: new Date().toISOString().split('T')[0],
      screen: 'complete',
    })),

  passMission: () => set({ screen: 'complete' }),
}))
