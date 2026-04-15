import { useAppStore } from '../../store/appStore'
import { CAT_META, type CategoryKey } from '../../lib/missions'

const cats: { value: CategoryKey; icon: string }[] = [
  { value: 'health',  icon: '🏃' },
  { value: 'sleep',   icon: '😴' },
  { value: 'routine', icon: '📋' },
]

const screenFor: Record<string, string> = {
  health:  'ob-exercise',
  sleep:   'ob-sleep-current',
  routine: 'ob-routine',
}

export default function SelectCategory() {
  const { setScreen, setCategory, setCurrentOnboardingCategory, resetObState } = useAppStore()

  function handleSelect(val: CategoryKey) {
    resetObState()
    setCategory(val)
    setCurrentOnboardingCategory(val)
    setScreen(screenFor[val])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>

      {/* 상단 네비바 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        zIndex: 50,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>● SLOO</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
          ONBOARDING V1.0
        </span>
      </div>

      {/* 중앙 카드 컨테이너 */}
      <div style={{
        width: '100%',
        maxWidth: '860px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px',
        position: 'relative',
      }}>

        {/* 진행 바 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          <div style={{
            height: 3,
            borderRadius: 2,
            flex: 1,
            background: 'linear-gradient(90deg, #E040FB, #6C5CE7)',
          }} />
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ height: 3, borderRadius: 2, flex: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* 메인 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}>

          {/* 좌측 콘텐츠 */}
          <div>
            {/* ① 스텝 라벨 */}
            <div style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: '#8B5CF6',
              letterSpacing: '0.15em',
              marginBottom: 20,
            }}>
              STEP 01 : CATEGORY SELECTION
            </div>

            {/* ② 헤드라인 */}
            <div style={{
              fontSize: 'clamp(26px, 3.5vw, 34px)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 16,
            }}>
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
              한 번에 하나의 분야에만 집중하는 것이 복리 시스템의 핵심입니다.
            </p>

            {/* ④ PROJECTIONS 카드 */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D2D3' }} />
                <span style={{
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.1em',
                }}>PROJECTIONS</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                미션 완료 시 1년 후 예상 성장치:
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'monospace' }}>
                +37.8x &nbsp; Efficiency
              </div>
            </div>
          </div>

          {/* 우측 콘텐츠 — 기존 카테고리 카드 그대로 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {cats.map(({ value, icon }) => (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '24px 8px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.5,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.12)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.4)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                {CAT_META[value].label}
              </button>
            ))}
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
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
            onClick={() => setScreen('home')}
          >
            건너뛰기
          </button>
          <button
            style={{
              background: 'white',
              color: '#050505',
              borderRadius: '50px',
              padding: '14px 32px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
            }}
            onClick={() => setScreen('home')}
          >
            다음
          </button>
        </div>

      </div>

      {/* 하단 푸터 */}
      <div style={{ marginTop: 32, display: 'flex', gap: 48, justifyContent: 'center' }}>
        <div>
          <div style={{
            fontSize: 8,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
          }}>DATA PRIVACY</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>AES-256 ENCRYPTED</div>
        </div>
        <div>
          <div style={{
            fontSize: 8,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
          }}>NETWORK</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>SYSTEM READY</div>
        </div>
      </div>

    </div>
  )
}
