import { useState } from 'react'

const PILLARS = [
  {
    tag: 'ROOT CAUSE 01 — 강도 오버슈트',
    why: '"시작부터 너무 컸다."',
    research: 'BJ Fogg Behavior Model에 따르면 행동은 "동기 × 능력 × 트리거"의 함수입니다. 어려운 미션은 동기가 정점일 때만 실행되고, 동기는 반드시 식게 되어 있습니다.',
    fix: 'Lv1은 2분 이하로 고정. 저항 0%의 진입점을 구조적으로 보장합니다.',
  },
  {
    tag: 'ROOT CAUSE 02 — 피드백 부재',
    why: '"지속성이 느껴지지 않았다."',
    research: 'Skinner의 강화 이론은 피드백 루프가 없는 행동이 결국 소멸한다고 말합니다. 성장이 눈에 보이지 않으면, 두뇌는 그 행동의 우선순위를 지워버립니다.',
    fix: '복리 곡선·기회비용·레벨 진도를 365일 내내 실시간 렌더링합니다.',
  },
  {
    tag: 'ROOT CAUSE 03 — All-or-Nothing',
    why: '"한 번 빠지면 전부 무너졌다."',
    research: 'Streak Psychology 연구는 단 한 번의 "0일 기록"이 전체 동력을 리셋한다고 봅니다. 완벽주의 구조는 평균 3.2일에 붕괴합니다.',
    fix: '성장·유지 이중 모드로 "0일"이라는 상태 자체를 설계에서 제거합니다.',
  },
]

export default function ProofAccordion() {
  const [open, setOpen] = useState(false)

  return (
    <section style={{ padding: '60px 0 80px' }}>
      <div style={{
        maxWidth: 780, margin: '0 auto',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: '24px 28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div>
            <div style={{
              fontSize: 10, fontFamily: 'monospace',
              color: '#A78BFA', letterSpacing: '0.15em',
              marginBottom: 6, fontWeight: 700, textTransform: 'uppercase',
            }}>
              PROOF ENGINE
            </div>
            <div style={{
              fontSize: 20, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              왜 이번엔 다를까? <span style={{ color: 'rgba(255,255,255,0.5)' }}>심리학 3가지 근거.</span>
            </div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 200ms ease-in-out, border-color 200ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            borderColor: open ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.15)',
          }}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        <div style={{
          maxHeight: open ? 1800 : 0,
          overflow: 'hidden',
          transition: 'max-height 450ms ease-out',
        }}>
          <div style={{ padding: '0 28px 28px' }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

            {PILLARS.map((p, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                padding: '20px 0',
                borderBottom: i < PILLARS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                alignItems: 'start',
              }}>
                <div>
                  <div style={{
                    fontSize: 10, fontFamily: 'monospace', color: '#ff3355',
                    letterSpacing: '0.15em', marginBottom: 12,
                    fontWeight: 700, textTransform: 'uppercase',
                  }}>
                    {p.tag}
                  </div>
                  <div style={{
                    fontSize: 17, fontWeight: 700, color: '#fff',
                    letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.4,
                  }}>
                    {p.why}
                  </div>
                  <div style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.78)',
                    lineHeight: 1.7,
                  }}>
                    {p.research}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: 10, padding: '16px 18px',
                }}>
                  <div style={{
                    fontSize: 10, fontFamily: 'monospace', color: '#A78BFA',
                    letterSpacing: '0.18em', marginBottom: 10,
                    fontWeight: 700, textTransform: 'uppercase',
                  }}>
                    SLOO FIX
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: '#fff',
                    lineHeight: 1.6,
                  }}>
                    {p.fix}
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 24,
              fontSize: 9, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em',
              textAlign: 'center',
            }}>
              SOURCES — BJ FOGG · STANFORD BEHAVIOR DESIGN LAB · SKINNER REINFORCEMENT THEORY · STREAK PSYCHOLOGY RESEARCH
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
