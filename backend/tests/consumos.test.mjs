import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";

// Keep the application bootstrap independent of a database connection.
mock.module("../dist/lib/prisma.js", { namedExports: { prisma: {} } });

const services = {};
for (const name of [
  "listConsumos",
  "getConsumoById",
  "createConsumo",
  "updateConsumo",
  "deleteConsumo",
  "updateConsumoEstoque",
]) {
  services[name] = mock.fn();
  mock.module(`../dist/services/consumo/${name}.js`, {
    namedExports: { [name]: services[name] },
  });
}

const { buildApp } = await import("../dist/app.js");
const { AppError } = await import("../dist/lib/errors.js");
let app;

before(async () => {
  app = await buildApp();
  await app.ready();
});
after(async () => {
  await app?.close();
  mock.restoreAll();
});
beforeEach(() => {
  for (const service of Object.values(services)) {
    service.mock.resetCalls();
    service.mock.mockImplementation(async () => undefined);
  }
});

test("cadastro retorna 500 sem expor a exceção inesperada", async (t) => {
  t.mock.method(console, "error", () => {});
  services.createConsumo.mock.mockImplementation(async () => {
    throw new Error("SQL sentinel: internal table and connection details");
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    payload: { nome: "Papel", quantidade: 10 },
  });

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.json(), { error: "Erro interno do servidor" });
});

const operations = [
  { service: "listConsumos", method: "GET", url: "/api/consumos/" },
  { service: "getConsumoById", method: "GET", url: "/api/consumos/1" },
  {
    service: "updateConsumo",
    method: "PUT",
    url: "/api/consumos/1",
    payload: { nome: "Papel", quantidade: 10 },
  },
  { service: "deleteConsumo", method: "DELETE", url: "/api/consumos/1" },
  {
    service: "updateConsumoEstoque",
    method: "PATCH",
    url: "/api/consumos/1/estoque",
    payload: { quantidade: 10 },
  },
];

for (const { service, ...request } of operations) {
  test(`${request.method} ${request.url} retorna 500 sem expor a exceção inesperada`, async (t) => {
    t.mock.method(console, "error", () => {});
    services[service].mock.mockImplementation(async () => {
      throw new Error("SQL sentinel: internal table and connection details");
    });

    const response = await app.inject(request);

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.json(), { error: "Erro interno do servidor" });
  });
}

test("ajuste de estoque protege rejeições que não são instâncias de Error", async (t) => {
  t.mock.method(console, "error", () => {});
  services.updateConsumoEstoque.mock.mockImplementation(async () => {
    throw "internal sentinel";
  });

  const response = await app.inject({
    method: "PATCH",
    url: "/api/consumos/1/estoque",
    payload: { quantidade: 10 },
  });

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.json(), { error: "Erro interno do servidor" });
});

test("cadastro preserva validação por campo com HTTP 400", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    payload: { nome: "Papel", quantidade: -1 },
  });

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.json(), {
    error: "Falha na validação",
    details: [{ path: "quantidade", message: "Quantidade não pode ser negativa" }],
  });
});

test("cadastro preserva JSON malformado como HTTP 400", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    headers: { "content-type": "application/json" },
    payload: "{",
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().code, "FST_ERR_CTP_INVALID_JSON_BODY");
});

test("cadastro preserva tipo de conteúdo não suportado como HTTP 415", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    headers: { "content-type": "application/xml" },
    payload: "<consumo />",
  });

  assert.equal(response.statusCode, 415);
  assert.equal(response.json().code, "FST_ERR_CTP_INVALID_MEDIA_TYPE");
});

test("cadastro trata status arbitrário em exceção de serviço como falha inesperada", async (t) => {
  t.mock.method(console, "error", () => {});
  services.createConsumo.mock.mockImplementation(async () => {
    throw Object.assign(new Error("internal sentinel"), { statusCode: 400 });
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    payload: { nome: "Papel", quantidade: 10 },
  });

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.json(), { error: "Erro interno do servidor" });
});

test("cadastro preserva erro de domínio com HTTP 400", async () => {
  services.createConsumo.mock.mockImplementation(async () => {
    throw new AppError("Atributo duplicado no consumo");
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    payload: { nome: "Papel", quantidade: 10 },
  });

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.json(), { error: "Atributo duplicado no consumo" });
});

for (const { service, ...request } of operations.filter(
  ({ service }) => service !== "listConsumos",
)) {
  test(`${request.method} ${request.url} preserva consumo inexistente com HTTP 404`, async () => {
    services[service].mock.mockImplementation(async () => {
      throw new AppError("Consumo não encontrado", 404);
    });

    const response = await app.inject(request);

    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.json(), { error: "Consumo não encontrado" });
  });
}

const consumoExistente = {
  id: 2,
  nome: "Papel existente",
  quantidadeEstoque: 20,
  atributos: [{ nome: "Cor", tipoValor: "TEXTO", valor: "Azul" }],
};
for (const [method, service, url] of [
  ["POST", "createConsumo", "/api/consumos/"],
  ["PUT", "updateConsumo", "/api/consumos/1"],
]) {
  for (const details of [
    { tipo: "exato", consumoExistente },
    { tipo: "parcial", motivo: "extras_no_novo", consumoExistente },
    { tipo: "parcial", motivo: "subconjunto_do_existente", consumoExistente },
  ]) {
    test(`${method} preserva conflito ${details.motivo ?? details.tipo} com HTTP 409`, async () => {
      services[service].mock.mockImplementation(async () => {
        throw new AppError("Conflito de atributos", 409, details);
      });

      const response = await app.inject({
        method,
        url,
        payload: { nome: "Papel", quantidade: 10 },
      });

      assert.equal(response.statusCode, 409);
      assert.deepEqual(response.json(), { error: "Conflito de atributos", ...details });
    });
  }
}

test("cadastro preserva HTTP 201 e corpo de sucesso", async () => {
  services.createConsumo.mock.mockImplementation(async () => ({
    id: 1,
    nome: "Papel",
    descricao: null,
  }));

  const response = await app.inject({
    method: "POST",
    url: "/api/consumos/",
    payload: { nome: "Papel", quantidade: 10 },
  });

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.json(), { id: 1, nome: "Papel", descricao: null });
});

test("exclusão preserva HTTP 204 sem corpo", async () => {
  const response = await app.inject({ method: "DELETE", url: "/api/consumos/1" });

  assert.equal(response.statusCode, 204);
  assert.equal(response.body, "");
});
