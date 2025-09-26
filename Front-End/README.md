# Frontend IssueNet 🌐

> Applicazione Angular per il sistema di tracciamento bug IssueNet

Frontend moderno sviluppato con Angular 20 e Angular Material che fornisce un'interfaccia utente intuitiva per la gestione di progetti, issue e collaborazione team.

## 📁 Struttura Directory

```
Front-End/
├── src/
│   ├── app/
│   │   ├── components/           # Componenti Angular
│   │   │   ├── navbar/          # Barra di navigazione principale
│   │   │   ├── home/            # Pagina homepage
│   │   │   ├── login/           # Sistema di autenticazione
│   │   │   ├── register/        # Registrazione nuovi utenti
│   │   │   ├── dashboard/       # Dashboard principale
│   │   │   ├── project-board/   # Board progetti con Kanban
│   │   │   ├── issue-board/     # Board issue specifiche
│   │   │   ├── user-management/ # Gestione utenti (admin)
│   │   │   ├── user-profile/    # Profilo utente personale
│   │   │   ├── edit-user/       # Modifica dati utente
│   │   │   ├── change-password/ # Cambio password
│   │   │   ├── comment-section/ # Sistema commenti
│   │   │   ├── about/           # Informazioni progetto
│   │   │   ├── contact/         # Pagina contatti
│   │   │   ├── features/        # Showcase funzionalità
│   │   │   ├── faq/             # Domande frequenti
│   │   │   ├── privacy-policy/  # Privacy policy
│   │   │   ├── terms-of-service/ # Termini di servizio
│   │   │   └── footer/          # Footer dell'applicazione
│   │   ├── services/            # Servizi Angular
│   │   │   ├── user.service.ts  # Gestione utenti e autenticazione
│   │   │   ├── project.service.ts # Gestione progetti
│   │   │   ├── issue.service.ts # Gestione issue
│   │   │   ├── comment.service.ts # Gestione commenti
│   │   │   └── api-config.service.ts # Configurazione API
│   │   ├── models/              # Modelli TypeScript
│   │   │   ├── user.model.ts    # Interfacce utente
│   │   │   ├── project.model.ts # Interfacce progetto
│   │   │   ├── issue.model.ts   # Interfacce issue
│   │   │   └── comment.model.ts # Interfacce commento
│   │   ├── interceptors/        # HTTP Interceptors
│   │   │   └── auth.interceptor.ts # Auto-inject JWT token
│   │   ├── pipes/               # Pipes personalizzate
│   │   ├── app.routes.ts        # Configurazione routing
│   │   ├── app.config.ts        # Configurazione app
│   │   ├── app.component.*      # Componente principale
│   │   └── main.ts              # Bootstrap applicazione
│   ├── assets/                  # Risorse statiche
│   ├── styles.css              # Stili globali
│   └── index.html              # Template HTML principale
├── angular.json                # Configurazione Angular CLI
├── package.json               # Dipendenze npm
├── tsconfig.json             # Configurazione TypeScript
└── README.md                 # Questa documentazione
```

## 🚀 Quick Start

### 1. Installazione Dipendenze
```bash
cd Front-End
npm install
```

### 2. Avvio Sviluppo
```bash
# Server di sviluppo con hot reload
ng serve
# oppure
npm start

# L'app sarà disponibile su http://localhost:4200
```

### 3. Build Produzione
```bash
# Build ottimizzata per produzione
ng build

# Build con watch mode
ng build --watch
```

## 🛠 Stack Tecnologico

### Framework e Librerie Principali
- **Angular ^20.0.0** - Framework SPA moderno
- **Angular Material ^20.0.5** - Componenti UI Material Design
- **Angular CDK ^20.0.5** - Component Development Kit
- **RxJS ~7.8.0** - Programmazione reattiva
- **TypeScript ~5.8.2** - Linguaggio tipizzato

### Dipendenze Core
- **@angular/animations** - Sistema animazioni
- **@angular/forms** - Gestione form reattivi
- **@angular/router** - Sistema di routing
- **@angular/common** - Funzionalità comuni
- **zone.js** - Change detection

### Dev Dependencies
- **Angular CLI ^20.0.4** - Toolchain sviluppo
- **Jasmine & Karma** - Framework testing
- **TypeScript Compiler** - Compilazione TS→JS

## 🏗️ Architettura

### Pattern Utilizzati
- **Component-Based Architecture** - UI modulare e riutilizzabile
- **Service-Oriented** - Logica business nei servizi
- **Reactive Programming** - RxJS Observables
- **Dependency Injection** - IoC container Angular
- **Model-View-Controller** - Separazione concerns

### Flusso Dati
```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   Components    │───▶│   Services   │───▶│  HTTP API   │
│  (Presentation) │    │  (Business)  │    │  (Backend)  │
└─────────────────┘    └──────────────┘    └─────────────┘
         ▲                       │
         │                       ▼
         └───── Observables ──────┘
```

## 🔐 Sistema di Autenticazione

### JWT Integration
- **AuthInterceptor** - Aggiunge automaticamente token JWT
- **LocalStorage** - Persistenza token e dati utente
- **UserService** - Gestione stato autenticazione
- **BehaviorSubject** - Stato reattivo utente corrente

### Flusso Autenticazione
```typescript
// Login
this.userService.login(credentials).subscribe(response => {
  // Token salvato automaticamente
  // Stato utente aggiornato
  // Redirect a dashboard
});

// Auto-inject token in tutte le richieste
const authReq = req.clone({
  setHeaders: { Authorization: `Bearer ${token}` }
});
```

### Stati Utente
- **Anonimo** - Accesso solo a home, login, register
- **Autenticato** - Accesso a dashboard, progetti, issue
- **Admin** - Accesso completo inclusa gestione utenti

## 🧩 Componenti Principali

### 🏠 Navigazione e Layout
- **Navbar** - Barra navigazione con menu utente e logout
- **Footer** - Footer con link informativi
- **Home** - Landing page con presentazione sistema

### 🔐 Autenticazione
- **Login** - Form login con validazione
- **Register** - Registrazione nuovi utenti
- **ChangePassword** - Cambio password sicuro

### 📊 Dashboard e Gestione
- **Dashboard** - Overview progetti e statistiche
- **ProjectBoard** - Board Kanban per gestione progetti
- **IssueBoard** - Board specifica per issue di progetto
- **UserManagement** - Amministrazione utenti (solo admin)

### 👤 Gestione Profilo
- **UserProfile** - Visualizzazione profilo utente
- **EditUser** - Modifica dati personali

### 💬 Collaborazione
- **CommentSection** - Sistema commenti threaded

### ℹ️ Pagine Informative
- **About** - Informazioni progetto
- **Features** - Showcase funzionalità
- **FAQ** - Domande frequenti
- **Contact** - Form contatti
- **PrivacyPolicy** - Informativa privacy
- **TermsOfService** - Termini utilizzo

## 🔧 Servizi Angular

### UserService
```typescript
// Gestione completa utenti e autenticazione
login(credentials): Observable<LoginResponse>
register(userData): Observable<User>
getCurrentUser(): User | null
updateProfile(userData): Observable<User>
logout(): void
// BehaviorSubject per stato reattivo
currentUser$: Observable<User | null>
```

### ProjectService
```typescript
// CRUD progetti
getAllProjects(): Observable<Project[]>
getProjectById(id): Observable<Project>
createProject(project): Observable<Project>
updateProject(id, data): Observable<Project>
deleteProject(id): Observable<void>
```

### IssueService
```typescript
// CRUD issue con filtri avanzati
getAllIssues(filters?): Observable<Issue[]>
getIssuesByProject(projectId): Observable<Issue[]>
createIssue(issue): Observable<Issue>
updateIssueStatus(id, status): Observable<Issue>
```

### CommentService
```typescript
// Sistema commenti
getCommentsByIssue(issueId): Observable<Comment[]>
createComment(comment): Observable<Comment>
updateComment(id, content): Observable<Comment>
deleteComment(id): Observable<void>
```

## 🎨 Design System

### Angular Material Components
- **MatToolbar** - Barre di navigazione
- **MatCard** - Container contenuti
- **MatButton** - Pulsanti Material
- **MatForm** - Form controls avanzati
- **MatDialog** - Modal e popup
- **MatSnackBar** - Notifiche toast
- **MatMenu** - Menu dropdown
- **MatIcon** - Icone Material
- **MatTable** - Tabelle dati

### Responsive Design
- **Flex Layout** - Layout flessibili
- **Grid System** - Griglie responsive
- **Breakpoints** - Supporto mobile/tablet/desktop
- **Material Theming** - Tema personalizzabile

## 🛣️ Sistema di Routing

### Route Configuration
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'project/:id', component: ProjectBoard },
  { path: 'issue/:id', component: IssueBoard },
  { path: 'user-profile', component: UserProfile },
  { path: 'user-management', component: UserManagementComponent },
  // ... altre route
  { path: '**', redirectTo: '/home' } // Wildcard route
];
```

### Navigation Guards (Pianificate)
- **AuthGuard** - Protezione route autenticate
- **AdminGuard** - Accesso solo admin
- **RoleGuard** - Controllo ruoli specifici

## 📱 Features Implementate

### ✅ Sistema Kanban
- **Drag & Drop** - Spostamento issue tra colonne
- **Stati Board** - Todo, In Progress, In Review, Done
- **Filtri Avanzati** - Per priorità, assegnatario, tipo
- **Real-time Updates** - Aggiornamenti automatici

### ✅ Gestione Utenti
- **CRUD Completo** - Creazione, modifica, eliminazione
- **Controllo Ruoli** - Admin, Developer, Tester
- **Profilo Utente** - Modifica dati personali
- **Cambio Password** - Sicuro con validazione

### ✅ Sistema Progetti
- **Creazione Progetti** - Con descrizione e team
- **Dashboard Progetti** - Overview stato avanzamento
- **Assegnazione Team** - Gestione membri progetto
- **Archiviazione** - Stati attivo/archiviato

### ✅ Gestione Issue
- **CRUD Issue** - Creazione e modifica completa
- **Priorità Multiple** - Low, Medium, High, Critical
- **Tipologie** - Bug, Feature, Task, Improvement
- **Assegnazione** - A membri del team
- **Tracking Tempo** - Ore stimate vs effettive
- **Date Scadenza** - Con visual indicators

### ✅ Sistema Commenti
- **Threaded Comments** - Commenti annidati
- **Rich Text** - Formattazione testo
- **Timestamp** - Data/ora creazione
- **Modifica/Eliminazione** - Con controlli permessi

## 🔧 Configurazione

### Environment Variables
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

### API Configuration
```typescript
// api-config.service.ts
@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  private readonly baseUrl = environment.apiUrl;

  getApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
```

## 🧪 Testing

### Unit Testing
```bash
# Esegui test unitari
ng test

# Test con coverage
ng test --code-coverage
```

### E2E Testing
```bash
# Test end-to-end (da configurare)
ng e2e
```

### Test Structure
```
src/
├── app/
│   ├── components/
│   │   └── navbar/
│   │       ├── navbar.component.ts
│   │       ├── navbar.component.spec.ts  # Unit tests
│   │       └── navbar.component.html
│   └── services/
│       ├── user.service.ts
│       └── user.service.spec.ts          # Service tests
```

## 📦 Build e Deployment

### Development Build
```bash
ng build --configuration=development
```

### Production Build
```bash
ng build --configuration=production
# Output in dist/ directory
```

### Deployment Options
- **Static Hosting** - Netlify, Vercel, GitHub Pages
- **Docker** - Containerizzazione con nginx
- **CDN** - Distribuzione globale assets
- **Progressive Web App** - PWA capabilities (pianificato)

## 🔍 Debugging e Development

### Angular DevTools
- **Component Inspector** - Debug component tree
- **Performance Profiler** - Analisi performance
- **Router Inspector** - Debug routing
- **Form Debugging** - Stato form reattivi

### Console Logging
```typescript
// Development mode
if (!environment.production) {
  console.log('Debug info:', data);
}
```

## 🚀 Performance Optimization

### Lazy Loading (Pianificato)
```typescript
// Route-based code splitting
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

### OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {}
```

## 📱 Progressive Web App (Pianificato)

### PWA Features
- **Service Worker** - Caching offline
- **App Manifest** - Installable app
- **Push Notifications** - Notifiche browser
- **Background Sync** - Sync offline data

---

**Versione Angular**: 20.0.0
**Porta Sviluppo**: 4200
**Build Target**: ES2022
**TypeScript**: 5.8.2
