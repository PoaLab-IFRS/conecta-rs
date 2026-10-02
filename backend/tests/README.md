# Testes das rotas de consumos

Com Node.js 24 e as dependências do backend instaladas, gere o Prisma Client
e execute a suíte a partir de `backend/`:

```sh
yarn prisma:generate
yarn test
```

A geração do client exige `DATABASE_URL`, conforme a configuração do Prisma.
Os testes não conectam ao banco nem executam migrations: os serviços de consumos
e a inicialização da persistência são simulados.

O comando compila o TypeScript e usa o runner nativo do Node com module mocks
experimentais. São verificadas as respostas HTTP reais, incluindo o tratamento
de falhas compartilhado com o handler global, sem conferir chamadas internas dos serviços.
