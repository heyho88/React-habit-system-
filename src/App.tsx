import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">

      {/* Nav */}
      <nav className="fixed top-8 z-50 glass-panel px-6 py-3 flex items-center gap-8 border-white/5 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]"></div>
          <span className="font-bold tracking-tighter text-lg">ONEPERCENT</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10"></div>
        <div className="flex gap-6 text-sm font-medium text-white/50">
          <a href="#" className="hover:text-white transition-colors">Missions</a>
          <a href="#" className="hover:text-white transition-colors">Compound Lab</a>
          <a href="#" className="hover:text-white transition-colors">Archive</a>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl w-full mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left: Copy */}
        <div className="lg:col-span-6 z-10">
          <div className="flex items-center mb-6">
            <span className="level-badge">SYSTEM VERSION 2.4.0</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
            작심삼일이<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">작심 365일</span>이<br />
            되는 방법.
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-md leading-relaxed">
            매일 <span className="text-white font-semibold">1%의 성장</span>은 1년 뒤 <span className="text-white font-semibold">37.8배</span>의 결과가 됩니다. 의지력이 아닌 설계된 레벨 미션으로 당신의 습관을 스택하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="cta-button w-full sm:w-auto">지금 무료로 시작하기</button>
            <div className="flex flex-col">
              <span className="data-label text-white/30 italic">Currently Tracking</span>
              <span className="text-sm font-mono text-white/80">Founding User 50명 모집 중</span>
            </div>
          </div>
        </div>

        {/* Right: Visual Card */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <div className="prismatic-frame w-full aspect-square max-w-[500px]">
            <div className="inner-content flex flex-col items-center justify-center p-8">

              <svg className="growth-curve-svg" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 0 }} />
                    <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M0,180 Q100,175 200,140 T400,20" fill="none" stroke="url(#curveGradient)" strokeWidth="4" strokeDasharray="1000" strokeDashoffset="1000">
                  <animate attributeName="strokeDashoffset" from="1000" to="0" dur="3s" fill="freeze" />
                </path>
              </svg>

              <div className="relative z-10 text-center">
                <div className="data-label mb-2">Compound Multiplier</div>
                <div className="text-8xl font-black tracking-tighter mb-2 tabular-nums">37.8<span className="text-4xl">x</span></div>
                <div className="flex items-center justify-center gap-2">
                  <span className="glowing-dot"></span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">Growth Calibrated</span>
                </div>
              </div>

              <div className="absolute top-8 left-8 flex flex-col gap-1">
                <span className="data-label">Mission: Active</span>
                <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[65%]"></div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 text-right">
                <span className="data-label">Efficiency</span>
                <div className="text-2xl font-bold font-mono">+1.00%</div>
              </div>
            </div>
          </div>

          <div className="absolute -z-10 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.1),transparent_70%)]"></div>
        </div>
      </main>

      {/* Problem Section */}
      <section className="max-w-6xl w-full mt-32 mb-24">
        <div className="text-center mb-16">
          <span className="data-label mb-4 block">Problem</span>
          <h2 className="text-4xl lg:text-5xl font-bold">혹시 이런 경험, 있지 않으셨나요?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 flex flex-col">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
              <span className="text-rose-400 font-bold text-xl">①</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">87%가 3일 만에 포기합니다</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              "이번엔 진짜 해야지" 하고 시작한 운동, 독서, 명상. 평균 2.7일 만에 멈춥니다. 문제는 의지력이 아니라 <span className="text-white font-semibold">시작점이 너무 높았던 것</span>입니다.
            </p>
          </div>

          <div className="glass-panel p-8 flex flex-col">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <span className="text-violet-400 font-bold text-xl">②</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">성장하고 있다는 실감이 0%</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              매일 했는데 달라진 게 뭔지 모르겠다. 눈에 보이는 변화가 없으면 뇌는 <span className="text-white font-semibold">"그만해도 돼"</span>라는 신호를 보냅니다.
            </p>
          </div>

          <div className="glass-panel p-8 flex flex-col">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
              <span className="text-orange-400 font-bold text-xl">③</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">한 번 실패하면 100% 포기</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              하루 빠졌을 뿐인데 "나는 안 되는 사람"이라고 결론 짓습니다. <span className="text-white font-semibold">완벽주의가 습관의 가장 큰 적</span>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl w-full mt-32 mb-24">
        <div className="text-center mb-16">
          <span className="data-label mb-4 block">Services</span>
          <h2 className="text-4xl lg:text-5xl font-bold">우리는 이렇게 해결합니다</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Mission System */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 blur-[80px] -z-10"></div>
            <span className="level-badge mb-4 inline-block">Mission System</span>
            <h3 className="text-xl font-bold mb-4">레벨 기반 미션 시스템</h3>
            <blockquote className="text-white/60 text-sm italic mb-6 border-l-2 border-rose-400/30 pl-4">
              "뭘 해야 할지 모르겠어요" → 오늘 할 일이 1개, 딱 정해져 있습니다
            </blockquote>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-white/50 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                레벨 1: 물 한 잔 마시기 (30초)
              </li>
              <li className="text-sm text-white/50 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                레벨 5: 아침 루틴 3가지 완료 (15분)
              </li>
              <li className="text-sm text-white/50 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                레벨 12: 나만의 습관 스택 운영 (45분)
              </li>
            </ul>
            <p className="text-xs text-white/40 mb-4">단계가 너무 작아서 실패할 수가 없습니다.</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">94%</span>
              <span className="text-xs text-white/40">7일 연속 완료율<br />실제 유저 데이터</span>
            </div>
          </div>

          {/* Growth Dashboard */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-violet-500/5 blur-[80px] -z-10"></div>
            <span className="level-badge mb-4 inline-block" style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)' }}>Growth Dashboard</span>
            <h3 className="text-xl font-bold mb-4">복리 성장 추적 대시보드</h3>
            <blockquote className="text-white/60 text-sm italic mb-6 border-l-2 border-violet-400/30 pl-4">
              "성장하고 있는 건 맞나요?" → 숫자로 보여드립니다
            </blockquote>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-right min-w-[50px]">
                  <div className="text-[10px] text-white/30">30일</div>
                  <div className="text-base font-bold text-white">34.8%</div>
                </div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-400 to-rose-400 w-[35%]"></div>
                </div>
                <span className="text-xs text-white/40">체감 가능</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right min-w-[50px]">
                  <div className="text-[10px] text-white/30">90일</div>
                  <div className="text-base font-bold text-white">145%</div>
                </div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-400 to-rose-400 w-[65%]"></div>
                </div>
                <span className="text-xs text-white/40">습관 자동화</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right min-w-[50px]">
                  <div className="text-[10px] text-white/30">365일</div>
                  <div className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">3,778%</div>
                </div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-400 to-rose-400 w-full"></div>
                </div>
                <span className="text-xs text-white/40">완전히 다른 사람</span>
              </div>
            </div>
            <p className="text-xs text-white/40">꺾이지 않는 성장 곡선을 눈으로 확인하세요.</p>
          </div>

          {/* Growth / Maintain */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -z-10"></div>
            <span className="level-badge mb-4 inline-block" style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' }}>Growth / Maintain</span>
            <h3 className="text-xl font-bold mb-4">성장 / 유지 선택 시스템</h3>
            <blockquote className="text-white/60 text-sm italic mb-6 border-l-2 border-emerald-400/30 pl-4">
              "하루 빠졌는데 다 망한 것 같아요" → 아닙니다. 유지도 전략입니다
            </blockquote>
            <ul className="space-y-3 mb-6">
              <li className="text-sm text-white/50">
                <span className="text-white font-semibold">컨디션 좋은 날</span> → <span className="text-emerald-400">성장 모드</span>: 다음 레벨 미션 도전
              </li>
              <li className="text-sm text-white/50">
                <span className="text-white font-semibold">바쁘거나 지친 날</span> → <span className="text-blue-400">유지 모드</span>: 현재 레벨 미션만 반복
              </li>
              <li className="text-sm text-white/50">
                연속 기록이 끊겨도 레벨은 <span className="text-white font-semibold">보존됩니다</span>
              </li>
            </ul>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">4.2x</span>
              <span className="text-xs text-white/40">30일 이상 지속률<br />포기 대신 유지</span>
            </div>
          </div>

          {/* Micro Achievement */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 blur-[80px] -z-10"></div>
            <span className="level-badge mb-4 inline-block" style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)' }}>Micro Achievement</span>
            <h3 className="text-xl font-bold mb-4">마이크로 성취 알림</h3>
            <blockquote className="text-white/60 text-sm italic mb-6 border-l-2 border-amber-400/30 pl-4">
              "매일 하는데 뭐가 달라졌는지 모르겠어요" → 매 순간 알려드립니다
            </blockquote>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs">🏆</span>
                </div>
                <span className="text-sm text-white/60">"7일 연속 달성! 상위 12%입니다"</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 text-xs">📈</span>
                </div>
                <span className="text-sm text-white/60">"레벨 3 도달. 시작한 사람 중 68%가 여기서 멈추지만, 당신은 계속 가고 있습니다"</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs">✨</span>
                </div>
                <span className="text-sm text-white/60">작은 성취가 쌓여야 큰 습관이 됩니다</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="max-w-6xl w-full mt-32 mb-24">
        <div className="text-center mb-16">
          <span className="data-label mb-4 block">Social Proof</span>
          <h2 className="text-4xl lg:text-5xl font-bold">왜 지금 시작해야 할까요?</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Compound Table */}
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold mb-6">매일 1%의 복리 효과, 숫자가 증명합니다</h3>
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 text-white/40 font-medium">기간</th>
                    <th className="text-center py-3 px-2 text-emerald-400 font-medium">매일 1% 성장</th>
                    <th className="text-center py-3 px-2 text-rose-400 font-medium">매일 1% 후퇴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 text-white/60">30일</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-semibold">1.35배</td>
                    <td className="py-3 px-2 text-center text-rose-400 font-semibold">0.74배</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 text-white/60">90일</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-semibold">2.45배</td>
                    <td className="py-3 px-2 text-center text-rose-400 font-semibold">0.41배</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 text-white/60">180일</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-semibold">6.0배</td>
                    <td className="py-3 px-2 text-center text-rose-400 font-semibold">0.16배</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-white font-semibold">365일</td>
                    <td className="py-3 px-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 font-bold text-lg">37.8배</td>
                    <td className="py-3 px-2 text-center text-rose-400 font-semibold">0.03배</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <blockquote className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400 mb-2">1년의 차이는 1,260배입니다.</blockquote>
              <p className="text-sm text-white/50">시작이 하루 늦어질수록, 이 격차는 벌어집니다.</p>
            </div>
          </div>

          {/* Science */}
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold mb-6">"작은 습관"의 과학적 근거</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 text-xs font-bold">01</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">런던 대학 연구</span>
                  <p className="text-sm text-white/70 mt-1">새로운 행동이 자동화되려면 평균 <span className="text-white font-semibold">66일</span>이 필요합니다</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-rose-400 text-xs font-bold">02</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">스탠포드 BJ Fogg 교수</span>
                  <p className="text-sm text-white/70 mt-1">습관의 크기를 줄일수록 <span className="text-white font-semibold">성공률은 올라갑니다</span></p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs font-bold">03</span>
                </div>
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">복리 공식</span>
                  <p className="text-sm text-white/70 mt-1">(1.01)^365 = 37.78: 매일 1%는 <span className="text-white font-semibold">수학적으로 검증된 성장 전략</span>입니다</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60">SLOO는 이 연구들을 하나의 시스템으로 만들었습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl w-full mt-32 mb-24">
        <div className="text-center mb-16">
          <span className="data-label mb-4 block">CTA</span>
          <h2 className="text-4xl lg:text-5xl font-bold">Founding User를 모집합니다</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="glass-panel p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4">지금 시작하는 50명에게, 평생 무료를 드립니다.</h3>
              <p className="text-white/50 mb-6">
                SLOO는 지금 가장 초기 단계입니다. 정식 출시 전, 함께 서비스를 만들어갈 <span className="text-white font-semibold">Founding User 50명</span>을 찾고 있습니다.
              </p>
            </div>
            <div className="mt-auto">
              <span className="data-label">현재 남은 자리</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">N</span>
                <span className="text-2xl text-white/40">/ 50</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-0 overflow-hidden">
            <div className="p-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 text-white/40 font-medium"></th>
                    <th className="text-center py-3 px-2 text-violet-400 font-medium">
                      Founding User<br />
                      <span className="text-[10px] font-normal text-white/50">(지금)</span>
                    </th>
                    <th className="text-center py-3 px-2 text-white/40 font-medium">
                      일반 가입<br />
                      <span className="text-[10px] font-normal text-white/50">(정식 출시 후)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-2 text-white/60 text-sm">가입비</td>
                    <td className="py-4 px-2 text-center text-emerald-400 font-bold">무료</td>
                    <td className="py-4 px-2 text-center text-white/40 text-sm">유료 전환 예정</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-2 text-white/60 text-sm">모든 기능 이용</td>
                    <td className="py-4 px-2 text-center text-emerald-400 font-bold">평생 무료</td>
                    <td className="py-4 px-2 text-center text-white/40 text-sm">유료 플랜 적용</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-2 text-white/60 text-sm">신규 유료 기능</td>
                    <td className="py-4 px-2 text-center text-emerald-400 font-bold">평생 무료 제공</td>
                    <td className="py-4 px-2 text-center text-white/40 text-sm">별도 결제</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2 text-white/60 text-sm">모집 인원</td>
                    <td className="py-4 px-2 text-center text-rose-400 font-bold">50명 한정</td>
                    <td className="py-4 px-2 text-center text-white/40 text-sm">제한 없음</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-white/10 bg-white/[0.02]">
              <button className="cta-button w-full">Founding User로 시작하기</button>
              <p className="text-center text-xs text-white/40 mt-4">카드 등록 없음 · 평생 무료 · 50명 마감 시 종료</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-white/40 italic">
            Founding User는 단순한 얼리어답터가 아닙니다. SLOO의 첫 번째 성장 기록을 함께 쓰는 사람들입니다.
          </p>
        </div>
      </section>

      {/* Level Missions Section */}
      <section className="max-w-6xl w-full mt-24 mb-32">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-2">Level Missions</h2>
            <div className="text-2xl font-bold">Select Your Focus Area</div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
            </div>
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start gap-4">
          {[
            { src: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80&w=200', alt: 'Body', label: 'BODY', level: 'LEVEL 12', hoverColor: 'group-hover:text-rose-400' },
            { src: 'https://images.unsplash.com/photo-1518005020951-ecc8f0203f6c?auto=format&fit=crop&q=80&w=200', alt: 'Mind', label: 'MIND', level: 'LEVEL 08', hoverColor: 'group-hover:text-violet-400' },
            { src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=200', alt: 'Craft', label: 'CRAFT', level: 'LEVEL 24', hoverColor: 'group-hover:text-emerald-400' },
            { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200', alt: 'Future', label: 'VISION', level: 'LEVEL 02', hoverColor: 'group-hover:text-blue-400' },
            { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200', alt: 'Social', label: 'SOCIAL', level: 'LEVEL 19', hoverColor: 'group-hover:text-orange-400' },
            { src: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=200', alt: 'Spirit', label: 'SPIRIT', level: 'LEVEL 05', hoverColor: 'group-hover:text-amber-400' },
          ].map((orb) => (
            <div key={orb.label} className="flex flex-col items-center gap-4 group">
              <div className="orb">
                <img src={orb.src} alt={orb.alt} />
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold ${orb.hoverColor} transition-colors`}>{orb.label}</div>
                <div className="data-label text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">{orb.level}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl flex justify-between items-end pb-12 border-t border-white/5 pt-12">
        <div className="flex gap-12">
          <div>
            <span className="data-label">Global Status</span>
            <div className="text-xs font-mono text-emerald-400 mt-1">ONLINE / SYNCED</div>
          </div>
          <div>
            <span className="data-label">Mission Uplink</span>
            <div className="text-xs font-mono text-white/60 mt-1">DE-2884-001</div>
          </div>
        </div>
        <div className="text-right">
          <span className="data-label text-[9px] mb-2 block">Beta Access - Compound Engine v.01</span>
          <div className="text-[10px] text-white/20">© 2026 ONEPERCENT LABORATORIES. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>

      {/* Background orbs */}
      <div className="fixed top-[20%] right-[-5%] w-96 h-96 bg-violet-600/10 blur-[150px] -z-20"></div>
      <div className="fixed bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-rose-600/10 blur-[180px] -z-20"></div>
    </div>
  )
}
