import { useEffect, useState } from 'react'
import { useAppStore, getAllActiveCatKeys } from './store/appStore'
import Sidebar from './components/layout/Sidebar'
import MobileSummaryBar from './components/layout/MobileSummaryBar'
import MobileStatsSheet from './components/layout/MobileStatsSheet'

import SelectCategory    from './pages/onboarding/SelectCategory'
import SelectExercise    from './pages/onboarding/SelectExercise'
import SelectRoutine     from './pages/onboarding/SelectRoutine'
import FailReason        from './pages/onboarding/FailReason'
import SleepCurrentPicker from './pages/onboarding/SleepCurrentPicker'
import SleepTargetPicker  from './pages/onboarding/SleepTargetPicker'
import SleepConfirm      from './pages/onboarding/SleepConfirm'
import MentalState       from './pages/onboarding/MentalState'
import DigitalReason     from './pages/onboarding/DigitalReason'
import MorningState      from './pages/onboarding/MorningState'
import EveningState      from './pages/onboarding/EveningState'
import SpaceReason       from './pages/onboarding/SpaceReason'
import ReadingReason     from './pages/onboarding/ReadingReason'
import FirstMission      from './pages/onboarding/FirstMission'
import Home             from './pages/Home'
import ABChoice         from './pages/mission/ABChoice'
import MissionScreen    from './pages/mission/MissionScreen'
import DailyState       from './pages/mission/DailyState'
import LandingScreen   from './pages/LandingScreen'


function renderScreen(screen: string) {
  switch (screen) {
    case 'landing':            return <LandingScreen />
    case 'ob-category':       return <SelectCategory />
    case 'ob-exercise':       return <SelectExercise />
    case 'ob-routine':        return <SelectRoutine />
    case 'ob-fail-reason':    return <FailReason />
    case 'ob-sleep-current':  return <SleepCurrentPicker />
    case 'ob-sleep-target':   return <SleepTargetPicker />
    case 'ob-sleep-confirm':  return <SleepConfirm />
    case 'ob-mental':         return <MentalState />
    case 'ob-digital':        return <DigitalReason />
    case 'ob-morning':        return <MorningState />
    case 'ob-evening':        return <EveningState />
    case 'ob-space':          return <SpaceReason />
    case 'ob-reading':        return <ReadingReason />
    case 'first-mission':     return <FirstMission />
    case 'main-choice':       return <ABChoice />
    case 'mission-grow':      return <MissionScreen choice="grow" />
    case 'mission-maintain':  return <MissionScreen choice="maintain" />
    case 'daily-state':       return <DailyState />
    case 'home':              return <Home />
    default:                  return <SelectCategory />
  }
}

const LAYOUT_SCREENS = new Set(['home', 'main-choice', 'mission-grow', 'mission-maintain'])

export default function App() {
  const screen = useAppStore(s => s.screen)
  const initializeApp = useAppStore(s => s.initializeApp)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => { initializeApp() }, [])

  // 화면 전환 시 바텀시트 닫기
  useEffect(() => { setSheetOpen(false) }, [screen])

  const showLayout = LAYOUT_SCREENS.has(screen) && getAllActiveCatKeys().length > 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '48px 20px 80px',
      fontFamily: "'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ position: 'fixed', top: '15%', right: '-10%', width: 400, height: 400, background: 'rgba(139,92,246,0.08)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '-10%', width: 500, height: 500, background: 'rgba(244,63,94,0.06)', filter: 'blur(150px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 12px #8b5cf6' }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.04em', color: '#ffffff' }}>SLOO</span>
        </div>

        <div key={screen}>
          {renderScreen(screen)}
        </div>
      </div>

      {showLayout && <Sidebar />}
      {showLayout && <MobileSummaryBar onOpen={() => setSheetOpen(true)} />}
      {showLayout && <MobileStatsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />}
    </div>
  )
}
