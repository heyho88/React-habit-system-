import { useState } from 'react'
import { useAppStore, getCatData, setCatData } from '../../store/appStore'
import { today } from '../../lib/helpers'

const reasons = [
  { value: 0, label: '😤 시작은 하는데 며칠 못 버텨' },
  { value: 1, label: '😵 너무 바빠서 신경을 못 써' },
  { value: 2, label: '😞 하루 빠지면 다 포기하게 돼' },
  { value: 3, label: '🤷 그냥 귀찮아' },
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

export default function FailReason() {
  const { setScreen, setCurrentMissionCategory, currentOnboardingCategory, obPendingType } = useAppStore()
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(val: number) {
    setSelected(val)

    const cat = currentOnboardingCategory === 'health' ? 'health' : null
    if (!cat || !obPendingType) return

    const existing = getCatData(cat)
    const obj = {
      active: true,
      type: obPendingType,
      level: existing?.level ?? 1,
      growth_count: existing?.growth_count ?? 0,
      total_count: existing?.total_count ?? 0,
      maintain_count: existing?.maintain_count ?? 0,
      last_date: existing?.last_date ?? null,
      history: existing?.history ?? [],
      fail_reason: val,
      max_reached: false,
    }
    setCatData(cat, obj)
    setCurrentMissionCategory(cat)
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        왜 계속 못 했던 것 같아?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        솔직하게 골라보세요, 판단하지 않아요
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reasons.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              background: selected === value ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selected === value ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14,
              padding: '16px 20px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
