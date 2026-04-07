import { useAppStore, setCatData, getRoutineSlots, setRoutineSlots } from '../../store/appStore'

const options = [
  { value: 'tired',   label: '😵 너무 피곤해서 그냥 쓰러져',  empathy: '피곤한 게 당연해요. 그래서 더 짧게 시작하는 거예요. 딱 하나만 해봐요.' },
  { value: 'phone',   label: '📱 침대에서 핸드폰만 봐',       empathy: '자기도 모르게 손이 가는 거예요. 당연한 거예요. 자기 전 딱 하나만 먼저 해봐요.' },
  { value: 'complex', label: '🤯 머릿속이 너무 복잡해',       empathy: '하루가 정리가 안 된 채로 끝나는 거예요. 아주 작은 것 하나로 마무리해봐요.' },
  { value: 'empty',   label: '😶 그냥 하루가 끝나는 느낌이야', empathy: '하루가 흘러가는 느낌, 당연한 거예요. 오늘 딱 하나만 남겨봐요.' },
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

export default function EveningState() {
  const { setScreen, setCurrentMissionCategory, obPendingType } = useAppStore()

  function handleSelect(value: string) {
    const type = obPendingType || 'evening'
    const cat = `routine_${type}`
    setCatData(cat, {
      active: true, type, level: 1, growth_count: 0, total_count: 0,
      maintain_count: 0, last_date: null, history: [], fail_reason: 0,
      max_reached: false, streak: 0, evening_state: value,
    })
    const slots = getRoutineSlots()
    if (!slots.includes(type)) { slots.push(type); setRoutineSlots(slots) }
    setCurrentMissionCategory(cat)
    useAppStore.setState({ obEveningState: value })
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>하루 끝날 때 어때요?</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>지금 상태를 알아야 딱 맞는 미션을 드릴 수 있어요.</p>
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
