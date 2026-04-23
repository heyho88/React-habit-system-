import { useEffect } from 'react'
import { useAppStore, getAllActiveCatKeys } from './store/appStore'

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
import ObStep2          from './pages/onboarding/ObStep2'
import ObProfile        from './pages/onboarding/ObProfile'
import ObNeuralSync     from './pages/onboarding/ObNeuralSync'
import ObCompleteFinal  from './pages/onboarding/ObCompleteFinal'
import Home             from './pages/Home'
import Dashboard        from './pages/Dashboard'
import Missions         from './pages/Missions'
import Analytics        from './pages/Analytics'
import ABChoice         from './pages/mission/ABChoice'
import MissionScreen    from './pages/mission/MissionScreen'
import DailyState       from './pages/mission/DailyState'
import LandingScreen   from './pages/LandingScreen'

import LeftSidebar      from './components/layout/LeftSidebar'


function renderOnboardingOrMission(screen: string) {
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
    case 'ob-step2':          return <ObStep2 />
    case 'ob-profile':        return <ObProfile />
    case 'ob-complete':       return <ObNeuralSync />
    case 'ob-complete-final': return <ObCompleteFinal />
    case 'first-mission':     return <FirstMission />
    case 'main-choice':       return <ABChoice />
    case 'mission-grow':      return <MissionScreen choice="grow" />
    case 'mission-maintain':  return <MissionScreen choice="maintain" />
    case 'daily-state':       return <DailyState />
    case 'home-legacy':       return <Home />
    default:                  return <SelectCategory />
  }
}

function MainContent() {
  const tab = useAppStore(s => s.mainTab)
  if (tab === 'dashboard') return <Dashboard />
  if (tab === 'missions') return <Missions />
  if (tab === 'analytics') return <Analytics />
  if (tab === 'settings') return <ComingSoon title="Settings" sub="프로필, 알림, 데이터 관리 설정을 준비 중입니다." />
  return <Dashboard />
}

function ComingSoon({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '80px 40px', color: '#fff',
    }}>
      <div style={{
        fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.15em', marginBottom: 12,
      }}>COMING SOON</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>{title}</h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{sub}</p>
    </div>
  )
}

const MAIN_APP_SCREENS = new Set(['home', 'home-legacy'])

export default function App() {
  const screen = useAppStore(s => s.screen)
  const initializeApp = useAppStore(s => s.initializeApp)

  useEffect(() => { initializeApp() }, [])

  const inMainApp = MAIN_APP_SCREENS.has(screen) && getAllActiveCatKeys().length > 0

  // 메인 앱: 좌측 사이드바 + 탭 콘텐츠
  if (inMainApp) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050505',
        fontFamily: "'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#fff',
      }}>
        <div style={{ position: 'fixed', top: '15%', right: '-10%', width: 400, height: 400, background: 'rgba(139,92,246,0.06)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '10%', left: '-10%', width: 500, height: 500, background: 'rgba(244,63,94,0.05)', filter: 'blur(150px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

        <LeftSidebar />
        <main style={{ marginLeft: 260, position: 'relative', zIndex: 1 }}>
          <MainContent />
        </main>
      </div>
    )
  }

  // 온보딩/랜딩/미션: 기존 중앙 420px 레이아웃
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
          {renderOnboardingOrMission(screen)}
        </div>
      </div>
    </div>
  )
}
