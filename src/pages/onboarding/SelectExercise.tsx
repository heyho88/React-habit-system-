import { useAppStore } from '../../store/appStore'

const exercises = [
  { value: 'gym',          icon: '🏋️', label: '헬스장' },
  { value: 'hometraining', icon: '🏠', label: '홈트' },
  { value: 'walking',      icon: '🚶', label: '걷기/달리기' },
]

function ProgressBar() {
  return (
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>2 / 3</span>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8 }}>
        <div style={{ height: '100%', width: '66%', background: '#8b5cf6', borderRadius: 99 }} />
      </div>
    </div>
  )
}

export default function SelectExercise() {
  const { setScreen, setObPendingType } = useAppStore()

  function handleSelect(type: string) {
    setObPendingType(type)
    setScreen('ob-fail-reason')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        어떤 운동 하고 싶으세요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        지금 할 수 있는 걸로 골라보세요
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {exercises.map(({ value, icon, label }) => (
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
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
