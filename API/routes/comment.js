// Importa le dipendenze necessarie
const express = require('express');
const db = require('../services/database');
const commentDAO = require('../dao/commentDAO');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/comments - Ottiene tutti i commenti con filtri opzionali (solo utenti autenticati)
router.get('/', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const comments = await commentDAO.getAllComments(connection, req.query);
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/comments/issue/:issueId - Ottiene tutti i commenti di una issue specifica (solo utenti autenticati)
router.get('/issue/:issueId', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const comments = await commentDAO.getCommentsByIssue(connection, req.params.issueId);
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments by issue:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/comments/user/:userId - Ottiene tutti i commenti di un utente specifico (utente stesso)
router.get('/user/:userId', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo l'utente stesso può vedere i propri commenti
        const requestedUserId = parseInt(req.params.userId);
        if (req.user.userId !== requestedUserId) {
            return res.status(403).json({ error: 'Non autorizzato ad accedere ai commenti di questo utente' });
        }

        const comments = await commentDAO.getCommentsByUser(connection, req.params.userId);
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments by user:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/comments/issue/:issueId/count - Conta i commenti di una issue (solo utenti autenticati)
router.get('/issue/:issueId/count', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const count = await commentDAO.getCommentCount(connection, req.params.issueId);
        res.json({ issueId: req.params.issueId, count: count });
    } catch (error) {
        console.error("Error counting comments:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// GET /api/comments/:id - Ottiene un commento specifico tramite ID (solo utenti autenticati)
router.get('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    res.setHeader('Content-Type', 'application/json');
    try {
        const comments = await commentDAO.getCommentById(connection, req.params.id);
        if (comments.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(comments[0]);
    } catch (error) {
        console.error("Error fetching comment:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// POST /api/comments - Crea un nuovo commento (solo utenti autenticati)
router.post('/', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        const newComment = await commentDAO.createComment(connection, req.body);
        if (newComment != null) {
            res.status(201).json(newComment);
        } else {
            res.status(500).json({ error: 'Failed to create comment' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error creating comment:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// PUT /api/comments/:id - Aggiorna il contenuto di un commento (solo autore)
router.put('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo l'autore del commento può modificarlo
        const commentResult = await commentDAO.getCommentById(connection, req.params.id);
        if (commentResult.length === 0) {
            return res.status(404).json({ error: 'Commento non trovato' });
        }

        const comment = commentResult[0];
        if (req.user.userId !== comment.id_user) {
            return res.status(403).json({ error: 'Non autorizzato a modificare questo commento' });
        }

        const result = await commentDAO.updateComment(connection, req.params.id, req.body.content);
        if (result) {
            res.status(200).json({ message: 'Commento aggiornato con successo'});
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error updating comment:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// DELETE /api/comments/:id - Elimina un commento (solo autore)
router.delete('/:id', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {
        // Verifica autorizzazioni: solo l'autore del commento può eliminarlo
        const commentResult = await commentDAO.getCommentById(connection, req.params.id);
        if (commentResult.length === 0) {
            return res.status(404).json({ error: 'Commento non trovato' });
        }

        const comment = commentResult[0];
        if (req.user.userId !== comment.id_user) {
            return res.status(403).json({ error: 'Non autorizzato a eliminare questo commento' });
        }

        const deletedComment = await commentDAO.deleteComment(connection, req.params.id);
        if (deletedComment) {
            res.status(200).json({ message: 'Commento eliminato con successo' });
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
        await connection.commit();
    } catch (error) {
        console.error("Error deleting comment:", error);
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        await connection.end();
    }
});

// Esporta il router per usarlo in altre parti dell'applicazione
module.exports = router;
