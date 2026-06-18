import sql from "./database.js";

async function migrate() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS alunos (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        escola TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✓ alunos table ready");

    await sql`
      CREATE TABLE IF NOT EXISTS oficina_alunos (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        oficina_id UUID NOT NULL REFERENCES oficinas(uuid) ON DELETE CASCADE,
        aluno_id UUID NOT NULL REFERENCES alunos(uuid) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(oficina_id, aluno_id)
      )
    `;
    console.log("✓ oficina_alunos table ready");

    await sql`
      CREATE TABLE IF NOT EXISTS oficina_professores (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        oficina_id UUID NOT NULL REFERENCES oficinas(uuid) ON DELETE CASCADE,
        professor_id UUID NOT NULL REFERENCES superusuarios(uuid) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(oficina_id, professor_id)
      )
    `;
    console.log("✓ oficina_professores table ready");

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error.message);
  }
  process.exit(0);
}

migrate();
