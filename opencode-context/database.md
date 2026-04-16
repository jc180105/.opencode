# Schema do Banco de Dados - ManagerKit

## Plataforma
- Supabase (PostgreSQL)
- RLS (Row Level Security) habilitado

## Tabelas

### kitnets
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid (PK) | Identificador único |
| numero | text | Número/nome da kitnet |
| valor_aluguel | numeric | Valor mensal do aluguel |
| status | text | "ocupada" ou "vaga" |
| dia_vencimento | integer | Dia do mês para vencimento |
| observacoes | text | Notas opcionais |

### inquilinos
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid (PK) | Identificador único |
| kitnet_id | uuid (FK) | Referência à kitnet |
| nome | text | Nome completo |
| telefone | text | Telefone de contato |
| email | text | Email (opcional) |
| data_entrada | date | Data de início do contrato |
| ativo | boolean | Se o inquilino está ativo |
| pago | boolean | Se o aluguel está em dia |

### transacoes
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid (PK) | Identificador único |
| kitnet_id | uuid (FK) | Referência à kitnet (opcional) |
| tipo | text | "receita" ou "despesa" |
| valor | numeric | Valor da transação |
| descricao | text | Descrição da transação |
| categoria | text | Categoria (aluguel, manutenção, etc.) |
| data | date | Data da transação |

### despesas_fixas
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid (PK) | Identificador único |
| nome | text | Nome da despesa |
| categoria | text | Categoria |
| dia_vencimento | integer | Dia do mês para vencimento |
| ativo | boolean | Se está ativa |

## Relacionamentos
- `inquilinos.kitnet_id` → `kitnets.id` (N:1)
- `transacoes.kitnet_id` → `kitnets.id` (N:1, opcional)

## Regras
- Sempre usar `uuid` para PKs (gerado pelo Supabase)
- Sempre invalidar queries do TanStack Query após mutations
- Status da kitnet muda automaticamente ao adicionar/remover inquilino
