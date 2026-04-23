import { useState } from 'react'

type Tier = {
  rate: number
  label: string
  multiplier: string
  desc: string
}

const TIERS: Tier[] = [
  { rate: 0.3, label: '0.3%', multiplier: '2.9x',    desc: '1년 뒤 2.9배. 매일 2분의 루틴. 느리지만 끊기지 않는 축적.' },
  { rate: 0.5, label: '0.5%', multiplier: '6.1x',    desc: '1년 뒤 6.1배. Top 15% Architects. 복리가 눈에 보이기 시작.' },
  { rate: 1.0, label: '1.0%', multiplier: '37.8x',   desc: '1년 뒤 37.8배. Top 3% Architects. 의지했던 모든 루틴이 자동화됩니다.' },
  { rate: 1.5, label: '1.5%', multiplier: '228x',    desc: '1년 뒤 228배. Top 1%. 당신은 시스템이 됩니다.' },
  { rate: 2.0, label: '2.0%', multiplier: '1,377x',  desc: '1년 뒤 1,377배. 이론적 상한. SLOO는 1.0%를 권장합니다.' },
]

const DEFAULT_INDEX = 2

export default function CompoundIdentitySelector() {
  const [idx, setIdx] = useState(DEFAULT_INDEX)
  const tier = TIERS[idx]

  const W = 420
  const H = 180
  const SAMPLES = 30
  const points = Array.from({ length: SAMPLES }, (_, i) => {
    const day = ((i + 1) / SAMPLES) * 365
    return Math.pow(1 + tier.rate / 100, day)
  })
  const maxVal = points[points.length - 1]
  const path = points.map((v, i) => {
    const x = (i / (SAMPLES - 1)) * W
    const y = H - (v / maxVal) * H
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')

  const areaPath = path + ` L ${W},${H} L 0,${H} Z`

  return (
    <div
      className="card-border-animated"
      style={{ width: 460, aspectRatio: '1 / 1', maxWidth: '100%' }}
    >
      <div style={{
        background: '#080808',
        borderRadius: 18.5,
        padding: '24px 28px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* top meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>
              1년 뒤 당신
            </div>
            <div style={{ height: 2, background: '#8b5cf6', width: 48, marginTop: 6 }} />
          </div>
          <div style={{
            fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.15em',
          }}>
            DAILY {tier.label}
          </div>
        </div>

        {/* hero multiplier */}
        <div style={{
          marginTop: 16, display: 'flex', alignItems: 'baseline', justifyContent: 'center',
          transition: 'opacity 200ms ease-in-out',
        }}>
          <span style={{
            fontSize: 72, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.04em', lineHeight: 1,
            background: 'linear-gradient(90deg, #ffffff 0%, #C4B5FD 60%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {tier.multiplier}
          </span>
        </div>

        {/* curve */}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
            <defs>
              <linearGradient id="cisFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#cisFill)" />
            <path d={path} fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* description — fades with tier */}
        <div
          key={idx}
          style={{
            marginTop: 14, fontSize: 13, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.82)',
            textAlign: 'center',
            animation: 'cis-fade 200ms ease-in-out',
            minHeight: 44,
          }}
        >
          {tier.desc}
        </div>

        {/* preset tabs */}
        <div style={{
          marginTop: 'auto', paddingTop: 16,
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6,
        }}>
          {TIERS.map((t, i) => {
            const active = i === idx
            return (
              <button
                key={t.rate}
                onClick={() => setIdx(i)}
                style={{
                  background: active ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 8,
                  padding: '10px 0',
                  cursor: 'pointer',
                  transition: 'background 200ms ease-in-out, border-color 200ms ease-in-out',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.05em',
                  color: active ? '#C4B5FD' : 'rgba(255,255,255,0.55)',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <style>{`
          @keyframes cis-fade {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0);   }
          }
        `}</style>
      </div>
    </div>
  )
}
