# Stack Tecnológica - ManagerKit

## Frontend
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Estilo**: Tailwind CSS
- **Componentes UI**: Shadcn/UI (variantes iOS)
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Roteamento**: React Router DOM v6

## Backend / BaaS
- **Plataforma**: Supabase
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage

## State Management
- **Server State**: TanStack Query (React Query v5)
- **Client State**: React useState/useReducer

## Design System
- **Tema**: iOS Night (dark mode padrão)
- **Paleta de Cores**:
  - ios-blue: `#0A84FF`
  - ios-green: `#30D158`
  - ios-red: `#FF453A`
  - ios-orange: `#FF9F0A`
  - ios-purple: `#BF5AF2`
  - ios-gray: `#8E8E93`
- **Tipografia**: SF Pro Display (fallback: Inter, system-ui)
- **Border Radius**: 12px (cards), 8px (inputs), 20px (modais)
- **Glassmorphism**: background blur + opacity para overlays

## Deploy
- **Hosting**: Railway
- **Servidor**: Caddy (SPA routing)
- **Build**: `npm run build` → `dist/`
