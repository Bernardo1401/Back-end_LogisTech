const MotoristaModel = require('../models/MotoristaModel');

// Buscar todos os motoristas
const getAllMotoristas = async (req, res) => {
    try {
        const users = await MotoristaModel.getUsers();
        const motoristas = users.filter(user => user.funcao === 'MOTORISTA');
        res.json(motoristas);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar motoristas." });
    }
};

// Buscar motorista por ID
const getMotoristaById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await MotoristaModel.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        // Verificar se é motorista
        if (user.funcao !== 'MOTORISTA') {
            return res.status(404).json({ error: 'Motorista não encontrado.' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar motorista.' });
    }
}

// Criar novo motorista
const createMotorista = async (req, res) => {
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

        // Criar motorista (função sempre será MOTORISTA)
        const motorista = await MotoristaModel.createUser(
            nome, 
            email, 
            telefone, 
            senha, 
            'MOTORISTA'  // Função fixa como MOTORISTA
        );
        res.status(201).json(motorista);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Email ou telefone já estão em uso." 
            });
        }
        res.status(500).json({ message: "Erro ao criar o motorista." });
    }
}

// Atualizar motorista
const updateMotorista = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, senha } = req.body;
        
        // Verificar se o usuário existe e é motorista
        const existingUser = await MotoristaModel.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        
        if (existingUser.funcao !== 'MOTORISTA') {
            return res.status(404).json({ message: "Motorista não encontrado." });
        }
        
        // Preparar dados para atualização (mantendo função como MOTORISTA)
        const updateData = {
            nome: nome || existingUser.nome,
            email: email || existingUser.email,
            telefone: telefone || existingUser.telefone,
            senha: senha || existingUser.senha,
            funcao: 'MOTORISTA'  // Manter sempre como MOTORISTA
        };
        
        const motorista = await MotoristaModel.updateUser(id, updateData);
        res.json(motorista);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "Email ou telefone já estão em uso." 
            });
        }
        res.status(500).json({ message: "Erro ao atualizar o motorista." });
    }
}

// Deletar motorista
const deleteMotorista = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o usuário existe e é motorista
        const existingUser = await MotoristaModel.getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        
        if (existingUser.funcao !== 'MOTORISTA') {
            return res.status(404).json({ error: "Motorista não encontrado." });
        }
        
        const result = await MotoristaModel.deleteUser(id);
        if (result.error) {
            return res.status(404).json(result);
        }
        res.json({ message: "Motorista deletado com sucesso." });

    } catch (error) {
        console.error('Erro ao deletar motorista:', error);
        res.status(500).json({ error: 'Erro ao deletar motorista.' });
    }
}

module.exports = { getAllMotoristas, getMotoristaById, createMotorista, updateMotorista, deleteMotorista };