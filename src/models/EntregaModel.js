const pool = require("../config/database");

// Buscar todas as entregas
const getEntregas = async () => {
    const result = await pool.query(
        "SELECT * FROM entregas"
    );
    return result.rows;
};

// Buscar entrega por ID
const getEntregaById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM entregas WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

// Deletar entrega
const deleteEntrega = async (id) => {
    const result = await pool.query(
        "DELETE FROM entregas WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rowCount === 0) {
        return { error: "Entrega não encontrada." };
    }
    return { message: "Entrega deletada com sucesso." };
};

// Atualizar entrega (Padrão PUT - atualiza todos os campos)
const updateEntrega = async (id, data) => {
    const {
        pedido_id,
        motorista_id,
        veiculo_id,
        comprovante,
        status,
        atribuido_em,
        entregue_em
    } = data;
   
    const result = await pool.query(
        `UPDATE entregas SET
            pedido_id = $1,
            motorista_id = $2,
            veiculo_id = $3,
            comprovante = $4,
            status = $5,
            atribuido_em = $6,
            entregue_em = $7
        WHERE id = $8
        RETURNING *`,
        [pedido_id, motorista_id, veiculo_id, comprovante, status, atribuido_em, entregue_em, id]
    );
    return result.rows[0];
};

// Criar nova entrega (Padrão de argumentos explícitos, hardcodando o status PENDENTE)
const createEntrega = async (
    pedido_id, 
    motorista_id, 
    veiculo_id, 
    comprovante, 
    atribuido_em, 
    entregue_em
) => {
    const result = await pool.query(
        `INSERT INTO entregas
        (pedido_id, motorista_id, veiculo_id, comprovante, atribuido_em, entregue_em, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'PENDENTE')
        RETURNING *`,
        [pedido_id, motorista_id, veiculo_id, comprovante, atribuido_em, entregue_em]
    );
    return result.rows[0];
};

module.exports = { 
    getEntregas, 
    getEntregaById, 
    deleteEntrega, 
    updateEntrega, 
    createEntrega 
};