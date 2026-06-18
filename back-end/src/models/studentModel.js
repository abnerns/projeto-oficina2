import sql from "../database.js";

const StudentModel = {
  async findAll() {
    return await sql`SELECT * FROM alunos ORDER BY nome`;
  },

  async findById(id) {
    const result = await sql`SELECT * FROM alunos WHERE uuid = ${id}`;
    return result[0] || null;
  },

  async create(nome, idade, escola) {
    const result = await sql`
      INSERT INTO alunos (nome, idade, escola)
      VALUES (${nome}, ${idade}, ${escola})
      RETURNING *
    `;
    return result[0];
  },

  async createBatch(escola, nomes, idade = null) {
    if (!nomes || nomes.length === 0) return [];
    const rows = nomes.map((nome) => [nome, idade, escola]);
    const result = await sql`
      INSERT INTO alunos (nome, idade, escola)
      VALUES ${sql(rows)}
      RETURNING *
    `;
    return result;
  },

  async update(id, nome, idade, escola) {
    const result = await sql`
      UPDATE alunos
      SET nome = ${nome}, idade = ${idade}, escola = ${escola}, updated_at = NOW()
      WHERE uuid = ${id}
      RETURNING *
    `;
    return result[0] || null;
  },

  async delete(id) {
    await sql`DELETE FROM alunos WHERE uuid = ${id}`;
  },
};

export default StudentModel;
