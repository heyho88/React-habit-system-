import { useMemo, useState } from 'react'
import {
  useAppStore, getAllActiveCatKeys, getCatData,
  getRoutineSlots, getRoutineUnlocked,
} from '../store/appStore'
import {
  today, isRoutineCat, getRoutineType, isSleepMaxLevel,
} from '../lib/helpers'
import type { RoutineType } from '../lib/missions'

// ── 타입 ──

type StatusKey = 'active' | 'completed' | 'pending'
type DifficultyKey = 'low' | 'medium' | 'high'
type BucketKey = 'architecture' | 'intellect' | 'social' | 'vitality'

type StatusFilter = 'all' | StatusKey
type DifficultyFilter = 'all' | DifficultyKey
type BucketFilter = 'all' | BucketKey

interface Protocol {
  title: string
  desc: string
  bucket: BucketKey
  difficulty: DifficultyKey
  accent: string
}

// ── 프로토콜 메타 ──

function getProtocol(cat: string, type: string): Protocol {
  if (cat === 'health') {
    if (type === 'gym') return {
      title: 'Gym Protocol',
      desc: 'Systematic optimization of physical strength and cardiovascular endurance via high-intensity protocols.',
      bucket: 'architecture', difficulty: 'high', accent: '#8b5cf6',
    }
    if (type === 'hometraining') return {
      title: 'Home Training',
      desc: 'Daily bodyweight conditioning to build sustainable strength without external equipment.',
      bucket: 'architecture', difficulty: 'medium', accent: '#8b5cf6',
    }
    if (type === 'walking') return {
      title: 'Cardio Protocol',
      desc: 'Low-impact cardiovascular training to establish endurance and movement consistency.',
      bucket: 'vitality', difficulty: 'low', accent: '#8b5cf6',
    }
    return {
      title: 'Body Architecture',
      desc: 'Physical foundation training tuned for compound daily gains in strength and endurance.',
      bucket: 'architecture', difficulty: 'high', accent: '#8b5cf6',
    }
  }
  if (cat === 'sleep') return {
    title: 'Sleep Protocol',
    desc: 'Engineered rest cycles to optimize recovery, cognitive function, and long-term health.',
    bucket: 'vitality', difficulty: 'low', accent: '#22d3ee',
  }
  if (isRoutineCat(cat)) {
    const t = getRoutineType(cat) as RoutineType
    const meta: Record<RoutineType, Protocol> = {
      morning: {
        title: 'Ignition Sequence',
        desc: 'Structured morning ritual to engage focus and intention at the start of each cycle.',
        bucket: 'architecture', difficulty: 'medium', accent: '#fb923c',
      },
      evening: {
        title: 'Shutdown Sequence',
        desc: 'Wind-down ritual to consolidate the day and prepare the system for recovery.',
        bucket: 'vitality', difficulty: 'low', accent: '#818cf8',
      },
      space: {
        title: 'Spatial Order',
        desc: 'Environmental discipline as the foundation for sustained mental clarity.',
        bucket: 'architecture', difficulty: 'low', accent: '#34d399',
      },
      digital: {
        title: 'Focus Reclaim',
        desc: 'Reclaim attention and cognitive bandwidth by engineering boundaries with digital systems.',
        bucket: 'intellect', difficulty: 'medium', accent: '#f472b6',
      },
      mental: {
        title: 'Cognitive Reset',
        desc: 'Emotional regulation and cognitive reset protocols for sustained clarity under load.',
        bucket: 'social', difficulty: 'medium', accent: '#a78bfa',
      },
      reading: {
        title: 'Knowledge Compound',
        desc: 'Compounding knowledge acquisition through consistent, focused reading intervals.',
        bucket: 'intellect', difficulty: 'high', accent: '#fbbf24',
      },
    }
    return meta[t]
  }
  return {
    title: 'Unknown Protocol',
    desc: '—',
    bucket: 'architecture', difficulty: 'low', accent: '#8b5cf6',
  }
}

function getStatus(data: Record<string, unknown> | null, todayStr: string): StatusKey {
  if (!data) return 'pending'
  const level = Number(data.level) || 1
  const lastDate = data.last_date
  const gc = Number(data.growth_count) || 0
  if (level >= 7) return 'completed'
  if (!lastDate && gc === 0) return 'pending'
  // 오늘 완료 + 장기 진행 중
  if (String(lastDate) === todayStr && level >= 4) return 'active'
  return 'active'
}

function getProgressPct(data: Record<string, unknown>): number {
  const level = Number(data.level) || 1
  return Math.min(100, Math.round((level / 7) * 100))
}

// ── 스타일 상수 ──

const MONO_LABEL: React.CSSProperties = {
  fontSize: 10, fontFamily: 'monospace',
  color: 'rgba(255,255,255,0.45)',
  letterSpacing: '0.15em', textTransform: 'uppercase',
}

const STATUS_META: Record<StatusKey, { label: string; bg: string; border: string; color: string }> = {
  active:    { label: 'ACTIVE',    bg: 'rgba(139,92,246,0.14)', border: 'rgba(139,92,246,0.4)', color: '#a78bfa' },
  completed: { label: 'COMPLETED', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.4)', color: '#34d399' },
  pending:   { label: 'PENDING',   bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.4)',  color: '#fb7185' },
}

const BUCKET_LABEL: Record<BucketKey, string> = {
  architecture: 'Architecture',
  intellect:    'Intellect',
  social:       'Social',
  vitality:     'Vitality',
}

// ─────────────────────────────────────────────
// Missions 페이지
// ─────────────────────────────────────────────

export default function Missions() {
  const setScreen = useAppStore(s => s.setScreen)
  const setCurrentMissionCategory = useAppStore(s => s.setCurrentMissionCategory)
  const setCurrentOnboardingCategory = useAppStore(s => s.setCurrentOnboardingCategory)
  const resetObState = useAppStore(s => s.resetObState)

  const [statusF, setStatusF] = useState<StatusFilter>('all')
  const [diffF, setDiffF] = useState<DifficultyFilter>('all')
  const [bucketF, setBucketF] = useState<BucketFilter>('all')
  const [query, setQuery] = useState('')

  const todayStr = today()
  const keys = getAllActiveCatKeys()
  const slots = getRoutineSlots()
  const routineUnlocked = getRoutineUnlocked()
  const canAddRoutine = slots.length > 0 && slots.length < Math.min(routineUnlocked, 7)
  const hasHealth = !!getCatData('health')
  const hasSleep = !!getCatData('sleep')
  const canAddNewMission = !hasHealth || !hasSleep || canAddRoutine

  const cards = useMemo(() => {
    return keys.map(cat => {
      const data = getCatData(cat)
      if (!data) return null
      const type = String(data.type ?? '')
      const protocol = getProtocol(cat, type)
      const status = getStatus(data, todayStr)
      const streak = Number(data.streak) || 0
      const progress = getProgressPct(data)
      const doneToday = String(data.last_date) === todayStr
      return { cat, type, data, protocol, status, streak, progress, doneToday }
    }).filter((x): x is NonNullable<typeof x> => x !== null)
  }, [keys.join('|'), todayStr])

  const filtered = cards.filter(c => {
    if (statusF !== 'all' && c.status !== statusF) return false
    if (diffF !== 'all' && c.protocol.difficulty !== diffF) return false
    if (bucketF !== 'all' && c.protocol.bucket !== bucketF) return false
    if (query && !c.protocol.title.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  function startMission(cat: string) {
    const data = getCatData(cat)
    if (!data) return
    setCurrentMissionCategory(cat)
    if (cat === 'sleep' && isSleepMaxLevel(data as Parameters<typeof isSleepMaxLevel>[0])) {
      setScreen('first-mission'); return
    }
    if (!data.last_date) { setScreen('first-mission'); return }
    if (String(data.last_date) === todayStr) return
    setScreen('main-choice')
  }

  function openNewMission() {
    resetObState()
    if (!hasHealth) {
      setCurrentOnboardingCategory('health')
      setScreen('ob-exercise')
    } else if (!hasSleep) {
      setCurrentOnboardingCategory('sleep')
      useAppStore.setState({ obSleepCurrentH: 2, obSleepCurrentM: 0, obSleepTargetH: 0, obSleepTargetM: 0 })
      setScreen('ob-sleep-current')
    } else {
      setCurrentOnboardingCategory('routine')
      setScreen('ob-routine')
    }
  }

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '48px 40px 80px',
      color: '#fff', fontFamily: "'Geist Sans', -apple-system, sans-serif",
    }}>
      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 24, flexWrap: 'wrap', marginBottom: 36,
      }}>
        <div>
          <div style={{ ...MONO_LABEL, color: '#a78bfa', marginBottom: 12 }}>
            OPERATION CENTER
          </div>
          <h1 style={{
            fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
          }}>
            Missions
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <SearchBox value={query} onChange={setQuery} />
          <button
            onClick={openNewMission}
            disabled={!canAddNewMission}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              background: canAddNewMission
                ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                : 'rgba(255,255,255,0.08)',
              color: canAddNewMission ? '#fff' : 'rgba(255,255,255,0.35)',
              border: 'none', borderRadius: 50,
              fontSize: 13, fontWeight: 700,
              cursor: canAddNewMission ? 'pointer' : 'not-allowed',
              boxShadow: canAddNewMission ? '0 8px 24px rgba(139,92,246,0.35)' : 'none',
              letterSpacing: '-0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { if (canAddNewMission) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
            onMouseLeave={e => { if (canAddNewMission) (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            New Mission
          </button>
        </div>
      </div>

      {/* ── 필터 그룹 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <FilterRow
          label="STATUS"
          items={[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
          ]}
          value={statusF}
          onChange={v => setStatusF(v as StatusFilter)}
        />
        <FilterRow
          label="DIFFICULTY"
          items={[
            { key: 'all', label: 'All' },
            { key: 'low', label: 'Low' },
            { key: 'medium', label: 'Medium' },
            { key: 'high', label: 'High-End' },
          ]}
          value={diffF}
          onChange={v => setDiffF(v as DifficultyFilter)}
        />
        <FilterRow
          label="CATEGORY"
          items={[
            { key: 'all', label: 'All' },
            { key: 'architecture', label: 'Architecture' },
            { key: 'intellect', label: 'Intellect' },
            { key: 'social', label: 'Social' },
            { key: 'vitality', label: 'Vitality' },
          ]}
          value={bucketF}
          onChange={v => setBucketF(v as BucketFilter)}
        />
      </div>

      {/* ── 디바이더 ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0 28px' }} />

      {/* ── 미션 그리드 ── */}
      {filtered.length === 0 && cards.length > 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          color: 'rgba(255,255,255,0.4)', fontSize: 13,
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: 16,
        }}>
          해당 조건에 맞는 프로토콜이 없어요.
        </div>
      ) : cards.length === 0 ? (
        <EmptyState onStart={() => setScreen('ob-category')} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(c => (
            <MissionCard
              key={c.cat}
              protocol={c.protocol}
              status={c.status}
              streak={c.streak}
              progress={c.progress}
              doneToday={c.doneToday}
              onAction={() => startMission(c.cat)}
            />
          ))}
          {canAddNewMission && (
            <UnlockCard onClick={openNewMission} />
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center',
      width: 320, maxWidth: '100%',
      padding: '0 16px',
      background: 'rgba(255,255,255,0.04)',
      border: focus ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: 50,
      transition: 'border 0.15s',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Search directives..."
        style={{
          flex: 1, padding: '12px 12px',
          background: 'transparent', border: 'none', outline: 'none',
          color: '#fff', fontSize: 13,
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

function FilterRow<T extends string>({
  label, items, value, onChange,
}: {
  label: string
  items: { key: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div>
      <div style={{ ...MONO_LABEL, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {items.map(item => {
          const active = value === item.key
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              style={{
                padding: '8px 18px',
                background: active ? '#fff' : 'rgba(255,255,255,0.03)',
                color: active ? '#050505' : 'rgba(255,255,255,0.6)',
                border: active ? '1px solid #fff' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 50,
                fontSize: 13, fontWeight: active ? 700 : 500,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MissionCard({
  protocol, status, streak, progress, doneToday, onAction,
}: {
  protocol: Protocol
  status: StatusKey
  streak: number
  progress: number
  doneToday: boolean
  onAction: () => void
}) {
  const statusMeta = STATUS_META[status]

  // 진행률 바 그라데이션
  let barFill: string
  if (status === 'completed') barFill = '#34d399'
  else if (status === 'pending') barFill = 'rgba(255,255,255,0.18)'
  else barFill = `linear-gradient(90deg, ${protocol.accent}, #fb923c)`

  // 퍼센트 색
  let pctColor: string
  if (status === 'completed') pctColor = '#34d399'
  else if (status === 'pending') pctColor = 'rgba(255,255,255,0.4)'
  else pctColor = '#fff'

  // CTA 버튼 라벨/스타일
  let ctaLabel: string
  let ctaPrimary: boolean
  if (status === 'completed') { ctaLabel = 'View Log'; ctaPrimary = false }
  else if (status === 'pending') { ctaLabel = 'Initialize'; ctaPrimary = false }
  else if (doneToday) { ctaLabel = 'Completed Today'; ctaPrimary = false }
  else { ctaLabel = 'Resume Mission'; ctaPrimary = true }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: 28,
      display: 'flex', flexDirection: 'column', gap: 20,
      minHeight: 320,
    }}>
      {/* 상단: 상태 뱃지 + 스트릭 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          padding: '6px 12px',
          background: statusMeta.bg,
          border: `1px solid ${statusMeta.border}`,
          borderRadius: 6,
          fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
          letterSpacing: '0.15em',
          color: statusMeta.color,
        }}>
          {statusMeta.label}
        </span>
        <StreakBadge streak={streak} />
      </div>

      {/* 타이틀 + 설명 */}
      <div>
        <h2 style={{
          fontSize: 26, fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.2,
          margin: '0 0 10px',
        }}>
          {protocol.title}
        </h2>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6, margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {protocol.desc}
        </p>
      </div>

      {/* 프로그레스 */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 10,
        }}>
          <span style={MONO_LABEL}>PROGRESS</span>
          <span style={{
            fontSize: 14, fontWeight: 700, color: pctColor,
            letterSpacing: '-0.01em',
          }}>
            {progress}%
          </span>
        </div>
        <div style={{
          height: 3, background: 'rgba(255,255,255,0.06)',
          borderRadius: 99, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: barFill,
            borderRadius: 99,
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onAction}
          disabled={doneToday && status !== 'pending'}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: ctaPrimary ? '#fff' : 'rgba(255,255,255,0.04)',
            color: ctaPrimary ? '#050505' : '#fff',
            border: ctaPrimary ? 'none' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            fontSize: 13, fontWeight: 700,
            letterSpacing: '-0.01em',
            cursor: doneToday && status !== 'pending' ? 'default' : 'pointer',
            opacity: doneToday && status !== 'pending' ? 0.6 : 1,
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => {
            if (!(doneToday && status !== 'pending')) {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
            }
          }}
          onMouseLeave={e => {
            if (!(doneToday && status !== 'pending')) {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }
          }}
        >
          {ctaLabel}
        </button>
        {status !== 'completed' && (
          <button
            style={{
              width: 44, padding: 0,
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              fontSize: 16, fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
            title="More options"
          >
            ···
          </button>
        )}
      </div>
    </div>
  )
}

function StreakBadge({ streak }: { streak: number }) {
  let color: string
  if (streak >= 14) color = '#34d399'
  else if (streak >= 7) color = '#a78bfa'
  else if (streak >= 1) color = '#fb923c'
  else color = 'rgba(255,255,255,0.35)'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
      color, letterSpacing: '0.1em',
    }}>
      <svg width="13" height="14" viewBox="0 0 24 24" fill={streak > 0 ? color : 'none'}
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1 2.5-2.5 0-2-2.5-4-2.5-4s-2.5 2-2.5 3.5Z" />
        <path d="M12 2s3 6 5 9a7 7 0 1 1-10 0c2-3 5-9 5-9Z" />
      </svg>
      {streak}D STREAK
    </div>
  )
}

function UnlockCard({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(139,92,246,0.04)' : 'transparent',
        border: `1.5px dashed ${hover ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.14)'}`,
        borderRadius: 20,
        padding: 28,
        minHeight: 320,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 18,
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.5)',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: hover ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hover ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={hover ? '#c4b5fd' : 'rgba(255,255,255,0.5)'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <span style={{
        fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
        letterSpacing: '0.18em',
        color: hover ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
      }}>
        UNLOCK NEW DIRECTIVE
      </span>
    </button>
  )
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 24px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: 20,
    }}>
      <div style={{ fontSize: 42, marginBottom: 14 }}>🌱</div>
      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
        아직 등록된 프로토콜이 없어요
      </p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 22 }}>
        첫 카테고리를 추가하고 1% 시스템을 가동하세요.
      </p>
      <button
        onClick={onStart}
        style={{
          padding: '12px 22px',
          background: '#fff', color: '#050505',
          border: 'none', borderRadius: 40,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}
      >
        + Initialize Protocol
      </button>
    </div>
  )
}
