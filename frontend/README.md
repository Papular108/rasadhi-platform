# Rasadhi Platform Frontend

React + TypeScript + Vite frontend for the Rasadhi Platform.

## Status

Alpha — scaffold only, no functional features yet.

## Tech stack

- **React** + **TypeScript** — UI framework
- **Vite** — build tool and dev server
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — component library
- **React Router** — client-side routing
- **TanStack Query** — server state management
- **Axios** — HTTP client
- **Zustand** — client state management

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:5173

The dev server proxies `/api/*` requests to `http://localhost:8000` (backend).
Make sure the backend is running for API calls to work.

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Testing

Test infrastructure will be added when features are implemented.

## Deployment

Deployed to Vercel via the `vercel.json` configuration.

## Project structure

```
frontend/
├── src/
│   ├── main.tsx              React entry point
│   ├── App.tsx               Router and providers
│   ├── index.css             Tailwind + design tokens
│   ├── features/             One folder per feature/tab
│   │   ├── explorer/
│   │   ├── preprocessing/
│   │   └── ...
│   ├── components/
│   │   ├── layout/           Header, sidebar, footer
│   │   └── ui/               shadcn/ui components
│   ├── pages/                Route-level components
│   ├── lib/
│   │   ├── api/              API client and endpoints
│   │   └── utils.ts          Utility functions (cn helper)
│   ├── hooks/                Shared React hooks
│   └── types/                Shared TypeScript types
└── public/                   Static assets
```

## Notes

- `public/RDKit_minimal.wasm` is a build artifact copied from
  `node_modules/@rdkit/rdkit/dist/RDKit_minimal.wasm`. Vite does not pull it
  from node_modules automatically, so it is served from `public/`. **Re-copy
  it whenever `@rdkit/rdkit` is upgraded** so the binary matches the JS
  loader:

  ```bash
  cp node_modules/@rdkit/rdkit/dist/RDKit_minimal.wasm public/
  ```
