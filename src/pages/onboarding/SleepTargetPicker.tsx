import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import DrumPicker from '../../components/DrumPicker'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINS = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

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

export default function SleepTargetPicker() {
  const { setScreen, obSleepTargetH, obSleepTargetM } = useAppStore()
  const [hIdx, setHIdx] = useState(obSleepTargetH)
  const [mIdx, setMIdx] = useState(Math.round(obSleepTargetM / 5))

  function handleNext() {
    useAppStore.setState({ obSleepTargetH: hIdx, obSleepTargetM: parseInt(MINS[mIdx]) })
    setScreen('ob-sleep-confirm')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        목표 취침 시간은?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40 }}>
        현실적으로 목표를 정해보세요
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 48 }}>
        <DrumPicker items={HOURS} value={hIdx} onChange={setHIdx} />
        <span style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.6)', paddingBottom: 4 }}>:</span>
        <DrumPicker items={MINS} value={mIdx} onChange={setMIdx} />
      </div>

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          border: 'none',
          borderRadius: 14,
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        다음 →
      </button>
    </div>
  )
}
