import { useMemo, useState } from 'react'
import {
  useAppStore, getAllActiveCatKeys, getCatData,
} from '../store/appStore'
import { today, getCatName, multStr } from '../lib/helpers'

// ── 유틸 ──
function pad(n: number) { return String(n).padStart(2, '0') }

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function lastNDates(n: number): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(now)
    dt.setDate(now.getDate() - i)
    out.push(dateStr(dt))
  }
  return out
}

interface HistoryEntry { date: string; type: string }

function getHistory(cat: string): HistoryEntry[] {
  return (getCatData(cat)?.history as HistoryEntry[]) || []
}

// ── 스타일 ──
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

type Range = 7 | 30 | 90

// ── 페이지 ──
export default function Analytics() {
  const setMainTab = useAppStore(s => s.setMainTab)
  const [range, setRange] = useState<Range>(30)

  const keys = getAllActiveCatKeys()
  const todayStr = today()
  const dates = useMemo(() => lastNDates(range), [range])
  const prevDates = useMemo(() => {
    const out: string[] = []
    const base = new Date()
    base.setDate(base.getDate() - range)
    for (let i = range - 1; i >= 0; i--) {
      const dt = new Date(base)
      dt.setDate(base.getDate() - i)
      out.push(dateStr(dt))
    }
    return out
  }, [range])

  // 카테고리별 기록 집계
  const byCat = keys.map(k => {
    const data = getCatData(k) || {}
    const hist = getHistory(k)
    const gc = Number(data.growth_count) || 0
    const tc = Number(data.total_count) || 0
    const streak = Number(data.streak) || 0
    const maxStreak = Number(data.max_streak) || streak
    const inRange = new Set(dates)
    const inPrev = new Set(prevDates)
    let doneRange = 0, doneGrowRange = 0, donePrev = 0
    hist.forEach(h => {
      if (h.type === 'pass') return
      if (inRange.has(h.date)) {
        doneRange += 1
        if (h.type === 'grow') doneGrowRange += 1
      } else if (inPrev.has(h.date)) {
        donePrev += 1
      }
    })
    const todayDone = hist.some(h => h.date === todayStr && h.type !== 'pass')
    return {
      key: k,
      label: getCatName(k, String(data.type ?? '')),
      growthCount: gc,
      totalCount: tc,
      streak,
      maxStreak,
      doneRange,
      doneGrowRange,
      donePrev,
      todayDone,
      multiplier: Number(multStr(gc)),
    }
  })

  // 전체 합계
  const totalGc = byCat.reduce((s, x) => s + x.growthCount, 0)
  const totalMult = Math.pow(1.01, totalGc)
  const totalDoneRange = byCat.reduce((s, x) => s + x.doneRange, 0)
  const totalDonePrev = byCat.reduce((s, x) => s + x.donePrev, 0)
  const growRatio = totalDoneRange > 0
    ? Math.round((byCat.reduce((s, x) => s + x.doneGrowRange, 0) / totalDoneRange) * 100)
    : 0
  const deltaPct = totalDonePrev > 0
    ? Math.round(((totalDoneRange - totalDonePrev) / totalDonePrev) * 100)
    : (totalDoneRange > 0 ? 100 : 0)

  // 완료율 (활성 카테고리 수 × 기간 대비)
  const possible = Math.max(keys.length * range, 1)
  const completionPct = Math.round((totalDoneRange / possible) * 100)

  // 연속 기록
  const bestStreak = byCat.reduce((mx, x) => Math.max(mx, x.maxStreak), 0)
  const activeStreak = byCat.reduce((mx, x) => Math.max(mx, x.streak), 0)

  // 일자별 완료 수 (전체 합산)
  const dailyTotals = useMemo(() => {
    const map: Record<string, number> = {}
    keys.forEach(k => {
      getHistory(k).forEach(h => {
        if (h.type === 'pass') return
        map[h.date] = (map[h.date] || 0) + 1
      })
    })
    return dates.map(d => map[d] || 0)
  }, [keys.join('|'), dates.join('|')])

  const maxDaily = Math.max(...dailyTotals, 1)

  // 요일 분포
  const weekdayTotals = useMemo(() => {
    const bins = [0, 0, 0, 0, 0, 0, 0]
    dates.forEach((d, i) => {
      const dt = new Date(d)
      bins[dt.getDay()] += dailyTotals[i]
    })
    return bins
  }, [dates, dailyTotals])

  // 빈 상태
  if (keys.length === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px', color: '#fff' }}>
        <div style={{ ...sectionLabel, marginBottom: 10 }}>ANALYTICS</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>아직 분석할 데이터가 없어요</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
          미션을 시작하면 여기에 성장 지표가 쌓입니다.
        </p>
        <button
          onClick={() => setMainTab('missions')}
          style={{
            padding: '12px 22px', background: '#fff', color: '#050505',
            border: 'none', borderRadius: 40, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          미션 시작하기
        </button>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px',
      color: '#fff', fontFamily: "'Geist Sans', -apple-system, sans-serif",
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 28, gap: 24, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ ...sectionLabel, marginBottom: 10 }}>ANALYTICS</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Growth Intelligence.
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
            지금까지의 1%가 쌓여 어떤 곡선을 그리고 있는지 확인하세요.
          </p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* KPI 4개 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 20,
      }}>
        <KpiCard
          label="COMPOUND MULTIPLIER"
          value={`${totalMult.toFixed(2)}×`}
          sub={`누적 ${totalGc}회 성장`}
          accent="#a78bfa"
        />
        <KpiCard
          label="COMPLETION RATE"
          value={`${completionPct}%`}
          sub={`${range}일 · ${totalDoneRange}회 완료`}
          accent="#34d399"
        />
        <KpiCard
          label="BEST STREAK"
          value={`${bestStreak}일`}
          sub={activeStreak > 0 ? `현재 ${activeStreak}일 진행 중` : '새 기록 도전 중'}
          accent="#f472b6"
        />
        <KpiCard
          label="PERIOD DELTA"
          value={`${deltaPct >= 0 ? '+' : ''}${deltaPct}%`}
          sub={`지난 ${range}일 vs 이전 ${range}일`}
          accent={deltaPct >= 0 ? '#34d399' : '#fb7185'}
        />
      </div>

      {/* 2분할: 일자별 완료 / 요일 패턴 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: 20, marginBottom: 20,
      }}>
        <div style={cardBase}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <div style={sectionLabel}>DAILY ACTIVITY</div>
            <span style={{
              padding: '5px 10px',
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: 6,
              fontSize: 10, fontFamily: 'monospace',
              letterSpacing: '0.15em', color: '#c4b5fd',
            }}>LAST {range}D</span>
          </div>
          <LineChart values={dailyTotals} dates={dates} max={maxDaily} />
        </div>

        <div style={cardBase}>
          <div style={{ ...sectionLabel, marginBottom: 22 }}>WEEKDAY PATTERN</div>
          <WeekdayChart values={weekdayTotals} />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 14, lineHeight: 1.55 }}>
            가장 활발한 요일을 찾아 루틴을 고정하세요.
          </p>
        </div>
      </div>

      {/* 카테고리 성장 순위 */}
      <div style={{ ...cardBase, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={sectionLabel}>CATEGORY BREAKDOWN</div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
            {keys.length} ACTIVE
          </span>
        </div>
        <CategoryTable rows={byCat} range={range} />
      </div>

      {/* 인사이트 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}>
        <InsightCard
          title="Grow Ratio"
          value={`${growRatio}%`}
          body={`완료한 기록 중 ${growRatio}%가 성장 선택이었어요. 유지와 성장의 균형을 확인하세요.`}
        />
        <InsightCard
          title="Projected 1Y"
          value={`${Math.pow(1.01, Math.round(totalGc * (365 / Math.max(range, 1)))).toFixed(1)}×`}
          body="현재 페이스를 1년 이어가면 복리가 만들 곡선입니다."
        />
        <InsightCard
          title="Top Category"
          value={byCat.slice().sort((a, b) => b.growthCount - a.growthCount)[0]?.label || '—'}
          body="가장 많이 성장시킨 영역입니다. 여기에 에너지를 계속 투자해도 좋습니다."
        />
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──

function RangeSelector({ value, onChange }: { value: Range; onChange: (v: Range) => void }) {
  const options: { v: Range; label: string }[] = [
    { v: 7, label: '7D' },
    { v: 30, label: '30D' },
    { v: 90, label: '90D' },
  ]
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, padding: 4, gap: 2,
    }}>
      {options.map(o => {
        const active = o.v === value
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            style={{
              padding: '8px 14px',
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              borderRadius: 7,
              color: active ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
              letterSpacing: '0.1em', cursor: 'pointer',
            }}
          >{o.label}</button>
        )
      })}
    </div>
  )
}

function KpiCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent: string;
}) {
  return (
    <div style={{ ...cardBase, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: accent, boxShadow: `0 0 8px ${accent}`,
        }} />
        <div style={sectionLabel}>{label}</div>
      </div>
      <div style={{
        fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em',
        fontFamily: 'monospace', color: accent,
      }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

function LineChart({ values, dates, max }: { values: number[]; dates: string[]; max: number }) {
  const W = 720
  const H = 180
  const padX = 8
  const padY = 14
  const step = values.length > 1 ? (W - padX * 2) / (values.length - 1) : 0

  const points = values.map((v, i) => {
    const x = padX + i * step
    const y = H - padY - (v / max) * (H - padY * 2)
    return [x, y] as const
  })
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const areaD = `${pathD} L${padX + (values.length - 1) * step},${H - padY} L${padX},${H - padY} Z`

  const labelCount = Math.min(6, values.length)
  const labelStride = Math.max(1, Math.floor(values.length / labelCount))

  return (
    <div style={{ width: '100%' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(t => (
          <line key={t}
            x1={padX} x2={W - padX}
            y1={padY + (H - padY * 2) * t} y2={padY + (H - padY * 2) * t}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 4" />
        ))}
        <path d={areaD} fill="url(#lineFill)" />
        <path d={pathD} fill="none" stroke="url(#lineStroke)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          values[i] > 0 && i % Math.max(1, Math.floor(values.length / 20)) === 0 ? (
            <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#ec4899" />
          ) : null
        ))}
      </svg>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 6, fontSize: 10, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.35)',
      }}>
        {dates.filter((_, i) => i % labelStride === 0 || i === dates.length - 1).map(d => {
          const parts = d.split('-')
          return <span key={d}>{parts[1]}/{parts[2]}</span>
        })}
      </div>
    </div>
  )
}

function WeekdayChart({ values }: { values: number[] }) {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const order = [1, 2, 3, 4, 5, 6, 0]
  const max = Math.max(...values, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, gap: 6 }}>
      {order.map(idx => {
        const v = values[idx]
        const h = (v / max) * 110
        return (
          <div key={idx} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-end', height: '100%',
          }}>
            <div style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.45)', marginBottom: 4,
            }}>{v}</div>
            <div style={{
              width: '72%', height: Math.max(h, 2),
              background: v > 0
                ? 'linear-gradient(180deg,#a78bfa,#ec4899)'
                : 'rgba(255,255,255,0.06)',
              borderRadius: '4px 4px 0 0',
              boxShadow: v > 0 ? '0 0 12px rgba(167,139,250,0.25)' : 'none',
              transition: 'height 0.4s ease',
            }} />
            <div style={{
              fontSize: 10, fontFamily: 'monospace', marginTop: 6,
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em',
            }}>{labels[idx]}</div>
          </div>
        )
      })}
    </div>
  )
}

interface CategoryRow {
  key: string; label: string;
  growthCount: number; totalCount: number;
  streak: number; maxStreak: number;
  doneRange: number; doneGrowRange: number;
  donePrev: number; todayDone: boolean; multiplier: number;
}

function CategoryTable({ rows, range }: { rows: CategoryRow[]; range: number }) {
  const sorted = rows.slice().sort((a, b) => b.growthCount - a.growthCount)
  const maxDone = Math.max(...sorted.map(r => r.doneRange), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr) 80px 80px 80px',
        gap: 16, padding: '0 4px 10px',
        fontSize: 10, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span>CATEGORY</span>
        <span>ACTIVITY ({range}D)</span>
        <span style={{ textAlign: 'right' }}>×</span>
        <span style={{ textAlign: 'right' }}>STREAK</span>
        <span style={{ textAlign: 'right' }}>TODAY</span>
      </div>
      {sorted.map(r => (
        <div key={r.key} style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr) 80px 80px 80px',
          gap: 16, alignItems: 'center',
          padding: '14px 4px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{r.label}</div>
            <div style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.4)', marginTop: 2,
              letterSpacing: '0.08em',
            }}>
              TOTAL {r.totalCount} · GROWTH {r.growthCount}
            </div>
          </div>
          <div style={{
            height: 10, borderRadius: 6,
            background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              width: `${(r.doneRange / maxDone) * 100}%`,
              background: 'linear-gradient(90deg,#a78bfa,#ec4899)',
              boxShadow: '0 0 10px rgba(167,139,250,0.25)',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{
            textAlign: 'right', fontFamily: 'monospace',
            fontSize: 13, fontWeight: 700, color: '#a78bfa',
          }}>{r.multiplier.toFixed(2)}</div>
          <div style={{
            textAlign: 'right', fontFamily: 'monospace',
            fontSize: 13, fontWeight: 700, color: '#f472b6',
          }}>{r.streak}d</div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              display: 'inline-block',
              padding: '3px 9px', borderRadius: 6,
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.12em',
              background: r.todayDone ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)',
              border: r.todayDone ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: r.todayDone ? '#34d399' : 'rgba(255,255,255,0.4)',
            }}>{r.todayDone ? 'DONE' : 'IDLE'}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function InsightCard({ title, value, body }: { title: string; value: string; body: string }) {
  return (
    <div style={cardBase}>
      <div style={{ ...sectionLabel, marginBottom: 12 }}>{title}</div>
      <div style={{
        fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
        marginBottom: 10,
      }}>{value}</div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{body}</p>
    </div>
  )
}
