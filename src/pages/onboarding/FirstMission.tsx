import { useState, useMemo } from 'react'
import { useAppStore, getCatData, setCatData } from '../../store/appStore'
import { today, isRoutineCat, getExerciseMission, getPlantIcon, getGrowthMsg, multStr, isSleepMaxLevel } from '../../lib/helpers'
import { EMPATHY_MSGS, MISSIONS } from '../../lib/missions'

function getMissionText(cat: string, data: Record<string, unknown>): string {
  if (cat === 'sleep') {
    if (isSleepMaxLevel(data)) {
      return `오늘 ${data.target_bedtime}에 잤어요 체크하기`
    }
    return `오늘은 ${data.current_target}에 자보기`
  }
  const type = String(data.type || '')
  if (type && MISSIONS[type as keyof typeof MISSIONS]) {
    return getExerciseMission(type, Number(data.level) || 1)
  }
  return ''
}

export default function FirstMission() {
  const { setScreen, currentMissionCategory } = useAppStore()
  const cat = currentMissionCategory || ''
  const data = getCatData(cat)

  const empathy = useMemo(() => EMPATHY_MSGS[Math.floor(Math.random() * EMPATHY_MSGS.length)], [])
  const missionText = data ? getMissionText(cat, data) : ''

  const [done, setDone] = useState(false)
  const [passed, setPassed] = useState(false)
  const [growthCount, setGrowthCount] = useState(0)

  function handleComplete() {
    if (!data) return
    const t = today()
    const gc = (Number(data.growth_count) || 0) + 1
    const history = [...((data.history as { date: string; type: string }[]) || []).filter(h => h.date !== t), { date: t, type: 'growth' }]
    const updated = {
      ...data,
      growth_count: gc,
      total_count: (Number(data.total_count) || 0) + 1,
      last_date: t,
      history,
      ...(isRoutineCat(cat) ? { streak: (Number(data.streak) || 0) + 1 } : {}),
    }
    setCatData(cat, updated)
    setGrowthCount(gc)
    setDone(true)
  }

  function handlePass() {
    if (data) {
      const t = today()
      const history = [...((data.history as { date: string; type: string }[]) || []).filter(h => h.date !== t), { date: t, type: 'pass' }]
      setCatData(cat, { ...data, history })
    }
    setPassed(true)
  }

  if (!data) {
    return (
      <div className="screen-animate" style={{ textAlign: 'center', paddingTop: 60 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>카테고리 데이터를 찾을 수 없어요.</p>
        <button onClick={() => setScreen('ob-category')} style={{ marginTop: 24, padding: '12px 24px', background: '#8b5cf6', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
          처음부터 시작하기
        </button>
      </div>
    )
  }

  return (
    <div className="screen-animate">
      {/* Empathy */}
      {!done && !passed && (
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.6, marginBottom: 28, fontStyle: 'italic' }}>
          {empathy}
        </p>
      )}

      {/* Mission card */}
      {!done && !passed && (
        <>
          <div style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20,
            padding: '28px 24px',
            marginBottom: 28,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              오늘의 1%
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{missionText}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={handleComplete} style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              border: 'none', borderRadius: 14,
              color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
            }}>
              ✅ 완료했어요
            </button>
            <button onClick={handlePass} style={{
              width: '100%', padding: '14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
              color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              ⏭ 오늘은 패스
            </button>
          </div>
        </>
      )}

      {/* Done result */}
      {done && (
        <div className="screen-animate">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{getPlantIcon(growthCount)}</div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>오늘도 완료하셨어요! ✅</p>
            <p style={{
              fontSize: 15, color: '#a78bfa', fontWeight: 600, marginBottom: 4,
              fontFamily: 'monospace',
            }}>
              1.01<sup>{growthCount}</sup> = {multStr(growthCount)}배의 당신
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{getGrowthMsg(growthCount)}</p>
          </div>
          <button onClick={() => setScreen('home')} style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            border: 'none', borderRadius: 14,
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          }}>
            홈으로 →
          </button>
        </div>
      )}

      {/* Pass result */}
      {passed && (
        <div className="screen-animate" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>오늘은 쉬어가도 돼요.</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>내일 다시 켜보세요. 성장은 사라지지 않아요.</p>
          <button onClick={() => setScreen('home')} style={{
            width: '100%', padding: '16px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            ← 홈으로
          </button>
        </div>
      )}
    </div>
  )
}
