import { useEffect, useRef, useState, type ReactNode } from 'react'
import { APP_BACKGROUND } from '../../styles/appBackground'

type Props = {
  step: 1 | 2 | 3
  screenKey: string
  children: ReactNode
}

export default function ObStepsShell({ step, screenKey, children }: Props) {
  const [animating, setAnimating] = useState(false)
  const [displayed, setDisplayed] = useState<{ step: number; screenKey: string; children: ReactNode }>(
    { step, screenKey, children }
  )
  const prevKeyRef = useRef(screenKey)

  // screen 이 바뀌면 fade-out → swap → fade-in.
  // 같은 screen 안의 하위 컴포넌트는 zustand 에서 상태를 직접 읽으므로
  // displayed 를 별도로 갱신할 필요가 없다.
  useEffect(() => {
    if (prevKeyRef.current === screenKey) return
    setAnimating(true)
    const t = setTimeout(() => {
      prevKeyRef.current = screenKey
      setDisplayed({ step, screenKey, children })
      setAnimating(false)
    }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey])

  const bar = (active: boolean): React.CSSProperties => ({
    height: 3, borderRadius: 2, flex: 1,
    background: active ? 'linear-gradient(90deg,#E040FB,#6C5CE7)' : 'rgba(255,255,255,0.15)',
    transition: 'background 0.25s ease',
  })

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: APP_BACKGROUND,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      <style>{`
        @keyframes ob-shell-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        .ob-shell-fade {
          animation: ob-shell-in 320ms ease-out both;
        }
      `}</style>

      {/* 상단 네비 */}
      <div className="ob-shell-fade" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        zIndex: 10,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 12px #8b5cf6', display: 'inline-block' }} />
          SLOO
        </span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
          ONBOARDING V1.0
        </span>
      </div>

      {/* 외부 카드 컨테이너 — 전 화면 동안 고정 */}
      <div className="ob-shell-fade" style={{
        width: '100%',
        maxWidth: '900px',
        height: '640px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>

        {/* 진행 바 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
          <div style={bar(displayed.step === 1)} />
          <div style={bar(displayed.step === 2)} />
          <div style={bar(displayed.step === 3)} />
        </div>

        {/* 콘텐츠 래퍼 (step 1 sub-step 전환과 동일한 애니메이션) */}
        {/* overflow 를 영구 hidden 으로 두는 이유:
           하위 페이지(SelectCategory 등) 가 자체 translateY(8px) 전환을 쓰기 때문에
           auto 로 두면 내부 전환 중 한 프레임 동안 스크롤바가 번쩍임 */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          overflow: 'hidden',
        }}>
          {displayed.children}
        </div>
      </div>

      {/* 하단 푸터 */}
      <div className="ob-shell-fade" style={{
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
