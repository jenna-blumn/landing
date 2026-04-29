# Task Management 기능 명세서

## 1. 개요
Task Management는 할 일(Task)과 공지(Notice)를 통합 관리하는 모듈이다.

진입 경로
- 플로팅 버튼 + 플로팅 Drawer (`floating` 모드)
- 레퍼런스 하단 고정 버튼 + 임베디드 Drawer (`fixed` 모드)
- 상세 화면 (`TaskDetailView`) 3컬럼 레이아웃
- 전체 달력 화면 (`FullCalendarView`)

저장 방식
- 브라우저 LocalStorage (`taskManagement_v2`)

## 2. 데이터 모델
### 2.1 타입
`TaskType`
- `sms`
- `callback`
- `followup`

- `notice`

`TaskStatus`
- `pending`
- `delayed`
- `completed`

### 2.2 Task 주요 필드
- 공통: `id`, `type`, `title`, `description`, `scheduledDate`, `deadline`, `status`, `order`, `createdAt`, `completedAt`
- 우선순위/표시: `liked`, `pinned`, `pinnedAt`, `backgroundColor`
- 관계: `parentId`(하위 할 일), `roomId`(대화방 연결)
- 공지 전용: `noticeContent`, `author`, `isRead`, `targetAudience`, `requireReadConfirmation`

### 2.3 상태 계산 규칙
`getTasks()` 시점에 상태를 재계산한다.
- 이미 `completed`면 유지
- 기준일은 `deadline` 우선, 없으면 `scheduledDate`
- 기준일의 23:59:59.999를 넘기면 `delayed`, 아니면 `pending`

## 3. 화면 구성
### 3.1 TaskDrawer
모드
- `floating`: 화면 위 고정 레이어
- `embedded`: 레퍼런스 영역 하단 임베디드

공통 기능
- 상단 `DateQuickFilter`
- 카테고리 필터: `notice`, `pending`, `delayed`, `liked`, `completed`
- 타입 필터: `all`, `sms`, `callback`, `followup`
- 정렬: `custom`, `createdAt`, `deadline`, `liked`, `title`
- 할 일 추가 (`TaskInlineEditor`)
- 카드 편집/삭제/좋아요/핀/하위 할 일
- 상세보기 진입 (`onOpenDetail`)

정렬/고정 규칙
- 핀 고정 항목은 항상 상단 우선
- 핀 고정끼리는 `pinnedAt` 역순
- 그 다음에 선택 정렬 기준 적용

드래그 정렬
- `custom` 정렬일 때만 가능
- 핀 고정 항목은 드래그 대상/드롭 대상에서 제외
- `reorderTasks()`로 `order` 저장

리사이즈/이동
- `floating`: 헤더 드래그 이동 + 상단/좌우 리사이즈
- `embedded`: 상단 핸들로 높이 비율 조정(기본 50%)

권한
- 매니저 모드에서만 `공지+` 노출

### 3.2 TaskBoard
`TaskDetailView` 중앙 목록 패널로 사용된다.
- Drawer와 동일한 필터/정렬/목록 구조
- `dateRange` 기준으로 통계/목록 동기화
- 선택된 `selectedTaskId`의 속성에 맞춰 필터 자동 전환
- 공지 작성 중이면 임시 카드(`draftNotice`) 노출
- 인라인 생성기에 `연락처 연결` 추가 액션 삽입 가능

### 3.3 TaskDetailView
3컬럼 고정 레이아웃
- 좌: `TaskCalendar` (폭 290)
- 중: `TaskBoard` (폭 380)
- 우: 상세 패널

상세 패널 분기
- 공지 작성: `NoticeEditor`
- 공지 선택
- 매니저 + 편집 모드면 `NoticeEditor`
- 그 외 `NoticeViewer`
- 일반 Task 선택
- `roomId` 없음: 텍스트 상세
- `roomId` 있음: 채팅 + 레퍼런스 오버레이(가로 분할 리사이즈 가능)

### 3.4 TaskCalendar
기능
- 월 캘린더(6주 그리드)
- 단일 날짜 클릭 선택/해제
- 프리셋: `1주일`, `1개월`
- 사용자 지정 기간(듀얼 미니 캘린더, 시작/종료 둘 다 선택 후 적용)
- 날짜별 점 표시(공지/진행/지연)
- 전체 달력 열기 버튼(`onOpenFullCalendar`)

### 3.5 FullCalendarView
기능
- 월 단위 큰 캘린더
- 일자별 태스크 칩 최대 3개 + 나머지 개수 표시
- 날짜 선택 시 우측 상세 패널 오픈
- 선택 날짜 목록 정렬: 공지 우선, 그 다음 `delayed > pending > completed`

## 4. Task 동작 상세
### 4.1 생성
생성 경로
- Drawer/Board 상단 `+ 할 일`
- 인라인 에디터 즉시 입력

인라인 에디터 입력 항목
- 제목(필수)
- 설명
- 일정일(today/tomorrow/datepicker)
- 타입(`sms/callback/followup`)
- 배경색
- 선택된 대화방 연결 체크(`roomId`)

저장 규칙
- 상위 Task 생성 시 `order`는 현재 최상단보다 더 앞값(`minOrder - 1`)
- 하위 Task 생성 시 `parentId` 연결

### 4.2 편집/완료/지연/강조
편집
- 일반 Task만 카드 인라인 편집 가능
- 제목/설명/타입/일정/마감/배경색 수정
- Enter 저장, Escape 취소, 카드 바깥 클릭 저장

완료
- 일반 Task: 체크로 `completed` 토글
- Notice: 체크 동작이 일반 Task와 다름(읽음 상태 처리 흐름 사용)

지연
- 상태는 저장값보다 날짜 기준 재계산 결과가 우선

강조
- `liked` 토글 가능
- `pinned` 토글 가능(핀 아이콘은 고정 시 30도 회전 스타일)

### 4.3 하위 Task
- `parentId`로 부모-자식 연결
- 부모 삭제 시 자식도 함께 삭제
- 목록 렌더는 부모 카드 아래 재귀 렌더 구조

### 4.4 대화방 연결
- `roomId`가 있으면 링크 아이콘 표시
- 아이콘 클릭 시 해당 room으로 이동 콜백 실행

## 5. Notice 동작 상세
### 5.1 작성/수정 (`NoticeEditor`)
검증
- 제목 필수
- 본문 필수
- 수신 대상(`targetAudience`) 1명 이상 필수

편집 기능
- 미리보기 토글
- 수신 확인 필요(`requireReadConfirmation`) 토글
- 수신 대상 선택(`TargetAudienceSelector`)
- 수정 모드에서 읽음 현황 배지 표시

### 5.2 수신 대상 선택 (`TargetAudienceSelector`)
- 전체/그룹/상담사 탭 제공
- 검색 지원
- 그룹 단위 전체 선택/해제
- 선택된 대상 칩 제거 가능

### 5.3 조회/읽음 처리 (`NoticeViewer`)
- 본문/작성자/작성일/읽음률 표시
- 매니저 모드: 상담사별 읽음 상태 리스트 + 수정 버튼
- 상담사 모드: 요약형 읽음 통계
- 미읽음 상태에서 `읽음 확인` 버튼으로 읽음 처리

## 6. 저장/API 계층
- Mock API는 Promise + `setTimeout(50)` 기반
- LocalStorage 키: `taskManagement_v2`
- 마이그레이션: `pinned`, `pinnedAt`, `backgroundColor`, `order` 누락값 보정
- 주요 API
- Task: `getTasks`, `createTask`, `updateTask`, `deleteTask`, `toggleTaskCompletion`, `toggleTaskLike`, `toggleTaskPin`, `reorderTasks`
- Notice: `createNotice`, `updateNotice`, `toggleNoticeRead`, `updateNoticeReadStatus`, `getNoticeReadStats`

## 7. 앱 통합 동작
- 플로팅 버튼 통계는 `getTaskStats()`를 30초 주기로 갱신
- 버튼 위치는 `taskFloatingButtonPosition`으로 저장
- `taskButton` 설정(`displayMode`, `fixedDrawerHeight`)은 ReferenceSettings에서 로드/반영
- `floating` 모드에서만 전역 `TaskFloatingButton` + `TaskDrawer` 렌더
- `fixed` 모드에서는 `ContactReferenceArea` 내부 임베디드 Drawer 사용

## 8. 현재 구현 제약/주의사항
- 서버 연동 없이 브라우저 로컬 저장소 기반
- `taskButton.fixedDrawerHeight` 값은 설정/상태로는 유지되나 임베디드 Drawer 초기 높이에 직접 반영되지 않음(기본 50%)
- 사용자별 데이터 분리 없이 단일 저장소 공유
