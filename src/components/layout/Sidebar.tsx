import { useEffect, useState } from 'react'
import { getAllActiveCatKeys, getCatData } from '../../store/appStore'
import {
  today, multStr, isSleepMaxLevel, sleepTimeToMins,
  getCatIcon, getCatName,
} from '../../lib/helpers'
import { MISSIONS } from '../../lib/missions'
import GrassCalendar from '../grass/GrassCalendar'

// ── 미디어 쿼리 훅 ──
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

// ── 잔디 맵 빌더 ──
function buildGrassMap(keys: string[]): Record<string, string> {
  const priority: Record<string, number> = { growth: 3, maintain: 2, pass: 1 }
  const map: Record<string, string> = {}
  keys.forEach(cat => {
    const d = getCatData(cat)
    if (!d || !d.history) return
    ;(d.history as { date: string; type: string }[]).forEach(h => {
      if (!map[h.date] || (priority[h.type] || 0) > (priority[map[h.date]] || 0)) {
        map[h.date] = h.type
      }
    })
  })
  return map
}

const TODAY_PANEL_MSGS = [
  '아직 시작 전이에요. 오늘 1%를 시작해보세요. 🌱',
  '오늘 1% 했어요. 충분해요. 🌱',
  '오늘 2% 했어요. 욕심쟁이네요. 😄',
  '오늘 3% 했어요. 이러다 37.78배 금방 되겠는데요. 🔥',
]

// ── 공유 콘텐츠 컴포넌트 ──
export function SidebarContent() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(id)
  }, [])

  const allKeys = getAllActiveCatKeys()
  const todayStr = today()

  const completedToday = allKeys.filter(k => getCatData(k)?.last_date === todayStr).length
  const totalGc = allKeys.reduce((sum, k) => sum + (Number(getCatData(k)?.growth_count) || 0), 0)
  const totalMult = Math.pow(1.01, totalGc).toFixed(2)
  const todayMsg = TODAY_PANEL_MSGS[Math.min(completedToday, 3)]
  const grassMap = buildGrassMap(allKeys)

  // ── 공통 스타일 헬퍼 ──
  const divider = (mt = 16, mb = 16) => (
    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: `${mt}px 0 ${mb}px` }} />
  )

  function SectLabel({ children }: { children: React.ReactNode }) {
    return (
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 10,
      }}>
        {children}
      </p>
    )
  }

  return (
    <div>
      {/* ── 오늘의 성장 패널 ── */}
      <div style={{
        background: 'rgba(249,115,22,0.06)',
        border: '1px solid rgba(249,115,22,0.18)',
        borderRadius: 16, padding: '18px 20px 16px', marginBottom: 20, textAlign: 'center',
      }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', color: 'rgba(249,115,22,0.8)', marginBottom: 10,
        }}>
          오늘의 성장
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, marginBottom: 16 }}>
          {todayMsg}
        </p>
        <p style={{
          fontSize: 40, fontWeight: 800, lineHeight: 1, letterSpacing: '-1.5px',
          background: 'linear-gradient(135deg,#F97316,#FB923C)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 4,
        }}>
          {totalMult}<span style={{ fontSize: 20, fontWeight: 700 }}>배</span>
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px' }}>누적 성장률</p>
      </div>

      {divider(0, 20)}

      {/* ── 카테고리별 섹션 ── */}
      {allKeys.map((cat, i) => {
        const data = getCatData(cat)
        if (!data) return null

        const icon     = getCatIcon(cat, String(data.type ?? ''))
        const name     = getCatName(cat, String(data.type ?? ''))
        const gc       = Number(data.growth_count) || 0
        const mult     = Math.round(Math.pow(1.01, gc) * 100) / 100
        const level    = Number(data.level) || 1
        const totalCnt = Number(data.total_count) || 0
        const maintCnt = Number(data.maintain_count) || 0
        const levelPct = Math.min((level / 7) * 100, 100)
        const isSleep  = cat === 'sleep'
        const type     = String(data.type || '')

        const history = (data.history as { date: string; type: string }[]) || []
        const lastDone = [...history].reverse().find(h => h.type !== 'pass')
        const isGrowthMode = !lastDone || lastDone.type === 'growth'

        const nextMission =
          type && MISSIONS[type as keyof typeof MISSIONS] && level < 7
            ? MISSIONS[type as keyof typeof MISSIONS][level]
            : null

        return (
          <div key={cat}>
            {i > 0 && divider(0, 24)}

            {/* 진행 중인 루틴 */}
            <SectLabel>진행 중인 루틴</SectLabel>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{icon} {name}</p>

            {divider()}

            {/* 현재 성장률 */}
            <SectLabel>현재 성장률</SectLabel>
            <p style={{
              fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: '-1.5px', marginBottom: 8,
              ...(isGrowthMode
                ? {
                    background: 'linear-gradient(135deg,#F97316,#FB923C)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }
                : { color: '#B8B0D0' }),
            }}>
              {mult.toFixed(2)}<span style={{ fontSize: 22, fontWeight: 700 }}>배</span>
            </p>
            {isGrowthMode
              ? <p style={{ fontSize: 14, fontWeight: 600, color: '#F97316', marginBottom: 4 }}>성장 중 🌱</p>
              : <p style={{ fontSize: 14, fontWeight: 500, color: '#B8B0D0', marginBottom: 4 }}>유지 중 🔄</p>
            }

            {divider()}

            {/* 레벨 진행 / 수면 진행 */}
            {isSleep && data.current_bedtime ? (
              (() => {
                const isMax = isSleepMaxLevel(data)
                if (isMax) return (
                  <>
                    <SectLabel>취침 목표</SectLabel>
                    <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>목표 달성 🎉</p>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg,#6C5CE7,#00D2D3)', borderRadius: 99 }} />
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>목표: {String(data.target_bedtime)} 유지 중</p>
                  </>
                )
                const totalDiff = Number(data.total_minutes_diff) || 1
                const curDiff = Math.max(0,
                  sleepTimeToMins(String(data.current_target)) - sleepTimeToMins(String(data.target_bedtime))
                )
                const pct = Math.round(((totalDiff - curDiff) / totalDiff) * 100)
                return (
                  <>
                    <SectLabel>취침 목표 진행</SectLabel>
                    <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>목표까지 {curDiff}분 남음</p>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6C5CE7,#00D2D3)', borderRadius: 99, transition: 'width 0.6s' }} />
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                      현재: {String(data.current_target)} → 목표: {String(data.target_bedtime)}
                    </p>
                  </>
                )
              })()
            ) : (
              <>
                <SectLabel>레벨 진행</SectLabel>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>레벨 {level} / 7</p>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${levelPct}%`, background: 'linear-gradient(90deg,#6C5CE7,#00D2D3)', borderRadius: 99, transition: 'width 0.6s' }} />
                </div>
                {nextMission && (
                  <p style={{ fontSize: 13, color: '#8B83A8', lineHeight: 1.5 }}>다음 단계: {nextMission}</p>
                )}
              </>
            )}

            {divider()}

            {/* 완료 통계 */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: 6 }}>{totalCnt}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>총 완료</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: 6 }}>{maintCnt}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>연속 유지</p>
              </div>
            </div>
          </div>
        )
      })}

      {/* ── 잔디 캘린더 ── */}
      {allKeys.length > 0 && (
        <>
          {divider(24, 16)}
          <GrassCalendar grassMap={grassMap} todayStr={todayStr} />
        </>
      )}
    </div>
  )
}

// ── 데스크탑 사이드바 ──
export default function Sidebar() {
  const isDesktop = useIsDesktop()
  if (!isDesktop) return null

  return (
    <div style={{
      position: 'fixed',
      right: 0, top: 0, bottom: 0, width: 300,
      background: 'rgba(8,11,20,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255,255,255,0.07)',
      zIndex: 100,
      overflowY: 'auto',
      padding: '64px 24px 48px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <SidebarContent />
    </div>
  )
}
