import SelectionCard from './SelectionCard'
import ProgressBar from './ProgressBar'
import { useOnboardingStore } from '../../store/useOnboardingStore'

const types = [
  { emoji: '🌅', label: '아침 루틴', value: 'morning' },
  { emoji: '🌙', label: '저녁 루틴', value: 'evening' },
  { emoji: '🏠', label: '정리정돈', value: 'space' },
  { emoji: '📵', label: '디지털 디톡스', value: 'digital' },
  { emoji: '🧘', label: '멘탈관리', value: 'mental' },
  { emoji: '📚', label: '독서', value: 'reading' },
]

export default function Screen2BRoutine() {
  const { setType, setScreen } = useOnboardingStore()

  const handleSelect = (value: string) => {
    setType(value)
    setScreen('fail-reason')
  }

  return (
    <div className="screen-animate">
      <ProgressBar step={2} />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        어떤 루틴을 시작할까요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        지금 당장 시작할 수 있는 것으로
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {types.map((t) => (
          <SelectionCard
            key={t.value}
            emoji={t.emoji}
            label={t.label}
            onClick={() => handleSelect(t.value)}
          />
        ))}
      </div>
    </div>
  )
}
