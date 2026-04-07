import { useEffect, useRef, useState } from 'react'
import { getGrowthStage, getPlantIcon } from '../lib/helpers'

interface GrowthAnimationProps {
  oldGc: number
  newGc: number
  message?: string
  onDone: () => void
}

export default function GrowthAnimation({ oldGc, newGc, message, onDone }: GrowthAnimationProps) {
  const oldStage = getGrowthStage(oldGc)
  const newStage = getGrowthStage(newGc)
  const levelUp = newStage.stage > oldStage.stage
  const [phase, setPhase] = useState<'old' | 'new' | 'msg'>('old')
  const doneCalledRef = useRef(false)

  useEffect(() => {
    doneCalledRef.current = false
    if (levelUp) {
      const t1 = setTimeout(() => setPhase('new'), 480)
      const t2 = setTimeout(() => setPhase('msg'), 900)
      const t3 = setTimeout(() => {
        if (!doneCalledRef.current) { doneCalledRef.current = true; onDone() }
      }, 1400)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    } else {
      setPhase('msg')
      const t = setTimeout(() => {
        if (!doneCalledRef.current) { doneCalledRef.current = true; onDone() }
      }, 1300)
      return () => clearTimeout(t)
    }
  }, [levelUp, onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(5,5,5,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
    }}>
      <style>{`
        @keyframes ga-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.22); }
        }
        @keyframes ga-grow-out {
          0%   { transform: scale(1);   opacity: 1; }
          80%  { transform: scale(1.8); opacity: 0.5; }
          100% { transform: scale(2.3); opacity: 0; }
        }
        @keyframes ga-grow-in {
          0%   { transform: scale(0.2); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes ga-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ fontSize: 72, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!levelUp && (
          <span style={{ display: 'inline-block', animation: 'ga-pulse 1s ease-in-out infinite' }}>
            {getPlantIcon(newGc)}
          </span>
        )}
        {levelUp && phase === 'old' && (
          <span style={{ display: 'inline-block', animation: 'ga-grow-out 0.48s ease-in forwards' }}>
            {getPlantIcon(oldGc)}
          </span>
        )}
        {levelUp && (phase === 'new' || phase === 'msg') && (
          <span style={{ display: 'inline-block', animation: 'ga-grow-in 0.52s ease-out forwards' }}>
            {getPlantIcon(newGc)}
          </span>
        )}
      </div>

      {phase === 'msg' && (
        <p style={{
          marginTop: 20,
          fontSize: 18, fontWeight: 700, color: '#fff',
          textAlign: 'center',
          animation: 'ga-fade-up 0.3s ease-out forwards',
        }}>
          {message ?? (levelUp ? '한 단계 성장했어요! 🎉' : '오늘도 지켰어요 💪')}
        </p>
      )}
    </div>
  )
}
