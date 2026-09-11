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

## Bibliotecas

| Biblioteca | Uso |
| ---------- | --- |
| [React](https://react.dev/) | UI e componentes |
| [Vite](https://vite.dev/) | Bundler e servidor de desenvolvimento |

## Lint e formatação

As ferramentas estão instaladas na **raiz** do repositório. Na primeira vez:

```bash
cd ..   # raiz do projeto
yarn install
```

A partir de `frontend/`:

```bash
yarn lint          # analisa o código
yarn lint:fix      # corrige o que for possível
yarn format        # formata o código
yarn format:check  # só verifica a formatação
yarn validate      # lint + checagem de formato
```

Equivalente na raiz:

```bash
yarn lint:frontend
yarn lint:frontend:fix
yarn format:frontend
yarn format:frontend:check
```

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
