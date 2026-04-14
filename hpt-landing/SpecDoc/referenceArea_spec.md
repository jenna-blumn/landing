# Reference Area 기능 명세서

## 1. 개요
Reference Area는 상담 화면 우측 패널(`ContactReferenceArea`)로, 고객 정보/상담 정보/이력/보조 기능을 탭 기반으로 제공한다.

핵심 특징:
- 탭 순서 드래그 정렬
- 레퍼런스 설정 패널을 통한 탭 배치/노출 제어
- RNB(Right Navigation Bar) 사이드 슬롯 연동
- Task 버튼 고정 모드 지원(레퍼런스 하단)

---

## 2. 탭 구조

기본 탭 ID:
- `info` (고객)
- `contact` (Contact)
- `history` (History)
- `integration` (연동)
- `assistant` (Assistant)

추가 탭:
- 설정에서 `custom-{timestamp}` 형식의 커스텀 탭 추가 가능

탭 공통 동작:
- 탭 헤더에서 드래그 앤 드롭으로 순서 변경
- 변경된 순서는 설정(`referenceSettings.tabs[].order`)과 로컬스토리지(`reference-tab-order`)에 반영
- RNB 슬롯에 배치된 탭은 메인 탭에서 숨김 처리(`hiddenTabIds`)

---

## 3. 탭별 상세 명세

### 3.1 Info 탭 (`info`)
구현 컴포넌트:
- `InfoTabContent` -> `CustomerInfoTabContainer`

주요 기능:
- 섹션형 구성(고객 정보 / 고객 메모 / 고객 태그)
- 섹션 드래그 재정렬
- 고객 정보 섹션 오버레이
  - 필드 표시/숨김
  - 1열/2열(가로 확장) 설정
  - 필드 순서 드래그 재정렬
  - 값 복사
- 섹션별 API 설정 모달(설정값 저장)

### 3.2 Contact 탭 (`contact`)
구현 컴포넌트:
- `ContactTabContent`

주요 기능:
- 섹션 드래그 재정렬
- 상담 정보 섹션
  - 제목/요약
  - AI 생성 버튼(기본은 Mock 생성기, 외부 핸들러 주입 가능)
- 분류/태그 섹션
  - 대/중/소 분류
  - 우선순위
  - 플래그
  - 상담 태그 관리
- 메모/특이사항 섹션

### 3.3 History 탭 (`history`)
구현 컴포넌트:
- `HistoryTabContainer`

주요 기능:
- 섹션: `상담 이력`, `활동 로그`
- 각 섹션 접기/펼치기
- 높이 리사이즈
- 섹션 순서 드래그 변경
- 상태 자동 저장(`historyTabSettings`)
- 데이터 소스:
  - 활동 로그(`activityLog`)
  - 상담 이력(Mock + 현재 room 중 closed 병합)

### 3.4 Integration 탭 (`integration`)
구현 상태:
- 기본 탭 화면은 스켈레톤 카드만 렌더링(실데이터 목록 UI 미구현)
- `IntegrationDetailOverlay` 컴포넌트는 구현되어 주문 상세 조회 UI를 제공
- 현재 기본 탭 UI에서 상세 오버레이로 진입시키는 클릭 액션은 구현되어 있지 않음

### 3.5 Assistant 탭 (`assistant`)
서브탭:
- `ai-response`: 안내 플레이스홀더
- `template`: 안내 플레이스홀더
- `my-knowledge`: 기능 구현됨
  - 폴더 트리(최대 3단계)
  - 북마크 보기
  - 검색
  - 지식 아이템 생성/수정/삭제
  - 폴더 생성/삭제(하위 폴더/아이템 있으면 삭제 제한)

### 3.6 Custom 탭 (`custom-*`)
구현 상태:
- 공통 플레이스홀더 화면 제공
- 탭 자체는 설정 패널에서 추가/삭제/배치 가능

---

## 4. 레퍼런스 설정 패널

구현 컴포넌트:
- `ReferenceSettingsPanel`

설정 항목:
- RNB 표시 ON/OFF
- Task 버튼 표시 방식
  - `floating`
  - `fixed` (레퍼런스 하단 고정 버튼)
- 탭별 배치
  - 왼쪽 보조(`leftSecondary`)
  - 메인 레퍼런스(`mainReference`)
  - 오른쪽 보조(`rightSecondary`)
  - RNB 슬롯(`sideTabSlotId`)
- 커스텀 탭 추가/삭제
- OMS별 RNB 슬롯 할당

배치 규칙:
- 동일 탭은 `left/main/right/RNB` 중 한 위치만 활성화
- `left`와 `right`는 각각 1개 탭만 활성화되도록 상호 배타 처리
- 같은 RNB 슬롯에는 탭/OMS 중 1개만 할당 가능

RNB 비활성화 시:
- 탭의 `sideTabSlotId`는 해제되고 `mainReference`로 복귀
- OMS 슬롯 설정은 값이 남을 수 있으나 UI에서 비활성화 상태로 처리

---

## 5. RNB(사이드 탭) 동작

관련 구성:
- `RightNavigationBar`
- `SideTabOverlay`
- `useSideTabManagement`

슬롯:
- 최소 0개, 최대 5개
- 새 슬롯 추가 가능(최대 초과 불가)
- 빈 슬롯 또는 탭/OMS 연결 슬롯 표시

오버레이:
- 슬롯 클릭 시 해당 슬롯 오버레이 토글
- 동시 다중 오버레이는 열지 않고 한 슬롯만 활성화
- 폭 리사이즈: 270~800px
- 슬롯별 색상/폭/표시 상태 저장
- ESC 키로 닫기 지원

콘텐츠 타입:
- 탭 연결 시: `ContactReferenceArea`를 탭 헤더 없이 임베드 렌더링
- OMS 연결 시: OMS Placeholder 렌더링

OMS 연결:
- `OmsConnectionModal`에서 API 키/스토어/엔드포인트/동기화 주기 입력
- 연결 테스트는 Mock 성공 처리

저장 키:
- `sideTabSettings`
- `sideTabDrawerVerticalOffset`
- `referenceSettings` (탭/OMS 슬롯 매핑의 기준 데이터)

---

## 6. Task 버튼 고정 모드(Reference 연동)

조건:
- `taskButtonDisplayMode === 'fixed'`

동작:
- 레퍼런스 하단에 통계 버튼(공지/진행/지연/중요) 렌더링
- 클릭 시 `TaskDrawer`를 `embedded` 모드로 레퍼런스 내부에 오픈
- 임베디드 드로어는 상단 핸들로 높이 조절 가능
- 상세보기/공지 작성/할일 생성은 Task 모듈 동작을 그대로 사용

참고:
- 설정값 `taskButton.fixedDrawerHeight`는 저장되지만, 현재 임베디드 드로어 초기 높이에 직접 반영되지는 않음

---

## 7. 모드별 차이(상담사/매니저)

Reference 탭 자체 기능은 대부분 동일하다.

차이점:
- 레퍼런스 하단 고정 TaskDrawer를 사용하는 경우, 매니저 모드에서만 공지 작성/공지 수정 플로우(태스크 모듈)가 활성화된다.

즉, 순수 Reference 탭(Info/Contact/History/Integration/Assistant)의 권한 분기는 거의 없고, Task 연동 영역에서만 차이가 난다.
