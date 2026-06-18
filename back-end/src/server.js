import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "./common/admin/authentication.js";
import UserModel from "./models/superuserModel.js";
import OficinaModel from "./models/oficinaModel.js";
import StudentModel from "./models/studentModel.js";
import ParticipantModel from "./models/participantModel.js";
import InstructorModel from "./models/instructorModel.js";
import CertificateModel from "./models/certificateModel.js";
import DashboardModel from "./models/dashboardModel.js";

const app = express();
const port = 3333;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
                "uuid": usuario.uuid,
                "nome": usuario.nome,
                "profissao": usuario.cargo,
                "email": usuario.email
            });
        }
        else {
            try {
                await UserModel.createGoogle(req.user.name, emailUsuario, req.user.user_id);
                const novos = await UserModel.findByEmail(emailUsuario);
                const novo = novos && novos.length > 0 ? novos[0] : {};
                res.status(200).json({
                    "uuid": novo.uuid,
                    "message": "Superusuário registrado com sucesso via Google",
                    "nome": req.user.name,
                    "profissao": "Professor",
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
            { email: usuario.email, nome: usuario.nome, uuid: usuario.uuid, cargo: usuario.cargo },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            usuario: { uuid: usuario.uuid, nome: usuario.nome, cargo: usuario.cargo, email: usuario.email }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.get("/get-users", async (req, res) => {
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
                "uuid": usuario.uuid,
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
            const result = [];
            for (const o of encontrados) {
                const studentCount = await ParticipantModel.countByWorkshopSingle(o.uuid);
                const teachers = await InstructorModel.listByWorkshop(o.uuid);
                result.push({
                    ...o,
                    student_count: studentCount,
                    teacherIds: teachers.map(t => t.uuid),
                    teachers: teachers
                });
            }
            res.status(200).json(result);
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
            const studentCount = await ParticipantModel.countByWorkshopSingle(oficina.uuid);
            const teachers = await InstructorModel.listByWorkshop(oficina.uuid);
            res.status(200).json({
                ...oficina,
                student_count: studentCount,
                teacherIds: teachers.map(t => t.uuid),
                teachers: teachers
            });
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

        if (req.body.teacherIds && req.body.teacherIds.length > 0) {
            await InstructorModel.setInstructors(novaOficina.uuid, req.body.teacherIds);
        }

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

            await OficinaModel.update(req.params.id, tema, descricao, data);

            if (req.body.teacherIds) {
                await InstructorModel.setInstructors(req.params.id, req.body.teacherIds);
            }

            res.status(200).json({
                "message": "Oficina atualizada com sucesso",
                "tema": tema,
                "descricao": descricao,
                "data": data
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

// --- ROTAS DE ALUNOS ---

app.get("/get-alunos", async (req, res) => {
    try {
        const alunos = await StudentModel.findAll();
        const result = [];
        for (const a of alunos) {
            const workshops = await ParticipantModel.listByStudent(a.uuid);
            result.push({ ...a, workshopIds: workshops.map(w => w.uuid), workshops });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao buscar alunos:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar alunos" });
    }
});

app.get("/get-aluno/:id", async (req, res) => {
    try {
        const aluno = await StudentModel.findById(req.params.id);
        if (aluno) {
            const workshops = await ParticipantModel.listByStudent(aluno.uuid);
            res.status(200).json({ ...aluno, workshopIds: workshops.map(w => w.uuid), workshops });
        } else {
            res.status(404).json({ error: "Aluno não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar aluno:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar aluno" });
    }
});

app.post("/create-aluno", async (req, res) => {
    const { nome, idade, escola } = req.body;
    if (!nome || idade === undefined || !escola) {
        return res.status(400).json({ error: "Nome, idade e escola são obrigatórios" });
    }
    try {
        const aluno = await StudentModel.create(nome, idade, escola);
        res.status(201).json({ message: "Aluno criado com sucesso", aluno });
    } catch (error) {
        console.error("Erro ao criar aluno:", error.message);
        res.status(500).json({ error: "Erro interno ao criar aluno" });
    }
});

app.post("/create-alunos-batch", async (req, res) => {
    const { escola, nomes, idade } = req.body;
    if (!escola || !nomes || !Array.isArray(nomes) || nomes.length === 0) {
        return res.status(400).json({ error: "Escola e lista de nomes são obrigatórios" });
    }
    try {
        const alunos = await StudentModel.createBatch(escola, nomes, idade || null);
        res.status(201).json({ message: `${alunos.length} aluno(s) criado(s) com sucesso`, alunos });
    } catch (error) {
        console.error("Erro ao criar alunos em lote:", error.message);
        res.status(500).json({ error: "Erro interno ao criar alunos" });
    }
});

app.put("/update-aluno/:id", async (req, res) => {
    const { nome, idade, escola } = req.body;
    try {
        const aluno = await StudentModel.update(req.params.id, nome, idade, escola);
        if (aluno) {
            res.status(200).json({ message: "Aluno atualizado com sucesso", aluno });
        } else {
            res.status(404).json({ error: "Aluno não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar aluno:", error.message);
        res.status(500).json({ error: "Erro interno ao atualizar aluno" });
    }
});

app.delete("/delete-aluno/:id", async (req, res) => {
    try {
        await StudentModel.delete(req.params.id);
        res.status(200).json({ message: "Aluno deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar aluno:", error.message);
        res.status(500).json({ error: "Erro interno ao deletar aluno" });
    }
});

// --- ROTAS DE VÍNCULO ALUNO-OFICINA ---

app.post("/enroll-aluno", async (req, res) => {
    const { oficinaId, alunoId } = req.body;
    if (!oficinaId || !alunoId) {
        return res.status(400).json({ error: "oficinaId e alunoId são obrigatórios" });
    }
    try {
        const result = await ParticipantModel.enroll(oficinaId, alunoId);
        if (result.error) {
            return res.status(409).json({ error: result.error });
        }
        res.status(201).json({ message: "Aluno vinculado à oficina com sucesso" });
    } catch (error) {
        console.error("Erro ao vincular aluno:", error.message);
        res.status(500).json({ error: "Erro interno ao vincular aluno" });
    }
});

app.post("/enroll-alunos-batch", async (req, res) => {
    const { oficinaId, alunoIds } = req.body;
    if (!oficinaId || !alunoIds || !Array.isArray(alunoIds) || alunoIds.length === 0) {
        return res.status(400).json({ error: "oficinaId e lista de alunoIds são obrigatórios" });
    }
    try {
        const result = await ParticipantModel.enrollBatch(oficinaId, alunoIds);
        res.status(201).json({ message: `${result.length} aluno(s) vinculado(s) com sucesso` });
    } catch (error) {
        console.error("Erro ao vincular alunos em lote:", error.message);
        res.status(500).json({ error: "Erro interno ao vincular alunos" });
    }
});

app.delete("/unenroll-aluno", async (req, res) => {
    const { oficinaId, alunoId } = req.body;
    if (!oficinaId || !alunoId) {
        return res.status(400).json({ error: "oficinaId e alunoId são obrigatórios" });
    }
    try {
        await ParticipantModel.unenroll(oficinaId, alunoId);
        res.status(200).json({ message: "Vínculo removido com sucesso" });
    } catch (error) {
        console.error("Erro ao remover vínculo:", error.message);
        res.status(500).json({ error: "Erro interno ao remover vínculo" });
    }
});

app.get("/get-participants/:oficinaId", async (req, res) => {
    try {
        const alunos = await ParticipantModel.listByWorkshop(req.params.oficinaId);
        res.status(200).json(alunos);
    } catch (error) {
        console.error("Erro ao buscar participantes:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar participantes" });
    }
});

// --- ROTAS DE PROFESSORES-OFICINA ---

app.post("/add-instructor", async (req, res) => {
    const { oficinaId, professorId } = req.body;
    if (!oficinaId || !professorId) {
        return res.status(400).json({ error: "oficinaId e professorId são obrigatórios" });
    }
    try {
        const result = await InstructorModel.addInstructor(oficinaId, professorId);
        if (result.error) {
            return res.status(409).json({ error: result.error });
        }
        res.status(201).json({ message: "Professor associado à oficina com sucesso" });
    } catch (error) {
        console.error("Erro ao associar professor:", error.message);
        res.status(500).json({ error: "Erro interno ao associar professor" });
    }
});

app.delete("/remove-instructor", async (req, res) => {
    const { oficinaId, professorId } = req.body;
    if (!oficinaId || !professorId) {
        return res.status(400).json({ error: "oficinaId e professorId são obrigatórios" });
    }
    try {
        await InstructorModel.removeInstructor(oficinaId, professorId);
        res.status(200).json({ message: "Professor removido da oficina com sucesso" });
    } catch (error) {
        console.error("Erro ao remover professor:", error.message);
        res.status(500).json({ error: "Erro interno ao remover professor" });
    }
});

app.get("/get-instructors/:oficinaId", async (req, res) => {
    try {
        const professores = await InstructorModel.listByWorkshop(req.params.oficinaId);
        res.status(200).json(professores);
    } catch (error) {
        console.error("Erro ao buscar professores:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar professores" });
    }
});

// --- ROTAS DE CERTIFICADOS ---

app.get("/certificate/:alunoId/:oficinaId", async (req, res) => {
    try {
        const aluno = await StudentModel.findById(req.params.alunoId);
        if (!aluno) {
            return res.status(404).json({ error: "Aluno não encontrado" });
        }

        const oficinas = await OficinaModel.findById(req.params.oficinaId);
        if (!oficinas || oficinas.length === 0) {
            return res.status(404).json({ error: "Oficina não encontrada" });
        }
        const oficina = oficinas[0];

        const pdf = await CertificateModel.generate(aluno.nome, oficina.tema, oficina.data);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="certificado_${aluno.nome.replace(/\s+/g, '_')}.pdf"`);
        res.send(pdf);
    } catch (error) {
        console.error("Erro ao gerar certificado:", error.message);
        res.status(500).json({ error: "Erro interno ao gerar certificado" });
    }
});

// --- ROTAS DE DASHBOARD ---

app.get("/dashboard/stats", async (req, res) => {
    try {
        const data = await DashboardModel.stats();
        res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar estatísticas" });
    }
});

app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
});
