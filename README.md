# LM Studio Extender

A full-stack wrapper around the [LM Studio](https://lmstudio.ai/) local inference API that adds authentication, subscription-based token rate limiting, persistent multi-session chat history, MCP tool integration, and a purpose-built Angular frontend.

---

## Overview

LM Studio exposes a raw OpenAI-compatible REST API with no auth, no persistence, and no multi-user support. This project sits in front of it and provides all of that, turning a single-user local inference server into a proper multi-user application.

```
Angular UI  ──►  NestJS API  ──►  LM Studio (localhost)
                    │
                 MongoDB
```

---

## Features

### Authentication
- JWT-based login with bcrypt password hashing
- Invite-only registration gated by a `REGISTER_SECRET` environment variable
- Account activation flow via MD5 hash link (email-ready for production)
- Role-based access control (`user` / `admin`) via `RolesGuard`
- Global JWT guard — all endpoints are protected by default; public routes are opted out explicitly

### Subscription & Token Rate Limiting
- Per-user token usage tracking stored in MongoDB
- Subscription tiers (`free`, `basic`) each have an independently configurable rate limit
- Token limit configs define `tokensPerInterval` and `minutesTillReset` — fully manageable via REST
- On each streaming request the API checks the user's consumed tokens against their tier's limit and resets the counter automatically when the interval expires
- Exceeding the limit returns `403 Forbidden` with the exact reset timestamp

### Chat — Streaming & Persistence
- **SSE streaming** via `POST /lmstudio/chat-stream` — streams LM Studio output token-by-token to the frontend
- **Conversation context** is maintained automatically: the API fetches the latest `response_id` for a session from MongoDB and passes it as `previous_response_id` to LM Studio so the model retains context across turns
- **Session management** — omit `internalChatId` to start a new session (the generated ID is returned via a `created_chat` SSE event); supply it to continue an existing one
- All exchanges are persisted in MongoDB under user-scoped sessions
- Non-streaming `POST /lmstudio/chat` for simple one-shot requests

### Multiple Chat Windows
- Each user can maintain any number of independent chat sessions simultaneously
- Sessions are identified by an MD5 `internalChatId` and scoped to the authenticated user — other users cannot read or write to them
- Chat metadata (name, last activity) is managed separately from message content, allowing the UI to list and label sessions without loading full history

### MCP Integration
- NestJS app exposes its own MCP server via `@rekog/mcp-nest`, supporting both **Streamable HTTP** and **SSE** transports
- Per-request **ephemeral MCP servers** can be injected into any chat call — the frontend passes a `server_url` and optional `allowed_tools` and the API forwards them to LM Studio as part of the request
- Enables LM Studio models to call external tools (web fetch, custom APIs, etc.) on a per-request basis without any persistent server configuration

### Model Support
- `GET /lmstudio/models` proxies LM Studio's model list including capabilities and quantization info
- Chat requests support the full LM Studio parameter surface: `temperature`, `top_p`, `top_k`, `min_p`, `repeat_penalty`, `max_output_tokens`, `context_length`, `reasoning`
- **Vision** support via `ImageInputDto` — base64 data URLs can be included alongside text messages
- **Reasoning effort** control (`off` / `low` / `medium` / `high` / `on`) for models that support it

### API & Developer Experience
- Full **OpenAPI / Swagger UI** available at `/api` when `USE_SWAGGER=true`
- `openapi.json` is written to disk on startup (used to generate the Angular API client)
- Angular client is generated from the spec via `npm run gen:client` — no hand-written HTTP calls in the frontend
- `mcp-proxy.js` sidecar bridges legacy SSE MCP transport to Streamable HTTP for clients that need it

---

## Architecture

### Backend — `apps/api` (NestJS 11)

| Module | Responsibility |
|---|---|
| `AuthModule` | JWT issuance, bcrypt hashing, registration flow, guards |
| `LmStudioModule` | Proxy to LM Studio REST API, SSE streaming, token tracking |
| `ChatsModule` | Persisted message history, session lookup, user-scoped access |
| `ChatMetadataModule` | Session labels, last-activity timestamps, cascade deletes |
| `TokenLimitModule` | Per-subscription rate limit configs, reset scheduling |
| `McpModule` | Exposes the app itself as an MCP server over HTTP + SSE |

### Frontend — `apps/ui` (Angular 21)
- Standalone components, signal-based where applicable
- Generated API client from OpenAPI spec (no raw `HttpClient` calls in application code)
- JWT stored and attached via `AuthInterceptor`
- Multiple simultaneous chat windows with independent session state
- Markdown rendering with KaTeX math support
- Tailwind CSS 4 styling

### Database — MongoDB
| Collection | Contents |
|---|---|
| `users` | Credentials, roles, subscription tier, token counters |
| `chats` | Individual message entries keyed by `internalChatId` |
| `chats_metadata` | Session labels and timestamps |
| `token_limit_configs` | Rate limit parameters per subscription tier |

---

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Returns a signed JWT (1 h expiry) |
| POST | `/auth/register` | Public | Creates an inactive user account |
| GET | `/auth/activate?hash=` | Public | Activates account, returns JWT |

### LM Studio
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/lmstudio/models` | JWT | List loaded models |
| POST | `/lmstudio/chat` | JWT | One-shot chat completion |
| POST | `/lmstudio/chat-stream` | JWT | SSE streaming chat with persistence |

### Chats
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/chats` | JWT | List all sessions for the current user |
| GET | `/chats/:internalChatId` | JWT | Get all messages in a session |

### Chat Metadata
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/chats-metadata` | JWT | Create a metadata entry for a session |
| GET | `/chats-metadata` | JWT | List all metadata for the current user |
| GET | `/chats-metadata/:id` | JWT | Get a single entry |
| PATCH | `/chats-metadata/:id` | JWT | Update name or other fields |
| DELETE | `/chats-metadata/:id` | JWT | Delete entry and cascade-delete messages |

### Token Limit Configs
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/token-limit-configs` | JWT | Create a config for a subscription tier |
| GET | `/token-limit-configs` | JWT | List all configs |
| GET | `/token-limit-configs/subscription/:tier` | JWT | Get config for a specific tier |
| GET | `/token-limit-configs/:id` | JWT | Get config by ID |
| PUT | `/token-limit-configs/:id` | JWT | Update a config |
| DELETE | `/token-limit-configs/:id` | JWT | Delete a config |

---

## Setup

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- [LM Studio](https://lmstudio.ai/) running with at least one model loaded and the local server enabled

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the repo root (or in `apps/api/` if running standalone):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/lmStudioWrapper

# JWT — use a long random string in production
JWT_SECRET=change_me

# LM Studio local server URL
LM_STUDIO_BASE_URL=http://localhost:1234

# Registration
REGISTER_SECRET=your_invite_secret
RETURN_REGISTER_HASH=true   # set to false in production

# Url this server is hosted on
SELF_MCP_URL=http://localhost:8888/tools/mcp

# Optional
PORT=8888
USE_SWAGGER=true
```

### Run

```bash
# API (NestJS) — http://localhost:8888
npx nx serve api

# UI (Angular) — http://localhost:4200
npx nx serve ui
```

The UI dev server proxies `/api/*` → `http://localhost:3000` via `apps/ui/proxy.conf.json`.

### Generate OpenAPI client

After changing any API controllers or DTOs:

```bash
# 1. Start the API with Swagger enabled
USE_SWAGGER=true npx nx serve api

# 2. Regenerate the Angular client
npm run gen:client
```

---

## Monorepo Commands

```bash
npm start                     # serve both api and ui concurrently
npm run build                 # build all projects
npx nx serve api              # API only
npx nx serve ui               # UI only
npx nx test api               # Jest tests for API
npx nx graph                  # visualise project dependency graph
npx nx affected --target=build  # build only what changed
```
## Structure

```
lm-studio-extender/
├── apps/
│   ├── api/          # NestJS backend (lm-studio-extender-api)
│   └── ui/           # Angular frontend (lm-studio-extender-ui)
├── packages/         # Shared libraries (future use)
├── nx.json
├── tsconfig.base.json
└── package.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (for API)
- LM Studio running locally

## Setup

```bash
npm install
```

## Development

Start both apps concurrently:
```bash
npm start
# or individually:
npm run api    # NestJS on http://localhost:3000
npm run ui     # Angular on http://localhost:4200
```

## Build

```bash
npm run build        # build all
npm run build:api    # build API only
npm run build:ui     # build UI only
```

## Test & Lint

```bash
npm test             # test all
npm run lint         # lint all
npx nx test api      # test API only
npx nx test ui       # test UI only
```

## Generate Angular API Client

After modifying the API OpenAPI spec (`apps/api/openapi.json`):
```bash
npm run gen:client
```
This regenerates `apps/ui/src/app/client/` from the OpenAPI spec.

## NX CLI

```bash
npx nx graph                          # visualize project graph
npx nx affected --target=build        # build only affected projects
npx nx run-many --target=test --all   # run all tests
```

## Configuration

- **API port**: Set `PORT` env var (default `3000`)
- **UI proxy**: `apps/ui/proxy.conf.json` — proxies `/api/*` to the API during development
- **MongoDB**: Set `MONGODB_URI` env var in API
