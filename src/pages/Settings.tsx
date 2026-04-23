import { useMemo, useRef, useState } from 'react'
import {
  useAppStore,
  getProfile,
  getAllActiveCatKeys,
} from '../store/appStore'
import { getCatName } from '../lib/helpers'

type FlashKind = 'saved' | 'exported' | 'reset' | null

export default function Settings() {
  const setScreen = useAppStore(s => s.setScreen)
  const setMainTab = useAppStore(s => s.setMainTab)
  const resetObState = useAppStore(s => s.resetObState)
  const saveProfileAction = useAppStore(s => s.saveProfile)

  const initial = useMemo(() => getProfile(), [])
  const [name, setName] = useState(initial.displayName)
  const [bio, setBio] = useState(initial.bio)
  const [avatar, setAvatar] = useState<string | null>(initial.avatar)
  const [nameFocus, setNameFocus] = useState(false)
  const [bioFocus, setBioFocus] = useState(false)
  const [flash, setFlash] = useState<FlashKind>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeCats = getAllActiveCatKeys()

  const dirty =
    name !== initial.displayName ||
    bio !== initial.bio ||
    avatar !== initial.avatar

  function showFlash(k: FlashKind) {
    setFlash(k)
    setTimeout(() => setFlash(null), 1800)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(f)
  }

  function saveProfile() {
    saveProfileAction({ displayName: name, bio, avatar })
    showFlash('saved')
  }

  function exportData() {
    const bag: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k || !k.startsWith('sloo_')) continue
      const raw = localStorage.getItem(k)
      try { bag[k] = raw ? JSON.parse(raw) : raw }
      catch { bag[k] = raw }
    }
    const blob = new Blob([JSON.stringify(bag, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `sloo-backup-${stamp}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showFlash('exported')
  }

  function factoryReset() {
    const ok = window.confirm(
      '모든 데이터를 삭제합니다.\n\n프로필, 카테고리, 진행 기록이 영구 삭제되며 되돌릴 수 없습니다.\n계속하시겠습니까?'
    )
    if (!ok) return
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('sloo_')) keys.push(k)
    }
    keys.forEach(k => localStorage.removeItem(k))
    resetObState()
    setMainTab('dashboard')
    setScreen('landing')
  }

  return (
    <div style={{
      maxWidth: 960,
      margin: '0 auto',
      padding: '64px 40px 120px',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 10, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.18em', marginBottom: 12,
        }}>
          SYSTEM SETTINGS
        </div>
        <h1 style={{
          fontSize: 34, fontWeight: 800,
          letterSpacing: '-0.03em', margin: 0,
        }}>
          Settings
        </h1>
        <p style={{
          marginTop: 10, fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
        }}>
          정체성, 가동 중인 시스템, 데이터를 관리합니다.
        </p>
      </div>

      {/* 01 / PROFILE */}
      <Section index="01" code="PROFILE" title="정체성">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gap: 32,
          alignItems: 'start',
        }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 104, height: 104, borderRadius: '50%',
                border: avatar
                  ? '1.5px solid rgba(139,92,246,0.5)'
                  : '1.5px dashed rgba(255,255,255,0.25)',
                background: avatar
                  ? `center/cover no-repeat url(${avatar})`
                  : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {!avatar && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="18" width="18" height="1.5" rx="0.75" fill="rgba(255,255,255,0.15)"/>
                </svg>
              )}
            </div>
            <span style={{
              fontSize: 9, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.12em',
            }}>
              {avatar ? 'CHANGE AVATAR' : 'UPLOAD AVATAR'}
            </span>
            {avatar && (
              <button
                onClick={() => setAvatar(null)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 11, color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                제거
              </button>
            )}
          </div>

          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="DISPLAY NAME">
              <input
                type="text"
                placeholder="Architect_01"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
                style={inputStyle(nameFocus)}
              />
            </Field>
            <Field label="PERSONAL BIO">
              <textarea
                placeholder="당신의 비전이나 현재의 목표"
                value={bio}
                onChange={e => setBio(e.target.value)}
                onFocus={() => setBioFocus(true)}
                onBlur={() => setBioFocus(false)}
                style={{
                  ...inputStyle(bioFocus),
                  height: 100,
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={saveProfile}
                disabled={!dirty}
                style={{
                  padding: '12px 24px',
                  background: dirty ? '#ffffff' : 'rgba(255,255,255,0.1)',
                  color: dirty ? '#050505' : 'rgba(255,255,255,0.4)',
                  border: 'none', borderRadius: 50,
                  fontSize: 13, fontWeight: 700,
                  cursor: dirty ? 'pointer' : 'not-allowed',
                  transition: 'opacity 0.15s ease',
                }}
              >
                변경사항 저장
              </button>
              {flash === 'saved' && (
                <span style={{
                  fontSize: 11, fontFamily: 'monospace',
                  color: '#34d399', letterSpacing: '0.12em',
                }}>
                  ● PROFILE SYNCED
                </span>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* 02 / ACTIVE SYSTEMS */}
      <Section index="02" code="ACTIVE SYSTEMS" title="가동 중인 시스템">
        {activeCats.length === 0 ? (
          <div style={{
            fontSize: 13, color: 'rgba(255,255,255,0.4)',
            padding: '24px 0',
          }}>
            가동 중인 카테고리가 없습니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeCats.map(cat => (
              <div
                key={cat}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#34d399', boxShadow: '0 0 8px #34d399',
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{getCatName(cat)}</span>
                </div>
                <span style={{
                  fontSize: 9, fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.12em',
                }}>
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 03 / DATA MANAGEMENT */}
      <Section index="03" code="DATA MANAGEMENT" title="데이터 관리">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ActionRow
            title="데이터 내보내기"
            desc="프로필, 카테고리, 진행 기록을 JSON 파일로 저장합니다."
            actionLabel="EXPORT"
            onClick={exportData}
            flashActive={flash === 'exported'}
            flashText="● BACKUP READY"
          />
          <ActionRow
            title="전체 초기화"
            desc="모든 로컬 데이터를 삭제하고 첫 화면으로 돌아갑니다. 되돌릴 수 없습니다."
            actionLabel="FACTORY RESET"
            onClick={factoryReset}
            destructive
          />
        </div>
      </Section>

      {/* 04 / ABOUT */}
      <Section index="04" code="ABOUT" title="시스템 정보">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <InfoCell k="VERSION" v="SLOO v1.0" />
          <InfoCell k="NETWORK" v="SYSTEM READY" />
          <InfoCell k="DATA PRIVACY" v="LOCAL · AES-256" />
          <InfoCell k="RUNTIME" v="BROWSER / LOCAL STORAGE" />
        </div>
      </Section>
    </div>
  )
}

// ── 서브 컴포넌트 ──

function Section({
  index, code, title, children,
}: {
  index: string
  code: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section style={{
      marginBottom: 32,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '28px 32px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        marginBottom: 22,
      }}>
        <span style={{
          fontSize: 10, fontFamily: 'monospace',
          color: '#a78bfa', letterSpacing: '0.15em',
        }}>
          {index} / {code}
        </span>
      </div>
      <h2 style={{
        fontSize: 20, fontWeight: 700,
        letterSpacing: '-0.02em',
        margin: '0 0 22px',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 9, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.12em', marginBottom: 8,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function ActionRow({
  title, desc, actionLabel, onClick, destructive, flashActive, flashText,
}: {
  title: string
  desc: string
  actionLabel: string
  onClick: () => void
  destructive?: boolean
  flashActive?: boolean
  flashText?: string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 20,
      padding: '18px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${destructive ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 12,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700,
          color: destructive ? '#fca5a5' : '#fff',
          marginBottom: 4,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.5,
        }}>
          {desc}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {flashActive && flashText && (
          <span style={{
            fontSize: 10, fontFamily: 'monospace',
            color: '#34d399', letterSpacing: '0.12em',
          }}>
            {flashText}
          </span>
        )}
        <button
          onClick={onClick}
          style={{
            padding: '10px 18px',
            background: destructive ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.06)',
            color: destructive ? '#fca5a5' : '#fff',
            border: `1px solid ${destructive ? 'rgba(244,63,94,0.35)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 8,
            fontSize: 10, fontFamily: 'monospace',
            fontWeight: 700, letterSpacing: '0.1em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}

function InfoCell({ k, v }: { k: string; v: string }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
    }}>
      <div style={{
        fontSize: 9, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.12em', marginBottom: 6,
      }}>
        {k}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
    </div>
  )
}

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: focused
      ? '1px solid rgba(139,92,246,0.5)'
      : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff', fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.15s ease',
  }
}
