# API IssueNet 🔌

> Backend REST API per il sistema di tracciamento bug IssueNet

Questo è il backend Node.js/Express che fornisce le API REST per l'applicazione IssueNet, con autenticazione JWT e architettura layered.

## 📁 Struttura Directory

```
API/
├── app.js                 # Entry point dell'applicazione
├── config.js             # Configurazione database MySQL
├── package.json          # Dipendenze e script npm
├── dao/                  # Data Access Objects
│   ├── userDAO.js        # Operazioni CRUD utenti
│   ├── projectDAO.js     # Operazioni CRUD progetti
│   ├── issueDAO.js       # Operazioni CRUD issue
│   └── commentDAO.js     # Operazioni CRUD commenti
├── routes/               # Route handlers API
│   ├── index.js          # Router principale
│   ├── user.js           # Endpoint /api/users
│   ├── project.js        # Endpoint /api/projects
│   ├── issue.js          # Endpoint /api/issues
│   └── comment.js        # Endpoint /api/comments
├── middleware/           # Middleware personalizzati
│   └── auth.js           # Autenticazione JWT e controllo ruoli
└── services/             # Servizi di supporto
    └── database.js       # Connessione e helper MySQL
```

## 🚀 Quick Start

### 1. Installazione Dipendenze
```bash
cd API
npm install
```

### 2. Configurazione Database
Modifica `config.js` con i tuoi parametri MySQL:
```javascript
const config = {
    db: {
        host: "localhost",
        user: "inuser",
        password: "user!",
        database: "issuenet",
        connectTimeout: 60000
    }
};
```

### 3. Avvio Server
```bash
# Produzione
npm start

# Sviluppo (con nodemon)
npm run dev
```

Il server sarà disponibile su: `http://localhost:3000/api`

## 🛠 Stack Tecnologico

### Dipendenze Principali
- **Express.js ^5.1.0** - Framework web Node.js
- **MySQL2 ^3.14.1** - Driver database MySQL con Promise
- **bcrypt ^6.0.0** - Hashing sicuro delle password
- **jsonwebtoken ^9.0.2** - Gestione token JWT
- **cors ^2.8.5** - Cross-Origin Resource Sharing
- **dotenv ^17.0.0** - Gestione variabili ambiente

### Dev Dependencies
- **nodemon ^3.1.10** - Auto-restart server durante sviluppo

## 🏗️ Architettura

### Pattern Layered
```
┌─────────────────────┐
│   Routes Layer      │ ← HTTP handlers, validazione input
├─────────────────────┤
│   Middleware Layer  │ ← Autenticazione, autorizzazione
├─────────────────────┤
│   DAO Layer         │ ← Data Access Objects, logica business
├─────────────────────┤
│   Service Layer     │ ← Database connection, utilities
└─────────────────────┘
```

### Middleware Chain
1. **CORS** - Permette richieste da Angular (localhost:4200)
2. **JSON Parser** - Parsing automatico body JSON
3. **URL Encoded** - Parsing form data
4. **Auth Middleware** - Verifica JWT e ruoli
5. **Route Handlers** - Logica business specifica

## 🔐 Sistema di Autenticazione

### JWT Implementation
```javascript
// Generazione token al login
const token = jwt.sign(
    {
        userId: user.id_user,
        username: user.username,
        role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
);
```

### Middleware Disponibili
- **`authenticateToken`** - Verifica token JWT obbligatorio
- **`requireRole(['admin'])`** - Controllo ruoli specifici
- **`optionalAuth`** - Token opzionale (non blocca se manca)

### Livelli di Accesso
- **Pubblico** - Registrazione, login
- **Autenticato** - CRUD proprie risorse
- **Admin** - Accesso completo sistema

## 📡 Endpoint API

### 🔐 Autenticazione (`/api/users`)
```
POST   /register              # Registrazione nuovo utente
POST   /login                 # Login utente
GET    /                      # Lista utenti (admin only)
GET    /:id                   # Dettagli utente
PUT    /:id                   # Aggiorna utente
DELETE /:id                   # Elimina utente (admin only)
POST   /:id/change-password   # Cambio password
GET    /role/:role            # Utenti per ruolo
```

### 📋 Progetti (`/api/projects`)
```
GET    /                      # Lista progetti
POST   /                      # Crea progetto
GET    /:id                   # Dettagli progetto
PUT    /:id                   # Aggiorna progetto
DELETE /:id                   # Elimina progetto
GET    /:id/issues            # Issue del progetto
```

### 🐛 Issue (`/api/issues`)
```
GET    /                      # Lista issue (con filtri)
POST   /                      # Crea issue
GET    /:id                   # Dettagli issue
PUT    /:id                   # Aggiorna issue
DELETE /:id                   # Elimina issue
PUT    /:id/status            # Cambia stato issue
GET    /project/:projectId    # Issue per progetto
GET    /user/:userId          # Issue assegnate a utente
```

### 💬 Commenti (`/api/comments`)
```
GET    /                      # Tutti commenti (admin only)
GET    /issue/:issueId        # Commenti di un'issue
POST   /                      # Crea commento
GET    /:id                   # Dettaglio commento
PUT    /:id                   # Aggiorna commento
DELETE /:id                   # Elimina commento
GET    /user/:userId          # Commenti di un utente
GET    /issue/:issueId/count  # Conta commenti issue
```

## 🔧 Configurazione

### Variabili Ambiente
Crea file `.env` nella directory API:
```env
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_USER=inuser
DB_PASSWORD=user!
DB_NAME=issuenet
```

### CORS Settings
```javascript
app.use(cors({
    origin: "http://localhost:4200"  // Angular frontend
}));
```

## 🗄️ Data Access Objects (DAO)

### userDAO.js
- `getAllUsers(connection, filters)` - Lista utenti con filtri
- `getUserById(connection, id)` - Utente per ID
- `createUser(connection, userData)` - Crea nuovo utente
- `updateUser(connection, id, userData)` - Aggiorna utente
- `deleteUser(connection, id)` - Elimina utente

### projectDAO.js
- `getAllProjects(connection, filters)` - Lista progetti
- `getProjectById(connection, id)` - Progetto per ID
- `createProject(connection, projectData)` - Crea progetto
- `updateProject(connection, id, data)` - Aggiorna progetto
- `deleteProject(connection, id)` - Elimina progetto

### issueDAO.js
- `getAllIssues(connection, filters)` - Lista issue con filtri avanzati
- `getIssueById(connection, id)` - Issue per ID
- `createIssue(connection, issueData)` - Crea issue
- `updateIssue(connection, id, data)` - Aggiorna issue
- `deleteIssue(connection, id)` - Elimina issue
- `getIssuesByProject(connection, projectId)` - Issue per progetto

### commentDAO.js
- `getAllComments(connection)` - Tutti i commenti
- `getCommentsByIssue(connection, issueId)` - Commenti per issue
- `createComment(connection, commentData)` - Crea commento
- `updateComment(connection, id, content)` - Aggiorna commento
- `deleteComment(connection, id)` - Elimina commento

## 🛡️ Sicurezza

### Password Security
- **bcrypt** con 12 salt rounds per hashing password
- Password mai restituite nelle response API
- Validazione forza password (implementabile)

### JWT Security
- Token firmati con chiave segreta configurabile
- Scadenza 24h per limitare esposizione
- Payload minimale (ID, username, ruolo)
- Verifica rigorosa con gestione errori dettagliata

### Input Validation
- Sanitizzazione parametri query
- Validazione tipi dati
- Controllo foreign key esistenti
- Gestione errori SQL injection-safe

## 📊 Response Format

### Success Response
```json
{
    "data": {...},
    "message": "Operazione completata con successo"
}
```

### Error Response
```json
{
    "error": "Descrizione errore",
    "code": "ERROR_CODE",
    "details": {...}
}
```

### Paginated Response
```json
{
    "data": [...],
    "pagination": {
        "total": 100,
        "page": 1,
        "limit": 20,
        "pages": 5
    }
}
```

## 🧪 Testing

### Test API con curl
```bash
# Registrazione
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'

# API autenticata
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Log e Debugging

### Console Logging
- Richieste HTTP entranti
- Errori database con stack trace
- Successi/fallimenti autenticazione JWT
- Operazioni CRUD con dettagli

### Error Handling
- Try-catch in tutte le route async
- Rollback transazioni in caso di errore
- Chiusura connessioni database nel finally
- Status code HTTP appropriati

## 🚀 Deployment

### Preparazione Produzione
1. Configurare variabili ambiente sicure
2. Usare database MySQL produzione
3. Configurare reverse proxy (nginx)
4. Abilitare HTTPS
5. Configurare rate limiting

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start app.js --name="issuenet-api"
pm2 startup
pm2 save
```

---

**Versione**: 1.0.0
**Autore**: Marco Previati
**Porta**: 3000
**Context Path**: `/api`