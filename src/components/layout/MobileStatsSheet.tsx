import { useRef } from 'react'
import { SidebarContent } from './Sidebar'

interface Props {
  open: boolean
  onClose: () => void
}

export default function MobileStatsSheet({ open, onClose }: Props) {
  const touchStartY = useRef(0)

  if (!open) return null

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
  }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    if (delta > 60) onClose()
  }

  return (
    <>
      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 400,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* 시트 */}
        <div
          onClick={e => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            width: '100%',
            maxHeight: '82vh',
            background: '#0F1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderBottom: 'none',
            borderRadius: '20px 20px 0 0',
            padding: '0 24px 48px',
            overflowY: 'auto',
            animation: 'slideUpSheet 0.28s ease',
          }}
        >
          {/* 핸들 */}
          <div style={{
            width: 40, height: 4,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
            margin: '12px auto 20px',
          }} />

          <SidebarContent />
        </div>
      </div>
    </>
  )
}
