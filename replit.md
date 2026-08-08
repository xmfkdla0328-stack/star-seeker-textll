# Star-Seeker

## Project overview

Star-Seeker is a Vite-based browser story game. The frontend is a vanilla JavaScript single-page experience with story data under `story/`, rendering and state logic under `engine/`, and screen-specific styles under `css/`.

Game progress is currently stored locally in the browser through a dedicated storage module. Keep persistence calls behind that module so the implementation can later be replaced with a remote provider such as Supabase without changing story views.

## User preferences

- 한국어로 안내합니다.
- Story data, rendering, state, and persistence responsibilities should remain separated.