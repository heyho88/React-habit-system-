import { useAppStore } from '../../store/appStore'
import { CAT_META, type CategoryKey } from '../../lib/missions'

const cats: { value: CategoryKey; icon: string }[] = [
  { value: 'health',  icon: '🏃' },
  { value: 'sleep',   icon: '😴' },
  { value: 'routine', icon: '📋' },
]

const screenFor: Record<string, string> = {
  health:  'ob-exercise',
  sleep:   'ob-sleep-current',
  routine: 'ob-routine',
}

function ProgressBar() {
  return (
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>1 / 3</span>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8 }}>
        <div style={{ height: '100%', width: '33%', background: '#8b5cf6', borderRadius: 99 }} />
      </div>
    </div>
  )
}

export default function SelectCategory() {
  const { setScreen, setCategory, setCurrentOnboardingCategory, resetObState } = useAppStore()

  function handleSelect(val: CategoryKey) {
    resetObState()
    setCategory(val)
    setCurrentOnboardingCategory(val)
    setScreen(screenFor[val])
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        뭘 바꾸고 싶으세요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        딱 하나만 골라보세요
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {cats.map(({ value, icon }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '24px 8px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.5,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.4)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            {CAT_META[value].label}
          </button>
        ))}
      </div>
    </div>
  )
}
