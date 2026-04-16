import { useAppStore } from '../../store/appStore';

const ObStep2 = () => {
  const { setScreen } = useAppStore();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#050505',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      {/* 상단 네비 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', zIndex: 10,
      }}>
        <span style={{fontSize:14, fontWeight:700, color:'white'}}>● SLOO</span>
        <span style={{fontSize:10, fontFamily:'monospace', color:'rgba(255,255,255,0.3)'}}>ONBOARDING V1.0</span>
      </div>

      {/* 카드 컨테이너 */}
      <div style={{
        width: '100%', maxWidth: '900px',
        minHeight: '580px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 48px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* 진행바 - 2번 활성 */}
        <div style={{display:'flex', gap:8, marginBottom:48}}>
          <div style={{height:3, borderRadius:2, flex:1, background:'rgba(255,255,255,0.15)'}}/>
          <div style={{height:3, borderRadius:2, flex:1, background:'linear-gradient(90deg,#E040FB,#6C5CE7)'}}/>
          <div style={{height:3, borderRadius:2, flex:1, background:'rgba(255,255,255,0.15)'}}/>
        </div>

        {/* 중앙 콘텐츠 */}
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', textAlign:'center',
        }}>
          <div style={{
            fontSize:11, fontFamily:'monospace', color:'#8B5CF6',
            letterSpacing:'0.15em', marginBottom:24,
          }}>
            STEP 02 : COMING SOON
          </div>
          <div style={{fontSize:32, fontWeight:800, color:'white', marginBottom:16}}>
            🚧
          </div>
          <div style={{fontSize:20, fontWeight:700, color:'white', marginBottom:12}}>
            준비 중입니다
          </div>
          <div style={{fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.6, maxWidth:400}}>
            2단계 기능을 열심히 개발 중입니다.<br/>
            지금은 다음 단계로 바로 이동합니다.
          </div>
        </div>

        {/* 하단 버튼 */}
        <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center', gap:24, marginTop:40}}>
          <button onClick={() => setScreen('ob-profile')} style={{
            background:'white', color:'#050505',
            borderRadius:50, padding:'14px 32px',
            fontSize:14, fontWeight:700, cursor:'pointer', border:'none',
          }}>
            다음 단계 →
          </button>
        </div>
      </div>

      {/* 푸터 */}
      <div style={{display:'flex', gap:48, justifyContent:'center', marginTop:24}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:8, fontFamily:'monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.1em'}}>DATA PRIVACY</div>
          <div style={{fontSize:9, color:'rgba(255,255,255,0.2)'}}>AES-256 ENCRYPTED</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:8, fontFamily:'monospace', color:'rgba(255,255,255,0.25)', letterSpacing:'0.1em'}}>NETWORK</div>
          <div style={{fontSize:9, color:'rgba(255,255,255,0.2)'}}>SYSTEM READY</div>
        </div>
      </div>
    </div>
  );
};

export default ObStep2;
