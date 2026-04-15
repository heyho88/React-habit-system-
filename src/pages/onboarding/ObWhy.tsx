import { useState } from 'react'
import { useAppStore } from '../../store/appStore'

const reasons = [
  { id: 'willpower', label: '의지력 부족',   desc: '시작은 하지만 며칠 못 가고 포기했어요.',           emoji: '😤' },
  { id: 'method',    label: '방법을 몰라서', desc: '어떻게 해야 하는지 몰라서 방황했어요.',             emoji: '🤔' },
  { id: 'busy',      label: '너무 바빠서',   desc: '하려고 했지만 시간이 없었어요.',                   emoji: '⏰' },
  { id: 'env',       label: '환경이 안 돼서', desc: '주변 환경이 습관 형성에 도움이 안 됐어요.',        emoji: '🌍' },
]

export default function ObWhy() {
  const { setScreen } = useAppStore()
  const [selectedReason, setSelectedReason] = useState<string | null>(null)

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
            {/* 스텝 라벨 */}
            <div style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: '#8B5CF6',
              letterSpacing: '0.15em',
              marginBottom: 24,
            }}>
              STEP 01 : ANALYSIS
            </div>

            {/* 헤드라인 */}
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              <div style={{ color: 'white' }}>이전에 습관이</div>
              <div>
                <span style={{
                  background: 'linear-gradient(90deg, #E040FB, #6C5CE7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>실패했던 이유가</span>
              </div>
              <div style={{ color: 'white' }}>무엇인가요?</div>
            </div>

            {/* 서브텍스트 */}
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              솔직한 답변이 당신에게 맞는 시스템을 설계하는 데 도움이 됩니다.
            </p>

            {/* INFO 카드 */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D2D3', flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  SYSTEM ANALYSIS
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                선택 결과를 기반으로 최적의 루틴을 설계합니다.
              </div>
            </div>
          </div>

          {/* 우측 — 이유 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reasons.map(r => {
              const isSelected = selectedReason === r.id
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReason(r.id)}
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
                    width: 48, height: 48,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {r.emoji}
                  </div>

                  {/* 텍스트 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      {r.desc}
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
            onClick={() => setScreen('ob-category')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            이전 단계로
          </button>
          <button
            onClick={() => selectedReason && setScreen('ob-loading')}
            style={{
              background: 'white',
              color: '#050505',
              borderRadius: 50,
              padding: '14px 32px',
              fontSize: 14,
              fontWeight: 700,
              cursor: selectedReason ? 'pointer' : 'default',
              border: 'none',
              opacity: selectedReason ? 1 : 0.4,
              pointerEvents: selectedReason ? 'auto' : 'none',
            }}
          >
            분석 시작 →
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
