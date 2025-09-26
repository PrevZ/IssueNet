# IssueNet 🐛

> Sistema di tracciamento bug ispirato a Trello con interfaccia Kanban

Un sistema completo di bug tracking sviluppato per il corso di Ingegneria dei Sistemi Web, caratterizzato da un'architettura client-server moderna e funzionalità avanzate di gestione progetti.

## 🎯 Panoramica del Progetto

IssueNet è un'applicazione web per il tracciamento di bug che fornisce un'interfaccia intuitiva in stile Kanban per la gestione di progetti, issue e collaborazione del team.

## 🛠 Stack Tecnologico

- **Frontend**: Angular 20+ con TypeScript, HTML5, CSS3, Angular Material
- **Backend**: Node.js con Express.js e JavaScript
- **Database**: MySQL con schema personalizzato
- **Autenticazione**: JWT (JSON Web Tokens)
- **Architettura**: REST API con pattern layered

## 🏗 Struttura del Progetto

```
IssueNet/
├── API/                  # Server API Express.js
│   ├── dao/             # Data Access Objects per database
│   │   ├── userDAO.js   # Operazioni CRUD utenti
│   │   ├── projectDAO.js # Operazioni CRUD progetti
│   │   ├── issueDAO.js  # Operazioni CRUD issue
│   │   └── commentDAO.js # Operazioni CRUD commenti
│   ├── routes/          # Handler delle route API
│   │   ├── user.js      # Endpoint utenti
│   │   ├── project.js   # Endpoint progetti
│   │   ├── issue.js     # Endpoint issue
│   │   ├── comment.js   # Endpoint commenti
│   │   └── index.js     # Router principale
│   ├── middleware/      # Middleware personalizzati
│   │   └── auth.js      # Autenticazione JWT e controllo ruoli
│   ├── services/        # Servizi di supporto
│   │   └── database.js  # Connessione e query MySQL
│   ├── app.js          # File principale del server
│   ├── config.js       # Configurazione database
│   └── package.json    # Dipendenze backend
├── Front-End/           # Applicazione Angular
│   ├── src/app/
│   │   ├── components/  # Componenti Angular
│   │   │   ├── navbar/  # Barra di navigazione
│   │   │   ├── home/    # Pagina home
│   │   │   ├── login/   # Sistema di login
│   │   │   ├── register/ # Registrazione utenti
│   │   │   ├── dashboard/ # Dashboard principale
│   │   │   ├── project-board/ # Board progetti Kanban
│   │   │   ├── issue-board/ # Board issue
│   │   │   ├── user-management/ # Gestione utenti (admin)
│   │   │   ├── user-profile/ # Profilo utente
│   │   │   ├── edit-user/ # Modifica utente
│   │   │   ├── change-password/ # Cambio password
│   │   │   ├── comment-section/ # Sezione commenti
│   │   │   ├── about/   # Pagina about
│   │   │   ├── contact/ # Pagina contatti
│   │   │   ├── features/ # Pagina funzionalità
│   │   │   ├── faq/     # FAQ
│   │   │   ├── privacy-policy/ # Privacy policy
│   │   │   ├── terms-of-service/ # Termini di servizio
│   │   │   └── footer/  # Footer
│   │   ├── services/    # Servizi Angular
│   │   ├── models/      # Modelli TypeScript
│   │   ├── interceptors/ # HTTP interceptors
│   │   └── guards/      # Route guards
│   └── package.json     # Dipendenze frontend
├── Database/            # Schema e dati del database
│   ├── schema.sql      # Schema delle tabelle
│   └── init.sql        # Dati iniziali
└── README.md           # Documentazione del progetto
```

## 🚀 Funzionalità Principali

### 1. Gestione Progetti
- ✨ Creazione, visualizzazione, modifica ed eliminazione progetti
- 📊 Dashboard progetti con board in stile Kanban
- 👥 Assegnazione membri del team
- 📝 Gestione completa del ciclo di vita del progetto
- 🎯 Stati progetto (attivo, archiviato)

### 2. Tracciamento Issue/Bug
- 🐛 Creazione e gestione issue dettagliate
- 📋 Visualizzazione board Kanban (To Do, In Progress, Testing, Done)
- 🔥 Livelli di priorità (Bassa, Media, Alta, Critica)
- 👤 Assegnazione responsabili
- 📝 Sistema di commenti e aggiornamenti
- 🏷 Categorizzazione per tipo (bug, feature, enhancement)

### 3. Autenticazione e Autorizzazione
- 🔐 Registrazione e login utenti
- 🎫 Gestione sessioni basata su JWT
- 👨‍💼 Controllo accessi basato sui ruoli (Admin, Developer, Tester)
- 🔒 Route e endpoint API protetti
- 🔄 Refresh automatico token

### 4. Gestione Utenti
- 👥 Amministrazione utenti (solo admin)
- 🔧 Modifica profilo utente
- 🔑 Cambio password
- 📊 Visualizzazione ruoli e permessi
- ✏️ Aggiornamento informazioni personali

### 5. Interfaccia Utente Avanzata
- 🎨 Design responsive con Angular Material
- 🌙 Supporto temi chiari/scuri (pianificato)
- 📱 Interfaccia mobile-friendly
- 🔔 Notifiche e feedback utente
- 🎯 Navigazione intuitiva

### 6. Pagine Informative
- ℹ️ Pagina About con informazioni progetto
- 📞 Sezione Contatti
- ❓ FAQ per supporto utenti
- 🔒 Privacy Policy e Termini di Servizio
- 🎁 Showcase funzionalità

## 🛠 Istruzioni di Setup

### Prerequisiti
- Node.js (v18 o superiore)
- npm o yarn
- MySQL 8.0+
- Angular CLI (`npm install -g @angular/cli`)

### Setup Backend
```bash
cd API
npm install
# Configura il database in config.js
npm start
```

### Setup Frontend
```bash
cd Front-End
npm install
ng serve
```

### Setup Database
```bash
# Crea il database MySQL
mysql -u root -p
CREATE DATABASE issuenet;

# Esegui lo schema e i dati iniziali
mysql -u root -p issuenet < Database/schema.sql
mysql -u root -p issuenet < Database/init.sql

# Configura utente database (opzionale)
CREATE USER 'inuser'@'localhost' IDENTIFIED BY 'user!';
GRANT ALL PRIVILEGES ON issuenet.* TO 'inuser'@'localhost';
```

### Avvio dell'Applicazione
1. **Backend**: Il server API sarà disponibile su `http://localhost:3000`
2. **Frontend**: L'applicazione Angular sarà disponibile su `http://localhost:4200`
3. **Database**: MySQL deve essere in esecuzione su localhost:3306

## 🔧 Workflow di Sviluppo

1. **Sviluppo Funzionalità**: Creare branch feature da `main`
2. **API First**: Progettare endpoint API prima dell'implementazione frontend
3. **Testing**: Scrivere test per backend e frontend
4. **Code Review**: Tutte le modifiche richiedono revisione pull request
5. **Documentazione**: Aggiornare la documentazione per modifiche API o funzionalità

## 📡 Endpoint API Implementati

### Progetti
- `GET /api/projects` - Elenca tutti i progetti
- `POST /api/projects` - Crea nuovo progetto
- `GET /api/projects/:id` - Dettagli progetto
- `PUT /api/projects/:id` - Aggiorna progetto
- `DELETE /api/projects/:id` - Elimina progetto
- `GET /api/projects/:id/issues` - Issue del progetto

### Issue
- `GET /api/issues` - Elenca issue con filtri
- `POST /api/issues` - Crea nuova issue
- `GET /api/issues/:id` - Dettagli issue
- `PUT /api/issues/:id` - Aggiorna issue
- `DELETE /api/issues/:id` - Elimina issue
- `PUT /api/issues/:id/status` - Cambia stato issue

### Utenti
- `POST /api/users/register` - Registrazione utente
- `POST /api/users/login` - Login utente
- `GET /api/users` - Lista utenti (admin)
- `GET /api/users/:id` - Dettagli utente
- `PUT /api/users/:id` - Aggiorna utente
- `DELETE /api/users/:id` - Elimina utente (admin)
- `POST /api/users/:id/change-password` - Cambia password

### Commenti
- `GET /api/comments/issue/:issueId` - Commenti di un'issue
- `POST /api/comments` - Crea nuovo commento
- `PUT /api/comments/:id` - Aggiorna commento
- `DELETE /api/comments/:id` - Elimina commento

## 🤝 Contribuire

1. Fai il fork del repository
2. Crea il tuo branch feature (`git checkout -b feature/nuova-funzionalita`)
3. Committa le tue modifiche (`git commit -m 'Aggiungi nuova funzionalità'`)
4. Pusha il branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 🔒 Sicurezza

- Autenticazione JWT con middleware personalizzato
- Validazione input lato server
- Controllo accessi basato sui ruoli
- Hashing password con bcrypt
- Protezione route frontend con guards

## 🚀 Tecnologie e Librerie

### Backend
- **Express.js** - Framework web Node.js
- **MySQL2** - Driver database MySQL
- **bcrypt** - Hashing password
- **jsonwebtoken** - Gestione JWT
- **cors** - Cross-origin resource sharing

### Frontend
- **Angular 20** - Framework frontend
- **Angular Material** - Componenti UI
- **RxJS** - Programmazione reattiva
- **TypeScript** - Linguaggio tipizzato

## 📄 Licenza

Questo progetto è sviluppato per scopi educativi come parte del corso di Ingegneria dei Sistemi Web.

## 👥 Team

- **Marco Previati** - Project Lead & Full Stack Developer

---

**Corso**: Ingegneria dei Sistemi Web
**Istituzione**: Università degli Studi di Ferrara
**Anno Accademico**: 2024/2025
