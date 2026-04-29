# Deskit Codebase — Full Audit & Refactoring Plan

> Generated: 2026-02-19 | Scope: Full codebase deep dive across `src/`, `customer-info-tab-package/`

---

## Summary

| Severity | BUG | PERFORMANCE | MAINTENANCE | TYPE_SAFETY | Total |
|----------|-----|-------------|-------------|-------------|-------|
| CRITICAL | 7   | 1           | 0           | 0           | 8     |
| HIGH     | 14  | 4           | 3           | 1           | 22    |
| MEDIUM   | 8   | 6           | 10          | 3           | 27    |
| LOW      | 3   | 2           | 9           | 1           | 15    |
| **Total**| **32** | **13**   | **22**      | **5**       | **72** |

---

## Phase 1: Critical Bug Fixes (Must Fix)

### C-1: SearchFilters shape mismatch in `handleExitSearchMode`
- **File:** `src/App.tsx:624-637`
- **Category:** BUG | CRITICAL
- **Problem:** Reset object uses wrong property names (`channel`, `category`, `additionalAttributes`) instead of the correct `channelFilter`, `categoryFilter`, `additionalStatus` from the `SearchFilters` interface.
- **Impact:** Filter state is corrupted after exiting search mode. Subsequent filters read `undefined`.
- **Fix:** Replace the inline object with `getDefaultSearchFilters()` (already exists in `search/types.ts`).

### C-2: Email BCC recipients treated as TO recipients
- **File:** `src/features/channelComposer/hooks/useEmailComposer.ts:39-44`
- **Category:** BUG | CRITICAL
- **Problem:** `addRecipient` routes BCC recipients to `toRecipients` and overwrites `type` to `'to'`. BCC recipients lose their designation entirely.
- **Impact:** Emails sent via the composer expose BCC recipients to all recipients.
- **Fix:** Add a `bccRecipients` state array; route BCC recipients there; stop overwriting `type`.

### C-3: Division by zero in NoticeViewer
- **File:** `src/features/taskManagement/components/NoticeViewer.tsx:122`
- **Category:** BUG | CRITICAL
- **Problem:** `Math.round((readStats.read / readStats.total) * 100)` produces NaN when `readStats.total === 0`.
- **Impact:** Renders "NaN%" in the UI for notices with no target audience.
- **Fix:** Guard: `readStats.total > 0 ? Math.round(...) : 0`.

### C-4: Corrupted Unicode in EmptyState components
- **File:** `src/components/SidebarArea/ContactListArea.tsx:492-493, 754-755`
- **Category:** BUG | CRITICAL
- **Problem:** EmptyState `title` and `description` props contain garbled/corrupted Unicode text (`"?브퀗?쀦뤃?..."`) — likely encoding corruption.
- **Impact:** Two empty state views render completely unintelligible text to users.
- **Fix:** Replace garbled strings with proper Korean text (e.g., "조건에 맞는 컨택이 없습니다").

### C-5: `loadOrders` referenced outside its scope
- **File:** `src/components/ContactReferenceArea/IntegrationTab/IntegrationDetailOverlay.tsx:149, 177`
- **Category:** BUG | CRITICAL
- **Problem:** `loadOrders` is defined inside a `useEffect` callback but referenced in JSX (`onClick={loadOrders}`). It is not in scope at the component level → `ReferenceError` at runtime.
- **Impact:** Clicking "새로고침" (Refresh) or "다시 불러오기" crashes the component.
- **Fix:** Extract `loadOrders` as a `useCallback` at the component level.

### C-6: Infinite re-render loop in `filteredContacts` useEffect
- **File:** `src/components/SidebarArea/ContactListArea.tsx:187-201`
- **Category:** BUG / PERFORMANCE | CRITICAL
- **Problem:** `filteredContacts` is computed inline (`.filter()`) producing a new array reference each render. This array is a dependency of a `useEffect` that calls `onContactClick`/`onClearSelectedRoom`, which trigger parent re-renders, creating an infinite loop. Only mitigated by early-return guards.
- **Impact:** Potential infinite re-render cascade, especially during contact list changes.
- **Fix:** Memoize `filteredContacts` with `useMemo`.

### C-7: Search status filter type mismatch
- **File:** `src/features/search/hooks/useSearchFilters.ts:63-69`
- **Category:** BUG / TYPE_SAFETY | CRITICAL
- **Problem:** `handleStatusChange` accepts `ContactStatus | null` (single value) but `SearchFilters.status` is typed as `ContactStatus[] | null` (array).
- **Impact:** Status filter may silently fail or crash downstream array operations.
- **Fix:** Wrap single value: `status: status ? [status] : null`.

### C-8: Nested async inside setTimeout in taskApi
- **File:** `src/features/taskManagement/api/taskApi.ts:577-601`
- **Category:** BUG | CRITICAL
- **Problem:** `getTaskStats` and `getSubtasks` wrap `new Promise` around `setTimeout(async () => { await ... })`. Inner `await` can fail after outer `resolve` fires, causing unhandled promise rejections.
- **Impact:** Silent errors in task stats loading; error propagation impossible.
- **Fix:** Remove nested setTimeout; call `getTasksFromStorage()` synchronously inside the single setTimeout.

---

## Phase 2: High-Severity Issues

### H-1: `assignTabToSlot` hides ALL other side tab slots
- **File:** `src/hooks/useSideTabManagement.ts:162-175`
- **Problem:** When assigning a tab, line 171 sets `isVisible: false` on ALL other slots. Same issue in `assignOmsToSlot` (line 186).
- **Impact:** Multiple simultaneously visible side tabs become impossible.
- **Fix:** Only set `isVisible: false` on the slot that previously held the same `tabId`.

### H-2: Stale closure in `useChatDisplayMode.getOpenRooms`
- **File:** `src/hooks/useChatDisplayMode.ts:32-34, 50-68`
- **Problem:** `getOpenRooms()` closes over `allRooms`. After `setAllRooms`, the function reads stale data from the closure.
- **Fix:** Use functional updater form of `setAllRooms` consistently, or use a ref for latest value.

### H-3: Stale `getOpenRooms` in `handleCloseRoom`
- **File:** `src/hooks/useRoomManagement.ts:40-48`
- **Problem:** After closing a room via `setAllRooms` (functional updater), `getOpenRooms()` on line 46 reads stale `allRooms`.
- **Fix:** Compute new open rooms inside the functional updater, or use `useEffect` to react to changes.

### H-4: SearchModeSnapshot missing channel types
- **File:** `src/features/search/types.ts:152`
- **Problem:** `selectedChannel` typed as `'all' | 'chat' | 'phone'` but app also uses `'board' | 'email'`.
- **Fix:** Use the `Channel` type from `src/types/channel.ts`.

### H-5: No memoization on ~30 handler functions in App.tsx
- **File:** `src/App.tsx` (throughout)
- **Problem:** None of the handler functions use `useCallback`. Every re-render creates new references propagated to all children.
- **Fix:** Wrap all handlers in `useCallback` with appropriate dependencies.

### H-6: 40+ useState calls in App.tsx
- **File:** `src/App.tsx:41-135`
- **Problem:** Monolithic component with ~40 individual `useState` calls. Any state change re-renders entire tree.
- **Fix:** Group related state with `useReducer`; consider React Context for cross-cutting concerns.

### H-7: `any` type for task-related state
- **File:** `src/App.tsx:131, 135, 645, 680, 684, 699`
- **Problem:** `selectedTaskForDetail` and `pendingOverlayRequest.task` are `any`.
- **Fix:** Use `Task | null` from `src/features/taskManagement/types.ts`.

### H-8: ChatModeContainer + PhoneModeContainer ~80% duplication
- **File:** `src/modes/ChatModeContainer.tsx` (449 lines) + `src/modes/PhoneModeContainer.tsx` (445 lines)
- **Problem:** Near-identical components with minor differences. Changes must be made in two places.
- **Fix:** Create shared `WorkspaceContainer` with a `mode: 'chat' | 'phone'` prop.

### H-9: Props explosion (~82 properties)
- **File:** `src/modes/ChatModeContainer.tsx:18-100`
- **Problem:** `ChatModeContainerProps` has ~82 properties. Extreme props drilling.
- **Fix:** Group into sub-objects or adopt React Context.

### H-10: Always-active global `mousemove` listener
- **File:** `src/components/RightNavigationBar.tsx:93-130`
- **Problem:** Unconditional `document.addEventListener('mousemove')` fires on every mouse movement, triggering `getBoundingClientRect()` and state updates constantly.
- **Fix:** Use `mouseenter`/`mouseleave` on a capture zone, or throttle to 50-100ms.

### H-11: FilterModal state not synced on reopen
- **File:** `src/components/SidebarArea/FilterModal.tsx:29`
- **Problem:** `localFilters` is initialized from prop only once. Reopening modal shows stale values.
- **Fix:** Add `useEffect` to sync `localFilters` with `filters` when `isOpen` transitions to `true`.

### H-12: `onSelectResult(null)` type mismatch
- **File:** `src/components/SearchArea/SearchArea.tsx:801`
- **Problem:** Passes `null` where `(resultId: number) => void` is expected.
- **Fix:** Update type to `(resultId: number | null) => void`.

### H-13: ConsultantSelectionModal state not reset on reopen
- **File:** `src/components/SidebarArea/ConsultantSelectionModal.tsx:30`
- **Problem:** `selectedConsultant` persists across modal open/close cycles.
- **Fix:** Reset to `null` when `isOpen` changes to `true`.

### H-14: Category filter is a no-op
- **File:** `src/features/search/utils/searchUtils.ts:139-146`
- **Problem:** Category filter section has no filtering logic — only comments saying "pass-through".
- **Impact:** Category filtering is non-functional despite UI showing it.
- **Fix:** Implement filtering logic or mark feature as unimplemented in UI.

### H-15: Stale closure in TaskInlineEditor click-outside
- **File:** `src/features/taskManagement/components/TaskInlineEditor.tsx:52-66`
- **Problem:** `handleSave` captures stale values for `type`, `description`, `scheduledDate`, etc.
- **Fix:** Wrap `handleSave` in `useCallback` with all dependencies, or use refs.

### H-16: Missing useEffect dependencies in TaskBoard
- **File:** `src/features/taskManagement/components/TaskBoard.tsx:69-83`
- **Problem:** `loadTasks` not in deps (line 71); `selectedFilter` missing from deps (line 83).
- **Fix:** Memoize `loadTasks`; add missing deps.

### H-17: Missing useEffect dependencies in TaskDrawer
- **File:** `src/features/taskManagement/components/TaskDrawer.tsx:80-90`
- **Problem:** `loadTasks` called in effect but not in dependency array.
- **Fix:** Memoize with `useCallback`.

### H-18: JSON.stringify for deep comparison on every `getTasks`
- **File:** `src/features/taskManagement/api/taskApi.ts:378`
- **Problem:** Serializes entire task array twice per call for comparison.
- **Fix:** Use boolean flag to track if any task changed during map.

### H-19: Stale sectionStates in useHistoryTabState initial layout
- **File:** `src/features/history/hooks/useHistoryTabState.ts:103-117`
- **Problem:** Initial `useEffect` reads `sectionStates` from closure (may be empty `{}`).
- **Fix:** Use functional updater pattern.

### H-20: `getCounts()` recalculated every render without memo
- **File:** `src/components/SidebarArea/InboxArea.tsx:69-80+`
- **Problem:** Multiple `.filter()` calls on `allRooms` array every render.
- **Fix:** Wrap with `useMemo`.

---

## Phase 3: Medium-Severity Issues

### M-1: `getSelectedRoomInfo()` called 4 times per render
- **File:** `src/modes/ChatModeContainer.tsx:387-390`
- **Fix:** Call once, store in variable.

### M-2: Both mode containers always mounted
- **File:** `src/App.tsx:832, 923`
- **Fix:** Consider lazy mounting or aggressive `React.memo`.

### M-3: Duplicate SearchResultOverlay rendered
- **File:** Both mode containers
- **Fix:** Remove duplicate or add mutual exclusion.

### M-4: PhoneModeContainer missing `title` in getSelectedRoomInfo
- **File:** `src/modes/PhoneModeContainer.tsx:214-224`
- **Fix:** Add `title: selectedRoom.conversationTopic`.

### M-5: setTimeout race condition in drawer reopen
- **File:** `src/App.tsx:707-714`
- **Fix:** Use key prop on TaskDrawer or ref for mount tracking.

### M-6: Room.mainCategory missing 'received'
- **File:** `src/data/mockData.ts:30` vs `src/App.tsx:49`
- **Fix:** Add `'received'` to Room type.

### M-7: OmsConnectionModal validation always true
- **File:** `src/components/OmsConnectionModal.tsx:53`
- **Fix:** Implement actual validation.

### M-8: Hardcoded mock customer data in reference areas
- **Files:** `src/components/SecondaryReferenceArea.tsx:121-149`, `ContactReferenceArea.tsx`
- **Fix:** Accept customer data as prop.

### M-9: `any` types in InfoTab, ContactTab, IntegrationTab
- **Files:** Multiple files
- **Fix:** Replace with proper interfaces.

### M-10: Duplicated getMaxRoomsForMode
- **Files:** `useChatDisplayMode.ts:21-30`, `useRoomManagement.ts:17-26`
- **Fix:** Extract to shared utility.

### M-11: SharedReferenceArea hook is 833 lines
- **File:** `src/components/SharedReferenceArea/SharedReferenceArea.tsx`
- **Fix:** Split into smaller hooks.

### M-12: `clampPanelWidths` cascade in SharedReferenceArea
- **File:** `SharedReferenceArea.tsx:448-450`
- **Fix:** Use ref for previous values; only setState when changed.

### M-13: No virtualization for contact lists
- **File:** `src/components/SidebarArea/ContactListArea.tsx`
- **Fix:** Implement `react-virtual` or `react-window`.

### M-14: Manager action modals perform no actions
- **File:** `src/components/ContactRoomArea/ContactRoomArea.tsx:388-421`
- **Fix:** Implement handlers that update room `contactStatus`.

### M-15: Duplicated inline `<style>` tags
- **Files:** ReferenceSettingsPanel, SideTabOverlay, SearchResultOverlay, RightNavigationBar
- **Fix:** Extract to `index.css`.

### M-16: Dead code — unexported functions across all modules
- **Files:** `taskApi.ts`, `historyApi.ts`, `integrationsApi.ts`, `searchApi.ts`, `referenceSettingsApi.ts`, `categoryDefinitions.ts`, `aiSummaryGenerator.ts`
- **Fix:** Export if needed, remove otherwise.

### M-17: myKnowledge deleteFolder doesn't handle nested folders
- **File:** `src/features/myKnowledge/api/myKnowledgeApi.ts:122-130`
- **Fix:** Implement recursive deletion.

### M-18: myKnowledge data lost on page refresh
- **File:** `src/features/myKnowledge/api/myKnowledgeApi.ts:10-11`
- **Fix:** Add localStorage persistence.

### M-19: Module-level caches without invalidation
- **Files:** `referenceSettingsApi.ts:10`, `historyApi.ts`
- **Fix:** Listen for `storage` events or remove cache.

### M-20: CustomerInfo `[key: string]: any` index signature
- **File:** `src/features/customerTab/types.ts:32`
- **Fix:** Remove index signature; define fields explicitly.

### M-21: No-op destructuring in referenceSettingsApi
- **File:** `src/features/referenceSettings/api/referenceSettingsApi.ts:23-26`
- **Fix:** Remove the no-op map.

### M-22: `calculateMaxHeight` negative margin when sectionsCount=0
- **File:** `src/features/history/utils/calculations.ts:96`
- **Fix:** Add guard: `sectionsCount > 1 ? ... : 0`.

### M-23: TaskEditMode `onSave` in useEffect deps
- **File:** `src/features/taskManagement/components/TaskEditMode.tsx:95-107`
- **Fix:** Use ref for latest `onSave`.

### M-24: Double-call to `getNoticeReadStats` in TaskViewMode
- **File:** `src/features/taskManagement/components/TaskViewMode.tsx:238-239`
- **Fix:** Extract to local variable.

---

## Phase 4: Low-Severity & Cleanup

### L-1: Stale closures in toggle handlers
- `App.tsx:347-350` (`handleTogglePhoneButtonVisibility`), `App.tsx:442-444` (`toggleSidebar`)
- **Fix:** Use `prev => !prev` functional updater.

### L-2: Helper functions defined inside component body
- `App.tsx:481-501` (`getFlagColor`, `getFlagLabel`)
- **Fix:** Move to module scope.

### L-3: Task stats polling continues in background tabs
- `App.tsx:138-159`
- **Fix:** Use `document.visibilitychange` to pause/resume.

### L-4: `Date.now()` used for IDs (collision risk)
- `customerTab/hooks/useCustomerInfoState.ts`, `ContactTab/ClassificationTagsSection.tsx:70`
- **Fix:** Use `crypto.randomUUID()`.

### L-5: Unused exports / dead code
- `sideTab.ts:28-30` (`SideTabSettings`), `sideTab.ts:44` (`DEFAULT_SIDE_TAB_COLOR`), `timeUtils.ts:3-22` (`formatRemainingTime`), `taskManagement/types.ts:111` (`TASK_STATUS`), `referenceSettings/types.ts:1` (`ReferencePosition`), `contactTab/types.ts` (multiple)
- **Fix:** Remove all unused exports.

### L-6: Keyboard accessibility missing on interactive divs
- Multiple components (ContactListArea, ActivityLogSection)
- **Fix:** Use semantic `<button>` or add ARIA roles.

### L-7: `isAlarmActive` treats timestamp 0 as null
- `src/utils/timeUtils.ts:24-27`
- **Fix:** Check `=== null || === undefined` explicitly.

### L-8: Non-null assertion on root element
- `src/main.tsx:7`
- **Fix:** Add null check with helpful error message.

### L-9: Deprecated `document.execCommand('copy')`
- `src/features/customerTab/utils/copyToClipboard.ts`
- **Fix:** Consider removing fallback.

### L-10: DatePickerModal silently fails when portal missing
- `src/features/taskManagement/components/DatePickerModal.tsx`
- **Fix:** Add `console.warn`.

### L-11: `useFieldVisibility` hardcodes field list
- `src/features/customerTab/hooks/useFieldVisibility.ts:35`
- **Fix:** Derive from `fieldDefinitions`.

---

## Recommended Execution Order

### Sprint 1 — Critical Fixes (Phase 1)
Fix all 8 critical issues. These are active bugs that can cause crashes, data corruption, or broken functionality.

### Sprint 2 — High-Impact Bugs (Phase 2, bugs only)
Fix H-1 through H-4, H-11, H-12, H-13, H-14, H-15, H-16, H-17, H-19.

### Sprint 3 — Performance (Phase 2, performance)
Fix H-5, H-6, H-10, H-18, H-20 — all performance-related high-severity items.

### Sprint 4 — Architecture (Phase 2, maintenance)
Fix H-7, H-8, H-9 — type safety and structural issues.

### Sprint 5 — Medium Issues (Phase 3)
Work through M-1 to M-24 in priority order.

### Sprint 6 — Cleanup (Phase 4)
Address L-1 through L-11.

---

## Verification

After each sprint:
```bash
npx tsc --noEmit && npm run lint
```

Manual testing:
- Navigate through all sidebar filters and search mode
- Open/close side tabs, verify multiple can be visible
- Compose an email with BCC recipients
- Create/view notices with zero target audience
- Test contact list empty states
- Click refresh in OMS integration detail overlay
- Test category filter in search mode
