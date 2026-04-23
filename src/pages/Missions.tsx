import { useEffect, useMemo, useState } from 'react'
import {
  useAppStore, getAllActiveCatKeys, getCatData,
  getRoutineSlots, getRoutineUnlocked,
} from '../store/appStore'
import {
  today, multStr, isRoutineCat, getRoutineType, getCatIcon, getCatName,
  getExerciseMission, isSleepMaxLevel, sleepTimeToMins,
} from '../lib/helpers'
import { MISSIONS, CAT_META, type RoutineType } from '../lib/missions'

// ── 유틸 ──
function pad(n: number) { return String(n).padStart(2, '0') }

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

// ── 프로토콜 메타 ──
// 카테고리별로 대시보드와 동일한 사이버틱한 프로토콜 네이밍
interface ProtocolMeta {
  title: string
  sub: string
  accent: string  // 카드 내부 포인트 컬러 (배지, 링 등)
}

function getProtocolMeta(cat: string, type: string): ProtocolMeta {
  if (cat === 'health') {
    if (type === 'gym')          return { title: 'Gym Protocol',          sub: 'Strength Architecture', accent: '#8b5cf6' }
    if (type === 'hometraining') return { title: 'Home Training Protocol', sub: 'Body Architecture',     accent: '#8b5cf6' }
    if (type === 'walking')      return { title: 'Cardio Protocol',        sub: 'Endurance System',      accent: '#8b5cf6' }
    return { title: 'Body Architecture', sub: 'Physical Foundation', accent: '#8b5cf6' }
  }
  if (cat === 'sleep') return { title: 'Sleep Protocol', sub: 'Recovery System', accent: '#22d3ee' }
  if (isRoutineCat(cat)) {
    const t = getRoutineType(cat) as RoutineType
    const meta: Record<RoutineType, ProtocolMeta> = {
      morning: { title: 'Ignition Sequence',  sub: 'Morning Protocol',      accent: '#fb923c' },
      evening: { title: 'Shutdown Sequence',  sub: 'Evening Protocol',      accent: '#818cf8' },
      space:   { title: 'Spatial Order',      sub: 'Environmental Control', accent: '#34d399' },
      digital: { title: 'Focus Reclaim',      sub: 'Digital Detox',         accent: '#f472b6' },
      mental:  { title: 'Cognitive Reset',    sub: 'Mental Protocol',       accent: '#a78bfa' },
      reading: { title: 'Knowledge Compound', sub: 'Reading Protocol',      accent: '#fbbf24' },
    }
    return meta[t]
  }
  return { title: 'Unknown Protocol', sub: '—', accent: '#8b5cf6' }
}

// ── 공통 스타일 ──
const cardBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 20,
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: 'monospace',
  color: 'rgba(255,255,255,0.45)',
  letterSpacing: '0.15em', textTransform: 'uppercase',
}

type FilterKey = 'all' | 'pending' | 'done'

// ─────────────────────────────────────────────────
// Missions 페이지
// ─────────────────────────────────────────────────
export default function Missions() {
  const setScreen = useAppStore(s => s.setScreen)
  const setCurrentMissionCategory = useAppStore(s => s.setCurrentMissionCategory)
  const setCurrentOnboardingCategory = useAppStore(s => s.setCurrentOnboardingCategory)
  const resetObState = useAppStore(s => s.resetObState)

  const [tick, setTick] = useState(0)
  const clock = useClock()
  const [filter, setFilter] = useState<FilterKey>('all')

  const todayStr = today()
  const keys = getAllActiveCatKeys()
  const slots = getRoutineSlots()

  // 활성 카테고리 분류
  const hasHealth  = !!getCatData('health')
  const hasSleep   = !!getCatData('sleep')
  const hasRoutine = slots.length > 0
  const routineUnlocked = getRoutineUnlocked()
  const canAddRoutine = hasRoutine && slots.length < routineUnlocked && slots.length < 7

  const inactiveCats: string[] = [
    !hasHealth  && 'health',
    !hasSleep   && 'sleep',
    !hasRoutine && 'routine',
  ].filter(Boolean) as string[]

  // 전체 통계
  const activeCount  = keys.length
  const doneToday    = keys.filter(k => getCatData(k)?.last_date === todayStr).length
  const pendingToday = activeCount - doneToday
  const totalGc      = keys.reduce((s, k) => s + (Number(getCatData(k)?.growth_count) || 0), 0)
  const totalMult    = multStr(totalGc)

  const filteredKeys = useMemo(() => {
    if (filter === 'pending') return keys.filter(k => getCatData(k)?.last_date !== todayStr)
    if (filter === 'done')    return keys.filter(k => getCatData(k)?.last_date === todayStr)
    return keys
  }, [filter, tick, keys.join('|')])

  // ── 미션 시작 ──
  function startMission(cat: string) {
    const data = getCatData(cat)
    if (!data) return
    setCurrentMissionCategory(cat)
    if (cat === 'sleep' && isSleepMaxLevel(data as Parameters<typeof isSleepMaxLevel>[0])) {
      setScreen('first-mission'); return
    }
    if (!data.last_date) { setScreen('first-mission'); return }
    if (String(data.last_date) === todayStr) return // 이미 완료
    setScreen('main-choice')
  }

  function openAdd(cat: string) {
    resetObState()
    setCurrentOnboardingCategory(cat)
    if (cat === 'health')       setScreen('ob-exercise')
    else if (cat === 'sleep')   { useAppStore.setState({ obSleepCurrentH: 2, obSleepCurrentM: 0, obSleepTargetH: 0, obSleepTargetM: 0 }); setScreen('ob-sleep-current') }
    else                        setScreen('ob-routine')
  }

  function openAddRoutineSlot() {
    setCurrentOnboardingCategory('routine')
    setScreen('ob-routine')
  }

  // refresh helper (필요 시 즉시 재렌더 — e.g. 미션 완료 후 돌아올 때)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div key={tick} style={{
      maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px',
      color: '#fff', fontFamily: "'Geist Sans', -apple-system, sans-serif",
    }}>
      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 32, gap: 24, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ ...sectionLabel, marginBottom: 10 }}>MISSION DIRECTIVES</div>
          <h1 style={{
            fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            Active Protocols.
          </h1>
          <p style={{
            marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55,
          }}>
            매일의 1%가 복리로 쌓입니다. 오늘 배치된 미션을 수행하세요.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }}>
          <HeaderStat label="ACTIVE"          value={String(activeCount)} valueColor="#fff" />
          <HeaderStat label="PENDING TODAY"   value={String(pendingToday)} valueColor={pendingToday > 0 ? '#fbbf24' : '#34d399'} />
          <HeaderStat label="COMPOUND RATE"   value={`×${totalMult}`} valueColor="#a78bfa" />
          <HeaderStat label="SYSTEM TIME"     value={clock} valueColor="#fff" />
        </div>
      </div>

      {/* ── 필터 칩 ── */}
      {keys.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <FilterChip label="ALL"            count={activeCount}  active={filter === 'all'}     onClick={() => setFilter('all')} />
          <FilterChip label="IN PROGRESS"    count={pendingToday} active={filter === 'pending'} onClick={() => setFilter('pending')} />
          <FilterChip label="COMPLETED TODAY" count={doneToday}   active={filter === 'done'}    onClick={() => setFilter('done')} />
        </div>
      )}

      {/* ── 미션 카드 리스트 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {filteredKeys.length === 0 && keys.length > 0 && (
          <div style={{
            ...cardBase, textAlign: 'center', padding: '40px 24px',
            color: 'rgba(255,255,255,0.4)', fontSize: 13,
          }}>
            {filter === 'done'    && '아직 완료한 미션이 없어요. 하나라도 해보세요.'}
            {filter === 'pending' && '오늘의 모든 미션을 완료했어요 🌱'}
          </div>
        )}

        {filteredKeys.map(cat => (
          <MissionCard
            key={cat}
            cat={cat}
            todayStr={todayStr}
            onLog={() => startMission(cat)}
            onDetails={() => {
              setCurrentMissionCategory(cat)
              // 상세 페이지가 아직 없으므로 홈 레거시로 폴백 (추후 /mission/:cat 라우트로 교체)
              setScreen('home')
            }}
          />
        ))}
      </div>

      {/* ── 루틴 슬롯 확장 ── */}
      {hasRoutine && canAddRoutine && (
        <div style={{
          ...cardBase,
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.25)',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ ...sectionLabel, color: '#c4b5fd', marginBottom: 6 }}>NEW SLOT UNLOCKED</div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>
              루틴 슬롯을 추가할 수 있어요 · {slots.length} / {Math.min(routineUnlocked, 7)}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
              7일 연속 유지할 때마다 슬롯이 열립니다.
            </p>
          </div>
          <button
            onClick={openAddRoutineSlot}
            style={{
              padding: '12px 22px',
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 40, color: '#c4b5fd',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >+ Add Routine Slot</button>
        </div>
      )}

      {/* ── 비활성 모듈 ── */}
      {inactiveCats.length > 0 && (
        <div>
          <div style={{ ...sectionLabel, marginBottom: 14 }}>INACTIVE MODULES</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(inactiveCats.length, 3)}, minmax(0, 1fr))`,
            gap: 12,
          }}>
            {inactiveCats.map(cat => (
              <InactiveModule key={cat} cat={cat} onClick={() => openAdd(cat)} />
            ))}
          </div>
        </div>
      )}

      {/* ── 카테고리 완전 미설정 시 엠프티 스테이트 ── */}
      {keys.length === 0 && (
        <div style={{
          ...cardBase, textAlign: 'center', padding: '64px 24px',
        }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🌱</div>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>아직 등록된 프로토콜이 없어요</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
            첫 카테고리를 추가하고 1% 시스템을 가동하세요.
          </p>
          <button
            onClick={() => setScreen('ob-category')}
            style={{
              padding: '12px 22px',
              background: '#fff', color: '#050505',
              border: 'none', borderRadius: 40,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >+ Initialize Protocol</button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────
// 미션 카드
// ─────────────────────────────────────────────────
function MissionCard({
  cat, todayStr, onLog, onDetails,
}: {
  cat: string
  todayStr: string
  onLog: () => void
  onDetails: () => void
}) {
  const data = getCatData(cat)
  if (!data) return null

  const type       = String(data.type ?? '')
  const level      = Number(data.level) || 1
  const streak     = Number(data.streak) || 0
  const totalCnt   = Number(data.total_count) || 0
  const gc         = Number(data.growth_count) || 0
  const mult       = multStr(gc)
  const doneToday  = String(data.last_date) === todayStr

  const protocol = getProtocolMeta(cat, type)

  // DAY n/100: 연속 스트릭이 있으면 그것, 없으면 누적 회차 기반
  const dayN = Math.min(streak > 0 ? streak : totalCnt, 100)

  // Progress ring: 레벨 기반 (7단계)
  const pct = Math.min(Math.round((level / 7) * 100), 100)

  // 오늘의 미션 텍스트
  let missionText = ''
  if (cat === 'sleep') {
    const isMax = isSleepMaxLevel(data as Parameters<typeof isSleepMaxLevel>[0])
    if (isMax) {
      missionText = `목표 ${String(data.target_bedtime)} 유지하기. 지금의 리듬을 습관으로 굳힙니다.`
    } else if (data.current_target && data.target_bedtime) {
      const diff = Math.max(0,
        sleepTimeToMins(String(data.current_target)) - sleepTimeToMins(String(data.target_bedtime)))
      missionText = `오늘 목표 취침: ${String(data.current_target)}. 최종 목표까지 ${diff}분 남았습니다.`
    } else {
      missionText = getExerciseMission('sleep', level) || '오늘 취침 목표 시간 확인하기'
    }
  } else if (type && MISSIONS[type as keyof typeof MISSIONS]) {
    missionText = getExerciseMission(type, level) || '—'
  } else {
    missionText = '오늘의 상태를 체크인하세요.'
  }

  const icon = getCatIcon(cat, type)
  const fallbackName = getCatName(cat, type)

  return (
    <div style={{
      ...cardBase,
      borderColor: doneToday ? 'rgba(52,211,153,0.22)' : 'rgba(255,255,255,0.07)',
      background: doneToday ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.025)',
    }}>
      {/* 상단 뱃지 + 메타 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18, gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '5px 10px',
            background: doneToday ? 'rgba(52,211,153,0.15)' : `${protocol.accent}33`,
            border: `1px solid ${doneToday ? 'rgba(52,211,153,0.4)' : `${protocol.accent}66`}`,
            borderRadius: 6,
            fontSize: 10, fontFamily: 'monospace',
            letterSpacing: '0.15em',
            color: doneToday ? '#34d399' : protocol.accent,
          }}>
            {doneToday ? 'SYNCED TODAY' : 'ACTIVE MISSION'}
          </span>
          <span style={sectionLabel}>DAY {dayN} / 100</span>
          <span style={{ ...sectionLabel, color: 'rgba(255,255,255,0.3)' }}>LV {level}/7</span>
        </div>

        <span style={{
          fontSize: 11, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
        }}>
          ×{mult}
        </span>
      </div>

      {/* 본문 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <h2 style={{
              fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              {protocol.title}
            </h2>
          </div>

          <p style={{
            fontSize: 11, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            {protocol.sub} · {fallbackName}
          </p>

          <p style={{
            fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65,
            marginBottom: 22,
          }}>
            {missionText}
          </p>

          {/* 레벨 프로그레스 */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 6,
            }}>
              <span style={{
                fontSize: 9, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em',
              }}>LEVEL PROGRESSION</span>
              <span style={{
                fontSize: 9, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em',
              }}>{level} / 7</span>
            </div>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.06)',
              borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${protocol.accent}, #ec4899)`,
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={onLog}
              disabled={doneToday}
              style={{
                padding: '12px 22px',
                background: doneToday ? 'rgba(52,211,153,0.12)' : '#fff',
                color: doneToday ? '#34d399' : '#050505',
                border: doneToday ? '1px solid rgba(52,211,153,0.3)' : 'none',
                borderRadius: 40,
                fontSize: 13, fontWeight: 700,
                cursor: doneToday ? 'default' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'opacity 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => { if (!doneToday) (e.currentTarget as HTMLButtonElement).style.opacity = '0.88' }}
              onMouseLeave={e => { if (!doneToday) (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              {doneToday ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><polygon points="0,0 12,7 0,14" /></svg>
                  Log Activity
                </>
              )}
            </button>
            <button
              onClick={onDetails}
              style={{
                padding: '12px 22px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 40, color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              View Details
            </button>
          </div>
        </div>

        {/* 오른쪽: 진행률 링 + 통계 */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          flexShrink: 0,
        }}>
          <ProgressRing pct={pct} accent={protocol.accent} />
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8, minWidth: 140,
          }}>
            <MiniStat label="TOTAL"  value={String(totalCnt)} />
            <MiniStat label="STREAK" value={String(streak)} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────
// 비활성 모듈 카드
// ─────────────────────────────────────────────────
function InactiveModule({ cat, onClick }: { cat: string; onClick: () => void }) {
  const meta = CAT_META[cat as keyof typeof CAT_META]
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: `1px dashed ${hover ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 16,
        padding: '20px 18px',
        color: hover ? '#c4b5fd' : 'rgba(255,255,255,0.55)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>{meta?.icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{meta?.label}</span>
      </div>
      <p style={{
        fontSize: 11, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em',
      }}>
        + INITIALIZE MODULE
      </p>
    </button>
  )
}

// ─────────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────────
function HeaderStat({ label, value, valueColor }: { label: string; value: string; valueColor: string }) {
  return (
    <div>
      <div style={{ ...sectionLabel, marginBottom: 8 }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 700, color: valueColor,
        fontFamily: 'monospace', letterSpacing: '-0.01em',
      }}>
        {value}
      </div>
    </div>
  )
}

function FilterChip({ label, count, active, onClick }: {
  label: string; count: number; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        background: active ? 'rgba(139,92,246,0.14)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10,
        color: active ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
        fontSize: 11, fontFamily: 'monospace',
        letterSpacing: '0.12em',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'all 0.15s',
      }}
    >
      {label}
      <span style={{
        padding: '1px 6px', borderRadius: 4, fontSize: 10,
        background: active ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)',
        color: active ? '#ddd6fe' : 'rgba(255,255,255,0.5)',
      }}>{count}</span>
    </button>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '10px 8px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{
        fontSize: 8, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: 2,
      }}>{label}</div>
    </div>
  )
}

function ProgressRing({ pct, accent }: { pct: number; accent: string }) {
  const size = 110
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  const gradId = `ring-${accent.replace('#', '')}`

  return (
    <div style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
    }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r}
          stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r}
          stroke={`url(#${gradId})`} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1,
        }}>
          {pct}<span style={{ fontSize: 11, marginLeft: 2 }}>%</span>
        </div>
        <div style={{
          fontSize: 8, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: 4,
        }}>LEVEL SYNC</div>
      </div>
    </div>
  )
}
