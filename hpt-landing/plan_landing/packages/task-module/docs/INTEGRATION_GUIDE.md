# @deskit/task-module 연동 가이드

## 목차

1. [개요](#1-개요)
2. [설치 방법](#2-설치-방법)
3. [기본 사용법 (Quick Start)](#3-기본-사용법-quick-start)
4. [설정 옵션 상세](#4-설정-옵션-상세)
5. [디스플레이 모드](#5-디스플레이-모드)
6. [API 모드 전환](#6-api-모드-전환)
7. [호스트 앱 연동](#7-호스트-앱-연동)
8. [해피톡 Next.js 포팅 가이드](#8-해피톡-nextjs-포팅-가이드)
9. [컴포넌트 직접 사용 (고급)](#9-컴포넌트-직접-사용-고급)
10. [트러블슈팅](#10-트러블슈팅)
11. [말풍선-할일 연동](#11-말풍선-할일-연동-bubble-to-task-integration)

---

## 1. 개요

`@deskit/task-module`은 데스크잇(Deskit) 컨택센터 상담 애플리케이션을 위한 **독립형 할일 관리 모듈**이다.

### 주요 특징

| 특징                      | 설명                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **독립 실행 가능**  | `TaskModuleProvider`로 감싸기만 하면 어느 React 앱에서든 바로 동작                         |
| **듀얼 API 모드**   | `localStorage` (프로토타입/개발용) 와 `http` (운영 서버 연동) 중 선택                    |
| **디스플레이 모드** | `floating` / `fixed` / `gnb` / `rnb` — 4가지 버튼 배치 모드 지원                       |
| **역할 기반 권한**  | `manager` (관리자) / `consultant` (상담사) 역할에 따라 공지 생성, 대상 지정 등 기능 분리 |
| **컨택룸 연동**     | 현재 선택된 대화방(Room)과 할일을 연결하여 상담 맥락 유지                                    |
| **공지사항 관리**   | 관리자가 공지를 작성하면 대상 상담사에게 읽음 확인 추적 가능                                 |

### 모듈 구조

```
packages/task-module/
  src/
    index.ts                  # 모든 public export
    context/
      TaskModuleProvider.tsx   # 최상위 Provider (Auth + Task 통합)
      TaskContext.tsx           # 할일 상태 관리 Context
      AuthContext.tsx           # 인증/권한 Context
    api/
      ITaskApi.ts              # 할일 API 인터페이스
      IConsultantApi.ts        # 상담원 API 인터페이스
      createApiClient.ts       # API 팩토리 (apiType에 따라 구현체 선택)
      LocalStorageTaskApi.ts   # localStorage 구현체
      HttpTaskApi.ts           # HTTP 구현체
    components/
      TaskFloatingButton.tsx   # 플로팅 버튼 (할일 카운트 배지)
      TaskNavButton.tsx        # GNB/RNB 네비게이션 바 버튼 (뱃지 + 호버 팝오버)
      TaskDrawer.tsx           # 할일 서랍 패널
      TaskDetailView.tsx       # 상세 뷰 / 공지 작성
      TaskCalendar.tsx         # 캘린더 뷰
      TaskBoard.tsx            # 칸반 보드 뷰
      ...
    types/
      module.ts                # TaskModuleConfig, DisplayMode, Callbacks
      auth.ts                  # AuthConfig, UserRole
      room.ts                  # RoomRef
      task.ts                  # Task, TaskType, TaskStatus 등
      consultant.ts            # Consultant, ConsultantGroup
    hooks/
    utils/
```

---

## 2. 설치 방법

### 현재 프로젝트 내 패키지로 사용 (모노레포)

현재 데스크잇 프로젝트에서는 `packages/task-module` 경로에 모듈이 포함되어 있다. `tsconfig.json`의 path alias를 통해 참조한다.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@deskit/task-module": ["./packages/task-module/src"],
      "@deskit/task-module/*": ["./packages/task-module/src/*"]
    }
  }
}
```

Vite 사용 시 `vite.config.ts`에서도 alias를 설정한다:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@deskit/task-module': path.resolve(__dirname, 'packages/task-module/src'),
    },
  },
});
```

### 향후 npm 패키지로 분리 시

`package.json`에 이미 패키지명이 `@deskit/task-module`로 정의되어 있다. npm 레지스트리(또는 사내 레지스트리)에 퍼블리시한 뒤 일반 의존성으로 설치하면 된다:

```bash
npm install @deskit/task-module
```

**Peer Dependencies** (호스트 앱에서 제공해야 하는 라이브러리):

| 패키지           | 버전      |
| ---------------- | --------- |
| `react`        | ^18.0.0   |
| `react-dom`    | ^18.0.0   |
| `lucide-react` | >=0.300.0 |

> **참고**: 할일 모듈은 아이콘에 `lucide-react`를 직접 사용한다. 호스트 앱이 별도의 디자인 시스템(예: `@blumnai-studio/blumnai-design-system`의 `Icon` 컴포넌트)을 사용하더라도 모듈 내부는 독립적으로 `lucide-react`에 의존하므로, 호스트 앱에 `lucide-react`가 설치되어 있어야 한다.

**Tailwind CSS 설정** (모노레포에서 모듈 스타일이 적용되려면):

할일 모듈은 Tailwind 유틸리티 클래스를 사용하므로, 호스트 앱의 Tailwind 설정에서 모듈 소스 경로를 스캔 대상에 포함해야 한다.

**Tailwind v4** (`@tailwindcss/vite` 사용 시):

```css
/* index.css */
@import "tailwindcss";
@source "../packages/task-module/src/**/*.tsx";
```

**Tailwind v3** (`tailwind.config.ts` 사용 시):

```ts
// tailwind.config.ts
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './packages/task-module/src/**/*.{js,ts,jsx,tsx}',
],
```

---

## 3. 기본 사용법 (Quick Start)

### 최소 구성 (localStorage 모드)

가장 빠르게 동작을 확인할 수 있는 구성이다. 별도 백엔드 없이 브라우저 localStorage에 데이터를 저장한다.

`TaskWidget`은 `displayMode` 설정에 따라 플로팅 버튼, 드로워, 상세 뷰를 자동으로 렌더링하는 통합 컴포넌트이다.

```tsx
import { TaskModuleProvider, TaskWidget } from '@deskit/task-module';

function App() {
  return (
    <TaskModuleProvider
      auth={{
        userId: 'user-001',
        userName: '홍길동',
        role: 'consultant',
        token: '',
      }}
      config={{
        displayMode: 'floating',
        apiType: 'localStorage',
      }}
    >
      {/* 기존 앱 컴포넌트 */}
      <YourApp />

      {/* 할일 모듈 UI — TaskWidget 하나로 모든 UI 자동 렌더링 */}
      <TaskWidget />
    </TaskModuleProvider>
  );
}
```

> **참고**: 개별 컴포넌트(`TaskFloatingButton`, `TaskDrawer`, `TaskDetailView` 등)를 직접 import하여 커스텀 레이아웃을 구성할 수도 있다. [9장 컴포넌트 직접 사용](#9-컴포넌트-직접-사용-고급) 참조.

### HTTP 모드 구성

운영 서버 API와 연동하는 구성이다. 인증 토큰과 API 기본 URL을 지정한다.

```tsx
<TaskModuleProvider
  auth={{
    userId: 'user-001',
    userName: '홍길동',
    role: 'manager',
    token: 'eyJhbGciOiJIUzI1NiIs...', // JWT 토큰
    groupId: 'group-cs-01',
  }}
  config={{
    displayMode: 'floating',
    apiType: 'http',
    httpBaseUrl: 'https://api.deskit.io/v1/tasks',
    statsRefreshIntervalMs: 15000,   // 15초마다 통계 갱신
    portalContainerId: 'task-portal', // Portal 렌더링 대상 DOM ID
  }}
  callbacks={{
    onNavigateToRoom: (roomId, messageId) => {
      router.push(`/room/${roomId}`);
      if (messageId) setScrollToMessageId({ roomId, messageId, nonce: Date.now() });
    },
    onDrawerOpenChange: (isOpen) => console.log('드로워:', isOpen),
    onDetailViewOpenChange: (isActive) => console.log('상세뷰:', isActive),
    onTaskCreated: (task) => { /* 배지 맵 업데이트 — 11.5절 참조 */ },
    onTaskDeleted: (task) => { /* 배지 맵 제거 — 11.5절 참조 */ },
  }}
  selectedRoom={currentRoom}
  allRooms={rooms}
>
  <YourApp />
  <TaskWidget />
</TaskModuleProvider>
```

---

## 4. 설정 옵션 상세

### 4.1 TaskModuleConfig

`TaskModuleProvider`의 `config` prop으로 전달하는 모듈 설정 객체이다.

```ts
interface TaskModuleConfig {
  displayMode: DisplayMode;
  apiType: 'localStorage' | 'http';
  httpBaseUrl?: string;
  statsRefreshIntervalMs?: number;
  portalContainerId?: string;
  buttonDisplayMode?: 'floating' | 'fixed' | 'sidebar-fixed' | 'gnb' | 'rnb';
  buttonFixedHeight?: number;
}

type DisplayMode = 'floating' | 'embedded';
```

| 필드                       | 타입                                            |             필수             | 기본값           | 설명                                                                    |
| -------------------------- | ----------------------------------------------- | :--------------------------: | ---------------- | ----------------------------------------------------------------------- |
| `displayMode`            | `DisplayMode`                                 |              O              | -                | UI 표시 방식 (`floating` / `embedded`). [5장 참조](#5-디스플레이-모드) |
| `apiType`                | `'localStorage' \| 'http'`                     |              O              | -                | 데이터 저장소 종류. [6장 참조](#6-api-모드-전환)                         |
| `httpBaseUrl`            | `string`                                      | `apiType='http'`일 때 필수 | -                | HTTP API 기본 URL. 미지정 시 런타임 에러 발생                           |
| `statsRefreshIntervalMs` | `number`                                      |              X              | `30000` (30초) | 할일 통계(카운트) 자동 갱신 주기(밀리초)                                |
| `portalContainerId`      | `string`                                      |              X              | -                | 드로워/모달 등이 렌더링될 Portal 컨테이너의 DOM ID                      |
| `buttonDisplayMode`      | `'floating' \| 'fixed' \| 'gnb' \| 'rnb'`      |              X              | `'gnb'`        | 할일 버튼 표시 위치. [5장 참조](#5-디스플레이-모드)                     |
| `buttonFixedHeight`      | `number`                                      |              X              | `300`          | `fixed` 모드일 때 드로워 높이                                          |

### 4.2 AuthConfig

`TaskModuleProvider`의 `auth` prop으로 전달하는 인증 정보 객체이다.

```ts
type UserRole = 'consultant' | 'manager';

interface AuthConfig {
  userId: string;
  userName: string;
  role: UserRole;
  token: string;
  groupId?: string;
}
```

| 필드         | 타입         | 필수 | 설명                                                                            |
| ------------ | ------------ | :--: | ------------------------------------------------------------------------------- |
| `userId`   | `string`   |  O  | 현재 로그인 사용자 고유 ID                                                      |
| `userName` | `string`   |  O  | 사용자 표시 이름 (공지 작성자명, 할일 생성자명 등에 사용)                       |
| `role`     | `UserRole` |  O  | `'consultant'` (상담사) 또는 `'manager'` (관리자). 공지 생성 권한 등을 결정 |
| `token`    | `string`   |  O  | API 인증 토큰.`apiType='localStorage'`일 때는 빈 문자열(`''`) 가능          |
| `groupId`  | `string`   |  X  | 소속 그룹 ID. 공지 대상 필터링 등에 사용                                        |

**역할별 기능 차이:**

| 기능                  | `consultant` | `manager` |
| --------------------- | :------------: | :---------: |
| 할일 생성/수정/삭제   |       O       |      O      |
| 할일 완료/좋아요/고정 |       O       |      O      |
| 공지사항 생성         |       X       |      O      |
| 공지 대상 지정        |       X       |      O      |
| 공지 읽음 확인 추적   |     본인만     | 전체 상담사 |

### 4.3 TaskModuleCallbacks

`TaskModuleProvider`의 `callbacks` prop으로 전달하는 콜백 객체이다. 모든 필드가 선택적이다.

```ts
interface TaskModuleCallbacks {
  onNavigateToRoom?: (roomId: number, messageId?: number | null) => void;
  renderContactPreview?: (roomId: number, onClose: () => void) => ReactNode;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  onDetailViewOpenChange?: (isActive: boolean) => void;
  onTaskCreated?: (task: Task) => void;
  onTaskDeleted?: (task: Task) => void;
}
```

| 콜백                       | 호출 시점                               | 매개변수                                      | 용도                                                                                                                        |
| -------------------------- | --------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `onNavigateToRoom`       | 할일에 연결된 컨택룸을 클릭할 때        | `roomId: number, messageId?: number \| null` | 호스트 앱의 라우터로 해당 대화방 이동.`messageId`가 있으면 해당 말풍선 위치로 스크롤                                      |
| `renderContactPreview`   | 할일에 연결된 컨택 미리보기를 표시할 때 | `roomId: number, onClose: () => void`       | 호스트 앱이 커스텀 컨택 미리보기 UI를 반환.`onClose`를 호출하면 오버레이가 닫힌다. [7.2절 참조](#72-컨택-미리보기-렌더-슬롯) |
| `onDrawerOpenChange`     | 할일 드로워가 열리거나 닫힐 때          | `isOpen: boolean`                           | 호스트 앱의 레이아웃 조정 (예: 사이드 패널 너비 변경)                                                                       |
| `onDetailViewOpenChange` | 상세 뷰가 활성/비활성될 때              | `isActive: boolean`                         | 호스트 앱의 레이아웃 조정                                                                                                   |
| `onTaskCreated`          | 할일이 새로 저장될 때                   | `task: Task`                                | 말풍선-할일 배지 맵 업데이트 등 호스트 앱의 후처리.[11.5절 참조](#115-messageid-기반-스크롤-연동)                              |
| `onTaskDeleted`          | 할일이 삭제될 때                        | `task: Task`                                | 말풍선 체크 배지 제거. 삭제된 할일의 `roomId`와 `messageId`로 배지 맵에서 해당 항목 삭제                                |

### 4.4 RoomRef (컨택룸 연동)

`TaskModuleProvider`의 `selectedRoom`과 `allRooms` prop으로 전달하는 컨택룸 참조 객체이다.

```ts
interface RoomRef {
  id: number;
  contactName: string;
  conversationTopic?: string;
  brand?: string;
  channel?: string;
}
```

| 필드                  | 타입       | 필수 | 설명                  |
| --------------------- | ---------- | :--: | --------------------- |
| `id`                | `number` |  O  | 대화방 고유 ID        |
| `contactName`       | `string` |  O  | 고객/상대방 이름      |
| `conversationTopic` | `string` |  X  | 상담 주제             |
| `brand`             | `string` |  X  | 브랜드명              |
| `channel`           | `string` |  X  | 채널 (chat, phone 등) |

**사용 예시:**

```tsx
const selectedRoom: RoomRef = {
  id: 42,
  contactName: '김철수',
  conversationTopic: '배송 문의',
  brand: '해피샵',
  channel: 'chat',
};

const allRooms: RoomRef[] = [selectedRoom, /* ... */];

<TaskModuleProvider
  auth={authConfig}
  config={moduleConfig}
  selectedRoom={selectedRoom}
  allRooms={allRooms}
>
  ...
</TaskModuleProvider>
```

할일 생성 시 `selectedRoom`의 `id`가 `Task.roomId`에 자동 연결된다. `allRooms`는 할일 목록에서 연결된 컨택 정보를 표시할 때 참조된다.

### 4.5 prefillData (말풍선-할일 프리필)

`TaskModuleProvider`의 `prefillData` prop으로 전달하는 할일 프리필 데이터이다. 말풍선에서 AI가 자동 생성한 할일 데이터를 에디터에 미리 채울 때 사용한다.

```ts
// prefillData의 타입은 TaskModulePrefillData | null
interface TaskModulePrefillData extends CreateTaskInput {
  messageId?: number | null;
}

interface CreateTaskInput {
  type: TaskType;
  title: string;
  description?: string;
  scheduledDate?: string | null;
  deadline?: string | null;
  parentId?: string | null;
  roomId?: number | null;
  messageId?: number | null;
  backgroundColor?: string | null;
}
```

| 필드            | 타입                             | 필수 | 설명                                                                                               |
| --------------- | -------------------------------- | :--: | -------------------------------------------------------------------------------------------------- |
| `prefillData` | `TaskModulePrefillData \| null` |  X  | `null`이면 프리필 없음. 값이 전달되면 드로워가 자동으로 열리며 인라인 에디터에 데이터가 채워진다 |

**사용 예시:**

```tsx
const [prefillTaskData, setPrefillTaskData] = useState<CreateTaskInput | null>(null);

<TaskModuleProvider
  auth={authConfig}
  config={moduleConfig}
  prefillData={prefillTaskData}
  callbacks={{
    onTaskCreated: () => setPrefillTaskData(null), // 생성 완료 시 프리필 초기화
  }}
>
  <YourApp />
  <TaskWidget />
</TaskModuleProvider>
```

> **참고**: `prefillData`가 설정되면 드로워가 자동으로 열리고, 인라인 에디터가 활성화된다. 사용자가 검토 후 저장하면 `onTaskCreated` 콜백이 호출된다. 상세 흐름은 [11장 말풍선-할일 연동](#11-말풍선-할일-연동-bubble-to-task-integration) 참조.

---

## 5. 디스플레이 모드

`config.buttonDisplayMode`로 할일 버튼의 표시 위치를 결정한다. 총 4가지 모드를 지원한다.

| 모드        | 설명                                       | 기본값 |
| ----------- | ------------------------------------------ | :----: |
| `'gnb'`     | GNB(좌측 네비게이션 바) 하단에 버튼 배치   |   O   |
| `'rnb'`     | RNB(우측 네비게이션 바) 하단에 버튼 배치   |        |
| `'floating'` | 화면 위 드래그 가능한 플로팅 버튼          |        |
| `'fixed'`   | 레퍼런스 패널 하단에 고정 버튼             |        |

### 5.1 gnb (GNB 하단 배치) — 기본값

```tsx
config={{ displayMode: 'floating', apiType: 'localStorage', buttonDisplayMode: 'gnb' }}
```

- GNB(좌측 글로벌 네비게이션 바) 최하단에 32×32 크기의 `TaskNavButton`이 배치된다.
- 미확인 할일이 있으면 빨간색 뱃지(카운트)가 표시된다.
- 호버 시 공지/진행/지연/즐겨찾기 현황을 보여주는 미니 팝오버가 우측으로 펼쳐진다.
- 클릭 시 GNB 우측에서 드로워가 열린다.
- 호스트 앱의 GNB 컴포넌트에서 `useTaskContext()`를 통해 직접 렌더링해야 한다.

```tsx
import { useTaskContext, TaskNavButton } from '@deskit/task-module';

const GNBTaskButton: React.FC = () => {
  const { stats, unseenChanges, isDrawerOpen, openDrawer, buttonDisplayMode } = useTaskContext();
  if (buttonDisplayMode !== 'gnb') return null;
  return (
    <div className="pb-4 pt-2 flex-shrink-0 border-t flex justify-center">
      <TaskNavButton
        placement="gnb"
        stats={stats}
        unseenChanges={unseenChanges}
        isDrawerOpen={isDrawerOpen}
        onClick={() => openDrawer()}
      />
    </div>
  );
};
```

### 5.2 rnb (RNB 하단 배치)

```tsx
config={{ displayMode: 'floating', apiType: 'localStorage', buttonDisplayMode: 'rnb' }}
```

- RNB(우측 네비게이션 바) 최하단에 `TaskNavButton`이 배치된다.
- 호버 팝오버는 좌측으로 펼쳐진다.
- 클릭 시 RNB 좌측에서 드로워가 열린다 (`openDirection: 'left'`).
- GNB와 동일한 패턴으로 호스트 앱의 RNB 컴포넌트에서 직접 렌더링한다.

```tsx
const RNBTaskButton: React.FC = () => {
  const { stats, unseenChanges, isDrawerOpen, openDrawer, buttonDisplayMode } = useTaskContext();
  if (buttonDisplayMode !== 'rnb') return null;
  return (
    <div className="pb-4 pt-2 flex-shrink-0 border-t flex justify-center">
      <TaskNavButton
        placement="rnb"
        stats={stats}
        unseenChanges={unseenChanges}
        isDrawerOpen={isDrawerOpen}
        onClick={() => openDrawer()}
      />
    </div>
  );
};
```

### 5.3 floating (플로팅 버튼 + 드로워)

```tsx
config={{ displayMode: 'floating', apiType: 'localStorage', buttonDisplayMode: 'floating' }}
```

- 화면 하단에 드래그 가능한 플로팅 버튼이 표시된다.
- 버튼에는 할일 카운트 배지가 포함된다.
- 클릭 시 할일 드로워(서랍 패널)가 열린다.
- 버튼 위치는 localStorage에 자동 저장되어 새로고침 후에도 유지된다.
- `<TaskWidget />`이 자동으로 렌더링하므로 호스트 앱에서 별도 코드 불필요.

### 5.4 fixed (레퍼런스 패널 하단 고정)

```tsx
config={{ displayMode: 'embedded', apiType: 'localStorage', buttonDisplayMode: 'fixed' }}
```

- 플로팅 버튼 대신 호스트 앱의 레퍼런스 패널 하단에 고정 버튼이 표시된다.
- `buttonFixedHeight`로 드로워 높이를 조절할 수 있다 (기본값 300px).
- 호스트 앱에서 `buttonDisplayMode === 'fixed'` 조건으로 직접 렌더링해야 한다.

```tsx
import { TaskModuleProvider, TaskDrawer } from '@deskit/task-module';

function ReferenceSidebar() {
  return (
    <div className="sidebar-container relative h-full">
      <div className="content">...</div>
      <TaskDrawer
        mode="embedded"
        isOpen={true}
        onCloseSimple={() => console.log('닫기 클릭')}
      />
    </div>
  );
}
```

### 5.5 버튼 배치 모드 우선순위

`buttonDisplayMode`는 다음 우선순위로 결정된다:

1. `config.buttonDisplayMode` (코드에서 직접 전달)
2. `localStorage('referenceSettings').taskButton.displayMode` (사용자 설정 저장값)
3. 기본값: `'gnb'`

레퍼런스 설정 패널에서 사용자가 모드를 변경하면 `setButtonDisplayMode()`를 통해 런타임에 전환되며, localStorage에 자동 저장된다.

### 5.6 TaskNavButton 컴포넌트

GNB/RNB 모드에서 사용하는 네비게이션 바 전용 버튼 컴포넌트이다.

```ts
interface TaskNavButtonProps {
  placement: 'gnb' | 'rnb';
  stats: TaskStats;
  unseenChanges: { notice: boolean; pending: boolean; delayed: boolean; total: number };
  isDrawerOpen: boolean;
  onClick: () => void;
}
```

| 기능             | 설명                                                       |
| ---------------- | ---------------------------------------------------------- |
| **버튼**         | 32×32px, 할일 아이콘, 드로워 열림 시 강조 스타일           |
| **뱃지**         | `unseenChanges.total > 0`일 때 우상단 빨간 뱃지 (최대 99+) |
| **호버 팝오버**  | 공지/진행/지연/즐겨찾기 4개 카테고리 현황 미니 대시보드     |
| **팝오버 위치**  | GNB → 버튼 우측, RNB → 버튼 좌측                          |

### 5.7 뱃지 시스템 (Unseen Changes)

GNB/RNB 버튼의 뱃지는 **마지막으로 드로워를 확인한 시점** 이후의 변화량을 표시한다.

**동작 원리:**
1. 드로워를 닫으면 현재 통계(`stats`)가 `lastSeenStats`로 스냅샷 저장됨 (localStorage: `taskLastSeenStats`)
2. 이후 통계가 변경되면 `unseenChanges`가 계산됨:
   - `total` = (현재 공지 - 마지막 공지) + (현재 대기 - 마지막 대기) + (현재 지연 - 마지막 지연)
   - 각 카테고리별 `boolean` 플래그로 팝오버에 빨간 점 표시
3. 드로워를 다시 열었다 닫으면 뱃지가 리셋됨

**뱃지 시뮬레이션 (개발/테스트용):**
```js
// 브라우저 콘솔에서 실행
localStorage.setItem('taskLastSeenStats', JSON.stringify({ notice: 0, pending: 0, delayed: 0 }));
location.reload();
```

---

## 6. API 모드 전환

### 6.1 작동 원리

`createTaskApi()` 팩토리 함수가 `config.apiType`에 따라 적절한 구현체를 반환한다:

```
apiType: 'localStorage'  ->  LocalStorageTaskApi (브라우저 localStorage 사용)
apiType: 'http'           ->  HttpTaskApi         (REST API 호출)
```

두 구현체 모두 동일한 `ITaskApi` 인터페이스를 구현하므로, API 모드를 전환해도 컴포넌트 코드 변경이 불필요하다.

### 6.2 localStorage 모드

```tsx
config={{
  displayMode: 'floating',
  apiType: 'localStorage',
}}
auth={{
  userId: 'user-001',
  userName: '홍길동',
  role: 'consultant',
  token: '',  // 토큰 불필요
}}
```

- 모든 데이터가 브라우저 localStorage에 저장된다.
- 네트워크 연결 없이 동작하므로 프로토타이핑, 데모, 개발 환경에 적합하다.
- 키: `taskManagement_v2` (userId별 격리)

### 6.3 HTTP 모드

```tsx
config={{
  displayMode: 'floating',
  apiType: 'http',
  httpBaseUrl: 'https://api.deskit.io/v1/tasks',
}}
auth={{
  userId: 'user-001',
  userName: '홍길동',
  role: 'manager',
  token: 'eyJhbGciOiJIUzI1NiIs...',  // JWT 필수
}}
```

- `HttpTaskApi`가 `httpBaseUrl`을 기준으로 REST API를 호출한다.
- `auth.token`이 요청 헤더에 포함된다.
- `auth.userId`도 API 호출 시 참조된다.
- `httpBaseUrl`을 미지정하면 런타임에 `Error: httpBaseUrl is required when apiType is "http"` 에러가 발생한다.

### 6.4 전환 시 체크리스트

localStorage에서 HTTP로 전환할 때 아래 항목을 확인한다:

| 항목                       | 변경 내용                                              |
| -------------------------- | ------------------------------------------------------ |
| `config.apiType`         | `'localStorage'` -> `'http'`                       |
| `config.httpBaseUrl`     | REST API 기본 URL 추가                                 |
| `auth.token`             | 유효한 인증 토큰 설정                                  |
| 기존 localStorage 데이터   | 서버 DB로 마이그레이션 필요 (자동 마이그레이션 미지원) |
| `statsRefreshIntervalMs` | 서버 부하를 고려하여 적절한 간격 설정 (기본 30초)      |

### 6.5 ITaskApi 인터페이스

커스텀 API 구현체를 작성하려면 아래 인터페이스를 구현한다:

```ts
interface ITaskApi {
  // CRUD
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;

  // 상태 토글
  toggleTaskCompletion(id: string): Promise<Task | null>;
  toggleTaskLike(id: string): Promise<Task | null>;
  toggleTaskPin(id: string): Promise<Task | null>;
  reorderTasks(reorderedTasks: Task[]): Promise<void>;

  // 통계
  getTaskStats(): Promise<TaskStats>;

  // 공지사항
  createNotice(input: CreateNoticeInput): Promise<Task>;
  updateNotice(noticeId: string, updates: Partial<...>): Promise<Task | null>;
  toggleNoticeRead(id: string): Promise<Task | null>;
  updateNoticeReadStatus(noticeId: string, consultantId: string): Promise<Task | null>;
  getNoticeReadStats(task: Task): { total: number; read: number; unread: number };

  // 초기화
  resetTasksToInitial(): Promise<void>;

  // 이벤트
  onTasksUpdated(callback: () => void): () => void;
}
```

---

## 7. 호스트 앱 연동

### 7.1 컨택룸 네비게이션 콜백

할일 카드에 연결된 컨택룸을 클릭하면 호스트 앱의 라우터로 이동시킬 수 있다:

```tsx
<TaskModuleProvider
  callbacks={{
    onNavigateToRoom: (roomId, messageId) => {
      // React Router 사용 시
      navigate(`/room/${roomId}`);

      // 또는 직접 상태 변경
      setSelectedRoomId(roomId);

      // messageId가 있으면 해당 말풍선 위치로 스크롤
      // nonce를 추가해 같은 messageId를 반복 클릭해도 useEffect가 재실행되도록 함
      if (messageId) {
        setScrollToMessageId({ roomId, messageId, nonce: Date.now() });
      }
    },
  }}
  // ...
>
```

### 7.2 컨택 미리보기 렌더 슬롯

할일에 연결된 컨택 정보를 호스트 앱의 커스텀 UI로 표시할 수 있다. `renderContactPreview`는 `roomId`와 `onClose` 콜백을 매개변수로 받는다.

**간단한 카드 형태:**

```tsx
<TaskModuleProvider
  callbacks={{
    renderContactPreview: (roomId, onClose) => {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return null;
      return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <Avatar name={room.contactName} />
          <div>
            <div className="text-sm font-medium">{room.contactName}</div>
            <div className="text-xs text-gray-500">{room.brand} / {room.channel}</div>
          </div>
          <button onClick={onClose}>닫기</button>
        </div>
      );
    },
  }}
  // ...
>
```

**컨택룸 오버레이 형태 (데스크잇 기본 구현):**

데스크잇에서는 `SearchResultOverlay` 컴포넌트를 재활용하여 채팅 대화방 + 참조 패널의 전체 오버레이를 표시한다:

```tsx
renderContactPreview: (roomId, onClose) => {
  const room = allRooms.find(r => r.id === roomId);
  if (!room) return null;
  return (
    <SearchResultOverlay
      room={room}
      onClose={onClose}
      allRooms={allRooms}
      setAllRooms={setAllRooms}
      inline        // 부모 컨테이너를 채움 (fixed 포지션 아님)
      readOnly      // 입력창(컴포저) 및 기능 버튼 숨김
    />
  );
}
```

#### 오버레이 모드 동작

`renderContactPreview`로 제공하는 컨택 미리보기 오버레이는 **읽기 전용** 모드로 동작한다. 데스크잇의 `SearchResultOverlay`를 재활용할 때 아래 항목이 자동으로 적용된다:

| 항목                         | 오버레이 모드 동작                                            |
| ---------------------------- | ------------------------------------------------------------- |
| **입력창 (컴포저)**    | `readOnly` prop으로 숨김                                    |
| **다운로드 버튼**      | 헤더에서 제거됨 (`onDownload` prop 미전달)                  |
| **레퍼런스 설정 버튼** | 숨김 (`hideSettingsButton` prop)                            |
| **새 창으로 열기**     | 클릭 시 해당 Room을 데스크 모드로 새 브라우저 창에서 열기     |
| **리사이즈**           | 채팅/참조 영역 간 드래그 리사이즈 가능                        |
| **참조 탭**            | 고객, Contact, 연동, Assistant, History, 맞춤 탭 등 모두 표시 |

이 설계 덕분에 검색 결과 오버레이와 할일 캘린더 오버레이 양쪽 모두 동일한 읽기 전용 컨택룸 미리보기를 제공한다.

### 7.3 드로워 상태 변경 알림

할일 드로워의 열림/닫힘 상태를 호스트 앱에서 감지하여 레이아웃을 조정할 수 있다:

```tsx
const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

<TaskModuleProvider
  callbacks={{
    onDrawerOpenChange: (isOpen) => {
      setIsTaskDrawerOpen(isOpen);
      // 예: 사이드바 너비 축소, 다른 패널 숨기기 등
    },
  }}
>
  <MainContent className={isTaskDrawerOpen ? 'w-[calc(100%-400px)]' : 'w-full'} />
</TaskModuleProvider>
```

### 7.4 상세 뷰 상태 변경 알림

상세 뷰(캘린더, 공지 작성 등)의 활성화 상태를 감지한다:

```tsx
<TaskModuleProvider
  callbacks={{
    onDetailViewOpenChange: (isActive) => {
      if (isActive) {
        // 상세 뷰가 열리면 다른 오버레이를 닫는 등의 처리
        closeOtherOverlays();
      }
    },
  }}
>
```

---

## 8. 해피톡 Next.js 포팅 가이드

데스크잇 프로토타입(Vite + React SPA)에서 해피톡 운영 환경(Next.js)으로 할일 모듈을 포팅하는 방법을 설명한다.

### 8.1 패키지 설치

```bash
# 사내 레지스트리에서 설치하거나, 모노레포 내 패키지 참조
npm install @deskit/task-module

# Peer Dependencies 확인
npm install react@^18 react-dom@^18 lucide-react
```

### 8.2 Next.js에서의 설정

Next.js의 `next.config.js`에 패키지 트랜스파일 설정을 추가한다:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@deskit/task-module'],
};

module.exports = nextConfig;
```

### 8.3 SSR 고려사항 (dynamic import)

할일 모듈은 `localStorage`, `window.innerWidth` 등 브라우저 API에 의존하므로, SSR 환경에서는 클라이언트 사이드에서만 렌더링해야 한다.

**권장 방법**: `TaskModuleProvider` + `TaskWidget`을 감싸는 래퍼 컴포넌트를 하나 만들어 통째로 dynamic import한다.

```tsx
// components/TaskModule.tsx
'use client';

import { TaskModuleProvider, TaskWidget } from '@deskit/task-module';
import type { AuthConfig, TaskModuleConfig, TaskModuleCallbacks, RoomRef } from '@deskit/task-module';

interface Props {
  auth: AuthConfig;
  config: TaskModuleConfig;
  callbacks?: TaskModuleCallbacks;
  selectedRoom?: RoomRef | null;
  allRooms?: RoomRef[];
}

export default function TaskModule({ auth, config, callbacks, selectedRoom, allRooms }: Props) {
  return (
    <TaskModuleProvider
      auth={auth}
      config={config}
      callbacks={callbacks}
      selectedRoom={selectedRoom}
      allRooms={allRooms}
    >
      <TaskWidget />
    </TaskModuleProvider>
  );
}
```

```tsx
// app/layout.tsx 또는 사용처
import dynamic from 'next/dynamic';

const TaskModule = dynamic(() => import('@/components/TaskModule'), {
  ssr: false,
  loading: () => null, // 로딩 중에는 아무것도 표시하지 않음
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <TaskModule
          auth={authConfig}
          config={{ displayMode: 'floating', apiType: 'http', httpBaseUrl: '/api/tasks' }}
        />
      </body>
    </html>
  );
}
```

### 8.4 인증 연동 (해피톡 로그인 -> AuthConfig 매핑)

기존 해피톡 인증 시스템의 사용자 정보를 `AuthConfig` 형식으로 매핑한다:

```tsx
// hooks/useTaskAuth.ts
'use client';

import { useMemo } from 'react';
import type { AuthConfig } from '@deskit/task-module';
import { useHappytalkAuth } from '@/hooks/useHappytalkAuth'; // 기존 인증 훅

export function useTaskAuth(): AuthConfig {
  const { user, accessToken } = useHappytalkAuth();

  return useMemo<AuthConfig>(() => ({
    userId: user.id,
    userName: user.displayName,
    role: user.isAdmin ? 'manager' : 'consultant',
    token: accessToken,
    groupId: user.teamId,
  }), [user, accessToken]);
}
```

```tsx
// 사용처
const auth = useTaskAuth();

<TaskModule
  auth={auth}
  config={{
    displayMode: 'floating',
    apiType: 'http',
    httpBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + '/tasks',
  }}
/>
```

### 8.5 API 프록시 설정

Next.js API Routes를 통해 백엔드 API를 프록시할 수 있다:

```ts
// app/api/tasks/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.TASK_API_BACKEND_URL;

export async function GET(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/tasks', '');
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { Authorization: req.headers.get('Authorization') || '' },
  });
  return NextResponse.json(await res.json());
}

// POST, PUT, DELETE도 동일한 패턴으로 구현
```

이 경우 `httpBaseUrl`을 `/api/tasks`로 설정하면 된다:

```tsx
config={{
  apiType: 'http',
  httpBaseUrl: '/api/tasks',
  displayMode: 'floating',
}}
```

### 8.6 Tailwind CSS 설정

할일 모듈은 Tailwind CSS 유틸리티 클래스를 사용한다. Next.js 프로젝트에서 모듈의 Tailwind 클래스가 정상 적용되려면 모듈 소스 경로를 스캔 대상에 포함해야 한다.

**Tailwind v4** (`@tailwindcss/postcss` 또는 `@tailwindcss/vite` 사용 시):

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/@deskit/task-module/src/**/*.tsx";
```

**Tailwind v3** (`tailwind.config.ts` 사용 시):

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@deskit/task-module/src/**/*.{js,ts,jsx,tsx}', // 추가
  ],
  // ...
};

export default config;
```

---

## 9. 컴포넌트 직접 사용 (고급)

`TaskModuleProvider` 내부에서 개별 컴포넌트를 직접 import하여 커스텀 레이아웃을 구성할 수 있다.

### 9.1 내보내기 목록

#### Providers & Hooks

```ts
import { TaskModuleProvider, useTaskContext, useAuth } from '@deskit/task-module';
```

| Export                 | 종류      | 설명                               |
| ---------------------- | --------- | ---------------------------------- |
| `TaskModuleProvider` | Component | 최상위 Provider (Auth + Task 통합) |
| `useTaskContext()`   | Hook      | 할일 Context 전체 값 접근          |
| `useAuth()`          | Hook      | 인증/권한 정보 접근                |
| `useTaskEdit()`      | Hook      | 할일 편집 상태 관리                |

#### Components

```ts
import {
  TaskWidget,
  TaskFloatingButton,
  TaskNavButton,
  TaskDrawer,
  TaskDetailView,
  TaskCalendar,
  TaskBoard,
  TaskCard,
  TaskViewMode,
  TaskEditMode,
  TaskInlineEditor,
  FullCalendarView,
  DatePickerModal,
  DateQuickFilter,
  NoticeViewer,
  NoticeEditor,
  TargetAudienceSelector,
} from '@deskit/task-module';
```

| 컴포넌트                   | 설명                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| **`TaskWidget`**   | **통합 위젯 (권장)** — `displayMode`에 따라 플로팅 버튼, 드로워, 상세 뷰를 자동 렌더링 |
| `TaskFloatingButton`     | 드래그 가능한 플로팅 버튼 (카운트 배지)                                                         |
| `TaskNavButton`          | GNB/RNB 네비게이션 바 버튼 (뱃지 + 호버 팝오버). [5.6절 참조](#56-tasknavbutton-컴포넌트)       |
| `TaskDrawer`             | 할일 서랍 패널 (목록, 필터, 정렬)                                                               |
| `TaskDetailView`         | 상세 뷰 / 공지 작성 뷰                                                                          |
| `TaskCalendar`           | 월간 캘린더 뷰                                                                                  |
| `TaskBoard`              | 칸반 보드 뷰                                                                                    |
| `TaskCard`               | 개별 할일 카드                                                                                  |
| `TaskViewMode`           | 할일 읽기 모드                                                                                  |
| `TaskEditMode`           | 할일 편집 모드                                                                                  |
| `TaskInlineEditor`       | 새 할일 인라인 생성기                                                                           |
| `FullCalendarView`       | 전체 캘린더 뷰 (확장 모드)                                                                      |
| `DatePickerModal`        | 날짜+시간 피커 모달                                                                             |
| `DateQuickFilter`        | 날짜 빠른 필터                                                                                  |
| `NoticeViewer`           | 공지사항 읽기 뷰                                                                                |
| `NoticeEditor`           | 공지사항 작성 에디터                                                                            |
| `TargetAudienceSelector` | 공지 대상 선택 모달                                                                             |

#### API 클래스

```ts
import {
  LocalStorageTaskApi,
  HttpTaskApi,
  createTaskApi,
  createConsultantApi,
} from '@deskit/task-module';

import type { ITaskApi, IConsultantApi } from '@deskit/task-module';
```

#### Utils

```ts
import {
  formatDateLabel,
  formatDeadlineLabel,
  getTodayString,
  getTomorrowString,
  getDatePart,
  hasTime,
} from '@deskit/task-module';
```

| 함수                             | 설명                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `formatDateLabel(dateStr)`     | 날짜 문자열을 "오늘", "내일", "3월 1일(토)" 등 상대적 라벨로 변환 |
| `formatDeadlineLabel(dateStr)` | 마감일 문자열을 상대적 라벨로 변환                                |
| `getTodayString()`             | 오늘 날짜를 `YYYY-MM-DD` 형식으로 반환                          |
| `getTomorrowString()`          | 내일 날짜를 `YYYY-MM-DD` 형식으로 반환                          |
| `getDatePart(dateStr)`         | ISO 날짜 문자열에서 `YYYY-MM-DD` 부분만 추출                    |
| `hasTime(dateStr)`             | 날짜 문자열에 시간 정보(`T`)가 포함되어 있는지 확인             |

#### Types

```ts
import type {
  Task, TaskType, TaskStatus, TaskStats,
  CreateTaskInput, UpdateTaskInput, CreateNoticeInput,
  NoticeReadStatus, EditFocusTarget,
  AuthConfig, UserRole,
  TaskModuleConfig, DisplayMode, TaskModuleCallbacks,
  RoomRef,
  Consultant, ConsultantGroup,
} from '@deskit/task-module';

import { TASK_TYPES, TASK_COLORS, TASK_STATUS } from '@deskit/task-module';
```

### 9.2 useTaskContext() 훅 활용

`useTaskContext()`를 통해 할일 모듈의 전체 상태와 액션에 접근할 수 있다:

```tsx
import { useTaskContext } from '@deskit/task-module';

function MyCustomTaskWidget() {
  const {
    // 통계
    stats,
    isStatsLoading,
    statsError,          // 통계 로딩 실패 시 에러 메시지 (string | null)
    refreshStats,

    // 드로워 제어
    isDrawerOpen,
    openDrawer,
    closeDrawer,

    // 상세 뷰 제어
    isDetailViewActive,
    openDetailView,
    closeDetailView,
    openNoticeCreation,

    // API 직접 호출
    api,
    consultantApi,

    // 인증 정보
    auth,
    isManager,

    // 설정
    config,
    callbacks,

    // 룸 정보
    selectedRoom,
    allRooms,

    // 프리필 (말풍선-할일 연동)
    prefillData,         // CreateTaskInput | null — 현재 프리필 데이터
    clearPrefill,        // () => void — 프리필 데이터 초기화
  } = useTaskContext();

  return (
    <div>
      <h3>할일 현황</h3>
      {statsError && <p className="text-red-500">{statsError}</p>}
      <p>대기: {stats.pending} / 지연: {stats.delayed} / 완료: {stats.completed}</p>
      <button onClick={() => openDrawer()}>할일 목록 열기</button>
      <button onClick={() => openDrawer({ isAddingTask: true })}>새 할일 추가</button>
      {isManager && (
        <button onClick={() => openNoticeCreation()}>공지 작성</button>
      )}
    </div>
  );
}
```

### 9.3 API 직접 호출 예시

```tsx
import { useTaskContext } from '@deskit/task-module';

function CustomTaskCreator() {
  const { api, refreshStats, selectedRoom } = useTaskContext();

  const handleQuickCreate = async () => {
    await api.createTask({
      type: 'callback',
      title: '콜백 요청',
      description: '고객 010-1234-5678 콜백',
      scheduledDate: new Date().toISOString(),
      roomId: selectedRoom?.id ?? null,
    });
    await refreshStats(); // 통계 즉시 갱신
  };

  return <button onClick={handleQuickCreate}>빠른 콜백 생성</button>;
}
```

### 9.4 커스텀 레이아웃 예시

기본 제공 컴포넌트를 조합하여 자유롭게 레이아웃을 구성할 수 있다:

```tsx
import {
  TaskModuleProvider,
  TaskCalendar,
  TaskBoard,
  TaskInlineEditor,
} from '@deskit/task-module';

function CustomTaskDashboard() {
  return (
    <TaskModuleProvider auth={auth} config={config}>
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* 좌측: 캘린더 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">캘린더</h2>
          <TaskCalendar />
        </div>

        {/* 우측: 칸반 보드 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">칸반 보드</h2>
          <TaskBoard />
        </div>
      </div>

      {/* 하단: 인라인 생성기 */}
      <div className="p-4">
        <TaskInlineEditor />
      </div>
    </TaskModuleProvider>
  );
}
```

---

## 10. 트러블슈팅

### "useTaskContext must be used within TaskModuleProvider" 에러

**원인:** `useTaskContext()` 또는 할일 모듈 컴포넌트가 `TaskModuleProvider` 바깥에서 렌더링되었다.

**해결:** 할일 모듈 컴포넌트를 사용하는 모든 영역이 `TaskModuleProvider` 내부에 있는지 확인한다.

```tsx
// 잘못된 예
<>
  <TaskModuleProvider auth={auth} config={config}>
    <App />
  </TaskModuleProvider>
  <TaskFloatingButton /> {/* Provider 바깥 - 에러 발생 */}
</>

// 올바른 예
<TaskModuleProvider auth={auth} config={config}>
  <App />
  <TaskFloatingButton /> {/* Provider 내부 */}
</TaskModuleProvider>
```

---

### "httpBaseUrl is required when apiType is 'http'" 에러

**원인:** `config.apiType`을 `'http'`로 설정했으나 `config.httpBaseUrl`을 누락했다.

**해결:** `httpBaseUrl`을 반드시 지정한다.

```tsx
config={{
  apiType: 'http',
  httpBaseUrl: 'https://api.example.com/v1/tasks', // 필수
  displayMode: 'floating',
}}
```

---

### localStorage 모드에서 데이터가 사라지는 경우

**원인:** 브라우저 시크릿 모드, localStorage 용량 초과, 또는 다른 코드에서 키를 덮어쓴 경우.

**해결:**

1. 시크릿 모드가 아닌지 확인한다.
2. DevTools > Application > Local Storage에서 `taskManagement_v2` 키를 확인한다.
3. `api.resetTasksToInitial()`이 의도치 않게 호출되고 있지 않은지 확인한다.

---

### Tailwind 스타일이 적용되지 않는 경우

**원인:** 호스트 앱의 Tailwind 설정에서 할일 모듈 파일 경로가 스캔 대상에 포함되지 않았다.

**해결 (Tailwind v4):** CSS 파일에 `@source` 지시어로 모듈 경로를 추가한다.

```css
/* index.css */
@import "tailwindcss";
@source "../packages/task-module/src/**/*.tsx";        /* 모노레포 내 */
/* 또는 */
@source "../node_modules/@deskit/task-module/src/**/*.tsx"; /* npm 패키지 */
```

**해결 (Tailwind v3):** `tailwind.config.ts`(또는 `.js`)의 `content` 배열에 모듈 경로를 추가한다.

```ts
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './packages/task-module/src/**/*.{js,ts,jsx,tsx}', // 모노레포 내
  // 또는
  './node_modules/@deskit/task-module/src/**/*.{js,ts,jsx,tsx}', // npm 패키지
],
```

---

### Next.js에서 "window is not defined" 에러

**원인:** 할일 모듈이 SSR 단계에서 렌더링되면서 `window`, `localStorage` 등 브라우저 API에 접근했다.

**해결:** [8.3절](#83-ssr-고려사항-dynamic-import)의 dynamic import 패턴을 적용한다.

```tsx
const TaskModule = dynamic(() => import('@/components/TaskModule'), {
  ssr: false,
});
```

---

### 할일 통계(카운트)가 갱신되지 않는 경우

**원인:** `statsRefreshIntervalMs`가 너무 긴 값으로 설정되었거나, API 이벤트 구독이 해제되었다.

**해결:**

1. `config.statsRefreshIntervalMs` 값을 확인한다 (기본값: 30000ms = 30초).
2. `api.onTasksUpdated()` 이벤트가 정상 작동하는지 확인한다.
3. 수동 갱신이 필요하면 `useTaskContext()`의 `refreshStats()`를 호출한다.

```tsx
const { refreshStats } = useTaskContext();
await refreshStats(); // 즉시 통계 갱신
```

---

### 플로팅 버튼 위치가 화면 밖으로 벗어나는 경우

**원인:** 화면 크기가 변경되었으나 저장된 위치가 갱신되지 않았다.

**해결:** localStorage에서 `taskFloatingButtonPosition` 키를 삭제하면 기본 위치(우측 하단)로 복원된다.

```js
localStorage.removeItem('taskFloatingButtonPosition');
```

---

### Portal 컨테이너를 찾지 못하는 경우

**원인:** `config.portalContainerId`로 지정한 DOM 요소가 아직 마운트되지 않았다.

**해결:**

1. Portal 대상 DOM 요소가 모듈 초기화 이전에 마운트되는지 확인한다.
2. 해당 ID를 가진 `<div>`가 HTML에 존재하는지 확인한다.

```html
<!-- index.html 또는 레이아웃 -->
<div id="task-portal"></div>
```

```tsx
config={{
  portalContainerId: 'task-portal',
  // ...
}}
```

---

## 11. 말풍선-할일 연동 (Bubble-to-Task Integration)

### 11.1 AI 할일 자동 생성 개요

상담사가 대화방의 말풍선에 마우스를 올리면 `calendar-clock` 아이콘이 나타나고, 클릭 시 AI가 해당 메시지와 전후 문맥을 분석하여 할일을 자동 생성합니다. 생성된 할일은 현재 컨택룸과 자동 연결됩니다.

**전체 흐름:**

```
말풍선 hover → calendar-clock 아이콘 표시
                        ↓
               아이콘 클릭
                        ↓
          generateTaskFromMessage() 호출 (AI 분석)
                        ↓
          onPrefillTask(data, messageId) 콜백
                        ↓
          App.tsx의 prefillTaskData 상태 업데이트
                        ↓
          TaskModuleProvider.prefillData prop 전달
                        ↓
          TaskDrawer가 인라인 에디터 자동 오픈 + 내용 채우기
                        ↓
          사용자가 검토 후 저장 클릭
                        ↓
          api.createTask({ ...data, messageId }) 실행
                        ↓
          callbacks.onTaskCreated(task) 호출
                        ↓
          해당 말풍선에 체크 배지 영구 표시
```

---

### 11.2 UI 동작 명세

| 상태                | 말풍선 위치   | 아이콘 위치 | 표시 조건               |
| ------------------- | ------------- | ----------- | ----------------------- |
| 할일 미연결 + hover | 상담사 (우측) | 말풍선 좌측 | 해당 행 hover 시        |
| 할일 미연결 + hover | 고객 (좌측)   | 말풍선 우측 | 해당 행 hover 시        |
| 할일 연결됨         | 상담사 (우측) | 말풍선 좌측 | 항상 (초록 체크 아이콘) |
| 할일 연결됨         | 고객 (좌측)   | 말풍선 우측 | 항상 (초록 체크 아이콘) |

**아이콘 스타일:**

- 미연결: `w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-blue-500`
- 연결됨: `w-7 h-7 rounded-full bg-green-50 text-green-600 border border-green-200`

**Task 연결 배지는 세션 로컬 상태**로 유지됩니다. 새로고침 시 초기화되며, 영구 저장이 필요하면 `onTaskCreated` 콜백에서 별도 저장 로직을 추가해야 합니다.

---

### 11.3 목업 코드 설명

현재 구현은 실제 AI 연동 없이 동작하는 **목업(Mock)** 코드로 시연됩니다.

#### 목업 샘플 방 (Room ID: 300)

- **위치:** `src/data/mockData.ts` (상담중 섹션 최상단)
- **방 이름:** "할일 자동 생성 샘플"
- **목적:** 말풍선-할일 연동 기능의 시연

**핵심 메시지 (id: 30008):**

```typescript
// [MOCK CODE - AI INTEGRATION REQUIRED]
// 이 메시지에서 할일 생성 시 자동으로 내용이 채워집니다.
// 주의: channel 필드 없음 — 이 메시지는 일반 채팅으로 전달되었음.
//       할일 type이 'sms'인 것은 내용(SMS로 연락하겠다)에서 비롯된 것이며,
//       메시지 채널(sms)과 다른 개념입니다.
{
  id: 30008,
  sender: 'agent',
  text: '2시간 이내로 배송 기사 연락처와 예상 도착 시간을 SMS로 전송해드리겠습니다. 고객님 전화번호 010-1234-5678로 연락드리겠습니다.',
  time: '...',
  // channel 없음 (일반 채팅 메시지)
}
```

#### generateTaskFromMessage() 함수

- **위치:** `src/components/ContactRoomArea/ContactRoomArea.tsx`
- **역할:** 말풍선 메시지로부터 할일 데이터 생성

```typescript
// [MOCK CODE - AI INTEGRATION REQUIRED]
// 실제 AI 연동 시 이 함수를 AI API 호출로 교체하세요.
const generateTaskFromMessage = (msg, allMessages): CreateTaskInput => {
  // 샘플 방(id=300)의 특정 메시지(id=30008)에 하드코딩된 내용 반환
  if (selectedRoom?.id === 300 && msg.id === 30008) {
    return {
      type: 'sms',
      title: 'SMS 발송 — 배송 기사 연락처 및 예상 도착 시간 안내',
      description: '고객 010-1234-5678 / 2시간 이내 SMS 발송 약속',
      scheduledDate: /* 오늘 + 2시간 */,
      roomId: selectedRoom.id,
      messageId: msg.id,
    };
  }
  // 그 외: AI 플레이스홀더 반환
  return {
    type: 'followup',
    title: `[AI 생성 예정] ${msg.text.slice(0, 20)}...`,
    description: 'AI가 전후 문맥을 파악하여 자동으로 할일을 생성합니다.',
    scheduledDate: /* 오늘 */,
    roomId: selectedRoom?.id ?? null,
    messageId: msg.id,
  };
};
```

---

### 11.4 실제 AI 연동 시 교체 포인트

#### 교체 위치 1: `generateTaskFromMessage()` 함수

**파일:** `src/components/ContactRoomArea/ContactRoomArea.tsx`

현재 목업 코드를 AI API 호출로 교체합니다:

```typescript
// TODO: 실제 AI 연동 시 아래와 같이 교체
// const generateTaskFromMessage = async (msg, contextMessages): Promise<CreateTaskInput> => {
//   const contextWindow = contextMessages.slice(-3).concat(msg).concat(contextMessages.slice(0, 3));
//   const response = await aiClient.analyzeMessage({
//     targetMessage: msg.text,
//     context: contextWindow.map(m => ({ sender: m.sender, text: m.text })),
//     roomInfo: { contactName: selectedRoom?.contactName, topic: selectedRoom?.conversationTopic },
//   });
//   return {
//     type: response.suggestedType,
//     title: response.title,
//     description: response.description,
//     scheduledDate: response.scheduledDate,  // AI가 날짜/시간 자동 파악
//     roomId: selectedRoom?.id ?? null,
//     messageId: msg.id,
//   };
// };
```

#### 교체 위치 2: AI 컨텍스트 윈도우

현재 `±3 메시지`를 컨텍스트로 사용하도록 `getContextMessages()` 헬퍼가 설계되어 있습니다. 실제 AI 연동 시 적절한 컨텍스트 크기를 조정하세요.

---

### 11.5 messageId 기반 스크롤 연동

할일 서랍에서 연결된 컨택룸을 클릭하면 해당 메시지 위치로 자동 스크롤됩니다.

#### 데이터 흐름:

1. **Task 생성 시:** `messageId` 필드에 원본 메시지 ID 저장 (타입: `Task.messageId: number | null`)
2. **Task 클릭 시:** `onNavigateToRoom(roomId, messageId)` 콜백 호출
3. **App.tsx:** `scrollToMessageId` 상태 업데이트
4. **ContactRoomArea:** `useEffect`로 감지 → `messageRefs.get(messageId)?.scrollIntoView()`

#### 커스텀 스크롤 동작 설정:

```typescript
// App.tsx 구현 예시 (데스크잇 기본 구현)
const [scrollToMessageId, setScrollToMessageId] = useState<{
  roomId: number;
  messageId: number;
  nonce: number;  // 같은 messageId 반복 클릭 시 useEffect 재실행을 위한 nonce
} | null>(null);

callbacks={{
  onNavigateToRoom: (roomId, messageId) => {
    setSelectedRoomId(roomId);
    // nonce 추가: 같은 말풍선을 연속 클릭해도 스크롤이 매번 동작함
    if (messageId) {
      setScrollToMessageId({ roomId, messageId, nonce: Date.now() });
    }
  },

  onTaskCreated: (task) => {
    // messageId로 배지 맵 업데이트 (말풍선에 체크 배지 표시)
    if (task.roomId != null && task.messageId != null) {
      setTaskBadgeMap(prev => {
        const next = new Map(prev);
        const set = new Set(next.get(task.roomId!) ?? []);
        set.add(task.messageId!);
        next.set(task.roomId!, set);
        return next;
      });
    }
    setPrefillTaskData(null);
  },

  onTaskDeleted: (task) => {
    // 할일 삭제 시 배지 맵에서 해당 messageId 제거 (말풍선 체크 배지 사라짐)
    // 사용자가 실수로 삭제해도 calendar-clock 아이콘이 복귀하여 재생성 가능
    if (task.roomId != null && task.messageId != null) {
      setTaskBadgeMap(prev => {
        const next = new Map(prev);
        const set = new Set(next.get(task.roomId!) ?? []);
        set.delete(task.messageId!);
        if (set.size === 0) next.delete(task.roomId!);
        else next.set(task.roomId!, set);
        return next;
      });
    }
  },
}}
prefillData={prefillTaskData}
```

#### ContactRoomArea scrollToMessageId prop:

```typescript
// ChatModeContainer / PhoneModeContainer에서 ContactRoomArea로 전달
// roomId가 일치하는 경우에만 { messageId, nonce }를 내려보냄
<ContactRoomArea
  scrollToMessageId={
    scrollToMessageId?.roomId === selectedRoomId
      ? { messageId: scrollToMessageId.messageId, nonce: scrollToMessageId.nonce }
      : null
  }
/>

// ContactRoomArea 내부에서 useEffect로 처리
useEffect(() => {
  if (scrollToMessageId) {
    const el = messageRefs.current.get(scrollToMessageId.messageId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}, [scrollToMessageId]); // nonce가 포함된 객체이므로 매 호출마다 새 참조 → 효과 재실행
```

#### 타입 참조:

```typescript
// packages/task-module/src/types/task.ts
interface Task {
  // ...
  roomId: number | null;    // 연결된 컨택룸 ID
  messageId: number | null; // 연결된 메시지 ID (버블-할일 연동)
}

interface CreateTaskInput {
  // ...
  roomId?: number | null;
  messageId?: number | null;
}

// packages/task-module/src/types/module.ts
interface TaskModuleCallbacks {
  onNavigateToRoom?: (roomId: number, messageId?: number) => void; // messageId 선택적 파라미터
  onTaskCreated?: (task: Task) => void;  // 할일 생성 완료 콜백 → 배지 추가
  onTaskDeleted?: (task: Task) => void;  // 할일 삭제 콜백 → 배지 제거
}
```
