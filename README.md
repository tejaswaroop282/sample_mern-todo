# mern-todo (known-good sample)

A small MERN to-do app used to test DevPilot repeatably. It works: the server tests pass against a MongoDB and
the client builds.

It intentionally has **no Dockerfile, no GitHub Actions workflow and no render.yaml**. DevPilot must generate them.

## Layout
- `server/` Express + Mongoose API. `npm start`, `npm test`.
- `client/` React + Vite single page app. `npm run build` writes `client/dist`.

## Environment variables (names only)
| Name | Where | Secret | Notes |
|---|---|---|---|
| `MONGODB_URI` | server | yes | Required. Server tests also read it, defaulting to `mongodb://127.0.0.1:27017/todo_test`. |
| `PORT` | server | no | Defaults to 5000. |
| `VITE_API_URL` | client (build time) | no | Base URL of the API. Empty means same origin. |

## Run locally
```
cd server && npm ci && MONGODB_URI=mongodb://127.0.0.1:27017/todo npm start
cd client && npm ci && npm run dev
```
