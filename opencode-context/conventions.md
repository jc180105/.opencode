# Convenções de Código - ManagerKit

## TypeScript
- **Strict mode** habilitado
- Interfaces com prefixo `I` NÃO são usadas (usar `type` ou interface sem prefixo)
- Tipos exportados de `src/types/`
- Sempre tipar props de componentes
- Evitar `any` — usar `unknown` quando necessário

## Naming
- **Componentes**: PascalCase (`KitnetCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useKitnets.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_KITNETS`)
- **Arquivos**: PascalCase para componentes, camelCase para o resto

## Estrutura de Arquivos
```
src/
├── components/    # Componentes reutilizáveis
│   └── ui/        # Shadcn/UI components
├── pages/         # Páginas/rotas
├── hooks/         # Custom hooks (React Query)
├── services/      # Supabase services
├── types/         # TypeScript types
├── utils/         # Funções utilitárias
├── styles/        # CSS global
└── lib/           # Configurações (supabase client, etc.)
```

## React
- Componentes funcionais apenas (sem classes)
- Usar `React.FC` é opcional (preferir tipagem direta de props)
- Desestruturar props no parâmetro da função
- Um componente por arquivo

## Git
- Mensagens de commit em português
- Formato: `tipo: descrição curta`
- Tipos: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`
- Exemplo: `feat: adicionar tela de despesas fixas`

## Output Padronizado dos Agentes
| Agent | Output |
|-------|--------|
| Maestro | "Delegando para @[Agent]: [motivo]" |
| Artist | "✅ Feito: [descrição]" |
| Engine | "✅ Feito: [descrição]" |
| Guardian | "✅ Aprovado" ou "⚠️ Issues: [lista]" |
| Librarian | "✅ Info: [resumo]" |

## Regras Gerais
1. Maestro não executa código — apenas delega
2. Agentes leem contexto antes de executar
3. Se o pedido estiver ambíguo, faça 1–3 perguntas de clarificação
4. Sempre invalidar queries após mutations
5. Nunca usar `console.log` em produção
6. Tratar todos os erros de async/await com try/catch
