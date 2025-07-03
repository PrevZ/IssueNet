// Importa il servizio database
const db = require('../services/database');

// Trova utenti con filtri dinamici basati sui parametri della query
const getAllUsers = async function (connection, reqQuery) {
    sql = "SELECT * FROM users";
    params = [];

    queryKeys = Object.keys(reqQuery);
    for (i = 0; i < queryKeys.length; i++) {
        sql += (i == 0) ? " WHERE " : " AND ";
        sql += queryKeys[i] + " = ?";
        params.push(reqQuery[queryKeys[i]]);
    }

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova un utente specifico tramite il suo ID
const getUserById = async function (connection, userId) {
    sql = "SELECT * FROM users WHERE id_user = ?";
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova un utente tramite username (utile per il login)
const getUserByUsername = async function (connection, username) {
    sql = "SELECT * FROM users WHERE username = ?";
    params = [username];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova un utente tramite email
const getUserByEmail = async function (connection, email) {
    sql = "SELECT * FROM users WHERE email = ?";
    params = [email];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova tutti gli utenti che hanno un ruolo specifico
const getUsersByRole = async function (connection, role) {
    sql = "SELECT * FROM users WHERE role = ?";
    params = [role];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Crea un nuovo utente nel database
const createUser = async function (connection, user) {
    sql = `INSERT INTO users (username, email, password, full_name, role) 
    VALUES (?, ?, ?, ?, ?)`;
    params = [user.username, user.email, user.password, user.full_name, user.role || 'developer'];

    const result = await db.execute(connection, sql, params);
    if (result.affectedRows == 0) return null;
    else return user;
}

// Aggiorna i dati di un utente esistente
const updateUser = async function (connection, userId, user) {
    sql = `UPDATE users SET `;
    params = [];

    updateKeys = Object.keys(user);
    for (i = 0; i < updateKeys.length; i++) {
        sql += (i == 0) ? "" : ", ";
        sql += updateKeys[i] + " = ?";
        params.push(user[updateKeys[i]]);
    }

    sql += " WHERE id_user = ?";
    params.push(userId);

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Elimina un utente dal database
const deleteUser = async function (connection, userId) {
    sql = `DELETE FROM users WHERE id_user = ?`;
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows[0]);
}

// Esporta tutte le funzioni per usarle nelle route
module.exports = {
    getAllUsers, getUserById, getUserByUsername,
    getUserByEmail, getUsersByRole, createUser,
    updateUser, deleteUser
}