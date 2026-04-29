# 채팅/전화 모드 전환 Handoff

## 1. 상태 소유권 표

| state | owner | readers | writers |
| --- | --- | --- | --- |
| `selectedRoomId` | `App` (chat workspace) | `ChatModeContainer`, `TaskDrawer`, search snapshot | `ChatModeContainer`, `App` |
| `phoneSelectedRoomId` | `App` (phone workspace) | `PhoneModeContainer`, `TaskDrawer`, search snapshot | `PhoneModeContainer`, `App` |
| `selectedChannel` | `App` | `ChannelBrandArea`, `SidebarArea`, mode containers | `App.handleChannelChange`, `App.handleWorkspaceTransition` |
| `selectedMainCategory` | `App` | `InboxArea`, `ContactListArea` | `InboxArea`, `App` |
| `selectedAdditionalCategory` | `App` | `InboxArea`, `ContactListArea` | `InboxArea`, `App` |
| `selectedQueueType` | `App` | `QueueArea`, `InboxArea`, `ContactListArea` | `QueueArea`, `App` |
| `chatWorkspaceSnapshot` | `App` | `App.handleWorkspaceTransition` | `App.handleWorkspaceTransition` |
| `phoneWorkspaceSnapshot` | `App` | `App.handleWorkspaceTransition` | `App.handleWorkspaceTransition` |
| `openRoomIds` (`allRooms[].isOpen`) | `App` | contact room/list/reference 영역 | `App`, mode containers |

## 2. 이벤트 순서 (단일 전환 경로)

- 모든 채널 버튼은 `onChannelChange(channel)` 한 경로만 사용한다.
- 전화 버튼도 동일하게 `onChannelChange('phone')`만 호출한다.
- 전환 흐름은 `App.handleWorkspaceTransition(targetChannel, targetMode)`에서만 처리한다.

### 채팅 -> 전화
1. `chatWorkspaceSnapshot` 저장
2. `isPhoneModeActive=true`, `selectedChannel='phone'`
3. `phoneWorkspaceSnapshot` 있으면 복원, 없으면 초기화 (`responding`, 첫 컨택 자동 선택)
4. `phoneSelectedRoomId`, `openRoomIds` 반영

### 전화 -> 채팅
1. `phoneWorkspaceSnapshot` 저장
2. `chatWorkspaceSnapshot` 복원
3. 타겟 채널(`all/chat/board/email`) 반영
4. `isPhoneModeActive=false`

## 3. 비범위 명시

- 검색모드/검색오버레이/Task Drawer 자체 상태는 모드별 복원 대상이 아님 (공용 상태).
- 스냅샷은 런타임 메모리 기준이며 새로고침 후 복원은 기존 정책 유지.

## 4. 데스크톱 전용 정책

- 현재 레이아웃은 `min-w-[1280px]` 기준으로 동작한다.
- 이번 릴리스는 데스크톱 우선(권장 1280px 이상)이며 모바일 반응형 확장은 범위 밖이다.

## 5. QA 체크리스트

1. 전화 최초 진입 시 `responding` 필터 + 보이는 리스트 첫 컨택 자동 오픈.
2. 전화 -> 채팅 -> 전화 왕복 시 인박스/큐/선택 컨택/열린 룸 복원.
3. 채팅 -> 전화 -> 채팅 왕복 시 이전 채팅 스냅샷 복원.
4. 인박스/필터 변경 후 선택 컨택이 결과에서 제외되면 자동 보정(첫 항목 재선택 또는 미선택).
5. 전화 버튼 클릭 시 상태 전환 함수 경로가 단일(`onChannelChange -> handleWorkspaceTransition`).
6. TaskDrawer의 room 네비게이션이 현재 모드의 선택 상태(chat/phone)를 올바르게 갱신.
7. 로딩/에러 배너가 비동기 실패에서 재시도 가능 UI를 노출.

## 6. 자동 테스트 권장 목록

1. `App` 모드 전환 유닛 테스트: chat->phone 초기 진입/복원.
2. `App` 모드 전환 유닛 테스트: phone->chat 복원 및 target channel 적용.
3. `ChannelBrandArea` 클릭 테스트: 전화 버튼이 `onChannelChange('phone')`만 호출.
4. `ContactListArea` 선택 유효성 테스트: 필터 제외 시 재선택/해제.
5. `TaskDrawer` 네비게이션 테스트: `isPhoneModeActive` 기준 selected room writer 분기.
6. `InboxArea` 자동 오픈 테스트: 공통 selector 기준 첫 항목 선택.
7. 회귀 통합 테스트: chat/phone 왕복 2회 이상 상태 보존.
