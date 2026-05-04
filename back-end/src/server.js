const express = require("express");
const cors = require("cors");
const { auth } = require("./routes/admin/autentication");
const { UserModel } = require("./models/superuserModel");

const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/login", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByIdGoogle(req.user.user_id);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            res.status(200).json({
                "nome": usuario.nome,
                "profissao": usuario.cargo,
                "idgoogle": usuario.idgoogle
            });
        }
        else {
            try {
                await UserModel.create(req.user.name, req.user.user_id);
                res.status(200).json({
                    "message": "Superusuário registrado com sucesso",
                    "nome": req.user.name,
                    "idgoogle": req.user.user_id
                });
            } catch (error) {
                console.error("Erro ao registrar superusuário:", error);
                res.status(500).json({ error: "Erro interno do servidor" });
            }
        }
    } catch (error) {
        console.error("Erro ao verificar superusuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }

});

app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
});
