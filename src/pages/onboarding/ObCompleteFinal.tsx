import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

type CategoryKey = 'exercise' | 'sleep' | 'routine';

const CATEGORY_MAP: Record<CategoryKey, { title: string; sub: string }> = {
  exercise: { title: 'Body Architecture', sub: 'Physical Foundation' },
  sleep:    { title: 'Sleep Protocol',    sub: 'Recovery System'    },
  routine:  { title: 'Daily Routine',     sub: 'Habit Foundation'   },
};

const FALLBACK = { title: 'Body Architecture', sub: 'Physical Foundation' };

const STYLES = `
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes fadeInUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

export default function ObCompleteFinal() {
  const { setScreen, category } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const catKey = (category as CategoryKey) ?? null;
  const catData = catKey && CATEGORY_MAP[catKey] ? CATEGORY_MAP[catKey] : FALLBACK;

  const summaryCards = [
    {
      label: 'FOCUS AREA',
      labelColor: '#a78bfa',
      value: catData.title,
      sub: catData.sub,
      highlight: false,
      delay: '0.2s',
    },
    {
      label: 'YEARLY PROJECTION',
      labelColor: '#22d3ee',
      value: '+3,778%',
      sub: 'Efficiency Multiplier',
      highlight: true,
      delay: '0.4s',
    },
    {
      label: 'DAILY COMMITMENT',
      labelColor: 'rgba(255,255,255,0.4)',
      value: '1% Intensity',
      sub: 'Sustainable Pace',
      highlight: false,
      delay: '0.6s',
    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: '#0a0a0a',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '0 20px',
      }}>

        {/* 배경 글로우 */}
        <div style={{
          position: 'fixed', top: '15%', right: '-5%',
          width: 400, height: 400,
          background: 'rgba(139,92,246,0.08)',
          filter: 'blur(120px)', borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed', bottom: '10%', left: '-5%',
          width: 500, height: 500,
          background: 'rgba(244,63,94,0.05)',
          filter: 'blur(150px)', borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* 상단 네비 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 32px',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}>
            ONEPERCENT
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            DEPLOYMENT FINALIZED
          </span>
        </div>

        {/* 중앙 카드 */}
        <div style={{
          width: '100%', maxWidth: 440,
          background: 'linear-gradient(160deg, rgba(30,20,50,0.95) 0%, rgba(10,8,20,0.98) 100%)',
          borderRadius: 20,
          border: '1px solid rgba(139,92,246,0.15)',
          overflow: 'hidden',
          position: 'relative', zIndex: 1,
        }}>

          {/* 카드 상단 그라디언트 선 */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #8b5cf6, #22d3ee, transparent)',
          }} />

          <div style={{ padding: '40px 32px 36px' }}>

            {/* 체크마크 */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              marginBottom: 32,
            }}>
              <div style={{
                position: 'relative',
                width: 80, height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: mounted ? 'scaleIn 0.5s ease-out forwards' : 'none',
                opacity: mounted ? 1 : 0,
              }}>
                {/* 바깥 원 */}
                <div style={{
                  position: 'absolute',
                  width: 80, height: 80, borderRadius: '50%',
                  border: '1px solid rgba(139,92,246,0.2)',
                }} />
                {/* 중간 원 */}
                <div style={{
                  position: 'absolute',
                  width: 64, height: 64, borderRadius: '50%',
                  border: '1px solid rgba(139,92,246,0.35)',
                  background: 'rgba(139,92,246,0.06)',
                }} />
                {/* 안쪽 원 — 그라디언트 배경 */}
                <div style={{
                  position: 'relative',
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139,92,246,0.5)',
                }}>
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                    <path d="M2 8L8.5 14L20 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 타이틀 */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', lineHeight: 1.3, letterSpacing: '-0.03em' }}>
                성장을 위한 모든 준비가
              </div>
              <div style={{
                fontSize: 24, fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #a78bfa, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                완료되었습니다.
              </div>
              <div style={{
                marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.6, maxWidth: 320, margin: '12px auto 0',
              }}>
                이제 당신만의 1% 성장 시스템이 가동됩니다.
                복리의 마법이 시작되는 순간을 확인하세요.
              </div>
            </div>

            {/* 요약 카드 3개 */}
            <div style={{
              display: 'flex', gap: 8, marginBottom: 28,
            }}>
              {summaryCards.map((card, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: card.highlight
                      ? 'rgba(139,92,246,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${card.highlight ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 12, padding: '14px 10px',
                    textAlign: 'center',
                    animation: mounted ? `fadeInUp 0.5s ease forwards` : 'none',
                    animationDelay: card.delay,
                    opacity: 0,
                  }}
                >
                  <div style={{
                    fontSize: 9, fontFamily: 'monospace',
                    color: card.labelColor,
                    letterSpacing: '0.08em',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontSize: card.highlight ? 18 : 14,
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}>
                    {card.value}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.3,
                  }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA 버튼 */}
            <div style={{
              animation: mounted ? 'fadeIn 0.5s ease forwards' : 'none',
              animationDelay: '0.8s',
              opacity: 0,
            }}>
              <button
                onClick={() => setScreen('home')}
                style={{
                  width: '100%',
                  padding: '15px 0',
                  background: '#ffffff',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.opacity = '0.88';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.opacity = '1';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                대시보드로 시작하기
              </button>
            </div>

          </div>
        </div>

        {/* 하단 푸터 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          textAlign: 'center', padding: '16px 0',
        }}>
          <span style={{
            fontSize: 9, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.15em',
          }}>
            SYSTEM STATUS · IDENTITY SYNC · SESSION KEY
          </span>
        </div>

      </div>
    </>
  );
}
