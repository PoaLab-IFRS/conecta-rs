# Especificação de Caso de Uso

* **Caso de Uso:** [UC-03] Cadastrar Espaço Maker / Unidade
* **Objetivo:** Cadastrar uma nova unidade ou Espaço Maker (ex: PoALAB) vinculado ao IFRS para alocação de bens de capital e usuários.
* **Atores:** Administrador
* **Requisitos Relacionados:** [RF03, RF05, RF06]
* **Prioridade:** Alta | **Criticalidade:** Alta
* **Pré-Condições:** Usuário autenticado com perfil de Administrador.
* **Pós-Condições:** Unidade/Espaço Maker cadastrado no banco de dados e apto a receber vinculação de bens de capital e professores.

### Fluxo Principal
1. O Administrador solicita o cadastro de uma nova unidade/Espaço Maker.
2. O sistema exibe o formulário de cadastro (Nome da Unidade, Sigla, Cidade, Endereço Completo e Responsável).
3. O Administrador preenche as informações obrigatórias e confirma.
4. O sistema valida os campos e persiste a unidade no banco de dados.
5. O sistema exibe mensagem de sucesso e redireciona para a listagem de unidades.

### Fluxos Alternativos / Exceções
* **FA01 (Campos Obrigatórios Incompletos):** Se o Nome ou Cidade não forem informados, o sistema destaca os campos faltantes e impede o envio.
* **FE01 (Unidade Duplicada):** Se já existir uma unidade com o mesmo nome e cidade, o sistema bloqueia a criação.

### Regras de Negócio Associadas
* **RN01 (Vincular Localização):** Toda unidade/Espaço Maker deve obrigatoriamente estar associada a um município/UF válido.
