# 할일 모듈 백엔드 REST API 명세서

## 1. 개요

이 문서는 데스크잇(Deskit) 컨택센터 애플리케이션의 **할일(Task) 모듈** 프론트엔드가 요구하는 백엔드 REST API 명세입니다. 백엔드 개발자가 프론트엔드 코드를 참조하지 않고도 API 서버를 구현할 수 있도록, 각 엔드포인트의 요청/응답 스키마, 비즈니스 로직, 권한 규칙, DB 스키마를 상세히 기술합니다.

### 1.1 용어 정의

| 용어 | 설명 |
|------|------|
| Task | 할일 항목 (SMS, 콜백, 팔로업, 공지 등) |
| Notice | `type = 'notice'`인 특수 Task. 매니저가 생성하여 상담원들에게 전달하는 공지사항 |
| Consultant | 상담원 (시스템 사용자) |
| Manager | 관리자 역할의 사용자. 공지사항 생성/수정 권한 보유 |
| Owner | 할일의 소유자 (`ownerId` 필드로 식별) |

### 1.2 Base URL

```
{BASE_URL}/api/v1
```

---

## 2. 인증 (Authentication)

모든 API 요청에는 다음 헤더가 필수입니다.

### 2.1 필수 헤더

| 헤더 | 형식 | 설명 |
|------|------|------|
| `Authorization` | `Bearer {token}` | JWT 또는 세션 기반 인증 토큰. (해피톡처럼 JWT 내부에 `userId` 클레임이 포함된 경우 서버 측에서 추출 활용 가능) |
| `X-User-Id` | `string` | 요청자의 사용자 ID. (SSO 토큰 통합 시 생략 가능) |
| `Content-Type` | `application/json` | JSON 요청 바디가 있는 경우 필수 |

### 2.2 인증 실패 응답

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "유효하지 않은 인증 토큰입니다."
  }
}
```

HTTP Status: `401 Unauthorized`

### 2.3 사용자 역할 (UserRole)

```typescript
type UserRole = 'consultant' | 'manager';
```

| 역할 | 설명 |
|------|------|
| `consultant` | 일반 상담원. 개인 할일 CRUD 및 공지 읽기 가능 |
| `manager` | 관리자. 상담원 기능 + 공지사항 생성/수정 가능 |

### 2.4 인증 컨텍스트 (AuthConfig)

토큰 검증 후 서버 내부에서 사용하는 인증 컨텍스트:

```typescript
interface AuthConfig {
  userId: string;      // 사용자 고유 ID
  userName: string;    // 사용자 표시명
  role: UserRole;      // 'consultant' | 'manager'
  token: string;       // 인증 토큰
  groupId?: string;    // 소속 상담원 그룹 ID (선택)
}
```

---

## 3. 공통 규칙

### 3.1 응답 형식

모든 성공 응답은 JSON 형식이며, 리소스를 직접 반환합니다 (별도 wrapper 없음).

```
// 단일 리소스
{ "id": "...", "title": "...", ... }

// 배열 리소스
[{ "id": "...", ... }, { "id": "...", ... }]
```

### 3.2 공통 에러 응답 형식

```typescript
interface ErrorResponse {
  error: {
    code: string;       // 에러 코드 (대문자 SNAKE_CASE)
    message: string;    // 사용자에게 표시할 한국어 메시지
    details?: unknown;  // 추가 디버그 정보 (선택, 개발 환경에서만)
  }
}
```

### 3.3 에러 코드 목록

| HTTP Status | 에러 코드 | 설명 |
|-------------|-----------|------|
| 400 | `BAD_REQUEST` | 요청 바디가 유효하지 않음 |
| 400 | `INVALID_TASK_TYPE` | 허용되지 않는 할일 유형 |
| 400 | `INVALID_STATUS` | 허용되지 않는 상태 값 |
| 400 | `MISSING_REQUIRED_FIELD` | 필수 필드 누락 |
| 401 | `UNAUTHORIZED` | 인증 토큰이 없거나 유효하지 않음 |
| 403 | `FORBIDDEN` | 해당 리소스에 대한 권한 없음 |
| 403 | `MANAGER_ONLY` | 관리자 전용 기능 |
| 404 | `TASK_NOT_FOUND` | 할일을 찾을 수 없음 |
| 404 | `NOTICE_NOT_FOUND` | 공지사항을 찾을 수 없음 |
| 404 | `CONSULTANT_NOT_FOUND` | 상담원을 찾을 수 없음 |
| 409 | `CONFLICT` | 데이터 충돌 (동시 수정 등) |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |

### 3.4 타임스탬프 형식

- **Unix timestamp (밀리초)**: `createdAt`, `completedAt`, `pinnedAt`, `readAt` 필드
  - 예: `1708617600000`
  - `null` 허용 (해당 이벤트가 발생하지 않은 경우)
- **날짜 문자열 (ISO 8601 date)**: `scheduledDate`, `deadline` 필드
  - 예: `"2024-02-22"`
  - `null` 허용 (날짜 미지정)

---

## 4. 데이터 타입 정의

### 4.1 Task (할일)

```typescript
type TaskType = 'sms' | 'callback' | 'followup' | 'notice';
type TaskStatus = 'pending' | 'delayed' | 'completed';

interface Task {
  id: string;                          // 고유 식별자
  ownerId: string;                     // 소유자 ID (생성자)
  type: TaskType;                      // 할일 유형
  title: string;                       // 제목
  description: string;                 // 설명
  scheduledDate: string | null;        // 예정일 (YYYY-MM-DD)
  deadline: string | null;             // 마감일 (YYYY-MM-DD)
  status: TaskStatus;                  // 상태 (서버에서 자동 계산 포함)
  liked: boolean;                      // 좋아요 여부
  pinned: boolean;                     // 고정 여부
  pinnedAt: number | null;             // 고정 시각 (Unix ms)
  backgroundColor: string | null;      // 배경 색상 키 (white, yellow, pink, green, blue)
  parentId: string | null;             // 부모 할일 ID (서브태스크인 경우)
  roomId: number | null;               // 연결된 컨택룸 ID
  messageId: number | null;            // 연결된 메시지 ID (말풍선-할일 연동, null이면 수동 생성 할일)
  order: number;                       // 정렬 순서 (낮을수록 위)
  createdAt: number;                   // 생성 시각 (Unix ms)
  completedAt: number | null;          // 완료 시각 (Unix ms)

  // === 공지사항 전용 필드 (type === 'notice'인 경우) ===
  noticeContent?: string;              // 공지 본문 (마크다운/플레인텍스트)
  author?: string;                     // 공지 작성자명
  isRead?: boolean;                    // 현재 사용자의 읽음 여부
  targetAudience?: NoticeReadStatus[]; // 대상 상담원 읽음 상태 목록
  requireReadConfirmation?: boolean;   // 읽음 확인 필수 여부
}
```

### 4.2 NoticeReadStatus (공지 읽음 상태)

```typescript
interface NoticeReadStatus {
  consultantId: string;      // 대상 상담원 ID
  consultantName: string;    // 대상 상담원 이름
  isRead: boolean;           // 읽음 여부
  readAt: number | null;     // 읽은 시각 (Unix ms)
}
```

### 4.3 TaskStats (통계)

```typescript
interface TaskStats {
  notice: number;     // 미읽은 공지 수
  pending: number;    // 대기 중 할일 수 (공지 제외)
  delayed: number;    // 지연된 할일 수 (공지 제외)
  liked: number;      // 좋아요 + 미완료 할일 수 (공지 제외)
  completed: number;  // 완료된 할일 수 (전체)
}
```

### 4.4 CreateTaskInput (할일 생성 입력)

```typescript
interface CreateTaskInput {
  type: TaskType;                      // 필수
  title: string;                       // 필수
  description?: string;                // 선택 (기본값: "")
  scheduledDate?: string | null;       // 선택 (기본값: 오늘 날짜)
  deadline?: string | null;            // 선택 (기본값: null)
  parentId?: string | null;            // 선택 (서브태스크인 경우 부모 ID)
  roomId?: number | null;              // 선택 (연결할 컨택룸 ID)
  messageId?: number | null;           // 선택 (연결할 메시지 ID — 말풍선에서 할일 생성 시 전달)
  backgroundColor?: string | null;     // 선택 (배경 색상 키)
}
```

### 4.5 UpdateTaskInput (할일 수정 입력)

```typescript
interface UpdateTaskInput {
  id: string;                          // 필수 - 수정할 할일 ID
  type?: TaskType;
  title?: string;
  description?: string;
  scheduledDate?: string | null;
  deadline?: string | null;
  status?: TaskStatus;
  liked?: boolean;
  pinned?: boolean;
  pinnedAt?: number | null;
  backgroundColor?: string | null;
  parentId?: string | null;
  roomId?: number | null;
  order?: number;
}
```

### 4.6 CreateNoticeInput (공지 생성 입력)

```typescript
interface CreateNoticeInput {
  title: string;                           // 필수 - 공지 제목
  noticeContent: string;                   // 필수 - 공지 본문
  author: string;                          // 필수 - 작성자명
  targetAudience: NoticeReadStatus[];      // 필수 - 대상 상담원 목록
  requireReadConfirmation: boolean;        // 필수 - 읽음 확인 필수 여부
}
```

### 4.7 Consultant (상담원)

```typescript
interface Consultant {
  id: string;                                  // 고유 식별자
  name: string;                                // 이름
  status: 'available' | 'busy' | 'away';       // 상태
  currentLoad: number;                         // 현재 처리 건수
  groupId?: string;                            // 소속 그룹 ID
}
```

### 4.8 ConsultantGroup (상담원 그룹)

```typescript
interface ConsultantGroup {
  id: string;            // 고유 식별자
  name: string;          // 그룹명
  description: string;   // 그룹 설명
  memberIds: string[];   // 소속 상담원 ID 목록
}
```

---

## 5. REST API 엔드포인트

---

### 5.1 할일 목록 조회

현재 사용자에게 표시할 할일 목록을 조회합니다.

```
GET /api/v1/tasks
```

**권한**: consultant, manager

**요청 파라미터**: 없음

**비즈니스 로직**:
1. 요청자의 `X-User-Id`를 기준으로 할일을 필터링합니다.
2. **개인 할일** (`type !== 'notice'`): `ownerId === X-User-Id`인 항목만 반환합니다.
3. **공지사항** (`type === 'notice'`): 아래 조건 중 하나라도 만족하면 반환합니다.
   - `ownerId === X-User-Id` (작성자 본인)
   - `targetAudience` 배열에 `consultantId === X-User-Id`인 항목이 존재
4. 각 할일의 `status`를 응답 시점에 **자동 재계산**합니다 (5.1.1 참조).
5. 공지사항의 `isRead` 필드는 요청자 기준으로 설정합니다 (targetAudience에서 해당 사용자의 isRead 값).

**응답**: `200 OK`

```typescript
// Response Body
Task[]
```

#### 5.1.1 상태 자동 계산 로직

할일 조회 시 서버는 각 항목의 `status`를 다음 로직으로 재계산합니다.

```
function calculateTaskStatus(scheduledDate, deadline, currentStatus):
  1. currentStatus가 'completed'이면 → 'completed' 유지
  2. 기준일 = deadline || scheduledDate (deadline 우선)
  3. 기준일이 null이면 → 'pending'
  4. 기준일의 23:59:59.999 시점이 현재 시각보다 과거이면 → 'delayed'
  5. 그 외 → 'pending'
```

---

### 5.2 단일 할일 조회

특정 할일을 ID로 조회합니다.

```
GET /api/v1/tasks/:id
```

**권한**: consultant, manager

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 할일 ID |

**비즈니스 로직**:
1. 해당 ID의 할일을 조회합니다.
2. 요청자에게 조회 권한이 있는지 확인합니다 (5.1의 필터링 규칙과 동일).
3. 권한이 없으면 `403 FORBIDDEN`을 반환합니다.

**응답 (성공)**: `200 OK`

```typescript
// Response Body
Task
```

**응답 (실패)**: `404 Not Found`

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "해당 할일을 찾을 수 없습니다."
  }
}
```

---

### 5.3 할일 생성

새 할일을 생성합니다.

```
POST /api/v1/tasks
```

**권한**: consultant, manager

**요청 바디**:

```typescript
// Request Body
{
  type: TaskType;                      // 필수 - 'sms' | 'callback' | 'followup'
  title: string;                       // 필수
  description?: string;                // 선택 (기본값: "")
  scheduledDate?: string | null;       // 선택 (기본값: 오늘 날짜 YYYY-MM-DD)
  deadline?: string | null;            // 선택 (기본값: null)
  parentId?: string | null;            // 선택 (서브태스크 부모 ID)
  roomId?: number | null;              // 선택 (연결 컨택룸 ID)
  messageId?: number | null;           // 선택 (연결 메시지 ID — 말풍선-할일 연동)
  backgroundColor?: string | null;     // 선택 (배경 색상 키)
}
```

> **주의**: `type`에 `'notice'`는 허용하지 않습니다. 공지사항은 `POST /api/v1/notices` 엔드포인트를 사용합니다.

**비즈니스 로직**:
1. `id`를 서버에서 생성합니다 (UUID 권장).
2. `ownerId`를 요청자의 `X-User-Id`로 설정합니다.
3. `scheduledDate`가 빈 문자열이거나 미제공이면 오늘 날짜로 설정합니다.
4. `status`를 `calculateTaskStatus(scheduledDate, deadline, 'pending')`로 자동 계산합니다.
5. `order` 값 결정:
   - `parentId`가 있으면 (서브태스크): `order = createdAt`
   - `parentId`가 없으면 (최상위 할일): 기존 최상위 할일 중 최소 `order` 값 - 1 (목록 최상단에 배치)
6. `createdAt`을 현재 시각(Unix ms)으로 설정합니다.
7. 나머지 기본값: `liked = false`, `pinned = false`, `pinnedAt = null`, `completedAt = null`.
8. `messageId`는 제공된 값을 그대로 저장합니다 (null 허용). 말풍선에서 할일 생성 시 자동 전달되며, 수동 생성 시 null입니다.

**응답**: `201 Created`

```typescript
// Response Body
Task  // 생성된 할일 전체 객체
```

**에러 응답 예시**: `400 Bad Request`

```json
{
  "error": {
    "code": "MISSING_REQUIRED_FIELD",
    "message": "제목(title)은 필수 입력 항목입니다."
  }
}
```

---

### 5.4 할일 수정

기존 할일의 필드를 부분 수정합니다.

```
PUT /api/v1/tasks/:id
```

**권한**: consultant, manager (본인 소유 할일만)

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 수정할 할일 ID |

**요청 바디** (Partial - 수정할 필드만 전송):

```typescript
// Request Body
{
  type?: TaskType;
  title?: string;
  description?: string;
  scheduledDate?: string | null;
  deadline?: string | null;
  status?: TaskStatus;
  liked?: boolean;
  pinned?: boolean;
  pinnedAt?: number | null;
  backgroundColor?: string | null;
  parentId?: string | null;
  roomId?: number | null;
  order?: number;
}
```

**비즈니스 로직**:
1. `ownerId`가 요청자와 일치하는지 확인합니다. 불일치 시 `403 FORBIDDEN`.
2. 전달된 필드만 기존 값에 병합(merge)합니다.
3. `scheduledDate` 또는 `deadline`이 변경되면 `status`를 자동 재계산합니다.
4. `status`가 `'completed'`로 변경되면 `completedAt = Date.now()`로 설정합니다.
5. `status`가 `'completed'`에서 다른 값으로 변경되면 `completedAt = null`로 초기화합니다.

**응답 (성공)**: `200 OK`

```typescript
// Response Body
Task  // 수정된 할일 전체 객체
```

**응답 (실패)**: `404 Not Found`

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "해당 할일을 찾을 수 없습니다."
  }
}
```

---

### 5.5 할일 삭제

할일을 삭제합니다. 서브태스크가 있으면 함께 삭제합니다.

```
DELETE /api/v1/tasks/:id
```

**권한**: consultant, manager (본인 소유 할일만)

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 삭제할 할일 ID |

**비즈니스 로직**:
1. `ownerId`가 요청자와 일치하는지 확인합니다. 불일치 시 `403 FORBIDDEN`.
2. 해당 할일을 삭제합니다.
3. **CASCADE 삭제**: `parentId === id`인 모든 서브태스크도 함께 삭제합니다.

**응답 (성공)**: `204 No Content` (빈 응답)

**응답 (실패)**: `404 Not Found`

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "해당 할일을 찾을 수 없습니다."
  }
}
```

---

### 5.6 완료 토글

할일의 완료 상태를 토글합니다.

```
POST /api/v1/tasks/:id/toggle-completion
```

**권한**: consultant, manager (본인 소유 할일만)

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 할일 ID |

**요청 바디**: 없음

**비즈니스 로직**:
1. 현재 `status`가 `'completed'`이면 → 완료 해제
   - `completedAt = null`
   - `status`를 `calculateTaskStatus(scheduledDate, deadline, 'pending')`으로 재계산
2. 현재 `status`가 `'completed'`가 아니면 → 완료 처리
   - `status = 'completed'`
   - `completedAt = Date.now()`

**응답**: `200 OK`

```typescript
// Response Body
Task  // 토글 후 할일 전체 객체
```

---

### 5.7 좋아요 토글

할일의 좋아요 상태를 토글합니다.

```
POST /api/v1/tasks/:id/toggle-like
```

**권한**: consultant, manager (본인 소유 할일만)

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 할일 ID |

**요청 바디**: 없음

**비즈니스 로직**:
1. `liked = !liked` (불리언 반전)

**응답**: `200 OK`

```typescript
// Response Body
Task  // 토글 후 할일 전체 객체
```

---

### 5.8 고정 토글

할일의 고정(pin) 상태를 토글합니다.

```
POST /api/v1/tasks/:id/toggle-pin
```

**권한**: consultant, manager (본인 소유 할일만)

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 할일 ID |

**요청 바디**: 없음

**비즈니스 로직**:
1. `pinned = !pinned` (불리언 반전)
2. 고정 시: `pinnedAt = Date.now()`
3. 고정 해제 시: `pinnedAt = null`

**응답**: `200 OK`

```typescript
// Response Body
Task  // 토글 후 할일 전체 객체
```

---

### 5.9 할일 순서 변경

할일 목록의 정렬 순서를 일괄 변경합니다.

```
PUT /api/v1/tasks/reorder
```

**권한**: consultant, manager

**요청 바디**:

```typescript
// Request Body
{
  taskIds: string[];  // 새 순서대로 나열된 할일 ID 배열
}
```

**비즈니스 로직**:
1. `taskIds` 배열의 인덱스를 해당 할일의 `order` 값으로 설정합니다.
   - `taskIds[0]`의 `order = 0`
   - `taskIds[1]`의 `order = 1`
   - ...
2. 요청자 소유가 아닌 할일 ID는 무시합니다.
3. `taskIds`에 포함되지 않은 할일의 `order`는 변경하지 않습니다.

**응답**: `204 No Content` (빈 응답)

---

### 5.10 통계 조회

현재 사용자의 할일 통계를 조회합니다.

```
GET /api/v1/tasks/stats
```

**권한**: consultant, manager

**요청 파라미터**: 없음

**비즈니스 로직**:

통계는 요청자에게 표시되는 할일(5.1의 필터링 적용 후) 기준으로 계산합니다.

```
notice:    type === 'notice' AND status !== 'completed' AND isRead === false인 항목 수
pending:   status === 'pending' AND type !== 'notice'인 항목 수
delayed:   status === 'delayed' AND type !== 'notice'인 항목 수
liked:     liked === true AND status !== 'completed' AND type !== 'notice'인 항목 수
completed: status === 'completed'인 항목 수 (전체, 공지 포함)
```

**공지 미읽음/읽음 통계 SQL 예시**:
```sql
SELECT COUNT(*) FROM tasks t
INNER JOIN notice_audience na ON na.notice_id = t.id AND na.consultant_id = :userId
WHERE t.type = 'notice' AND t.status != 'completed' AND na.is_read = FALSE;
```

> **참고**: `status`는 조회 시점에 자동 재계산된 값을 기준으로 합니다.

**응답**: `200 OK`

```typescript
// Response Body
{
  notice: number;
  pending: number;
  delayed: number;
  liked: number;
  completed: number;
}
```

---

### 5.11 공지 생성

공지사항을 생성합니다. 관리자 전용입니다.

```
POST /api/v1/notices
```

**권한**: manager only

**요청 바디**:

```typescript
// Request Body
{
  title: string;                           // 필수 - 공지 제목
  noticeContent: string;                   // 필수 - 공지 본문
  author: string;                          // 필수 - 작성자명 (예: "운영팀 김관리")
  targetAudience: NoticeReadStatus[];      // 필수 - 대상 상담원 목록
  requireReadConfirmation: boolean;        // 필수 - 읽음 확인 필수 여부
}
```

`targetAudience` 배열 항목 형식:

```typescript
{
  consultantId: string;      // 대상 상담원 ID
  consultantName: string;    // 대상 상담원 이름
  isRead: false;             // 초기값: false
  readAt: null;              // 초기값: null
}
```

**비즈니스 로직**:
1. 요청자의 `role`이 `'manager'`인지 확인합니다. 아니면 `403 MANAGER_ONLY`.
2. `id`를 서버에서 생성합니다.
3. `ownerId`를 요청자의 `X-User-Id`로 설정합니다.
4. `type = 'notice'`로 고정합니다.
5. `description`은 `title`과 동일하게 설정합니다.
6. `scheduledDate`는 오늘 날짜로 설정합니다.
7. `status = 'pending'`, `isRead = false`.
8. `order`는 기존 최상위 할일 중 최소 `order` 값 - 1 (목록 최상단에 배치).
9. 나머지 기본값: `liked = false`, `pinned = false`, `pinnedAt = null`, `deadline = null`, `parentId = null`, `roomId = null`, `completedAt = null`, `backgroundColor = null`.

**응답**: `201 Created`

```typescript
// Response Body
Task  // 생성된 공지 전체 객체
```

**에러 응답**: `403 Forbidden`

```json
{
  "error": {
    "code": "MANAGER_ONLY",
    "message": "공지사항 생성은 관리자만 가능합니다."
  }
}
```

---

### 5.12 공지 수정

기존 공지사항을 수정합니다. 관리자 전용입니다.

```
PUT /api/v1/notices/:id
```

**권한**: manager only

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 공지 ID |

**요청 바디** (Partial - 수정할 필드만 전송):

```typescript
// Request Body
{
  title?: string;
  noticeContent?: string;
  targetAudience?: NoticeReadStatus[];
  requireReadConfirmation?: boolean;
}
```

**비즈니스 로직**:
1. 요청자의 `role`이 `'manager'`인지 확인합니다. 아니면 `403 MANAGER_ONLY`.
2. 해당 ID의 할일이 `type === 'notice'`인지 확인합니다.
3. 전달된 필드만 병합합니다.
4. `title`이 변경되면 `description`도 동일하게 업데이트합니다.

**응답 (성공)**: `200 OK`

```typescript
// Response Body
Task  // 수정된 공지 전체 객체
```

**응답 (실패)**: `404 Not Found`

```json
{
  "error": {
    "code": "NOTICE_NOT_FOUND",
    "message": "해당 공지사항을 찾을 수 없습니다."
  }
}
```

---

### 5.13 공지 읽음 토글

현재 사용자의 공지 읽음 상태를 토글합니다.

```
POST /api/v1/notices/:id/toggle-read
```

**권한**: consultant, manager

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 공지 ID |

**요청 바디**: 없음

**비즈니스 로직**:
1. `isRead = !isRead` (현재 사용자 기준 읽음 상태 반전)
2. `targetAudience` 배열에서 `consultantId === X-User-Id`인 항목을 찾아 업데이트:
   - 읽음 처리: `isRead = true`, `readAt = Date.now()`
   - 읽지 않음 처리: `isRead = false`, `readAt = null`
3. 응답의 `isRead` 필드는 요청자 기준의 새 읽음 상태를 반영합니다.

**응답**: `200 OK`

```typescript
// Response Body
Task  // 토글 후 공지 전체 객체
```

---

### 5.14 공지 읽음 상태 업데이트

특정 상담원의 공지 읽음 상태를 "읽음"으로 업데이트합니다. (토글이 아닌 단방향 업데이트)

```
PUT /api/v1/notices/:id/read-status
```

**권한**: consultant, manager

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | string | 공지 ID |

**요청 바디**:

```typescript
// Request Body
{
  consultantId: string;  // 읽음 처리할 상담원 ID
}
```

**비즈니스 로직**:
1. 해당 공지의 `type`이 `'notice'`이고 `targetAudience`가 존재하는지 확인합니다.
2. `targetAudience` 배열에서 `consultantId`가 일치하는 항목을 찾아 업데이트:
   - `isRead = true`
   - `readAt = Date.now()`
3. 이미 읽음 상태인 경우에도 `readAt`을 갱신합니다.

**응답 (성공)**: `200 OK`

```typescript
// Response Body
Task  // 업데이트 후 공지 전체 객체
```

**응답 (실패)**: `404 Not Found`

공지를 찾을 수 없거나, `type`이 `'notice'`가 아니거나, `targetAudience`가 없는 경우:

```json
{
  "error": {
    "code": "NOTICE_NOT_FOUND",
    "message": "해당 공지사항을 찾을 수 없거나, 대상 정보가 없습니다."
  }
}
```

---

### 5.15 상담원 목록 조회

전체 상담원 목록을 조회합니다.

```
GET /api/v1/consultants
```

**권한**: consultant, manager

**요청 파라미터**: 없음

**응답**: `200 OK`

```typescript
// Response Body
Consultant[]
```

**응답 예시**:

```json
[
  {
    "id": "c1",
    "name": "김상담",
    "status": "available",
    "currentLoad": 3,
    "groupId": "g1"
  },
  {
    "id": "c2",
    "name": "이상담",
    "status": "busy",
    "currentLoad": 8,
    "groupId": "g1"
  }
]
```

---

### 5.16 상담원 그룹 목록 조회

전체 상담원 그룹 목록을 조회합니다.

```
GET /api/v1/consultant-groups
```

**권한**: consultant, manager

**요청 파라미터**: 없음

**응답**: `200 OK`

```typescript
// Response Body
ConsultantGroup[]
```

**응답 예시**:

```json
[
  {
    "id": "g1",
    "name": "일반상담팀",
    "description": "일반 고객 문의 및 기본 상담 처리",
    "memberIds": ["c1", "c2", "c3", "c10"]
  },
  {
    "id": "g2",
    "name": "기술지원팀",
    "description": "기술적 문제 해결 및 제품 지원",
    "memberIds": ["c4", "c5", "c6"]
  }
]
```

---

## 6. DB 스키마

### 6.1 tasks 테이블

할일 및 공지사항을 저장하는 메인 테이블입니다.

```sql
CREATE TABLE tasks (
    id                      VARCHAR(64)     PRIMARY KEY,
    owner_id                VARCHAR(64)     NOT NULL,
    type                    VARCHAR(16)     NOT NULL CHECK (type IN ('sms', 'callback', 'followup', 'notice')),
    title                   VARCHAR(500)    NOT NULL,
    description             TEXT            NOT NULL DEFAULT '',
    scheduled_date          DATE            NULL,
    deadline                DATE            NULL,
    status                  VARCHAR(16)     NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delayed', 'completed')),
    liked                   BOOLEAN         NOT NULL DEFAULT FALSE,
    pinned                  BOOLEAN         NOT NULL DEFAULT FALSE,
    pinned_at               BIGINT          NULL,
    background_color        VARCHAR(16)     NULL CHECK (background_color IN (NULL, 'white', 'yellow', 'pink', 'green', 'blue')),
    parent_id               VARCHAR(64)     NULL REFERENCES tasks(id) ON DELETE CASCADE,
    room_id                 INTEGER         NULL,    -- 해피톡/호스트 환경에 따라 VARCHAR(64) 코드로 변경 가능
    message_id              INTEGER         NULL,    -- 연결된 메시지 ID (말풍선-할일 연동, NULL이면 수동 생성). 환경별 VARCHAR 가능
    "order"                 BIGINT          NOT NULL DEFAULT 0,
    created_at              BIGINT          NOT NULL,
    completed_at            BIGINT          NULL,

    -- 공지사항 전용 필드 (type = 'notice'인 경우에만 사용)
    notice_content          TEXT            NULL,
    author                  VARCHAR(200)    NULL,
    require_read_confirmation BOOLEAN       NULL DEFAULT FALSE,

    -- 인덱스용 컬럼
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);
CREATE INDEX idx_tasks_scheduled_date ON tasks(scheduled_date);
CREATE INDEX idx_tasks_order ON tasks("order");
CREATE INDEX idx_tasks_owner_type ON tasks(owner_id, type);
CREATE INDEX idx_tasks_pinned ON tasks(pinned, pinned_at);
CREATE INDEX idx_tasks_room_message ON tasks(room_id, message_id);  -- 말풍선-할일 역조회용
```

### 6.2 notice_audience 테이블

공지사항의 대상 상담원 정보를 저장합니다 (tasks 테이블과 1:N 관계).

```sql
CREATE TABLE notice_audience (
    id              BIGSERIAL       PRIMARY KEY,
    notice_id       VARCHAR(64)     NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    consultant_id   VARCHAR(64)     NOT NULL,
    consultant_name VARCHAR(200)    NOT NULL,

    CONSTRAINT uk_notice_consultant UNIQUE (notice_id, consultant_id)
);

-- 인덱스
CREATE INDEX idx_notice_audience_notice_id ON notice_audience(notice_id);
CREATE INDEX idx_notice_audience_consultant_id ON notice_audience(consultant_id);
```

### 6.3 notice_read_status 테이블

공지사항의 상담원별 읽음 상태를 저장합니다.

```sql
CREATE TABLE notice_read_status (
    id              BIGSERIAL       PRIMARY KEY,
    notice_id       VARCHAR(64)     NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    consultant_id   VARCHAR(64)     NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    read_at         BIGINT          NULL,

    CONSTRAINT uk_notice_read UNIQUE (notice_id, consultant_id)
);

-- 인덱스
CREATE INDEX idx_notice_read_notice_id ON notice_read_status(notice_id);
CREATE INDEX idx_notice_read_consultant ON notice_read_status(consultant_id);
CREATE INDEX idx_notice_read_unread ON notice_read_status(notice_id, is_read) WHERE is_read = FALSE;
```

> **참고**: `notice_audience`와 `notice_read_status`는 하나의 테이블로 통합할 수 있습니다. 이 경우 `notice_audience` 테이블에 `is_read`, `read_at` 컬럼을 추가하면 됩니다. 아래는 통합 스키마 대안입니다.

<details>
<summary>통합 대안: notice_audience_with_read_status</summary>

```sql
CREATE TABLE notice_audience (
    id              BIGSERIAL       PRIMARY KEY,
    notice_id       VARCHAR(64)     NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    consultant_id   VARCHAR(64)     NOT NULL,
    consultant_name VARCHAR(200)    NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    read_at         BIGINT          NULL,

    CONSTRAINT uk_notice_consultant UNIQUE (notice_id, consultant_id)
);
```

</details>

### 6.4 consultants 테이블

상담원 정보를 저장합니다.

```sql
CREATE TABLE consultants (
    id              VARCHAR(64)     PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    status          VARCHAR(16)     NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'away')),
    current_load    INTEGER         NOT NULL DEFAULT 0,
    group_id        VARCHAR(64)     NULL REFERENCES consultant_groups(id) ON DELETE SET NULL
);

-- 인덱스
CREATE INDEX idx_consultants_group_id ON consultants(group_id);
CREATE INDEX idx_consultants_status ON consultants(status);
```

### 6.5 consultant_groups 테이블

상담원 그룹 정보를 저장합니다.

```sql
CREATE TABLE consultant_groups (
    id              VARCHAR(64)     PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    description     TEXT            NOT NULL DEFAULT ''
);
```

> **참고**: `ConsultantGroup.memberIds`는 API 응답에서 `consultants` 테이블의 `group_id`를 기반으로 동적으로 조합합니다. 별도의 조인 테이블 대신, `consultants.group_id` FK를 활용합니다.

### 6.6 ER 다이어그램 (텍스트)

```
consultant_groups (1) ──< consultants (N)
                              │
tasks (1) ──< notice_audience (N)
tasks (1) ──< notice_read_status (N)
tasks (1) ──< tasks (N)  [parent_id → id, self-referencing]
```

---

## 7. 비즈니스 로직 상세

### 7.1 할일 상태 자동 계산

서버는 할일을 조회할 때마다(GET 요청 시) 각 항목의 `status`를 **현재 시각 기준으로 재계산**해야 합니다.

#### 알고리즘

```
입력: scheduledDate (DATE | null), deadline (DATE | null), currentStatus (TaskStatus)
출력: TaskStatus

1. if currentStatus === 'completed' → return 'completed'
2. referenceDate = deadline ?? scheduledDate
3. if referenceDate === null → return 'pending'
4. referenceDatetime = referenceDate + 'T23:59:59.999' (해당 날짜의 자정 직전)
5. if referenceDatetime < now → return 'delayed'
6. return 'pending'
```

#### 중요 사항
- `deadline`이 존재하면 `scheduledDate`보다 우선합니다.
- 비교 시 기준일의 끝 시간(23:59:59.999)을 사용하므로, 당일 중에는 `delayed`가 되지 않습니다.
- `status`가 `'completed'`인 경우 재계산하지 않고 유지합니다.
- DB에 저장된 `status` 값이 실제 상태와 다를 수 있으므로, 주기적인 배치 업데이트 또는 조회 시점 계산을 권장합니다.

### 7.2 서브태스크 CASCADE 삭제

부모 할일이 삭제되면, `parent_id`가 해당 할일 ID인 모든 서브태스크도 함께 삭제됩니다.

- DB 레벨의 `ON DELETE CASCADE`로 처리합니다.
- 서브태스크의 서브태스크(다단계)는 현재 지원하지 않지만, DB 스키마상 가능하며 CASCADE가 재귀적으로 동작합니다.

### 7.3 공지 읽음 통계 계산

공지의 읽음 통계는 `targetAudience` 배열(또는 `notice_audience` + `notice_read_status` 테이블)을 기반으로 계산합니다.

```
total  = targetAudience 배열의 전체 길이
read   = targetAudience에서 isRead === true인 항목 수
unread = total - read
```

이 계산은 프론트엔드에서 `getNoticeReadStats()` 메서드로도 수행하지만, 서버에서 통계 API(`GET /api/v1/tasks/stats`)를 처리할 때도 동일 로직이 필요합니다.

### 7.4 ownerId 기반 개인 할일 필터링

할일 목록 조회 시 보안을 위해 반드시 사용자별 필터링을 수행해야 합니다.

| 할일 유형 | 조회 조건 |
|-----------|-----------|
| 개인 할일 (`type !== 'notice'`) | `owner_id = 요청자 ID` |
| 공지사항 (`type = 'notice'`) | `owner_id = 요청자 ID` (작성자) **OR** `요청자 ID IN targetAudience.consultantId` (대상자) |

#### SQL 예시

```sql
SELECT t.*
FROM tasks t
WHERE
  (t.type != 'notice' AND t.owner_id = :userId)
  OR
  (t.type = 'notice' AND (
    t.owner_id = :userId
    OR EXISTS (
      SELECT 1 FROM notice_audience na
      WHERE na.notice_id = t.id AND na.consultant_id = :userId
    )
  ))
ORDER BY t.pinned DESC, t.pinned_at DESC NULLS LAST, t."order" ASC;
```

### 7.5 정렬 순서

프론트엔드는 다음 정렬 규칙을 기대합니다:

1. **고정(pinned) 할일 우선**: `pinned = true`인 항목이 먼저
2. **고정 항목 내**: `pinnedAt` 내림차순 (최근 고정이 위)
3. **비고정 항목**: `order` 오름차순 (낮은 값이 위)

서버는 이 정렬을 적용하여 응답하거나, 프론트엔드에서 정렬할 수 있도록 모든 필드를 정확히 반환해야 합니다.

### 7.6 공지사항의 isRead 필드 처리

`Task.isRead` 필드는 **요청자 기준**의 읽음 상태입니다.

- 서버가 공지사항을 반환할 때, `targetAudience` 배열에서 요청자의 `consultantId`를 찾아 해당 항목의 `isRead` 값을 `Task.isRead`에 설정해야 합니다.
- 요청자가 `targetAudience`에 없는 경우 (예: 공지 작성자인 관리자) `isRead`는 생략하거나 `false`로 설정합니다.

### 7.7 허용 배경 색상 값

`backgroundColor` 필드에 허용되는 값:

| 키 | 의미 |
|----|------|
| `null` | 기본 (흰색) |
| `"white"` | 기본 (흰색) |
| `"yellow"` | 노랑 |
| `"pink"` | 분홍 |
| `"green"` | 초록 |
| `"blue"` | 파랑 |

---

## 8. API 요약 테이블

| # | 메서드 | 경로 | 설명 | 권한 |
|---|--------|------|------|------|
| 5.1 | `GET` | `/api/v1/tasks` | 할일 목록 조회 | all |
| 5.2 | `GET` | `/api/v1/tasks/:id` | 단일 할일 조회 | all |
| 5.3 | `POST` | `/api/v1/tasks` | 할일 생성 | all |
| 5.4 | `PUT` | `/api/v1/tasks/:id` | 할일 수정 | all (본인) |
| 5.5 | `DELETE` | `/api/v1/tasks/:id` | 할일 삭제 | all (본인) |
| 5.6 | `POST` | `/api/v1/tasks/:id/toggle-completion` | 완료 토글 | all (본인) |
| 5.7 | `POST` | `/api/v1/tasks/:id/toggle-like` | 좋아요 토글 | all (본인) |
| 5.8 | `POST` | `/api/v1/tasks/:id/toggle-pin` | 고정 토글 | all (본인) |
| 5.9 | `PUT` | `/api/v1/tasks/reorder` | 순서 변경 | all |
| 5.10 | `GET` | `/api/v1/tasks/stats` | 통계 조회 | all |
| 5.11 | `POST` | `/api/v1/notices` | 공지 생성 | manager |
| 5.12 | `PUT` | `/api/v1/notices/:id` | 공지 수정 | manager |
| 5.13 | `POST` | `/api/v1/notices/:id/toggle-read` | 공지 읽음 토글 | all |
| 5.14 | `PUT` | `/api/v1/notices/:id/read-status` | 공지 읽음 상태 업데이트 | all |
| 5.15 | `GET` | `/api/v1/consultants` | 상담원 목록 조회 | all |
| 5.16 | `GET` | `/api/v1/consultant-groups` | 상담원 그룹 목록 조회 | all |

> **"all"** = consultant + manager, **"all (본인)"** = 본인 소유 리소스에 대해서만

---

## 9. 참고: 프론트엔드 HTTP 클라이언트 매핑

프론트엔드 `HttpTaskApi` 클래스가 각 메서드에서 호출하는 실제 HTTP 메서드와 경로입니다. 백엔드 구현 시 이 매핑과 정확히 일치해야 합니다.

| 프론트엔드 메서드 | HTTP 메서드 | 경로 |
|-------------------|------------|------|
| `getTasks()` | GET | `/api/v1/tasks` |
| `getTaskById(id)` | GET | `/api/v1/tasks/${id}` |
| `createTask(input)` | POST | `/api/v1/tasks` |
| `updateTask(input)` | PUT | `/api/v1/tasks/${id}` |
| `deleteTask(id)` | DELETE | `/api/v1/tasks/${id}` |
| `toggleTaskCompletion(id)` | POST | `/api/v1/tasks/${id}/toggle-completion` |
| `toggleTaskLike(id)` | POST | `/api/v1/tasks/${id}/toggle-like` |
| `toggleTaskPin(id)` | POST | `/api/v1/tasks/${id}/toggle-pin` |
| `reorderTasks(tasks)` | PUT | `/api/v1/tasks/reorder` |
| `getTaskStats()` | GET | `/api/v1/tasks/stats` |
| `createNotice(input)` | POST | `/api/v1/notices` |
| `updateNotice(id, updates)` | PUT | `/api/v1/notices/${id}` |
| `toggleNoticeRead(id)` | POST | `/api/v1/notices/${id}/toggle-read` |
| `updateNoticeReadStatus(noticeId, consultantId)` | PUT | `/api/v1/notices/${id}/read-status` |

> **참고**: `getNoticeReadStats()`는 프론트엔드에서 클라이언트 사이드로 계산하며, 별도 API 호출이 없습니다. `resetTasksToInitial()`은 개발/테스트용이므로 프로덕션 API에서는 구현하지 않아도 됩니다.
