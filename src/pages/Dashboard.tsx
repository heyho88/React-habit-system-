import { useEffect, useState } from 'react'
import {
  useAppStore, getAllActiveCatKeys, getCatData, getProfile,
} from '../store/appStore'
import { today, getCatName } from '../lib/helpers'

// ── 유틸 ──
function pad(n: number) { return String(n).padStart(2, '0') }

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function lastNDates(n: number): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d)
    dt.setDate(d.getDate() - i)
    out.push(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`)
  }
  return out
}

interface HistoryEntry { date: string; type: string }

function getPrimaryCat(keys: string[]): string | null {
  if (keys.length === 0) return null
  // growth_count 가장 높은 카테고리
  let best = keys[0]
  let bestGc = Number(getCatData(best)?.growth_count) || 0
  for (const k of keys.slice(1)) {
    const gc = Number(getCatData(k)?.growth_count) || 0
    if (gc > bestGc) { best = k; bestGc = gc }
  }
  return best
}

// ── 공통 카드 스타일 ──
const cardBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 20,
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: 'monospace',
  color: 'rgba(255,255,255,0.45)',
  letterSpacing: '0.15em', textTransform: 'uppercase',
}

export default function Dashboard() {
  const setScreen = useAppStore(s => s.setScreen)
  const setCurrentMissionCategory = useAppStore(s => s.setCurrentMissionCategory)
  const clock = useClock()
  const profile = getProfile()
  const name = profile.displayName || 'Architect'

  const keys = getAllActiveCatKeys()
  const todayStr = today()
  const weekDates = lastNDates(7)

  // 전체 합계
  const totalGc = keys.reduce((s, k) => s + (Number(getCatData(k)?.growth_count) || 0), 0)
  const totalMult = Math.pow(1.01, totalGc)
  const syncDelta = ((totalMult - 1) * 100) // 퍼센트 증가분

  // 오늘 완료 여부
  const doneToday = keys.filter(k => getCatData(k)?.last_date === todayStr).length

  // Primary mission
  const primaryCat = getPrimaryCat(keys)
  const primaryData = primaryCat ? getCatData(primaryCat) : null
  const primaryTotal = Number(primaryData?.total_count) || 0
  const primaryDay = Math.min(primaryTotal, 100)
  const primaryPct = Math.round((primaryDay / 100) * 100)
  const primaryName = primaryCat
    ? getCatName(primaryCat, String(primaryData?.type ?? ''))
    : '미션 없음'

  // Momentum: 최대 streak
  const maxStreak = keys.reduce((mx, k) => Math.max(mx, Number(getCatData(k)?.streak) || 0), 0)

  // 주간 히트맵: 각 날짜에 완료한 카테고리 수
  const weekHistory: Record<string, number> = {}
  keys.forEach(k => {
    const hist = (getCatData(k)?.history as HistoryEntry[]) || []
    hist.forEach(h => {
      if (h.type !== 'pass') weekHistory[h.date] = (weekHistory[h.date] || 0) + 1
    })
  })

  // 주간 바차트 데이터 — 날짜별 완료 수
  const weekBars = weekDates.map(d => weekHistory[d] || 0)
  const maxBar = Math.max(...weekBars, 1)

  function startMissionForPrimary() {
    if (!primaryCat) { setScreen('ob-category'); return }
    setCurrentMissionCategory(primaryCat)
    const data = getCatData(primaryCat)
    if (!data?.last_date || String(data.last_date) !== todayStr) {
      setScreen(data?.last_date ? 'main-choice' : 'first-mission')
    }
  }

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px',
      color: '#fff', fontFamily: "'Geist Sans', -apple-system, sans-serif",
    }}>
      {/* 상단 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 32, gap: 24, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ ...sectionLabel, marginBottom: 10 }}>SYSTEM OVERVIEW</div>
          <h1 style={{
            fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            Welcome back, {name}.
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ ...sectionLabel, marginBottom: 8 }}>CURRENT SYNC RATE</div>
            <div style={{
              fontSize: 22, fontWeight: 700, color: '#34d399',
              fontFamily: 'monospace', letterSpacing: '-0.01em',
            }}>
              +{syncDelta.toFixed(2)}%
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ ...sectionLabel, marginBottom: 8 }}>SYSTEM TIME</div>
            <div style={{
              fontSize: 22, fontWeight: 700, color: '#fff',
              fontFamily: 'monospace', letterSpacing: '-0.01em',
            }}>
              {clock}
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: 20,
      }}>
        {/* ① ACTIVE MISSION */}
        <div style={{ ...cardBase, minHeight: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{
              padding: '5px 10px',
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 6,
              fontSize: 10, fontFamily: 'monospace',
              letterSpacing: '0.15em', color: '#c4b5fd',
            }}>ACTIVE MISSION</span>
            <span style={{ ...sectionLabel }}>DAY {primaryDay} / 100</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontSize: 28, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em',
              }}>
                {primaryName}
              </h2>
              <p style={{
                fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
                marginBottom: 28,
              }}>
                매일 조금씩. 오늘의 1%가 1년이면 37.78배가 됩니다. 지금까지 누적 {primaryTotal}회 완료했습니다.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={startMissionForPrimary}
                  style={{
                    padding: '12px 22px',
                    background: '#fff', color: '#050505',
                    border: 'none', borderRadius: 40,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><polygon points="0,0 12,7 0,14" /></svg>
                  Log Activity
                </button>
                <button
                  onClick={() => useAppStore.getState().setMainTab('missions')}
                  style={{
                    padding: '12px 22px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 40, color: '#fff',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  View Details
                </button>
              </div>
            </div>

            {/* 원형 진행률 */}
            <ProgressRing pct={primaryPct} />
          </div>
        </div>

        {/* ② 1% MOMENTUM */}
        <div style={{ ...cardBase }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div style={sectionLabel}>1% MOMENTUM</div>
            <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
              <path d="M13 3 C 9 8, 5 11, 5 18 C 5 24, 9 28, 13 28 C 17 28, 21 24, 21 18 C 21 13, 17 11, 17 7 C 15 9, 14 10, 13 3 Z"
                stroke="#ec4899" strokeWidth="1.5" fill="rgba(236,72,153,0.08)" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg,#f472b6,#fb923c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{maxStreak}</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Days</span>
          </div>

          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, marginBottom: 20,
          }}>
            You are in the top 12% of consistent architects this week.
          </p>

          {/* 요일 히트맵 */}
          <WeekHeatmap dates={weekDates} history={weekHistory} />
        </div>

        {/* ③ WEEKLY EFFICIENCY GAIN */}
        <div style={{ ...cardBase, minHeight: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <div style={sectionLabel}>WEEKLY EFFICIENCY GAIN</div>
            <span style={{
              padding: '5px 10px',
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: 6,
              fontSize: 10, fontFamily: 'monospace',
              letterSpacing: '0.15em', color: '#34d399',
            }}>TRENDING UP</span>
          </div>

          <BarChart bars={weekBars} max={maxBar} dates={weekDates} />
        </div>

        {/* ④ QUICK DIRECTIVES */}
        <div style={{ ...cardBase }}>
          <div style={{ ...sectionLabel, marginBottom: 18 }}>QUICK DIRECTIVES</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DirectiveRow
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              }
              title="Adjust Metrics"
              sub="Recalibrate baseline stats"
              onClick={() => useAppStore.getState().setMainTab('analytics')}
            />
            <DirectiveRow
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              title="Daily Review"
              sub={doneToday > 0 ? `${doneToday}개 완료 · 기록 보기` : '오늘 미션 체크인'}
              onClick={startMissionForPrimary}
            />
            <DirectiveRow
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
              title="System Report"
              sub="주간 효율성 확인"
              onClick={() => useAppStore.getState().setMainTab('analytics')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──

function ProgressRing({ pct }: { pct: number }) {
  const size = 120
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
    }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r}
          stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ring)" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
      }}>
        {pct}<span style={{ fontSize: 12, marginLeft: 2 }}>%</span>
      </div>
    </div>
  )
}

function WeekHeatmap({ dates, history }: { dates: string[]; history: Record<string, number> }) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
        marginBottom: 6,
      }}>
        {labels.map((l, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: 10,
            color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace',
          }}>{l}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {dates.map(d => {
          const v = history[d] || 0
          const active = v > 0
          return (
            <div key={d} style={{
              aspectRatio: '1',
              borderRadius: 6,
              background: active
                ? 'linear-gradient(135deg,#fb923c,#ec4899)'
                : 'rgba(255,255,255,0.04)',
              opacity: active ? Math.min(0.55 + v * 0.15, 1) : 1,
              border: active ? 'none' : '1px solid rgba(255,255,255,0.05)',
            }} />
          )
        })}
      </div>
    </div>
  )
}

function BarChart({ bars, max, dates }: { bars: number[]; max: number; dates: string[] }) {
  const H = 140
  const labels = dates.map(d => {
    const parts = d.split('-')
    return `${parts[1]}/${parts[2]}`
  })
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        height: H, gap: 6, paddingLeft: 28, position: 'relative',
      }}>
        {/* Y축 라벨 */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 24,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)',
        }}>
          <span>{max}</span>
          <span>{Math.round(max / 2)}</span>
          <span>0</span>
        </div>

        {bars.map((v, i) => {
          const h = max > 0 ? (v / max) * H : 0
          return (
            <div key={i} style={{
              flex: 1, height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            }}>
              <div style={{
                width: '70%', height: h,
                background: v > 0
                  ? 'linear-gradient(180deg,#a78bfa 0%,#ec4899 100%)'
                  : 'rgba(255,255,255,0.06)',
                borderRadius: '4px 4px 0 0',
                boxShadow: v > 0 ? '0 0 14px rgba(167,139,250,0.25)' : 'none',
                transition: 'height 0.5s ease',
                minHeight: v > 0 ? 4 : 2,
              }} />
            </div>
          )
        })}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        paddingLeft: 28, marginTop: 8,
      }}>
        {labels.map((l, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)',
          }}>{l}</div>
        ))}
      </div>
    </div>
  )
}

function DirectiveRow({ icon, title, sub, onClick }: {
  icon: React.ReactNode; title: string; sub: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        color: '#fff',
        cursor: 'pointer', width: '100%',
        textAlign: 'left',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.7)', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700 }}>{title}</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{sub}</p>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>›</span>
    </button>
  )
}
