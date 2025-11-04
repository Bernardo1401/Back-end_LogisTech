const PedidoModel = require('../models/PedidoModel'); // <- Você precisará criar este Model

// Buscar todos os pedidos
const getAllPedidos = async (req, res) => {
    try {
        const pedidos = await PedidoModel.getPedidos(); // Assumindo que PedidoModel.getPedidos() existe
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar pedidos." });
    }
};

// Buscar pedido por ID
const getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await PedidoModel.getPedidoById(id); // Assumindo que PedidoModel.getPedidoById(id) existe
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
}

// Criar novo pedido
const createPedido = async (req, res) => {
    try {
        const { 
            numero_pedido, 
            cliente_id, 
            valor_total,
            endereco_cliente,
            status // Opcional, pois tem DEFAULT 'PENDENTE'
        } = req.body;
        
        // Validação básica (campos obrigatórios)
        if (!numero_pedido || !cliente_id) {
            return res.status(400).json({ 
                message: "Campos obrigatórios: numero_pedido, cliente_id" 
            });
        }

        // Criar o pedido (assumindo que o Model aceita um objeto)
        const novoPedidoData = {
            numero_pedido,
            cliente_id,
            valor_total,
            endereco_cliente,
            status // Se for 'undefined', o SGBD usará o DEFAULT
        };

        const pedido = await PedidoModel.createPedido(novoPedidoData); // Assumindo que PedidoModel.createPedido(data) existe
        res.status(201).json(pedido);

    } catch (error) {
        // Erro de violação de constraint UNIQUE (para 'numero_pedido')
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "O número do pedido já está em uso." 
            });
        }
        console.error("Erro ao criar pedido:", error);
        res.status(500).json({ message: "Erro ao criar o pedido." });
    }
}

// Atualizar pedido
const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            numero_pedido, 
            cliente_id, 
            valor_total,
            endereco_cliente,
            status 
        } = req.body;
        
        // Verificar se o pedido existe
        const existingPedido = await PedidoModel.getPedidoById(id);
        if (!existingPedido) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }
        
        // Preparar dados para atualização (permite atualização parcial)
        const updateData = {
            numero_pedido: numero_pedido || existingPedido.numero_pedido,
            cliente_id: cliente_id || existingPedido.cliente_id,
            valor_total: valor_total !== undefined ? valor_total : existingPedido.valor_total,
            endereco_cliente: endereco_cliente !== undefined ? endereco_cliente : existingPedido.endereco_cliente,
            status: status || existingPedido.status,
            // O Model deve ser responsável por atualizar 'atualizado_em'
        };
        
        const pedido = await PedidoModel.updatePedido(id, updateData); // Assumindo que PedidoModel.updatePedido(id, data) existe
        res.json(pedido);

    } catch (error) {
        // Erro de violação de constraint UNIQUE (para 'numero_pedido')
        if (error.code === '23505') { 
            return res.status(409).json({ 
                message: "O número do pedido já está em uso." 
            });
        }
        console.error("Erro ao atualizar pedido:", error);
        res.status(500).json({ message: "Erro ao atualizar o pedido." });
    }
}

// Deletar pedido
const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        
        const existingPedido = await PedidoModel.getPedidoById(id);
        if (!existingPedido) {
            return res.status(404).json({ error: "Pedido não encontrado." });
        }
        
        await PedidoModel.deletePedido(id);
        res.json({ message: "Pedido deletado com sucesso." });

    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        res.status(500).json({ error: 'Erro ao deletar pedido.' });
    }
}

module.exports = { 
    getAllPedidos, 
    getPedidoById, 
    createPedido, 
    updatePedido, 
    deletePedido 
};