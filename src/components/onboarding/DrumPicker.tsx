import { useRef, useEffect, useCallback } from 'react'

const ITEM_HEIGHT = 56
const VISIBLE_COUNT = 5

interface DrumPickerProps {
  items: string[]
  value: number
  onChange: (index: number) => void
}

export default function DrumPicker({ items, value, onChange }: DrumPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const isUserScrolling = useRef(false)

  // Scroll to current value (only when value changes externally)
  useEffect(() => {
    if (scrollRef.current && !isUserScrolling.current) {
      scrollRef.current.scrollTop = value * ITEM_HEIGHT
    }
  }, [value])

  const snapToIndex = useCallback((el: HTMLDivElement) => {
    const index = Math.round(el.scrollTop / ITEM_HEIGHT)
    const clamped = Math.max(0, Math.min(index, items.length - 1))
    el.scrollTop = clamped * ITEM_HEIGHT
    isUserScrolling.current = false
    onChange(clamped)
  }, [items.length, onChange])

  const handleScroll = useCallback(() => {
    isUserScrolling.current = true
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (scrollRef.current) snapToIndex(scrollRef.current)
    }, 120)
  }, [snapToIndex])

  const containerHeight = ITEM_HEIGHT * VISIBLE_COUNT

  return (
    <div style={{ position: 'relative', height: containerHeight, width: 100 }}>
      {/* Top gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: ITEM_HEIGHT * 2,
        background: 'linear-gradient(to bottom, #050505 10%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: ITEM_HEIGHT * 2,
        background: 'linear-gradient(to top, #050505 10%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Center selection indicator */}
      <div style={{
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        left: 0, right: 0,
        height: ITEM_HEIGHT,
        borderTop: '1px solid rgba(167,139,250,0.35)',
        borderBottom: '1px solid rgba(167,139,250,0.35)',
        zIndex: 1, pointerEvents: 'none',
      }} />
      {/* Scrollable drum */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          boxSizing: 'content-box',
        } as React.CSSProperties}
        className="drum-scroll"
      >
        {items.map((item, i) => {
          const dist = Math.abs(i - value)
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : 0.15
          const scale = dist === 0 ? 1 : dist === 1 ? 0.88 : 0.78

          return (
            <div
              key={i}
              style={{
                height: ITEM_HEIGHT,
                scrollSnapAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                opacity,
                transform: `scale(${scale})`,
                fontSize: dist === 0 ? 22 : 18,
                fontWeight: dist === 0 ? 700 : 400,
                transition: 'opacity 0.15s, transform 0.15s, font-size 0.15s',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => {
                onChange(i)
                scrollRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' })
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
