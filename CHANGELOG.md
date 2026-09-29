# Changelog

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




