import { useState } from 'react'
import DrumPicker from './DrumPicker'
import ProgressBar from './ProgressBar'
import { useOnboardingStore } from '../../store/useOnboardingStore'

const hours = Array.from({ length: 24 }, (_, i) => `${i}시`)
const minutes = ['00분', '05분', '10분', '15분', '20분', '25분', '30분', '35분', '40분', '45분', '50분', '55분']

export default function Screen2CSleep() {
  const { sleepHour, sleepMinute, setSleepTime, setType, setScreen } = useOnboardingStore()
  const [hour, setHour] = useState(sleepHour)
  const [minute, setMinute] = useState(sleepMinute / 5)

  const handleNext = () => {
    setSleepTime(hour, minute * 5)
    setType('sleep')
    setScreen('fail-reason')
  }

  return (
    <div className="screen-animate">
      <ProgressBar step={2} />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        보통 몇 시에 자요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40 }}>
        목표 취침 시간을 정해봐요
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 48,
        padding: '24px 0',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <DrumPicker items={hours} value={hour} onChange={setHour} />
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 22, fontWeight: 300, userSelect: 'none' }}>:</span>
        <DrumPicker items={minutes} value={minute} onChange={setMinute} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          선택한 취침 시간:{' '}
          <span style={{ color: '#a78bfa', fontWeight: 700 }}>
            {String(hour).padStart(2, '0')}:{String(minute * 5).padStart(2, '0')}
          </span>
        </span>
      </div>

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          padding: '16px',
          background: '#ffffff',
          color: '#000000',
          border: 'none',
          borderRadius: 100,
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
      >
        다음
      </button>
    </div>
  )
}
