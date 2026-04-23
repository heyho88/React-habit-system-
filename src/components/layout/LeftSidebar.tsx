import { useAppStore, getProfile } from '../../store/appStore'

type Tab = 'dashboard' | 'missions' | 'analytics' | 'settings'

const NAV: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'dashboard', label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: 'missions', label: 'Missions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    ),
  },
  {
    key: 'analytics', label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9" />
        <path d="M21 12A9 9 0 0 0 12 3v9z" />
      </svg>
    ),
  },
  {
    key: 'settings', label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function LeftSidebar() {
  const mainTab = useAppStore(s => s.mainTab)
  const setMainTab = useAppStore(s => s.setMainTab)
  useAppStore(s => s.profileVersion)
  const profile = getProfile()
  const name = profile.displayName || 'Architect_01'

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 260,
      background: '#050505',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 20px 20px',
      zIndex: 50,
    }}>
      {/* 로고 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44, paddingLeft: 8 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: '#a78bfa', boxShadow: '0 0 10px #a78bfa',
        }} />
        <span style={{
          fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', color: '#fff',
        }}>ONEPERCENT</span>
      </div>

      {/* 네비 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.map(item => {
          const active = mainTab === item.key
          return (
            <button
              key={item.key}
              onClick={() => setMainTab(item.key)}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                border: active ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                borderRadius: 10,
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600,
                cursor: 'pointer', textAlign: 'left',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
            >
              {active && (
                <div style={{
                  position: 'absolute', left: -20, top: 10, bottom: 10,
                  width: 3, borderRadius: 2,
                  background: 'linear-gradient(180deg,#a78bfa,#8b5cf6)',
                }} />
              )}
              <span style={{ display: 'inline-flex', opacity: active ? 1 : 0.75 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 프로필 푸터 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 10px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: profile.avatar
            ? `center/cover no-repeat url(${profile.avatar})`
            : 'linear-gradient(135deg,#8b5cf6,#ec4899)',
          flexShrink: 0,
        }} />
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 700, color: '#fff',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{name}</p>
          <p style={{
            fontSize: 9, fontFamily: 'monospace', color: '#34d399',
            letterSpacing: '0.15em', marginTop: 2,
          }}>SYNC ACTIVE</p>
        </div>
      </div>
    </aside>
  )
}
