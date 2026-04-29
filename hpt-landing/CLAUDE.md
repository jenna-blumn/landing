# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HappyTalk Landing Page - A real-time customer service chat application demo built with Next.js 14. Features AI agent integration and Socket.IO-based real-time communication.

## Development Commands

```bash
yarn dev          # Start dev server on port 7777
yarn build        # Production build
yarn lint         # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 14.2.21 (App Router)
- **Language**: TypeScript (strict mode)
- **State**: Zustand
- **Real-time**: Socket.IO 2.2.0
- **Styling**: Emotion CSS-in-JS
- **HTTP**: Axios
- **Node.js**: ^22.0.0

## Architecture

### Core Patterns

**State Management (Zustand)**
- `stores/chatStore.ts` - Chat messages, room info, AI request states
- `stores/authStore.ts` - User/site authentication state

**Real-time Communication (Socket.IO)**
- `contexts/SocketProvider.tsx` - Socket connection management
- Events: `message`, `getRoomInfo`, `getChatData`, `setFinishedRoom`, `setAgentMessage`
- Emits: `setUserInfo`, `setJoinRoom`

**HTTP Layer**
- `lib/http.ts` - Two Axios instances: `publicHttp` (webhook API), `privateHttp` (design API with JWT)

### Key Directories

```
app/                  # Next.js App Router pages
components/           # React components
├── main/chat/       # Chat UI (Bubble, Indicators, etc.)
├── interaction/     # Guide components
api/                 # API call functions (chat, auth, aiAgent)
hooks/               # Custom hooks (useAuth, useAiAgent, useSending)
├── socket/          # Socket.IO hooks
stores/              # Zustand stores
models/              # TypeScript interfaces
lib/                 # Utilities (http client, helpers)
```

### API Endpoints

- **Webhook API** (`https://dev-webhook.happytalkio.com`)
  - Chat room operations: open, message, close
  - Custom headers: `CHANNELSERVICEID`, `CHANNELCUSTOMERID`, `Chat-Ver`, `Chat-Time`

- **Design API** (`https://dev-design.happytalkio.com`)
  - JWT-authenticated requests
  - Token storage: `localStorage.happytalkio_jwtToken_{siteId}`

### Data Flow

1. User lands → `useAuth` obtains JWT → SocketProvider connects
2. Socket emits `setUserInfo` + `setJoinRoom`
3. Server responds with `getRoomInfo` + `getChatData`
4. Messages flow through Socket events, stored in `chatStore`
5. AI agent status polled via `useAiAgent` hook (3s intervals)

## Code Conventions

- **Path alias**: `@/*` maps to project root
- **Formatting**: Prettier (2-space, single quotes, 80 chars)
- **Styling**: Emotion `styled` components (no Tailwind/CSS modules)
- **SVGs**: Imported as React components via @svgr/webpack

## Git Workflow

- **Main branch**: `main`
- **Development**: Work on feature branches, PR to `main`
