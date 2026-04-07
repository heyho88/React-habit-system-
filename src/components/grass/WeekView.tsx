const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

type GrassType = 'growth' | 'maintain' | 'pass' | null

interface Props {
  grassMap: Record<string, string>
  todayStr: string
}

function getIcon(type: GrassType, isFuture: boolean) {
  if (isFuture) return <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>·</span>
  if (type === 'growth')  return <span style={{ fontSize: 16 }}>✅</span>
  if (type === 'maintain') return <span style={{ fontSize: 16 }}>🔄</span>
  if (type === 'pass')    return <span style={{ fontSize: 16 }}>⏭</span>
  return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>·</span>
}

export default function WeekView({ grassMap, todayStr }: Props) {
  const todayDate = new Date()
  const todayDow = todayDate.getDay()
  const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
        이번 주
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {DAY_LABELS.map((label, i) => {
          const d = new Date(todayDate)
          d.setDate(todayDate.getDate() + mondayOffset + i)
          const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          const isFuture = ds > todayStr
          const isToday = ds === todayStr
          const type = (grassMap[ds] ?? null) as GrassType

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '4px 8px',
              borderRadius: 8,
              background: isToday ? 'rgba(249,115,22,0.08)' : 'transparent',
            }}>
              <span style={{
                width: 20, textAlign: 'center',
                fontSize: 12, fontWeight: isToday ? 700 : 500,
                color: isToday ? '#F97316' : 'rgba(255,255,255,0.4)',
              }}>
                {label}
              </span>
              {getIcon(type, isFuture)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
