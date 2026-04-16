import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'

export default function ObLoading() {
  const { setScreen } = useAppStore()
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('done'), 1800)
    const t2 = setTimeout(() => setScreen('ob-step2'), 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [setScreen])

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>

      {/* 카드 컨테이너 */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '500px',
      }}>

        {/* 진행바 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px', width: '100%' }}>
          <div style={{ background: 'linear-gradient(90deg, #E040FB, #6C5CE7)', height: 3, flex: 1, borderRadius: 2 }} />
          <div style={{ background: 'rgba(255,255,255,0.15)', height: 3, flex: 1, borderRadius: 2 }} />
          <div style={{ background: 'rgba(255,255,255,0.15)', height: 3, flex: 1, borderRadius: 2 }} />
        </div>

        {/* 중앙 콘텐츠 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {phase === 'loading' ? (
            <>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeDasharray="44 132"
                  strokeLinecap="round"
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
                <circle cx="32" cy="32" r="28" fill="rgba(139,92,246,0.2)" stroke="#8B5CF6" strokeWidth="2"/>
                <path
                  d="M 20 32 L 29 41 L 44 24"
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'white', marginTop: 12 }}>
                분석 완료
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                2단계로 이동합니다...
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
