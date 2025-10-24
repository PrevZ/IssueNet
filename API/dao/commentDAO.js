// Importa il servizio database
const db = require('../services/database');

// Trova commenti con filtri dinamici basati sui parametri della query
const getAllComments = async function (connection, reqQuery) {
    sql = "SELECT * FROM comments";
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

// Trova un commento specifico tramite il suo ID
const getCommentById = async function (connection, commentId) {
    sql = "SELECT * FROM comments WHERE id_comment = ?";
    params = [commentId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova tutti i commenti di una issue specifica
const getCommentsByIssue = async function (connection, issueId) {
    sql = "SELECT * FROM comments WHERE id_issue = ? ORDER BY created_at ASC";
    params = [issueId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova tutti i commenti creati da un utente specifico
const getCommentsByUser = async function (connection, userId) {
    sql = "SELECT * FROM comments WHERE id_user = ? ORDER BY created_at DESC";
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Crea un nuovo commento nel database
const createComment = async function (connection, comment) {
    sql = `INSERT INTO comments (id_issue, id_user, content)
    VALUES (?, ?, ?)`;
    params = [comment.id_issue, comment.id_user, comment.content];

    const result = await db.execute(connection, sql, params);
    if (result.affectedRows == 0) return null;

    // Recupera il commento appena creato con tutti i campi (id_comment, created_at, updated_at)
    const newCommentId = result.insertId;
    const createdComment = await getCommentById(connection, newCommentId);
    return createdComment.length > 0 ? createdComment[0] : null;
}

// Aggiorna il contenuto di un commento esistente
const updateComment = async function (connection, commentId, content) {
    sql = `UPDATE comments SET content = ? WHERE id_comment = ?`;
    params = [content, commentId];

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Elimina un commento dal database
const deleteComment = async function (connection, commentId) {
    sql = `DELETE FROM comments WHERE id_comment = ?`;
    params = [commentId];

    const result = await db.execute(connection, sql, params);
    return (result && result.affectedRows > 0);
}

// Conta il numero di commenti di una issue
const countCommentsByIssue = async function (connection, issueId) {
    sql = "SELECT COUNT(*) as comment_count FROM comments WHERE id_issue = ?";
    params = [issueId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Esporta tutte le funzioni per usarle nelle route
module.exports = {
    getAllComments, getCommentById, getCommentsByIssue, 
    getCommentsByUser, createComment, updateComment, 
    deleteComment, countCommentsByIssue
}
