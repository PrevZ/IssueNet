const jwt = require('jsonwebtoken');

// Configurazione JWT 
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware per verificare il token JWT
 * Aggiunge l'utente decodificato a req.user se il token è valido
 */
const authenticateToken = (req, res, next) => {
    // Ottieni l'header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({
            error: 'Token di accesso richiesto',
            code: 'NO_TOKEN'
        });
    }

    // Verifica il token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token scaduto',
                    code: 'TOKEN_EXPIRED'
                });
            }

            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({
                    error: 'Token non valido',
                    code: 'INVALID_TOKEN'
                });
            }

            return res.status(403).json({
                error: 'Errore nella verifica del token',
                code: 'TOKEN_ERROR'
            });
        }

        // Token valido - salva le informazioni dell'utente nella request
        req.user = decoded;
        next();
    });
};

/**
 * Middleware per verificare ruoli specifici
 * Da usare dopo authenticateToken
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Utente non autenticato' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Permessi insufficienti',
                required: roles,
                current: req.user.role
            });
        }

        next();
    };
};

/**
 * Middleware opzionale per token - non blocca se il token manca
 * Utile per route che possono funzionare con o senza autenticazione
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Nessun token, ma continua comunque
        req.user = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token presente ma non valido, continua senza utente
            req.user = null;
        } else {
            // Token valido
            req.user = decoded;
        }
        next();
    });
};

module.exports = {
    authenticateToken,
    requireRole,
    optionalAuth
};