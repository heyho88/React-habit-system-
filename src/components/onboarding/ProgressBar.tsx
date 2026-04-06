interface ProgressBarProps {
  step: number
  total?: number
}

const STEP_LABELS: Record<number, string> = {
  1: '카테고리',
  2: '세부 선택',
  3: '나의 이야기',
}

export default function ProgressBar({ step, total = 3 }: ProgressBarProps) {
  const pct = (step / total) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
          {STEP_LABELS[step] ?? ''}
        </span>
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
          {step} / {total}
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #a78bfa, #f43f5e)',
            borderRadius: 99,
            transition: 'width 0.5s cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </div>
    </div>
  )
}
