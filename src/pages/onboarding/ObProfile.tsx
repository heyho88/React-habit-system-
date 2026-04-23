import { useRef, useState } from 'react';
import { useAppStore } from '../../store/appStore';

const ObProfile = () => {
  const { setScreen, setObDisplayName, setObBio, setObAvatar, obAvatar, obDisplayName, obBio } = useAppStore();
  const [nameFocus, setNameFocus] = useState(false);
  const [bioFocus, setBioFocus] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setObAvatar(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(f);
  }

  return (
    <>
      {/* 메인 그리드 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        alignItems: 'start', flex: 1,
      }}>
          {/* 좌측 */}
          <div>
            <div style={{
              fontSize: 10, fontFamily: 'monospace', color: '#8B5CF6',
              letterSpacing: '0.15em', marginBottom: 24,
            }}>
              STEP 03 : PROFILE SETUP
            </div>

            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: 'white' }}>
              당신의{' '}
              <span style={{
                background: 'linear-gradient(90deg,#E040FB,#6C5CE7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>정체성을</span>
              <br />
              정의하는 시간입니다.
            </div>

            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32,
            }}>
              SLOO는 당신의 현재를 데이터화하고, 미래의 가능성을 설계합니다. 가장 먼저, 시스템에 등록될 당신의 프로필을 완성해 주세요.
            </div>

            {/* INFO 카드 */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D2D3' }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SYSTEM READY</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>보안 등급:</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>L3 Biometric Access</div>
            </div>
          </div>

          {/* 우측 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* 아바타 업로드 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 96, height: 96, borderRadius: '50%',
                  border: obAvatar ? '1.5px solid rgba(139,92,246,0.5)' : '1.5px dashed rgba(255,255,255,0.25)',
                  background: obAvatar ? `center/cover no-repeat url(${obAvatar})` : 'rgba(255,255,255,0.03)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden',
                }}
              >
                {!obAvatar && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="18" width="18" height="1.5" rx="0.75" fill="rgba(255,255,255,0.15)"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                {obAvatar ? 'CHANGE AVATAR' : 'UPLOAD AVATAR'}
              </span>
            </div>

            {/* DISPLAY NAME */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 8 }}>
                DISPLAY NAME
              </div>
              <input
                type="text"
                placeholder="당신의 이름을 입력하세요"
                value={obDisplayName}
                onChange={(e) => setObDisplayName(e.target.value)}
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: nameFocus ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* PERSONAL BIO */}
            <div>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 8 }}>
                PERSONAL BIO
              </div>
              <textarea
                placeholder="당신의 비전이나 현재의 목표를 간단히 공유해 주세요"
                value={obBio}
                onChange={(e) => setObBio(e.target.value)}
                onFocus={() => setBioFocus(true)}
                onBlur={() => setBioFocus(false)}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: bioFocus ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: 'white', fontSize: 14,
                  outline: 'none', resize: 'none', height: 120,
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, marginTop: 40 }}>
        <button
          onClick={() => setScreen('ob-step2')}
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          이전 단계로
        </button>
        <button
          onClick={() => setScreen('ob-complete')}
          style={{
            background: 'white', color: '#050505',
            borderRadius: 50, padding: '14px 32px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none',
          }}
        >
          다음 단계: 시스템 시작 →
        </button>
      </div>
    </>
  );
};

export default ObProfile;
