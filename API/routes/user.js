// Importa le dipendenze necessarie
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../services/database');
const userDAO = require('../dao/userDAO');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configurazione per bcrypt e JWT
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// GET /api/users - Ottiene tutti gli utenti con filtri opzionali (solo admin)
router.get('/', authenticateToken, async (req, res) => {
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

// GET /api/users/:id - Ottiene un utente specifico tramite ID (utente stesso o admin)
router.get('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica che l'utente possa accedere ai dati (se stesso o admin)
        const requestedId = parseInt(req.params.id);
        if (req.user.role !== 'admin' && req.user.userId !== requestedId) {
            return res.status(403).json({ error: 'Non autorizzato ad accedere a questi dati' });
        }

        const users = await userDAO.getUserById(connection, req.params.id);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Rimuovi la password dalla risposta
        const userResponse = { ...users[0] };
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/users/:id - Aggiorna un utente esistente (utente stesso o admin)
router.put('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica che l'utente possa modificare i dati (se stesso o admin)
        const targetId = parseInt(req.params.id);
        if (req.user.role !== 'admin' && req.user.userId !== targetId) {
            return res.status(403).json({ error: 'Non autorizzato a modificare questi dati' });
        }

        const updatedUserData = req.body;
        const result = await userDAO.updateUser(connection, req.params.id, updatedUserData);
        if (result) {
            // Recupera l'utente aggiornato dal database per restituire tutti i campi
            const updatedUsers = await userDAO.getUserById(connection, req.params.id);
            console.log('Backend: getUserById result:', updatedUsers);
            if (updatedUsers.length > 0) {
                const completeUser = updatedUsers[0];
                // Rimuovi la password dalla risposta
                delete completeUser.password;
                console.log('Backend: sending user response:', completeUser);
                res.status(200).json(completeUser);
            } else {
                res.status(404).json({ error: 'User not found after update' });
            }
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

// DELETE /api/users/:id - Elimina un utente (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
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

// POST /api/users - Crea un nuovo utente (solo per admin)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
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
            return res.status(409).json({ error: 'Email già presente' });
        }

        // Hash della password prima di creare l'utente
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Crea il nuovo utente
        const userData = {
            username,
            email,
            password: hashedPassword,
            full_name,
            role: role || 'developer' // Default role
        };

        const newUser = await userDAO.createUser(connection, userData);
        if (newUser != null) {
            // Rimuovo la password dalla risposta
            const userResponse = { ...newUser };
            delete userResponse.password;
            
            await connection.commit();
            res.status(201).json(userResponse);
        } else {
            await connection.rollback();
            res.status(500).json({ error: 'Errore durante la creazione dell\'utente' });
        }
    } catch (error) {
        console.error("Error creating user:", error);
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

        // Hash della password prima di creare l'utente
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Crea il nuovo utente
        const userData = {
            username,
            email,
            password: hashedPassword,
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
    await connection.beginTransaction();
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
        let isPasswordValid = false;

        // Controlla se la password è già hashata (inizia con $2b$ per bcrypt)
        if (user.password.startsWith('$2b$')) {
            // Password già hashata - usa bcrypt per confrontare
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Password in chiaro - confronto diretto e migrazione immediata
            isPasswordValid = (user.password === password);

            if (isPasswordValid) {
                // Migra la password hashando quella corrente
                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                await userDAO.updateUser(connection, user.id_user, {
                    password: hashedPassword
                });
                console.log(`Password migrata per utente: ${username}`);
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        // Genera JWT token
        const token = jwt.sign(
            {
                userId: user.id_user,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Login riuscito - rimuovi la password dalla risposta
        const userResponse = { ...user };
        delete userResponse.password;

        await connection.commit();

        res.json({
            user: userResponse,
            token: token,
            message: 'Login effettuato con successo'
        });
    } catch (error) {
        console.error("Error during login:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// POST /api/users/:id/change-password - Cambia la password di un utente (utente stesso o admin)
router.post('/:id/change-password', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;

        // Verifica che l'utente possa cambiare la password (se stesso o admin)
        const targetId = parseInt(userId);
        if (req.user.role !== 'admin' && req.user.userId !== targetId) {
            return res.status(403).json({ error: 'Non autorizzato a cambiare questa password' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Password attuale e nuova password sono obbligatorie'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'La nuova password deve essere di almeno 6 caratteri'
            });
        }

        // Trova l'utente per verificare la password attuale
        const users = await userDAO.getUserById(connection, userId);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        const user = users[0];

        // Verifica la password attuale con supporto per hash e plain text
        let isCurrentPasswordValid = false;

        if (user.password.startsWith('$2b$')) {
            // Password già hashata - usa bcrypt
            isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        } else {
            // Password in chiaro - confronto diretto
            isCurrentPasswordValid = (user.password === currentPassword);
        }

        if (!isCurrentPasswordValid) {
            return res.status(401).json({ error: 'Password attuale non corretta' });
        }

        // Verifica che la nuova password sia diversa da quella attuale
        if (currentPassword === newPassword) {
            return res.status(400).json({ error: 'La nuova password deve essere diversa da quella attuale' });
        }

        // Hash della nuova password
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Aggiorna la password con il nuovo hash
        const updateResult = await userDAO.updateUser(connection, userId, { password: hashedNewPassword });

        if (updateResult) {
            await connection.commit();
            res.status(200).json({
                message: 'Password cambiata con successo',
                success: true
            });
        } else {
            await connection.rollback();
            res.status(500).json({ error: 'Errore durante il cambio password' });
        }
    } catch (error) {
        console.error("Error changing password:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// Esporta il router
module.exports = router;