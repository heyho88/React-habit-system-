import { useState } from 'react'
import ProgressBar from './ProgressBar'
import { useOnboardingStore } from '../../store/useOnboardingStore'

const reasons = [
  { emoji: '😤', label: '시작은 하는데 며칠 못 버텨', index: 0 },
  { emoji: '😵', label: '너무 바빠서 신경을 못 써', index: 1 },
  { emoji: '😞', label: '하루 빠지면 다 포기하게 돼', index: 2 },
  { emoji: '🤷', label: '그냥 귀찮아', index: 3 },
]

export default function Screen3FailReason() {
  const { setFailReason, setScreen } = useOnboardingStore()
  const [hovered, setHovered] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    setFailReason(index)
    setScreen('mission')
  }

  return (
    <div className="screen-animate">
      <ProgressBar step={3} />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        왜 계속 못 했던 것 같아?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        솔직하게 골라봐, 판단 없어요
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reasons.map((r) => {
          const isHovered = hovered === r.index
          return (
            <button
              key={r.index}
              onClick={() => handleSelect(r.index)}
              onMouseEnter={() => setHovered(r.index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 20px',
                background: isHovered ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isHovered ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 16,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{r.emoji}</span>
              <span style={{
                color: isHovered ? '#a78bfa' : '#ffffff',
                fontWeight: 600,
                fontSize: 15,
                transition: 'color 0.2s',
              }}>
                {r.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
