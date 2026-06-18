import sql from "../database.js";

const ParticipantModel = {
  async enroll(oficinaId, alunoId) {
    const existing = await sql`
      SELECT * FROM oficina_alunos
      WHERE oficina_id = ${oficinaId} AND aluno_id = ${alunoId}
    `;
    if (existing.length > 0) {
      return { error: "Aluno já vinculado a esta oficina" };
    }
    const result = await sql`
      INSERT INTO oficina_alunos (oficina_id, aluno_id)
      VALUES (${oficinaId}, ${alunoId})
      RETURNING *
    `;
    return result[0];
  },

  async unenroll(oficinaId, alunoId) {
    await sql`
      DELETE FROM oficina_alunos
      WHERE oficina_id = ${oficinaId} AND aluno_id = ${alunoId}
    `;
  },

  async listByWorkshop(oficinaId) {
    return await sql`
      SELECT a.*, oa.enrolled_at
      FROM alunos a
      JOIN oficina_alunos oa ON a.uuid = oa.aluno_id
      WHERE oa.oficina_id = ${oficinaId}
      ORDER BY a.nome
    `;
  },

  async listByStudent(alunoId) {
    return await sql`
      SELECT o.*, oa.enrolled_at
      FROM oficinas o
      JOIN oficina_alunos oa ON o.uuid = oa.oficina_id
      WHERE oa.aluno_id = ${alunoId}
      ORDER BY o.data DESC
    `;
  },

  async countByWorkshop() {
    return await sql`
      SELECT o.uuid, o.tema, COUNT(oa.aluno_id)::int AS student_count
      FROM oficinas o
      LEFT JOIN oficina_alunos oa ON o.uuid = oa.oficina_id
      GROUP BY o.uuid, o.tema
      ORDER BY o.tema
    `;
  },

  async countByWorkshopSingle(oficinaId) {
    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM oficina_alunos
      WHERE oficina_id = ${oficinaId}
    `;
    return result[0]?.count || 0;
  },

  async enrollBatch(oficinaId, alunoIds) {
    if (!alunoIds || alunoIds.length === 0) return [];
    const rows = alunoIds.map((id) => [oficinaId, id]);
    const result = await sql`
      INSERT INTO oficina_alunos (oficina_id, aluno_id)
      VALUES ${sql(rows)}
      ON CONFLICT (oficina_id, aluno_id) DO NOTHING
      RETURNING *
    `;
    return result;
  },
};

export default ParticipantModel;
