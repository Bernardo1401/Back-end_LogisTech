const VeiculoModel = require('../models/VeiculoModel'); // <- Você precisará criar este Model

// Buscar todos os veículos
const getAllVeiculos = async (req, res) => {
    try {
        const veiculos = await VeiculoModel.getVeiculos(); // Assumindo que VeiculoModel.getVeiculos() existe
        res.json(veiculos);
  t } catch (error) {
        res.status(500).json({ message: "Erro ao buscar veículos." });
    }
};

// Buscar veículo por ID
const getVeiculoById = async (req, res) => {
    const { id } = req.params;
    try {
        const veiculo = await VeiculoModel.getVeiculoById(id); // Assumindo que VeiculoModel.getVeiculoById(id) existe
        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }
        res.json(veiculo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo.' });
    }
}

// Deletar veículo
const deleteVeiculo = async (req, res) => {
    try {
        const { id } = req.params;
        // Primeiro, verifica se existe (para dar um 404 correto)
        const existingVeiculo = await VeiculoModel.getVeiculoById(id);
        if (!existingVeiculo) {
            return res.status(404).json({ error: "Veículo não encontrado." });
        }

        // Tenta deletar
        await VeiculoModel.deleteVeiculo(id); // Assumindo que VeiculoModel.deleteVeiculo(id) existe
        res.json({ message: "Veículo deletado com sucesso." }); // Resposta de sucesso

    } catch (error) {
        console.error('Erro ao deletar veículo:', error);
        res.status(500).json({ error: 'Erro ao deletar veículo.' });
    }
}

// Atualizar veículo
const updateVeiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const veiculo = await VeiculoModel.updateVeiculo(id, req.body); // Assumindo que VeiculoModel.updateVeiculo(id, data) existe
        
        if (!veiculo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }
        res.json(veiculo);

    } catch (error) {
        // Erro de violação de constraint UNIQUE (para 'placa')
        if (error.code === '23505' && error.constraint.includes('placa')) { 
            return res.status(409).json({ 
                message: "A placa informada já está em uso." 
            });
        }
        res.status(500).json({ message: "Erro ao atualizar o veículo." });
    }
}

// Criar novo veículo
const createVeiculo = async (req, res) => {
    try {
        const { 
            motorista_id, // Pode ser nulo/undefined
            placa, 
            modelo,
            marca,
            ano
        } = req.body;
        
        // Validação básica (Apenas 'placa' é NOT NULL no schema)
        if (!placa) {
            return res.status(400).json({ 
                message: "O campo 'placa' é obrigatório." 
            });
        }
        
        // Dados para o Model
        const veiculoData = {
            motorista_id,
            placa,
            modelo,
            marca,
            ano
        };

        const veiculo = await VeiculoModel.createVeiculo(veiculoData); // Assumindo que VeiculoModel.createVeiculo(data) existe
        res.status(201).json(veiculo);

    } catch (error) {
        // Erro de violação de constraint UNIQUE (para 'placa')
        if (error.code === '23505' && error.constraint.includes('placa')) { 
            return res.status(409).json({ 
                message: "A placa informada já está em uso." 
            });
        }
        console.error("Erro ao criar veículo:", error);
        res.status(500).json({ message: "Erro ao criar o veículo." });
    }
}

module.exports = {
    getAllVeiculos, 
    getVeiculoById, 
    deleteVeiculo, 
    updateVeiculo, 
    createVeiculo
};