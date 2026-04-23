export default function FounderNote() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        position: 'relative',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: '40px 44px 44px',
      }}>
        {/* 1px hairline accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 48, height: 1,
          background: '#8b5cf6',
        }} />

        <div style={{
          fontSize: 10, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
          marginBottom: 24, fontWeight: 700, textTransform: 'uppercase',
        }}>
          FOUNDER NOTE — FROM THE MAKER OF SLOO
        </div>

        <div style={{
          fontSize: 18, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em', marginBottom: 22, lineHeight: 1.4,
        }}>
          Architect께,
        </div>

        <div style={{
          fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.85)',
        }}>
          <p style={{ margin: '0 0 18px' }}>
            저도 작심삼일을 37번쯤 반복했습니다.
            헬스장 회원권은 매년 1월에 끊었고, 독서 계획은 3일째 멈췄고,
            수면 시간은 매번 새해가 지나면 흐트러졌습니다.
            실패할 때마다 "의지가 약해서"라고 스스로를 탓했지만,
            어느 순간 그 해석이 틀렸다는 것을 알게 됐습니다.
          </p>
          <p style={{ margin: '0 0 18px' }}>
            문제는 의지가 아니라 <b style={{ color: '#fff', fontWeight: 700 }}>설계</b>였습니다.
            매일 "1시간 운동"을 목표로 삼는 사람과,
            매일 "1분 운동"을 목표로 삼는 사람은 다른 인생을 삽니다.
            전자는 5일 내 무너지고, 후자는 1년 뒤 시스템이 됩니다.
            SLOO는 후자를 위한 설계입니다.
          </p>
          <p style={{ margin: 0 }}>
            Founding User 50명을 찾고 있습니다.
            함께 첫 1년의 궤적을 그릴 사람들. 평생 무료.
            이 숫자가 메워지면 모집은 닫힙니다.
            이 글이 당신의 타이밍이길 바랍니다.
          </p>
        </div>

        <div style={{
          marginTop: 32, paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontSize: 13, color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic',
          }}>
            — SLOO를 만든 사람
          </div>
          <div style={{
            fontSize: 9, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em',
          }}>
            SIGNED · {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  )
}
