const AdminModel = require('../models/AdminModel');

// Buscar todos os administradores
const getAllAdmins = async (req, res) => {
    try {
        const users = await AdminModel.getUsers();
        // Filtrar apenas os administradores
        const admins = users.filter(user => user.funcao === 'ADMIN');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar administradores." });
    }
};

// Buscar administrador por ID
const getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await AdminModel.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        // Verificar se é administrador
        if (user.funcao !== 'ADMIN') {
            return res.status(404).json({ error: 'Administrador não encontrado.' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar administrador.' });
    }
}

// Criar novo administrador
const createAdmin = async (req, res) => {
    try {
        const { 
            nome, 
            email, 
            telefone, 
            senha 
        } = req.body;
        
        // Validação básica
        if (!nome || !email || !telefone || !senha) {
            return res.status(400).json({ 
                message: "Todos os campos são obrigatórios: nome, email, telefone, senha" 
            });
        }

        // Criar administrador (função sempre será ADMIN)
        const admin = await AdminModel.createUser(
            nome, 
            email, 
            telefone, 
            senha, 
            'ADMIN'  // Função fixa como ADMIN
        );
        res.status(201).json(admin);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Email ou telefone já estão em uso." 
            });
        }
        res.status(500).json({ message: "Erro ao criar o administrador." });
    }
}

// Atualizar administrador
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, senha } = req.body;
        
        // Verificar se o usuário existe e é administrador
        const existingUser = await AdminModel.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        
        if (existingUser.funcao !== 'ADMIN') {
            return res.status(404).json({ message: "Administrador não encontrado." });
        }
        
        // Preparar dados para atualização (mantendo função como ADMIN)
        const updateData = {
            nome: nome || existingUser.nome,
            email: email || existingUser.email,
            telefone: telefone || existingUser.telefone,
            senha: senha || existingUser.senha,
            funcao: 'ADMIN'  // Manter sempre como ADMIN
        };
        
        const admin = await AdminModel.updateUser(id, updateData);
        res.json(admin);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Email ou telefone já estão em uso." 
            });
        }
        res.status(500).json({ message: "Erro ao atualizar o administrador." });
    }
}

// Deletar administrador
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o usuário existe e é administrador
        const existingUser = await AdminModel.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        
        if (existingUser.funcao !== 'ADMIN') {
            return res.status(404).json({ error: "Administrador não encontrado." });
        }
        
        const result = await AdminModel.deleteUser(id);
        if (result.error) {
            return res.status(404).json(result);
        }
        res.json({ message: "Administrador deletado com sucesso." });

    } catch (error) {
        console.error('Erro ao deletar administrador:', error);
        res.status(500).json({ error: 'Erro ao deletar administrador.' });
    }
}

module.exports = { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };