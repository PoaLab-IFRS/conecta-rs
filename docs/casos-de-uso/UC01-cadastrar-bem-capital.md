# Especificação de Caso de Uso

* **Caso de Uso:** [UC-01] Cadastrar Bem de Capital (Ativo Patrimonial)
* **Objetivo:** Registrar um novo equipamento/bem de capital no acervo patrimonial de um Espaço Maker.
* **Atores:** Administrador
* **Requisitos Relacionados:** [RF14, RF15, RF16]
* **Prioridade:** Alta | **Criticalidade:** Alta
* **Pré-Condições:** Usuário autenticado com perfil de Administrador e Espaço Maker previamente cadastrado.
* **Pós-Condições:** Bem de capital registrado no banco de dados com número de tombamento gerado e associado ao Espaço Maker.

### Fluxo Principal
1. O Administrador solicita o cadastro de um novo bem de capital.
2. O sistema exibe o formulário de cadastro (Nome, Marca, Modelo, Número de Série, Valor, Fornecedor e Espaço Maker).
3. O Administrador preenche os dados obrigatórios e confirma.
4. O sistema valida os dados, verifica a unicidade do número de série e gera o registro de tombamento.
5. O sistema persiste as informações no banco de dados e exibe mensagem de sucesso.

### Fluxos Alternativos / Exceções
* **FA01 (Dados Incompletos):** Se algum campo obrigatório não for preenchido, o sistema alerta o usuário e permanece na página.
* **FE01 (Tombamento/Número de Série Duplicado):** Se o número de série ou tombamento já existir no sistema, o cadastro é bloqueado e uma mensagem de erro é exibida.

### Regras de Negócio Associadas
* **RN01 (Validação de Unicidade):** Todo bem de capital deve possuir identificação única de tombamento e número de série antes da persistência.
