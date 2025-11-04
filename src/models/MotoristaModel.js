const pool = require("../config/database");

// Buscar todos os motoristas
const getMotoristas = async () => {
    const result = await pool.query(
        "SELECT id, nome, email, telefone, funcao, criado_em FROM usuarios WHERE funcao = 'MOTORISTA'"
    );
    return result.rows;
};

// Buscar motorista por ID
const getMotoristaById = async (id) => {
    const result = await pool.query(
        "SELECT id, nome, email, telefone, funcao, criado_em FROM usuarios WHERE id = $1 AND funcao = 'MOTORISTA'", 
        [id]
    );
    return result.rows[0];
};

// Deletar motorista
const deleteMotorista = async (id) => {
    const result = await pool.query(
        "DELETE FROM usuarios WHERE id = $1 AND funcao = 'MOTORISTA' RETURNING *", 
        [id]
    );

    if (result.rowCount === 0) {
        return { error: "Motorista não encontrado." };
    }
    return { message: "Motorista deletado com sucesso." };
};

// Atualizar motorista
const updateMotorista = async (id, data) => {
    const { 
        nome, 
        email, 
        telefone, 
        senha 
    } = data;
    
    const result = await pool.query(
        `UPDATE usuarios SET 
            nome = $1, 
            email = $2, 
            telefone = $3, 
            senha = $4, 
            funcao = 'MOTORISTA'
        WHERE id = $5 AND funcao = 'MOTORISTA' 
        RETURNING id, nome, email, telefone, funcao, criado_em`, 
        [nome, email, telefone, senha, id]
    );
    return result.rows[0];
};

// Criar novo motorista
const createMotorista = async (nome, email, telefone, senha) => {
    const result = await pool.query(
        `INSERT INTO usuarios 
        (nome, email, telefone, senha, funcao) 
        VALUES ($1, $2, $3, $4, 'MOTORISTA') 
        RETURNING id, nome, email, telefone, funcao, criado_em`, 
        [nome, email, telefone, senha]
    );
    return result.rows[0];
};

module.exports = { getMotoristas, getMotoristaById, deleteMotorista, updateMotorista, createMotorista };