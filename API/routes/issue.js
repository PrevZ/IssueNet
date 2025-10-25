// Importa le dipendenze necessarie
const express = require('express');
const db = require('../services/database');
const issueDAO = require('../dao/issueDAO');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/issues - Ottiene tutte le issue con filtri opzionali (solo utenti autenticati)
router.get('/', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const issues = await issueDAO.getAllIssues(connection, req.query);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/my/:userId - Ottiene le issue assegnate a un utente (utente stesso o admin)
router.get('/my/:userId', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo l'utente stesso o admin possono vedere le proprie issue
        const requestedUserId = parseInt(req.params.userId);
        if (req.user.role !== 'admin' && req.user.userId !== requestedUserId) {
            return res.status(403).json({ error: 'Non autorizzato ad accedere alle issue di questo utente' });
        }

        const issues = await issueDAO.getIssuesByAssignee(connection, req.params.userId);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching user issues:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/project/:projectId - Ottiene tutte le issue di un progetto (solo utenti autenticati)
router.get('/project/:projectId', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const issues = await issueDAO.getIssuesByProject(connection, req.params.projectId);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching project issues:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/project/:projectId/kanban - Ottiene issue organizzate per Kanban board (solo utenti autenticati)
router.get('/project/:projectId/kanban', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const kanban = {
            todo: await issueDAO.getAllIssues(connection, { id_project: req.params.projectId, status: 'todo' }),
            in_progress: await issueDAO.getAllIssues(connection, { id_project: req.params.projectId, status: 'in_progress' }),
            in_review: await issueDAO.getAllIssues(connection, { id_project: req.params.projectId, status: 'in_review' }),
            done: await issueDAO.getAllIssues(connection, { id_project: req.params.projectId, status: 'done' })
        };
        res.json(kanban);
    } catch (error) {
        console.error("Error fetching kanban data:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/priority/:priority - Filtra issue per priorità (solo utenti autenticati)
router.get('/priority/:priority', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const issues = await issueDAO.getIssuesByPriority(connection, req.params.priority);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching issues by priority:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/type/:type - Filtra issue per tipo (solo utenti autenticati)
router.get('/type/:type', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const issues = await issueDAO.getIssuesByType(connection, req.params.type);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching issues by type:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/status/:status - Filtra issue per status (solo utenti autenticati)
router.get('/status/:status', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const issues = await issueDAO.getIssuesByStatus(connection, req.params.status);
        res.json(issues);
    } catch (error) {
        console.error("Error fetching issues by status:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/issues/:id - Ottiene una issue specifica tramite ID (solo utenti autenticati)
router.get('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const issues = await issueDAO.getIssueById(connection, req.params.id);
        if (issues.length === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        res.json(issues[0]);
    } catch (error) {
        console.error("Error fetching issue:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// POST /api/issues - Crea una nuova issue (solo developer/project_manager)
router.post('/', authenticateToken, requireRole(['developer', 'project_manager']), async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const newIssue = await issueDAO.createIssue(connection, req.body);
        if (newIssue != null) {
            res.status(201).json(newIssue);
        } else {
            res.status(500).json({ error: 'Failed to create issue' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error creating issue:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/issues/:id - Aggiorna una issue esistente (solo assegnatario, creatore o project_manager)
router.put('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo assegnatario, creatore o project_manager possono modificare
        const issueResult = await issueDAO.getIssueById(connection, req.params.id);
        if (issueResult.length === 0) {
            return res.status(404).json({ error: 'Issue non trovata' });
        }

        const issue = issueResult[0];
        const canModify = req.user.role === 'project_manager' ||
                         req.user.role === 'developer' ||
                         req.user.userId === issue.created_by ||
                         req.user.userId === issue.assigned_to;

        if (!canModify) {
            return res.status(403).json({ error: 'Non autorizzato a modificare questa issue' });
        }

        const updatedIssue = req.body;
        const result = await issueDAO.updateIssue(connection, req.params.id, updatedIssue);
        if (result) {
            res.status(200).json({ message: 'Issue aggiornata con successo', issue: updatedIssue });
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error updating issue:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// DELETE /api/issues/:id - Elimina una issue (solo project_manager e developer)
router.delete('/:id', authenticateToken, requireRole(['project_manager', 'developer']), async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const deleted = await issueDAO.deleteIssue(connection, req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'Issue eliminata con successo' });
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error deleting issue:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/issues/:id/assign - Assegna una issue a un utente specifico
router.put('/:id/assign', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const success = await issueDAO.assignIssue(connection, req.params.id, req.body.userId);
        if (success) {
            res.json({ success: true, message: 'Issue assegnata con successo' });
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error assigning issue:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/issues/:id/status - Cambia lo status di una issue
router.put('/:id/status', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const success = await issueDAO.updateIssueStatus(connection, req.params.id, req.body.status);
        if (success) {
            res.json({ success: true, message: 'Status aggiornato con successo' });
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error updating status:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/issues/:id/hours - Aggiorna le ore effettive di una issue
router.put('/:id/hours', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const success = await issueDAO.updateActualHours(connection, req.params.id, req.body.hours);
        if (success) {
            res.json({ success: true, message: 'Ore aggiornate con successo' });
        } else {
            res.status(404).json({ error: 'Issue not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error updating hours:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// Esporta il router per usarlo in altre parti dell'applicazione
module.exports = router;
