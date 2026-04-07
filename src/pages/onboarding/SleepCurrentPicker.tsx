import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import DrumPicker from '../../components/DrumPicker'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINS = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

function ProgressBar() {
  return (
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>2 / 3</span>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8 }}>
        <div style={{ height: '100%', width: '66%', background: '#8b5cf6', borderRadius: 99 }} />
      </div>
    </div>
  )
}

export default function SleepCurrentPicker() {
  const { setScreen, obSleepCurrentH, obSleepCurrentM } = useAppStore()
  const [hIdx, setHIdx] = useState(obSleepCurrentH)
  const [mIdx, setMIdx] = useState(Math.round(obSleepCurrentM / 5))

  function handleNext() {
    useAppStore.setState({ obSleepCurrentH: hIdx, obSleepCurrentM: parseInt(MINS[mIdx]) })
    setScreen('ob-sleep-target')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        보통 몇 시에 자요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40 }}>
        지금 기준으로 솔직하게
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
