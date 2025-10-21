// Importa le dipendenze necessarie
const express = require('express');
const db = require('../services/database');
const projectDAO = require('../dao/projectDAO');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects - Ottiene tutti i progetti con filtri opzionali (solo utenti autenticati)
router.get('/', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const projects = await projectDAO.getAllProjects(connection, req.query);
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/projects/user/:userId - Trova progetti creati da un utente specifico (utente stesso o project_manager)
router.get('/user/:userId', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo l'utente stesso o project_manager possono vedere i propri progetti
        const requestedUserId = parseInt(req.params.userId);
        if (req.user.role !== 'project_manager' && req.user.userId !== requestedUserId) {
            return res.status(403).json({ error: 'Non autorizzato ad accedere ai progetti di questo utente' });
        }

        const projects = await projectDAO.getProjectsByCreator(connection, req.params.userId);
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects by creator:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/projects/user/:userId/enhanced - Ottiene progetti con statistiche integrate (utente stesso o project_manager)
router.get('/user/:userId/enhanced', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo l'utente stesso o project_manager
        const requestedUserId = parseInt(req.params.userId);
        if (req.user.role !== 'project_manager' && req.user.userId !== requestedUserId) {
            return res.status(403).json({ error: 'Non autorizzato ad accedere ai progetti di questo utente' });
        }

        const projects = await projectDAO.getEnhancedProjectsByUser(connection, req.params.userId);
        res.json(projects);
    } catch (error) {
        console.error("Error fetching enhanced projects:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/projects/:id/stats - Ottiene statistiche di un progetto (solo utenti autenticati)
router.get('/:id/stats', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const stats = await projectDAO.getProjectStats(connection, req.params.id);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching project stats:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/projects/:id - Ottiene un progetto specifico tramite ID (solo utenti autenticati)
router.get('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const projects = await projectDAO.getProjectById(connection, req.params.id);
        if (projects.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(projects[0]);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// POST /api/projects - Crea un nuovo progetto (solo project_manager)
router.post('/', authenticateToken, requireRole(['project_manager']), async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const newProject = await projectDAO.createProject(connection, req.body);
        if (newProject != null) {
            res.status(201).json(newProject);
        } else {
            res.status(500).json({ error: 'Failed to create project' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error creating project:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/projects/:id - Aggiorna un progetto esistente (solo project_manager )
router.put('/:id', authenticateToken, requireRole(['project_manager']), async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo project_manager
        const projectResult = await projectDAO.getProjectById(connection, req.params.id);
        if (projectResult.length === 0) {
            return res.status(404).json({ error: 'Progetto non trovato' });
        }

        const project = projectResult[0];
        if (req.user.role !== 'project_manager') {
            return res.status(403).json({ error: 'Non autorizzato a modificare questo progetto' });
        }

        const updatedProject = req.body;
        const result = await projectDAO.updateProject(connection, req.params.id, updatedProject);
        if (result) {
            res.status(200).json({ message: 'Progetto aggiornato con successo', project: updatedProject });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error updating project:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// DELETE /api/projects/:id - Elimina un progetto (solo project_manager)
router.delete('/:id', authenticateToken, requireRole(['project_manager']), async (req, res) => {
    const projectId = parseInt(req.params.id);
    
    // Validazione dell'ID
    if (isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({ error: 'ID progetto non valido' });
    }
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const deletedProject = await projectDAO.deleteProject(connection, projectId);
        if (deletedProject) {
            await connection.commit();
            res.status(200).json({ message: 'Progetto eliminato con successo' });
        } else {
            await connection.rollback();
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});



// Esporta il router 
module.exports = router;
