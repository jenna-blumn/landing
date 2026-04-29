# Team Chat 모듈 포팅 계획서
최종 업데이트: 2026-03-02

## 1. 목적
- 현재 저장소의 `packages/team-chat` 모듈(스레드 대화 + 팀 대화)을 타겟 프로젝트(`sortUI enhanced_sidebar_and_reference_ui`)에 이식한다.
- 타겟 프로젝트는 모듈 공개 API만 사용하고, 기존 소스 프로젝트 내부 서비스(`src/services/*`) 의존을 갖지 않도록 한다.
- 1차 포팅 목표는 **기능 재현 + 안정 실행**이며, UI는 타겟 디자인 시스템(sortUI) 기준으로 맞춘다.

## 2. 현재 기준선(As-Is)
- 모듈 엔트리: `packages/team-chat/src/index.ts`
- 제공 요소:
  - Provider/Context: `TeamChatModuleProvider`, `useTeamChatContext`
  - Thread 컴포넌트/훅
  - GroupChat 컴포넌트/훅
  - API 구현: `LocalStorageTeamChatApi`, `SupabaseTeamChatApi`, `createTeamChatApi`
  - 타입 계약: `types/*`
- 추가 상태:
  - 현재 앱은 `compat/supabaseCompat` 경유 코드가 일부 남아 있음
  - 로컬 실행을 위해 고객/대화 일부 서비스는 Local mock fallback을 적용함
  - 팀 대화 생성/조회는 `teamConversationService` localStorage fallback으로 동작 가능
  - 팀 대화 시작 시 기본 AI 컨설턴트 자동 참여 + 첫 메시지 자동 발신 동작
  - 고객 AI는 상담사 어투 금지 프롬프트 + 후처리 보정 로직 적용
  - Claude 호출은 `/api/claude` 프록시 기반으로 동작

## 3. 포팅 목표(To-Be)
- 타겟 프로젝트에서 아래만으로 동작:
  - `@deskit/team-chat` 단일 import
  - `TeamChatModuleProvider` + 공식 콜백 계약
  - `apiType: 'localStorage'` 또는 타겟 전용 API 어댑터
- 금지:
  - 타겟 프로젝트에서 소스 저장소 `src/services/*` 직접 import
  - `compat/supabaseCompat`를 장기 의존으로 사용

## 4. 범위
- 포함
  - Thread/GroupChat 모듈 기능 포팅
  - Provider 연결, host callbacks 연결
  - localStorage 기준 기능 검증
  - Claude 연동 경계 정리(호스트 책임)
- 제외(2차)
  - Supabase 스키마 고도화/운영 마이그레이션
  - 타겟 프로젝트의 전체 정보구조(IA) 재설계

## 5. 단계별 실행 계획

### Phase 0. 사전 준비
- `packages/team-chat`를 타겟 레포로 복사(또는 git subtree/submodule 정책 결정).
- 타겟 번들러 alias 설정:
  - `@deskit/team-chat -> packages/team-chat/src`
- TypeScript paths/include 동기화.
- 산출물
  - 빌드가 깨지지 않고 `import { TeamChatModuleProvider } from '@deskit/team-chat'` 가능

### Phase 1. 계약 고정
- 타겟에서 사용할 공개 계약 확정:
  - `TeamChatModuleProviderProps`
  - `TeamChatModuleConfig`
  - `TeamChatCallbacks`
  - 핵심 타입(`RoomRef`, `ChatMessage`, `ThreadRoom`, `GroupChatRoom`)
- `index.ts` 외부 export만 사용하도록 규칙 고정.
- 산출물
  - 포팅팀/타겟팀 공통 타입 문서 1부

### Phase 2. 데이터 모드 결정 및 어댑터 연결
- 1차는 `apiType: 'localStorage'` 기본값으로 붙인다.
- 타겟에서 서버 연동이 필요하면 `ITeamChatApi` 구현을 타겟 레포에 추가한다.
- `compat/supabaseCompat`는 임시 마이그레이션 기간에만 허용하고 제거 계획 포함.
- 산출물
  - 타겟 프로젝트에서 standalone 동작

### Phase 3. UI 배치 및 호스트 결합
- 호스트 배치 포인트 확정:
  - 스레드 진입 버튼 위치
  - 스레드 패널 위치(split-view / panel)
  - 팀채팅 위젯 위치(floating / embedded)
- `callbacks` 연결:
  - `onNavigateToRoom`
  - `onSuggestReply`
  - `onThreadOpenChange`, `onThreadCountChange`
  - `onUnreadCountChange`, `onWidgetOpenChange`
  - `onMessageSent`(선택)
- 산출물
  - 타겟 화면에서 클릭 플로우 단선 없이 동작

### Phase 4. AI 경계 이식
- 모듈 내부에서 Claude/Supabase 직접 호출하지 않는다.
- 타겟 호스트에서 `onSuggestReply`/`onMessageSent` 기반으로 AI 파이프라인 처리.
- 개발 환경:
  - `.env.local`에 `CLAUDE_API_KEY`
  - 필요 시 `VITE_CLAUDE_MODEL`
  - `/api/claude` 프록시(개발서버) 또는 타겟 백엔드 프록시
- 산출물
  - API 키 비노출 구조 유지(브라우저 direct key 사용 금지)

### Phase 5. 정리/제거
- 타겟 코드에서 legacy thread/team 로직 제거.
- 모듈 외부 thread/team 직접 서비스 호출 제거.
- `compat/*` 의존 0건 달성.
- 산출물
  - 유지보수 지점이 `packages/team-chat`로 단일화

## 6. 작업 분해(WBS)
- W1. 패키지 이동/alias/path 정리
- W2. Provider 주입부 작성(App shell)
- W3. Room 매핑 함수 작성(타겟 Room -> `RoomRef`)
- W4. callbacks 구현(라우팅/배지/AI 이벤트)
- W5. UI 자리잡기(split-view/floating)
- W6. 데이터 모드 연결(localStorage 또는 custom API)
- W7. 회귀 테스트 및 문서화

## 7. 테스트 계획

### 단위 테스트
- mention 파서 / AI 대상 파서
- mapper 유틸(Room -> RoomRef)
- LocalStorage API CRUD/unread count

### 통합 테스트
- 컨택 화면에서 스레드 생성/열기/닫기
- 스레드 메시지 송수신 + 참가자 추가
- 팀 대화방 생성/메시지/읽음 처리
- 팀 대화 생성 직후 AI 자동 참여/첫 메시지 자동 발신
- AI 고객 응답에서 상담사 어투 누수 방지 확인
- 콜백 payload 정확성 검증

### 회귀 테스트
- 기존 배지 카운트(스레드/팀) 동작
- split-view UX 재현
- `tsc --noEmit` 통과

## 8. 리스크 및 대응
- 리스크: 타겟 프로젝트 상태 모델과 `RoomRef` 불일치
  - 대응: 매핑 레이어 분리, 모듈 타입 직접 오염 금지
- 리스크: 구 서비스/모듈 병행으로 로직 중복
  - 대응: Phase 5에서 `compat` 제거를 완료조건에 포함
- 리스크: AI 모델명/키 설정 불일치로 런타임 오류
  - 대응: `.env.local` 검증 절차와 health check 추가

## 9. 완료 기준(DoD)
- 타겟 프로젝트에서 `@deskit/team-chat` 단일 진입으로 통합 완료
- 모듈 외부 thread/team legacy import 0건
- localStorage 모드에서 독립 실행 가능
- AI 연동은 콜백 계약으로만 동작
- 포팅 체크리스트/운영 가이드 문서 전달 완료

## 10. 실행 체크리스트
- [ ] alias/tsconfig 연결 완료
- [ ] `TeamChatModuleProvider` 연결 완료
- [ ] RoomRef 매핑 완료
- [ ] callbacks 연결 완료
- [ ] localStorage 모드 기능 검증 완료
- [ ] 스레드 split-view 동작 확인
- [ ] 팀대화 위젯/룸/메시지 동작 확인
- [ ] AI 이벤트 연동 확인
- [ ] `compat` 의존 제거
- [ ] 문서 및 샘플 코드 전달
