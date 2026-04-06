import { useOnboardingStore } from '../../store/useOnboardingStore'

export default function ScreenComplete() {
  const { growthCount, totalCount, setScreen } = useOnboardingStore()
  const completed = growthCount > 0

  return (
    <div className="screen-animate" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>{completed ? '🎉' : '👋'}</div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
        {completed ? '첫 미션 완료!' : '괜찮아요, 내일 하면 돼'}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
        {completed
          ? '작은 한 걸음이 37.8배의 차이를 만들어요.\n오늘의 1%를 기록했습니다.'
          : '오늘은 어떤 습관을 시작할지 알게 됐잖아요.\n내일 다시 도전해봐요.'}
      </p>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 40,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '20px 16px',
        }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            성장 횟수
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {growthCount}
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '20px 16px',
        }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            총 도전
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff' }}>
            {totalCount}
          </div>
        </div>
      </div>

      <button
        onClick={() => setScreen('category')}
        style={{
          width: '100%',
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
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
      >
        처음부터 다시
      </button>
    </div>
  )
}
