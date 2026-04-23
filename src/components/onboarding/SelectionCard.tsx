import { useState } from 'react'

interface SelectionCardProps {
  emoji: string
  label: string
  image?: string | null
  selected?: boolean
  onClick: () => void
}

export default function SelectionCard({ emoji, label, image, selected = false, onClick }: SelectionCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgOk, setImgOk] = useState(Boolean(image))
  const showImg = imgOk && image

  const bg = selected
    ? 'rgba(167,139,250,0.12)'
    : hovered
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(255,255,255,0.04)'

  const border = selected
    ? 'rgba(167,139,250,0.5)'
    : hovered
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(255,255,255,0.12)'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: '20px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {showImg ? (
        <span style={{
          width: 56, height: 56, borderRadius: '50%',
          overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'block',
        }}>
          <img
            src={image as string}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.82) saturate(0.95)',
              display: 'block',
            }}
          />
        </span>
      ) : (
        <span style={{ fontSize: 28 }}>{emoji}</span>
      )}
      <span style={{
        color: selected ? '#a78bfa' : '#ffffff',
        fontWeight: 600,
        fontSize: 14,
        transition: 'color 0.2s',
        lineHeight: 1.4,
      }}>
        {label}
      </span>
    </button>
  )
}
