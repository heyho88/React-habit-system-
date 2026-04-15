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
  const GRAPH_W = 600
  const barW = Math.floor(GRAPH_W / BAR_COUNT) - 2
  const maxVal = Math.pow(1 + rate / 100, 365)
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const day = Math.round((i + 1) * 365 / BAR_COUNT)
    const value = Math.pow(1 + rate / 100, day)
    const h = Math.max(4, (value / maxVal) * GRAPH_H)
    return { day, value, h }
  })

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
              viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
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
              {bars.map((bar, i) => (
                <rect
                  key={i}
                  x={i * (GRAPH_W / BAR_COUNT) + 1}
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
              <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: 12 }}>
                  MISSIONS — COMING SOON
                </div>
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
