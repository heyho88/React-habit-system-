import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { type CategoryKey } from '../../lib/missions'

const cats: { id: CategoryKey; label: string; desc: string; emoji: string; color: string }[] = [
  { id: 'health',  label: '운동/건강',     desc: '신체 에너지는 모든 성장의 기초입니다. 체계적인 운동으로 성과를 만드세요.',  emoji: '💪', color: '#FF6B6B' },
  { id: 'sleep',   label: '수면/기상',     desc: '수면의 질이 하루의 질을 결정합니다. 최적의 기상 루틴을 설계하세요.',       emoji: '🌙', color: '#6C5CE7' },
  { id: 'routine', label: '루틴/생활습관', desc: '작은 습관의 복리가 삶을 바꿉니다. 일상을 시스템으로 만드세요.',            emoji: '⚡', color: '#00D2D3' },
]

const screenFor: Record<string, string> = {
  health:  'ob-exercise',
  sleep:   'ob-sleep-current',
  routine: 'ob-routine',
}

export default function SelectCategory() {
  const { setScreen, setCategory, setCurrentOnboardingCategory, resetObState } = useAppStore()
  const [selected, setSelected] = useState<CategoryKey | null>(null)

  function handleSelect(val: CategoryKey) {
    setSelected(val)
  }

  function handleNext() {
    if (!selected) return
    resetObState()
    setCategory(selected)
    setCurrentOnboardingCategory(selected)
    setScreen(screenFor[selected])
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      width: '100vw', height: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      overflow: 'auto',
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

      {/* 중앙 카드 컨테이너 */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 48px',
      }}>

        {/* 진행 바 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'linear-gradient(90deg, #E040FB, #6C5CE7)' }} />
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* 메인 2컬럼 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}>

          {/* 좌측 */}
          <div>
            {/* ① 스텝 라벨 */}
            <div style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: '#8B5CF6',
              letterSpacing: '0.15em',
              marginBottom: 24,
            }}>
              STEP 01 : CATEGORY SELECTION
            </div>

            {/* ② 헤드라인 */}
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

            {/* ③ 서브텍스트 */}
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              우리는 매일 1%의 작은 성과가 만드는 복리의 마법을 믿습니다. 지금 가장 집중하고 싶은 영역을 선택해 주세요.
            </p>

            {/* ④ PROJECTIONS 카드 */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D2D3', flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  PROJECTIONS
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                미션 완료 시 1년 후 예상 성장치:
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>
                +37.8x &nbsp; Efficiency
              </div>
            </div>
          </div>

          {/* 우측 — 카테고리 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cats.map(cat => {
              const isSelected = selected === cat.id
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isSelected ? 'rgba(108,92,231,0.1)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1px solid rgba(139,92,246,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* 썸네일 */}
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `linear-gradient(135deg,${cat.color}22,${cat.color}44)`,
                    border: `1px solid ${cat.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                  }}>
                    {cat.emoji}
                  </div>

                  {/* 텍스트 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      {cat.desc}
                    </div>
                  </div>

                  {/* 라디오 */}
                  <div style={{
                    width: 20, height: 20,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected ? '2px solid #8B5CF6' : '2px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                  }}>
                    {isSelected && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* 하단 버튼 */}
        <div style={{
          marginTop: 40,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 24,
        }}>
          <button
            onClick={() => setScreen('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            건너뛰기
          </button>
          <button
            onClick={handleNext}
            style={{
              background: 'white',
              color: '#050505',
              borderRadius: 50,
              padding: '14px 32px',
              fontSize: 14,
              fontWeight: 700,
              cursor: selected ? 'pointer' : 'default',
              border: 'none',
              opacity: selected ? 1 : 0.4,
              pointerEvents: selected ? 'auto' : 'none',
            }}
          >
            다음 →
          </button>
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
          <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
            DATA PRIVACY
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>AES-256 ENCRYPTED</div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
            NETWORK
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>SYSTEM READY</div>
        </div>
      </div>

    </div>
  )
}
