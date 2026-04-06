import { useEffect, useRef, useState } from 'react'
import { useOnboardingStore } from './store/useOnboardingStore'
import Screen1Category from './components/onboarding/Screen1Category'
import Screen2AExercise from './components/onboarding/Screen2AExercise'
import Screen2BRoutine from './components/onboarding/Screen2BRoutine'
import Screen2CSleep from './components/onboarding/Screen2CSleep'
import Screen3FailReason from './components/onboarding/Screen3FailReason'
import Screen4Mission from './components/onboarding/Screen4Mission'
import ScreenComplete from './components/onboarding/ScreenComplete'

function renderScreen(screen: string) {
  switch (screen) {
    case 'category':      return <Screen1Category />
    case 'exercise-type': return <Screen2AExercise />
    case 'routine-type':  return <Screen2BRoutine />
    case 'sleep-picker':  return <Screen2CSleep />
    case 'fail-reason':   return <Screen3FailReason />
    case 'mission':       return <Screen4Mission />
    case 'complete':      return <ScreenComplete />
    default:              return <Screen1Category />
  }
}

export default function App() {
  const screen = useOnboardingStore((s) => s.screen)
  const [displayScreen, setDisplayScreen] = useState(screen)
  const [animKey, setAnimKey] = useState(0)
  const prevScreen = useRef(screen)

  useEffect(() => {
    if (screen !== prevScreen.current) {
      prevScreen.current = screen
      setAnimKey((k) => k + 1)
      setDisplayScreen(screen)
    }
  }, [screen])

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
      {/* Background orbs */}
      <div style={{
        position: 'fixed', top: '15%', right: '-10%',
        width: 400, height: 400,
        background: 'rgba(139,92,246,0.08)',
        filter: 'blur(120px)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', left: '-10%',
        width: 500, height: 500,
        background: 'rgba(244,63,94,0.06)',
        filter: 'blur(150px)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#8b5cf6',
            boxShadow: '0 0 12px #8b5cf6',
          }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.04em', color: '#ffffff' }}>
            SLOO
          </span>
        </div>

        {/* Screen content with animation key */}
        <div key={animKey}>
          {renderScreen(displayScreen)}
        </div>
      </div>
    </div>
  )
}
