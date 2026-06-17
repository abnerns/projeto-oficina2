import sql from "../database.js";

const DashboardModel = {
  async stats() {
    const totalWorkshops = await sql`SELECT COUNT(*)::int AS count FROM oficinas`;
    const totalStudents = await sql`SELECT COUNT(*)::int AS count FROM alunos`;
    const totalTeachers = await sql`SELECT COUNT(*)::int AS count FROM superusuarios`;

    const workshopsWithCounts = await sql`
      SELECT o.uuid, o.tema, o.data,
        COUNT(DISTINCT oa.aluno_id)::int AS student_count,
        COUNT(DISTINCT op.professor_id)::int AS teacher_count
      FROM oficinas o
      LEFT JOIN oficina_alunos oa ON o.uuid = oa.oficina_id
      LEFT JOIN oficina_professores op ON o.uuid = op.oficina_id
      GROUP BY o.uuid, o.tema, o.data
      ORDER BY o.data DESC
    `;

    return {
      totalWorkshops: totalWorkshops[0]?.count || 0,
      totalStudents: totalStudents[0]?.count || 0,
      totalTeachers: totalTeachers[0]?.count || 0,
      workshops: workshopsWithCounts,
    };
  },
};

export default DashboardModel;
