-- Inserimento utenti di esempio per test
INSERT INTO users (username, email, password, full_name, role) VALUES
('marco', 'marco@test.com', 'password123', 'Marco Rossi', 'admin'),
('alessia', 'alessia@test.com', 'password123', 'Alessia Bianchi', 'developer'),
('luca', 'luca@test.com', 'password123', 'Luca Verdi', 'developer'),
('giulia', 'giulia@test.com', 'password123', 'Giulia Neri', 'tester'),
('andrea', 'andrea@test.com', 'password123', 'Andrea Ferrari', 'developer'),
('sara', 'sara@test.com', 'sara123', 'Sara Russo', 'tester');

-- Inserimento progetti di test
INSERT INTO projects (name, description, created_by, status) VALUES
('E-Commerce Platform', 'Piattaforma e-commerce completa con carrello e pagamenti', 1, 'active'),
('Mobile App IssueNet', 'App mobile companion per la gestione progetti', 1, 'active'),
('Sistema Autenticazione', 'Sistema completo di autenticazione e autorizzazione', 2, 'active'),
('Dashboard Analytics', 'Dashboard per analytics e reportistica avanzata', 1, 'active'),
('API Gateway', 'Gateway centralizzato per tutte le API', 3, 'active');

-- Inserimento issue per testare la board Kanban
INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) VALUES
-- E-Commerce Platform (id: 1) - Issue distribuite in tutte le colonne
('Implementare carrello acquisti', 'Sviluppare funzionalità carrello con aggiunta/rimozione prodotti', 'high', 'todo', 'feature', 1, 2, 1, 16.00, NULL, '2025-07-20'),
('Integrazione gateway pagamenti', 'Integrare Stripe e PayPal per i pagamenti', 'critical', 'todo', 'feature', 1, 3, 1, 20.00, NULL, '2025-07-18'),
('Catalogo prodotti responsive', 'Rendere il catalogo mobile-friendly', 'medium', 'in_progress', 'improvement', 1, 2, 1, 12.00, 5.00, '2025-07-22'),
('Sistema recensioni prodotti', 'Permettere agli utenti di recensire i prodotti', 'low', 'in_progress', 'feature', 1, 5, 1, 8.00, 3.00, '2025-07-25'),
('Fix bug calcolo spese spedizione', 'Il calcolo delle spese di spedizione è errato', 'high', 'in_review', 'bug', 1, 3, 2, 4.00, 4.00, '2025-07-15'),
('Ottimizzazione performance checkout', 'Ridurre i tempi di caricamento del checkout', 'medium', 'in_review', 'improvement', 1, 2, 1, 6.00, 5.00, '2025-07-16'),
('Setup ambiente di test', 'Configurare ambiente per test automatici', 'medium', 'done', 'task', 1, 5, 1, 8.00, 7.00, '2025-07-10'),
('Design sistema notifiche', 'Progettare UI per notifiche ordini', 'low', 'done', 'task', 1, 6, 1, 4.00, 3.50, '2025-07-12'),

-- Mobile App IssueNet (id: 2)
('Autenticazione biometrica', 'Implementare login con impronta digitale', 'high', 'todo', 'feature', 2, 3, 1, 12.00, NULL, '2025-07-28'),
('Sincronizzazione offline', 'Permettere lavoro offline con sync automatica', 'high', 'in_progress', 'feature', 2, 2, 1, 20.00, 8.00, '2025-08-01'),
('Notifiche push', 'Sistema di notifiche push per aggiornamenti', 'medium', 'in_review', 'feature', 2, 3, 1, 10.00, 9.00, '2025-07-20'),
('App store deployment', 'Pubblicazione su Apple Store e Google Play', 'high', 'done', 'task', 2, 1, 1, 6.00, 5.00, '2025-07-08'),

-- Sistema Autenticazione (id: 3)
('OAuth Google/GitHub', 'Implementare login social con OAuth2', 'high', 'todo', 'feature', 3, 5, 2, 14.00, NULL, '2025-07-25'),
('Two-factor authentication', 'Aggiungere autenticazione a due fattori', 'medium', 'todo', 'feature', 3, 3, 2, 16.00, NULL, '2025-07-30'),
('Sistema recupero password', 'Reset password via email con token sicuri', 'medium', 'in_progress', 'feature', 3, 5, 2, 8.00, 4.00, '2025-07-22'),
('Audit log accessi', 'Tracciare tutti gli accessi utente', 'low', 'in_review', 'feature', 3, 2, 2, 6.00, 5.50, '2025-07-26'),
('JWT refresh token', 'Implementare refresh automatico dei token', 'high', 'done', 'improvement', 3, 5, 2, 10.00, 9.00, '2025-07-05'),

-- Dashboard Analytics (id: 4)
('Grafici tempo reale', 'Dashboard con aggiornamento dati in tempo reale', 'high', 'todo', 'feature', 4, 2, 1, 18.00, NULL, '2025-08-05'),
('Export dati Excel/PDF', 'Funzionalità export report in vari formati', 'medium', 'in_progress', 'feature', 4, 5, 1, 12.00, 6.00, '2025-07-28'),
('Filtri avanzati', 'Sistema di filtri complesso per i dati', 'medium', 'in_review', 'improvement', 4, 2, 1, 8.00, 7.00, '2025-07-24'),
('Ottimizzazione query database', 'Migliorare performance delle query complesse', 'high', 'done', 'improvement', 4, 3, 1, 12.00, 11.00, '2025-07-06'),

-- API Gateway (id: 5)
('Rate limiting', 'Implementare rate limiting per le API', 'high', 'todo', 'feature', 5, 3, 3, 10.00, NULL, '2025-07-30'),
('Caching Redis', 'Sistema di cache con Redis per performance', 'medium', 'in_progress', 'improvement', 5, 5, 3, 14.00, 7.00, '2025-08-02'),
('API versioning', 'Sistema di versionamento delle API', 'low', 'in_review', 'improvement', 5, 2, 3, 8.00, 6.00, '2025-07-25'),
('Documentazione Swagger', 'Documentazione completa API con Swagger', 'medium', 'done', 'task', 5, 5, 3, 6.00, 5.00, '2025-07-09');

-- Inserimento commenti realistici per test
INSERT INTO comments (id_issue, id_user, content) VALUES
-- Commenti per E-Commerce Platform (issue IDs: 1-8)
(1, 2, 'Ho iniziato a lavorare sul carrello, sto usando la libreria React Context per lo stato globale.'),
(1, 1, 'Perfetto! Ricordati di aggiungere la validazione per la quantità massima di prodotti.'),
(2, 3, 'Stripe mi sembra la scelta migliore per iniziare, ha una documentazione molto chiara.'),
(3, 2, 'Ho fatto il responsive per tablet, ora sto lavorando sul mobile. Sto usando CSS Grid.'),
(5, 3, 'Bug risolto! Era un problema di arrotondamento nei decimali. Ho aggiunto i test.'),
(5, 1, 'Ottimo lavoro! Puoi fare il merge quando sei pronto.'),

-- Commenti per Mobile App (issue IDs: 9-12)
(9, 3, 'L\'autenticazione biometrica è più complessa del previsto, potrebbe servire più tempo.'),
(10, 2, 'La sincronizzazione offline sta funzionando bene. Sto testando con dati di grandi dimensioni.'),
(11, 3, 'Le notifiche push sono pronte per il test. Ho configurato Firebase Cloud Messaging.'),

-- Commenti per Sistema Autenticazione (issue IDs: 13-17)
(13, 5, 'OAuth con Google è quasi completo, ora sto lavorando sull\'integrazione con GitHub.'),
(15, 5, 'Il sistema di recovery password è funzionante. I token scadono dopo 1 ora.'),
(17, 5, 'JWT refresh implementato con successo! I token hanno durata di 15 minuti.'),

-- Commenti per Dashboard Analytics (issue IDs: 18-21)
(18, 2, 'Sto usando Chart.js per i grafici. Il websocket per il tempo reale è già configurato.'),
(19, 5, 'Export Excel completato, ora sto lavorando sul PDF con jsPDF.'),
(21, 3, 'Le query sono ora 3x più veloci! Ho aggiunto indici su tutte le colonne critiche.'),

-- Commenti per API Gateway (issue IDs: 22-25)
(22, 3, 'Rate limiting implementato con Redis. Default: 100 richieste per minuto per utente.'),
(23, 5, 'Cache Redis funziona perfettamente. TTL di 5 minuti per le query più frequenti.'),
(25, 5, 'Swagger UI è online! Tutte le API sono documentate con esempi.');