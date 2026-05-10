const sql = require("../database");

const OficinaModel = {
    async findAll() {
        try {
            const result = await sql`SELECT * FROM oficinas`;
            return result;
        } catch (error) {
            throw new Error("Erro ao buscar oficinas: " + error.message);
        }
    },

    async findById(id) {
        try {
            const result = await sql`SELECT * FROM oficinas WHERE uuid = ${id}`;
            return result;
        } catch (error) {
            throw new Error("Erro ao buscar oficina por ID: " + error.message);
        }
    },

    async create(tema, descricao, data, responsavel) {
        try {
            const result = await sql`
                INSERT INTO oficinas (tema, descricao, data, "SUP_responsavel") 
                VALUES (${tema}, ${descricao}, ${data}, ${responsavel})
                RETURNING *
            `;
            console.log("Nova oficina criada com sucesso");
            return result;
        } catch (error) {
            throw new Error("Erro ao criar oficina: " + error.message);
        }
    },

    async update(id, tema, descricao, data) {
        try {
            const result = await sql`
                UPDATE oficinas 
                SET tema = ${tema}, descricao = ${descricao}, data = ${data} 
                WHERE uuid = ${id}
                RETURNING *
            `;
            console.log("Oficina atualizada com sucesso");
            return result;
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao atualizar oficina: " + error.message);
        }
    },

    async delete(id) {
        try {
            const result = await sql`
                DELETE FROM oficinas 
                WHERE uuid = ${id}
                RETURNING *
            `;
            console.log("Oficina deletada com sucesso");
            return result;
        } catch (error) {
            throw new Error("Erro ao deletar oficina: " + error.message);
        }
    }
}

module.exports = { OficinaModel };