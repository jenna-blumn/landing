# 팀 채팅/스레드 대화 모듈화 가이드

> 이 문서는 다른 프로젝트에서 팀 채팅 및 스레드 대화 기능을 모듈화할 때 사용하는 가이드입니다.
> 추출된 모듈은 "Deskit" 컨택센터 상담 애플리케이션에 이식됩니다.

---

## 0. 기능 정의 — 스레드 대화 vs 팀 대화

이 모듈은 두 가지 기능을 포함합니다:

### 스레드 대화 (Thread)
- **목적**: 현재 컨택(고객 상담) 건에 대해 다른 상담사에게 도움을 요청하는 대화
- **진입점**: 컨택 입력창 영역의 스레드 대화 버튼
- **UI 위치**: 사이드바와 기존 컨택룸의 왼쪽에 별도 스레드 채팅창이 열림
- **참여자**: 호출한 상담사 + 호출된 상담사(복수 추가 가능)
- **카운트**: 스레드 대화 리스트에서 별도로 카운트됨
- **어시스턴트 연동**: 스레드에서 받은 조언을 기반으로 고객 답변을 생성하여 어시스턴트 영역에 표시
- **호스트 결합도**: 높음 (컨택 Room ID 참조, 레이아웃 배치는 호스트가 담당)

### 팀 대화 (Group Chat)
- **목적**: 컨택 건과 무관하게 팀원들끼리 자유롭게 대화하는 대화방
- **UI 위치**: 독립적인 플로팅 위젯 또는 패널
- **호스트 결합도**: 낮음 (완전 독립)

---

## 1. 대상 프로젝트(Deskit) 아키텍처 개요

Deskit은 React 18 + TypeScript + Vite 기반 SPA(컨택센터 상담 애플리케이션)입니다.

### 기술 스택
- React 18 + TypeScript (strict mode)
- Vite + @tailwindcss/vite (Tailwind CSS v4)
- @blumnai-studio/blumnai-design-system (sortUI) — 모든 UI 컴포넌트 및 아이콘
- pnpm (패키지 매니저)
- localStorage 기반 Mock API (백엔드 없음)
- 상태 관리: 커스텀 훅 기반 (Context/Zustand 거의 미사용)

### 프로젝트 구조
```
src/
├── App.tsx              # 전역 상태 허브 (40+ state, props drilling)
├── modes/               # 레이아웃 모드 (ChatMode, PhoneMode)
├── components/          # 공유 UI 영역
│   ├── SidebarArea/     # 사이드바 (컨택 목록, 대기열, 필터)
│   ├── ContactRoomArea/ # 대화방 (메시지 버블, 타임스탬프)
│   ├── ContactReferenceArea/ # 우측 참조 패널 (정보/이력/연동 탭)
│   ├── SearchArea/      # 검색 UI
│   └── HistoryContactMode/ # 이력 컨택 모드
├── features/            # 기능 모듈 (독립적 feature 단위)
│   ├── channelComposer/ # 메시지 발신 작성기 (chat/email/SMS/알림톡)
│   ├── customerTab/     # 고객 정보 탭
│   ├── contactTab/      # 상담 정보 탭
│   ├── history/         # 상담 이력
│   ├── search/          # 검색
│   ├── myKnowledge/     # 지식 베이스
│   └── integrations/    # OMS 연동
├── hooks/               # 공통 커스텀 훅
├── stores/              # Zustand (검색 전용, 예외적)
├── types/               # 공통 타입
└── data/                # 목업 데이터 (Room, Brand 인터페이스)
packages/
└── task-module/         # 독립 패키지 (할일 관리) ← 모듈화의 모범 사례
```

### 핵심 데이터 모델

```typescript
// Room — Deskit의 핵심 엔티티 (고객-상담사 1:1 대화)
interface Room {
  id: number;
  contactName: string;
  channel: 'chat' | 'email' | 'phone' | 'board';
  messages: ComposerMessage[];
  isOpen: boolean;
  mainCategory: 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  // ... 40+ 필드
}

interface ComposerMessage {
  id: number;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
  channel?: 'chat' | 'sms' | 'alimtalk' | 'email';
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
}
```

### 호스트 앱 통합 포인트 (스레드가 연동하는 영역)

1. **컨택 입력창 (ChannelComposer)** — 스레드 진입 버튼 배치 위치
2. **사이드바 + 컨택룸 왼쪽** — 스레드 채팅창 레이아웃 배치 위치
3. **어시스턴트 탭 (AssistantTabContent)** — 스레드 기반 답변 생성 결과 표시
4. **사이드바 스레드 리스트** — 활성 스레드 목록 및 카운트

---

## 2. 모범 사례: task-module 패키지 패턴 (반드시 참조)

Deskit의 `packages/task-module/`이 모듈화의 정석입니다.
이 패턴을 팀 채팅 모듈에 **동일하게** 적용하세요.

### 2.1 프로바이더 패턴 (실제 코드)

```typescript
// 호스트 앱이 auth, config, callbacks를 주입
interface TaskModuleProviderProps {
  auth: AuthConfig;              // { userId, userName, role, token }
  config: TaskModuleConfig;      // { displayMode, apiType, httpBaseUrl }
  callbacks?: TaskModuleCallbacks; // { onNavigateToRoom, renderContactPreview, ... }
  selectedRoom?: RoomRef | null; // 호스트 Room의 최소 인터페이스
  allRooms?: RoomRef[];
  children: React.ReactNode;
}

export const TaskModuleProvider: React.FC<TaskModuleProviderProps> = ({
  auth, config, callbacks = {}, selectedRoom = null, allRooms = [], children,
}) => {
  const api = useMemo(() => createTaskApi(config, auth), [...]);
  return (
    <AuthProvider auth={auth}>
      <TaskProvider api={api} auth={auth} config={config} callbacks={callbacks}
                    selectedRoom={selectedRoom} allRooms={allRooms}>
        {children}
      </TaskProvider>
    </AuthProvider>
  );
};
```

### 2.2 RoomRef 패턴 — 핵심

호스트 앱의 Room(40+ 필드)을 직접 참조하지 않고,
모듈이 필요한 **최소 필드만** 정의한 `RoomRef`를 사용:

```typescript
export interface RoomRef {
  id: number;
  contactName: string;
  conversationTopic?: string;
  brand?: string;
  channel?: string;
}
```

### 2.3 콜백 계약 (실제 코드)

```typescript
export interface TaskModuleCallbacks {
  onNavigateToRoom?: (roomId: number, messageId?: number | null) => void;
  renderContactPreview?: (roomId: number, onClose: () => void) => ReactNode;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  onTaskCreated?: (task: Task) => void;
}
```

### 2.4 index.ts 공개 API 구조 (실제 코드)

```typescript
// ── Providers ──
export { TaskModuleProvider } from './context/TaskModuleProvider';
export { useTaskContext } from './context/TaskContext';

// ── Components ──
export { default as TaskWidget } from './components/TaskWidget';
// ... 선별적 export

// ── Types ──
export type { Task, TaskType, CreateTaskInput, ... } from './types/task';
export type { AuthConfig, UserRole } from './types/auth';
export type { TaskModuleConfig, TaskModuleCallbacks } from './types/module';
export type { RoomRef } from './types/room';

// ── API interfaces ──
export type { ITaskApi } from './api/ITaskApi';
export { LocalStorageTaskApi } from './api/LocalStorageTaskApi';
export { createTaskApi } from './api/createApiClient';
```

---

## 3. 팀 채팅 모듈 폴더 구조

`packages/team-chat/` 단일 패키지, 내부에서 thread와 groupChat을 분리합니다.

```
packages/team-chat/
├── src/
│   ├── index.ts                  # 공개 API (모든 export는 여기서만)
│   │
│   ├── types/
│   │   ├── common.ts             # ChatMessage, ChatMember, Reaction (공통)
│   │   ├── thread.ts             # ThreadRoom, ThreadContext, ThreadReply
│   │   ├── groupChat.ts          # GroupChatRoom, GroupChatMessage
│   │   ├── module.ts             # TeamChatModuleConfig, TeamChatCallbacks
│   │   ├── auth.ts               # AuthConfig (task-module과 동일 구조)
│   │   └── room.ts               # RoomRef (호스트 Room 최소 인터페이스)
│   │
│   ├── thread/                   # ──── 스레드 대화 (컨택 종속) ────
│   │   ├── components/
│   │   │   ├── ThreadEntryButton.tsx    # 컨택 입력창에 배치할 진입 버튼
│   │   │   ├── ThreadPanel.tsx          # 스레드 채팅 패널 (메인)
│   │   │   ├── ThreadMessageList.tsx    # 스레드 메시지 목록
│   │   │   ├── ThreadComposer.tsx       # 스레드 메시지 입력
│   │   │   ├── ThreadList.tsx           # 활성 스레드 목록 (사이드바용)
│   │   │   ├── ThreadInviteModal.tsx    # 상담사 추가 초대 모달
│   │   │   └── ThreadSuggestReply.tsx   # 답변 생성 버튼/UI
│   │   └── hooks/
│   │       ├── useThread.ts             # 스레드 상태 관리
│   │       └── useThreadMessages.ts     # 스레드 메시지 CRUD
│   │
│   ├── groupChat/                # ──── 팀 대화 (독립) ────
│   │   ├── components/
│   │   │   ├── GroupChatWidget.tsx       # 플로팅 위젯 (진입 컴포넌트)
│   │   │   ├── GroupChatRoomList.tsx     # 팀 대화방 목록
│   │   │   ├── GroupChatRoom.tsx         # 개별 대화방
│   │   │   ├── GroupChatMessageList.tsx  # 메시지 목록
│   │   │   ├── GroupChatComposer.tsx     # 메시지 입력
│   │   │   └── MemberList.tsx           # 멤버 목록
│   │   └── hooks/
│   │       ├── useGroupChat.ts          # 팀 대화 상태 관리
│   │       └── useGroupChatMessages.ts  # 메시지 CRUD
│   │
│   ├── api/
│   │   ├── ITeamChatApi.ts              # API 인터페이스 (스레드+팀 통합)
│   │   ├── LocalStorageTeamChatApi.ts   # localStorage 구현
│   │   └── createTeamChatApi.ts         # 팩토리 함수
│   │
│   ├── context/
│   │   ├── TeamChatProvider.tsx          # 모듈 프로바이더 (최상위)
│   │   └── TeamChatContext.tsx           # 컨텍스트 정의
│   │
│   ├── utils/
│   │   └── chatUtils.ts
│   └── data/
│       └── mockChatData.ts              # 목업 데이터
```

---

## 4. 통합 계약 (Integration Contract)

### 4.1 모듈 설정 타입

```typescript
// types/module.ts
export type DisplayMode = 'floating' | 'embedded' | 'panel';

export interface TeamChatModuleConfig {
  displayMode: DisplayMode;
  apiType: 'localStorage' | 'http';
  httpBaseUrl?: string;
  portalContainerId?: string;
}

export interface TeamChatCallbacks {
  // ── 네비게이션 ──
  onNavigateToRoom?: (roomId: number) => void;         // 컨택 Room으로 이동

  // ── 스레드 전용 ──
  onSuggestReply?: (context: ThreadSuggestContext) => void;  // 어시스턴트에 답변 생성 요청
  onThreadOpenChange?: (isOpen: boolean, roomId?: number) => void; // 스레드 패널 열림/닫힘
  onThreadCountChange?: (count: number) => void;       // 활성 스레드 수 변경

  // ── 팀 대화 전용 ──
  onUnreadCountChange?: (count: number) => void;       // GNB 배지 업데이트
  onWidgetOpenChange?: (isOpen: boolean) => void;      // 위젯 열림/닫힘
}

// 어시스턴트 연동용 컨텍스트
export interface ThreadSuggestContext {
  threadId: string;
  roomId: number;                  // 원본 컨택 Room ID
  customerName: string;
  threadMessages: Array<{
    senderName: string;
    text: string;
    timestamp: string;
  }>;
  originalQuery?: string;          // 고객이 물어본 원래 질문
}
```

### 4.2 인증/Room 타입

```typescript
// types/auth.ts (task-module과 동일 구조)
export type UserRole = 'consultant' | 'manager';
export interface AuthConfig {
  userId: string;
  userName: string;
  role: UserRole;
  token: string;
  avatar?: string;
  groupId?: string;
}

// types/room.ts (호스트 Room의 최소 인터페이스)
export interface RoomRef {
  id: number;
  contactName: string;
  channel?: string;
}
```

### 4.3 도메인 타입

```typescript
// types/common.ts — 스레드와 팀 대화 공통
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  reactions?: Reaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
  mentions?: string[];
}

export interface ChatMember {
  userId: string;
  userName: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'online' | 'away' | 'offline';
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

// types/thread.ts — 스레드 대화 전용
export interface ThreadRoom {
  id: string;
  contactRoomId: number;           // 연결된 컨택 Room ID
  contactName: string;             // 고객 이름 (표시용)
  createdBy: string;               // 스레드 생성 상담사 ID
  participants: ChatMember[];      // 참여 상담사들
  messages: ChatMessage[];
  status: 'active' | 'resolved' | 'closed';
  unreadCount: number;
  createdAt: string;
  lastMessageAt: string;
  originalQuery?: string;          // 고객의 원래 질문 (컨텍스트)
}

// types/groupChat.ts — 팀 대화 전용
export interface GroupChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  members: ChatMember[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 4.4 API 인터페이스

```typescript
// api/ITeamChatApi.ts
export interface ITeamChatApi {
  // ── 스레드 대화 ──
  getThreadsByRoom(contactRoomId: number): Promise<ThreadRoom[]>;
  getActiveThreads(): Promise<ThreadRoom[]>;
  createThread(contactRoomId: number, input: CreateThreadInput): Promise<ThreadRoom>;
  addThreadParticipant(threadId: string, userId: string): Promise<void>;
  sendThreadMessage(threadId: string, input: SendMessageInput): Promise<ChatMessage>;
  resolveThread(threadId: string): Promise<void>;
  getThreadCount(): Promise<number>;

  // ── 팀 대화 ──
  getGroupChatRooms(): Promise<GroupChatRoom[]>;
  createGroupChatRoom(input: CreateGroupChatInput): Promise<GroupChatRoom>;
  sendGroupMessage(roomId: string, input: SendMessageInput): Promise<ChatMessage>;
  getGroupMessages(roomId: string, options?: { limit?: number }): Promise<ChatMessage[]>;

  // ── 공통 ──
  toggleReaction(messageId: string, emoji: string): Promise<void>;
  markAsRead(roomId: string): Promise<void>;
  editMessage(messageId: string, text: string): Promise<ChatMessage | null>;
  deleteMessage(messageId: string): Promise<boolean>;
  onDataUpdated(callback: () => void): () => void;
}
```

### 4.5 호스트 앱 통합 예시

```tsx
// App.tsx (Deskit) — 이렇게 통합됩니다
import {
  TeamChatModuleProvider,
  GroupChatWidget,        // 팀 대화 플로팅 위젯
  ThreadEntryButton,      // 스레드 진입 버튼 (컨택 입력창에 배치)
  ThreadPanel,            // 스레드 채팅 패널 (컨택룸 왼쪽에 배치)
  ThreadList,             // 스레드 목록 (사이드바에 배치)
} from '@deskit/team-chat';

function App() {
  return (
    <TeamChatModuleProvider
      auth={{ userId: 'consultant-001', userName: '김상담', role: 'consultant', token: '' }}
      config={{ displayMode: 'floating', apiType: 'localStorage' }}
      selectedRoom={selectedRoom
        ? { id: selectedRoom.id, contactName: selectedRoom.contactName }
        : null
      }
      callbacks={{
        onNavigateToRoom: (roomId) => setSelectedRoomId(roomId),
        onSuggestReply: (context) => {
          // 어시스턴트 탭에 답변 생성 결과 표시
          setAssistantSuggestion(context);
        },
        onThreadCountChange: (count) => setThreadBadgeCount(count),
        onUnreadCountChange: (count) => setTeamChatBadgeCount(count),
      }}
    >
      {/* 기존 레이아웃 */}
      <ChatModeContainer>
        {/* 호스트가 레이아웃 위치를 결정 */}
        <ThreadPanel />           {/* 컨택룸 왼쪽 */}
        <ContactRoomArea>
          <ThreadEntryButton />   {/* 입력창 영역 */}
        </ContactRoomArea>
        <Sidebar>
          <ThreadList />          {/* 사이드바 */}
        </Sidebar>
      </ChatModeContainer>

      <GroupChatWidget />         {/* 플로팅 위젯 (독립) */}
    </TeamChatModuleProvider>
  );
}
```

**핵심 원칙**: 모듈은 **컴포넌트를 export**하고, **호스트가 배치 위치를 결정**합니다.
모듈이 직접 DOM 위치를 잡지 않습니다 (Portal 사용 최소화).

---

## 5. 디자인 시스템 (sortUI) 마이그레이션

대상 프로젝트는 `@blumnai-studio/blumnai-design-system`(sortUI)을 필수 사용합니다.
원본 UI를 sortUI로 **100% 교체**해야 합니다.

### 5.1 컴포넌트 매핑

| 원본 패턴 | sortUI 대체 |
|-----------|------------|
| `<button className="...">` | `<Button>` |
| `<input type="text">` | `<Input />` |
| `<textarea>` | `<Textarea />` |
| 모달 | `<Dialog>` + `<DialogContent>` + `<DialogHeader>` + `<DialogFooter>` |
| 드롭다운 | `<DropdownMenu>` + `<DropdownMenuTrigger>` + `<DropdownMenuContent>` + `<DropdownMenuItem>` |
| 탭 | `<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>` |
| 뱃지 | `<Badge>` |
| 토글 | `<Switch>` |
| 스크롤 | `<ScrollArea>` |
| 아바타 | `<Avatar>` |

### 5.2 아이콘 변환

```tsx
// ❌ lucide-react 직접 import 금지
import { Send, Search } from 'lucide-react';

// ✅ DS Icon 컴포넌트 사용
import { Icon } from '@blumnai-studio/blumnai-design-system';
<Icon icon={['action', 'send']} size={16} />
<Icon icon={['action', 'search']} size={16} />
<Icon icon={['navigation', 'chevron-down']} size={14} />
<Icon icon={['navigation', 'close']} size={16} />
<Icon icon={['communication', 'chat']} size={20} />
<Icon icon={['action', 'edit']} size={14} />
<Icon icon={['action', 'delete']} size={14} />
```

**주의:** 정확한 아이콘 이름은 DS에서 확인 필요.
불확실한 아이콘은 `{/* TODO: DS 아이콘 확인 필요 — 원본: IconName */}` 주석 표시.

### 5.3 색상 규칙

```tsx
// ❌ 하드코딩 금지
className="bg-blue-500 text-white border-gray-200"

// ✅ 시맨틱 토큰 사용
className="bg-primary text-primary-foreground border-border"

// 주요 토큰:
// 배경: bg-background, bg-card, bg-muted, bg-primary, bg-secondary
// 텍스트: text-foreground, text-muted-foreground, text-primary
// 테두리: border-border, border-input
// 상태: bg-destructive, bg-success, bg-warning, bg-info
```

레이아웃 유틸리티(flex, gap, p-2, rounded 등)는 자유롭게 사용.
**색상 관련 클래스만** 시맨틱 토큰 필수.

---

## 6. 코딩 컨벤션

- UI 텍스트: **한국어** (버튼, 레이블, 플레이스홀더, 에러 메시지)
- 변수/함수명: 영어 camelCase
- 컴포넌트: 함수형 + React.FC, default export
- 훅: `use` 접두사, named export
- `any` 사용 금지
- 미사용 변수/import 금지
- Props 인터페이스는 컴포넌트 파일 상단에 정의

---

## 7. 안티패턴 — 절대 하지 말 것

- ❌ 호스트 앱 타입/컴포넌트 직접 import (RoomRef 패턴 사용)
- ❌ lucide-react 직접 import (DS Icon 사용)
- ❌ 원시 HTML로 UI 구성 (`<button className="...">`)
- ❌ 하드코딩 색상 (`bg-blue-500`)
- ❌ 호스트 앱 상태 직접 참조 (콜백으로만 소통)
- ❌ 과도한 추상화 (EventBus, Middleware, Plugin 등)
- ❌ 모듈 외부에서 Context 직접 사용 (프로바이더 내부에서만)

---

## 8. 호스트 앱 설정 (참고)

```typescript
// vite.config.ts — alias 추가
resolve: {
  alias: {
    '@deskit/team-chat': path.resolve(__dirname, 'packages/team-chat/src'),
  },
},

// tsconfig.app.json — paths 추가
"paths": {
  "@deskit/team-chat": ["./packages/team-chat/src"],
  "@deskit/team-chat/*": ["./packages/team-chat/src/*"]
}
"include": ["src", "packages/task-module/src", "packages/team-chat/src"]
```

---

## 9. 작업 단계

| Phase | 내용 |
|-------|------|
| 1 | **분석** — 팀 채팅/스레드 관련 파일 식별, 외부 의존성 파악 |
| 2 | **타입 정의** — types/ 폴더에 공통/스레드/팀 대화 인터페이스 작성 |
| 3 | **API 계층** — ITeamChatApi 인터페이스 + localStorage 구현 + mock 데이터 |
| 4 | **상태 관리** — 커스텀 훅 + Context/Provider (프로바이더 패턴) |
| 5 | **UI 컴포넌트** — sortUI DS로 100% 교체, thread/와 groupChat/ 내부 분리 |
| 6 | **index.ts** — 공개 API 정리, 호스트 통합 코드 샘플 작성 |
| 7 | **검증** — TypeScript 타입 체크, 호스트 앱 import 0건 확인 |

---

## 10. 완성도 체크리스트

### 구조
- [ ] packages/team-chat/src/ 구조가 가이드와 일치
- [ ] thread/와 groupChat/ 서브폴더 분리
- [ ] index.ts에 공개 API 정의 완료
- [ ] 호스트 앱 파일에 대한 import 0개 (완전 독립)

### 타입
- [ ] 공통 타입(ChatMessage, ChatMember) — types/common.ts
- [ ] 스레드 타입(ThreadRoom) — types/thread.ts
- [ ] 팀 대화 타입(GroupChatRoom) — types/groupChat.ts
- [ ] 모듈 설정(TeamChatModuleConfig) + 콜백(TeamChatCallbacks) — types/module.ts
- [ ] ThreadSuggestContext (어시스턴트 연동) 정의
- [ ] RoomRef 패턴 적용
- [ ] `any` 타입 0건

### UI/DS
- [ ] 원시 HTML button/input 사용 0건
- [ ] lucide-react import 0건 — 모든 아이콘 DS Icon 사용
- [ ] 하드코딩 색상 0건 — 시맨틱 토큰만 사용
- [ ] 모든 UI 텍스트 한국어

### 스레드 컴포넌트
- [ ] ThreadEntryButton — 컨택 입력창 배치용
- [ ] ThreadPanel — 스레드 채팅 메인 패널
- [ ] ThreadList — 사이드바 스레드 목록
- [ ] ThreadInviteModal — 상담사 추가 초대
- [ ] ThreadSuggestReply — 답변 생성 트리거

### 팀 대화 컴포넌트
- [ ] GroupChatWidget — 플로팅 진입 위젯
- [ ] GroupChatRoomList — 대화방 목록
- [ ] GroupChatRoom — 개별 대화방
- [ ] GroupChatComposer — 메시지 입력

### 상태/API
- [ ] 프로바이더 패턴 (auth, config, callbacks 주입)
- [ ] ITeamChatApi 인터페이스 (스레드+팀 대화 통합)
- [ ] LocalStorageTeamChatApi 구현
- [ ] localStorage key: `teamChat_` 접두사
- [ ] 커스텀 훅 기반 상태 관리
- [ ] Mock 데이터 포함
