// Importa le dipendenze necessarie
const express = require('express');
const db = require('../services/database');
const userDAO = require('../dao/userDAO');

const router = express.Router();

// GET /api/users - Ottiene tutti gli utenti con filtri opzionali
router.get('/', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getAllUsers(connection, req.query);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/users/role/:role - Trova utenti per ruolo specifico (admin/developer/tester)
router.get('/role/:role', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getUsersByRole(connection, req.params.role);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users by role:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/users/username/:username - Trova utente tramite username (utile per login)
router.get('/username/:username', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getUserByUsername(connection, req.params.username);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error("Error fetching user by username:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/users/email/:email - Trova utente tramite email
router.get('/email/:email', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getUserByEmail(connection, req.params.email);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/users/check/username/:username - Verifica se username è già in uso
router.get('/check/username/:username', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getUserByUsername(connection, req.params.username);
        res.json({
            username: req.params.username,
            available: users.length === 0
        });
    } catch (error) {
        console.error("Error checking username:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/users/check/email/:email - Verifica se email è già in uso
router.get('/check/email/:email', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getUserByEmail(connection, req.params.email);
        res.json({
            email: req.params.email,
            available: users.length === 0
        });
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/users/:id - Ottiene un utente specifico tramite ID
router.get('/:id', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const users = await userDAO.getUserById(connection, req.params.id);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// POST /api/users - Crea un nuovo utente
router.post('/', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const newUser = await userDAO.createUser(connection, req.body);
        if (newUser != null) {
            res.status(201).json(newUser);
        } else {
            res.status(500);
        }
        await connection.commit();
    } catch (error) {
        console.error("Error creating user:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/users/:id - Aggiorna un utente esistente
router.put('/:id', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const updatedUser = req.body;
        const result = await userDAO.updateUser(connection, req.params.id, updatedUser);
        if (result) {
            res.status(200).json({ message: 'Contatto aggiornato con successo', user: updatedUser });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error updating user:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// DELETE /api/users/:id - Elimina un utente
router.delete('/:id', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const deletedUser = await userDAO.deleteUser(connection, req.params.id);
        if (deletedUser) {
            res.status(200).json({ message: 'Contatto eliminato con successo' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error deleting user:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// Esporta il router 
module.exports = router;