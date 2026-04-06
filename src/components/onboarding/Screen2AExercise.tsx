import SelectionCard from './SelectionCard'
import ProgressBar from './ProgressBar'
import { useOnboardingStore } from '../../store/useOnboardingStore'

const types = [
  { emoji: '🏋️', label: '헬스장', value: 'gym' },
  { emoji: '🏠', label: '홈트', value: 'hometraining' },
  { emoji: '🚶', label: '걷기/달리기', value: 'walking' },
]

export default function Screen2AExercise() {
  const { setType, setScreen } = useOnboardingStore()

  const handleSelect = (value: string) => {
    setType(value)
    setScreen('fail-reason')
  }

  return (
    <div className="screen-animate">
      <ProgressBar step={2} />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        어떤 운동 하고 싶으세요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        가장 해보고 싶은 걸로 골라보세요
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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
