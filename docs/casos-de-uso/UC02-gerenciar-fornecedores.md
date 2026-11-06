# Especificação de Caso de Uso

* **Caso de Uso:** [UC-02] Gerenciar Fornecedores
* **Objetivo:** Permitir o cadastro, atualização e listagem de fornecedores que vendem equipamentos e insumos para os Espaços Maker.
* **Atores:** Administrador
* **Requisitos Relacionados:** [RF21, RF22, RF23]
* **Prioridade:** Média | **Criticalidade:** Média
* **Pré-Condições:** Usuário autenticado com perfil de Administrador.
* **Pós-Condições:** Fornecedor cadastrado ou atualizado no banco de dados e disponível para associação em ordens de compra e bens de capital.

### Fluxo Principal
1. O Administrador acessa o módulo de gestão de fornecedores e solicita um novo cadastro.
2. O sistema exibe o formulário de cadastro de fornecedor (Razão Social/Nome, CNPJ/CPF, Endereço, Telefone, E-mail e Website).
3. O Administrador preenche as informações e confirma o envio.
4. O sistema valida o formato dos dados e a unicidade do CNPJ/CPF.
5. O sistema persiste o fornecedor no banco de dados e exibe mensagem de confirmação.

### Fluxos Alternativos / Exceções
* **FA01 (CNPJ/CPF Inválido):** Se o documento digitado for inválido, o sistema alerta o usuário e solicita a correção.
* **FE01 (Fornecedor Já Cadastrado):** Se o CNPJ/CPF já constar na base de dados, o sistema impede o cadastro e sugere a edição do registro existente.

### Regras de Negócio Associadas
* **RN01 (Unicidade de Fornecedor):** Não é permitido cadastrar dois fornecedores com o mesmo CNPJ ou CPF.
