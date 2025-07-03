// Importa il servizio database
const db = require('../services/database');

// Trova issue con filtri dinamici basati sui parametri della query
const getAllIssues = async function (connection, reqQuery) {
    sql = "SELECT * FROM issues";
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

// Trova una issue specifica tramite il suo ID
const getIssueById = async function (connection, issueId) {
    sql = "SELECT * FROM issues WHERE id_issue = ?";
    params = [issueId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova tutte le issue di un progetto specifico
const getIssuesByProject = async function (connection, projectId) {
    sql = "SELECT * FROM issues WHERE id_project = ?";
    params = [projectId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova issue assegnate a un utente specifico
const getIssuesByAssignee = async function (connection, userId) {
    sql = "SELECT * FROM issues WHERE assigned_to = ?";
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova issue create da un utente specifico
const getIssuesByCreator = async function (connection, userId) {
    sql = "SELECT * FROM issues WHERE created_by = ?";
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova issue filtrate per status (todo/in_progress/in_review/done)
const getIssuesByStatus = async function (connection, status) {
    sql = "SELECT * FROM issues WHERE status = ?";
    params = [status];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova issue filtrate per priorità (low/medium/high/critical)
const getIssuesByPriority = async function (connection, priority) {
    sql = "SELECT * FROM issues WHERE priority = ?";
    params = [priority];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova issue filtrate per tipo (bug/feature/task/improvement)
const getIssuesByType = async function (connection, type) {
    sql = "SELECT * FROM issues WHERE type = ?";
    params = [type];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Crea una nuova issue nel database
const createIssue = async function (connection, issue) {
    sql = `INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    params = [
        issue.title, 
        issue.description, 
        issue.priority || 'medium', 
        issue.status || 'todo', 
        issue.type || 'bug',
        issue.id_project, 
        issue.assigned_to || null, 
        issue.created_by, 
        issue.estimated_hours || null, 
        issue.actual_hours || null, 
        issue.due_date || null
    ];

    const result = await db.execute(connection, sql, params);
    if (result.affectedRows == 0) return null;
    else return issue;
}

// Aggiorna i dati di una issue esistente
const updateIssue = async function (connection, issueId, issue) {
    sql = `UPDATE issues SET `;
    params = [];

    updateKeys = Object.keys(issue);
    for (i = 0; i < updateKeys.length; i++) {
        sql += (i == 0) ? "" : ", ";
        sql += updateKeys[i] + " = ?";
        params.push(issue[updateKeys[i]]);
    }

    sql += " WHERE id_issue = ?";
    params.push(issueId);

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Elimina una issue dal database
const deleteIssue = async function (connection, issueId) {
    sql = `DELETE FROM issues WHERE id_issue = ?`;
    params = [issueId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows[0]);
}

// Assegna una issue a un utente specifico
const assignIssue = async function (connection, issueId, userId) {
    sql = `UPDATE issues SET assigned_to = ? WHERE id_issue = ?`;
    params = [userId, issueId];

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Cambia lo status di una issue
const updateIssueStatus = async function (connection, issueId, status) {
    sql = `UPDATE issues SET status = ? WHERE id_issue = ?`;
    params = [status, issueId];

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Aggiorna le ore effettive di una issue
const updateActualHours = async function (connection, issueId, hours) {
    sql = `UPDATE issues SET actual_hours = ? WHERE id_issue = ?`;
    params = [hours, issueId];

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Esporta tutte le funzioni per usarle nelle route
module.exports = {
    getAllIssues, getIssueById, getIssuesByProject, getIssuesByAssignee,
    getIssuesByCreator, getIssuesByStatus, getIssuesByPriority, getIssuesByType,
    createIssue, updateIssue, deleteIssue, assignIssue,
    updateIssueStatus, updateActualHours
}
