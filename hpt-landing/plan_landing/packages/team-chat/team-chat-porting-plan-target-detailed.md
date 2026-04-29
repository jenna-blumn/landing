# 타겟 프로젝트 맞춤 상세 통합 계획서
최종 업데이트: 2026-03-02

대상 프로젝트: `C:\Users\happytalk\Documents\work_space\sortUI enhanced_sidebar_and_reference_ui`

## 1. 요구사항 반영 요약
- 스레드 모드는 타겟의 기존 히스토리 모드 분할 구조(좌/우)를 재사용한다.
- 각 컨택룸 레퍼런스 패널은 기존 탭 구조를 그대로 유지한다.
- 인박스에 스레드/팀 전용 영역이 없으므로, 인박스 상태 버튼 하단에 `스레드`/`팀` 버튼을 추가한다.
- 스레드 진입은 컴포저 헤더에서 채널 선택 버튼 좌측 `스레드` 버튼으로 시작한다.
- 컴포저 헤더의 스레드 버튼은 상태 기반 토글로 동작한다: 스레드 창이 열리면 `스레드 대화` 버튼을 `스레드 닫기` 버튼으로 전환한다.
- 추가 요구: 기존 컨택 추가 기능을 GNB에 배치하고, 추가된 컨택은 실제 `상담중` 대화방으로 즉시 반영한다.
- 팀 대화 시작 시 기본 AI 컨설턴트가 자동으로 팀원에 포함되어야 하며, 시작 직후 AI 첫 메시지가 표시되어야 한다.
- 고객 AI는 상담사 어투를 사용하지 않도록 프롬프트 정책(금지 문구 + 역할 고정)을 적용한다.

## 2. 타겟 코드 기준 통합 포인트

### 2.1 분할 레이아웃(스레드 모드)
- `src/components/HistoryContactMode/HistoryContactModeLayout.tsx`
- `src/components/HistoryContactMode/ChatWorkspaceWithTabs.tsx`
- 적용: 동일 split-view 패턴을 `ThreadModeLayout`으로 복제/변형.

### 2.2 모드 분기
- `src/modes/ChatModeContainer.tsx`
- `src/modes/PhoneModeContainer.tsx`
- 적용: `isHistoryContactMode`와 같은 레벨에 `isThreadMode` 분기 추가.

### 2.3 인박스/사이드바
- `src/components/SidebarArea/InboxArea.tsx`
- `src/components/SidebarArea/SidebarArea.tsx`
- `src/components/SidebarArea/contactSelectors.ts`
- 적용: 인박스 하단 special 버튼(`스레드`, `팀`) + 목록 전환 분기.

### 2.4 컴포저 상단 진입
- `src/features/channelComposer/components/ComposerTopBar.tsx`
- `src/features/channelComposer/components/ChannelComposer.tsx`
- `src/components/ContactRoomArea/ContactRoomArea.tsx`
- 적용: 채널 버튼 좌측 스레드 버튼 추가 및 이벤트 상향 전달.

### 2.5 GNB 컨택 추가
- `src/components/GNB.tsx`
- `src/modes/ChatModeContainer.tsx`
- `src/modes/PhoneModeContainer.tsx`
- `src/App.tsx`
- 적용: GNB 말풍선 버튼 -> App 핸들러 -> 신규 컨택 룸 생성/오픈.

## 3. 스레드/팀 통합 상세

### 3.1 Provider 및 상태
파일: `src/App.tsx`

추가 상태:
- `selectedInboxSpecial: 'thread' | 'team' | null`
- `threadCount: number`
- `teamUnreadCount: number`
- `isThreadMode: boolean`
- `threadSourceRoomId: number | null`

추가 연결:
- `TeamChatModuleProvider` 추가
- 콜백 매핑:
  - `onNavigateToRoom` -> `setSelectedRoomId`
  - `onThreadOpenChange` -> `isThreadMode`, `threadSourceRoomId`
  - `onThreadCountChange` -> `threadCount`
  - `onUnreadCountChange` -> `teamUnreadCount`
  - `onSuggestReply` -> Assistant 탭 연동 포인트

### 3.2 인박스 버튼
파일: `src/components/SidebarArea/InboxArea.tsx`

추가 Props:
- `selectedInboxSpecial`
- `onSelectInboxSpecial`
- `threadCount`
- `teamUnreadCount`

추가 UI:
- 모든 인박스 레이아웃(all/chat/collapsed) 하단에 `스레드`/`팀` 버튼 2개 추가.
- 재클릭 시 토글 해제(`null`).

### 3.3 사이드바 목록 전환
파일: `src/components/SidebarArea/SidebarArea.tsx`

분기:
- `selectedInboxSpecial === null` -> 기존 `ContactListArea`
- `selectedInboxSpecial === 'thread'` -> `ThreadInboxList` (모듈 `ThreadList` 래핑)
- `selectedInboxSpecial === 'team'` -> `TeamInboxList` (모듈 `GroupChatRoomList` 래핑)

신규 권장 파일:
- `src/components/SidebarArea/ThreadInboxList.tsx`
- `src/components/SidebarArea/TeamInboxList.tsx`

### 3.4 스레드 진입 버튼(컴포저 헤더)
파일: `src/features/channelComposer/components/ComposerTopBar.tsx`

추가 Props:
- `onEnterThreadMode?: () => void`
- `onExitThreadMode?: () => void`
- `isThreadModeActive?: boolean`

배치:
- 좌측 그룹에서 `ChannelSelector` 앞에 `스레드` 버튼 추가.

동작 규칙(필수):
- `isThreadModeActive === false`: `스레드 대화` 버튼 노출, 클릭 시 `onEnterThreadMode` 호출.
- `isThreadModeActive === true`: `스레드 대화` 버튼은 숨기고 `스레드 닫기` 버튼 노출, 클릭 시 `onExitThreadMode` 호출.
- 스레드 창이 이미 열린 상태에서 다시 `스레드 대화`를 호출하는 경로는 허용하지 않는다(중복 오픈 방지).

연결:
- `ContactRoomArea -> ChannelComposer -> ComposerTopBar`로 `isThreadModeActive`, `onEnterThreadMode`, `onExitThreadMode` 전달.

### 3.5 Thread 모드 레이아웃
신규 파일:
- `src/components/ThreadMode/ThreadModeLayout.tsx`
- `src/components/ThreadMode/ThreadWorkspaceWithTabs.tsx`

구성:
- 좌측: 기존 컨택룸 워크스페이스
- 우측: 스레드 워크스페이스 + Reference 탭
- 레퍼런스 패널은 기존 컴포넌트 재사용(독립 탭 유지)

### 3.6 팀 대화 시작 정책(최신 반영)
파일: `src/App.tsx` 또는 팀 대화 생성 오케스트레이션 레이어

정책:
- 사용자 선택 팀원 + 기본 AI 컨설턴트(1명)를 합쳐 참가자 목록 구성
- 팀 대화 생성 직후 AI 첫 안내 메시지 자동 발신
- 이후 팀 대화에서 사용자 발화 시 AI 팀원이 응답하는 흐름 유지

검증 기준:
- 팀 대화 생성 직후 참가자 목록에 AI가 표시됨
- 첫 AI 메시지 1건이 자동 생성됨
- 첫 사용자 메시지 이후 AI 응답이 이어짐

### 3.7 고객 AI 역할 경계 정책
파일: `src/config/claude.ts`, `src/services/claudeService.ts`

정책:
- 고객 AI 시스템 프롬프트에 "상담사 어투 금지" 명시
- 금지 표현(예: `안내드리겠습니다`, `확인해드리겠습니다`) 탐지 시 고객 말투 재작성 보정 수행

검증 기준:
- 컨택 추가 후 AI 고객 응답에서 상담사형 안내 문구가 반복적으로 나타나지 않음
- 고객 응답이 1~3문장 고객 관점으로 유지됨

## 4. GNB 컨택 추가 통합 방안 (추가 요구사항 반영)

## 4.1 결론
- 구현 가능.
- 현재 구조에서 가장 안전한 방식은 **GNB는 트리거만 담당**하고, 실제 컨택 생성은 `App.tsx`에서 처리하는 방식.

이유:
- `allRooms`, `selectedRoomId`, `selectedMainCategory` 등 실제 화면 상태의 단일 소스가 `App.tsx`에 있음.
- 모드/사이드바/필터 상태와 충돌 없이 일관되게 업데이트 가능.

## 4.2 UI 배치
파일: `src/components/GNB.tsx`

변경:
- 데이터 초기화 버튼(`refresh`) 아래에 말풍선 버튼 추가.
- 아이콘: DS 채팅 계열 아이콘 사용.
- 버튼 클릭 시 `onAddContactClick` 콜백 실행.

추가 Props:
- `onAddContactClick?: () => void`
- `isAddContactDisabled?: boolean` (선택)

## 4.3 이벤트 체인
1. `GNB` 말풍선 버튼 클릭
2. `ChatModeContainer`/`PhoneModeContainer`가 `onAddContactClick`을 App으로 전달
3. `App.tsx`의 `handleAddContactFromGnb` 실행
4. 신규 Room 생성 및 전체 상태 업데이트

## 4.4 신규 컨택 생성 규칙 (상담중 반영 보장)
파일: `src/App.tsx` (핸들러/유틸 추가)

핵심 규칙:
- 신규 룸은 반드시 아래로 생성:
  - `mainCategory: 'responding'`
  - `contactStatus: 'responding'`
  - `status: 'active'`
  - `channel: 'chat'` (권장 기본값)
- 룸 생성 후 즉시:
  - `setSelectedMainCategory('responding')`
  - `setSelectedAdditionalCategory(null)`
  - `setSelectedQueueType(null)`
  - `setSelectedChannel('chat')`
  - `setAllRooms`에서 기존 `isOpen`은 false, 신규 룸만 `isOpen: true`
  - `setSelectedRoomId(newRoomId)`

이 규칙으로 `ContactListArea`/`contactSelectors` 기준에서 즉시 상담중 목록에 노출됨.

## 4.5 “현재 컨택 추가 기능” 재사용 방식
현재 프로젝트 기능(고객 선택 + 시나리오 + 초기 메시지 생성) 수준으로 맞추려면 다음 2안 중 선택:

안 A (빠른 적용):
- GNB 클릭 시 `QuickAddContactDialog` 1개 사용
- 필드: 고객명, 문의주제, 브랜드, 시나리오(선택)
- 초기 메시지는 템플릿 생성

안 B (기능 동등):
- `CustomerSelectModal` + `CustomerScenarioModal` 패턴을 타겟에 이식
- 시나리오 기반 초기 메시지 AI 생성(`claude` 프록시) 시도, 실패 시 기본문구 fallback

권장:
- 1차는 안 A로 빠르게 붙이고,
- 2차에서 안 B로 고도화.

## 4.6 스레드/팀과 충돌 방지
- `selectedInboxSpecial`이 `thread/team`일 때 GNB로 컨택 추가 시:
  - `selectedInboxSpecial`을 `null`로 복귀
  - 생성된 신규 룸으로 네비게이션
- `isThreadMode`가 켜져 있으면:
  - 신규 컨택 생성 후 `isThreadMode`를 false로 전환하고 신규 룸 오픈

## 4.7 파일별 변경 목록 (GNB 추가분)
1. `src/components/GNB.tsx`
- 말풍선 버튼 추가, `onAddContactClick` props 추가

2. `src/modes/ChatModeContainer.tsx`
- `GNB`에 `onAddContactClick` 전달
- props에 `onAddContactClick` 추가

3. `src/modes/PhoneModeContainer.tsx`
- `GNB`에 `onAddContactClick` 전달
- props에 `onAddContactClick` 추가

4. `src/modes/types.ts`
- `WorkspaceContainerProps`에 `onAddContactClick` 추가

5. `src/App.tsx`
- `handleAddContactFromGnb` 구현
- 컨택 추가 다이얼로그 상태/컴포넌트 연결
- 룸 생성 유틸(`createNewContactRoom`) 추가

6. (선택) `src/components/ContactAdd/*`
- `QuickAddContactDialog.tsx` 또는 `CustomerSelectModal.tsx`/`CustomerScenarioModal.tsx`

## 5. 구현 순서
1. `GNB` 버튼/콜백 시그니처 추가
2. ModeContainer -> App 콜백 체인 연결
3. App에서 신규 룸 생성 핸들러 구현(상담중 반영 규칙 포함)
4. 최소 다이얼로그(QuickAdd) 구현
5. 스레드/팀 special 모드와 충돌 정리
6. 회귀 테스트

## 6. 검증 시나리오
1. GNB 데이터 초기화 버튼 아래 말풍선 버튼 노출 확인
2. 말풍선 클릭 시 컨택 추가 UI 오픈 확인
3. 생성 완료 시 신규 컨택이 `상담중` 목록에 즉시 등장
4. 신규 컨택이 자동 선택되고 대화창이 열림
5. 스레드/팀 목록 표시 중 생성해도 일반 목록으로 복귀 후 신규 컨택으로 이동
6. 컴포저 헤더에서 스레드 진입 전에는 `스레드 대화`, 진입 후에는 `스레드 닫기`만 노출됨을 확인
7. `스레드 닫기` 클릭 시 스레드 모드 해제 및 기본 컨택 뷰 복귀 확인(중복 오픈 없음)
8. 기존 인박스 필터/검색/히스토리 모드 회귀 없음
9. 팀 대화 생성 시 AI 팀원 자동 포함 + 첫 메시지 자동 발신 확인
10. 컨택 AI 응답이 상담사 어투로 붕괴되지 않는지 확인

## 7. 완료 기준 (DoD)
- 스레드/팀 통합 요구 반영 완료
- GNB 컨택 추가 버튼 적용 완료
- 컨택 추가 시 실제 상담중 대화방 반영 완료
- 컴포저 헤더 스레드 버튼이 `스레드 대화`/`스레드 닫기` 상태 토글로 동작하고 중복 오픈이 차단됨
- 팀 대화 시작 시 AI 자동 참여/자동 첫 메시지 정책이 동작함
- 고객 AI 역할 경계(상담사 어투 차단) 정책이 적용됨
- 주요 모드(Search/History/Thread/Phone) 전환 시 상태 일관성 유지
- `@deskit/team-chat` 단일 진입점 사용 원칙 유지
