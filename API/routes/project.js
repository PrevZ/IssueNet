// Importa le dipendenze necessarie
const express = require('express');
const db = require('../services/database');
const projectDAO = require('../dao/projectDAO');

const router = express.Router();

// GET /api/projects - Ottiene tutti i progetti con filtri opzionali
router.get('/', async (req, res) => {
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

// GET /api/projects/user/:userId - Trova progetti creati da un utente specifico
router.get('/user/:userId', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const projects = await projectDAO.getProjectsByCreator(connection, req.params.userId);
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects by creator:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/projects/status/:status - Trova progetti per status (active/archived)
router.get('/status/:status', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const projects = await projectDAO.getProjectsByStatus(connection, req.params.status);
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects by status:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/projects/:id/stats - Ottiene statistiche di un progetto (numero di issue per priorità/status)
router.get('/:id/stats', async (req, res) => {
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

// GET /api/projects/:id - Ottiene un progetto specifico tramite ID
router.get('/:id', async (req, res) => {
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

// POST /api/projects - Crea un nuovo progetto
router.post('/', async (req, res) => {
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

// PUT /api/projects/:id - Aggiorna un progetto esistente
router.put('/:id', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
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

// DELETE /api/projects/:id - Elimina un progetto
router.delete('/:id', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const deletedProject = await projectDAO.deleteProject(connection, req.params.id);
        if (deletedProject) {
            res.status(200).json({ message: 'Progetto eliminato con successo' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
        await connection.commit();
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
