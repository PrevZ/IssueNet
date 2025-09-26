# Database IssueNet 🗄️

> Schema del database MySQL per il sistema di tracciamento bug IssueNet

Questa directory contiene tutto ciò che serve per configurare e popolare il database MySQL del progetto IssueNet.

## 📁 Contenuto Directory

- **`schema.sql`** - Schema completo delle tabelle del database
- **`init.sql`** - Dati iniziali di esempio per test e sviluppo
- **`README.md`** - Questa documentazione

## 🏗️ Schema Database

### Tabelle Principali

#### 1. **users** - Gestione Utenti
```sql
CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'developer', 'tester') DEFAULT 'developer'
);
```

**Ruoli disponibili:**
- `admin` - Accesso completo al sistema
- `developer` - Sviluppatori che lavorano sui progetti
- `tester` - Tester che verificano e testano le issue

#### 2. **projects** - Gestione Progetti
```sql
CREATE TABLE projects (
    id_project INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    status ENUM('active', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id_user)
);
```

**Stati progetto:**
- `active` - Progetto attivo in sviluppo
- `archived` - Progetto archiviato/completato

#### 3. **issues** - Tracciamento Bug/Task
```sql
CREATE TABLE issues (
    id_issue INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('todo', 'in_progress', 'in_review', 'done') DEFAULT 'todo',
    type ENUM('bug', 'feature', 'task', 'improvement') DEFAULT 'bug',
    id_project INT NOT NULL,
    assigned_to INT,
    created_by INT NOT NULL,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Foreign Keys
    FOREIGN KEY (id_project) REFERENCES projects(id_project) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id_user),
    FOREIGN KEY (created_by) REFERENCES users(id_user)
);
```

**Priorità issue:**
- `low` - Bassa priorità
- `medium` - Priorità media
- `high` - Alta priorità
- `critical` - Priorità critica

**Stati Kanban:**
- `todo` - Da fare
- `in_progress` - In lavorazione
- `in_review` - In revisione/test
- `done` - Completato

**Tipi issue:**
- `bug` - Errore da correggere
- `feature` - Nuova funzionalità
- `task` - Attività generica
- `improvement` - Miglioramento esistente

#### 4. **comments** - Sistema Commenti
```sql
CREATE TABLE comments (
    id_comment INT PRIMARY KEY AUTO_INCREMENT,
    id_issue INT NOT NULL,
    id_user INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_issue) REFERENCES issues(id_issue) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);
```

## 🔗 Relazioni Database

```
users (1) ──┬── projects (*) [created_by]
            ├── issues (*) [created_by]
            ├── issues (*) [assigned_to]
            └── comments (*) [id_user]

projects (1) ── issues (*) [id_project]

issues (1) ── comments (*) [id_issue]
```

## 🚀 Setup Database

### 1. Creazione Database e Schema
```bash
# Connetti a MySQL
mysql -u root -p

# Esegui lo schema
mysql -u root -p < Database/schema.sql
```

### 2. Popolazione Dati di Test
```bash
# Inserisci dati di esempio
mysql -u root -p issuenet < Database/init.sql
```

### 3. Configurazione Utente (Opzionale)
```sql
-- Crea utente dedicato per l'applicazione
CREATE USER 'inuser'@'localhost' IDENTIFIED BY 'user!';
GRANT ALL PRIVILEGES ON issuenet.* TO 'inuser'@'localhost';
FLUSH PRIVILEGES;
```

## 📊 Dati di Test Inclusi

Il file `init.sql` include:

### Utenti di Test
- **marco** (admin) - Amministratore del sistema
- **alessia** (developer) - Sviluppatrice
- **luca** (developer) - Sviluppatore
- **giulia** (tester) - Tester
- **andrea** (developer) - Sviluppatore
- **sara** (tester) - Tester

### Progetti di Esempio
1. **E-Commerce Platform** - Piattaforma e-commerce completa
2. **Mobile App IssueNet** - App mobile companion
3. **Sistema Autenticazione** - Sistema auth completo
4. **Dashboard Analytics** - Dashboard analytics avanzata
5. **API Gateway** - Gateway centralizzato API

### Issue Distribuite
- **42+ issue** distribuite tra tutti i progetti
- Issue in tutti gli stati Kanban (todo, in_progress, in_review, done)
- Varie priorità e tipologie
- Assegnazioni realistiche agli utenti
- Date di scadenza e stime ore

## 🔧 Note Tecniche

### Caratteristiche Schema
- **Auto-increment** su tutte le primary key
- **Foreign key constraints** con CASCADE delete appropriati
- **ENUM** per valori predefiniti (ruoli, stati, priorità)
- **Timestamp automatici** per tracking creazione/modifica
- **Indici impliciti** su foreign key per performance

### Sicurezza
- Password memorizzate come hash (bcrypt nel backend)
- Vincoli di integrità referenziale
- Validazione tipi attraverso ENUM

### Performance
- Foreign key per join efficienti
- Timestamp per ordinamento cronologico
- Indici automatici su chiavi esterne

## 🔄 Maintenance

### Backup Database
```bash
mysqldump -u root -p issuenet > backup_issuenet.sql
```

### Reset Completo
```bash
mysql -u root -p < Database/schema.sql
mysql -u root -p issuenet < Database/init.sql
```

### Verifica Integrità
```sql
-- Controlla foreign key constraints
SELECT * FROM information_schema.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'issuenet';
```

---

**Database Engine**: MySQL 8.0+
**Charset**: utf8mb4 (default)
**Collation**: utf8mb4_0900_ai_ci (default)