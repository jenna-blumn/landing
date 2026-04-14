# sortUI `feat/team-chat-and-thread` 포팅 통합 실행계획 (Decision-Locked)

작성일: 2026-03-02  
소스 프로젝트: `thread_team_conversation_mockup`  
타겟 프로젝트: `C:\Users\happytalk\Documents\work_space\sortUI enhanced_sidebar_and_reference_ui`  
타겟 브랜치: `feat/team-chat-and-thread`

## 1. 요약
`thread_team_conversation_mockup`의 스레드/팀대화 모듈을 타겟 프로젝트 구조에 맞춰 포팅한다.  
핵심은 `packages/team-chat`를 안전하게 이식하고, 타겟의 기존 히스토리 분할 레이아웃/레퍼런스 탭/인박스 구조를 재사용해 스레드·팀대화를 자연스럽게 통합하는 것이다.

## 2. 결정 잠금 (확정)
1. 적용 범위: 데스크톱 채팅 + 폰모드 동시 적용.
2. 데이터 어댑터: LocalStorage 기본, Supabase는 자리만 유지(런타임 비활성).
3. AI 제안 표출: Assistant 탭의 `AI 응답` 서브탭에 표출 + 자동 포커스 이동.
4. 스레드 UX: 타겟 히스토리 분할 구조를 재사용한 split-view.
5. 인박스: 기존 상태 버튼 하단에 `스레드`/`팀` 상태 버튼 추가.
6. 스레드 진입 버튼: 인풋박스 헤더 채널 선택 버튼 좌측에 배치.
7. 스레드 버튼 토글: 열림 시 `스레드 대화` 숨김, `스레드 닫기`로 전환.
8. 컨택 추가: GNB 말풍선 버튼 추가, 생성 시 상담중(`responding`) 룸으로 즉시 반영.

## 3. 사전 리스크와 고정 대응
1. `@deskit/team-chat`의 `compat/supabaseCompat`는 타겟에서 경로 깨짐 위험이 있으므로 공개 export에서 제거.
2. `createTeamChatApi`의 Supabase 정적 import는 빌드 의존성 충돌 위험이 있으므로 제거.
3. Chat/Phone 컨테이너 동시 마운트 구조에서 훅 중복 호출을 방지하기 위해 팀챗 훅은 App 단일 브리지에서만 사용.
4. 타겟 `Room.id(number)`와 팀챗 `roomId(number|string)` 혼용을 위해 호스트 매핑 레이어를 명시적으로 둠.

## 4. 파일 단위 작업 범위
### 4.1 타겟 앱
- `src/App.tsx`
- `src/modes/ChatModeContainer.tsx`
- `src/modes/PhoneModeContainer.tsx`
- `src/components/SidebarArea/SidebarArea.tsx`
- `src/components/SidebarArea/InboxArea.tsx`
- `src/features/channelComposer/components/ComposerTopBar.tsx`
- `src/features/channelComposer/components/ChannelComposer.tsx`
- `src/components/ContactRoomArea/ContactRoomArea.tsx`
- `src/components/GNB.tsx`
- `src/components/HistoryContactMode/HistoryContactModeLayout.tsx`
- `src/components/HistoryContactMode/ChatWorkspaceWithTabs.tsx`
- `src/components/ContactReferenceArea.tsx`
- `src/components/ContactReferenceArea/AssistantTab/AssistantTabContent.tsx`
- `src/features/myKnowledge/components/AIResponseTabContent.tsx`

### 4.2 타겟 신규 추가
- `packages/team-chat/**` (소스에서 이식)
- `src/features/teamChat/bridge/TeamChatBridgeProvider.tsx`
- `src/features/teamChat/state/useTeamChatUiStore.ts`
- `src/components/SidebarArea/ThreadInboxList.tsx`
- `src/components/SidebarArea/TeamInboxList.tsx`
- `src/components/ThreadMode/ThreadModeLayout.tsx`
- `src/components/ThreadMode/ThreadWorkspaceWithTabs.tsx`
- `src/components/ContactAdd/QuickAddContactDialog.tsx` 또는 고객선택/시나리오 모달 세트

### 4.3 설정 파일
- `vite.config.ts` (`@deskit/team-chat` alias 추가)
- `tsconfig.app.json` (paths/include 확장)

## 5. 단계별 구현 순서 (고정)
### 5.1 모듈 이식/하드닝
1. `packages/team-chat`를 타겟으로 복사.
2. `index.ts`에서 `compat/supabaseCompat` export 제거.
3. `createTeamChatApi.ts`에서 Supabase 정적 import 제거.
4. `SupabaseTeamChatApi`는 “disabled in this target” 스텁으로 유지.
5. 타겟 alias/paths/include 반영.

### 5.2 App 단일 브리지 도입
1. `TeamChatModuleProvider`를 `App.tsx`에 장착.
2. `TeamChatBridgeProvider`에서 `useThread/useThreadMessages/useGroupChat/useGroupChatMessages` 단일 인스턴스 보유.
3. Chat/Phone 컨테이너는 브리지 state/action만 구독.

### 5.3 통합 UI 상태 모델 도입
`useTeamChatUiStore`에 아래 상태를 고정:
- `selectedInboxSpecial: null | 'thread' | 'team'`
- `isThreadMode: boolean`
- `threadSourceRoomId: number | null`
- `activeThreadId: string | null`
- `activeTeamRoomId: string | null`
- `threadCount: number`
- `teamUnreadCount: number`
- `assistantMainTabFocusRequest: boolean`
- `assistantSubTab: 'ai-response' | 'template' | 'my-knowledge'`
- `aiResponseItems[]`

모드 우선순위:
1. Search
2. Thread
3. HistoryContact
4. Team 특수모드
5. 기본 상담모드

### 5.4 인박스/사이드바 특수모드 통합
1. `InboxArea` 하단에 `스레드`/`팀` 버튼 추가(모든 레이아웃 변형에 동일 적용).
2. `SidebarArea` 목록 영역 분기:
- `null` -> 기존 `ContactListArea`
- `'thread'` -> `ThreadInboxList`
- `'team'` -> `TeamInboxList`
3. 일반 상태 버튼 클릭 시 `selectedInboxSpecial = null`로 리셋.

### 5.5 스레드 split-view 구현
1. 히스토리 모드 분할 패턴을 복제해 `ThreadModeLayout` 구현.
2. 좌측: 기존 컨택룸 워크스페이스.
3. 우측: 스레드 워크스페이스 + 기존 레퍼런스 탭 구조 재사용.
4. 상호 배타 규칙:
- 스레드 진입 시 히스토리 모드 종료
- 히스토리 진입 시 스레드 모드 종료

### 5.6 인풋 헤더 스레드 버튼 토글
1. `ComposerTopBar` props 확장:
- `isThreadModeActive`
- `onEnterThreadMode`
- `onExitThreadMode`
2. 동작 규칙:
- 닫힘 상태: `스레드 대화`만 노출
- 열림 상태: `스레드 대화` 숨김 + `스레드 닫기` 노출

### 5.7 팀 대화 시작/실행 보장
1. `TeamInboxList`에서 방 선택 시 `activeTeamRoomId`를 반드시 설정.
2. 팀방이 없으면 생성 CTA 노출.
3. 생성 시 최소 1명 이상 선택 강제.
4. 생성 성공 시 즉시 해당 팀방으로 포커스 이동.

### 5.8 팀대화 AI 팀원 동작
1. 팀방 생성 시 AI 컨설턴트 자동 참여.
2. 생성 직후 AI 첫 인사 메시지 자동 전송.
3. 사용자 메시지 후 AI 자동 응답(중복응답 dedupe 포함).
4. 실패 시 사용자 메시지는 유지하고 에러 상태/토스트만 표출.

### 5.9 GNB 컨택 추가 통합
1. GNB 데이터 초기화 버튼 아래 말풍선 버튼 추가.
2. 클릭 시 고객 선택 -> 시나리오 선택/입력 플로우.
3. 고객 목록이 비어 있으면 mock 고객 자동 시드.
4. 생성 성공 시 강제 반영:
- `mainCategory='responding'`
- `contactStatus='responding'`
- `status='active'`
- 새 룸 열기/선택
- `selectedInboxSpecial=null`
- `isThreadMode=false`

### 5.10 Assistant `AI 응답` 탭 포커스/표출
1. `ContactReferenceArea`에 메인탭 강제 포커스 진입점 추가.
2. `AssistantTabContent`를 전역 상태와 연결해 `ai-response` 서브탭 강제 전환 지원.
3. `onSuggestReply` 수신 시:
- 메인탭 `assistant`
- 서브탭 `ai-response`
- 응답 아이템을 `AIResponseTabContent` 리스트에 상태(`loading/success/error`)와 함께 적재.

## 6. 공개 API/인터페이스 변경 사항
### 6.1 타겟 컴포넌트 props 추가
1. `InboxAreaProps`
- `selectedInboxSpecial`
- `onSelectInboxSpecial`
- `threadCount`
- `teamUnreadCount`

2. `SidebarAreaProps`
- 위 4개 + `activeThreadId` + `activeTeamRoomId`

3. `ComposerTopBarProps`
- `isThreadModeActive`
- `onEnterThreadMode`
- `onExitThreadMode`

4. `ChannelComposerProps`, `ContactRoomAreaProps`
- 스레드 토글 props 전달 체인 추가

5. `GNBProps`
- `onAddContactClick`
- `isAddContactDisabled?`

6. `ContactReferenceAreaProps`
- `forcedActiveTab?: string`

7. `AssistantTabContentProps`
- `forcedSubTab?: 'ai-response' | 'template' | 'my-knowledge'`

### 6.2 모듈 공개 API 조정
1. `@deskit/team-chat`에서 `compat/supabaseCompat` export 제거.
2. `ApiType` 타입은 유지하되 타겟에서 `supabase` 선택 시 명시적 에러 처리.

## 7. 엣지케이스 처리 규칙
1. 숨김 컨테이너 중복 훅 호출 금지: App 단일 브리지 원칙.
2. 스레드/히스토리 동시 활성 금지.
3. 특수모드 진입 중 일반 필터 클릭 시 특수모드 자동 해제.
4. 선택 룸 없는 상태의 스레드 진입 차단.
5. 팀원/고객 목록 비어있을 때 mock seed fallback.
6. AI API 실패 시 화면 멈춤 없이 상태만 에러 처리.
7. LocalStorage 파손 시 초기 상태로 복구.
8. 데이터 초기화 시 task/team/customer key 동시 초기화.

## 8. 테스트 시나리오
### 8.1 단위 테스트
1. Room -> RoomRef 매핑.
2. `selectedInboxSpecial` 상태 전이.
3. `threadCount/teamUnreadCount` 계산.
4. `AIResponse` 스토어 상태 전이.
5. 고객 AI 화법 가드 후처리.

### 8.2 통합 테스트
1. 스레드 진입/닫기 토글 정상 동작.
2. 스레드 split-view 진입 시 히스토리 모드 해제.
3. 팀원 선택 후 팀방 생성 즉시 시작.
4. 팀방에서 AI 팀원 자동 응답.
5. `onSuggestReply` 호출 시 Assistant `AI 응답` 탭 자동 포커스.
6. GNB 컨택 추가 후 responding 목록 즉시 반영 및 선택.

### 8.3 회귀 테스트
1. 기존 검색/필터/큐/브랜드 동작 유지.
2. 기존 히스토리 모드 동작 유지.
3. Task 모듈 연동 유지.
4. `tsc --noEmit` 통과.
5. `vite build` 통과.
6. `@supabase/supabase-js` 미설치 상태 빌드 통과.

## 9. 완료 기준 (DoD)
1. thread/team 관련 기능은 `@deskit/team-chat` 경유로만 사용.
2. 인박스 하단 `스레드/팀` 버튼 동작 완료.
3. 인풋 헤더 스레드 버튼이 `스레드 대화`/`스레드 닫기` 전환 규칙 준수.
4. 팀대화 생성 후 실제 대화 시작 + AI 팀원 응답.
5. GNB 컨택 추가가 실제 상담중 룸으로 즉시 반영.
6. `onSuggestReply` 결과가 Assistant `AI 응답` 탭에 표출되고 포커스 이동.
7. Chat/Phone 모드 양쪽 동작 확인.
8. 빌드/타입체크 통과.

## 10. 가정 및 기본값
1. 패키지 경로는 `packages/team-chat`, alias는 `@deskit/team-chat` 고정.
2. 1차 포팅은 LocalStorage 기준 동작 보장.
3. Supabase는 인터페이스 자리만 유지.
4. AI 연동은 모듈 내부 직접 호출 금지, 호스트 콜백 기반 유지.
5. 기존 무관 변경 파일은 건드리지 않음.
