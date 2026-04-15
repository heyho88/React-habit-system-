import { useEffect } from 'react'
import { useAppStore } from '../../store/appStore'

export default function ObLoading() {
  const { setScreen } = useAppStore()

  useEffect(() => {
    const t = setTimeout(() => setScreen('ob-step2'), 2500)
    return () => clearTimeout(t)
  }, [setScreen])

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
    }}>
      <style>{`
        @keyframes ob-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40" cy="40" r="35"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx="40" cy="40" r="35"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeDasharray="60 160"
          strokeLinecap="round"
          style={{ transformOrigin: 'center', animation: 'ob-spin 1.2s linear infinite' }}
        />
      </svg>

      <div style={{
        fontSize: 10,
        fontFamily: 'monospace',
        color: '#8B5CF6',
        letterSpacing: '0.2em',
        marginTop: 32,
      }}>
        SYSTEM_ANALYSIS
      </div>
      <div style={{
        fontSize: 18,
        fontWeight: 600,
        color: 'white',
        marginTop: 12,
      }}>
        시스템이 당신을 분석중입니다...
      </div>
      <div style={{
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 8,
      }}>
        최적의 성장 경로를 계산하고 있습니다.
      </div>
    </div>
  )
}
