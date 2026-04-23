// ─────────────────────────────────────────────
// DOCTRINE — SLOO 내부에서 쓴 에세이 (long-form)
// ─────────────────────────────────────────────

export interface DoctrineEntry {
  id: string
  number: string   // e.g. '#001'
  date: string     // 'YYYY.MM'
  title: string
  subtitle?: string
  readMin: number
  excerpt: string
  body: string[]   // paragraphs
}

export const DOCTRINE_ENTRIES: DoctrineEntry[] = [
  {
    id: 'compound-doctrine',
    number: '#001',
    date: '2026.01',
    title: 'The Compound Doctrine',
    subtitle: '왜 의지력이 아닌 시스템인가',
    readMin: 6,
    excerpt: '의지력은 유한한 자원이다. 매일 닳는다. 시스템은 다르다. 한번 세우면 의지 없이 작동한다. SLOO는 의지에 기대지 않는다.',
    body: [
      '습관 앱 대부분은 의지력을 요구한다. "오늘 미션 완료하셨나요?" 하고 묻는다. 묻는 행위 자체가 의지력 소비다.',
      'SLOO는 다르게 설계됐다. L1 미션은 의지력이 필요하지 않을 만큼 작다. 2분. 그 이하. "시작"이라는 단어가 무겁게 느껴진다면 미션 설계가 잘못된 것이다.',
      '복리는 크기가 아니라 반복에 반응한다. 1.01^365 = 37.78. 1.10^30 = 17.45. 매일 1%가 매달 10%를 이긴다. 꾸준함이 강도보다 강하다.',
      '의지력은 신호다. 저항이 크다면 미션이 잘못 설계된 것이지 당신이 게으른 것이 아니다. 다시 설계하라. 저항이 0이 될 때까지.',
    ],
  },
  {
    id: 'physics-of-one',
    number: '#002',
    date: '2026.02',
    title: 'The 1% Physics',
    subtitle: '37.8배는 수학이지 믿음이 아니다',
    readMin: 8,
    excerpt: '"1%씩 나아지면 1년 뒤 37.8배가 된다." 많은 사람이 이 말을 동기부여 문구로 듣는다. 틀렸다. 이건 수학이다.',
    body: [
      '1.01을 365번 곱하면 37.7834이다. 이건 의견이 아니라 계산이다. 매일 1%씩 나아진다는 전제가 유지되면 결과는 수학적으로 결정된다.',
      '핵심은 "매일"이다. 주 5회, 월 20회가 아니라 365회. 휴식일도 미션이다. SLOO가 PASS 기록을 유지하는 이유다. 쉰 날도 시스템 안에 있다.',
      '반대도 성립한다. 0.99^365 = 0.0255. 매일 1%씩 나빠지면 1년 뒤 97.5% 사라진다. 우리가 "괜찮아 오늘 하루쯤"을 경계하는 이유다.',
      '37.8배라는 숫자는 목표가 아니다. 경로의 이름이다. 당신이 이 숫자에 도달하려고 할 때 실패한다. 매일의 1%에 집중할 때만 37.8배가 자동으로 온다.',
    ],
  },
  {
    id: 'resistance-signal',
    number: '#003',
    date: '2026.03',
    title: 'Resistance as Signal',
    subtitle: 'L1이 2분 이하여야 하는 이유',
    readMin: 5,
    excerpt: '저항은 나쁜 것이 아니다. 정보다. 저항이 크다면 당신이 약한 것이 아니라 미션이 큰 것이다.',
    body: [
      '"오늘은 하기 싫다"는 게으름이 아니라 피드백이다. 시스템이 당신에게 "이 레벨은 지금 당신에게 너무 크다"고 말하고 있다.',
      'SLOO의 L1은 누구에게나 2분 이하여야 한다. 걷기 2분. 책 한 페이지. 호흡 1분. 저항이 0에 가까운 진입점. 의지력의 도움 없이 시작되는 행동.',
      '레벨업은 시스템의 판단이다. 사용자가 아니라. 매일 같은 강도를 유지하면 다음 단계가 열린다. 당신이 준비되었다고 느낄 때가 아니라, 데이터가 준비되었을 때.',
      '이 설계는 잔혹하게 친절하다. 당신에게 선택의 여지를 주지 않는다. 오늘 해야 할 일은 이미 가장 작은 단위로 쪼개져 있다. 저항할 것이 없을 때까지.',
    ],
  },
]

// ─────────────────────────────────────────────
// COMPOUND LIBRARY — 외부 큐레이션 (SLOO를 만든 생각의 계보)
// ─────────────────────────────────────────────

export type LibraryKind = 'book' | 'essay' | 'talk'

export interface LibraryItem {
  id: string
  kind: LibraryKind
  title: string
  author: string
  year?: string
  note: string
  url?: string
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  // BOOKS
  { id: 'atomic-habits',   kind: 'book',  title: 'Atomic Habits',     author: 'James Clear',      year: '2018',
    note: '우리 L1 = 2분 룰의 원형. "2분 법칙"과 "정체성 기반 습관"이 SLOO의 진입 설계에 직접 영향을 줬다.' },
  { id: 'deep-work',       kind: 'book',  title: 'Deep Work',         author: 'Cal Newport',      year: '2016',
    note: 'Digital 카테고리의 철학적 토대. 집중은 재능이 아니라 훈련된 시스템이라는 관점.' },
  { id: 'tiny-habits',     kind: 'book',  title: 'Tiny Habits',       author: 'BJ Fogg',          year: '2019',
    note: '저항 제거가 의지보다 중요하다. 행동 설계(B=MAP) 모델이 우리 레벨 시스템의 뼈대다.' },
  { id: 'power-of-habit',  kind: 'book',  title: 'The Power of Habit', author: 'Charles Duhigg',   year: '2012',
    note: '습관 루프(cue–routine–reward)를 일반 독자에게 번역한 책. Reading 카테고리 입문서로 권장.' },
  { id: 'compound-effect', kind: 'book',  title: 'The Compound Effect', author: 'Darren Hardy',   year: '2010',
    note: 'Compound Lab의 정서적 원형. 작은 선택이 쌓이는 물리학을 자기계발 언어로 옮겼다.' },

  // ESSAYS
  { id: 'pg-superlinear',  kind: 'essay', title: 'Superlinear Returns', author: 'Paul Graham',    year: '2023',
    note: '보상이 선형이 아닐 때 세상이 어떻게 작동하는가. 복리가 특수한 사례가 아니라는 논증.',
    url: 'https://paulgraham.com/superlinear.html' },
  { id: 'pg-greatwork',    kind: 'essay', title: 'How to Do Great Work', author: 'Paul Graham',   year: '2023',
    note: '꾸준함이 재능을 이기는 메커니즘. 매일의 작은 일이 어떻게 큰 결과로 변하는지.',
    url: 'https://paulgraham.com/greatwork.html' },
  { id: 'pg-schlep',       kind: 'essay', title: 'Schlep Blindness',    author: 'Paul Graham',    year: '2012',
    note: '지루하고 반복적인 일이 실제로 가장 가치 있다는 역설. 매일 1%의 정치경제학.',
    url: 'https://paulgraham.com/schlep.html' },
  { id: 'pg-genius',       kind: 'essay', title: 'The Bus Ticket Theory of Genius', author: 'Paul Graham', year: '2019',
    note: '집착적 반복이 재능을 만든다. SLOO가 "강도"가 아니라 "간격"을 추적하는 이유.',
    url: 'https://paulgraham.com/genius.html' },

  // TALKS
  { id: 'ted-fogg',        kind: 'talk',  title: 'Forget Big Change, Start with a Tiny Habit', author: 'BJ Fogg', year: 'TEDx 2012',
    note: '9분. 행동 설계를 가장 빠르게 이해할 수 있는 입문. 2분 룰의 심리학적 근거.',
    url: 'https://www.youtube.com/watch?v=AdKUJxjn-R8' },
  { id: 'clear-habits',    kind: 'talk',  title: 'How to Build Good Habits & Break Bad Ones', author: 'James Clear', year: '2019',
    note: '책 핵심을 45분에 압축. 4법칙 모델이 우리 온보딩 플로우에 반영됐다.' },
  { id: 'huberman-dopamine', kind: 'talk', title: 'Controlling Your Dopamine', author: 'Andrew Huberman', year: '2021',
    note: '도파민을 기저선으로 이해하는 신경과학. 보상 설계 없이 복리가 가능한 이유.' },
]
