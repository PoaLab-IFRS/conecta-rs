# Desenvolvimento local no Windows

Guia para subir o **Conecta RS** no Windows.

> **Docker no Windows:** o Docker Desktop exige **WSL 2**. Não há fluxo documentado de Docker em Windows “puro” (sem WSL).

**Escolha uma opção:**

| Opção | Ambiente | Docker |
| ----- | -------- | ------ |
| [Com Docker](#opção-com-docker) | Windows + Docker Desktop (WSL 2) | Sim |
| [Sem Docker — Windows nativo](#opção-sem-docker--windows-nativo) | PowerShell / CMD | Não |
| [Sem Docker — WSL](#opção-sem-docker--wsl) | Ubuntu no WSL | Não |

---

## Opção: Com Docker

Usa [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/), que instala/usa **WSL 2** por baixo.

### Setup

1. Instale o Docker Desktop e conclua o setup (inclui WSL 2 se ainda não estiver ativo)
2. Em *Settings → Resources → WSL integration*, deixe a integração ligada
3. Confirme no **PowerShell** ou no terminal Ubuntu:

```powershell
docker --version
docker compose version
```

### Stack completa (MySQL + backend + frontend)

Na pasta do projeto (PowerShell):

```powershell
cd caminho\para\conecta-rs
copy .env.example .env
docker compose up --build
```

| Serviço  | URL |
| -------- | --- |
| Frontend | http://localhost:8080 |
| Backend  | http://localhost:3001 |
| MySQL    | `localhost:3306` |

Parar:

```powershell
docker compose down
```

### Só o MySQL no Docker (app no Node)

Útil para desenvolver com hot reload: banco no container, frontend/backend no Node.

1. Suba o MySQL:

```powershell
docker compose up -d mysql
```

Credenciais padrão: banco `conecta_rs`, usuário/senha `poalab`, porta `3306`.

2. Instale Node **24** e Yarn no Windows ([nvm-windows](https://github.com/coreybutler/nvm-windows)):

```powershell
nvm install 24
nvm use 24
npm install -g yarn
```

3. Backend (PowerShell):

```powershell
cd backend
copy .env.example .env
yarn install
yarn prisma:generate
yarn prisma:migrate
yarn dev
```

API: http://localhost:3000

4. Frontend (outro terminal):

```powershell
cd frontend
nvm use 24
yarn install
yarn dev
```

App: http://localhost:5173

---

## Opção: Sem Docker — Windows nativo

MySQL e Node instalados direto no Windows. Comandos em **PowerShell**.

### MySQL 8

1. Instale o [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) (MySQL Installer) ou via winget:

```powershell
winget install Oracle.MySQL
```

2. Durante/após a instalação, garanta que o serviço MySQL está rodando e que você consegue conectar como root.

3. Crie o banco e o usuário (iguais ao `backend/.env.example`):

```powershell
mysql -u root -p
```

```sql
CREATE DATABASE conecta_rs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'poalab'@'localhost' IDENTIFIED BY 'poalab';
GRANT ALL PRIVILEGES ON conecta_rs.* TO 'poalab'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Teste:

```powershell
mysql -u poalab -ppoalab -e "SHOW DATABASES;"
```

### Node.js 24 e Yarn

Use [nvm-windows](https://github.com/coreybutler/nvm-windows) (não o `nvm-sh` do Linux):

```powershell
nvm install 24
nvm use 24
npm install -g yarn
node -v
yarn -v
```

### Backend

```powershell
cd backend
copy .env.example .env
yarn install
yarn prisma:generate
yarn prisma:migrate
yarn dev
```

O `DATABASE_URL` padrão é `mysql://poalab:poalab@localhost:3306/conecta_rs`. Ajuste se mudou usuário, senha, banco ou porta.

API: http://localhost:3000

### Frontend (outro terminal)

```powershell
cd frontend
nvm use 24
yarn install
yarn dev
```

App: http://localhost:5173

---

## Opção: Sem Docker — WSL

Dentro do WSL o ambiente é Linux: use o [README principal](../../README.md) (seção *Rodar com NVM*) e os READMEs de [backend](../../backend/README.md) e [frontend](../../frontend/README.md).

### Habilitar o WSL (se ainda não tiver)

No **PowerShell como Administrador**:

```powershell
wsl --install
wsl --set-default-version 2
wsl --install -d Ubuntu
```

Reinicie se pedido, abra o **Ubuntu**, crie usuário/senha e atualize:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
```

Clone o projeto no filesystem Linux (evite `/mnt/c/...`):

```bash
cd ~
git clone <url-do-repositorio>
cd conecta-rs
```

A partir daí: MySQL local (`apt` ou como preferir) + `nvm` + `yarn`, seguindo o README — mesmos comandos de um Linux.

> Dica: abra o projeto no Cursor/VS Code com a extensão **WSL** a partir do terminal Ubuntu (`cursor .` / `code .`).

---

## Checklist

**Com Docker**

- [ ] Docker Desktop rodando (WSL 2 ok)
- [ ] `docker compose up --build` **ou** `docker compose up -d mysql` + Node local

**Sem Docker — Windows nativo**

- [ ] MySQL 8 instalado e serviço ativo
- [ ] Banco `conecta_rs` + usuário `poalab`
- [ ] Node **24** via nvm-windows
- [ ] `backend/.env` criado; migrations ok
- [ ] Backend e frontend em terminais separados

**Sem Docker — WSL**

- [ ] Ubuntu WSL 2 ativo; projeto em `~/...`
- [ ] Seguir o README (MySQL + nvm + yarn)

---

## Problemas comuns

**Docker não inicia**  
Abra o Docker Desktop e espere ficar Running. Confirme WSL 2: `wsl --status` no PowerShell.

**`nvm` não encontrado (Windows nativo)**  
Reabra o PowerShell após instalar o nvm-windows.

**Porta 3306 / 3000 / 8080 em uso**  
No Compose, altere `MYSQL_PORT`, `BACKEND_PORT` ou `FRONTEND_PORT` no `.env` da raiz. No modo local, pare o outro serviço ou ajuste `PORT` / `DATABASE_URL` no `backend/.env`.

**Prisma não conecta no MySQL**  
Confirme usuário/senha/banco iguais ao `.env`. Com Docker: `docker compose ps` até o MySQL ficar healthy.

**Projeto lento no WSL**  
Não clone em `/mnt/c/...`; use o home do Linux (`~/projetos/...`).

**Portas: Docker vs local**  
- Stack Docker: frontend `8080`, backend `3001`  
- Dev local (Yarn): frontend `5173`, backend `3000`

---

## Referências

- [README principal](../../README.md)
- [Backend](../../backend/README.md)
- [Frontend](../../frontend/README.md)
- [Instalar WSL (Microsoft)](https://learn.microsoft.com/windows/wsl/install)
