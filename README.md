# Conecta RS

## Stack

- **TypeScript** em `frontend` e `backend`
- **Backend:** Fastify, TypeORM
- **Frontend:** React, Vite
- **Validação:** Zod (frontend e backend)
- **Banco:** MySQL
- **Node.js** 24 (`.nvmrc` em `frontend/` e `backend/`)

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- Ou, para rodar localmente: [NVM](https://github.com/nvm-sh/nvm), Node.js **24** e [Yarn](https://yarnpkg.com/) 1.x

## Estrutura

```text
conecta-rs/
├── frontend/   # aplicação web
├── backend/    # API
└── docker-compose.yml
```

Instruções detalhadas de cada parte: [frontend/README.md](./frontend/README.md) e [backend/README.md](./backend/README.md).

## Rodar com Docker Compose

Sobe MySQL, backend e frontend juntos.

1. Na raiz do repositório, copie o arquivo de ambiente (opcional — há valores padrão):

```bash
cp .env.example .env
```

2. Suba os serviços:

```bash
docker compose up --build
```

3. Acesse:

| Serviço  | URL padrão              |
| -------- | ----------------------- |
| Frontend | http://localhost:8080   |
| Backend  | http://localhost:3001   |
| MySQL    | `localhost:3306`        |

Para parar:

```bash
docker compose down
```

## Rodar com NVM (local)

Cada pacote pode ser executado de forma independente. Em resumo:

```bash
# Frontend
cd frontend
nvm install
nvm use
yarn install
yarn dev

# Backend (em outro terminal; MySQL precisa estar acessível)
cd backend
nvm install
nvm use
cp .env.example .env
yarn install
yarn prisma:generate
yarn prisma:migrate
yarn dev
```

Veja os READMEs de [frontend](./frontend/README.md) e [backend](./backend/README.md) para o passo a passo completo.

## Variáveis de ambiente (Compose)

Definidas em `.env` na raiz (veja `.env.example`):

| Variável              | Descrição                          | Padrão       |
| --------------------- | ---------------------------------- | ------------ |
| `MYSQL_ROOT_PASSWORD` | Senha do root do MySQL             | `root`       |
| `MYSQL_DATABASE`      | Nome do banco                      | `conecta_rs` |
| `MYSQL_USER`          | Usuário do banco                   | `poalab`     |
| `MYSQL_PASSWORD`      | Senha do usuário                   | `poalab`     |
| `MYSQL_PORT`          | Porta do MySQL no host             | `3306`       |
| `BACKEND_PORT`        | Porta da API no host               | `3001`       |
| `FRONTEND_PORT`       | Porta do frontend no host          | `8080`       |
