-- Inserimento utenti di esempio per test
INSERT INTO users (username, email, password, full_name, role) VALUES
('davide', 'davide@test.com', 'secure456', 'Davide Conti', 'admin'),
('francesca', 'francesca@test.com', 'secure456', 'Francesca Romano', 'developer'),
('matteo', 'matteo@test.com', 'secure456', 'Matteo Bruno', 'developer'),
('chiara', 'chiara@test.com', 'secure456', 'Chiara Marino', 'tester'),
('alessandro', 'alessandro@test.com', 'secure456', 'Alessandro Ricci', 'developer'),
('valentina', 'valentina@test.com', 'vale789', 'Valentina Galli', 'tester');

-- Inserimento progetti di test
INSERT INTO projects (name, description, created_by, status) VALUES
('Online Store Pro', 'Piattaforma vendita online con sistema pagamenti integrato', 1, 'active'),
('TaskFlow Mobile', 'Applicazione mobile per gestione task e progetti', 1, 'active'),
('SecureAuth Hub', 'Sistema avanzato di autenticazione e controllo accessi', 2, 'active'),
('DataViz Dashboard', 'Dashboard interattiva per visualizzazione dati e metriche', 1, 'active'),
('Central API Core', 'Hub centralizzato per gestione e routing delle API', 3, 'active');

-- Inserimento issue per testare la board Kanban
INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) VALUES
-- Online Store Pro (id: 1) - Issue distribuite in tutte le colonne
('Implementare wishlist prodotti', 'Sviluppare funzionalità lista desideri con salvataggio/rimozione', 'high', 'todo', 'feature', 1, 2, 1, 16.00, NULL, '2025-07-20'),
('Integrazione sistemi pagamento', 'Integrare PayPal e Apple Pay per transazioni', 'critical', 'todo', 'feature', 1, 3, 1, 20.00, NULL, '2025-07-18'),
('Vetrina prodotti adaptive', 'Ottimizzare la vetrina per tutti i dispositivi', 'medium', 'in_progress', 'improvement', 1, 2, 1, 12.00, 5.00, '2025-07-22'),
('Sistema valutazioni clienti', 'Permettere ai clienti di valutare i prodotti acquistati', 'low', 'in_progress', 'feature', 1, 5, 1, 8.00, 3.00, '2025-07-25'),
('Fix bug calcolo sconti multipli', 'Il calcolo degli sconti cumulativi non funziona', 'high', 'in_review', 'bug', 1, 3, 2, 4.00, 4.00, '2025-07-15'),
('Ottimizzazione performance pagamento', 'Accelerare il processo di finalizzazione ordine', 'medium', 'in_review', 'improvement', 1, 2, 1, 6.00, 5.00, '2025-07-16'),
('Setup ambiente staging', 'Configurare ambiente di pre-produzione per test', 'medium', 'done', 'task', 1, 5, 1, 8.00, 7.00, '2025-07-10'),
('Design sistema alerts', 'Progettare interfaccia per notifiche transazioni', 'low', 'done', 'task', 1, 6, 1, 4.00, 3.50, '2025-07-12'),

-- TaskFlow Mobile (id: 2)
('Autenticazione FaceID', 'Implementare login con riconoscimento facciale', 'high', 'todo', 'feature', 2, 3, 1, 12.00, NULL, '2025-07-28'),
('Backup cloud automatico', 'Permettere backup automatico con sincronizzazione cloud', 'high', 'in_progress', 'feature', 2, 2, 1, 20.00, 8.00, '2025-08-01'),
('Messaggi in-app', 'Sistema di messaggistica integrata per collaborazione', 'medium', 'in_review', 'feature', 2, 3, 1, 10.00, 9.00, '2025-07-20'),
('Release store pubblicazione', 'Distribuzione su App Store e Google Play Store', 'high', 'done', 'task', 2, 1, 1, 6.00, 5.00, '2025-07-08'),

-- SecureAuth Hub (id: 3)
('OAuth Microsoft/LinkedIn', 'Implementare login aziendale con OAuth2', 'high', 'todo', 'feature', 3, 5, 2, 14.00, NULL, '2025-07-25'),
('Multi-factor authentication', 'Aggiungere autenticazione multi-fattore avanzata', 'medium', 'todo', 'feature', 3, 3, 2, 16.00, NULL, '2025-07-30'),
('Sistema reset credenziali', 'Recovery account via SMS e email sicuri', 'medium', 'in_progress', 'feature', 3, 5, 2, 8.00, 4.00, '2025-07-22'),
('Log sicurezza avanzato', 'Monitoraggio completo attività utenti', 'low', 'in_review', 'feature', 3, 2, 2, 6.00, 5.50, '2025-07-26'),
('Token session management', 'Gestione automatica sessioni e refresh token', 'high', 'done', 'improvement', 3, 5, 2, 10.00, 9.00, '2025-07-05'),

-- DataViz Dashboard (id: 4)
('Widget interattivi live', 'Dashboard con widget aggiornati in tempo reale', 'high', 'todo', 'feature', 4, 2, 1, 18.00, NULL, '2025-08-05'),
('Export report CSV/JSON', 'Funzionalità esportazione dati in formati multipli', 'medium', 'in_progress', 'feature', 4, 5, 1, 12.00, 6.00, '2025-07-28'),
('Ricerca intelligente', 'Sistema di ricerca avanzata con filtri dinamici', 'medium', 'in_review', 'improvement', 4, 2, 1, 8.00, 7.00, '2025-07-24'),
('Ottimizzazione engine dati', 'Migliorare velocità elaborazione dataset complessi', 'high', 'done', 'improvement', 4, 3, 1, 12.00, 11.00, '2025-07-06'),

-- Central API Core (id: 5)
('Throttling requests', 'Implementare limitazione richieste per endpoint', 'high', 'todo', 'feature', 5, 3, 3, 10.00, NULL, '2025-07-30'),
('Cache layer MongoDB', 'Sistema di cache distribuita con MongoDB per performance', 'medium', 'in_progress', 'improvement', 5, 5, 3, 14.00, 7.00, '2025-08-02'),
('Versioning automatico', 'Sistema di versioning intelligente delle API', 'low', 'in_review', 'improvement', 5, 2, 3, 8.00, 6.00, '2025-07-25'),
('Documentazione OpenAPI', 'Documentazione interattiva API con OpenAPI 3.0', 'medium', 'done', 'task', 5, 5, 3, 6.00, 5.00, '2025-07-09');

-- Inserimento commenti realistici per test
INSERT INTO comments (id_issue, id_user, content) VALUES
-- Commenti per Online Store Pro (issue IDs: 1-8)
(1, 2, 'Ho iniziato a lavorare sulla wishlist, sto usando Redux Toolkit per la gestione stato.'),
(1, 1, 'Perfetto! Ricordati di aggiungere la sincronizzazione con l\'account utente.'),
(2, 3, 'PayPal SDK è ben documentato, ora sto integrando Apple Pay per iOS.'),
(3, 2, 'Ho ottimizzato la vetrina per tablet, ora sto lavorando sulle animazioni. Uso Framer Motion.'),
(5, 3, 'Bug risolto! Era un conflitto tra sconti percentuali e fissi. Test aggiunti.'),
(5, 1, 'Ottimo lavoro! Puoi procedere con il deploy quando sei pronto.'),

-- Commenti per TaskFlow Mobile (issue IDs: 9-12)
(9, 3, 'FaceID richiede configurazioni specifiche per iOS, sto studiando la documentazione Apple.'),
(10, 2, 'Il backup cloud funziona perfettamente. Sto testando con progetti di grandi dimensioni.'),
(11, 3, 'I messaggi in-app sono quasi pronti. Ho implementato WebSocket per real-time.'),

-- Commenti per SecureAuth Hub (issue IDs: 13-17)
(13, 5, 'OAuth con Microsoft è completo, ora sto lavorando sull\'integrazione LinkedIn.'),
(15, 5, 'Il sistema di recovery è attivo. Token SMS scadono dopo 10 minuti, email dopo 1 ora.'),
(17, 5, 'Session management implementato! Auto-refresh ogni 15 minuti con fallback.'),

-- Commenti per DataViz Dashboard (issue IDs: 18-21)
(18, 2, 'Sto usando D3.js per widget personalizzati. WebSocket per aggiornamenti real-time configurato.'),
(19, 5, 'Export CSV completato, ora sto implementando JSON con schema validation.'),
(21, 3, 'Engine dati ottimizzato! Performance migliorate del 400% con nuovi algoritmi.'),

-- Commenti per Central API Core (issue IDs: 22-25)
(22, 3, 'Throttling implementato con algoritmo sliding window. Limite: 150 req/min per utente.'),
(23, 5, 'Cache MongoDB funziona ottimamente. TTL dinamico basato su frequenza di utilizzo.'),
(25, 5, 'OpenAPI 3.0 è live! Documentazione interattiva con esempi e sandbox di test.');