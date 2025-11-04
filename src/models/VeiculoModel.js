const pool = require("../config/database");

// Buscar todos os veículos
const getVeiculos = async () => {
    const result = await pool.query(
        "SELECT * FROM veiculos" // Tabela 'veiculos', sem filtro de 'funcao'
    );
    return result.rows;
};

// Buscar veículo por ID
const getVeiculoById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM veiculos WHERE id = $1", // Tabela 'veiculos', sem filtro de 'funcao'
        [id]
    );
    return result.rows[0];
};

// Deletar veículo
const deleteVeiculo = async (id) => {
    const result = await pool.query(
        "DELETE FROM veiculos WHERE id = $1 RETURNING *", // Tabela 'veiculos', sem filtro de 'funcao'
        [id]
    );

    if (result.rowCount === 0) {
        return { error: "Veículo não encontrado." }; // Mensagem atualizada
    }
    return { message: "Veículo deletado com sucesso." }; // Mensagem atualizada
};

// Atualizar veículo
const updateVeiculo = async (id, data) => {
    const { 
        motorista_id, 
        placa, 
        modelo, 
        marca,
        ano 
    } = data; // Campos da tabela 'veiculos'
    
    const result = await pool.query(
        `UPDATE veiculos SET 
            motorista_id = $1, 
            placa = $2, 
            modelo = $3, 
            marca = $4, 
            ano = $5
        WHERE id = $6 
        RETURNING *`, // Query atualizada para 'veiculos'
        [motorista_id, placa, modelo, marca, ano, id] // Parâmetros atualizados
    );
    return result.rows[0];
};

// Criar novo veículo
const createVeiculo = async (motorista_id, placa, modelo, marca, ano) => { // Argumentos atualizados
    const result = await pool.query(
        `INSERT INTO veiculos 
        (motorista_id, placa, modelo, marca, ano) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`, // Query atualizada para 'veiculos'
        [motorista_id, placa, modelo, marca, ano] // Parâmetros atualizados
    );
    return result.rows[0];
};

module.exports = { 
    getVeiculos, 
    getVeiculoById, 
    deleteVeiculo, 
    updateVeiculo, 
    createVeiculo 
};