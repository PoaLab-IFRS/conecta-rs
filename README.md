# Conecta RS

## Stack

- **TypeScript** em `frontend` e `backend`
- **Backend:** Fastify, Prisma
- **Frontend:** React, Vite
- **Validação:** Zod (frontend e backend)
- **Banco:** MySQL
- **Node.js** 24 (`.nvmrc` em `frontend/` e `backend/`)

## Pré-requisitos

Depende de como você for rodar:

| Caminho | O que precisa |
| ------- | ------------- |
| **Docker** | [Docker](https://docs.docker.com/get-docker/) + Docker Compose. No Windows, use [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) (exige WSL 2). |
| **Local (Linux/macOS)** | [NVM](https://github.com/nvm-sh/nvm), Node.js **24**, [Yarn](https://yarnpkg.com/) 1.x e MySQL 8 (instalado ou só o serviço via Compose). |
| **Windows** | Não use só esta página — siga o guia dedicado: **[docs/ambientes/windows.md](./docs/ambientes/windows.md)** (Docker, Windows nativo ou WSL). |

Instruções por pacote: [frontend/README.md](./frontend/README.md) e [backend/README.md](./backend/README.md).

## Estrutura

```text
conecta-rs/
├── frontend/   # aplicação web
├── backend/    # API
├── docs/       # documentação de domínio e ambientes
└── docker-compose.yml
```

## Documentação

| Documento | Conteúdo |
| --------- | -------- |
| [Desenvolvimento no Windows](./docs/ambientes/windows.md) | Setup local: Docker, Windows nativo ou WSL |
| [Associações de consumo e atributo](./docs/consumo/associacoes.md) | Modelo de dados: `CONSUMO`, `ATRIBUTO`, variantes e estoque |

## Como rodar (Linux / macOS)

> **Windows:** use **[docs/ambientes/windows.md](./docs/ambientes/windows.md)**. Os comandos abaixo (`cp`, `nvm-sh`, etc.) são para Linux/macOS (ou WSL seguindo esse guia).

### Com Docker Compose

Sobe MySQL, backend e frontend juntos.

```bash
cp .env.example .env   # opcional — há valores padrão
docker compose up --build
```

| Serviço  | URL padrão            |
| -------- | --------------------- |
| Frontend | http://localhost:8080 |
| Backend  | http://localhost:3001 |
| MySQL    | `localhost:3306`      |

Parar:

```bash
docker compose down
```

### Local com NVM

MySQL precisa estar acessível (instalação local ou `docker compose up -d mysql`).

```bash
# Frontend
cd frontend
nvm install
nvm use
yarn install
yarn dev

# Backend (em outro terminal)
cd backend
nvm install
nvm use
cp .env.example .env
yarn install
yarn prisma:generate
yarn prisma:migrate
yarn dev
```

| Serviço  | URL padrão            |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

Passo a passo completo: [frontend](./frontend/README.md) e [backend](./backend/README.md).

## Variáveis de ambiente (Compose)

Definidas em `.env` na raiz (veja `.env.example`):

| Variável              | Descrição                  | Padrão       |
| --------------------- | -------------------------- | ------------ |
| `MYSQL_ROOT_PASSWORD` | Senha do root do MySQL     | `root`       |
| `MYSQL_DATABASE`      | Nome do banco              | `conecta_rs` |
| `MYSQL_USER`          | Usuário do banco           | `poalab`     |
| `MYSQL_PASSWORD`      | Senha do usuário           | `poalab`     |
| `MYSQL_PORT`          | Porta do MySQL no host     | `3306`       |
| `BACKEND_PORT`        | Porta da API no host       | `3001`       |
| `FRONTEND_PORT`       | Porta do frontend no host  | `8080`       |
