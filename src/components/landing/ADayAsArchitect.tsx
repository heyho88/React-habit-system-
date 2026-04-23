const TIMELINE = [
  { time: '07:00', tag: 'LV2', mission: '취침 5분 앞당기기', category: 'SLEEP', done: true },
  { time: '09:30', tag: 'LV1', mission: '스트레칭 2분',       category: 'BODY',  done: true },
  { time: '12:00', tag: 'LV3', mission: '책 20분 읽기',       category: 'READING', done: true },
  { time: '18:00', tag: 'LV2', mission: '명상 10분',          category: 'MENTAL', done: false },
  { time: '22:00', tag: 'LV3', mission: '저널링 5분',         category: 'ROUTINE', done: false },
]

function DashboardMock() {
  return (
    <div style={{
      background: '#080808',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14,
      padding: 24,
      boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
    }}>
      {/* top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24, paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>
            ARCHITECT DASHBOARD
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginTop: 6 }}>
            DAY 47 / 365
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#00D2D3', letterSpacing: '0.12em' }}>
            ● SYNCED
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Streak 47</div>
        </div>
      </div>

      {/* compound multiplier */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: 8 }}>
          COMPOUND MULTIPLIER
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontSize: 44, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>
            1.58x
          </span>
          <span style={{ fontSize: 13, color: '#A78BFA', fontWeight: 600 }}>+58% vs Day 1</span>
        </div>
      </div>

      {/* mini curve */}
      <div style={{ marginBottom: 22 }}>
        <svg viewBox="0 0 280 60" width="100%" height="60" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="adayFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0,58 Q 70,50 140,38 T 280,14 L 280,60 L 0,60 Z" fill="url(#adayFill)" />
          <path d="M 0,58 Q 70,50 140,38 T 280,14" fill="none" stroke="#A78BFA" strokeWidth="1.5" />
          <circle cx="280" cy="14" r="3" fill="#fb923c" />
        </svg>
      </div>

      {/* active missions row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {[
          { cat: 'BODY',  lv: 'Lv 4', state: 'GROW' },
          { cat: 'SLEEP', lv: 'Lv 5', state: 'MAINTAIN' },
          { cat: 'READ',  lv: 'Lv 3', state: 'GROW' },
        ].map(c => (
          <div key={c.cat} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '10px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}>
              {c.cat}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4 }}>
              {c.lv}
            </div>
            <div style={{
              fontSize: 8, fontFamily: 'monospace',
              color: c.state === 'GROW' ? '#A78BFA' : '#fb923c',
              letterSpacing: '0.12em', marginTop: 4, fontWeight: 700,
            }}>
              {c.state}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Timeline() {
  return (
    <div>
      <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#A78BFA', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 8 }}>
        TODAY'S DIRECTIVE FLOW
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24 }}>
        당신의 하루는 이렇게 흐릅니다.
      </div>

      <div style={{ position: 'relative' }}>
        {/* vertical line */}
        <div style={{
          position: 'absolute', left: 16, top: 8, bottom: 8,
          width: 1, background: 'rgba(139,92,246,0.25)',
        }} />

        {TIMELINE.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 16, marginBottom: i === TIMELINE.length - 1 ? 0 : 14,
            alignItems: 'center', position: 'relative',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: item.done ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${item.done ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, zIndex: 1,
            }}>
              {item.done ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
              )}
            </div>

            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                fontSize: 11, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em',
                fontWeight: 600, minWidth: 44,
              }}>
                {item.time}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, color: '#fff', fontWeight: 500,
                  textDecoration: item.done ? 'line-through' : 'none',
                  opacity: item.done ? 0.6 : 1,
                }}>
                  {item.mission}
                </div>
                <div style={{
                  fontSize: 9, fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
                  marginTop: 3,
                }}>
                  {item.category} · {item.tag}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ADayAsArchitect() {
  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ maxWidth: 780, marginBottom: 48 }}>
        <div style={{
          fontSize: 11, fontFamily: 'monospace',
          color: '#A78BFA', letterSpacing: '0.15em',
          marginBottom: 16, textTransform: 'uppercase', fontWeight: 700,
        }}>
          A DAY AS ARCHITECT
        </div>
        <h2 style={{
          margin: 0, fontSize: 40, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          Architect의 하루는<br />
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>
            이렇게 설계됩니다.
          </span>
        </h2>
        <p style={{
          marginTop: 22, fontSize: 16, lineHeight: 1.75,
          color: 'rgba(255,255,255,0.82)', maxWidth: 620,
        }}>
          의지력이 필요한 순간이 시스템에서 사라집니다.
          미션은 작고 구체적이며, 컨디션이 흔들리는 날엔 유지 모드가 streak을 지킵니다.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start',
      }}>
        <DashboardMock />
        <Timeline />
      </div>
    </section>
  )
}
