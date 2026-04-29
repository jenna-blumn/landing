# 할일 AI 자동 생성 기능

## 기능 개요

말풍선에서 할일을 생성할 때, AI(Haiku)가 대화 컨텍스트를 분석하여 할일 필드를 자동으로 프리필하는 기능.

## 데이터 플로우

```
1. 말풍선 hover → 할일 생성 버튼 클릭
2. ContactRoomArea: 선택된 메시지 기준 앞뒤 3개 컨텍스트 수집
3. claudeApi.generateTaskFromContext() 호출 (Haiku, 5초 타임아웃)
4. AI 응답 → CreateTaskInput 매핑 (타입, 제목, 내용, 날짜, 컬러, roomId, messageId)
5. onPrefillTask(data, messageId) → App.tsx: setPrefillTaskData
6. TaskContext: prefillData 감지 → TaskDrawer 자동 오픈 (편집모드)
7. 상담사: 확인/수정 후 저장
8. 저장 완료 → taskBadgeMap 업데이트 → 말풍선에 뱃지 표시
```

## AI 프롬프트 명세

### 시스템 프롬프트

역할: 컨택센터 상담사의 할일 생성을 돕는 AI 어시스턴트

### 유저 프롬프트

```
## 오늘 날짜: {todayDate}

## 대화 컨텍스트:
[고객/상담사] (시간) 메시지 내용
...

## 선택된 말풍선 (할일 생성 대상):
"선택된 메시지 텍스트"
```

### JSON 응답 스키마

```json
{
  "type": "sms" | "callback" | "followup",
  "title": "50자 이내 간결한 할일 제목",
  "description": "200자 이내 할일 상세 내용",
  "scheduledDate": "YYYY-MM-DD" | "YYYY-MM-DDTHH:mm" | null
}
```

## 할일 종류 판단 기준

| 종류 | 판단 키워드/상황 | 컬러 |
|------|-----------------|------|
| **SMS** | "문자", "메시지 보내", "SMS", "안내문자 발송" 등 명시적 문자 발송 약속 | pink |
| **콜백** | "전화", "연락", "콜백", "다시 전화", "통화" 등 음성 통화 약속 | blue |
| **팔로업** | 위 두 가지에 해당하지 않는 포괄적 후속 조치 ("확인 후 안내", "처리 후 연락" 등) | yellow |

## 대화 예시 시나리오

### SMS 예시

**대화:**
- [고객] 주문번호가 어떻게 되나요?
- [상담사] 확인 후 문자로 보내드리겠습니다.

**AI 출력:**
```json
{
  "type": "sms",
  "title": "주문번호 안내 문자 발송",
  "description": "고객에게 주문번호 확인 후 SMS로 발송",
  "scheduledDate": null
}
```

### 콜백 예시

**대화:**
- [고객] 담당자 연결 부탁드립니다.
- [상담사] 내일 오전에 전화드리겠습니다.

**AI 출력:**
```json
{
  "type": "callback",
  "title": "고객 콜백 — 담당자 연결 건",
  "description": "내일 오전 고객에게 전화하여 담당자 연결 안내",
  "scheduledDate": "2026-03-18"
}
```

### 팔로업 예시

**대화:**
- [고객] 배송이 늦어지고 있어요.
- [상담사] 확인 후 안내드리겠습니다.

**AI 출력:**
```json
{
  "type": "followup",
  "title": "배송 지연 건 확인 후 안내",
  "description": "배송 상태 확인 후 고객에게 결과 안내 필요",
  "scheduledDate": null
}
```

## 상태별 UI 동작

| 상태 | UI |
|------|-----|
| **로딩** | 할일 버튼에 스피너 아이콘 (animate-spin), cursor-wait, 파란색 배경 |
| **성공** | TaskDrawer 자동 오픈, AI 프리필 데이터로 편집모드 진입 |
| **에러/타임아웃** | followup 타입 + 말풍선 텍스트 앞 30자를 제목으로 폴백 프리필 + description에 "AI 자동 생성에 실패했습니다. 직접 입력해주세요." |

## 엣지 케이스 & 가드레일

- **메시지 3개 미만**: 앞뒤로 있는 메시지만 사용 (배열 범위 내)
- **동일 messageId 재클릭**: `useRef` 캐시에서 반환 (API 재호출 없음)
- **API 타임아웃**: AbortController 5초 제한, 초과 시 폴백
- **로딩 중 재클릭**: `generatingTaskMsgId` 상태로 중복 호출 방지
- **날짜 디폴트**: AI가 null 반환 시 오늘 날짜 (시간 없음, 종일)

## 재사용 코드 참조

| 파일 | 용도 |
|------|------|
| `src/services/claudeApi.ts` | `generateTaskFromContext()` — Haiku API 호출 |
| `src/components/ContactRoomArea/ContactRoomArea.tsx` | AI 할일 생성 핸들러, 로딩/캐시 |
| `packages/task-module/src/types/task.ts` | `CreateTaskInput`, `TASK_TYPES`, `TASK_COLORS` |
| `packages/task-module/src/context/TaskContext.tsx` | `prefillData` → Drawer 자동 오픈 |
| `packages/task-module/src/components/TaskInlineEditor.tsx` | 프리필 데이터 소비 |
