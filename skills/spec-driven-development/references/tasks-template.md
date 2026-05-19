# [Nome do Projeto] — Tarefas

## Fase 1: Setup (Tasks 1-N)

### Task 1: [Título]
- **Arquivos**: `caminho/para/arquivo`
- **Descrição**: o que construir
- **Critério de aceite**: como verificar que está pronto
- **Depende de**: —
- **Paralelizável**: sim/não
- **Link**: US-XX, AC-XX

### Task 2: [Título]
- **Arquivos**: `caminho/para/arquivo`
- **Descrição**: o que construir
- **Critério de aceite**: como verificar
- **Depende de**: Task 1
- **Paralelizável**: não
- **Link**: US-XX, AC-XX

## Fase 2: Core Features (Tasks N-M)

### Task 3: [Título]
- **Arquivos**: `caminho/para/arquivo`
- **Descrição**: o que construir
- **Critério de aceite**: como verificar
- **Depende de**: Task 2
- **Paralelizável**: sim (com Task 4)
- **Link**: US-XX, AC-XX

### Task 4: [Título]
- **Arquivos**: `caminho/para/arquivo`
- **Descrição**: o que construir
- **Critério de aceite**: como verificar
- **Depende de**: Task 2
- **Paralelizável**: sim (com Task 3)
- **Link**: US-XX, AC-XX

## Fase 3: Polimento & QA

### Task N+1: [Título]
...
