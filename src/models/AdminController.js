const pool = require("../config/database");

// Buscar todos os administradores
const getAdmins = async () => {
    const result = await pool.query(
        "SELECT id, nome, email, telefone, funcao, criado_em FROM usuarios WHERE funcao = 'ADMIN'"
    );
    return result.rows;
};

// Buscar administrador por ID
const getAdminById = async (id) => {
    const result = await pool.query(
        "SELECT id, nome, email, telefone, funcao, criado_em FROM usuarios WHERE id = $1 AND funcao = 'ADMIN'", 
        [id]
    );
    return result.rows[0];
};

// Deletar administrador
const deleteAdmin = async (id) => {
    const result = await pool.query(
        "DELETE FROM usuarios WHERE id = $1 AND funcao = 'ADMIN' RETURNING *", 
        [id]
    );

    if (result.rowCount === 0) {
        return { error: "Administrador não encontrado." };
    }
    return { message: "Administrador deletado com sucesso." };
};

// Atualizar administrador
const updateAdmin = async (id, data) => {
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
            funcao = 'ADMIN'
        WHERE id = $5 AND funcao = 'ADMIN' 
        RETURNING id, nome, email, telefone, funcao, criado_em`, 
        [nome, email, telefone, senha, id]
    );
    return result.rows[0];
};

// Criar novo administrador
const createAdmin = async (nome, email, telefone, senha) => {
    const result = await pool.query(
        `INSERT INTO usuarios 
        (nome, email, telefone, senha, funcao) 
        VALUES ($1, $2, $3, $4, 'ADMIN') 
        RETURNING id, nome, email, telefone, funcao, criado_em`, 
        [nome, email, telefone, senha]
    );
    return result.rows[0];
};

module.exports = { getAdmins, getAdminById, deleteAdmin, updateAdmin, createAdmin };