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

const cats: { id: CategoryKey; label: string; desc: string; emoji: string; color: string }[] = [
  { id: 'health',  label: '운동/건강',     desc: '신체 에너지는 모든 성장의 기초입니다. 체계적인 운동으로 성과를 만드세요.',  emoji: '💪', color: '#FF6B6B' },
  { id: 'sleep',   label: '수면/기상',     desc: '수면의 질이 하루의 질을 결정합니다. 최적의 기상 루틴을 설계하세요.',       emoji: '🌙', color: '#6C5CE7' },
  { id: 'routine', label: '루틴/생활습관', desc: '작은 습관의 복리가 삶을 바꿉니다. 일상을 시스템으로 만드세요.',            emoji: '⚡', color: '#00D2D3' },
]

export default function SelectCategory() {
  const { setScreen, setCategory, setCurrentOnboardingCategory, resetObState } = useAppStore()

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null)
  const [step, setStep]                         = useState<Step>('category')
  const [animating, setAnimating]               = useState(false)
  const [loadingPhase, setLoadingPhase]         = useState<'spinning' | 'done'>('spinning')
  const [phaseAnimating, setPhaseAnimating]     = useState(false)

  const goTo = (next: Step) => {
    setAnimating(true)
    setTimeout(() => {
      setStep(next)
      setAnimating(false)
    }, 250)
  }

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

        {/* 콘텐츠 래퍼 — 내부만 fade+slide 전환 */}
        <div style={{
          flex: 1,
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}>

          {/* ─── STEP: CATEGORY ─── */}
          {step === 'category' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginBottom: 24 }}>
                    STEP 01 : CATEGORY SELECTION
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                    <div style={{ color: 'white' }}>당신의 성장을 위한</div>
                    <div>
                      <span style={{
                        background: 'linear-gradient(90deg, #E040FB, #6C5CE7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>첫 번째 영역을</span>
                    </div>
                    <div style={{ color: 'white' }}>선택하세요.</div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    우리는 매일 1%의 작은 성과가 만드는 복리의 마법을 믿습니다. 지금 가장 집중하고 싶은 영역을 선택해 주세요.
                  </p>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D2D3', flexShrink: 0 }} />
                      <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>PROJECTIONS</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>미션 완료 시 1년 후 예상 성장치:</div>
                    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'monospace', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ color: 'white' }}>+37.8x</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 600 }}>Efficiency</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cats.map(cat => {
                    const isSelected = selectedCategory === cat.id
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 16,
                          padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                          background: isSelected ? 'rgba(108,92,231,0.12)' : 'rgba(255,255,255,0.03)',
                          border: isSelected ? '1px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                          background: `linear-gradient(135deg,${cat.color}22,${cat.color}44)`,
                          border: `1px solid ${cat.color}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                        }}>
                          {cat.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>{cat.label}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{cat.desc}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: isSelected ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)',
                          background: 'transparent',
                        }}>
                          {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />}
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>

              <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
                <button
                  onClick={() => setScreen('home')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}
                >
                  건너뛰기
                </button>
                <button
                  onClick={handleCategoryNext}
                  style={{
                    background: 'white', color: '#050505', borderRadius: 50,
                    padding: '14px 32px', fontSize: 14, fontWeight: 700, border: 'none',
                    cursor: selectedCategory ? 'pointer' : 'default',
                    opacity: selectedCategory ? 1 : 0.4,
                    pointerEvents: selectedCategory ? 'auto' : 'none',
                  }}
                >
                  다음 →
                </button>
              </div>
            </>
          )}

          {/* ─── PLACEHOLDER STEPS ─── */}
          {(step === 'health-exercise' || step === 'health-fail' || step === 'sleep-current' || step === 'sleep-target' || step === 'routine-select' || step === 'routine-fail') && (
            <>
              {step === 'health-exercise' && (
                <div style={{ color: 'white', fontSize: 20, padding: 40 }}>
                  HEALTH-EXERCISE (다음 작업에서 구현)
                </div>
              )}
              {step === 'health-fail' && (
                <div style={{ color: 'white', fontSize: 20, padding: 40 }}>
                  HEALTH-FAIL (다음 작업에서 구현)
                </div>
              )}
              {step === 'sleep-current' && (
                <div style={{ color: 'white', fontSize: 20, padding: 40 }}>
                  SLEEP-CURRENT (다음 작업에서 구현)
                </div>
              )}
              {step === 'sleep-target' && (
                <div style={{ color: 'white', fontSize: 20, padding: 40 }}>
                  SLEEP-TARGET (다음 작업에서 구현)
                </div>
              )}
              {step === 'routine-select' && (
                <div style={{ color: 'white', fontSize: 20, padding: 40 }}>
                  ROUTINE-SELECT (다음 작업에서 구현)
                </div>
              )}
              {step === 'routine-fail' && (
                <div style={{ color: 'white', fontSize: 20, padding: 40 }}>
                  ROUTINE-FAIL (다음 작업에서 구현)
                </div>
              )}
              <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
                <button
                  onClick={() => goTo('category')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}
                >
                  이전 단계로
                </button>
                <button
                  onClick={() => goTo('loading')}
                  style={{
                    background: 'white', color: '#050505', borderRadius: 50,
                    padding: '14px 32px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                  }}
                >
                  다음 →
                </button>
              </div>
            </>
          )}

          {/* ─── STEP: LOADING ─── */}
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
                      <circle
                        cx="32" cy="32" r="28" fill="none" stroke="#8B5CF6" strokeWidth="3"
                        strokeDasharray="44 132" strokeLinecap="round"
                        style={{ transformOrigin: 'center', animation: 'spin 1s linear infinite' }}
                      />
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
        display: 'flex',
        gap: 48,
        justifyContent: 'center',
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
