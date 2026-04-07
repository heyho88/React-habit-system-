import { useAppStore, setCatData, getRoutineSlots, setRoutineSlots } from '../../store/appStore'

const options = [
  { value: 'blank', label: '😴 일어나자마자 멍해',      empathy: '멍한 게 당연해요. 뇌가 아직 깨어나는 중이거든요. 아주 작은 것 하나로 시작해봐요.' },
  { value: 'phone', label: '📱 눈 뜨자마자 핸드폰 봐', empathy: '자기도 모르게 손이 가는 거예요. 당연한 거예요. 오늘은 딱 하나만 먼저 해봐요.' },
  { value: 'rush',  label: '🏃 항상 시간에 쫓겨',       empathy: '아침이 바쁜 건 잘못이 아니에요. 딱 하나만 바꿔봐요.' },
  { value: 'mood',  label: '😤 아침마다 기분이 별로야', empathy: '아침 기분은 습관으로 바꿀 수 있어요. 작은 것 하나가 하루를 바꾸거든요.' },
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

export default function MorningState() {
  const { setScreen, setCurrentMissionCategory, obPendingType } = useAppStore()

  function handleSelect(value: string) {
    const type = obPendingType || 'morning'
    const cat = `routine_${type}`
    setCatData(cat, {
      active: true, type, level: 1, growth_count: 0, total_count: 0,
      maintain_count: 0, last_date: null, history: [], fail_reason: 0,
      max_reached: false, streak: 0, morning_state: value,
    })
    const slots = getRoutineSlots()
    if (!slots.includes(type)) { slots.push(type); setRoutineSlots(slots) }
    setCurrentMissionCategory(cat)
    useAppStore.setState({ obMorningState: value })
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>아침이 어때요?</h1>
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
