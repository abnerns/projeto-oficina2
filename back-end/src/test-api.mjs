import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const BASE = "http://localhost:3333";

async function waitForServer(url, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("Server did not start in time");
}

describe("API Tests", () => {
  let proc;

  before(async () => {
    proc = spawn("node", ["back-end/src/server.js"], {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    proc.stdout.on("data", () => {});
    proc.stderr.on("data", () => {});
    await waitForServer(BASE);
  });

  after(() => {
    if (proc) proc.kill();
  });

  it("GET / should return Hello World", async () => {
    const res = await fetch(BASE);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /Hello World/);
  });

  it("GET /get-oficinas should return workshops", async () => {
    const res = await fetch(`${BASE}/get-oficinas`);
    assert.ok(res.ok);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  it("GET /get-alunos should return students", async () => {
    const res = await fetch(`${BASE}/get-alunos`);
    assert.ok(res.ok);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  it("POST /create-aluno / DELETE /delete-aluno CRUD", async () => {
    const res = await fetch(`${BASE}/create-aluno`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Teste Aluno", idade: 10, escola: "Escola Teste" }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.aluno.nome, "Teste Aluno");

    const del = await fetch(`${BASE}/delete-aluno/${data.aluno.uuid}`, { method: "DELETE" });
    assert.ok(del.ok);
  });

  it("POST /create-oficina / DELETE /delete-oficina CRUD", async () => {
    const res = await fetch(`${BASE}/create-oficina`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tema: "Oficina Teste Automática",
        descricao: "Descrição da oficina de teste automática com mais de 10 caracteres",
        data: new Date().toISOString(),
        responsavel: "c66615bd-f951-4e8b-938f-422f236ca76f",
      }),
    });
    assert.equal(res.status, 200, "create-oficina should return 200");
    const data = await res.json();

    const del = await fetch(`${BASE}/delete-oficina/${data.id}`, { method: "DELETE" });
    assert.ok(del.ok);
  });

  it("POST /registrar should validate required fields", async () => {
    const res = await fetch(`${BASE}/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Test" }),
    });
    assert.equal(res.status, 400);
  });

  it("GET /dashboard/stats should return stats", async () => {
    const res = await fetch(`${BASE}/dashboard/stats`);
    assert.ok(res.ok);
    const data = await res.json();
    assert.ok(typeof data.totalWorkshops === "number");
    assert.ok(typeof data.totalStudents === "number");
    assert.ok(typeof data.totalTeachers === "number");
    assert.ok(Array.isArray(data.workshops));
  });
});
