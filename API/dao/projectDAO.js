// Importa il servizio database
const db = require('../services/database');

// Trova progetti con filtri dinamici basati sui parametri della query
const getAllProjects = async function (connection, reqQuery) {
    sql = `SELECT * FROM projects`;
    params = [];

    queryKeys = Object.keys(reqQuery);
    for (i = 0; i < queryKeys.length; i++) {
        sql += (i == 0) ? "WHERE " : " AND ";
        sql += queryKeys[i] + " = ?";
        params.push(reqQuery[queryKeys[i]]);
    }

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova un progetto specifico tramite il suo ID
const getProjectById = async function (connection, projectId) {
    sql = `SELECT * FROM projects WHERE id_project = ?`;
    params = [projectId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova tutti i progetti creati da un utente specifico
const getProjectsByCreator = async function (connection, userId) {
    sql = "SELECT * FROM projects WHERE created_by = ?";
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Trova progetti filtrati per status (active/archived)
const getProjectsByStatus = async function (connection, status) {
    sql = `SELECT * FROM projects WHERE status = ?`;
    params = [status];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Crea un nuovo progetto nel database
const createProject = async function (connection, project) {
    sql = `INSERT INTO projects (name, description, created_by, status) 
    VALUES (?, ?, ?, ?)`;
    params = [project.name, project.description, project.created_by, project.status || 'active'];

    const result = await db.execute(connection, sql, params);
    if (result.affectedRows == 0) return null;
    else return project;
}

// Aggiorna i dati di un progetto esistente
const updateProject = async function (connection, projectId, project) {
    sql = `UPDATE projects SET `;
    params = [];

    updateKeys = Object.keys(project);
    for (i = 0; i < updateKeys.length; i++) {
        sql += (i == 0) ? "" : ", ";
        sql += updateKeys[i] + " = ?";
        params.push(project[updateKeys[i]]);
    }

    sql += " WHERE id_project = ?";
    params.push(projectId);

    const result = await db.execute(connection, sql, params);
    return (result.affectedRows > 0);
}

// Elimina un progetto dal database
const deleteProject = async function (connection, projectId) {
    sql = `DELETE FROM projects WHERE id_project = ?`;
    params = [projectId];

    const result = await db.execute(connection, sql, params);
    return result.affectedRows > 0;
}

// Ottiene statistiche di un progetto (conta le issue per status)
const getProjectStats = async function (connection, projectId) {
    sql = `SELECT 
           COUNT(*) as total_issues,
           COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_issues,
           COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_issues,
           COUNT(CASE WHEN status = 'in_review' THEN 1 END) as in_review_issues,
           COUNT(CASE WHEN status = 'done' THEN 1 END) as done_issues
           FROM issues WHERE id_project = ?`;
    params = [projectId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Ottiene progetti con statistiche integrate
const getEnhancedProjectsByUser = async function (connection, userId) {
    sql = `SELECT 
           p.id_project,
           p.name,
           p.description,
           p.created_by,
           p.status,
           p.created_at,
           p.updated_at,
           COUNT(i.id_issue) as total_issues,
           COUNT(CASE WHEN i.status = 'todo' THEN 1 END) as todo_issues,
           COUNT(CASE WHEN i.status = 'in_progress' THEN 1 END) as in_progress_issues,
           COUNT(CASE WHEN i.status = 'in_review' THEN 1 END) as in_review_issues,
           COUNT(CASE WHEN i.status = 'done' THEN 1 END) as done_issues
           FROM projects p
           LEFT JOIN issues i ON p.id_project = i.id_project
           WHERE p.created_by = ?
           GROUP BY p.id_project, p.name, p.description, p.created_by, p.status, p.created_at, p.updated_at`;
    params = [userId];

    const rows = await db.execute(connection, sql, params);
    return (!rows ? [] : rows);
}

// Esporta tutte le funzioni per usarle nelle route
module.exports = {
    getAllProjects, getProjectById, getProjectsByCreator,
    getProjectsByStatus, createProject, updateProject,
    deleteProject, getProjectStats, getEnhancedProjectsByUser
}