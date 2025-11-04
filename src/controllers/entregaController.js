const EntregaModel = require('../models/EntregaModel'); // <- Você precisará criar este Model

// Buscar todas as entregas
const getAllEntregas = async (req, res) => {
    try {
        const entregas = await EntregaModel.getEntregas(); // Assumindo que EntregaModel.getEntregas() existe
        res.json(entregas);
    } catch (error) {i
        res.status(500).json({ message: "Erro ao buscar entregas." });
    }
};

// Buscar entrega por ID
const getEntregaById = async (req, res) => {
    const { id } = req.params;
    try {
        const entrega = await EntregaModel.getEntregaById(id); // Assumindo que EntregaModel.getEntregaById(id) existe
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada.' });
        }
        res.json(entrega);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar entrega.' });
    }
}

// Criar nova entrega
const createEntrega = async (req, res) => {
    try {
        const {
            pedido_id,
            motorista_id,
            veiculo_id,
            comprovante,
            status, // Opcional, pois tem DEFAULT 'PENDENTE'
            atribuido_em,
            entregue_em
        } = req.body;
       
        // Validação básica (campos obrigatórios conforme o schema NOT NULL)
        // Nota: O schema SQL exige que 'comprovante', 'atribuido_em' e 'entregue_em' sejam NOT NULL.
        // Se a intenção era que fossem nulos na criação, o schema SQL deveria ser (TEXT NULL, TIMESTAMP NULL)
        if (!pedido_id || !motorista_id || !veiculo_id || !comprovante || !atribuido_em || !entregue_em) {
            return res.status(400).json({
                message: "Campos obrigatórios: pedido_id, motorista_id, veiculo_id, comprovante, atribuido_em, entregue_em"
            });
        }

        // Criar a entrega
        const novaEntregaData = {
            pedido_id,
            motorista_id,
            veiculo_id,
            comprovante,
            status, // Se for 'undefined', o SGBD usará o DEFAULT 'PENDENTE'
            atribuido_em,
            entregue_em
        };

        const entrega = await EntregaModel.createEntrega(novaEntregaData); // Assumindo que EntregaModel.createEntrega(data) existe
        res.status(201).json(entrega);

    } catch (error) {
        // Removida a verificação '23505' (UNIQUE), pois a tabela 'entregas' não possui
        // uma constraint UNIQUE óbvia como 'numero_pedido' tinha.
        // Adicione se houver (ex: se 'pedido_id' for UNIQUE)
        console.error("Erro ao criar entrega:", error);
        res.status(500).json({ message: "Erro ao criar a entrega." });
    }
}

// Atualizar entrega
const updateEntrega = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            pedido_id,
            motorista_id,
            veiculo_id,
            comprovante,
            status,
            atribuido_em,
            entregue_em
        } = req.body;
       
        // Verificar se a entrega existe
        const existingEntrega = await EntregaModel.getEntregaById(id);
        if (!existingEntrega) {
            return res.status(404).json({ message: "Entrega não encontrada." });
        }
       
        // Preparar dados para atualização (permite atualização parcial)
        // (Usando a mesma lógica de 'merge' do controller de Pedido)
        const updateData = {
            pedido_id: pedido_id || existingEntrega.pedido_id,
            motorista_id: motorista_id || existingEntrega.motorista_id,
            veiculo_id: veiculo_id || existingEntrega.veiculo_id,
            comprovante: comprovante !== undefined ? comprovante : existingEntrega.comprovante,
            status: status || existingEntrega.status,
            atribuido_em: atribuido_em || existingEntrega.atribuido_em,
            entregue_em: entregue_em || existingEntrega.entregue_em,
        };
       
        const entrega = await EntregaModel.updateEntrega(id, updateData); // Assumindo que EntregaModel.updateEntrega(id, data) existe
        res.json(entrega);

    } catch (error) {
        console.error("Erro ao atualizar entrega:", error);
        res.status(500).json({ message: "Erro ao atualizar a entrega." });
    }
}

// Deletar entrega
const deleteEntrega = async (req, res) => {
    try {
        const { id } = req.params;
       
        const existingEntrega = await EntregaModel.getEntregaById(id);
        if (!existingEntrega) {
            return res.status(404).json({ error: "Entrega não encontrada." });
        }
       
        await EntregaModel.deleteEntrega(id);
        res.json({ message: "Entrega deletada com sucesso." });

    } catch (error) {
        console.error('Erro ao deletar entrega:', error);
        res.status(500).json({ error: 'Erro ao deletar entrega.' });
    }
}

module.exports = {
    getAllEntregas,
    getEntregaById,
    createEntrega,
    updateEntrega,
    deleteEntrega
};