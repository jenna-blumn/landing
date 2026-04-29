## AI 코딩 행동 가이드라인

**트레이드오프:** 속도보다 신중함을 우선합니다. 사소한 작업에는 판단에 따라 유연하게 적용.

### 1. 코딩 전에 먼저 생각하기

**가정하지 말 것. 혼란을 숨기지 말 것. 트레이드오프를 명시할 것.**

구현 전:
- 가정을 명시적으로 밝힐 것. 확실하지 않으면 질문할 것.
- 여러 해석이 가능하면 제시할 것 — 임의로 선택하지 말 것.
- 더 단순한 접근이 있으면 말할 것. 필요하면 반론을 제시할 것.
- 불명확하면 멈추고, 무엇이 혼란스러운지 명시하고 질문할 것.

### 2. 단순함 우선

**문제를 해결하는 최소한의 코드. 추측성 코드는 금지.**

- 요청하지 않은 기능 추가 금지.
- 한 번만 사용되는 코드에 추상화 금지.
- 요청하지 않은 "유연성"이나 "설정 가능성" 금지.
- 불가능한 시나리오에 대한 에러 처리 금지.
- 200줄로 작성한 것이 50줄로 가능하면, 다시 작성할 것.

자문: "시니어 엔지니어가 이것이 과도하게 복잡하다고 할까?" 그렇다면 단순화할 것.

### 2.5. 디자인 시스템 사용 원칙 (필수)

**신규 UI 컴포넌트 개발 시 반드시 `@blumnai-studio/blumnai-design-system`을 우선적으로 사용해야 합니다.**

- 컴포넌트를 직접 만들기 전에 디자인 시스템에 해당 기능이 있는지 반드시 확인하세요.
- 디자인 시스템 사용법 및 컴포넌트 특성을 파악하기 위해, 작업을 시작하기 전에 `node_modules/@blumnai-studio/blumnai-design-system/AI.md` 파일을 **반드시 한 번 읽어보세요.**

### 3. 외과적 변경

**필요한 부분만 수정. 자신이 만든 문제만 정리.**

기존 코드 편집 시:
- 인접한 코드, 주석, 포맷팅을 "개선"하지 말 것.
- 깨지지 않은 것을 리팩터링하지 말 것.
- 기존 스타일에 맞출 것 (본인이 다르게 하더라도).
- 관련 없는 데드 코드 발견 시 언급만 하고, 삭제하지 말 것.

자신의 변경으로 인한 고아 코드:
- 자신의 변경으로 미사용된 import/변수/함수는 제거.
- 기존 데드 코드는 요청받지 않는 한 제거하지 말 것.

테스트: 모든 변경된 줄이 사용자의 요청에 직접 연결되어야 함.

### 4. 목표 기반 실행

**성공 기준을 정의하고, 검증될 때까지 반복.**

작업을 검증 가능한 목표로 변환:
- "유효성 검사 추가" → "잘못된 입력에 대한 테스트 작성 후 통과시키기"
- "버그 수정" → "재현 테스트 작성 후 통과시키기"
- "X 리팩터링" → "리팩터링 전후 테스트 통과 확인"

다단계 작업 시 간략한 계획 제시:
```
1. [단계] → 검증: [확인사항]
2. [단계] → 검증: [확인사항]
3. [단계] → 검증: [확인사항]
```

---

## Code Quality Verification (CRITICAL)

**ALWAYS run type-check and lint after making code changes:**

```bash
npx tsc -p tsconfig.app.json --noEmit && npm run lint
```

> Note: There is no `typecheck` npm script. Use `npx tsc -p tsconfig.app.json --noEmit` directly. The root `tsconfig.json` uses `"files": []` with project references, so `npx tsc --noEmit` checks nothing.

This MUST be done:

- After completing any code changes
- Before telling the user the work is done
- To catch TypeScript errors, ESLint violations, and React hooks issues

# 데스크잇 (Deskit) - 컨택센터 상담 애플리케이션

## 기술 스택

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인)
- @blumnai-studio/blumnai-design-system (UI 컴포넌트, 아이콘)
- Zustand (전역 상태 관리 — 검색, 할일 스토어)
- lucide-react (아이콘)
- localStorage 기반 데이터 저장 (Mock API)
- pnpm 모노레포 (`pnpm-workspace.yaml`, `packageManager: pnpm@10.30.3`)

## 프로젝트 구조

```
enhanced_sidebar_and_reference_ui/
├── packages/                    # 워크스페이스 패키지
│   ├── task-module/             # @deskit/task-module — 할일 관리 독립 모듈
│   └── team-chat/               # @deskit/team-chat — 팀채팅/스레드 모듈
├── src/                         # 메인 앱 소스
│   ├── components/              # UI 컴포넌트 (영역별 분류)
│   ├── features/                # 기능 모듈 (types, components, hooks, utils, api)
│   ├── hooks/                   # 공통 커스텀 훅
│   ├── modes/                   # 레이아웃 모드 컨테이너
│   ├── stores/                  # Zustand 스토어
│   ├── services/                # 외부 API 서비스
│   ├── types/                   # 공통 타입 정의
│   ├── utils/                   # 공통 유틸리티
│   ├── data/                    # 목업 데이터
│   ├── App.tsx                  # 앱 진입점
│   └── main.tsx                 # React DOM 마운트
├── tsconfig.app.json            # 앱 + 패키지 TypeScript 설정 (타입체크 대상)
├── tsconfig.json                # 프로젝트 레퍼런스 (files: [])
├── vite.config.ts               # Vite 설정 (경로 별칭, 프록시)
├── eslint.config.js             # ESLint flat config
└── pnpm-workspace.yaml          # pnpm 워크스페이스 설정
```

## 경로 별칭 (Path Aliases)

`tsconfig.app.json`과 `vite.config.ts` 모두에 설정됨:

- `@deskit/task-module` → `./packages/task-module/src`
- `@deskit/team-chat` → `./packages/team-chat/src`

## 코딩 컨벤션

- UI 텍스트: 한국어
- 스타일: Tailwind 유틸리티 클래스
- 구조: feature 단위 모듈 분리 (types, components, hooks, utils, api)
- 상태 관리: App.tsx 전역 state + props drilling, 기능별 커스텀 훅, Zustand 스토어 (검색/할일)
- Portal: task-drawer-container ID로 모달 렌더링
- ESLint: `@typescript-eslint/no-unused-vars` — `^_` 접두사 변수는 허용

## 개발 서버

- UI 작업, 컴포넌트 수정, 프론트엔드 기능 추가/테스트 등 개발 작업 시작 시 자동으로 `npm run dev`를 백그라운드로 실행
- 서버가 이미 실행 중인지 먼저 확인하고, 실행 중이면 다시 띄우지 않음
- 포트: 기본 5173 (Vite 기본 포트)
- Vite 프록시: `/api/anthropic` → `https://api.anthropic.com` (Claude AI 연동)

## npm 스크립트

- `npm run dev` — 개발 서버 실행
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint 실행
- `npm run preview` — 빌드 미리보기

---

## 워크스페이스 패키지

### packages/task-module/ — @deskit/task-module (할일 관리 독립 모듈)

할일 CRUD, 캘린더/칸반 보드, 공지사항, 플로팅 버튼을 독립 패키지로 분리

- `context/TaskModuleProvider.tsx` — 모듈 프로바이더 (TaskContext + AuthContext)
- `context/TaskContext.tsx` — 할일 상태 관리 컨텍스트
- `context/AuthContext.tsx` — 인증 컨텍스트
- `components/TaskDrawer.tsx` — 할일 서랍 패널
- `components/TaskCard.tsx` — 개별 할일 카드
- `components/TaskViewMode.tsx` — 할일 읽기 모드
- `components/TaskEditMode.tsx` — 할일 편집 모드
- `components/TaskInlineEditor.tsx` — 새 할일 인라인 생성기
- `components/TaskFloatingButton.tsx` — 플로팅 버튼
- `components/TaskNavButton.tsx` — 네비게이션 바용 할일 버튼
- `components/TaskWidget.tsx` — 할일 위젯
- `components/TaskCalendar.tsx` — 캘린더 뷰
- `components/TaskBoard.tsx` — 칸반 보드 뷰
- `components/TaskDetailView.tsx` — 할일 상세 뷰
- `components/FullCalendarView.tsx` — 전체 캘린더 뷰
- `components/DatePickerModal.tsx` — 날짜+시간 피커 모달
- `components/DateQuickFilter.tsx` — 날짜 퀵 필터
- `components/NoticeEditor.tsx` — 공지사항 에디터
- `components/NoticeViewer.tsx` — 공지사항 뷰어
- `components/TargetAudienceSelector.tsx` — 공지 대상 선택
- `api/ITaskApi.ts` — 할일 API 인터페이스
- `api/LocalStorageTaskApi.ts` — localStorage 구현
- `api/HttpTaskApi.ts` — HTTP API 구현
- `api/IConsultantApi.ts` — 상담원 API 인터페이스
- `api/LocalStorageConsultantApi.ts` — 상담원 localStorage 구현
- `api/createApiClient.ts` — API 클라이언트 팩토리
- `hooks/useTaskEdit.ts` — 할일 편집 훅
- `utils/taskEditUtils.ts` — 날짜 포맷팅 유틸
- `utils/eventBus.ts` — 이벤트 버스 (말풍선-할일 연동)
- `types/task.ts` — Task, TaskType, TaskStatus
- `types/auth.ts` — Auth 타입
- `types/consultant.ts` — 상담원 타입
- `types/module.ts` — 모듈 설정 타입
- `types/room.ts` — 대화방 타입

### packages/team-chat/ — @deskit/team-chat (팀채팅/스레드 모듈)

1:1 스레드, 그룹채팅, AI 타겟팅, 멘션 기능을 독립 패키지로 분리

- `context/TeamChatProvider.tsx` — 팀채팅 프로바이더
- `context/TeamChatContext.tsx` — 팀채팅 컨텍스트
- `thread/components/ThreadPanel.tsx` — 스레드 패널
- `thread/components/ThreadList.tsx` — 스레드 목록
- `thread/components/ThreadSplitView.tsx` — 스레드 분할 뷰
- `thread/components/ThreadEntryButton.tsx` — 스레드 진입 버튼
- `thread/components/ThreadComposer.tsx` — 스레드 메시지 작성
- `thread/components/ThreadInviteModal.tsx` — 스레드 초대 모달
- `thread/components/ThreadMessageList.tsx` — 스레드 메시지 목록
- `thread/hooks/useThread.ts` — 스레드 상태 관리 훅
- `thread/hooks/useThreadMessages.ts` — 스레드 메시지 훅
- `groupChat/components/GroupChatRoom.tsx` — 그룹채팅 방
- `groupChat/components/GroupChatMessageList.tsx` — 그룹채팅 메시지 목록
- `groupChat/components/GroupChatComposer.tsx` — 그룹채팅 메시지 작성
- `groupChat/components/GroupChatRoomList.tsx` — 그룹채팅 방 목록
- `groupChat/components/MemberList.tsx` — 멤버 목록
- `groupChat/hooks/useGroupChat.ts` — 그룹채팅 상태 관리 훅
- `groupChat/hooks/useGroupChatMessages.ts` — 그룹채팅 메시지 훅
- `api/ITeamChatApi.ts` — 팀채팅 API 인터페이스
- `api/LocalStorageTeamChatApi.ts` — localStorage 구현
- `api/createTeamChatApi.ts` — API 클라이언트 팩토리
- `utils/aiTargetingUtils.ts` — AI 타겟팅 유틸
- `utils/mentionUtils.ts` — 멘션 파싱 유틸
- `utils/chatUtils.ts` — 채팅 유틸
- `types/thread.ts` — 스레드 타입
- `types/groupChat.ts` — 그룹채팅 타입
- `types/auth.ts` — 인증 타입
- `types/common.ts` — 공통 타입
- `types/module.ts` — 모듈 설정 타입
- `types/room.ts` — 대화방 타입
- `data/mockChatData.ts` — 목업 채팅 데이터

---

## 기능별 폴더 맵 (src/features/)

### src/features/taskManagement/ — 할일 관리 (레거시, @deskit/task-module로 이전 중)

> Note: 핵심 할일 로직은 `packages/task-module/`로 이전됨. 이 디렉토리는 기존 호환성 유지용.

### src/features/customerTab/ — 고객 정보 탭

고객 기본정보, 메모, 태그 관리, 고객 차단

- `components/CustomerInfoTabContainer.tsx` — 고객정보 메인 컨테이너 (섹션 접기/펼치기, 드래그 정렬)
- `components/SectionWrapper.tsx` — 접을 수 있는 섹션 래퍼
- `components/sections/CustomerInfoSection.tsx` — 고객 기본정보 (이름, 전화, 이메일 등)
- `components/sections/CustomerMemoSection.tsx` — 고객 메모 CRUD
- `components/sections/CustomerTagSection.tsx` — 고객 태그 관리
- `components/sections/CustomerTagVisibilityDropdown.tsx` — 태그 노출 제어 드롭다운
- `components/modals/TagSelectionModal.tsx` — 태그 생성/선택 모달
- `components/modals/ApiSettingsModal.tsx` — API 설정 모달
- `components/modals/BlockCustomerDialog.tsx` — 고객 차단 다이얼로그
- `components/overlay/CustomerInfoOverlay.tsx` — 고객정보 오버레이 뷰
- `hooks/useCustomerInfoState.ts` — 섹션 상태, 메모/태그 관리 훅
- `hooks/useFieldVisibility.ts` — 필드 표시/숨김 관리 훅
- `hooks/useCustomerTagVisibility.ts` — 태그 카드 항목별 노출 관리 훅
- `api/blockApi.ts` — 고객 차단 API
- `api/customerGradeApi.ts` — 고객 등급 API
- `utils/fieldDefinitions.ts` — 고객 필드 메타데이터 (label, category)
- `utils/copyToClipboard.ts` — 클립보드 복사 유틸
- `index.ts` — 모듈 진입점
- `types.ts` — CustomerInfo, Memo, Tag, SectionConfig

### src/features/contactTab/ — 컨택(상담) 정보 탭

상담 상세정보, 상담 노트, 분류/태그

- `hooks/useContactTabState.ts` — 컨택 섹션 상태 관리 훅
- `hooks/useClassificationVisibility.ts` — 분류/태그 항목별 노출 관리 훅
- `utils/categoryDefinitions.ts` — 상담 분류 계층 구조 (문의, 지원요청, 민원처리)
- `utils/flagDefinitions.ts` — 플래그 타입 정의 (긴급, 중요, 보통 등)
- `utils/aiSummaryGenerator.ts` — AI 상담 요약 생성
- `types.ts` — ConsultationDetails, Flag, CategoryStructure

### src/features/channelComposer/ — 채널 컴포저 (발신)

채팅/이메일/SMS/알림톡 발신 작성기

- `components/ChannelComposer.tsx` — 컴포저 메인 (채널별 발신 UI)
- `components/ChannelSelector.tsx` — 발신 채널 선택
- `components/ChannelBadge.tsx` — 채널 뱃지
- `components/ComposerInput.tsx` — 메시지 입력 영역
- `components/ComposerTopBar.tsx` — 컴포저 상단바
- `components/EmailHeaderFields.tsx` — 이메일 헤더 (수신/참조/제목)
- `components/SmsSenderSelector.tsx` — SMS 발신번호 선택
- `components/SendConfirmation.tsx` — 발신 확인 다이얼로그
- `components/TemplateArea.tsx` — 템플릿 영역
- `components/TemplatePreview.tsx` — 템플릿 미리보기
- `components/TemplateSelector.tsx` — 템플릿 선택기
- `components/VariableBindingForm.tsx` — 템플릿 변수 바인딩 폼
- `hooks/useChannelComposer.ts` — 채널 컴포저 상태 관리 훅
- `hooks/useComposerResize.ts` — 컴포저 리사이즈 훅
- `hooks/useEmailComposer.ts` — 이메일 컴포저 훅
- `hooks/useSmsComposer.ts` — SMS 컴포저 훅
- `hooks/useTemplateManager.ts` — 템플릿 관리 훅
- `api/composerApi.ts` — 컴포저 API
- `api/emailApi.ts` — 이메일 발신 API
- `api/smsApi.ts` — SMS 발신 API
- `api/templateApi.ts` — 템플릿 CRUD API
- `utils/byteCounter.ts` — 바이트 카운터 (SMS 글자수 제한)
- `utils/channelUtils.ts` — 채널 유틸리티
- `utils/templateParser.ts` — 템플릿 변수 파싱
- `data/mockAlimtalkTemplates.ts` — 알림톡 템플릿 목업
- `data/mockEmailConfig.ts` — 이메일 설정 목업
- `data/mockSmsConfig.ts` — SMS 설정 목업
- `data/mockSmsTemplates.ts` — SMS 템플릿 목업
- `types.ts` — ComposerState, ChannelType, Template, EmailConfig

### src/features/history/ — 상담 이력

과거 상담 기록, 활동 로그

- `api/historyApi.ts` — 상담 이력 API
- `hooks/useHistoryTabState.ts` — 리사이즈 가능한 이력 섹션 상태 훅
- `utils/calculations.ts` — 상담 시간/경과 계산
- `mockHistoryContactData.ts` — 목업 이력 데이터
- `types.ts` — HistoryItem, ConsultationHistoryItem

### src/features/search/ — 검색

상담/컨택 검색 및 필터링

- `api/searchApi.ts` — 검색 함수 (쿼리 + 필터)
- `hooks/useSearchFilters.ts` — 검색 필터 상태 관리 훅
- `utils/searchUtils.ts` — 검색/필터/정렬 헬퍼
- `types.ts` — SearchFilters, SearchResult, SortOption

### src/features/myKnowledge/ — 지식 베이스

개인 지식, AI 응답, 템플릿

- `components/MyKnowledgeTabContent.tsx` — 지식 베이스 메인 뷰 (폴더+검색)
- `components/TemplateTabContent.tsx` — 응답 템플릿 탭
- `components/AIResponseTabContent.tsx` — AI 추천 응답 탭
- `api/myKnowledgeApi.ts` — 지식 항목 CRUD
- `mockData.ts` — 지식 베이스 목업 데이터
- `types.ts` — KnowledgeFolder, KnowledgeItem

### src/features/integrations/ — 외부 연동 (OMS)

Cafe24, 네이버 스마트스토어, ezAdmin, Sellmate 등 OMS 연동

- `api/integrationsApi.ts` — OMS 연동 관리, 주문 조회
- `types.ts` — OMSIntegration, OMSOrder, OMSOrderDetails
- `mockData.ts` — OMS 목업 데이터

### src/features/referenceSettings/ — 참조 패널 설정

참조 탭 구성, 위치, OMS 할당 설정

- `api/referenceSettingsApi.ts` — 설정 저장/로드
- `types.ts` — ReferenceTabConfig, ReferenceSettings

---

## 주요 컴포넌트 영역

### src/components/SidebarArea/ — 사이드바

컨택 목록, 대기열, 받은편지함, 필터, 팀인박스, 스레드인박스

- `SidebarArea.tsx` — 사이드바 메인 (채널/브랜드 필터, 컨택 목록)
- `ContactListArea.tsx` — 컨택 목록 (필터, 검색, 선택)
- `QueueArea.tsx` — 대기열 카운트 (대기/수신/응대/종료/알람/부재)
- `InboxArea.tsx` — 받은편지함 (위치 토글)
- `ChannelBrandArea.tsx` — 채널/브랜드 선택
- `FilterModal.tsx` — 고급 필터 모달
- `DateFilterModal.tsx` — 날짜 범위 필터
- `ConsultantSelectionModal.tsx` — 상담원 선택 모달
- `ContactActionModal.tsx` — 컨택 액션 메뉴
- `ActiveFiltersDisplay.tsx` — 활성 필터 표시
- `AcwCard.tsx` — ACW(After Call Work) 카드
- `AcwSettingsModal.tsx` — ACW 설정 모달
- `AssignmentConfirmationModal.tsx` — 컨택 배정 확인 모달
- `TeamInboxList.tsx` — 팀 인박스 목록
- `ThreadInboxList.tsx` — 스레드 인박스 목록
- `ThreadTeamCounterBar.tsx` — 스레드/팀 카운터 바
- `contactSelectors.ts` — 컨택 선택 유틸리티

### src/components/ContactReferenceArea/ — 우측 참조 패널

탭 기반 참조 정보 (정보, 컨택, 이력, 연동, 어시스턴트, 맞춤)

- `ContactReferenceArea.tsx` — 참조 패널 메인 (탭 관리, 설정 모드)
- `ReferenceSettingsPanel.tsx` — 참조 패널 레이아웃 설정
- `InfoTab/InfoTabContent.tsx` — 고객정보 탭
- `ContactTab/ContactTabContent.tsx` — 상담정보 탭
- `ContactTab/SectionWrapper.tsx` — 컨택탭 섹션 래퍼
- `ContactTab/sections/ClassificationTagsSection.tsx` — 분류/태그 섹션
- `ContactTab/sections/ClassificationVisibilityDropdown.tsx` — 분류 노출 제어
- `ContactTab/sections/ConsultationInfoSection.tsx` — 상담정보 섹션
- `ContactTab/sections/NotesSection.tsx` — 상담 노트 섹션
- `HistoryTab/HistoryTabContainer.tsx` — 이력 탭 (리사이즈 가능 섹션)
- `HistoryTab/ConsultationHistorySection.tsx` — 상담 이력 섹션
- `HistoryTab/ActivityLogSection.tsx` — 활동 로그 섹션
- `HistoryTab/ResizableSectionWrapper.tsx` — 리사이즈 가능한 섹션 래퍼
- `IntegrationTab/IntegrationTabContent.tsx` — OMS 연동 탭
- `IntegrationTab/IntegrationDetailOverlay.tsx` — 연동 상세 오버레이
- `AssistantTab/AssistantTabContent.tsx` — AI 어시스턴트 탭
- `CustomTab/CustomTabContent.tsx` — 사용자 정의 탭
- `CustomTab/CompositeCustomTabContent.tsx` — 복합 맞춤 탭 (여러 카드 조합)

### src/components/ContactRoomArea/ — 대화방

- `ContactRoomArea.tsx` — 채팅 메시지 표시 (말풍선, 타임스탬프)
- `AcknowledgementArea.tsx` — 메시지 수신 확인 표시

### src/components/SearchArea/ — 검색 UI

- `SearchArea.tsx` — 검색 입력/결과
- `SearchResultOverlay.tsx` — 검색 결과 상세 오버레이
- `AdditionalStatusDropdown.tsx` — 추가 상태 필터 드롭다운
- `CategoryFilterDropdowns.tsx` — 카테고리 필터 드롭다운
- `ChannelFilterDropdown.tsx` — 채널 필터 드롭다운
- `PeriodFilterDropdown.tsx` — 기간 필터 드롭다운

### src/components/HistoryContactMode/ — 이력 컨택 모드

- `HistoryContactModeLayout.tsx` — 현재 채팅 + 과거 상담 이중 워크스페이스
- `ChatWorkspaceWithTabs.tsx` — 탭 기반 채팅 워크스페이스

### src/components/TeamChat/ — 팀채팅 UI

- `TeamChatView.tsx` — 팀채팅 메인 뷰
- `CreateTeamChatDialog.tsx` — 팀채팅 생성 다이얼로그

### src/components/ThreadMode/ — 스레드 모드

- `ThreadModeLayout.tsx` — 스레드 모드 레이아웃

### src/components/common/ — 공통 컴포넌트

- `EmptyState.tsx` — 빈 상태 표시
- `MultiSelectDropdown.tsx` — 멀티 셀렉트 드롭다운

### 루트 컴포넌트 (src/components/)

- `GNB.tsx` — 글로벌 네비게이션 바 (모드 선택, 자동배분, 관리자 모드)
- `ChatRoomHeader.tsx` — 대화방 헤더 (컨택 이름, 상태, 액션 버튼)
- `RightNavigationBar.tsx` — 우측 네비게이션 바
- `OmsConnectionModal.tsx` — OMS 연결 모달
- `OmsContentPlaceholder.tsx` — OMS 콘텐츠 플레이스홀더
- `SecondaryReferenceArea.tsx` — 보조 참조 패널 (좌/우)
- `SharedReferenceArea/SharedReferenceArea.tsx` — 공유 참조 영역
- `SideTabEmptyState.tsx` — 사이드 탭 빈 상태
- `SideTabOverlay.tsx` — 사이드 탭 오버레이
- `SideTabSettings.tsx` — 사이드 탭 설정

---

## 공통 모듈

### src/hooks/ — 공통 훅

- `useSideTabManagement.ts` — 사이드 탭 상태/OMS 연결 (localStorage 'sideTabSettings')
- `useChatDisplayMode.ts` — 채팅 디스플레이 모드 (grid/2x1/single/focus/kanban)
- `useRoomManagement.ts` — 대화방 열기/닫기/필터링
- `useAcw.ts` — ACW(After Call Work) 상태 관리

### src/stores/ — Zustand 스토어

- `useSearchStore.ts` — 검색 전역 상태 (쿼리, 필터, 결과)
- `useTaskStore.ts` — 할일 전역 상태

### src/services/ — 외부 서비스

- `claudeApi.ts` — Claude AI API 호출 (Vite 프록시 경유)

### src/utils/ — 공통 유틸

- `timeUtils.ts` — 시간 포맷팅 (남은시간, 알람 활성 확인)
- `idUtils.ts` — ID 생성 유틸리티
- `roomUtils.ts` — 대화방 유틸리티

### src/types/ — 공통 타입

- `sideTab.ts` — 사이드 탭 타입 (SideTabConfig, OmsConnectionConfig, OMS_LIST)
- `channel.ts` — 채널 타입 정의

### src/modes/ — 레이아웃 모드

- `ChatModeContainer.tsx` — 채팅 모드 레이아웃 (GNB + 사이드바 + 대화방 + 참조패널)
- `PhoneModeContainer.tsx` — 전화 모드 레이아웃
- `WorkspaceContainer.tsx` — 워크스페이스 컨테이너 (공통 레이아웃 래퍼)
- `types.ts` — 모드 관련 타입

### src/data/ — 목업 데이터

- `mockData.ts` — Room, Brand 인터페이스 + 샘플 컨택 데이터 (~30건)

### src/App.tsx — 앱 진입점

전역 상태 관리: 모드 전환, 룸 관리, 검색, 필터, 할일 통계 등
ChatModeContainer / PhoneModeContainer 조건 렌더링
TaskFloatingButton, TaskDrawer, TaskDetailView 오버레이

---

## 알려진 이슈 & 수정 사항

### DS Calendar 단일 날짜 선택 시 border-radius 소실 (수정 완료)

- **파일**: `packages/task-module/src/components/TaskCalendar.tsx`
- **원인**: 단일 날짜 선택 시 `{ from, to: from }` 전달 → react-day-picker가 `range_start` + `range_end` 동시 적용 → `rounded-r-none` + `rounded-l-none` 모두 적용되어 4개 코너 전부 0
- **수정**: 단일 날짜일 때 `{ from }` 만 전달 (to 생략). `range_start`만 적용되어 좌측 코너 `rounded-sm` 유지
- **DS 관련**: DS Calendar의 `@layer utilities` 에서 `rounded-sm` (shorthand) → `rounded-r-none`/`rounded-l-none` (longhand) 순서로 올바르게 작동. 문제는 DS가 아닌 사용 코드 측
