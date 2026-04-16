import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { type CategoryKey } from '../../lib/missions'

type Step =
  | 'category'
  | 'health-exercise'
  | 'health-fail'
  | 'sleep-current'
  | 'sleep-target'
  | 'routine-select'
  | 'routine-fail'
  | 'loading'

// ── 데이터 ──

const cats: { id: CategoryKey; label: string; desc: string; emoji: string; color: string }[] = [
  { id: 'health',  label: '운동/건강',     desc: '신체 에너지는 모든 성장의 기초입니다. 체계적인 운동으로 성과를 만드세요.',  emoji: '💪', color: '#FF6B6B' },
  { id: 'sleep',   label: '수면/기상',     desc: '수면의 질이 하루의 질을 결정합니다. 최적의 기상 루틴을 설계하세요.',       emoji: '🌙', color: '#6C5CE7' },
  { id: 'routine', label: '루틴/생활습관', desc: '작은 습관의 복리가 삶을 바꿉니다. 일상을 시스템으로 만드세요.',            emoji: '⚡', color: '#00D2D3' },
]

const exercises = [
  { id: 'hometraining', label: '홈트레이닝',    desc: '집에서 맨몸 운동 위주로 합니다.',         emoji: '🏠', color: '#FF6B6B' },
  { id: 'gym',          label: '헬스장',         desc: '웨이트 트레이닝을 합니다.',               emoji: '🏋️', color: '#6C5CE7' },
  { id: 'running',      label: '러닝/유산소',    desc: '달리기나 유산소 운동을 합니다.',           emoji: '🏃', color: '#00D2D3' },
  { id: 'yoga',         label: '요가/스트레칭',  desc: '유연성과 마음챙김 운동을 합니다.',         emoji: '🧘', color: '#00B894' },
]

const failReasons = [
  { id: 0, label: '의지력 부족',    desc: '시작은 하지만 며칠 못 가고 포기했어요.',           emoji: '😤', color: '#E17055' },
  { id: 1, label: '방법을 몰라서',  desc: '어떻게 해야 하는지 몰라서 방황했어요.',             emoji: '🤔', color: '#6C5CE7' },
  { id: 2, label: '너무 바빠서',    desc: '하려고 했지만 시간이 없었어요.',                   emoji: '⏰', color: '#FDCB6E' },
  { id: 3, label: '환경이 안 돼서', desc: '주변 환경이 습관 형성에 도움이 안 됐어요.',         emoji: '🌍', color: '#00B894' },
]

const routines = [
  { id: 'digital',  label: '디지털 디톡스', desc: '스마트폰 사용 시간을 줄입니다.',         emoji: '📵', color: '#6C5CE7' },
  { id: 'reading',  label: '독서',          desc: '매일 책 읽는 습관을 만듭니다.',           emoji: '📖', color: '#00B894' },
  { id: 'mental',   label: '멘탈 관리',     desc: '명상과 마음챙김을 실천합니다.',           emoji: '🧠', color: '#E040FB' },
  { id: 'morning',  label: '아침 루틴',     desc: '생산적인 아침을 설계합니다.',             emoji: '🌅', color: '#FDCB6E' },
  { id: 'evening',  label: '저녁 루틴',     desc: '하루를 마무리하는 루틴을 만듭니다.',       emoji: '🌆', color: '#E17055' },
  { id: 'space',    label: '공간/정리',     desc: '환경을 정돈하고 집중력을 높입니다.',       emoji: '🗂️', color: '#00D2D3' },
]

// ── 공통 UI 헬퍼 ──

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #E040FB, #6C5CE7)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

function InfoCard({ dot, label, body }: { dot: string; label: string; body: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{body}</div>
    </div>
  )
}

function NavButtons({
  onBack, backLabel = '이전 단계로',
  onNext, nextLabel = '다음 →',
  nextEnabled,
}: {
  onBack: () => void; backLabel?: string
  onNext: () => void; nextLabel?: string
  nextEnabled: boolean
}) {
  return (
    <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}
      >
        {backLabel}
      </button>
      <button
        onClick={onNext}
        style={{
          background: 'white', color: '#050505', borderRadius: 50,
          padding: '14px 32px', fontSize: 14, fontWeight: 700, border: 'none',
          cursor: nextEnabled ? 'pointer' : 'default',
          opacity: nextEnabled ? 1 : 0.4,
          pointerEvents: nextEnabled ? 'auto' : 'none',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ── 컴포넌트 ──

export default function SelectCategory() {
  const { setScreen, setCategory, setCurrentOnboardingCategory, resetObState,
          setObExerciseType, setObRoutineType, setObFailReason,
          setObSleepCurrentH, setObSleepCurrentM, setObSleepTargetH, setObSleepTargetM } = useAppStore()

  const [selectedCategory,    setSelectedCategory]   = useState<CategoryKey | null>(null)
  const [selectedExercise,    setSelectedExercise]   = useState<string | null>(null)
  const [selectedHealthFail,  setSelectedHealthFail] = useState<number | null>(null)
  const [selectedRoutine,     setSelectedRoutine]    = useState<string | null>(null)
  const [selectedRoutineFail, setSelectedRoutineFail]= useState<number | null>(null)
  const [sleepCurrentH,       setSleepCurrentH]      = useState(22)
  const [sleepCurrentM,       setSleepCurrentM]      = useState(0)
  const [sleepTargetH,        setSleepTargetH]       = useState(22)
  const [sleepTargetM,        setSleepTargetM]       = useState(0)

  const [step,          setStep]          = useState<Step>('category')
  const [animating,     setAnimating]     = useState(false)
  const [loadingPhase,  setLoadingPhase]  = useState<'spinning' | 'done'>('spinning')
  const [phaseAnimating,setPhaseAnimating]= useState(false)

  const goTo = (next: Step) => {
    setAnimating(true)
    setTimeout(() => {
      setStep(next)
      setAnimating(false)
    }, 250)
  }

  useEffect(() => {
    setObSleepCurrentH(sleepCurrentH)
    setObSleepCurrentM(sleepCurrentM)
  }, [sleepCurrentH, sleepCurrentM])

  useEffect(() => {
    setObSleepTargetH(sleepTargetH)
    setObSleepTargetM(sleepTargetM)
  }, [sleepTargetH, sleepTargetM])

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

  const ArrowBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
      color: 'white', cursor: 'pointer', fontSize: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </button>
  )

  const handleCategoryNext = () => {
    if (!selectedCategory) return
    resetObState()
    setCategory(selectedCategory)
    setCurrentOnboardingCategory(selectedCategory)
    if (selectedCategory === 'health') goTo('health-exercise')
    else if (selectedCategory === 'sleep') goTo('sleep-current')
    else if (selectedCategory === 'routine') goTo('routine-select')
  }

  useEffect(() => {
    if (step !== 'loading') return
    let innerTimer: ReturnType<typeof setTimeout>
    const t1 = setTimeout(() => {
      setPhaseAnimating(true)
      innerTimer = setTimeout(() => {
        setLoadingPhase('done')
        setPhaseAnimating(false)
      }, 200)
    }, 1800)
    const t2 = setTimeout(() => setScreen('ob-step2'), 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(innerTimer)
    }
  }, [step, setScreen])

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      zIndex: 100,
      overflowY: 'auto',
    }}>

      {/* 상단 네비 */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        zIndex: 10,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>● SLOO</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
          ONBOARDING V1.0
        </span>
      </div>

      {/* 외부 카드 컨테이너 — 고정 */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        minHeight: '580px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>

        {/* 진행 바 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'linear-gradient(90deg, #E040FB, #6C5CE7)' }} />
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* 콘텐츠 래퍼 */}
        <div style={{
          flex: 1,
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}>

          {/* ─── CATEGORY ─── */}
          {step === 'category' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : CATEGORY SELECTION
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>당신의 성장을 위한</div>
                    <div><span style={gradientText}>첫 번째 영역을</span></div>
                    <div style={{ color: 'white' }}>선택하세요.</div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    우리는 매일 1%의 작은 성과가 만드는 복리의 마법을 믿습니다. 지금 가장 집중하고 싶은 영역을 선택해 주세요.
                  </p>
                  <InfoCard dot="#00D2D3" label="PROJECTIONS" body="미션 완료 시 1년 후 예상 성장치: +37.8x Efficiency" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cats.map(cat => {
                    const isSel = selectedCategory === cat.id
                    return (
                      <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 20px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                        background: isSel ? 'rgba(108,92,231,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isSel ? '1px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                          background: `linear-gradient(135deg,${cat.color}22,${cat.color}44)`,
                          border: `1px solid ${cat.color}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                          {cat.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>{cat.label}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{cat.desc}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: isSel ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)' }}>
                          {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
                <button onClick={() => setScreen('home')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                  건너뛰기
                </button>
                <button onClick={handleCategoryNext} style={{
                  background: 'white', color: '#050505', borderRadius: 50,
                  padding: '14px 32px', fontSize: 14, fontWeight: 700, border: 'none',
                  cursor: selectedCategory ? 'pointer' : 'default',
                  opacity: selectedCategory ? 1 : 0.4,
                  pointerEvents: selectedCategory ? 'auto' : 'none',
                }}>
                  다음 →
                </button>
              </div>
            </>
          )}

          {/* ─── HEALTH-EXERCISE ─── */}
          {step === 'health-exercise' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : EXERCISE TYPE
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>어떤 운동을</div>
                    <div><span style={gradientText}>주로 하시나요?</span></div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    현재 수준에 맞는 미션을 단계적으로 설계합니다.
                  </p>
                  <InfoCard dot="#00D2D3" label="CALIBRATION" body="운동 패턴을 분석하여 최적의 미션을 배정합니다." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {exercises.map(item => {
                    const isSel = selectedExercise === item.id
                    return (
                      <div key={item.id} onClick={() => { setSelectedExercise(item.id); setObExerciseType(item.id) }} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 20px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                        background: isSel ? 'rgba(108,92,231,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isSel ? '1px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                          background: `linear-gradient(135deg,${item.color}22,${item.color}44)`,
                          border: `1px solid ${item.color}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                          {item.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: isSel ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)' }}>
                          {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <NavButtons
                onBack={() => goTo('category')}
                onNext={() => goTo('health-fail')}
                nextEnabled={!!selectedExercise}
              />
            </>
          )}

          {/* ─── HEALTH-FAIL ─── */}
          {step === 'health-fail' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : ANALYSIS
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>운동 습관이</div>
                    <div><span style={gradientText}>실패했던 이유가</span></div>
                    <div style={{ color: 'white' }}>무엇인가요?</div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    솔직한 답변이 당신에게 맞는 시스템을 설계하는 데 도움이 됩니다.
                  </p>
                  <InfoCard dot="#00D2D3" label="SYSTEM ANALYSIS" body="선택 결과를 기반으로 최적의 루틴을 설계합니다." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {failReasons.map(item => {
                    const isSel = selectedHealthFail === item.id
                    return (
                      <div key={item.id} onClick={() => { setSelectedHealthFail(item.id); setObFailReason(item.id) }} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 20px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                        background: isSel ? 'rgba(108,92,231,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isSel ? '1px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                          background: `linear-gradient(135deg,${item.color}22,${item.color}44)`,
                          border: `1px solid ${item.color}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                          {item.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: isSel ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)' }}>
                          {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <NavButtons
                onBack={() => goTo('health-exercise')}
                onNext={() => goTo('loading')}
                nextEnabled={selectedHealthFail !== null}
                nextLabel="분석 시작 →"
              />
            </>
          )}

          {/* ─── SLEEP-CURRENT ─── */}
          {step === 'sleep-current' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : SLEEP BASELINE
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>보통 몇 시에</div>
                    <div><span style={gradientText}>주무시나요?</span></div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    현재 수면 패턴을 파악합니다. 정확할수록 더 나은 목표를 설계합니다.
                  </p>
                  <InfoCard dot="#00D2D3" label="BASELINE CALIBRATION" body="현재 취침 시간을 기준으로 단계적 목표를 설정합니다." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'white', fontFamily: 'monospace', marginBottom: 8 }}>
                      {formatTime(sleepCurrentH, sleepCurrentM)}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                      취침 시간
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                    {/* 시 컨트롤 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>시간</div>
                      <ArrowBtn onClick={() => setSleepCurrentH(h => (h + 1) % 24)}>▲</ArrowBtn>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'white', minWidth: 40, textAlign: 'center' }}>
                        {String(sleepCurrentH).padStart(2, '0')}
                      </div>
                      <ArrowBtn onClick={() => setSleepCurrentH(h => (h - 1 + 24) % 24)}>▼</ArrowBtn>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>:</div>
                    {/* 분 컨트롤 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>분</div>
                      <ArrowBtn onClick={() => setSleepCurrentM(m => (m + 5) % 60)}>▲</ArrowBtn>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'white', minWidth: 40, textAlign: 'center' }}>
                        {String(sleepCurrentM).padStart(2, '0')}
                      </div>
                      <ArrowBtn onClick={() => setSleepCurrentM(m => (m - 5 + 60) % 60)}>▼</ArrowBtn>
                    </div>
                  </div>
                </div>
              </div>
              <NavButtons
                onBack={() => goTo('category')}
                onNext={() => goTo('sleep-target')}
                nextEnabled={true}
              />
            </>
          )}

          {/* ─── SLEEP-TARGET ─── */}
          {step === 'sleep-target' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : SLEEP TARGET
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>목표 취침 시간은</div>
                    <div><span style={gradientText}>언제인가요?</span></div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    달성 가능한 목표부터 시작합니다. 너무 급격한 변화보다 작은 개선이 효과적입니다.
                  </p>
                  <InfoCard dot="#00D2D3" label="TARGET PROJECTION" body="설정한 목표로 단계적으로 수면 시간을 조정합니다." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'white', fontFamily: 'monospace', marginBottom: 8 }}>
                      {formatTime(sleepTargetH, sleepTargetM)}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                      목표 취침 시간
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                    {/* 시 컨트롤 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>시간</div>
                      <ArrowBtn onClick={() => setSleepTargetH(h => (h + 1) % 24)}>▲</ArrowBtn>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'white', minWidth: 40, textAlign: 'center' }}>
                        {String(sleepTargetH).padStart(2, '0')}
                      </div>
                      <ArrowBtn onClick={() => setSleepTargetH(h => (h - 1 + 24) % 24)}>▼</ArrowBtn>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>:</div>
                    {/* 분 컨트롤 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>분</div>
                      <ArrowBtn onClick={() => setSleepTargetM(m => (m + 5) % 60)}>▲</ArrowBtn>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'white', minWidth: 40, textAlign: 'center' }}>
                        {String(sleepTargetM).padStart(2, '0')}
                      </div>
                      <ArrowBtn onClick={() => setSleepTargetM(m => (m - 5 + 60) % 60)}>▼</ArrowBtn>
                    </div>
                  </div>
                </div>
              </div>
              <NavButtons
                onBack={() => goTo('sleep-current')}
                onNext={() => goTo('loading')}
                nextEnabled={true}
                nextLabel="분석 시작 →"
              />
            </>
          )}

          {/* ─── ROUTINE-SELECT ─── */}
          {step === 'routine-select' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : ROUTINE TYPE
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>어떤 루틴을</div>
                    <div><span style={gradientText}>만들고 싶으신가요?</span></div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    집중할 루틴을 하나 선택하세요. 나중에 추가할 수 있습니다.
                  </p>
                  <InfoCard dot="#00D2D3" label="CALIBRATION" body="루틴 패턴을 분석하여 미션을 설계합니다." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {routines.map(item => {
                    const isSel = selectedRoutine === item.id
                    return (
                      <div key={item.id} onClick={() => { setSelectedRoutine(item.id); setObRoutineType(item.id) }} style={{
                        display: 'flex', flexDirection: 'column', gap: 8,
                        padding: '16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                        background: isSel ? 'rgba(108,92,231,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isSel ? '1px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                            background: `linear-gradient(135deg,${item.color}22,${item.color}44)`,
                            border: `1px solid ${item.color}55`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            {item.emoji}
                          </div>
                          <div style={{ width: 16, height: 16, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: isSel ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)' }}>
                            {isSel && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{item.desc}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <NavButtons
                onBack={() => goTo('category')}
                onNext={() => goTo('routine-fail')}
                nextEnabled={!!selectedRoutine}
              />
            </>
          )}

          {/* ─── ROUTINE-FAIL ─── */}
          {step === 'routine-fail' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : ANALYSIS
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>루틴 유지가</div>
                    <div><span style={gradientText}>어려웠던 이유가</span></div>
                    <div style={{ color: 'white' }}>무엇인가요?</div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    솔직한 답변이 당신에게 맞는 시스템을 설계하는 데 도움이 됩니다.
                  </p>
                  <InfoCard dot="#00D2D3" label="SYSTEM ANALYSIS" body="선택 결과를 기반으로 최적의 루틴을 설계합니다." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {failReasons.map(item => {
                    const isSel = selectedRoutineFail === item.id
                    return (
                      <div key={item.id} onClick={() => { setSelectedRoutineFail(item.id); setObFailReason(item.id) }} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 20px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                        background: isSel ? 'rgba(108,92,231,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isSel ? '1px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                          background: `linear-gradient(135deg,${item.color}22,${item.color}44)`,
                          border: `1px solid ${item.color}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                          {item.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: isSel ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)' }}>
                          {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <NavButtons
                onBack={() => goTo('routine-select')}
                onNext={() => goTo('loading')}
                nextEnabled={selectedRoutineFail !== null}
                nextLabel="분석 시작 →"
              />
            </>
          )}

          {/* ─── LOADING ─── */}
          {step === 'loading' && (
            <div style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{ opacity: phaseAnimating ? 0 : 1, transition: 'opacity 0.2s' }}>
                {loadingPhase === 'spinning' ? (
                  <>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#8B5CF6" strokeWidth="3"
                        strokeDasharray="44 132" strokeLinecap="round"
                        style={{ transformOrigin: 'center', animation: 'spin 1s linear infinite' }}/>
                    </svg>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.2em', marginTop: 24 }}>
                      SYSTEM_ANALYSIS
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: 'white', marginTop: 12 }}>
                      시스템이 당신을 분석중입니다...
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                      최적의 성장 경로를 계산하고 있습니다.
                    </div>
                  </>
                ) : (
                  <>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeWidth="2"/>
                      <path d="M 20 32 L 29 41 L 44 24" stroke="white" strokeWidth="2.5"
                        fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginTop: 12 }}>
                      분석 완료
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                      2단계로 이동합니다...
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 하단 푸터 */}
      <div style={{
        position: 'absolute',
        bottom: 24, left: 0, right: 0,
        display: 'flex', gap: 48, justifyContent: 'center',
      }}>
        <div>
          <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>DATA PRIVACY</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>AES-256 ENCRYPTED</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>NETWORK</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>SYSTEM READY</div>
        </div>
      </div>

    </div>
  )
}
