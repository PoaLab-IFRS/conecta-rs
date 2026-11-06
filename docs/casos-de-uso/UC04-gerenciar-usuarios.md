# Especificação de Caso de Uso

* **Caso de Uso:** [UC-04] Cadastrar e Gerenciar Usuários
* **Objetivo:** Cadastrar novos usuários (Administradores e Professores), atribuir seus perfis de acesso e vinculá-los às suas respectivas unidades/Espaços Maker.
* **Atores:** Administrador
* **Requisitos Relacionados:** [RF07, RF08, RF09]
* **Prioridade:** Alta | **Criticalidade:** Alta
* **Pré-Condições:** Usuário logado como Administrador.
* **Pós-Condições:** Usuário salvo no banco de dados com credenciais geradas e perfil definido (Admin ou Professor).

### Fluxo Principal
1. O Administrador seleciona a opção de cadastrar novo usuário.
2. O sistema apresenta o formulário com Nome, E-mail Institucional, Perfil de Acesso (Administrador ou Professor) e Unidade/Espaço Maker.
3. O Administrador preenche os dados e confirma o cadastro.
4. O sistema valida se o e-mail é único e possui formato válido.
5. O sistema registra o usuário, envia a solicitação de definição de senha e confirma a operação.

### Fluxos Alternativos / Exceções
* **FA01 (E-mail Inválido/Não Institucional):** Se o e-mail preenchido não for válido, o sistema solicita a alteração.
* **FE01 (E-mail Já Cadastrado):** Se o e-mail já estiver vinculado a outra conta, o sistema bloqueia o cadastro e notifica o Administrador.

### Regras de Negócio Associadas
* **RN01 (Perfil de Acesso Rigoroso):** O perfil atribuído define estritamente as permissões no sistema (Administrador opera o Módulo Mestre; Professor opera o Módulo Operacional).
