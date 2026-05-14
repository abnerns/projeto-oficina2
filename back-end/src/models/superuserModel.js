import sql from "../database.js";

const UserModel = {
    async findAll() {
        try {
            const result = await sql`SELECT * FROM superusuarios`;
            return result;
        } catch (error) {
            console.error("Erro ao buscar superusuários:", error);
        }
    },

    async findByEmail(email) {
        try {
            const result = await sql`SELECT * FROM superusuarios WHERE email = ${email}`;
            console.log("Resultado encontrado");
            return result;
        } catch (error) {
            throw new Error("Erro ao buscar por email: " + error.message);
        }
    },

    async createGoogle(nome, email, idgoogle, cargo = 'Professor') {
        try {
            const result = await sql`INSERT INTO superusuarios (nome, cargo, email, idgoogle) VALUES (${nome}, ${cargo}, ${email}, ${idgoogle})`;
            console.log("Novo superusuario do Google inserido");
            return result;
        } catch (error) {
            throw new Error("Erro ao criar superusuário via Google: " + error.message);
        }
    },

    async createLocal(nome, email, senhaHash, cargo = 'Professor') {
        try {
            const result = await sql`INSERT INTO superusuarios (nome, cargo, email, senha) VALUES (${nome}, ${cargo}, ${email}, ${senhaHash})`;
            console.log("Novo superusuario local inserido");
            return result;
        } catch (error) {
            throw new Error("Erro ao criar superusuário local: " + error.message);
        }
    },

    async update(email, nome, cargo) {
        try {
            const result = await sql`
                UPDATE superusuarios 
                SET nome = ${nome}, cargo = ${cargo} 
                WHERE email = ${email}
                RETURNING *
            `;
            console.log("Superusuário atualizado com sucesso");
            return result;
        } catch (error) {
            throw new Error("Erro ao atualizar superusuário: " + error.message);
        }
    },

    async delete(email) {
        try {
            const result = await sql`
                DELETE FROM superusuarios 
                WHERE email = ${email}
                RETURNING *
            `;
            console.log("Superusuário deletado com sucesso");
            return result;
        } catch (error) {
            throw new Error("Erro ao deletar superusuário: " + error.message);
        }
    }
}

export default UserModel;