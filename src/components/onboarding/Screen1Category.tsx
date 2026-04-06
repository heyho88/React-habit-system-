import SelectionCard from './SelectionCard'
import ProgressBar from './ProgressBar'
import { useOnboardingStore } from '../../store/useOnboardingStore'

const categories = [
  { emoji: '🏃', label: '운동/건강', value: 'health' as const },
  { emoji: '😴', label: '수면/기상', value: 'sleep' as const },
  { emoji: '📋', label: '루틴/생활습관', value: 'routine' as const },
]

export default function Screen1Category() {
  const { setCategory, setScreen } = useOnboardingStore()

  const handleSelect = (value: 'health' | 'sleep' | 'routine') => {
    setCategory(value)
    if (value === 'health') setScreen('exercise-type')
    else if (value === 'sleep') setScreen('sleep-picker')
    else setScreen('routine-type')
  }

  return (
    <div className="screen-animate">
      <ProgressBar step={1} />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        뭘 바꾸고 싶으세요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        딱 하나만 골라보세요
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {categories.map((cat) => (
          <SelectionCard
            key={cat.value}
            emoji={cat.emoji}
            label={cat.label}
            onClick={() => handleSelect(cat.value)}
          />
        ))}
      </div>
    </div>
  )
}
