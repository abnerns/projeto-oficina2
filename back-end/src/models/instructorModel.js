import sql from "../database.js";

const InstructorModel = {
  async addInstructor(oficinaId, professorId) {
    const existing = await sql`
      SELECT * FROM oficina_professores
      WHERE oficina_id = ${oficinaId} AND professor_id = ${professorId}
    `;
    if (existing.length > 0) {
      return { error: "Professor já associado a esta oficina" };
    }
    const result = await sql`
      INSERT INTO oficina_professores (oficina_id, professor_id)
      VALUES (${oficinaId}, ${professorId})
      RETURNING *
    `;
    return result[0];
  },

  async removeInstructor(oficinaId, professorId) {
    await sql`
      DELETE FROM oficina_professores
      WHERE oficina_id = ${oficinaId} AND professor_id = ${professorId}
    `;
  },

  async listByWorkshop(oficinaId) {
    return await sql`
      SELECT s.*
      FROM superusuarios s
      JOIN oficina_professores op ON s.uuid = op.professor_id
      WHERE op.oficina_id = ${oficinaId}
      ORDER BY s.nome
    `;
  },

  async setInstructors(oficinaId, professorIds) {
    await sql`DELETE FROM oficina_professores WHERE oficina_id = ${oficinaId}`;
    if (professorIds && professorIds.length > 0) {
      for (const pid of professorIds) {
        await sql`
          INSERT INTO oficina_professores (oficina_id, professor_id)
          VALUES (${oficinaId}, ${pid})
        `;
      }
    }
  },
};

export default InstructorModel;
