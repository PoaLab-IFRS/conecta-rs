# Backend

## Pré-requisitos

- [NVM](https://github.com/nvm-sh/nvm)
- Node.js **24** (definido em `.nvmrc`)
- [Yarn](https://yarnpkg.com/) 1.x
- MySQL 8 (local ou via Docker)

## Rodar com NVM

1. Ative o Node e instale as dependências:

```bash
cd backend
nvm install
nvm use
yarn install
```

2. Configure o ambiente:

```bash
cp .env.example .env
```

Ajuste `DATABASE_URL` se o MySQL não estiver nos valores padrão.

3. (Opcional) Suba só o MySQL com Compose, a partir da raiz:

```bash
docker compose up -d mysql
```

4. Gere o client do Prisma e rode as migrations:

```bash
yarn prisma:generate
yarn prisma:migrate
```

5. Inicie a API:

```bash
yarn dev
```

A API sobe em http://localhost:3000 (ou na porta definida em `PORT` no `.env`).

### Scripts úteis

| Comando                 | Descrição                         |
| ----------------------- | --------------------------------- |
| `yarn dev`              | API em modo watch                 |
| `yarn build`            | Compila TypeScript                |
| `yarn start`            | Roda o build (`dist/`)            |
| `yarn prisma:generate`  | Gera o Prisma Client              |
| `yarn prisma:migrate`   | Migrations em desenvolvimento     |
| `yarn prisma:deploy`    | Aplica migrations (produção)      |
| `yarn prisma:studio`    | Interface visual do Prisma        |
| `yarn lint`             | Lint                              |
| `yarn format`           | Formatação                        |
| `yarn validate`         | Lint + checagem de formato        |

## Bibliotecas principais

| Biblioteca | Uso |
| ---------- | --- |
| [Fastify](https://fastify.dev/) | Framework HTTP da API |
| [Zod](https://zod.dev/) | Validação de schemas e dados de entrada |
| [Prisma](https://www.prisma.io/) | ORM e migrations (`@prisma/client` + CLI) |
| [dotenv](https://github.com/motdotla/dotenv) | Carregamento de variáveis de ambiente |

## Lint e formatação

As ferramentas estão instaladas na **raiz** do repositório. Na primeira vez:

```bash
cd ..   # raiz do projeto
yarn install
```

A partir de `backend/`:

```bash
yarn lint          # analisa o código
yarn lint:fix      # corrige o que for possível
yarn format        # formata o código
yarn format:check  # só verifica a formatação
yarn validate      # lint + checagem de formato
```

Equivalente na raiz:

```bash
yarn lint:backend
yarn lint:backend:fix
yarn format:backend
yarn format:backend:check
```

### Variáveis de ambiente

Veja `.env.example`:

| Variável       | Descrição              | Padrão                                      |
| -------------- | ---------------------- | ------------------------------------------- |
| `DATABASE_URL` | Conexão MySQL          | `mysql://poalab:poalab@localhost:3306/conecta_rs` |
| `PORT`         | Porta da API           | `3000`                                      |
| `HOST`         | Host de bind           | `0.0.0.0`                                   |
| `NODE_ENV`     | Ambiente               | `development`                               |

## Rodar com Docker Compose

Na raiz do repositório:

```bash
cp .env.example .env   # opcional
docker compose up --build backend
```

Isso sobe o MySQL (dependência) e o backend. As migrations rodam automaticamente na inicialização do container.

Acesso padrão da API no host: http://localhost:3001 (`BACKEND_PORT` no `.env` da raiz).

Para a stack completa (MySQL + backend + frontend):

```bash
docker compose up --build
```
