import { useAppStore, setCatData, getRoutineSlots, setRoutineSlots } from '../../store/appStore'

const options = [
  { value: 'messy',   label: '😤 치워도 금방 다시 어질러져',      empathy: '치우는 게 문제가 아니에요. 습관이 없는 거예요. 딱 하나만 시작해봐요.' },
  { value: 'unknown', label: '🤷 어디서부터 시작해야 할지 몰라',   empathy: '한꺼번에 다 하려고 하면 아무것도 못 해요. 딱 하나만 시작해봐요.' },
  { value: 'lazy',    label: '😴 알면서도 자꾸 미루게 돼',         empathy: '미루는 게 당연해요. 그래서 딱 하나만 하는 거예요.' },
  { value: 'better',  label: '✨ 더 깔끔한 공간에서 생활하고 싶어', empathy: '좋은 시작이에요. 작은 것 하나부터 바꿔봐요.' },
]

function ProgressBar() {
  return (
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>3 / 3</span>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8 }}>
        <div style={{ height: '100%', width: '100%', background: '#8b5cf6', borderRadius: 99 }} />
      </div>
    </div>
  )
}

export default function SpaceReason() {
  const { setScreen, setCurrentMissionCategory, obPendingType } = useAppStore()

  function handleSelect(value: string) {
    const type = obPendingType || 'space'
    const cat = `routine_${type}`
    setCatData(cat, {
      active: true, type, level: 1, growth_count: 0, total_count: 0,
      maintain_count: 0, last_date: null, history: [], fail_reason: 0,
      max_reached: false, streak: 0, space_reason: value,
    })
    const slots = getRoutineSlots()
    if (!slots.includes(type)) { slots.push(type); setRoutineSlots(slots) }
    setCurrentMissionCategory(cat)
    useAppStore.setState({ obSpaceReason: value })
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>정리정돈, 왜 하고 싶으세요?</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>이유를 알아야 딱 맞는 미션을 드릴 수 있어요.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map(({ value, label }) => (
          <button key={value} onClick={() => handleSelect(value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px', cursor: 'pointer', color: '#fff', fontSize: 15, fontWeight: 600, textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(139,92,246,0.12)'; b.style.borderColor = 'rgba(139,92,246,0.4)' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.05)'; b.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >{label}</button>
        ))}
      </div>
    </div>
  )
}
