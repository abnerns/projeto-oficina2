const sql = require("../database");


const UserModel = {
    async findAll() {
        try {
            const result = await sql`SELECT * FROM superusuarios`;
            console.log(result);
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

    async create(nome, cargo, idgoogle) {
        try {
            const result = await sql`INSERT INTO superusuarios (nome, cargo, idgoogle) VALUES (${nome}, ${cargo}, ${idgoogle})`;
            console.log("Novo superusuario inserido");
        } catch (error) {
            throw new Error("Erro ao criar superusuário: " + error.message);
        }
    },

}

module.exports = { UserModel };