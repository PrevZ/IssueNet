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

// POST /api/users/register - Registra un nuovo utente
router.post('/register', async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const { username, email, password, full_name, role } = req.body;
        
        // Validazione input
        if (!username || !email || !password || !full_name) {
            return res.status(400).json({ 
                error: 'Username, email, password e full_name sono obbligatori' 
            });
        }

        // Verifica che username non sia già in uso
        const existingUserByUsername = await userDAO.getUserByUsername(connection, username);
        if (existingUserByUsername.length > 0) {
            return res.status(409).json({ error: 'Username già presente' });
        }

        // Verifica che email non sia già in uso
        const existingUserByEmail = await userDAO.getUserByEmail(connection, email);
        if (existingUserByEmail.length > 0) {
            return res.status(409).json({ error: 'Email presente' });
        }

        // Crea il nuovo utente
        const userData = {
            username,
            email,
            password, // In produzione, dovresti hashare la password
            full_name,
            role: role || 'developer' // Default role
        };

        const newUser = await userDAO.createUser(connection, userData);
        if (newUser != null) {
            // Rimuovo la password dalla risposta
            const userResponse = { ...newUser };
            delete userResponse.password;
            
            await connection.commit();
            res.status(201).json({
                user: userResponse,
                message: 'Registrazione completata con successo'
            });
        } else {
            await connection.rollback();
            res.status(500).json({ error: 'Errore durante la creazione dell\'utente' });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        await connection.rollback();
        
        // Gestione errori specifici del database
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username o email già esistenti' });
        }
        
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// POST /api/users/login - Autentica un utente
router.post('/login', async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password sono obbligatori' });
        }
        
        // Trova l'utente per username
        const users = await userDAO.getUserByUsername(connection, username);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }
        
        const user = users[0];
        
        // Verifica la password (in produzione dovresti usare hashing)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }
        
        // Login riuscito - rimuovi la password dalla risposta
        const userResponse = { ...user };
        delete userResponse.password;
        
        res.json({
            user: userResponse,
            token: 'dummy-jwt-token', // In produzione, genera un vero JWT
            message: 'Login effettuato con successo'
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// Esporta il router 
module.exports = router;