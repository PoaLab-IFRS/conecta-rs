# Changelog

# Version 1

Registro das principais alterações realizadas no projeto Conecta RS.

### Adicionado
- Adicionada a questão de inserção de Capital ao projeto

### Ajustado/Criado
Backend
- Adicionado estrutura de capital em backend/routes/capital.ts
- Adicionado estrutura de capital em backend/schemas/capital.ts
- Adicionado a estrutura de capital em services/capital
- Criado os seguintes arquivos em services/capital:
    -createCapital.ts
    -deleteCapital.ts
    -getCapitalById.ts
    -listCapital.ts
    -updateCapital.ts
Frontend:
- Adicionado a estrutura de capital em api/capital
- Criado os Seguintes arquivos em api/capital:
    -createCapital.ts
    -deleteCapital.ts
    -getCapital.ts
    -listCapitais.ts
    -updateCapital.ts
    -useCapital.ts
    -useCreateCapital.ts
    -useDeleteCapital.ts
    -useUpdateCapital.ts
- Criado o arquivo CapitalForm.tsx em /components
- Criado o arquivo capital.ts em /models
- Adicionado a estrutura de capital em /pages/capital
- Criado os Seguintes arquivos em pages/capital:
    -Edit.tsx
    -List.tsx
    -New.tsx
- Ajustado o arquivo App.tsx e adicionada as seguintes rotas:
    -/capital
    -/capital/novo
    -/capital/:id/editar

### Observações
- Versão básica de Capital criada a partir da base já criada de Consumo
- Nenhuma alteração realizada na forma de execução do Projeto
- Função do Swagger ajustada apenas para a parte de Capital adicionada a essa versão do projeto
- Para acessar a interface de Capital basta ajustar a url para /capital


===============================================================================================

# Version 2

Registro das principais alterações realizadas no projeto Conecta RS.

### Adicionado
- Adicionado os seguintes campos a parte de Capital
    -Nota Fiscal
    -Número de Série
    -Valor
    -Nome da Escola
- Adicionado validação para impedir inserção de capita com número de serie e patrimonio repetidos.

### Ajustado/Criado

Backend
-   Ajustado schema.prisma com os novos campos
-   Ajustado routes/capital.ts
-   Ajustado schemas/capital.ts
-   Ajustado services/capital/ os seguintes arquivos
    -createCapital.ts
    -getCapitalById.ts
    -listCapital.ts
    -updateCapital.ts
-   Ajustado src/app.ts

### Observações

- Foram realizados nessa versão apenas ajustes solicitados a serem feitos


===============================================================================================

# Version 3

Registro das principais alterações realizadas no projeto Conecta RS.

### Adicionado
- Adicionado autenticação e controle de sessão de usuários com Better Auth.
- Adicionado gerenciamento de usuários para administradores.
    - Criação, edição e exclusão de usuários.
    - Definição dos tipos ADMIN, PROFESSOR e USUARIO.
    - Proteção das rotas administrativas e restrição de acesso por perfil.
- Adicionado página de login e recuperação de senha.
- Adicionado envio de e-mail para redefinição de senha.
- Adicionado campo de observação aos itens de Capital.
- Adicionado criação automática do usuário administrador durante a inicialização do backend.
- Adicionado configuração de autenticação, SMTP e criação do administrador ao Docker Compose.

### Ajustado/Criado

Backend
- Ajustado o modelo User para utilizar identificadores em texto e integrar os dados de autenticação.
- Criados os modelos Session, Account e Verification no schema.prisma.
- Criados os arquivos de autenticação, rotas e plugins de autorização:
    - auth.ts
    - requireAuth.ts
    - requireRole.ts
- Ajustadas as rotas de usuários para exigir autenticação e perfil de administrador.
- Ajustados os serviços e schemas de usuários para criação, edição e exclusão de contas.
- Ajustado o modelo Capital com o campo observation/observacao.
- Ajustados os serviços de criação, listagem, consulta e edição de Capital para incluir observação.
- Ajustado o schema de Capital com validação da observação em até 191 caracteres.
- Ajustados os arquivos Docker, Docker Compose, scripts de inicialização e variáveis de ambiente para autenticação, e-mail e administrador.
- Adicionado o script create-admin.ts para criação ou atualização do administrador.

Frontend
- Ajustado o roteamento para proteger páginas por autenticação e perfil de administrador.
- Criadas as páginas de login, redefinição de senha, menu e gerenciamento de usuários.
- Criados os componentes RequireAuth, RequireAdmin e layout principal da aplicação.
- Ajustada a integração com Better Auth, incluindo login, sessão, logout e recuperação de senha.
- Ajustado o formulário e a listagem de Capital para exibir e editar a observação.
- Ajustado o cliente HTTP e a configuração do Vite para integração com o backend autenticado.

### Observações

- Nesta versão, além dos ajustes em Capital, foram implementadas autenticação, autorização por perfil, gerenciamento de usuários e recuperação de senha.
- A criação inicial do administrador pode ser habilitada pelas variáveis de ambiente CREATE_ADMIN e ADMIN_*.
- O envio de e-mails de redefinição de senha depende das configurações SMTP.



