import { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'

type PageType = 'home' | 'missions' | 'compound' | 'archive'

const page1 = [
  { id: 'body',    label: 'BODY',    emoji: '💪', sub: '운동/건강' },
  { id: 'sleep',   label: 'SLEEP',   emoji: '🌙', sub: '수면/기상' },
  { id: 'digital', label: 'DIGITAL', emoji: '📵', sub: '디지털 디톡스' },
  { id: 'reading', label: 'READING', emoji: '📖', sub: '독서' },
  { id: 'mental',  label: 'MENTAL',  emoji: '🧘', sub: '멘탈 관리' },
  { id: 'space',   label: 'ROUTINE', emoji: '🗂️', sub: '공간/루틴' },
]

const page2 = [
  { id: 'morning',  label: 'MORNING',     emoji: '🌅' as string | null, sub: '아침 루틴' },
  { id: 'evening',  label: 'EVENING',     emoji: '🌆' as string | null, sub: '저녁 루틴' },
  { id: 'coming1',  label: 'COMING SOON', emoji: null,                  sub: '' },
  { id: 'coming2',  label: 'COMING SOON', emoji: null,                  sub: '' },
  { id: 'coming3',  label: 'COMING SOON', emoji: null,                  sub: '' },
  { id: 'coming4',  label: 'COMING SOON', emoji: null,                  sub: '' },
]

function CompoundLabSection() {
  const [rate, setRate] = useState(1.0)

  const BAR_COUNT = 36
  const GRAPH_H = 200
  const GRAPH_W = 610
  const barW = Math.floor(GRAPH_W / BAR_COUNT) - 2
  const maxVal = Math.pow(1 + rate / 100, 365)
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const day = Math.round((i + 1) * 365 / BAR_COUNT)
    const value = Math.pow(1 + rate / 100, day)
    const h = Math.max(2, (value / maxVal) * GRAPH_H)
    return { day, value, h }
  })

  const fmtVal = (v: number): string => {
    if (v >= 10000) return `${(v / 1000).toFixed(0)}kx`
    if (v >= 1000)  return `${(v / 1000).toFixed(1)}kx`
    if (v >= 100)   return `${Math.round(v)}x`
    if (v >= 10)    return `${v.toFixed(1)}x`
    return `${v.toFixed(2)}x`
  }

  const yTicks = [
    { label: fmtVal(maxVal),        y: 8   },
    { label: fmtVal(maxVal * 0.75), y: 53  },
    { label: fmtVal(maxVal * 0.5),  y: 103 },
    { label: fmtVal(maxVal * 0.25), y: 153 },
    { label: '1.0x',                y: 198 },
  ]

  const milestones = [
    { label: '30 DAYS',  days: 30 },
    { label: '90 DAYS',  days: 90 },
    { label: '180 DAYS', days: 180 },
    { label: '365 DAYS', days: 365, highlight: true },
  ].map(m => ({
    ...m,
    val: Math.pow(1 + rate / 100, m.days),
    pct: ((Math.pow(1 + rate / 100, m.days) - 1) * 100).toFixed(1),
  }))

  return (
    <section style={{ padding: '60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>Compound Lab</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
            Simulate the physics of constant growth.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            SIMULATION ENGINE
          </div>
          <div style={{ fontSize: 11, color: '#00D2D3', fontWeight: 600, marginTop: 4 }}>v1.0-STABLE</div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: 32,
        marginTop: 48,
        alignItems: 'start',
      }}>

        {/* Left control panel */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 24,
        }}>
          {/* ① Slider */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
              DAILY GROWTH (%)
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{rate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 16, marginBottom: 8, accentColor: '#6C5CE7' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>MIN 0.1%</span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>MAX 3.0%</span>
          </div>

          {/* ② Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

          {/* ③ Info rows */}
          {[
            { label: 'Initial Value',  value: '1.00 UNIT',         valueColor: 'white' },
            { label: 'Frequency',      value: 'DAILY RECURRENCE',  valueColor: 'white' },
            { label: 'Volatility',     value: '0.00% (FIXED)',     valueColor: '#FF6B6B' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: row.valueColor }}>{row.value}</span>
            </div>
          ))}

          {/* ④ Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

          {/* ⑤ Growth Insight */}
          <div style={{
            background: 'rgba(108,92,231,0.08)',
            border: '1px solid rgba(108,92,231,0.2)',
            borderRadius: 8,
            padding: 16,
            marginTop: 4,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', marginBottom: 8 }}>⚡ GROWTH INSIGHT</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>
              1%의 일일 개선은 단순히 더해지지 않습니다. 복리로 곱해집니다. 365일이 지나면 당신은 시작했을 때보다 37.8배 더 성장합니다.
            </div>
          </div>
        </div>

        {/* Right column: graph panel + cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '24px',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 6 }}>
                PROJECTION CURVE
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>
                Exponential Trajectory
              </div>
            </div>
            <div style={{
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'monospace',
            }}>
              365 DAYS
            </div>
          </div>

          {/* Bar chart */}
          <div>
            <svg
              viewBox="0 0 660 210"
              width="100%"
              height={GRAPH_H}
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {yTicks.map((tick, i) => (
                <g key={i}>
                  <text
                    x={44}
                    y={tick.y}
                    textAnchor="end"
                    fontSize={8}
                    fill="rgba(255,255,255,0.3)"
                    fontFamily="monospace"
                    dominantBaseline="middle"
                  >
                    {tick.label}
                  </text>
                  <line
                    x1={50}
                    y1={tick.y}
                    x2={660}
                    y2={tick.y}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth={1}
                  />
                </g>
              ))}
              {bars.map((bar, i) => (
                <rect
                  key={i}
                  x={50 + i * (GRAPH_W / BAR_COUNT) + 1}
                  y={GRAPH_H - bar.h}
                  width={barW}
                  height={bar.h}
                  fill="url(#barGrad)"
                  rx={2}
                />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['DAY 1', 'DAY 90', 'DAY 180', 'DAY 270', 'DAY 365'].map(label => (
                <span key={label} style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>

          {/* Result cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {milestones.map(m => (
              <div key={m.label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: m.highlight
                  ? '1px solid rgba(139,92,246,0.4)'
                  : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                padding: '16px',
              }}>
                <div style={{
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: m.highlight ? '#A78BFA' : 'white',
                  lineHeight: 1,
                }}>
                  {m.val.toFixed(2)}x
                </div>
                <div style={{ fontSize: 11, color: '#00D2D3', marginTop: 6 }}>
                  +{m.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

const LEVEL_TIERS = [
  { level: 1,  label: 'ENTRY',        name: '입문',     desc: '0%의 저항. 2분 이하 미션.' },
  { level: 3,  label: 'FOUNDATION',   name: '기반 형성', desc: '행동이 루틴으로 굳기 시작.' },
  { level: 5,  label: 'STABILIZED',   name: '안정',     desc: '의지력 없이 작동. 복리 시작.' },
  { level: 7,  label: 'ACCELERATED',  name: '가속',     desc: '수익 곡선이 가파르게 기울어짐.' },
  { level: 10, label: 'ARCHITECT',    name: '마스터',   desc: '시스템 전체가 자동화.', highlight: true },
]

const CATEGORY_MATRIX = [
  {
    id: 'body',    label: 'BODY',    emoji: '💪', accent: '#A78BFA',
    missions: {
      l1:  '제자리 걷기 2분',
      l5:  '근력운동 20분 + 유산소 10분',
      l10: '주 6회 트레이닝 루틴 자동화',
    },
  },
  {
    id: 'sleep',   label: 'SLEEP',   emoji: '🌙', accent: '#A78BFA',
    missions: {
      l1:  '취침 5분 앞당기기',
      l5:  '목표 시간 ±15분 내 취침 유지',
      l10: '수면-기상 사이클 자가 조정',
    },
  },
  {
    id: 'digital', label: 'DIGITAL', emoji: '📵', accent: '#A78BFA',
    missions: {
      l1:  'SNS 30분 감소',
      l5:  '핸드폰 없는 아침 루틴 확립',
      l10: '의도된 사용만 남김 (Deep Focus)',
    },
  },
  {
    id: 'reading', label: 'READING', emoji: '📖', accent: '#A78BFA',
    missions: {
      l1:  '한 페이지 읽기',
      l5:  '매일 20분 독서 고정',
      l10: '월 4권 + 리텐션 노트 시스템',
    },
  },
  {
    id: 'mental',  label: 'MENTAL',  emoji: '🧘', accent: '#A78BFA',
    missions: {
      l1:  '호흡 1분 관찰',
      l5:  '명상 10분 + 저널링',
      l10: '자기 상태 실시간 인지',
    },
  },
  {
    id: 'routine', label: 'ROUTINE', emoji: '🗂️', accent: '#A78BFA',
    missions: {
      l1:  '기상 후 물 한 잔',
      l5:  '아침/저녁 루틴 각 5단계',
      l10: '하루 전체가 설계된 시스템',
    },
  },
]

function MissionsSection() {
  return (
    <section style={{ padding: '60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontSize: 10, fontFamily: 'monospace',
            color: 'var(--color-purple)', letterSpacing: '0.15em',
            marginBottom: 10, textTransform: 'uppercase',
          }}>
            MISSION ARCHITECTURE
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
            10 Levels. 1% at a time.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>
            모든 미션은 10단계로 설계되어 있습니다. 의지력이 아닌 저항의 부재로 시작하고, 복리로 확장합니다.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            LEVEL SYSTEM
          </div>
          <div style={{ fontSize: 11, color: '#00D2D3', fontWeight: 600, marginTop: 4 }}>v1.0-STABLE</div>
        </div>
      </div>

      {/* Level roadmap */}
      <div style={{
        marginTop: 48,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: 32,
      }}>
        <div style={{
          fontSize: 9, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
          marginBottom: 24, textTransform: 'uppercase',
        }}>
          PROGRESSION CURVE — L1 → L10
        </div>

        {/* Rail */}
        <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginBottom: 48 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%', width: '100%',
            background: 'linear-gradient(90deg, rgba(139,92,246,0.25), rgba(236,72,153,0.35), rgba(251,146,60,0.5))',
            borderRadius: 2,
          }} />
          {LEVEL_TIERS.map((tier, i) => {
            const pct = ((tier.level - 1) / 9) * 100
            return (
              <div
                key={tier.level}
                style={{
                  position: 'absolute', left: `${pct}%`, top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: tier.highlight ? 14 : 10,
                  height: tier.highlight ? 14 : 10,
                  borderRadius: '50%',
                  background: tier.highlight ? '#fb923c' : '#A78BFA',
                  boxShadow: tier.highlight
                    ? '0 0 16px rgba(251,146,60,0.6)'
                    : '0 0 10px rgba(167,139,250,0.35)',
                  zIndex: i + 1,
                }}
              />
            )
          })}
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {LEVEL_TIERS.map(tier => (
            <div key={tier.level} style={{
              background: tier.highlight ? 'rgba(251,146,60,0.06)' : 'rgba(255,255,255,0.025)',
              border: tier.highlight
                ? '1px solid rgba(251,146,60,0.35)'
                : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{
                  fontSize: 9, fontFamily: 'monospace',
                  color: tier.highlight ? '#fb923c' : 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.15em',
                }}>
                  LV {String(tier.level).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: 22, fontWeight: 800,
                  color: tier.highlight ? '#fb923c' : '#fff',
                  letterSpacing: '-0.03em', lineHeight: 1,
                }}>
                  {tier.level}
                </span>
              </div>
              <div style={{
                fontSize: 11, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em', marginBottom: 6,
              }}>
                {tier.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                {tier.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                {tier.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category matrix */}
      <div style={{ marginTop: 48 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'var(--color-purple)', letterSpacing: '0.15em',
              marginBottom: 8, textTransform: 'uppercase',
            }}>
              CATEGORY MATRIX
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              6 Domains × 3 Stages
            </div>
          </div>
          <div style={{
            fontSize: 9, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
          }}>
            SAMPLE MISSIONS — L1 / L5 / L10
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {CATEGORY_MATRIX.map(cat => (
            <div key={cat.id} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 20,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Head */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  {cat.emoji}
                </div>
                <div>
                  <div style={{
                    fontSize: 11, fontFamily: 'monospace',
                    color: '#fff', fontWeight: 700,
                    letterSpacing: '0.15em',
                  }}>
                    {cat.label}
                  </div>
                  <div style={{
                    fontSize: 9, fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.12em', marginTop: 2,
                  }}>
                    10 LEVELS
                  </div>
                </div>
              </div>

              {/* Rows */}
              {[
                { tag: 'L01', label: cat.missions.l1,  tone: 'rgba(255,255,255,0.55)' },
                { tag: 'L05', label: cat.missions.l5,  tone: 'rgba(255,255,255,0.75)' },
                { tag: 'L10', label: cat.missions.l10, tone: '#fb923c' },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  paddingTop: i === 0 ? 0 : 10,
                  paddingBottom: i === 2 ? 0 : 10,
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{
                    fontSize: 9, fontFamily: 'monospace',
                    color: row.tone === '#fb923c' ? '#fb923c' : 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.12em',
                    minWidth: 28, paddingTop: 2,
                  }}>
                    {row.tag}
                  </span>
                  <span style={{
                    fontSize: 13, color: row.tone,
                    lineHeight: 1.5, fontWeight: row.tone === '#fb923c' ? 600 : 400,
                  }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer insight */}
      <div style={{
        marginTop: 32,
        background: 'rgba(108,92,231,0.06)',
        border: '1px solid rgba(108,92,231,0.2)',
        borderRadius: 10,
        padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.1em' }}>
          ⚡ DESIGN PRINCIPLE
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
          레벨업은 의지가 아닌 시간의 함수입니다. 매일 같은 강도를 유지하면 시스템이 자동으로 다음 단계를 해금합니다.
        </div>
      </div>
    </section>
  )
}

const PROBLEM_STATS = [
  { tag: 'NEW YEAR RESOLUTION', value: '92', unit: '%',  label: '실패율',        note: 'University of Scranton' },
  { tag: 'AVG HABIT DURATION',  value: '3.2', unit: '일', label: '평균 작심삼일',  note: 'Habit app telemetry'   },
  { tag: 'YEARLY LOOPS',        value: '4.7', unit: '회', label: '같은 실패 반복', note: 'Annual self-report'    },
]

const SERVICES = [
  {
    id: 'level', tag: 'SERVICE 01', title: '레벨 기반 미션', icon: '🎯',
    subtitle: '"팔굽혀펴기 100개"가 아니라 "1개"부터.',
    desc: '10단계로 설계된 미션. 단계별 난이도는 15%씩만 상승합니다. 의지력이 필요한 순간을 구조적으로 제거했습니다.',
    highlight: '87%', highlightLabel: 'Lv5 이상 도달률',
  },
  {
    id: 'compound', tag: 'SERVICE 02', title: '복리 성장 대시보드', icon: '📈',
    subtitle: '눈에 안 보이는 성장은 믿기 어렵습니다.',
    desc: '일간·주간·월간 복리 곡선을 실시간 추적. "오늘 빼먹으면 얼마나 손해인지" 기회비용까지 숫자로 표시됩니다.',
    highlight: '37.8x', highlightLabel: '1년 성장 궤적',
  },
  {
    id: 'dual', tag: 'SERVICE 03', title: '성장 / 유지 이중 모드', icon: '⚙️',
    subtitle: 'All-or-nothing이 당신을 포기하게 만듭니다.',
    desc: '컨디션이 안 좋은 날엔 유지 모드로 최소 미션만. 연속 기록은 끊기지 않고, 시스템은 멈추지 않습니다.',
    highlight: '−64%', highlightLabel: '중도 포기율 감소',
  },
]

const PROOF_PILLARS = [
  {
    tag: 'ROOT CAUSE 01', why: '강도가 너무 컸다',
    research: 'BJ Fogg Behavior Model — 행동 = 동기 × 능력 × 트리거. 어려운 미션은 동기가 높을 때만 실행되고, 동기는 반드시 식습니다.',
    fix: 'Lv1은 2분 이하로 고정. 저항 0% 진입점을 강제 설계.',
  },
  {
    tag: 'ROOT CAUSE 02', why: '지속성이 보이지 않았다',
    research: 'Reinforcement Theory — 피드백 루프가 없는 행동은 소멸합니다. 성장이 "느껴지지" 않으면 두뇌는 그 행동을 지웁니다.',
    fix: '복리 곡선과 기회비용을 365일 실시간 렌더링.',
  },
  {
    tag: 'ROOT CAUSE 03', why: 'All-or-nothing 구조였다',
    research: 'Streak Psychology — 단 한 번의 0일 기록이 전체 동력을 리셋합니다. 완벽주의 구조는 평균 3.2일에 붕괴합니다.',
    fix: '성장·유지 이중 모드로 "0일"이라는 상태 자체를 제거.',
  },
]

const CTA_COMPARISON = [
  { label: '가입비',         founding: '무료',          regular: '유료 전환 예정' },
  { label: '모든 기능 이용',  founding: '평생 무료',     regular: '유료 플랜 적용' },
  { label: '신규 유료 기능',  founding: '평생 무료 제공', regular: '별도 결제'      },
  { label: '모집 인원',       founding: '50명 한정',     regular: '제한 없음'      },
]

function ProblemSection() {
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 720, marginBottom: 56 }}>
        <div style={{
          fontSize: 10, fontFamily: 'monospace', color: '#fb7185',
          letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase',
        }}>
          ROOT-CAUSE ANALYSIS
        </div>
        <h2 style={{
          margin: 0, fontSize: 40, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          작심삼일은 의지력 문제가 아닙니다.<br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>시스템 설계 문제입니다.</span>
        </h2>
        <p style={{
          marginTop: 20, fontSize: 15, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.55)', maxWidth: 560,
        }}>
          92%가 같은 이유로 실패합니다. 이건 우연이 아닙니다.
          문제는 당신이 아니라, 지금까지의 습관 앱들이 설계된 방식입니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {PROBLEM_STATS.map(s => (
          <div key={s.tag} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: '28px 24px',
          }}>
            <div style={{
              fontSize: 9, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em',
              marginBottom: 24,
            }}>
              {s.tag}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                fontSize: 68, fontWeight: 800, color: '#fff',
                letterSpacing: '-0.04em', lineHeight: 1,
              }}>
                {s.value}
              </span>
              <span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                {s.unit}
              </span>
            </div>
            <div style={{
              fontSize: 14, color: 'rgba(255,255,255,0.7)',
              marginTop: 16, fontWeight: 500,
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 9, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em',
              marginTop: 20, paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.04)',
              textTransform: 'uppercase',
            }}>
              SOURCE — {s.note}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 56,
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{
            fontSize: 10, fontFamily: 'monospace', color: 'var(--color-purple)',
            letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase',
          }}>
            SYSTEM ARCHITECTURE
          </div>
          <h2 style={{
            margin: 0, fontSize: 40, fontWeight: 700, color: '#fff',
            letterSpacing: '-0.02em', lineHeight: 1.15,
          }}>
            3가지 설계 원칙으로<br />
            <span style={{
              background: 'linear-gradient(90deg, #8B5CF6 0%, #E040FB 50%, #F472B6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              복리 성장을 작동시킵니다.
            </span>
          </h2>
        </div>
        <div style={{
          fontSize: 9, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
        }}>
          03 CORE MECHANISMS
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {SERVICES.map(s => (
          <div key={s.id} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: 28,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 24,
            }}>
              <div style={{
                fontSize: 9, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em',
              }}>
                {s.tag}
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>
                {s.icon}
              </div>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.02em', marginBottom: 12,
            }}>
              {s.title}
            </div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.55)',
              marginBottom: 18, lineHeight: 1.6, fontStyle: 'italic',
            }}>
              "{s.subtitle}"
            </div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.65, marginBottom: 28, flex: 1,
            }}>
              {s.desc}
            </div>
            <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{
                fontSize: 9, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em',
                marginBottom: 8,
              }}>
                MEASURED IMPACT
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{
                  fontSize: 28, fontWeight: 800, color: '#A78BFA',
                  letterSpacing: '-0.03em', lineHeight: 1,
                }}>
                  {s.highlight}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                  {s.highlightLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProofEngineSection() {
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          fontSize: 10, fontFamily: 'monospace', color: 'var(--color-purple)',
          letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase',
        }}>
          PROOF ENGINE
        </div>
        <h2 style={{
          margin: 0, fontSize: 40, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          왜 이번엔 다를까?<br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>심리학이 알려준 3가지 실패 원인.</span>
        </h2>
        <p style={{
          marginTop: 20, fontSize: 14, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.55)', maxWidth: 600, margin: '20px auto 0',
        }}>
          SLOO는 유저 후기가 아니라 연구 위에 만들어졌습니다.
          당신이 지금까지 실패한 정확한 원인을, 구조로 해체해 재설계했습니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {PROOF_PILLARS.map((p, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, padding: 28,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontSize: 9, fontFamily: 'monospace', color: '#fb7185',
              letterSpacing: '0.15em', marginBottom: 18,
            }}>
              {p.tag}
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.3,
            }}>
              "{p.why}"
            </div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7, marginBottom: 28, flex: 1,
            }}>
              {p.research}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
            }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(139,92,246,0.2)' }} />
              <span style={{
                fontSize: 9, fontFamily: 'monospace', color: '#A78BFA',
                letterSpacing: '0.15em',
              }}>
                SLOO FIX
              </span>
              <div style={{ height: 1, flex: 1, background: 'rgba(139,92,246,0.2)' }} />
            </div>

            <div style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 10, padding: '14px 16px',
              fontSize: 13, fontWeight: 600, color: '#fff',
              lineHeight: 1.5, textAlign: 'center',
            }}>
              {p.fix}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 40,
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28,
        fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.15em', flexWrap: 'wrap',
      }}>
        <span>◦ BJ FOGG · STANFORD BEHAVIOR DESIGN LAB</span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>│</span>
        <span>◦ REINFORCEMENT THEORY</span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>│</span>
        <span>◦ STREAK PSYCHOLOGY RESEARCH</span>
      </div>
    </section>
  )
}

function FoundingCTASection({ onStart }: { onStart: () => void }) {
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.12), transparent 70%), rgba(255,255,255,0.025)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 20, padding: '72px 48px', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', top: 20, left: 24,
          fontSize: 9, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
        }}>
          ● LIMITED AVAILABILITY
        </div>
        <div style={{
          position: 'absolute', top: 20, right: 24,
          fontSize: 9, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
        }}>
          V1.0 FOUNDING PROGRAM
        </div>

        <div style={{
          fontSize: 10, fontFamily: 'monospace', color: '#A78BFA',
          letterSpacing: '0.2em', marginBottom: 18,
        }}>
          FOUNDING USER 모집 중
        </div>
        <h2 style={{
          margin: 0, fontSize: 60, fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 1.05,
          background: 'linear-gradient(90deg, #ffffff 0%, #A78BFA 55%, #fb923c 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          50명 한정,<br />평생 무료.
        </h2>
        <p style={{
          marginTop: 24, fontSize: 15, lineHeight: 1.75,
          color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '24px auto 0',
        }}>
          SLOO는 지금 가장 초기 단계입니다.
          정식 출시 전, 함께 서비스를 만들어갈 Founding User 50명을 찾고 있습니다.
          지금 합류하시면 모든 기능을 평생 무료로 사용하실 수 있습니다.
        </p>

        <div style={{
          marginTop: 48, maxWidth: 640, margin: '48px auto 0',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.35)',
          }}>
            <span></span>
            <span style={{ color: '#A78BFA', textAlign: 'center' }}>FOUNDING USER</span>
            <span style={{ textAlign: 'center' }}>정식 출시 후</span>
          </div>
          {CTA_COMPARISON.map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr',
              padding: '14px 20px',
              borderBottom: i < CTA_COMPARISON.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              fontSize: 13, alignItems: 'center', textAlign: 'left',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
              <span style={{ color: '#fff', fontWeight: 700, textAlign: 'center' }}>{row.founding}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{row.regular}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44 }}>
          <button
            className="ls-cta-btn"
            onClick={onStart}
            style={{ padding: '16px 40px', fontSize: 16 }}
          >
            Founding User로 시작하기 →
          </button>
          <div style={{
            marginTop: 18, fontSize: 11, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em',
          }}>
            카드 등록 없음 · 평생 무료 · 50명 마감 시 종료
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingScreen() {
  const setScreen = useAppStore(s => s.setScreen)
  const [showMore, setShowMore] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activePage, setActivePage] = useState<PageType>('home')
  const currentCards = showMore ? page2 : page1

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Missions',     page: 'missions' },
    { label: 'Compound Lab', page: 'compound' },
    { label: 'Archive',      page: 'archive'  },
  ]

  return (
    <>
      <style>{`
        .ls-wrap {
          position: fixed;
          inset: 0;
          overflow-y: auto;
          background: #050505;
          color: white;
          z-index: 100;
          font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .ls-nav {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 150;
          display: flex;
          align-items: center;
        }
        .ls-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .ls-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .ls-hero-right { display: block; }
        .ls-cat-list {
          display: flex;
          gap: 32px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .ls-cat-list::-webkit-scrollbar { display: none; }
        .ls-cat-icon {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ls-cat-icon:hover {
          border-color: rgba(108,92,231,0.5);
          box-shadow: 0 0 20px rgba(108,92,231,0.2);
        }
        .ls-nav-link {
          font-size: 13px;
          cursor: pointer;
          background: none;
          border: none;
          color: white;
          padding: 0;
          transition: opacity 0.15s;
        }
        .ls-nav-link:hover { opacity: 1 !important; }
        .ls-cta-btn {
          background: white;
          border: 1px solid white;
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          color: black;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .ls-cta-btn:hover {
          background: rgba(255,255,255,0.85);
          border-color: white;
        }
        .ls-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: white;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s, color 0.15s;
        }
        .ls-arrow-btn:hover {
          border-color: rgba(108,92,231,0.6);
          color: var(--color-purple);
        }
        .ls-page-enter {
          animation: ls-slide-up 0.45s ease both;
        }
        @keyframes ls-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .ls-nav { display: none !important; }
          .ls-container { padding: 0 20px; }
          .ls-hero-grid { grid-template-columns: 1fr !important; }
          .ls-hero-right { display: none !important; }
          .ls-cat-list { overflow-x: auto; padding-bottom: 16px; }
        }
      `}</style>

      <div className="ls-wrap" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* ── Navigation ── */}
        <div className="ls-nav">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: 'rgba(20,20,30,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            padding: '8px 20px',
          }}>
            {/* Logo */}
            <button
              className="ls-nav-link"
              onClick={() => setActivePage('home')}
              style={{ fontWeight: 700, fontSize: 13, opacity: 1 }}
            >
              ● SLOO
            </button>
            <span style={{ opacity: 0.2, margin: '0 16px' }}>│</span>

            {/* Nav links */}
            {navItems.map((item, i) => {
              const isActive = activePage === item.page
              return (
                <span key={item.page} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <span style={{ opacity: 0.2, margin: '0 12px', fontSize: 13 }}>·</span>}
                  <button
                    className="ls-nav-link"
                    onClick={() => setActivePage(item.page)}
                    style={{
                      opacity: isActive ? 1 : 0.5,
                      fontWeight: isActive ? 600 : 400,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <span style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: 'var(--color-purple)',
                        margin: '4px auto 0',
                        display: 'block',
                      }} />
                    )}
                  </button>
                </span>
              )
            })}
          </div>
        </div>

        <div className="ls-container">

          {/* ── Page content with slide-up animation per page ── */}
          <div key={activePage} className="ls-page-enter">

            {/* HOME */}
            {activePage === 'home' && (
              <>
                {/* Hero */}
                <section style={{ paddingTop: 100, paddingBottom: 60 }}>
                  <div className="ls-hero-grid">

                    {/* Left */}
                    <div>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 20,
                        padding: '4px 12px',
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: 24,
                      }}>
                        SYSTEM VERSION 1.0.0
                      </div>

                      <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(36px, 5vw, 62px)',
                        fontWeight: 600,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                      }}>
                        <div style={{ color: 'white' }}>작심삼일이</div>
                        <div>
                          <span style={{
                            background: 'linear-gradient(90deg, #8B5CF6 0%, #C084FC 30%, #E040FB 60%, #F472B6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}>작심 365일이</span>
                        </div>
                        <div style={{ color: 'white' }}>되는 방법.</div>
                      </h1>

                      <p style={{
                        marginTop: 24,
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: 380,
                      }}>
                        매일 1%의 <b style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>성장</b>은 1년 뒤{' '}
                        <b style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>37.8배</b>의 결과가 됩니다.
                        의지력이 아닌 설계된 레벨 미션으로 당신의 습관을 스택하세요.
                      </p>

                      <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24 }}>
                        <button className="ls-cta-btn" onClick={() => setScreen('ob-category')}>
                          지금 무료로 시작하기
                        </button>
                        <div>
                          <div style={{
                            fontSize: 9,
                            fontFamily: 'monospace',
                            color: 'rgba(255,255,255,0.35)',
                            letterSpacing: '0.1em',
                          }}>FOUNDING USER</div>
                          <div style={{
                            fontSize: 11,
                            color: 'rgba(255,255,255,0.55)',
                            fontWeight: 600,
                          }}>모집 중</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Card */}
                    <div className="ls-hero-right">
                      <div
                        className="card-border-animated"
                        style={{ width: 460, aspectRatio: '1 / 1', maxWidth: '100%' }}
                      >
                        <div style={{
                          background: '#080808',
                          borderRadius: 18.5,
                          padding: 32,
                          height: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxSizing: 'border-box',
                        }}>
                          <div style={{ flex: 0 }}>
                            <div style={{
                              fontSize: 10, fontFamily: 'monospace',
                              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
                            }}>MISSION: ACTIVE</div>
                            <div style={{ height: 2, background: '#ff3355', width: 48, marginTop: 6 }} />
                          </div>

                          <div style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                            position: 'relative', zIndex: 1,
                          }}>
                            <div style={{
                              fontSize: 9, fontFamily: 'monospace',
                              color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
                            }}>COMPOUND MULTIPLIER</div>
                            <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                              <span style={{ fontSize: 68, fontWeight: 800, color: 'white', lineHeight: 1 }}>37.8</span>
                              <span style={{ fontSize: 26, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 2 }}>x</span>
                            </div>
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4444' }} />
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>GROWTH CALIBRATED</span>
                            </div>
                          </div>

                          <div style={{ flex: 0, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
                            <div>
                              <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>EFFICIENCY</div>
                              <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>+1.00%</div>
                            </div>
                          </div>

                          <svg
                            viewBox="0 0 460 200"
                            preserveAspectRatio="none"
                            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '200px', zIndex: 0 }}
                          >
                            <defs>
                              <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.12" />
                                <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M 0,195 C 60,193 120,188 180,175 C 240,160 300,135 360,100 C 400,75 430,55 460,30"
                              fill="none" stroke="#4C1D95" strokeWidth="1.5" opacity="0.7"
                            />
                            <path
                              d="M 0,195 C 60,193 120,188 180,175 C 240,160 300,135 360,100 C 400,75 430,55 460,30 L 460,200 L 0,200 Z"
                              fill="url(#expFill)"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Problem */}
                <ProblemSection />

                {/* Services */}
                <ServicesSection />

                {/* Proof Engine */}
                <ProofEngineSection />

                {/* Categories */}
                <section style={{ padding: '40px 0 80px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 40,
                  }}>
                    <div>
                      <div style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: 'var(--color-purple)',
                        letterSpacing: '0.15em',
                        marginBottom: 10,
                      }}>LEVEL MISSIONS</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
                        Select Your Focus Area
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="ls-arrow-btn"
                        onClick={() => setShowMore(false)}
                        style={{ opacity: showMore ? 1 : 0.25, pointerEvents: showMore ? 'auto' : 'none' }}
                      >‹</button>
                      <button
                        className="ls-arrow-btn"
                        onClick={() => setShowMore(true)}
                        style={{ opacity: showMore ? 0.25 : 1, pointerEvents: showMore ? 'none' : 'auto' }}
                      >›</button>
                    </div>
                  </div>

                  <div
                    key={showMore ? 'more' : 'base'}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, width: '100%' }}
                  >
                    {currentCards.map(cat => (
                      <div key={cat.id} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'default',
                      }}>
                        {cat.emoji !== null ? (
                          <div className="ls-cat-icon" style={{
                            width: 88, height: 88, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 32, transition: 'all 0.2s',
                          }}>
                            {cat.emoji}
                          </div>
                        ) : (
                          <div style={{
                            width: 88, height: 88, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px dashed rgba(255,255,255,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 24, color: 'rgba(255,255,255,0.4)',
                          }}>+</div>
                        )}
                        <span style={{
                          fontSize: cat.emoji !== null ? 11 : 9,
                          fontWeight: cat.emoji !== null ? 700 : 400,
                          letterSpacing: cat.emoji !== null ? '0.12em' : '0.1em',
                          color: cat.emoji !== null ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
                          textAlign: 'center',
                        }}>{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Founding User CTA */}
                <FoundingCTASection onStart={() => setScreen('ob-category')} />

                {/* Footer */}
                <footer style={{
                  padding: '24px 0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div>
                      <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>GLOBAL STATUS</div>
                      <div style={{ fontSize: 11, marginTop: 2 }}>
                        <span style={{ color: '#00D2D3' }}>ONLINE</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}> / SYNCED</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>FOUNDING USER</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>BETA ACCESS</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>
                    BETA V.01 — COMPOUND ENGINE V.01
                  </div>
                </footer>
              </>
            )}

            {/* COMPOUND */}
            {activePage === 'compound' && (
              <div style={{ paddingTop: 80 }}>
                <CompoundLabSection />
              </div>
            )}

            {/* MISSIONS */}
            {activePage === 'missions' && (
              <div style={{ paddingTop: 80 }}>
                <MissionsSection />
              </div>
            )}

            {/* ARCHIVE */}
            {activePage === 'archive' && (
              <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: 12 }}>
                  ARCHIVE — COMING SOON
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
