# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

**Project Overview**
- **Name**: Hintro Dashboard (local workspace)
- **Purpose**: Frontend dashboard for Hintro that displays call session statistics, recent sessions, and allows users to submit feedback. Feedback is persisted locally in `localStorage` and displayed on a Feedback History page.

**Tech Stack**
- **Framework**: React (function components + hooks)
- **Bundler / Dev Server**: Vite
- **Styling**: Tailwind CSS + daisyUI utilities
- **Routing**: react-router (Outlet + useOutletContext)
- **Icons**: react-icons
- **Storage**: localStorage for offline feedback persistence (`hintro_feedbacks` key)
- **Build tools**: Node.js and npm

**Project Structure (important files)**
- `index.html` — app entry
- `src/main.jsx` — React entry
- `src/App.jsx` — top-level routes (uses `Outlet`)
- `src/components/Dashboard.jsx` — parent dashboard container (data fetching, state, modals)
- `src/components/DashboardElement.jsx` — presentational dashboard content (receives data via `Outlet` context)
- `src/components/Recent.jsx` — recent call sessions list
- `src/components/FeedBackHistory.jsx` — feedback history (reads `hintro_feedbacks` from localStorage and filters by current user)
- `src/components/Login.jsx` — login UI (adds password show/hide)
- `src/components/Avatar.jsx` — avatar display helper

**Key Conventions**
- Components use React function components and hooks (`useState`, `useEffect`).
- Data fetching lives in `Dashboard.jsx` and uses a `dataFetch()` wrapper that returns `{data, error}`.
- Presentation components receive already-fetched data via `Outlet` context or props (see `DashboardElement.jsx`). Use `useOutletContext()` in route children to consume.
- Local persistence uses `localStorage` key `hintro_feedbacks` storing an array of feedback objects with fields: `title`, `rating`, `description`, `date`, `time`, `iso`, and `userId`.
- Feedback `userId` is derived from the logged-in profile (email mapped to `u1`/`u2`) so feedbacks are scoped per user in the same browser.
- Helpers like `formatDuration()` and `formatRelativeTime()` are defensive — they sanitize input and avoid NaN.
- CSS: Tailwind utility classes throughout; small custom classes used sparingly.

**Assumptions**
- The app expects a stored `profile` in `localStorage` with at least an `email` field used to identify user. The current mapping uses `u1@gmail.com` → `u1`, otherwise `u2`.
- A mock backend base URL `https://mock-backend-hintro.vercel.app` is used in `dataFetch`. Replace it with a real backend as needed.
- Feedback entries created prior to adding `userId` will not automatically appear in per-user lists. Consider running a migration or treating empty `userId` entries as global if desired.
- The app is developed on Windows but commands are cross-platform (Node + npm). For Windows PowerShell users, `npm` commands work the same.

**Setup & Run (development)**
1. Install dependencies:

```
npm install
```

2. Run the dev server:

```
npm run dev
```

3. Open the dev server URL (usually `http://localhost:5173`) in your browser.

**Build & Preview (production build)**

```
npm run build
npm run preview
```

**Common Tasks**
- To test multiple users locally: open DevTools → Application → Local Storage and set `profile` to different JSON objects (change `email`). Refresh to load that profile.
- To switch between users quickly you can run in console:

```
localStorage.setItem('profile', JSON.stringify({ email: 'u1@gmail.com', firstName: 'User' }));
location.reload();
```

**Feedback flow & localStorage**
- Submitting feedback opens a modal and saves an entry to `localStorage` under `hintro_feedbacks`.
- Each entry shape (example):

```
{
	title: "My First Call",
	rating: 4,
	description: "The boxy feature...",
	date: "11th May 2026",
	time: "5:00 pm",
	iso: "2026-05-11T12:00:00.000Z",
	userId: "u1"
}
```

- `FeedBackHistory.jsx` reads `hintro_feedbacks` and filters entries by `userId` (derived from `profile.email`) before rendering. If none are found for the current user, a centered empty-state is shown with a `Give Feedback` button.

**Developer Notes & Tips**
- Persisting feedback to a backend: modify `submitFeedback()` in `Dashboard.jsx` to `POST` to your endpoint and fall back to localStorage on failure.
- The `dataFetch()` helper throws helpful text when the backend returns non-OK; the UI displays an API error banner when any fetch fails.
- Use `useOutletContext()` in children to access `apiError`, `loading`, `profile`, `statCards`, `formatDuration`, and `recentCalls` when using nested routes.

**Next Improvements (suggested)**
- Add migration code to backfill `userId` for legacy feedback entries.
- Add delete/export controls for feedback rows.
- Add unit tests for `formatDuration()` and `formatRelativeTime()`.
- Add accessibility improvements (aria labels for stars, keyboard support for modal).


---

