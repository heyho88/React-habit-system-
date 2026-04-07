import { useAppStore, setCatData } from '../../store/appStore'
import { sleepTimeToMins, minsToTimeStr, formatTimeKorean } from '../../lib/helpers'

function ProgressBar() {
  return (
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>3 / 3</span>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8 }}>
        <div style={{ height: '100%', width: '100%', background: '#8b5cf6', borderRadius: 99 }} />
      </div>
    </div>
  )
}

export default function SleepConfirm() {
  const { setScreen, setCurrentMissionCategory, obSleepCurrentH, obSleepCurrentM, obSleepTargetH, obSleepTargetM } = useAppStore()

  const curStr = `${String(obSleepCurrentH).padStart(2, '0')}:${String(obSleepCurrentM).padStart(2, '0')}`
  const tgtStr = `${String(obSleepTargetH).padStart(2, '0')}:${String(obSleepTargetM).padStart(2, '0')}`
  const diffMins = Math.max(0, sleepTimeToMins(curStr) - sleepTimeToMins(tgtStr))
  const alreadyDone = diffMins <= 0

  function handleConfirm() {
    const obj = {
      active: true,
      type: 'sleep',
      level: 1,
      growth_count: alreadyDone ? 1 : 0,
      total_count: 0,
      maintain_count: 0,
      last_date: null,
      history: [],
      fail_reason: 0,
      max_reached: false,
      current_bedtime: curStr,
      target_bedtime: tgtStr,
      current_target: alreadyDone ? tgtStr : curStr,
      total_minutes_diff: alreadyDone ? 0 : diffMins,
    }
    setCatData('sleep', obj)
    setCurrentMissionCategory('sleep')
    setScreen('ob-loading')
  }

  return (
    <div className="screen-animate">
      <ProgressBar />
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
        이렇게 시작해볼까요?
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
        언제든지 바꿀 수 있어요
      </p>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '28px 24px',
        marginBottom: 32,
      }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>현재 취침 시간</p>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{formatTimeKorean(curStr)}</p>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>목표 취침 시간</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa' }}>{formatTimeKorean(tgtStr)}</p>
        </div>
        {!alreadyDone && (
          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              매일 조금씩 앞당겨서{' '}
              <span style={{ color: '#a78bfa', fontWeight: 700 }}>
                {minsToTimeStr(sleepTimeToMins(curStr) - 5)}
              </span>
              부터 시작해요
            </p>
          </div>
        )}
        {alreadyDone && (
          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(139,92,246,0.1)', borderRadius: 12 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              이미 목표 시간에 자고 있네요! 유지하면서 시작해요 🎉
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleConfirm}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          border: 'none',
          borderRadius: 14,
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        시작하기 →
      </button>
    </div>
  )
}
