@startuml
left to right direction
skinparam packageStyle rectangle

actor "Administrador" as admin
actor "Professor" as prof

package "Sistema de Gestão de Itens" {
  
  usecase "Cadastrar Escola" as UC1
  usecase "Cadastrar Usuário" as UC2
  usecase "Cadastrar Tipo de Item" as UC3
  usecase "Gerenciar Fornecedores" as UC4
  
  usecase "Registrar Compra" as UC_Compra
  usecase "Atualizar Estoque" as UC_Atualizar
  usecase "Registrar Log de\nMovimentação" as UC_Log
  
  usecase "Consultar Estoque" as UC5
  usecase "Registrar Entrada de Item" as UC6
  usecase "Registrar Saída de Item" as UC7
  usecase "Consultar Movimentações" as UC8
}

' Associações do Administrador
admin --> UC1
admin --> UC2
admin --> UC3
admin --> UC4

' Associações do Professor
prof --> UC5
prof --> UC6
prof --> UC7
prof --> UC8

' Relações de Inclusão (Regras de Negócio do Sistema)
UC_Compra ..> UC_Atualizar : <<include>>
UC6 ..> UC_Atualizar : <<include>>
UC7 ..> UC_Atualizar : <<include>>

UC_Atualizar ..> UC_Log : <<include>>

@enduml
