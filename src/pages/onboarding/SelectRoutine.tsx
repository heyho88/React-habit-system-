import { useAppStore } from '../../store/appStore'
import { ROUTINE_TYPE_META, type RoutineType } from '../../lib/missions'
import { getRoutineSlots } from '../../store/appStore'

const detailScreens: Record<string, string> = {
  mental:  'ob-mental',
  digital: 'ob-digital',
  morning: 'ob-morning',
  evening: 'ob-evening',
  space:   'ob-space',
  reading: 'ob-reading',
}

function ProgressBar({ isAdd }: { isAdd?: boolean }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{isAdd ? '1 / 2' : '2 / 3'}</span>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8 }}>
        <div style={{ height: '100%', width: isAdd ? '50%' : '66%', background: '#8b5cf6', borderRadius: 99 }} />
      </div>
    </div>
  )
}

export default function SelectRoutine() {
  const { setScreen, setObPendingType, currentOnboardingCategory } = useAppStore()
  const isAdd = currentOnboardingCategory === 'routine' && getRoutineSlots().length > 0
  const activeSlots = getRoutineSlots()
  const available = (Object.keys(ROUTINE_TYPE_META) as RoutineType[]).filter(t => !activeSlots.includes(t))

  function handleSelect(type: RoutineType) {
    setObPendingType(type)
    setScreen(detailScreens[type])
  }

  return (
    <div className="screen-animate">
      <ProgressBar isAdd={isAdd} />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        어떤 루틴을 시작할까요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        지금 가장 바꾸고 싶은 걸로 골라보세요
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {available.map(type => {
          const meta = ROUTINE_TYPE_META[type]
          return (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '20px 16px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                textAlign: 'left',
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
              <span style={{ fontSize: 22, display: 'block', marginBottom: 6 }}>{meta.icon}</span>
              {meta.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
