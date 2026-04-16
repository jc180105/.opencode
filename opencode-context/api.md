# API e Hooks - ManagerKit

## Supabase Client
```tsx
import { supabase } from "@/lib/supabase"
```

## React Query Hooks

### Kitnets
| Hook | Tipo | Descrição |
|------|------|-----------|
| `useKitnets()` | Query | Lista todas as kitnets |
| `useCreateKitnet()` | Mutation | Cria nova kitnet |
| `useUpdateKitnet()` | Mutation | Atualiza kitnet existente |
| `useDeleteKitnet()` | Mutation | Remove kitnet |

### Inquilinos
| Hook | Tipo | Descrição |
|------|------|-----------|
| `useInquilinos()` | Query | Lista todos os inquilinos |
| `useCreateInquilino()` | Mutation | Cria novo inquilino |
| `useUpdateInquilino()` | Mutation | Atualiza inquilino |

### Transações
| Hook | Tipo | Descrição |
|------|------|-----------|
| `useTransacoes()` | Query | Lista todas as transações |
| `useCreateTransacao()` | Mutation | Cria nova transação |
| `useDeleteTransacao()` | Mutation | Remove transação |

### Despesas Fixas
| Hook | Tipo | Descrição |
|------|------|-----------|
| `useDespesasFixas()` | Query | Lista despesas fixas |
| `useCreateDespesaFixa()` | Mutation | Cria despesa fixa |
| `useDeleteDespesaFixa()` | Mutation | Remove despesa fixa |

## Padrões obrigatórios
1. Sempre usar `queryClient.invalidateQueries()` após mutations
2. Tratar loading states com `isLoading` / `isPending`
3. Tratar erros com `isError` e exibir feedback ao usuário
4. Usar `onSuccess` e `onError` callbacks nas mutations
