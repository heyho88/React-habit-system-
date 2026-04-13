import { useState } from 'react'
import { useAppStore } from '../store/appStore'

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

export default function LandingScreen() {
  const setScreen = useAppStore(s => s.setScreen)
  const [showMore, setShowMore] = useState(false)
  const currentCards = showMore ? page2 : page1

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
          opacity: 0.5;
          cursor: pointer;
          background: none;
          border: none;
          color: white;
          padding: 0;
          transition: opacity 0.15s;
        }
        .ls-nav-link:hover { opacity: 1; }
        .ls-cta-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 6px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .ls-cta-btn:hover {
          background: rgba(255,255,255,0.08);
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
        @media (max-width: 768px) {
          .ls-nav { display: none !important; }
          .ls-container { padding: 0 20px; }
          .ls-hero-grid { grid-template-columns: 1fr !important; }
          .ls-hero-right { display: none !important; }
          .ls-cat-list { overflow-x: auto; padding-bottom: 16px; }
        }
      `}</style>

      <div className="ls-wrap">

        {/* ── SECTION 0: Navigation ── */}
        <div className="ls-nav">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: 'rgba(20,20,30,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            padding: '8px 20px',
          }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>● SLOO</span>
            <span style={{ opacity: 0.2, margin: '0 16px' }}>│</span>
            <button className="ls-nav-link">Missions</button>
            <span style={{ opacity: 0.2, margin: '0 12px', fontSize: 13 }}>·</span>
            <button className="ls-nav-link">Compound Lab</button>
            <span style={{ opacity: 0.2, margin: '0 12px', fontSize: 13 }}>·</span>
            <button className="ls-nav-link">Archive</button>
          </div>
        </div>

        <div className="ls-container">

          {/* ── SECTION 1: Hero ── */}
          <section style={{ paddingTop: 100, paddingBottom: 60 }}>
            <div className="ls-hero-grid">

              {/* Left */}
              <div>
                {/* Badge */}
                <div style={{
                  display: 'inline-block',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  padding: '3px 10px',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 24,
                }}>
                  SYSTEM VERSION 1.0.0
                </div>

                {/* Headline */}
                <h1 style={{
                  margin: 0,
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}>
                  <div style={{ color: 'white' }}>작심삼일이</div>
                  <div>
                    <span style={{ color: 'white' }}>작심 </span>
                    <span style={{
                      background: 'linear-gradient(90deg, #B24BF3, #E040FB)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>365일이</span>
                  </div>
                  <div style={{ color: 'white' }}>되는 방법.</div>
                </h1>

                {/* Subtext */}
                <p style={{
                  marginTop: 24,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                  maxWidth: 380,
                }}>
                  매일 1%의 <b style={{ color: 'white', fontWeight: 700 }}>성장</b>은 1년 뒤{' '}
                  <b style={{ color: 'white', fontWeight: 700 }}>37.8배</b>의 결과가 됩니다.
                  의지력이 아닌 설계된 레벨 미션으로 당신의 습관을 스택하세요.
                </p>

                {/* CTA */}
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
                <div style={{
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'rgba(15,8,25,0.9)',
                  border: '1px solid rgba(178,75,243,0.5)',
                  boxShadow: '0 0 40px rgba(108,92,231,0.15), inset 0 0 40px rgba(108,92,231,0.05)',
                  padding: 28,
                  minHeight: 300,
                }}>
                  {/* Card header */}
                  <div>
                    <div style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.15em',
                    }}>MISSION: ACTIVE</div>
                    <div style={{ height: 2, background: '#ff4444', width: 60, marginTop: 6 }} />
                  </div>

                  {/* Card center */}
                  <div style={{ marginTop: 48 }}>
                    <div style={{
                      fontSize: 9,
                      fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.15em',
                    }}>COMPOUND MULTIPLIER</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 8 }}>
                      <span style={{ fontSize: 72, fontWeight: 800, color: 'white', lineHeight: 1 }}>37.8</span>
                      <span style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}>x</span>
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: '#00D2D3',
                      marginTop: 12,
                      letterSpacing: '0.1em',
                    }}>■ GROWTH CALIBRATED</div>
                  </div>

                  {/* SVG curve */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: '100%', height: 200 }}>
                      <defs>
                        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0,180 C 100,175 200,140 400,20" stroke="#8B5CF6" strokeWidth="1.5" fill="none" opacity="0.8" />
                      <path d="M 0,180 C 100,175 200,140 400,20 L 400,200 L 0,200 Z" fill="url(#curveGrad)" />
                    </svg>
                  </div>

                  {/* Efficiency */}
                  <div style={{ position: 'absolute', bottom: 24, right: 24 }}>
                    <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>EFFICIENCY</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>+1.00%</div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ── SECTION 2: Categories ── */}
          <section style={{ padding: '40px 0 80px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Header row */}
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

            {/* Category cards */}
            <div
              key={showMore ? 'more' : 'base'}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, width: '100%' }}
            >
              {currentCards.map(cat => (
                <div key={cat.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'default',
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
                      background: 'rgba(255,255,255,0.015)',
                      border: '1px dashed rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, color: 'rgba(255,255,255,0.15)',
                    }}>+</div>
                  )}
                  <span style={{
                    fontSize: cat.emoji !== null ? 11 : 9,
                    fontWeight: cat.emoji !== null ? 700 : 400,
                    letterSpacing: cat.emoji !== null ? '0.12em' : '0.1em',
                    color: cat.emoji !== null ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                    textAlign: 'center',
                  }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 3: Footer ── */}
          <footer style={{
            padding: '24px 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <div style={{
                  fontSize: 8,
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em',
                }}>GLOBAL STATUS</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  <span style={{ color: '#00D2D3' }}>ONLINE</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}> / SYNCED</span>
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 8,
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.3)',
                }}>FOUNDING USER</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                  BETA ACCESS
                </div>
              </div>
            </div>
            <div style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.2)',
            }}>BETA V.01 — COMPOUND ENGINE V.01</div>
          </footer>

        </div>
      </div>
    </>
  )
}
