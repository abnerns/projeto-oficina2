import express from "express";
import cors from "cors";
import auth from "./common/admin/authentication.js";
import UserModel from "./models/superuserModel.js";
import OficinaModel from "./models/oficinaModel.js";

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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

app.get("/get-users", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findAll();
        if (encontrados != null && encontrados.length > 0) {
            res.status(200).json(encontrados);
        }
        else {
            res.status(404).json({ error: "Nenhum superusuário encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar superusuários:", error);
        res.status(500).json({ error: "Erro interno ao buscar superusuários" });
    }
});

app.get("/get-user/:idgoogle", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByIdGoogle(req.params.idgoogle);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            res.status(200).json({
                "message": "Superusuário encontrado com sucesso",
                "nome": usuario.nome,
                "profissao": usuario.cargo,
                "idgoogle": usuario.idgoogle
            });
        }
    } catch (error) {
        console.error("Erro ao buscar superusuário:", error);
        res.status(500).json({ error: "Erro interno ao buscar superusuário" });
    }
});

app.put("/update-user/:idgoogle", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByIdGoogle(req.params.idgoogle);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            const nome = req.body.nome ?? usuario.nome;
            const cargo = req.body.cargo ?? usuario.cargo;
            await UserModel.update(usuario.idgoogle, nome, cargo);
            res.status(200).json({
                "message": "Superusuário atualizado com sucesso",
                "nome": nome,
                "cargo": cargo,
                "idgoogle": usuario.idgoogle
            });
        }
        else {
            res.status(404).json({ error: "Superusuário não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar superusuário:", error);
        res.status(500).json({ error: "Erro interno ao atualizar superusuário" });
    }
});

app.delete("/delete-user/:idgoogle", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByIdGoogle(req.params.idgoogle);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            await UserModel.delete(usuario.idgoogle);
            res.status(200).json({
                "message": "Superusuário deletado com sucesso",
                "idgoogle": usuario.idgoogle
            });
        }
        else {
            res.status(404).json({ error: "Superusuário não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar superusuário:", error);
        res.status(500).json({ error: "Erro interno ao deletar superusuário" });
    }
});

app.get("/get-oficinas", async (req, res) => {
    try {
        const encontrados = await OficinaModel.findAll();
        if (encontrados != null && encontrados.length > 0) {
            res.status(200).json(encontrados);
        }
        else {
            res.status(404).json({ error: "Nenhuma oficina encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar oficinas");
        res.status(500).json({ error: "Erro interno ao buscar oficinas" });
    }
});

app.get("/get-oficina/:id", async (req, res) => {
    try {
        const encontrados = await OficinaModel.findById(req.params.id);
        if (encontrados != null && encontrados.length > 0) {
            const oficina = encontrados[0];
            res.status(200).json(oficina);
        }
        else {
            res.status(404).json({ error: "Oficina não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar oficina");
    }
});

app.post("/create-oficina", async (req, res) => {
    try {
        await OficinaModel.create(req.body.tema, req.body.descricao, req.body.data, req.body.responsavel);
        res.status(200).json({
            "message": "Oficina criada com sucesso",
            "tema": req.body.tema,
            "descricao": req.body.descricao,
            "data": req.body.data,
            "responsavel": req.body.responsavel
        });
    } catch (error) {
        console.error("Erro ao criar oficina");
        res.status(500).json({ error: "Erro interno ao criar oficina" });
    }
});

app.put("/update-oficina/:id", async (req, res) => {

    try {
        const encontrados = await OficinaModel.findById(req.params.id);
        if (encontrados != null && encontrados.length > 0) {

            const oficina = encontrados[0];
            console.log(oficina);

            const tema = req.body.tema ?? oficina.tema;
            const descricao = req.body.descricao ?? oficina.descricao;
            const data = req.body.data ?? oficina.data;
            const responsavel = oficina.responsavel;


            await OficinaModel.update(req.params.id, tema, descricao, data, responsavel);
            res.status(200).json({
                "message": "Oficina atualizada com sucesso",
                "tema": tema,
                "descricao": descricao,
                "data": data,
                "responsavel": responsavel
            });
        }
        else {
            res.status(404).json({ error: "Oficina não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao atualizar oficina");
        res.status(500).json({ error: "Erro interno ao atualizar oficina" });
    }
});

app.delete("/delete-oficina/:id", async (req, res) => {
    try {
        await OficinaModel.delete(req.params.id);
        res.status(200).json({
            "message": "Oficina deletada com sucesso",
            "id": req.params.id
        });
    } catch (error) {
        console.error("Erro ao deletar oficina");
        res.status(500).json({ error: "Erro interno ao deletar oficina" });
    }
});


app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
});
