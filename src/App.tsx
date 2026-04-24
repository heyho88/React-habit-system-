import { useEffect, useState } from 'react'
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
import Dashboard        from './pages/Dashboard'
import Missions         from './pages/Missions'
import Analytics        from './pages/Analytics'
import Settings         from './pages/Settings'
import ABChoice         from './pages/mission/ABChoice'
import MissionScreen    from './pages/mission/MissionScreen'
import DailyState       from './pages/mission/DailyState'
import LandingScreen   from './pages/LandingScreen'

import LeftSidebar      from './components/layout/LeftSidebar'
import ObStepsShell    from './components/onboarding/ObStepsShell'
import { APP_BACKGROUND } from './styles/appBackground'

const OB_STEP_SCREENS: Record<string, 1 | 2 | 3> = {
  'ob-category': 1,
  'ob-step2':    2,
  'ob-profile':  3,
}


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
    default:                  return <SelectCategory />
  }
}

function MainContent() {
  const tab = useAppStore(s => s.mainTab)
  if (tab === 'dashboard') return <Dashboard />
  if (tab === 'missions') return <Missions />
  if (tab === 'analytics') return <Analytics />
  if (tab === 'settings') return <Settings />
  return <Dashboard />
}

const MAIN_APP_SCREENS = new Set(['home'])

const DESKTOP_MIN_WIDTH = 900

function DesktopOnlyNotice() {
  return (
    <div style={{
      minHeight: '100vh',
      background: APP_BACKGROUND,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      textAlign: 'center',
      fontFamily: "'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ position: 'fixed', top: '15%', right: '-20%', width: 320, height: 320, background: 'rgba(139,92,246,0.08)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '-20%', width: 360, height: 360, background: 'rgba(244,63,94,0.06)', filter: 'blur(150px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 12px #8b5cf6' }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.04em' }}>SLOO</span>
        </div>

        <div style={{ fontSize: 48, marginBottom: 20 }}>🖥️</div>

        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
          데스크탑 전용 서비스
        </h1>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          현재 모바일 환경은 지원하지 않습니다.<br />
          PC나 태블릿(가로 모드)에서<br />
          접속해주세요.
        </p>

        <div style={{
          marginTop: 32,
          padding: '10px 16px',
          display: 'inline-block',
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 999,
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}>
          최소 화면 폭: {DESKTOP_MIN_WIDTH}px
        </div>
      </div>
    </div>
  )
}

function useIsMobile(breakpoint: number) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}

export default function App() {
  const screen = useAppStore(s => s.screen)
  const initializeApp = useAppStore(s => s.initializeApp)
  const isMobile = useIsMobile(DESKTOP_MIN_WIDTH)

  useEffect(() => { initializeApp() }, [])

  if (isMobile) return <DesktopOnlyNotice />

  if (screen === 'landing') return <LandingScreen />

  const inMainApp = MAIN_APP_SCREENS.has(screen) && getAllActiveCatKeys().length > 0

  // 메인 앱: 좌측 사이드바 + 탭 콘텐츠
  if (inMainApp) {
    return (
      <div style={{
        minHeight: '100vh',
        background: APP_BACKGROUND,
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
      background: APP_BACKGROUND,
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

        {OB_STEP_SCREENS[screen] ? (
          <ObStepsShell step={OB_STEP_SCREENS[screen]} screenKey={screen}>
            {renderOnboardingOrMission(screen)}
          </ObStepsShell>
        ) : (
          <div
            key={screen}
            style={{ animation: 'screen-fade-in 380ms ease-out both' }}
          >
            {renderOnboardingOrMission(screen)}
          </div>
        )}
        <style>{`
          @keyframes screen-fade-in {
            from { opacity: 0 }
            to   { opacity: 1 }
          }
        `}</style>
      </div>
    </div>
  )
}
