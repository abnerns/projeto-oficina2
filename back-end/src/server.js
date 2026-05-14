import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "./common/admin/authentication.js";
import UserModel from "./models/superuserModel.js";
import OficinaModel from "./models/oficinaModel.js";

const app = express();
const port = 3333;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Chave secreta do JWT (depois a gente joga no .env)
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_provisoria";

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// --- ROTAS DE AUTENTICAÇÃO E USUÁRIO ---

app.get("/login", auth, async (req, res) => {
    try {
        const emailUsuario = req.user.email;
        const encontrados = await UserModel.findByEmail(emailUsuario);
        
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            res.status(200).json({
                "nome": usuario.nome,
                "profissao": usuario.cargo,
                "email": usuario.email
            });
        }
        else {
            try {
                await UserModel.createGoogle(req.user.name, emailUsuario, req.user.user_id);
                res.status(200).json({
                    "message": "Superusuário registrado com sucesso via Google",
                    "nome": req.user.name,
                    "email": emailUsuario
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

app.post("/registrar", async (req, res) => {
    const { nome, cargo, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios" });
    }

    try {
        const usuarioExistente = await UserModel.findByEmail(email);
        if (usuarioExistente && usuarioExistente.length > 0) {
            return res.status(409).json({ error: "E-mail já cadastrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        await UserModel.createLocal(nome, email, senhaHash, cargo);

        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.post("/login/local", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    try {
        const encontrados = await UserModel.findByEmail(email);
        if (!encontrados || encontrados.length === 0) {
            return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        const usuario = encontrados[0];

        if (!usuario.senha) {
            return res.status(401).json({ error: "Conta vinculada ao Google. Faça login pelo Google." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        const token = jwt.sign(
            { email: usuario.email, nome: usuario.nome },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            usuario: { nome: usuario.nome, cargo: usuario.cargo, email: usuario.email }
        });
    } catch (error) {
        console.error("Erro no login:", error);
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

app.get("/get-user/:email", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByEmail(req.params.email);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            res.status(200).json({
                "message": "Superusuário encontrado com sucesso",
                "nome": usuario.nome,
                "profissao": usuario.cargo,
                "email": usuario.email
            });
        } else {
            res.status(404).json({ error: "Superusuário não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar superusuário:", error);
        res.status(500).json({ error: "Erro interno ao buscar superusuário" });
    }
});

app.put("/update-user/:email", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByEmail(req.params.email);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            const nome = req.body.nome ?? usuario.nome;
            const cargo = req.body.cargo ?? usuario.cargo;
            await UserModel.update(usuario.email, nome, cargo);
            res.status(200).json({
                "message": "Superusuário atualizado com sucesso",
                "nome": nome,
                "cargo": cargo,
                "email": usuario.email
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

app.delete("/delete-user/:email", auth, async (req, res) => {
    try {
        const encontrados = await UserModel.findByEmail(req.params.email);
        if (encontrados != null && encontrados.length > 0) {
            const usuario = encontrados[0];
            await UserModel.delete(usuario.email);
            res.status(200).json({
                "message": "Superusuário deletado com sucesso",
                "email": usuario.email
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

// --- ROTAS DE OFICINA ---

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
        console.error("Erro ao buscar oficina", error.message);
    }
});

app.post("/create-oficina", async (req, res) => {
    try {
        const result = await OficinaModel.create(req.body.tema, req.body.descricao, req.body.data, req.body.responsavel);
        const novaOficina = result[0];

        res.status(200).json({
            "message": "Oficina criada com sucesso",
            "id": novaOficina.uuid,
            "tema": req.body.tema,
            "descricao": req.body.descricao,
            "data": req.body.data,
            "responsavel": req.body.responsavel
        });
    } catch (error) {
        console.error("Erro ao criar oficina ", error.message);
        res.status(500).json({ error: "Erro interno ao criar oficina" });
    }
});

app.put("/update-oficina/:id", async (req, res) => {
    try {
        const encontrados = await OficinaModel.findById(req.params.id);
        if (encontrados != null && encontrados.length > 0) {
            const oficina = encontrados[0];
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