import { useState, useMemo } from 'react'
import { useAppStore, getCatData, setCatData } from '../../store/appStore'
import {
  today, multStr,
  isSleepMaxLevel, getExerciseMission,
  minsToTimeStr, sleepTimeToMins,
  isRoutineCat, getPlantIcon, getGrowthMsg,
} from '../../lib/helpers'
import { EMPATHY_MSGS, MAINTAIN_MSGS } from '../../lib/missions'
import GrowthAnimation from '../../components/GrowthAnimation'

interface MissionScreenProps {
  choice: 'grow' | 'maintain'
}

interface CompletionResult {
  oldGc: number
  gc: number
  oldLevel: number
  level: number
  total: number
  maintainCount: number
}

// ── 수면 미션 텍스트 ──
function getSleepMissionText(data: Record<string, unknown>, choice: 'grow' | 'maintain'): string {
  if (isSleepMaxLevel(data)) return `오늘 ${data.target_bedtime}에 잤어요 체크하기`
  const prefix = choice === 'maintain' ? '오늘도' : '오늘은'
  const target = choice === 'grow'
    ? minsToTimeStr(sleepTimeToMins(String(data.current_target)) - 5)
    : String(data.current_target)
  return `${prefix} ${target}에 자보기`
}

// ── 다음 미션 미리보기 ──
function getNextPreview(data: Record<string, unknown>, cat: string): string | null {
  if (cat === 'sleep') {
    if (isSleepMaxLevel(data)) return '목표 취침 시간을 매일 지켜봐요 🎉'
    return `다음 목표: ${data.current_target}에 자보기`
  }
  const type = String(data.type || '')
  if (!type) return null
  const lv = Number(data.level) || 1
  if (lv >= 7) return '이 루틴은 완전히 잡혔어요. 새로운 도전을 추가해볼까요? 🔥'
  return getExerciseMission(type, lv + 1)
}

export default function MissionScreen({ choice }: MissionScreenProps) {
  const { setScreen, currentMissionCategory } = useAppStore()
  const cat = currentMissionCategory || ''
  // Capture data at first render — snapshot before any update
  const [initialData] = useState(() => getCatData(cat))

  const [phase, setPhase] = useState<'idle' | 'animating' | 'done' | 'passed'>('idle')
  const [result, setResult] = useState<CompletionResult | null>(null)

  const empathy = useMemo(() => EMPATHY_MSGS[Math.floor(Math.random() * EMPATHY_MSGS.length)], [])

  if (!initialData) return null

  const data = initialData
  const isSleep = cat === 'sleep'
  const isRoutine = isRoutineCat(cat)
  const lv = Number(data.level) || 1
  const gc = Number(data.growth_count) || 0
  const showBackBtn = String(data.last_date) === today()

  // ── 미션 텍스트 ──
  let missionText = ''
  if (isSleep) {
    missionText = getSleepMissionText(data, choice)
  } else if (choice === 'grow') {
    missionText = lv < 7
      ? getExerciseMission(String(data.type || ''), lv + 1)
      : getExerciseMission(String(data.type || ''), 7)
  } else {
    missionText = getExerciseMission(String(data.type || ''), lv)
  }

  // ── 공감 텍스트 ──
  let empathyText = empathy
  if (isSleep) {
    empathyText = isSleepMaxLevel(data)
      ? '목표를 달성했어요. 유지만 하면 돼요 🎉'
      : '취침 시간을 조금씩 앞당겨봐요.'
  }

  // ── 완료 처리 ──
  function handleComplete() {
    const t = today()
    const oldGc = Number(data.growth_count) || 0
    const oldLevel = Number(data.level) || 1
    let newGc = oldGc
    let newLevel = oldLevel
    let newMaintainCount = Number(data.maintain_count) || 0
    let histType = 'growth'

    const updated: Record<string, unknown> = { ...data }
    updated.total_count = (Number(data.total_count) || 0) + 1
    updated.last_date = t

    if (isSleep) {
      if (choice === 'grow' && !isSleepMaxLevel(data)) {
        updated.current_target = minsToTimeStr(sleepTimeToMins(String(data.current_target)) - 5)
        newGc = oldGc + 1
        newMaintainCount = 0
        histType = 'growth'
      } else {
        newGc = oldGc + 0.5
        newMaintainCount = (Number(data.maintain_count) || 0) + 1
        histType = 'maintain'
      }
    } else if (choice === 'grow') {
      if (newLevel < 7) newLevel++
      newGc = oldGc + 1
      newMaintainCount = 0
      histType = 'growth'
    } else {
      newGc = oldGc + 0.5
      newMaintainCount = (Number(data.maintain_count) || 0) + 1
      histType = 'maintain'
    }

    updated.growth_count = newGc
    updated.level = newLevel
    updated.maintain_count = newMaintainCount

    if (isRoutine) {
      updated.streak = (Number(data.streak) || 0) + 1
    }

    const prevHistory = (data.history as { date: string; type: string }[]) || []
    updated.history = [...prevHistory.filter(h => h.date !== t), { date: t, type: histType }]

    setCatData(cat, updated)

    setResult({ oldGc, gc: newGc, oldLevel, level: newLevel, total: Number(updated.total_count), maintainCount: newMaintainCount })
    setPhase('animating')
  }

  // ── 패스 처리 ──
  function handlePass() {
    const t = today()
    const updated: Record<string, unknown> = { ...data, maintain_count: 0 }
    if (isRoutine) updated.streak = 0
    const prevHistory = (data.history as { date: string; type: string }[]) || []
    updated.history = [...prevHistory.filter(h => h.date !== t), { date: t, type: 'pass' }]
    setCatData(cat, updated)
    setPhase('passed')
  }

  // ── 완료 후 결과 계산 ──
  const updatedData = result ? (getCatData(cat) ?? data) : data
  const nextPreview = result ? getNextPreview(updatedData, cat) : null
  const showMaxLevel = result &&
    ((!isSleep && result.level >= 7) || (isSleep && isSleepMaxLevel(updatedData)))

  const animMsg = choice === 'grow' ? '한 단계 성장했어요! 🌱' : '오늘도 지켰어요! 🔄'

  return (
    <div className="screen-animate">
      {/* ── 성장 애니메이션 오버레이 ── */}
      {phase === 'animating' && result && (
        <GrowthAnimation
          oldGc={result.oldGc}
          newGc={result.gc}
          message={animMsg}
          onDone={() => setPhase('done')}
        />
      )}

      {/* ── 대기 상태 ── */}
      {phase === 'idle' && (
        <>
          {/* 배지 */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 99, marginBottom: 20,
            background: choice === 'grow' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${choice === 'grow' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}>
            <span style={{ fontSize: 14 }}>{choice === 'grow' ? '🌱' : '🔄'}</span>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: choice === 'grow' ? '#a78bfa' : 'rgba(255,255,255,0.55)',
            }}>
              {choice === 'grow' ? '성장 모드' : '유지 모드'}
            </span>
          </div>

          {/* 공감 */}
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6,
            marginBottom: 20, fontStyle: 'italic',
          }}>
            {empathyText}
          </p>

          {/* 미션 카드 */}
          <div style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20, padding: '28px 24px', marginBottom: 28,
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: '#a78bfa',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              오늘의 1%
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{missionText}</p>
          </div>

          {/* 버튼들 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            {showBackBtn && (
              <button onClick={() => setScreen('main-choice')} style={{
                width: '100%', padding: '12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
                color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer',
              }}>
                ← 다시 선택
              </button>
            )}
          </div>
        </>
      )}

      {/* ── 완료 상태 ── */}
      {phase === 'done' && result && (
        <div className="screen-animate">
          {/* 결과 문구 */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              {choice === 'grow' ? '한 단계 성장했어요! 🌱' : '오늘도 지켰어요! 🔄'}
            </p>
            {choice === 'grow' ? (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                {result.total}회째 · {multStr(result.gc)}배의 당신
                {!isSleep && result.level > result.oldLevel ? ` · 레벨 ${result.level} 달성! 🎉` : ''}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                {MAINTAIN_MSGS[Math.min(result.maintainCount, 3)] ?? MAINTAIN_MSGS[3]}
              </p>
            )}
          </div>

          {/* 성장 카드 */}
          <div style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20, padding: '24px', marginBottom: 20,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{getPlantIcon(result.gc)}</div>
            <p style={{
              fontSize: 15, fontWeight: 700, color: '#a78bfa',
              fontFamily: 'monospace', marginBottom: 4,
            }}>
              1.01<sup>{result.gc}</sup> = {multStr(result.gc)}배의 당신입니다
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              {getGrowthMsg(result.gc)}
            </p>

            {nextPreview && (
              <div style={{
                marginTop: 16, padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)', borderRadius: 12, textAlign: 'left',
              }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>내일의 1% 👀</p>
                <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{nextPreview}</p>
              </div>
            )}
          </div>

          {/* 최고 레벨 달성: 다음 카테고리 추가 */}
          {showMaxLevel && (
            <button onClick={() => setScreen('home')} style={{
              width: '100%', marginBottom: 10, padding: '14px',
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 14, color: '#a78bfa', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              + 다음 카테고리 추가하기
            </button>
          )}

          <button onClick={() => setScreen('home')} style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            border: 'none', borderRadius: 14,
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            홈으로 →
          </button>
        </div>
      )}

      {/* ── 패스 상태 ── */}
      {phase === 'passed' && (
        <div className="screen-animate" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>오늘은 쉬어가도 돼요.</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>
            내일 다시 켜보세요. 성장은 사라지지 않아요.
          </p>
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
