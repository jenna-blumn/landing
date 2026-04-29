# Team Chat 모듈 포팅 핸드오프
최종 업데이트: 2026-03-02

## 1. 구현 위치
- 모듈 루트: `packages/team-chat`
- 공개 엔트리: `packages/team-chat/src/index.ts`
- 호스트 연동 alias:
  - `vite.config.ts` -> `@deskit/team-chat`
  - `tsconfig.app.json` -> `paths` + `include` 반영 완료

## 2. 현재 구현 상태
- `TeamChatModuleProvider` / `useTeamChatContext` 구현 완료
- 타입 계약 완료
  - `AuthConfig`, `RoomRef`
  - `ChatMessage`, `ChatMember`, `ThreadRoom`, `GroupChatRoom`
  - `TeamChatModuleConfig`, `TeamChatCallbacks`, `ThreadSuggestContext`
- API 구현체 완료
  - `LocalStorageTeamChatApi`
  - `SupabaseTeamChatApi`
  - `createTeamChatApi` 팩토리
- 훅 구현 완료
  - `useThread`, `useThreadMessages`
  - `useGroupChat`, `useGroupChatMessages`
- 컴포넌트 스캐폴드 완료
  - thread: `ThreadEntryButton`, `ThreadPanel`, `ThreadList`, `ThreadSplitView`, `ThreadMessageList`, `ThreadComposer`, `ThreadInviteModal`, `ThreadSuggestReply`
  - groupChat: `GroupChatWidget`, `GroupChatRoomList`, `GroupChatRoom`, `GroupChatMessageList`, `GroupChatComposer`, `MemberList`
- 로컬 동작 보강 완료
  - `agentService`: Supabase 실패/미설정 시 mock agent fallback
  - `teamConversationService`: 팀 대화 조회/생성/컨텍스트의 localStorage fallback
  - `conversationService`/`messageService`/`customerService`/`orderService`: 로컬 mock 경로 동작
- 팀 대화 시작 UX 보강 완료
  - 팀 대화 생성 시 기본 AI 컨설턴트 자동 참여
  - 생성 직후 AI 첫 안내 메시지 자동 발신
- 고객 AI 역할 경계 보강 완료
  - 고객 AI 시스템 프롬프트에 상담사 어투 금지 규칙 추가
  - 상담사 어투 탐지 시 고객 말투 재작성(보정) 로직 추가

## 3. 기존 앱 교체 범위
- `App.tsx`는 `TeamChatModuleProvider`로 래핑됨
- 기존 thread/team 관련 서비스 import는 컴포넌트 기준으로 모듈 경유로 교체됨
  - `AgentDesk.tsx`
  - `ConversationList.tsx`
  - `MessageBubble.tsx`
  - `MessageInput.tsx`
  - `TeamChatModal.tsx`

## 4. 호환 계층(중요)
- 경로: `packages/team-chat/src/compat/supabaseCompat.ts`
- 목적: 기존 코드 변경량을 최소화하면서 `@deskit/team-chat` 단일 경유를 강제
- 현재는 기존 서비스 시그니처를 유지하는 래퍼를 제공
  - `createMentionThread`, `createGroupMentionThread`, `getMyThreadConversations`, `createTeamChatWithParticipants` 등

## 5. 타겟(sortUI) 포팅 시 체크포인트
1. `compat` 레이어 제거 여부 결정
2. UI를 sortUI 컴포넌트로 치환
3. `lucide-react` 직접 사용 제거
4. 색상 하드코딩 제거(semantic token 전환)
5. Provider `callbacks.onSuggestReply`를 Assistant 탭과 연결
6. `displayMode` 별 배치 정책 적용 (`floating` / `embedded` / `panel`)
7. 팀 대화 시작 시 AI 자동 참여 정책 유지 여부 결정
8. 고객 AI 프롬프트 금지 규칙(상담사 어투 차단) 정책을 타겟에도 동일 반영

## 6. 남은 권장 작업
1. `compat` 경유 없이 `useThread`/`useGroupChat` 기반으로 `AgentDesk` 내부 오케스트레이션 추가 분해
2. `TeamChatCallbacks.onMessageSent`를 AI 자동응답 파이프라인에 연결
3. 모듈 전용 테스트(mention 파싱, LocalStorage CRUD, Supabase 매핑) 추가

## 7. 알려진 이슈/주의사항
- Supabase 미설정 환경에서는 일부 legacy 경로(예: mention/thread 관련 기존 서비스)가 `placeholder.supabase.co` 호출 오류 로그를 남길 수 있음.
- 포팅 대상에서는 `apiType: 'localStorage'` 또는 타겟 전용 `ITeamChatApi` 구현으로 legacy Supabase 경로를 제거하는 것을 권장.
