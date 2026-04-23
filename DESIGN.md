# Design System — SLOO

## Product Context
- **What this is:** 습관/루틴 트래커. 매일 1%의 복리 성장을 자기 OS처럼 운영하게 돕는 앱.
- **Who it's for:** 진지한 self-improvement 유저. "Architect" 호칭으로 부름.
- **Space/industry:** Habit tracking (Streaks, Habitify, Finch 등)과 다른 자리 — data-driven self-improvement 방향 (Oura, Whoop 톤에 가까움).
- **Project type:** 웹 앱 (dashboard + 온보딩 + 미션 흐름) + 랜딩.

## Aesthetic Direction
- **Direction:** Self-OS Console — Industrial/Utilitarian + Retro-Futuristic 하이브리드.
- **Decoration level:** Intentional. 글로우 blur, 1px hairline accent, 실시간 클럭. 장식은 의미에만.
- **Mood:** 진지한 도구. 콘솔/터미널 감성 + 복리 ambition. 친근하지 않고 정교함.
- **Two overlapping personalities:**
  1. Engineering Console (`SYSTEM`, `MISSION`, `CALIBRATED`, v1.0-STABLE)
  2. Compound Ambition (37.8x 히어로, violet→pink "성장" 그라디언트)

## Typography
- **Display/Body:** Geist Sans. `font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Labels/Meta:** Geist Mono (추천) 또는 JetBrains Mono. 현재 코드는 `fontFamily: 'monospace'`로만 되어 있어 지정 필요.
- **Loading:** 아직 self-host. Geist / Geist Mono는 Vercel CDN 또는 Bunny Fonts에서.
- **Weight roles:**
  - Display numbers (hero stat): 800
  - Section titles (h1, h2): 700–800
  - Body: 400
  - Emphasis in body: 700
  - Meta labels: 600–700
- **Modular scale (rem, base 16px):**
  | Token | px | rem | Usage |
  |-------|----|----|-------|
  | display-xl | 62–68 | 3.9–4.25 | Landing hero, compound multiplier |
  | display-lg | 48 | 3.0 | Momentum streak |
  | display-md | 32 | 2.0 | Dashboard h1 |
  | display-sm | 24–28 | 1.5–1.75 | Card titles |
  | text-lg | 18 | 1.125 | Large label values |
  | text-md | 15–16 | 0.95–1.0 | Body copy |
  | text-sm | 13 | 0.81 | Secondary body, buttons |
  | text-xs | 11–12 | 0.69–0.75 | Tertiary, captions |
  | mono-sm | 10–11 | 0.63–0.69 | Meta labels (uppercase) |
  | mono-xs | 8–9 | 0.5–0.56 | Smallest meta (timestamps, codes) |
- **Tracking rules:**
  - Display headings: `letter-spacing: -0.02em to -0.04em` (tight)
  - Mono uppercase labels: `letter-spacing: 0.1em to 0.15em` (wide)
  - Body: default
- **Mono label pattern (signature):** `font-family: mono; font-size: 9–11px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3–0.5)`. 이 조합이 SLOO의 브랜드 shorthand. 라벨, 섹션 헤더, 상태 배지에 일관 적용.

## Color

### Approach
Balanced. 중립(다크 neutrals)이 95%를 차지하고, 컬러는 의미 있는 위치에만. **Compound gradient (violet→pink→orange)는 "성장/복리/성공" 맥락에만 쓰는 규칙.** 무분별 사용 금지.

### Base / Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| bg-base | `#050505` | 앱 전체 배경 (거의 순흑) |
| bg-elevated | `#080808` | 상위 카드 배경 (히어로 카드, ObStepsShell) |
| surface-1 | `rgba(255,255,255,0.025)` | 기본 카드 |
| surface-2 | `rgba(255,255,255,0.04)` | 내부 중첩 카드, hover 일부 |
| surface-3 | `rgba(255,255,255,0.07)` | 버튼 secondary 배경 |
| border-subtle | `rgba(255,255,255,0.06)` | 기본 카드 border, 구분선 |
| border-default | `rgba(255,255,255,0.1)` | 강조된 border, nav |
| border-strong | `rgba(255,255,255,0.2)` | 아이콘 버튼, 얇은 pill |

**surface를 3단계로 고정.** 현재 코드의 0.025/0.03/0.04/0.06/0.07/0.08/0.10/0.12/0.15 9종은 이 3-4단계로 정리 대상.

### Text
| Token | Hex/rgba | Usage |
|-------|----------|-------|
| text-primary | `#ffffff` | 제목, 강조 |
| text-secondary | `rgba(255,255,255,0.7)` | 본문 |
| text-tertiary | `rgba(255,255,255,0.5)` | 보조 본문 |
| text-muted | `rgba(255,255,255,0.35)` | 라벨, 비활성 |
| text-faint | `rgba(255,255,255,0.2–0.25)` | 각주, disabled |

### Brand Spectrum (Compound Gradient)
성장/복리/성공 맥락 전용. 아무데나 쓰지 말 것.

| Token | Hex | Usage |
|-------|-----|-------|
| violet-primary | `#8b5cf6` | 메인 accent (로고 dot, glow, primary 링크) |
| violet-light | `#A78BFA` | 강조 수치 색상 (highlight 밀레스톤) |
| violet-soft | `#c4b5fd` | 배지 내 텍스트 (rgba 퍼플 배경 위) |
| violet-deep | `#4C1D95` | 그라디언트 끝점, 배경 곡선 |
| pink-primary | `#ec4899` | Compound gradient 중간점, flame 아이콘 |
| pink-light | `#f472b6` | Streak 숫자 그라디언트 시작 |
| orange-warm | `#fb923c` | Compound gradient 종점 (progress bar, streak) |

**Compound gradient 규칙:**
- `linear-gradient(135deg, #f472b6, #fb923c)` — streak/momentum (pink → orange)
- `linear-gradient(135deg, #a78bfa, #ec4899)` — progress ring (violet → pink)
- `linear-gradient(90deg, #8B5CF6, #C084FC, #E040FB, #F472B6)` — 히어로 텍스트 그라디언트 (4-stop)
- `linear-gradient(180deg, #a78bfa, #ec4899)` — 차트 바 (violet → pink, vertical)

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| success | `#34d399` (emerald-400) | Sync rate positive, "TRENDING UP" 배지 |
| info | `#00D2D3` (cyan-400) | 시스템 상태, ONLINE, version stable |
| warning | `#fb923c` (orange-400) | 경고 (compound orange와 겸용) |
| error | `#ff3355` | Mission 활성 라인, 실패 텍스트 |
| danger-alt | `#FF4444` / `#FF6B6B` | 위험 dot, volatility 표시 |

### Background Glows (Decoration)
두 개의 blur orb가 앱 전역에서 배경으로 돎.
```css
/* Top right — violet */
position: fixed; top: 15%; right: -10%;
width: 400px; height: 400px;
background: rgba(139,92,246,0.06);
filter: blur(120px); border-radius: 50%;

/* Bottom left — rose */
position: fixed; bottom: 10%; left: -10%;
width: 500px; height: 500px;
background: rgba(244,63,94,0.05);
filter: blur(150px); border-radius: 50%;
```

### Dark-mode-only
SLOO는 dark mode 전용. Light mode 현재 지원 안 함.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable (spacious하지 않음, 콘솔 톤)
- **Scale:**
  | Token | px | Usage |
  |-------|----|-------|
  | 2xs | 2 | hairline, 마이크로 gap |
  | xs | 4 | 아이콘/텍스트 gap |
  | sm | 8 | 버튼 내부 gap, 라벨 gap |
  | md | 16 | 카드 내 섹션 gap |
  | lg | 24 | 카드 padding, 섹션 내 큰 gap |
  | xl | 32 | 카드 사이 gap, 섹션 간격 |
  | 2xl | 48 | 페이지 내 주요 섹션 gap |
  | 3xl | 64 | 페이지 상단 padding, 큰 블록 간격 |
  | 4xl | 100 | Hero 패딩 top |

## Layout
- **Approach:** Hybrid. Dashboard/앱 내부는 grid-disciplined. Landing/onboarding은 creative-editorial 여지.
- **Max content width:**
  - Dashboard: 1200px
  - Landing: 1100px
  - Onboarding/mission: 420px (중앙 정렬 narrow)
- **Grid:**
  - Dashboard: `minmax(0, 2fr) minmax(0, 1fr)` 2x2
  - Landing hero: `1fr 1fr` (900px+), 모바일은 1fr
  - Landing categories: `repeat(6, 1fr)`
- **Sidebar:** 260px 고정 좌측 (메인 앱)
- **Border radius scale:**
  | Token | px | Usage |
  |-------|----|-------|
  | radius-xs | 2 | chart bar, hairline pill |
  | radius-sm | 6–8 | 작은 배지, 입력 |
  | radius-md | 10–12 | 일반 카드, 내부 버튼 |
  | radius-lg | 14–20 | 메인 카드, Directive row |
  | radius-pill | 40–50 | 버튼 (primary/secondary) |
  | radius-full | 999 | nav pill, 아이콘 원 |

### Mobile gate
`< 900px` viewport는 `DesktopOnlyNotice` 표시. `src/App.tsx` `useIsMobile` 훅으로 matchMedia 실시간 감지.

## Motion
- **Approach:** Intentional. 의미 있는 전환에만.
- **Easing:**
  - Enter: `ease-out`
  - Exit: `ease-in`
  - Move/hover: `ease` 또는 `ease-in-out`
- **Duration:**
  | Token | ms | Usage |
  |-------|----|-------|
  | micro | 150 | hover border-color, opacity |
  | short | 200 | nav transitions, 아이콘 색 |
  | medium | 450 | page enter (slide-up) |
  | long | 700 | mount fade+translate |
  | extra | 800 | progress ring stroke |
- **Patterns:**
  - Mount: `opacity 0→1 + translateY 32px→0` 0.7s
  - Page switch: `slide-up` 0.45s (`translateY(20px) → 0`, `opacity 0 → 1`)
  - Progress transitions: 0.8s stroke-dashoffset
  - Never-transition: layout shifts, font-size, font-family

## Signature Patterns (품질 체크리스트)

이 3가지가 SLOO를 SLOO로 만든다. UI 추가할 때 반드시 점검.

### 1. Mono uppercase label
라벨/섹션 헤더/상태 배지는 거의 전부 이 패턴.
```tsx
style={{
  fontSize: 10,
  fontFamily: 'monospace',
  color: 'rgba(255,255,255,0.45)',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
}}
```

### 2. Hero number (숫자 중심 hierarchy)
수치가 타이포그래피의 영웅. display-xl 사이즈 + 800wt + tight tracking.
```tsx
<span style={{ fontSize: 68, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}>
  37.8
</span>
<span style={{ fontSize: 26, color: 'rgba(255,255,255,0.5)' }}>x</span>
```

### 3. Compound gradient (성장 전용)
성장/streak/복리/success 맥락에만. "decorative"로 아무데나 깔지 말 것.

## Anti-patterns (안 할 것)
- 퍼플 그라디언트를 장식 목적으로 무분별 사용 (브랜드 차별화 희석)
- 3-column icon-in-circle feature grid (AI slop)
- 중앙 정렬 + uniform spacing 풀페이지 (onboarding 외)
- Bubbly uniform radius 전체 적용 (radius hierarchy 무너뜨림)
- Mono를 body에 사용 (가독성 파괴)
- Monospace를 `'monospace'`로만 지정 (Geist Mono 또는 JetBrains Mono로 고정)
- Light mode 대응 (현재 스코프 아님)

## Content Voice
- 이중 언어 OK. 한국어 감정 카피 + 영어 시스템 라벨의 대조가 브랜드 특성.
- 호칭: "Architect". "user"는 쓰지 않음.
- 시스템 어휘: Mission, System, Compound, Calibrated, Stacked, Momentum, Directive, Sync.
- 숫자 진술 선호: "37.8배", "매일 1%", "100일". 막연한 형용사 피할 것.
- 카피 예시:
  - "작심삼일이 작심 365일이 되는 방법."
  - "매일 1%의 성장은 1년 뒤 37.8배의 결과가 됩니다."
  - "You are in the top 12% of consistent architects this week."

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-23 | Initial design system documented from existing code | 기존 UI가 이미 일관된 "Self-OS Console" 언어를 갖고 있어 리디자인 대신 문서화 + 토큰 정리로 진행. 작성자: /design-consultation |
| 2026-04-23 | Surface tiers를 3단계(`0.025/0.04/0.07`)로 고정 | 현재 9종 즉흥값이 너무 많음. 새 UI는 반드시 3단계 중 하나 선택 |
| 2026-04-23 | Compound gradient 사용을 "성장/복리/성공" 맥락에 한정 | 브랜드 shorthand로 작동하려면 희소성 필요 |
| 2026-04-23 | Monospace는 Geist Mono 또는 JetBrains Mono로 고정 (코드 마이그레이션 필요) | 현재 `'monospace'`만 지정해 브라우저 간 렌더링 다름 |
