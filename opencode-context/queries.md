# Queries SQL Otimizadas - ManagerKit

## Padrões

### Listar kitnets com inquilino ativo
```sql
SELECT k.*, i.nome as inquilino_nome, i.pago
FROM kitnets k
LEFT JOIN inquilinos i ON i.kitnet_id = k.id AND i.ativo = true
ORDER BY k.numero;
```

### Dashboard - Resumo financeiro
```sql
SELECT
  SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
  SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas,
  SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) as saldo
FROM transacoes
WHERE data >= date_trunc('month', CURRENT_DATE);
```

### Kitnets com pagamento pendente
```sql
SELECT k.numero, i.nome, k.valor_aluguel, k.dia_vencimento
FROM kitnets k
JOIN inquilinos i ON i.kitnet_id = k.id AND i.ativo = true
WHERE i.pago = false
ORDER BY k.dia_vencimento;
```

### Transações do mês por categoria
```sql
SELECT categoria, SUM(valor) as total
FROM transacoes
WHERE data >= date_trunc('month', CURRENT_DATE)
GROUP BY categoria
ORDER BY total DESC;
```

## Regras para Queries
1. Sempre usar `LEFT JOIN` quando a relação pode não existir
2. Filtrar por `ativo = true` para inquilinos
3. Usar `date_trunc` para filtros por período
4. Ordenar por campos relevantes (numero, data, etc.)
