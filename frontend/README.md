# Frontend

## Pré-requisitos

- [NVM](https://github.com/nvm-sh/nvm)
- Node.js **24** (definido em `.nvmrc`)
- [Yarn](https://yarnpkg.com/) 1.x

## Rodar com NVM

```bash
cd frontend
nvm install
nvm use
yarn install
yarn dev
```

A aplicação sobe em http://localhost:5173 (porta padrão do Vite).

### Scripts úteis

| Comando            | Descrição                |
| ------------------ | ------------------------ |
| `yarn dev`         | Servidor de desenvolvimento |
| `yarn build`       | Build de produção        |
| `yarn preview`     | Preview do build         |
| `yarn lint`        | Lint                     |
| `yarn format`      | Formatação               |
| `yarn validate`    | Lint + checagem de formato |

## Rodar com Docker Compose

O frontend é servido via nginx na stack completa. Na raiz do repositório:

```bash
cp .env.example .env   # opcional
docker compose up --build frontend
```

Ou suba tudo (MySQL + backend + frontend):

```bash
docker compose up --build
```

Acesso padrão: http://localhost:8080 (`FRONTEND_PORT` no `.env` da raiz).

Para build isolado da imagem:

```bash
docker build -t conecta-rs-frontend .
```
