import { useState } from 'react'

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일']

interface Props {
  grassMap: Record<string, string>
  todayStr: string
}

function cellStyle(type: string | undefined, isToday: boolean, isFuture: boolean): React.CSSProperties {
  let bg: string
  let color: string
  let border = 'none'
  if (isFuture) {
    bg = 'rgba(255,255,255,0.02)'; color = 'rgba(255,255,255,0.15)'
  } else if (type === 'growth') {
    bg = '#F97316'; color = '#fff'
  } else if (type === 'maintain') {
    bg = 'rgba(249,115,22,0.35)'; color = 'rgba(255,255,255,0.7)'
  } else if (type === 'pass') {
    bg = 'rgba(255,255,255,0.06)'; color = 'rgba(255,255,255,0.3)'
  } else {
    bg = isToday ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)'
    color = isToday ? '#F97316' : 'rgba(255,255,255,0.25)'
  }
  if (isToday) border = '1.5px solid #F97316'
  return {
    background: bg, color, border, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    aspectRatio: '1',
    fontSize: 11,
    fontWeight: type === 'growth' ? 700 : 400,
    cursor: 'default',
  }
}

export default function GrassCalendar({ grassMap, todayStr }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  function goPrev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function goNext() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const firstDow = new Date(year, month, 1).getDay()
  const startOffset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: React.ReactNode[] = []
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`e${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = ds === todayStr
    const isFuture = ds > todayStr
    const type = grassMap[ds]
    cells.push(
      <div key={day} style={cellStyle(type, isToday, isFuture)}>
        {day}
      </div>
    )
  }

  return (
    <div>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={goPrev} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>‹</button>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
          {year}년 {month + 1}월
        </p>
        <button onClick={goNext} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>›</button>
      </div>

      {/* Week header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 3 }}>
        {WEEK_LABELS.map(l => (
          <div key={l} style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.3)', paddingBottom: 4 }}>{l}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {cells}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
        {[
          { color: '#F97316',                    label: '성장' },
          { color: 'rgba(249,115,22,0.35)',       label: '유지' },
          { color: 'rgba(255,255,255,0.06)',      label: '패스' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
