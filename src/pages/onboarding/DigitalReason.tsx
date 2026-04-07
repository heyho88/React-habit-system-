import { useAppStore, setCatData, getRoutineSlots, setRoutineSlots } from '../../store/appStore'

const options = [
  { value: 'habit',   label: '📱 손이 자동으로 가',            empathy: '습관이 된 거예요. 의지 문제가 아니에요. 그냥 안 보이는 곳에 두면 돼요.' },
  { value: 'anxiety', label: '😰 안 보면 불안해',              empathy: '불안한 게 당연해요. 10분 후에 확인해도 늦지 않아요.' },
  { value: 'boredom', label: '🎮 그냥 심심해서',               empathy: '심심한 게 나쁜 게 아니에요. 그 시간에 뇌가 쉬는 거거든요.' },
  { value: 'sns',     label: '💬 SNS, 유튜브를 끊을 수가 없어', empathy: '알고리즘이 너무 잘 만들어진 거예요. 의지력 문제가 아니에요.' },
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

export default function DigitalReason() {
  const { setScreen, setCurrentMissionCategory, obPendingType } = useAppStore()

  function handleSelect(value: string) {
    const type = obPendingType || 'digital'
    const cat = `routine_${type}`
    setCatData(cat, {
      active: true, type, level: 1, growth_count: 0, total_count: 0,
      maintain_count: 0, last_date: null, history: [], fail_reason: 0,
      max_reached: false, streak: 0, digital_reason: value,
    })
    const slots = getRoutineSlots()
    if (!slots.includes(type)) { slots.push(type); setRoutineSlots(slots) }
    setCurrentMissionCategory(cat)
    useAppStore.setState({ obDigitalReason: value })
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>핸드폰, 왜 못 끊겠어요?</h1>
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
