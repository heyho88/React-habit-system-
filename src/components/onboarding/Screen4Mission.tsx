import { useOnboardingStore } from '../../store/useOnboardingStore'
import { missions } from '../../data/missions'

const categoryLabel: Record<string, string> = {
  health: '운동/건강',
  sleep: '수면/기상',
  routine: '루틴/생활습관',
}

const typeLabel: Record<string, string> = {
  gym: '헬스장',
  hometraining: '홈트',
  walking: '걷기/달리기',
  morning: '아침 루틴',
  evening: '저녁 루틴',
  space: '정리정돈',
  digital: '디지털 디톡스',
  mental: '멘탈관리',
  reading: '독서',
  sleep: '수면 습관',
}

export default function Screen4Mission() {
  const { category, type, level, completeMission, passMission } = useOnboardingStore()

  const missionList = missions[type ?? ''] ?? []
  const missionText = missionList[level] ?? '오늘 하루 한 걸음만 내딛기'

  return (
    <div className="screen-animate">
      {/* Header badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <span style={{
          background: 'rgba(167,139,250,0.1)',
          border: '1px solid rgba(167,139,250,0.3)',
          color: '#a78bfa',
          padding: '4px 12px',
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 600,
        }}>
          {category ? categoryLabel[category] : ''}{type && type !== category ? ` · ${typeLabel[type]}` : ''}
        </span>
        <span style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10,
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}>
          LEVEL 1
        </span>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.01em' }}>
        오늘의 첫 번째 미션
      </h1>

      {/* Mission card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: '32px 24px',
        marginBottom: 16,
        marginTop: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 100,
          background: 'rgba(167,139,250,0.15)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: 16,
        }}>
          Mission · Active
        </div>
        <p style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.4,
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          {missionText}
        </p>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 36, textAlign: 'center' }}>
        단계가 너무 작아서 실패할 수가 없어요
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={completeMission}
          style={{
            padding: '16px',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: 100,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
        >
          ✓ 완료했어요
        </button>
        <button
          onClick={passMission}
          style={{
            padding: '14px',
            background: 'transparent',
            color: 'rgba(255,255,255,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 100,
            fontWeight: 500,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          오늘은 패스
        </button>
      </div>
    </div>
  )
}
