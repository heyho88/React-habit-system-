import { useAppStore } from '../../store/appStore';

const ObStep2 = () => {
  const { setScreen } = useAppStore();

  return (
    <>
      {/* 중앙 콘텐츠 */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 11, fontFamily: 'monospace', color: '#8B5CF6',
          letterSpacing: '0.15em', marginBottom: 24,
        }}>
          STEP 02 : COMING SOON
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>
          🚧
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 12 }}>
          준비 중입니다
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 400 }}>
          2단계 기능을 열심히 개발 중입니다.<br />
          지금은 다음 단계로 바로 이동합니다.
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, marginTop: 40 }}>
        <button onClick={() => setScreen('ob-profile')} style={{
          background: 'white', color: '#050505',
          borderRadius: 50, padding: '14px 32px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none',
        }}>
          다음 단계 →
        </button>
      </div>
    </>
  );
};

export default ObStep2;
