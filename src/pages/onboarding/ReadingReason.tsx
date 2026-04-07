import { useAppStore, setCatData, getRoutineSlots, setRoutineSlots } from '../../store/appStore'

const options = [
  { value: 'phone',   label: '📱 핸드폰 하다 보면 시간이 없어', empathy: '시간이 없는 게 아니에요. 핸드폰이 시간을 가져가는 거예요. 1페이지면 충분해요.' },
  { value: 'sleepy',  label: '😴 읽다 보면 졸려',             empathy: '졸린 건 뇌가 집중하고 있다는 신호예요. 5분만 버텨봐요.' },
  { value: 'focus',   label: '🤯 집중이 안 돼',               empathy: '집중이 안 되는 게 당연해요. 처음엔 1페이지만 읽으면 돼요.' },
  { value: 'unknown', label: '🤷 뭘 읽어야 할지 모르겠어',    empathy: '책 선택이 제일 어려워요. 일단 아무 책이나 펼쳐봐요. 그게 시작이에요.' },
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

export default function ReadingReason() {
  const { setScreen, setCurrentMissionCategory, obPendingType } = useAppStore()

  function handleSelect(value: string) {
    const type = obPendingType || 'reading'
    const cat = `routine_${type}`
    setCatData(cat, {
      active: true, type, level: 1, growth_count: 0, total_count: 0,
      maintain_count: 0, last_date: null, history: [], fail_reason: 0,
      max_reached: false, streak: 0, reading_reason: value,
    })
    const slots = getRoutineSlots()
    if (!slots.includes(type)) { slots.push(type); setRoutineSlots(slots) }
    setCurrentMissionCategory(cat)
    useAppStore.setState({ obReadingReason: value })
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>책, 왜 못 읽겠어요?</h1>
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
