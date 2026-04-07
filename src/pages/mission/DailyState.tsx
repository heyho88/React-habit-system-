import { useState } from 'react'
import { useAppStore, getCatData } from '../../store/appStore'
import { multStr } from '../../lib/helpers'

const ENERGY_OPTS = [
  { val: 'low',  label: '낮음', emoji: '😴' },
  { val: 'mid',  label: '보통', emoji: '😊' },
  { val: 'high', label: '높음', emoji: '⚡' },
] as const

const MENTAL_OPTS = [
  { val: 'low',  label: '불안', emoji: '😰' },
  { val: 'mid',  label: '안정', emoji: '😌' },
  { val: 'high', label: '좋음', emoji: '🙌' },
] as const

export default function DailyState() {
  const { setScreen, currentMissionCategory } = useAppStore()
  const cat = currentMissionCategory || ''
  const data = getCatData(cat)

  const [energy, setEnergy] = useState<string | null>(null)
  const [mental, setMental] = useState<string | null>(null)

  const gc = data ? Number(data.growth_count) || 0 : 0
  const totalCount = data ? Number(data.total_count) || 0 : 0
  const canStart = energy !== null && mental !== null

  function handleStart() {
    if (!canStart) return
    // Store selections for use in first-mission
    useAppStore.setState({ dailyEnergy: energy, dailyMental: mental })
    setScreen('first-mission')
  }

  function ChoiceBtn({
    val, label, emoji, selected, onSelect,
  }: { val: string; label: string; emoji: string; selected: boolean; onSelect: () => void }) {
    return (
      <button
        onClick={onSelect}
        style={{
          flex: 1, padding: '14px 8px',
          background: selected ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${selected ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 14, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          transition: 'all 0.15s',
        }}
      >
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: selected ? '#a78bfa' : 'rgba(255,255,255,0.65)',
        }}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <div className="screen-animate">
      {/* ── 통계 ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '14px 12px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Days</p>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{totalCount}</p>
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '14px 12px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>복리배수</p>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{multStr(gc)}x</p>
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
        오늘 어때요?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>
        상태에 맞는 미션을 드릴게요
      </p>

      {/* ── 에너지 ── */}
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
        에너지
      </p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {ENERGY_OPTS.map(opt => (
          <ChoiceBtn
            key={opt.val}
            {...opt}
            selected={energy === opt.val}
            onSelect={() => setEnergy(opt.val)}
          />
        ))}
      </div>

      {/* ── 멘탈 ── */}
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
        멘탈
      </p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        {MENTAL_OPTS.map(opt => (
          <ChoiceBtn
            key={opt.val}
            {...opt}
            selected={mental === opt.val}
            onSelect={() => setMental(opt.val)}
          />
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!canStart}
        style={{
          width: '100%', padding: '16px',
          background: canStart
            ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
            : 'rgba(139,92,246,0.1)',
          border: 'none', borderRadius: 14,
          color: canStart ? '#fff' : 'rgba(255,255,255,0.3)',
          fontSize: 16, fontWeight: 700,
          cursor: canStart ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        오늘의 미션 보러가기 →
      </button>
    </div>
  )
}
