import { useState } from 'react'
import { useAppStore, getCatData, setCatData } from '../../store/appStore'
import {
  multStr,
  isSleepMaxLevel,
  getExerciseMission,
  minsToTimeStr,
  sleepTimeToMins,
} from '../../lib/helpers'

export default function ABChoice() {
  const { setScreen, currentMissionCategory } = useAppStore()
  const cat = currentMissionCategory || ''
  const data = getCatData(cat)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  if (!data) return null

  const gc = Number(data.growth_count) || 0
  const totalCount = Number(data.total_count) || 0
  const lv = Number(data.level) || 1
  const maintainCount = Number(data.maintain_count) || 0
  const isSleep = cat === 'sleep'
  const isMaxLevel = isSleep ? isSleepMaxLevel(data) : lv >= 7

  // ── 미션 미리보기 ──
  let growPreview = ''
  let maintainPreview = ''

  if (isSleep) {
    if (isMaxLevel) {
      growPreview = `오늘도 ${data.target_bedtime}에 자보기`
    } else {
      const nextTarget = minsToTimeStr(sleepTimeToMins(String(data.current_target)) - 5)
      growPreview = `오늘은 ${nextTarget}에 자보기`
    }
    maintainPreview = `오늘도 ${data.current_target}에 자보기`
  } else {
    const type = String(data.type || '')
    growPreview = lv < 7
      ? getExerciseMission(type, lv + 1)
      : '최고 레벨! 다음 카테고리를 추가해보세요'
    maintainPreview = getExerciseMission(type, lv)
  }

  // ── 레벨 표시 ──
  let levelDisplay = ''
  if (isSleep) {
    if (isMaxLevel) {
      levelDisplay = '목표 달성 🎉'
    } else {
      const remainMins = sleepTimeToMins(String(data.current_target)) - sleepTimeToMins(String(data.target_bedtime))
      levelDisplay = `${remainMins}분 남음`
    }
  } else {
    levelDisplay = String(lv)
  }

  const showBanner = maintainCount >= 3 && !bannerDismissed

  function handleBannerGrow() {
    const updated = { ...data, maintain_count: 0 }
    setCatData(cat, updated)
    setBannerDismissed(true)
    setScreen('mission-grow')
  }

  function handleBannerStay() {
    const updated = { ...data, maintain_count: 0 }
    setCatData(cat, updated)
    setBannerDismissed(true)
  }

  const statItems = [
    { label: 'Days', value: String(totalCount) },
    { label: '복리배수', value: `${multStr(gc)}x` },
    { label: isSleep ? '진행' : '레벨', value: levelDisplay },
  ]

  return (
    <div className="screen-animate">
      {/* ── 통계 헤더 ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {statItems.map(({ label, value }) => (
          <div key={label} style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '14px 10px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── 유지 3일 배너 ── */}
      {showBanner && (
        <div style={{
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 14, padding: '14px 16px', marginBottom: 16,
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            3일 연속 유지 중이에요. 한 단계 성장해볼까요? 🌱
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleBannerGrow}
              style={{
                flex: 1, padding: '8px',
                background: '#8b5cf6', border: 'none',
                borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              성장 모드로
            </button>
            <button
              onClick={handleBannerStay}
              style={{
                flex: 1, padding: '8px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              유지할게
            </button>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
        오늘은 어떻게 할까요?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>
        성장하거나, 오늘은 지키거나
      </p>

      {/* ── A: 성장 카드 ── */}
      <div
        onClick={() => setScreen('mission-grow')}
        role="button"
        style={{
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 20, padding: '20px', marginBottom: 12, cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🌱</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>
              {isSleep && isMaxLevel
                ? '목표 취침 시간 유지 🏆'
                : isMaxLevel
                  ? '최고 레벨 달성 🏆'
                  : '한 단계 더 성장할게'}
            </span>
          </div>
          {!isMaxLevel && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#a78bfa',
              background: 'rgba(139,92,246,0.2)', padding: '3px 8px', borderRadius: 99,
            }}>
              +1%
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
          {growPreview}
        </p>
      </div>

      {/* ── B: 유지 카드 ── */}
      <div
        onClick={() => setScreen('mission-maintain')}
        role="button"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '20px', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔄</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>어제 루틴 그대로 할게</span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.07)', padding: '3px 8px', borderRadius: 99,
          }}>
            +0.5%
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>
          {maintainPreview}
        </p>
      </div>

      <button
        onClick={() => setScreen('home')}
        style={{
          width: '100%', marginTop: 20, padding: '12px',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer',
        }}
      >
        ← 홈으로
      </button>
    </div>
  )
}
