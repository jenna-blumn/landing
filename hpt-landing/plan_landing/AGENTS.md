# AGENTS.md

이 파일은 이 저장소에서 작업하는 AI 코딩 에이전트용 공통 규칙이다.
`CLAUDE.md`의 저장소 전용 지침을 기준으로 정리했으며, Codex/Gemini 등 에이전트가 공통으로 참고하는 규칙 파일로 사용한다.

## 작업 원칙
- 속도보다 신중함을 우선한다. 확실하지 않으면 가정을 숨기지 말고 명시한다.
- 요청 범위를 벗어나는 기능 추가, 추측성 추상화, 과도한 리팩터링을 하지 않는다.
- 기존 코드 스타일과 구조를 우선 존중한다.
- 관련 없는 데드 코드는 임의로 삭제하지 않는다. 필요하면 언급만 한다.
- 자신의 변경으로 인해 생긴 미사용 import/변수/함수만 정리한다.

## 디자인 시스템 우선
- 신규 UI 컴포넌트 개발 시 `@blumnai-studio/blumnai-design-system`을 우선 사용한다.
- 직접 구현 전에 디자인 시스템에 동일하거나 유사한 컴포넌트가 있는지 먼저 확인한다.
- 디자인 시스템 관련 작업을 시작하기 전에 가능하면 `node_modules/@blumnai-studio/blumnai-design-system/AI.md`를 먼저 읽는다.

## 문자열/인코딩 정책
- 기존 UI 한국어 문자열(메뉴명/라벨/툴팁)을 임의로 영문/ASCII로 바꾸지 말 것.
- 문자열 깨짐이 보이면 대체 문구로 교체하지 말고, 동일 의미의 원문 한국어를 유지해 최소 수정할 것.
- 수정 전후 파일 인코딩은 UTF-8로 유지(가능하면 UTF-8 without BOM), 줄바꿈은 기존 규칙 유지.
- 문자열 리터럴 오류(따옴표 미종결 등)는 해당 라인만 국소 수정하고, 주변 텍스트/언어는 변경 금지.
- 인코딩이 불확실하면 먼저 사용자에게 확인 질문 후 진행.

## 검증 정책
- 변경 후 반드시 타입체크와 빌드, 가능하면 린트까지 실행한다.
- 깨진 문자열 패턴(모지바케, U+FFFD) 검색 후 0건을 확인한다.
- 작업 완료 보고 전에 실제 검증 결과를 확인한다.

## 검증 명령
- 타입체크: `pnpm.cmd exec tsc -p tsconfig.app.json --noEmit`
- 빌드: `pnpm.cmd build`
- 린트: `pnpm.cmd lint`
- 깨진 문자열 검색: `rg -n "\\uFFFD" src packages/task-module/src`

주의:
- 루트 `tsconfig.json`은 project reference 용도이므로 `pnpm.cmd exec tsc --noEmit`만으로는 충분하지 않을 수 있다.
- 이 저장소의 PowerShell 환경에서는 `pnpm` 대신 `pnpm.cmd`를 사용하는 것이 안전하다.

## 프로젝트 개요
- React 18 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- pnpm workspace (`packageManager: pnpm@10.30.3`)
- Zustand 사용
- localStorage 기반 mock 데이터 저장 사용

## 경로 별칭
- `@deskit/task-module` → `./packages/task-module/src`
- `@deskit/team-chat` → `./packages/team-chat/src`

## 코딩 컨벤션
- UI 텍스트는 한국어 기준으로 유지한다.
- 스타일은 기존 Tailwind 유틸리티 클래스 패턴을 따른다.
- 구조는 feature 단위 모듈 분리를 우선한다.
- 상태 관리는 기존 App-level state, custom hooks, Zustand 패턴을 유지한다.
- ESLint에서 `@typescript-eslint/no-unused-vars`는 `^_` 접두사 변수를 허용한다.

## 개발 서버
- UI 작업, 컴포넌트 수정, 프론트엔드 기능 추가/테스트가 필요하면 개발 서버 실행 여부를 먼저 확인한다.
- 이미 실행 중이면 중복 실행하지 않는다.
- 기본 포트는 Vite 기준 `5173`이지만, 이미 사용 중이면 다른 포트로 올라갈 수 있다.

## 주요 패키지 메모

### `packages/task-module`
- 할일 CRUD, 캘린더/칸반 보드, 공지사항, 플로팅/네비게이션 버튼, 드로우어 관련 독립 모듈
- 주요 진입점: `context/TaskModuleProvider.tsx`, `context/TaskContext.tsx`, `components/TaskWidget.tsx`

### `packages/team-chat`
- 팀채팅/스레드 독립 모듈
- 주요 진입점: `context/TeamChatProvider.tsx`, `context/TeamChatContext.tsx`

## 변경 방식
- 필요한 부분만 외과적으로 수정한다.
- 사용자의 요청과 직접 연결되는 변경만 수행한다.
- 다단계 작업이면 간단한 계획과 검증 기준을 먼저 정리하고 진행한다.
