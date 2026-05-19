# [Nome do Projeto] — Plano Técnico

## 1. Tech Stack
- **Frontend**: [framework + versão]
- **Backend**: [framework + versão]
- **Database**: [banco + versão]
- **Infra**: [deploy, hosting, CDN]
- **Auth**: [provedor/método]

## 2. Architecture Overview
_Diagrama textual ou descrição de componentes e fluxos._

## 3. Data Models
### [Entidade 1]
- `id`: uuid, PK
- `name`: string, required
- `created_at`: timestamp, auto

### [Entidade 2]
- `id`: uuid, PK
- `entity1_id`: uuid, FK → entities_1

## 4. API Contracts
### `POST /api/resource`
- Request: `{ name: string }`
- Response 201: `{ id: uuid, name: string }`
- Response 400: `{ error: string }`
- Response 401: unauthorized

## 5. Architecture Decision Records (ADRs)

### ADR-001: [Título da Decisão]
- **Contexto**: por que essa decisão foi necessária
- **Decisão**: o que foi escolhido
- **Alternativas consideradas**: [opção A], [opção B]
- **Consequências**: trade-offs, impacto

### ADR-002: [Título da Decisão]
- **Contexto**:
- **Decisão**:
- **Alternativas**:
- **Consequências**:

## 6. Dependencies
- [Biblioteca/Service X] — versão Y — finalidade
- [Biblioteca/Service Z] — versão W — finalidade
