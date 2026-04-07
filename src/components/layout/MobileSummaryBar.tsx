import { useEffect, useState } from 'react'
import { getAllActiveCatKeys, getCatData } from '../../store/appStore'

// ── 모바일 전용 (767px 이하) ──
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

interface Props {
  onOpen: () => void
}

export default function MobileSummaryBar({ onOpen }: Props) {
  const isMobile = useIsMobile()
  const [, setTick] = useState(0)

  // 2초마다 새로고침 (localStorage 변경 반영)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(id)
  }, [])

  if (!isMobile) return null

  const allKeys = getAllActiveCatKeys()
  const totalGc = allKeys.reduce((sum, k) => sum + (Number(getCatData(k)?.growth_count) || 0), 0)
  const totalMult = Math.pow(1.01, totalGc).toFixed(2)

  return (
    <>
      {/* ── 상단 요약 바 ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 40,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
      }}>
        <span style={{ fontWeight: 500 }}>누적 성장률</span>
        <span style={{ color: '#F97316', fontWeight: 800, letterSpacing: '-0.3px' }}>{totalMult}</span>
        <span style={{ fontWeight: 500 }}>배 🌱</span>
      </div>

      {/* ── 📊 플로팅 버튼 ── */}
      <button
        onClick={onOpen}
        aria-label="내 성장 통계 보기"
        style={{
          position: 'fixed',
          bottom: 24, right: 20,
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'rgba(249,115,22,0.15)',
          border: '1px solid rgba(249,115,22,0.35)',
          fontSize: 22,
          cursor: 'pointer',
          zIndex: 150,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)' }}
        onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
      >
        📊
      </button>
    </>
  )
}
