import { useRef, useEffect, useCallback } from 'react'

const ITEM_H = 56
const PAD = 2 // visible items above/below center

interface Props {
  items: string[]
  value: number
  onChange: (index: number) => void
}

export default function DrumPicker({ items, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const userScrolling = useRef(false)

  useEffect(() => {
    if (ref.current && !userScrolling.current) {
      ref.current.scrollTop = value * ITEM_H
    }
  }, [value])

  const snap = useCallback((el: HTMLDivElement) => {
    const i = Math.max(0, Math.min(Math.round(el.scrollTop / ITEM_H), items.length - 1))
    el.scrollTop = i * ITEM_H
    userScrolling.current = false
    onChange(i)
  }, [items.length, onChange])

  const onScroll = useCallback(() => {
    userScrolling.current = true
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { if (ref.current) snap(ref.current) }, 120)
  }, [snap])

  return (
    <div style={{ position: 'relative', height: ITEM_H * (PAD * 2 + 1), width: 88 }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H * PAD,
        background: 'linear-gradient(to bottom, #050505 20%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H * PAD,
        background: 'linear-gradient(to top, #050505 20%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: ITEM_H * PAD, left: 0, right: 0, height: ITEM_H,
        borderTop: '1px solid rgba(139,92,246,0.4)',
        borderBottom: '1px solid rgba(139,92,246,0.4)',
        zIndex: 1, pointerEvents: 'none',
      }} />
      <div
        ref={ref}
        onScroll={onScroll}
        className="drum-scroll"
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          paddingTop: ITEM_H * PAD,
          paddingBottom: ITEM_H * PAD,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          boxSizing: 'content-box',
        } as React.CSSProperties}
      >
        {items.map((item, i) => {
          const dist = Math.abs(i - value)
          return (
            <div
              key={i}
              onClick={() => {
                onChange(i)
                ref.current?.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })
              }}
              style={{
                height: ITEM_H,
                scrollSnapAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                opacity: dist === 0 ? 1 : dist === 1 ? 0.4 : 0.15,
                transform: `scale(${dist === 0 ? 1 : dist === 1 ? 0.88 : 0.78})`,
                fontSize: dist === 0 ? 22 : 18,
                fontWeight: dist === 0 ? 700 : 400,
                transition: 'all 0.12s',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}
