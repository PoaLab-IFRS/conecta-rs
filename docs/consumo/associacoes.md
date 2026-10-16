# Associações de Consumo e Atributo

Como o domínio de **consumo** se relaciona com **atributo**, variantes e estoque no banco (Prisma / MySQL).

Schema canônico: [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma).

## Visão geral

```text
CONSUMO ──< CONSUMO_ATRIBUTO >── ATRIBUTO
   │                                  │
   └──< VARIANTE_CONSUMO ──< VARIANTE_ATRIBUTO >──┘
              │
              └── ESTOQUE (1:1)
```

Há **duas camadas** de associação entre consumo e atributo:

| Camada | Tabela | Função |
| ------ | ------ | ------ |
| Esquema | `CONSUMO_ATRIBUTO` | Quais atributos pertencem ao consumo (**sem** valores) |
| Valores | `VARIANTE_ATRIBUTO` | Valores tipados desses atributos em uma variante |

O estoque fica na **variante**, não diretamente no consumo.

## Tabelas

### `ATRIBUTO`

Definição reutilizável de um atributo.

| Campo | Papel |
| ----- | ----- |
| `nome` | Nome do atributo (ex.: diâmetro, material) |
| `tipo_valor` | Tipo: `TEXTO`, `INTEIRO`, `DECIMAL` ou `BOOLEANO` |

Um mesmo atributo pode ser usado por vários consumos e várias variantes.

### `CONSUMO`

O material/consumo em si (`nome`, `descricao`).

Relações:

- `atributos` → `CONSUMO_ATRIBUTO[]`
- `variantes` → `VARIANTE_CONSUMO[]`

### `CONSUMO_ATRIBUTO`

Associação N:N **esquema**: “este consumo usa estes atributos”.

- Unique em `(consumo_id, atributo_id)`
- Não guarda valor — só os ids

### `VARIANTE_CONSUMO`

Uma variante concreta de um consumo.

Hoje o fluxo de criação sempre cria **uma** variante por consumo, mas o modelo já permite várias.

Cada variante tem:

- `atributos` → `VARIANTE_ATRIBUTO[]`
- `estoque` → `ESTOQUE?` (0 ou 1)

### `VARIANTE_ATRIBUTO`

Associação N:N **com valores**: o valor concreto de um atributo naquela variante.

Só uma coluna de valor é preenchida, conforme o `tipo_valor` do atributo:

| `tipo_valor` | Coluna usada |
| ------------ | ------------ |
| `TEXTO` | `valor_texto` |
| `INTEIRO` | `valor_inteiro` |
| `DECIMAL` | `valor_decimal` |
| `BOOLEANO` | `valor_booleano` |

Unique em `(variante_consumo_id, atributo_id)`.

Leitura/escrita tipada: [`backend/src/lib/atributoValor.ts`](../../backend/src/lib/atributoValor.ts).

### `ESTOQUE`

Quantidade ligada a **uma** variante (`variante_consumo_id` único → 1:1).

## Exemplo mental

Consumo **Parafuso** com atributos `diâmetro = 5` e `material = inox`:

1. `ATRIBUTO` — registros de “diâmetro” (INTEIRO) e “material” (TEXTO)
2. `CONSUMO` — “Parafuso”
3. `CONSUMO_ATRIBUTO` — liga o consumo a diâmetro e material
4. `VARIANTE_CONSUMO` — a variante desse parafuso
5. `VARIANTE_ATRIBUTO` — `5` e `"inox"` nas colunas tipadas
6. `ESTOQUE` — quantidade dessa variante

## Como a aplicação usa

### Criação

Em [`createConsumo.ts`](../../backend/src/services/consumo/createConsumo.ts), na mesma transação:

1. Resolve/cria os `ATRIBUTO` (`resolveAtributos`)
2. Cria o `CONSUMO`
3. Insere `CONSUMO_ATRIBUTO` (só ids)
4. Cria uma `VARIANTE_CONSUMO`
5. Insere `VARIANTE_ATRIBUTO` com os valores tipados
6. Cria o `ESTOQUE` da variante

As duas camadas (esquema + valores) são gravadas juntas.

### Leitura e conflitos

Listagem/detalhe e detecção de conflito usam os **valores da variante** (`variantes → atributos → atributo`), não `CONSUMO_ATRIBUTO`.

- Mapeamento da API: [`mapConsumoDetail.ts`](../../backend/src/services/consumo/mapConsumoDetail.ts)
- Conflitos (assinatura exata/parcial): [`atributosHelper.ts`](../../backend/src/services/consumo/atributosHelper.ts)

`CONSUMO_ATRIBUTO` é mantida no create/update/delete como esquema, mas a API de detalhe lê a variante.

### Exclusão

Todas as FKs usam `ON DELETE RESTRICT`. O delete remove na ordem:

`VARIANTE_ATRIBUTO` → `ESTOQUE` → `VARIANTE_CONSUMO` → `CONSUMO_ATRIBUTO` → `CONSUMO`

Ver [`deleteConsumo.ts`](../../backend/src/services/consumo/deleteConsumo.ts).

## O que não faz parte deste domínio

`User` e `Capital` são modelos separados. Não há tabelas de produto/categoria/tipo além do enum `TipoValor`.

## Código relacionado

| Área | Caminho |
| ---- | ------- |
| Schema Prisma | `backend/prisma/schema.prisma` |
| Migration | `backend/prisma/migrations/20260925021924_consumo/` |
| Serviços de consumo | `backend/src/services/consumo/` |
| Serviços de atributo | `backend/src/services/atributo/` |
| Valores tipados | `backend/src/lib/atributoValor.ts` |
| Models Zod (frontend) | `frontend/src/models/consumo.ts`, `frontend/src/models/atributo.ts` |
