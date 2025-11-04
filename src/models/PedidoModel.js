const pool = require("../config/database");

// Buscar todos os pedidos
const getPedidos = async () => {
    const result = await pool.query(
        "SELECT * FROM pedidos ORDER BY criado_em DESC"
    );
    return result.rows;
};

// Buscar pedido por ID
const getPedidoById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM pedidos WHERE id = $1", 
        [id]
    );
    return result.rows[0];
};

// Deletar pedido
const deletePedido = async (id) => {
    const result = await pool.query(
        "DELETE FROM pedidos WHERE id = $1 RETURNING *", 
        [id]
    );

    if (result.rowCount === 0) {
        return { error: "Pedido não encontrado." };
    }
    return { message: "Pedido deletado com sucesso." };
};

// Atualizar pedido
const updatePedido = async (id, data) => {
    const { 
        numero_pedido, 
        cliente_id, 
        valor_total,
        endereco_cliente,
        status 
    } = data;
    
    const result = await pool.query(
        `UPDATE pedidos SET 
            numero_pedido = $1, 
            cliente_id = $2, 
            valor_total = $3, 
            endereco_cliente = $4, 
            status = $5,
            atualizado_em = CURRENT_TIMESTAMP 
        WHERE id = $6
        RETURNING *`, // Retorna todos os campos do pedido atualizado
        [numero_pedido, cliente_id, valor_total, endereco_cliente, status, id]
    );
    return result.rows[0];
};

// Criar novo pedido
const createPedido = async (numero_pedido, cliente_id, valor_total, endereco_cliente, status) => {
    // A query usará COALESCE para aplicar o 'DEFAULT' ('PENDENTE') se o status for nulo
    const result = await pool.query(
        `INSERT INTO pedidos 
        (numero_pedido, cliente_id, valor_total, endereco_cliente, status) 
        VALUES ($1, $2, $3, $4, COALESCE($5, 'PENDENTE')) 
        RETURNING *`, // Retorna todos os campos do novo pedido
        [numero_pedido, cliente_id, valor_total, endereco_cliente, status]
    );
    return result.rows[0];
};

module.exports = { getPedidos, getPedidoById, deletePedido, updatePedido, createPedido };