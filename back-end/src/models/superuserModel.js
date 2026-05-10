const sql = require("../database");

const UserModel = {
    async findAll() {
        try {
            const result = await sql`SELECT * FROM superusuarios`;
            return result;
        } catch (error) {
            console.error("Erro ao buscar superusuários:", error);
        }
    },

    async findByIdGoogle(idgoogle) {
        try {
            const result = await sql`SELECT * FROM superusuarios WHERE idgoogle = ${idgoogle}`;
            console.log("Resultado encontrado");
            return result;
        } catch (error) {
            throw new Error("Erro ao buscar por ID Google: " + error.message);
        }
    },

    async create(nome, idgoogle) {
        try {
            const result = await sql`INSERT INTO superusuarios (nome, cargo, idgoogle) VALUES (${nome}, ${cargo}, ${idgoogle})`;
            console.log("Novo superusuario inserido");
            return result;
        } catch (error) {
            throw new Error("Erro ao criar superusuário: " + error.message);
        }
    },

    async update(idgoogle, nome, cargo) {
        try {
            const result = await sql`
                UPDATE superusuarios 
                SET nome = ${nome}, cargo = ${cargo} 
                WHERE idgoogle = ${idgoogle}
                RETURNING *
            `;
            console.log("Superusuário atualizado com sucesso");
            return result;
        } catch (error) {
            throw new Error("Erro ao atualizar superusuário: " + error.message);
        }
    },

    async delete(idgoogle) {
        try {
            const result = await sql`
                DELETE FROM superusuarios 
                WHERE idgoogle = ${idgoogle}
                RETURNING *
            `;
            console.log("Superusuário deletado com sucesso");
            return result;
        } catch (error) {
            throw new Error("Erro ao deletar superusuário: " + error.message);
        }
    }
}

module.exports = { UserModel };