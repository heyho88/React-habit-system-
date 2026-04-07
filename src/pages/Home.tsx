import { useState, useCallback } from 'react'
import { useAppStore, getCatData, setCatData, getAllActiveCatKeys, getRoutineSlots, setRoutineSlots, getRoutineUnlocked } from '../store/appStore'
import { today, getCatIcon, getCatName, multStr, isSleepMaxLevel, isRoutineCat, sleepTimeToMins } from '../lib/helpers'
import { CAT_META, ROUTINE_TYPE_META, type RoutineType } from '../lib/missions'
import WeekView from '../components/grass/WeekView'
import GrassCalendar from '../components/grass/GrassCalendar'

// ── 잔디맵 ──
type GrassEntry = { date: string; type: string }
function buildGrassMap(keys: string[]): Record<string, string> {
  const priority: Record<string, number> = { growth: 3, maintain: 2, pass: 1 }
  const map: Record<string, string> = {}
  keys.forEach(cat => {
    const d = getCatData(cat)
    if (!d || !d.history) return
    ;(d.history as GrassEntry[]).forEach(h => {
      if (!map[h.date] || (priority[h.type] || 0) > (priority[map[h.date]] || 0)) {
        map[h.date] = h.type
      }
    })
  })
  return map
}

// ── 카테고리 미션 화면 결정 ──
function getMissionScreen(cat: string, data: Record<string, unknown>): string {
  if (cat === 'sleep' && isSleepMaxLevel(data)) return 'first-mission'
  if (cat === 'health' || cat === 'sleep' || isRoutineCat(cat)) {
    if (!data.last_date) return 'first-mission'
    if (String(data.last_date) === today()) return 'done-today'
    return 'main-choice'
  }
  return 'daily-state'
}

// ── 리셋 ──
function resetCatLocal(cat: string) {
  localStorage.removeItem('sloo_' + cat)
  if (isRoutineCat(cat)) {
    const type = cat.replace('routine_', '')
    const slots = getRoutineSlots().filter(s => s !== type)
    setRoutineSlots(slots)
    if (slots.length === 0) localStorage.removeItem('sloo_routine_unlocked')
  }
}

// ── 카드 공통 스타일 ──
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 20,
  padding: '20px',
  marginBottom: 14,
}

export default function Home() {
  const { setScreen, setCurrentMissionCategory, setCurrentOnboardingCategory, resetObState } = useAppStore()
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick(t => t + 1), [])

  // 모달
  const [resetTarget, setResetTarget] = useState<string | null | undefined>(undefined) // undefined = closed

  const todayStr = today()
  const allKeys = getAllActiveCatKeys()
  const grassMap = buildGrassMap(allKeys)

  // 카테고리 분류
  const hasHealth = !!getCatData('health')
  const hasSleep  = !!getCatData('sleep')
  const slots = getRoutineSlots()
  const hasRoutines = slots.length > 0
  const inactiveCats = [
    !hasHealth  && 'health',
    !hasSleep   && 'sleep',
    !hasRoutines && 'routine',
  ].filter(Boolean) as string[]

  function startMission(cat: string) {
    const data = getCatData(cat)
    if (!data) return
    setCurrentMissionCategory(cat)
    const screen = getMissionScreen(cat, data)
    if (screen === 'done-today') return // 이미 완료 — 버튼 비활성 처리
    setScreen(screen)
  }

  function openAdd(cat: string) {
    resetObState()
    setCurrentOnboardingCategory(cat)
    if (cat === 'health')  setScreen('ob-exercise')
    else if (cat === 'sleep') { useAppStore.setState({ obSleepCurrentH: 2, obSleepCurrentM: 0, obSleepTargetH: 0, obSleepTargetM: 0 }); setScreen('ob-sleep-current') }
    else setScreen('ob-routine')
  }

  function confirmReset() {
    if (resetTarget === null) {
      // 전체 초기화
      allKeys.forEach(k => localStorage.removeItem('sloo_' + k))
      localStorage.removeItem('sloo_routine_slots')
      localStorage.removeItem('sloo_routine_unlocked')
    } else if (resetTarget) {
      resetCatLocal(resetTarget)
    }
    setResetTarget(undefined)
    refresh()
    if (getAllActiveCatKeys().length === 0) setScreen('ob-category')
  }

  // ── 수면 진행바 ──
  function SleepProgressBar({ data }: { data: Record<string, unknown> }) {
    const isMax = isSleepMaxLevel(data)
    if (!data.current_bedtime) return null
    if (isMax) {
      return (
        <div style={{ marginTop: 10 }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: '100%', background: '#8b5cf6', borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            목표: {String(data.target_bedtime)} 유지 중
          </p>
        </div>
      )
    }
    const totalDiff = Number(data.total_minutes_diff) || 1
    const curDiff = Math.max(0, sleepTimeToMins(String(data.current_target)) - sleepTimeToMins(String(data.target_bedtime)))
    const pct = Math.round(((totalDiff - curDiff) / totalDiff) * 100)
    return (
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#8b5cf6', borderRadius: 99, transition: 'width 0.3s' }} />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          현재: {String(data.current_target)} → 목표: {String(data.target_bedtime)}
        </p>
      </div>
    )
  }

  // ── 단일 카테고리 카드 ──
  function CatCard({ cat }: { cat: string }) {
    const data = getCatData(cat)
    if (!data) return null
    const icon = getCatIcon(cat, String(data.type ?? ''))
    const name = getCatName(cat, String(data.type ?? ''))
    const gc   = Number(data.growth_count) || 0
    const lv   = Number(data.level) || 1
    const doneToday = String(data.last_date) === todayStr

    return (
      <div style={card} key={`${cat}-${tick}`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>{icon}</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{name}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                레벨 {lv} · {multStr(gc)}배
              </p>
            </div>
          </div>
          <button
            onClick={() => setResetTarget(cat)}
            title="초기화"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 18, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
          >↺</button>
        </div>
        {cat === 'sleep' && <SleepProgressBar data={data} />}
        <button
          onClick={() => !doneToday && startMission(cat)}
          disabled={doneToday}
          style={{
            width: '100%', marginTop: 14, padding: '12px',
            background: doneToday ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.15)',
            border: `1px solid ${doneToday ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.3)'}`,
            borderRadius: 12, color: doneToday ? 'rgba(255,255,255,0.3)' : '#fff',
            fontSize: 14, fontWeight: 600, cursor: doneToday ? 'default' : 'pointer', transition: 'all 0.15s',
          }}
        >
          {doneToday ? '오늘 1% 완료했어요 🌱' : '오늘 미션 하기 →'}
        </button>
      </div>
    )
  }

  // ── 루틴 그룹 카드 ──
  function RoutineGroupCard() {
    if (slots.length === 0) return null
    const unlocked = getRoutineUnlocked()
    const canAdd = slots.length < unlocked && slots.length < 7
    const maxStreak = Math.min(slots.reduce((mx, type) => {
      const d = getCatData(`routine_${type}`)
      return Math.max(mx, Number(d?.streak) || 0)
    }, 0), 7)
    const progressPct = Math.round((maxStreak / 7) * 100)
    const available = (Object.keys(ROUTINE_TYPE_META) as RoutineType[]).filter(t => !slots.includes(t))

    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 26 }}>📋</span>
          <p style={{ fontWeight: 700, fontSize: 15 }}>루틴/생활습관</p>
        </div>

        {canAdd && (
          <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>7일 연속 달성! 새로운 루틴을 추가할 수 있어요 🎉</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slots.map(type => {
            const cat = `routine_${type}`
            const data = getCatData(cat)
            if (!data) return null
            const meta = ROUTINE_TYPE_META[type as RoutineType]
            const gc = Number(data.growth_count) || 0
            const doneToday = String(data.last_date) === todayStr
            const streak = Number(data.streak) || 0

            return (
              <div key={type} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{meta.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{meta.label}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      레벨 {Number(data.level) || 1} · {multStr(gc)}배 · 🔥{streak}일
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    onClick={() => !doneToday && startMission(cat)}
                    disabled={doneToday}
                    style={{
                      padding: '6px 12px',
                      background: doneToday ? 'transparent' : 'rgba(139,92,246,0.15)',
                      border: `1px solid ${doneToday ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.3)'}`,
                      borderRadius: 8,
                      color: doneToday ? 'rgba(255,255,255,0.3)' : '#fff',
                      fontSize: 12, fontWeight: 600, cursor: doneToday ? 'default' : 'pointer',
                    }}
                  >
                    {doneToday ? '완료 🌱' : '미션 →'}
                  </button>
                  <button
                    onClick={() => setResetTarget(cat)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 16, cursor: 'pointer', padding: '0 2px' }}
                  >↺</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* 잠금 해제 프로그레스 */}
        {!canAdd && slots.length < 7 && available.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: '#8b5cf6', borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{maxStreak}/7일</span>
            </div>
            <button
              disabled
              style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, color: 'rgba(255,255,255,0.25)', fontSize: 13, fontWeight: 600, cursor: 'not-allowed' }}
            >
              🔒 루틴 추가하기 (7일 연속 완료 시 해제)
            </button>
          </div>
        )}

        {/* 추가 가능할 때 */}
        {canAdd && available.length > 0 && (
          <button
            onClick={() => { setCurrentOnboardingCategory('routine'); setScreen('ob-routine') }}
            style={{ width: '100%', marginTop: 14, padding: '10px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, color: '#a78bfa', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            + 루틴 추가하기
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="screen-animate">
      {/* 헤더 */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>나의 1% 습관</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>오늘 어떤 카테고리로 시작할까요?</p>
      </div>

      {/* 활성 카드 */}
      {hasHealth  && <CatCard cat="health" />}
      {hasSleep   && <CatCard cat="sleep" />}
      {hasRoutines && <RoutineGroupCard />}

      {/* 비활성 추가하기 */}
      {inactiveCats.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {inactiveCats.map(cat => (
            <button
              key={cat}
              onClick={() => openAdd(cat)}
              style={{
                width: '100%', padding: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 16, color: 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#a78bfa' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
            >
              + {getCatIcon(cat, null)} {CAT_META[cat as keyof typeof CAT_META].label} 추가하기
            </button>
          ))}
        </div>
      )}

      {/* 잔디 섹션 */}
      {allKeys.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20,
          padding: '20px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: 16, alignItems: 'start' }}>
            <WeekView grassMap={grassMap} todayStr={todayStr} />
            <div style={{ background: 'rgba(255,255,255,0.06)', height: '100%', minHeight: 160 }} />
            <GrassCalendar grassMap={grassMap} todayStr={todayStr} />
          </div>
        </div>
      )}

      {/* 초기화 모달 */}
      {resetTarget !== undefined && (
        <div
          onClick={() => setResetTarget(undefined)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 360 }}
          >
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>초기화할까요?</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
              {resetTarget
                ? (() => {
                    const d = getCatData(resetTarget)
                    return `${getCatIcon(resetTarget, String(d?.type ?? ''))} ${getCatName(resetTarget, String(d?.type ?? ''))} 기록이 사라져요.`
                  })()
                : '모든 기록이 사라져요.\n정말 처음부터 시작할까요?'
              }
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={() => setResetTarget(undefined)}
                style={{ padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >취소</button>
              <button
                onClick={confirmReset}
                style={{ padding: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#f87171', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >초기화</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
