# Componentes Disponíveis - ManagerKit

## Shadcn/UI (Customizados com tema iOS)

### Button
```tsx
<Button variant="ios">Primary</Button>
<Button variant="ios-secondary">Secondary</Button>
<Button variant="ios-ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Default Ghost</Button>
<Button variant="outline">Outline</Button>
```

### Card
```tsx
<Card variant="ios">Padrão iOS</Card>
<Card variant="ios-interactive">Com hover effect</Card>
<Card variant="glass">Glassmorphism</Card>
<Card>Default</Card>
```

### Formulários
- `Input` — campo de texto padrão
- `Label` — label para inputs
- `Select` — dropdown de seleção
- `Textarea` — campo de texto multilinha

### Feedback
- `Dialog` — modal de confirmação
- `Modal` — overlay genérico
- `Spinner` — loading indicator
- `Toast` — notificações temporárias

### Layout
- `Tabs` — navegação por abas
- `Separator` — divisor visual

## Ícones (Lucide React)
Importar de `lucide-react`:
```tsx
import { Home, Plus, Trash2, Edit, Search, Settings } from "lucide-react"
```

## Regras de Uso
1. Sempre usar `variant="ios"` para cards principais
2. Sempre usar `variant="ios"` para buttons de ação principal
3. Usar `variant="glass"` para overlays e modais
4. Usar cores da paleta iOS (ver stack.md)
5. Manter `border-radius: 12px` em cards
