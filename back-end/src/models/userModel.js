const sql = require("../database");

const UserModel = {
    async findAll() {
        const result = await sql`SELECT * FROM testes`;
        console.log(result);
    }
    
}

UserModel.findAll();