# Sidebar 기능 명세서

## 1. 개요
Sidebar는 좌측 업무 탐색 영역(`SidebarArea`)이며, 상담방 목록 필터링/카테고리 전환/검색 모드 진입/일괄 액션의 시작점이다.

핵심 구성:
- 채널/브랜드 필터 (`ChannelBrandArea`)
- 큐 상태 영역 (`QueueArea`)
- 인박스 카테고리 (`InboxArea`)
- 활성 필터 칩 (`ActiveFiltersDisplay`)
- 컨택 목록/일괄 액션 (`ContactListArea`)

---

## 2. 컴포넌트 상세

### 2.1 Channel/Brand 영역

채널:
- `all`, `chat`, `phone`
- `phone` 버튼은 표시 여부 설정 가능
- 전화 모드 활성 시 버튼 색상/상태가 변경

브랜드:
- 선택 없음(`[]`)이면 전체 브랜드
- 다중 선택 가능
- 확장 패널에서 브랜드별 카운트 표시
- 브랜드 UI를 GNB로 이동하는 토글 지원

### 2.2 Queue 영역

표시 지표:
- `AI응대`: `isAIHandled` 기준
- `배정대기`: `mainCategory === 'waiting'`

클릭 동작:
- AI응대 버튼 -> 검색 모드 진입(`filterMode='ai-response'`)
- 배정대기 버튼 -> 검색 모드 진입(`filterMode='unassigned'`)
- 검색 버튼 -> 검색 모드 진입(`filterMode='standard'`)

표시 형식:
- 카운트는 99 초과 시 `99+`

### 2.3 Inbox 영역

채널별로 다른 레이아웃을 렌더링한다.

주요 카테고리:
- 메인: `responding`, `closed`, `received`, `alarm(콜백)`, `absent`
- 추가: `request`, `maintain`

카운트 규칙:
- `alarm(콜백)`은 `isAlarmActive(alarmTimestamp)` 기준
- `selectedChannel`에 따라 채팅/전화 대상을 분기해서 집계

선택 규칙:
- 메인 카테고리 선택 시 추가 카테고리는 해제
- 추가 카테고리 선택 시 메인 카테고리를 `all`로 리셋
- 검색 모드 상태에서 카테고리 클릭 시 검색 모드 종료
- 현재 선택된 room이 없으면, 해당 필터의 첫 컨택을 자동 선택

### 2.4 Contact List 영역

뷰 모드:
- 축소 모드: 원형 아바타 리스트 + 스크롤 인디케이터
- 확장 모드: 카드 리스트(컴팩트/확장 전환)

표시 요소:
- 채널 아이콘
- 브랜드 아이콘
- unread 배지
- 즐겨찾기 별
- 플래그
- VIP 배지
- 경과 시간(`now`, `m`, `h`, `d`, `mo`)

클릭 제한:
- 자동 배정 모드에서 `waiting` 컨택은 기본 클릭 불가
- 단, `queue-waiting` 필터 또는 전화 모드에서는 클릭 허용

---

## 3. 필터링 파이프라인

`ContactListArea`의 실제 필터 우선순위는 다음과 같다.

1. 큐 타입(`selectedQueueType`) 우선 적용
2. 브랜드
3. 채널
4. 메인 카테고리(`alarm`은 `isAlarmActive` 특수 처리)
5. 추가 카테고리
6. 날짜 필터(`dateFilter.start/end`)
7. 플래그 필터
8. 고객 등급 필터

큐 타입 우선 규칙:
- `ai-response`: `isAIHandled === true`
- `queue-waiting`: `mainCategory === 'waiting'`
- 큐 타입이 켜져 있으면 일반 카테고리/브랜드 필터보다 먼저 걸러진다.

---

## 4. 필터 모달/날짜 모달

### 4.1 FilterModal
지원 항목:
- 플래그: `urgent`, `important`, `normal`, `info`, `completed`
- 고객 등급: `vip`, `problematic`, `longterm`
- 정렬 기준 UI: `lastConsultation`, `roomCreated`, `channel`, `flag`
- 정렬 방향 UI: `asc/desc`

주의:
- 정렬 옵션은 UI/상태는 존재하지만, 현재 `ContactListArea` 정렬 로직에는 반영되지 않는다.

### 4.2 DateFilterModal
프리셋:
- 오늘, 어제, 최근 7일, 1개월, 3개월, 이번 달 누적, 사용자 지정

기본값:
- 3개월(오늘 기준)

### 4.3 ActiveFiltersDisplay
칩 표시:
- 플래그
- 고객 등급
- 사용자 지정 날짜 범위(`preset='custom'`일 때만 표시)

---

## 5. 다중 선택 액션

선택 UX:
- 카드 hover 시 체크 UI
- 다중 선택 후 우측 `ContactActionModal` 표시
- 전체 선택/해제 지원

액션 노출 규칙:
- `queue-waiting` + 수동 배정:
  - 공통: `나에게 배정`
  - 매니저: `상담사에게 배정` 추가
- 일반 모드:
  - 공통: 상담 분류 변경, 상담 종료, 종료 보류
  - 상담사: 상담사 변경 요청
  - 매니저: 상담사 변경, 플래그 설정, 고객 차단

현재 상태:
- 다수 액션은 실제 데이터 갱신 대신 alert/confirm 기반 Mock 처리
- 배정 관련은 선택 모달/확인 모달 UI 흐름이 구현되어 있음

---

## 6. 검색 모드 연계

사이드바에서 검색 모드로 들어가는 경로:
- QueueArea( AI응대 / 배정대기 / 검색 )

앱 공통 동작(`App.tsx`):
- 검색 모드 진입 시 기존 사이드바 상태를 snapshot으로 저장
- 검색 모드 종료 시 snapshot 복원

표준 검색(`standard`)의 상담사 필터 기본값:
- 상담사 모드: `김상담` 고정
- 매니저 모드: `null`(전체)

SearchArea 내 권한 차이:
- 매니저: 상담사 멀티 선택 드롭다운 사용 가능
- 상담사: `김상담` 고정 배지(변경 불가)

---

## 7. 모드별 차이(상담사/매니저)

실제 코드 기준 차이:
- 사이드바 자체에서는 일괄 액션 메뉴 노출 범위가 다름
- 검색 화면에서는 상담사 필터 제어 범위가 다름

명시:
- “모니터링 모드/Whisper” 동작은 본 Sidebar 구현에 포함되어 있지 않다.
