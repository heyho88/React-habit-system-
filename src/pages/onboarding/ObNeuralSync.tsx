import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

const logs = [
  { tag: '[OK]',   tagColor: '#00D2D3', text: 'Core engine v1.0 loaded' },
  { tag: '[OK]',   tagColor: '#00D2D3', text: 'AES-256 encryption active' },
  { tag: '[WAIT]', tagColor: '#FDCB6E', text: 'Calibrating behavioral modules...' },
  { tag: '[OK]',   tagColor: '#00D2D3', text: 'Synchronization complete. Ready.' },
];

const ObNeuralSync = () => {
  const { setScreen } = useAppStore();
  const [pulseR, setPulseR] = useState(12);
  const [pulseOpacity, setPulseOpacity] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(0);

  // 퍼지는 원 애니메이션
  useEffect(() => {
    let r = 12;
    let growing = true;
    const interval = setInterval(() => {
      if (growing) {
        r += 1.5;
        if (r >= 85) growing = false;
      } else {
        r -= 1.5;
        if (r <= 12) growing = true;
      }
      const opacity = 1 - ((r - 12) / (85 - 12)) * 0.9;
      setPulseR(r);
      setPulseOpacity(opacity);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // 게이지 바
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // 로그 순차 등장
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleLogs(1), 800),
      setTimeout(() => setVisibleLogs(2), 1600),
      setTimeout(() => setVisibleLogs(3), 2600),
      setTimeout(() => setVisibleLogs(4), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // 화면 전환
  useEffect(() => {
    const t = setTimeout(() => setScreen('ob-complete-final'), 4800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#050505',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* 상단 네비 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>● SLOO</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>SYSTEM_INITIALIZING</span>
      </div>

      {/* 중앙 원형 애니메이션 */}
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none"
          stroke="rgba(108,92,231,0.15)" strokeWidth="1"/>
        <circle cx="100" cy="100" r="65" fill="none"
          stroke="rgba(108,92,231,0.25)" strokeWidth="1"/>
        <circle cx="100" cy="100" r={pulseR} fill="none"
          stroke="rgba(139,92,246,0.4)" strokeWidth="1"
          style={{ opacity: pulseOpacity }}/>
        <circle cx="100" cy="100" r="12"
          fill="#8B5CF6"
          style={{ filter: 'blur(2px)' }}/>
        <circle cx="100" cy="100" r="8" fill="#A78BFA"/>
      </svg>

      {/* 텍스트 */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '0.1em' }}>
          NEURAL SYNC
        </div>
        <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6', letterSpacing: '0.15em', marginTop: 8 }}>
          ESTABLISHING SECURE CONNECTION
        </div>
      </div>

      {/* 게이지 바 */}
      <div style={{ marginTop: 32, width: 280 }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 1,
            background: 'linear-gradient(90deg, #6C5CE7, #E040FB, #FF6B35)',
            width: `${progress}%`,
            transition: 'width 0.1s linear',
          }} />
        </div>
      </div>

      {/* 로그 터미널 */}
      <div style={{
        marginTop: 40, width: 440,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '20px 24px',
        minHeight: 100,
      }}>
        {logs.slice(0, visibleLogs).map((log, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8,
            marginBottom: i < visibleLogs - 1 ? 8 : 0,
            animation: 'fadeInUp 0.4s ease',
            fontFamily: 'monospace', fontSize: 13,
          }}>
            <span style={{ color: log.tagColor, minWidth: 50 }}>{log.tag}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObNeuralSync;
