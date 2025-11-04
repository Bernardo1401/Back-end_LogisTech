const pool = require("../config/database");

const getUsers = async () => {
    const result = await pool.query("SELECT id, nome, email, telefone, funcao, criado_em FROM usuarios");
    return result.rows;
};

const getUserById = async (id) => {
    const result = await pool.query("SELECT id, nome, email, telefone, funcao, criado_em FROM usuarios WHERE id = $1", [id]);
    return result.rows[0];
};

const deleteUser = async (id) => {
    const result = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
        return { error: "Usuário não encontrado." };
    }
    return { message: "Usuário deletado com sucesso." };
};

const updateUser = async (id, data) => {
    const { 
        nome, 
        email, 
        telefone, 
        senha, 
        funcao 
    } = data;
    
    const result = await pool.query(
        `UPDATE usuarios SET 
            nome = $1, 
            email = $2, 
            telefone = $3, 
            senha = $4, 
            funcao = $5 
        WHERE id = $6 RETURNING id, nome, email, telefone, funcao, criado_em`, 
        [nome, email, telefone, senha, funcao, id]
    );
    return result.rows[0];
};

const createUser = async (nome, email, telefone, senha, funcao) => {
    const result = await pool.query(
        `INSERT INTO usuarios 
        (nome, email, telefone, senha, funcao) 
        VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, telefone, funcao, criado_em`, 
        [nome, email, telefone, senha, funcao]
    );
    return result.rows[0];
};

module.exports = { getUsers, getUserById, deleteUser, updateUser, createUser };