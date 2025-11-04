const UserModel = require('../models/UserModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários." });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await UserModel.deleteUser(req.params.id);
        if (result.error) {
            return res.status(404).json(result);
        }
        res.json(result);

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await UserModel.updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar o usuário." });
    }
}

const createUser = async (req, res) => {
    try {
        const { 
            nome, 
            email, 
            telefone, 
            senha, 
            funcao 
        } = req.body;
        
        // Validação básica
        if (!nome || !email || !telefone || !senha || !funcao) {
            return res.status(400).json({ 
                message: "Todos os campos são obrigatórios: nome, email, telefone, senha, funcao" 
            });
        }

        // Validação da função
        if (!['ADMIN', 'MOTORISTA'].includes(funcao)) {
            return res.status(400).json({ 
                message: "Função deve ser 'ADMIN' ou 'MOTORISTA'" 
            });
        }

        const user = await UserModel.createUser(
            nome, 
            email, 
            telefone, 
            senha, 
            funcao
        );
        res.status(201).json(user);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Email ou telefone já estão em uso." 
            });
        }
        res.status(500).json({ message: "Erro ao criar o usuário." });
    }
}


module.exports = {getAllUsers, getUserById, deleteUser, updateUser, createUser};