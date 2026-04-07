export type ExerciseType =
  | 'gym'
  | 'hometraining'
  | 'walking'
  | 'sleep'
  | 'morning'
  | 'evening'
  | 'space'
  | 'digital'
  | 'mental'
  | 'reading'

export type EnergyKey =
  | 'low-low'
  | 'low-mid'
  | 'low-high'
  | 'mid-low'
  | 'mid-mid'
  | 'mid-high'
  | 'high-low'
  | 'high-mid'
  | 'high-high'

export type CategoryKey = 'health' | 'sleep' | 'routine'

export type RoutineType = 'morning' | 'evening' | 'space' | 'digital' | 'mental' | 'reading'

export interface CatMetaItem {
  label: string
  icon: string
}

export const MISSIONS: Record<ExerciseType, string[]> = {
  gym: [
    '운동복만 갈아입기',
    '운동복 입고 현관까지',
    '집 근처 5분 산책',
    '헬스장 입구까지만',
    '헬스장 들어가서 15분',
    '헬스장 30분',
    '헬스장 1시간',
  ],
  hometraining: [
    '운동복만 갈아입기',
    '매트 꺼내서 펼치기',
    '스트레칭 3분',
    '유튜브 홈트 영상 틀어놓기',
    '홈트 10분',
    '홈트 20분',
    '홈트 30분',
  ],
  walking: [
    '운동화 꺼내놓기',
    '운동복 입고 현관까지',
    '집 앞 5분 걷기',
    '동네 한 바퀴 (10분)',
    '20분 걷기',
    '30분 걷기 or 10분 달리기',
    '5km',
  ],
  sleep: [
    '오늘 취침 목표 시간 확인하기',
    '목표 시간 30분 전 눕기 준비 시작',
    '목표 시간에 눕기',
    '목표 시간 -5분에 눕기',
    '목표 시간 3일 연속 지키기',
    '목표 시간 5일 연속 지키기',
    '목표 시간 7일 연속 지키기',
  ],
  morning: [
    '물 한 잔 마시기',
    '물 한 잔 + 커튼 or 창문 열기',
    '물 한 잔 + 커튼 or 창문 열기 + 1분 스트레칭',
    '물 한 잔 + 커튼 or 창문 열기 + 3분 스트레칭',
    '물 한 잔 + 커튼 or 창문 열기 + 5분 스트레칭',
    '물 한 잔 + 커튼 or 창문 열기 + 5분 스트레칭 + 오늘 할 일 1개 적기',
    '물 한 잔 + 커튼 or 창문 열기 + 10분 스트레칭 + 오늘 할 일 3개 적기',
  ],
  evening: [
    '자기 전 오늘 하루 감사한 것 1가지 떠올리기',
    '감사일기 1줄 적기',
    '감사일기 2줄 적기',
    '감사일기 3줄 적기',
    '감사일기 3줄 + 플래너 준비하기',
    '감사일기 3줄 + 플래너에 내일 할 일 1개 적기',
    '감사일기 3줄 + 플래너에 내일 할 일 1개 적기 + 침대에서 핸드폰 하지 않기',
  ],
  space: [
    '오늘 쓴 물건 1개 제자리에 놓기',
    '오늘 쓴 물건 전부 제자리에 놓기',
    '책상 위 물건 전부 제자리에 놓기',
    '책상 + 침대 주변 정리하기',
    '방 바닥에 아무것도 없는 상태 만들기',
    '자기 전 방 전체 5분 정리하기',
    '자기 전 방 둘러보고 제자리 아닌 물건 없는지 확인하기',
  ],
  digital: [
    '공부or작업 시작할 때 핸드폰 10분 안 보이는 곳에 두기',
    '공부or작업 시작할 때 핸드폰 20분 안 보이는 곳에 두기',
    '공부or작업 시작할 때 핸드폰 30분 안 보이는 곳에 두기',
    '공부or작업 시작할 때 핸드폰 45분 안 보이는 곳에 두기',
    '공부or작업 시작할 때 핸드폰 1시간 안 보이는 곳에 두기',
    '공부or작업 시작할 때 핸드폰 1시간 30분 안 보이는 곳에 두기',
    '공부or작업 시작할 때 핸드폰 2시간 안 보이는 곳에 두고 집중하기',
  ],
  mental: [
    '호흡 코로 들이쉬고 입으로 내쉬기 3번',
    '호흡 4초 들이쉬고 4초 내쉬기 5번',
    '호흡 4초 들이쉬고 4초 내쉬기 10번 (약 1분 30초)',
    '3분 동안 호흡에만 집중하기',
    '5분 명상',
    '7분 명상',
    '매일 같은 시간에 10분 명상하기',
  ],
  reading: [
    '책 펴서 1페이지 읽기',
    '5분 독서',
    '10분 독서',
    '15분 독서',
    '20분 독서',
    '25분 독서',
    '30분 독서',
  ],
}

export const ENERGY_MISSIONS: Record<EnergyKey, string> = {
  'low-low':   '창문 열고 바깥 1분 바라보기',
  'low-mid':   '물 한 잔 천천히 마시기',
  'low-high':  '오늘 딱 한 가지만 적어보기',
  'mid-low':   '5분 산책 또는 스트레칭',
  'mid-mid':   '가장 중요한 일 25분 집중',
  'mid-high':  '오늘 배운 것 3줄 기록',
  'high-low':  '몸 먼저 — 10분 가볍게 움직이기',
  'high-mid':  '가장 미뤄온 일 시작하기',
  'high-high': '새로운 루틴 하나 추가해보기',
}

export const EMPATHY_MSGS: string[] = [
  '며칠 잘 하다 무너졌어도 괜찮아요. 오늘 이 미션 하나면 1%예요.',
  '하루가 아무리 바빠도 이 미션은 30초예요. 그게 오늘의 1%예요.',
  '오늘 하루가 망했어도 괜찮아요. 이 미션 하나로 1%는 지켜요.',
  '귀찮은 하루가 맞아요. 그래도 이것만. 30초면 돼요.',
]

export const MAINTAIN_MSGS: Record<number, string> = {
  1: '잘 지키고 있어요. 이게 습관이 되는 거예요.',
  2: '이틀째예요. 흔들리지 않고 있어요.',
  3: '3일째 유지 중이에요. 이 정도면 진짜 잡힌 거예요.',
}

export const CAT_META: Record<CategoryKey, CatMetaItem> = {
  health:  { label: '운동/건강',     icon: '🏃' },
  sleep:   { label: '수면/기상',     icon: '😴' },
  routine: { label: '루틴/생활습관', icon: '📋' },
}

export const ROUTINE_TYPE_META: Record<RoutineType, CatMetaItem> = {
  morning: { label: '아침 루틴',     icon: '🌅' },
  evening: { label: '저녁 루틴',     icon: '🌙' },
  space:   { label: '정리정돈',      icon: '🏠' },
  digital: { label: '디지털 디톡스', icon: '📵' },
  mental:  { label: '멘탈관리',      icon: '🧘' },
  reading: { label: '독서',          icon: '📚' },
}
