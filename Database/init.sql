-- Inserimento utenti di esempio per test
INSERT INTO users (username, email, password, full_name, role, created_at) VALUES
-- Admin: gestisce solo gli utenti, non partecipa a progetti/issue/commenti
('davide', 'davide@test.com', 'secure456', 'Davide Conti', 'admin', '2024-01-15 10:30:00'),
('giulia', 'giulia@test.com', 'secure456', 'Giulia Ferri', 'admin', '2024-01-20 11:00:00'),
-- Project Manager: possono creare progetti, issue e commenti
('francesca', 'francesca@test.com', 'secure456', 'Francesca Romano', 'project_manager', '2024-02-20 14:45:00'),
('roberto', 'roberto@test.com', 'secure456', 'Roberto Marchetti', 'project_manager', '2024-02-25 09:30:00'),
('elena', 'elena@test.com', 'secure456', 'Elena Santoro', 'project_manager', '2024-03-01 10:15:00'),
-- Developer: possono creare issue e commenti
('matteo', 'matteo@test.com', 'secure456', 'Matteo Bruno', 'developer', '2024-03-10 09:15:00'),
('alessandro', 'alessandro@test.com', 'secure456', 'Alessandro Ricci', 'developer', '2024-05-12 11:00:00'),
('luca', 'luca@test.com', 'secure456', 'Luca Colombo', 'developer', '2024-05-15 14:20:00'),
-- Tester: possono solo modificare issue e creare commenti
('chiara', 'chiara@test.com', 'secure456', 'Chiara Marino', 'tester', '2024-04-05 16:20:00'),
('valentina', 'valentina@test.com', 'vale789', 'Valentina Galli', 'tester', '2024-06-18 13:30:00'),
('sofia', 'sofia@test.com', 'secure456', 'Sofia Greco', 'tester', '2024-06-22 15:45:00');

-- Inserimento progetti di test
-- Solo i project manager possono creare progetti
-- ID utenti: Francesca=3, Roberto=4, Elena=5
INSERT INTO projects (name, description, created_by, status) VALUES
('Online Store Pro', 'Piattaforma vendita online con sistema pagamenti integrato', 3, 'active'),
('TaskFlow Mobile', 'Applicazione mobile per gestione task e progetti', 3, 'active'),
('SecureAuth Hub', 'Sistema avanzato di autenticazione e controllo accessi', 4, 'active'),
('DataViz Dashboard', 'Dashboard interattiva per visualizzazione dati e metriche', 4, 'active'),
('Central API Core', 'Hub centralizzato per gestione e routing delle API', 5, 'active');

-- Inserimento issue per testare la board Kanban
-- ID utenti: PM: 3,4,5 | Dev: 6,7,8 | Tester: 9,10,11
-- PM e Dev possono creare issue, Tester NO
-- Le issue in_review e done sono assegnate ai Tester (hanno completato la verifica)
INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) VALUES
-- Online Store Pro (id: 1, PM: Francesca=3) - Issue distribuite in tutte le colonne
('Implementare wishlist prodotti', 'Sviluppare funzionalità lista desideri con salvataggio/rimozione', 'high', 'todo', 'feature', 1, 6, 3, 16.00, NULL, '2025-07-20'),
('Integrazione sistemi pagamento', 'Integrare PayPal e Apple Pay per transazioni', 'critical', 'todo', 'feature', 1, 7, 3, 20.00, NULL, '2025-07-18'),
('Vetrina prodotti adaptive', 'Ottimizzare la vetrina per tutti i dispositivi', 'medium', 'in_progress', 'improvement', 1, 6, 6, 12.00, 5.00, '2025-07-22'),
('Sistema valutazioni clienti', 'Permettere ai clienti di valutare i prodotti acquistati', 'low', 'in_progress', 'feature', 1, 7, 3, 8.00, 3.00, '2025-07-25'),
('Fix bug calcolo sconti multipli', 'Il calcolo degli sconti cumulativi non funziona', 'high', 'in_review', 'bug', 1, 9, 6, 4.00, 4.00, '2025-07-15'),
('Ottimizzazione performance pagamento', 'Accelerare il processo di finalizzazione ordine', 'medium', 'in_review', 'improvement', 1, 10, 3, 6.00, 5.00, '2025-07-16'),
('Setup ambiente staging', 'Configurare ambiente di pre-produzione per test', 'medium', 'done', 'task', 1, 11, 3, 8.00, 7.00, '2025-07-10'),
('Design sistema alerts', 'Progettare interfaccia per notifiche transazioni', 'low', 'done', 'task', 1, 9, 3, 4.00, 3.50, '2025-07-12'),

-- TaskFlow Mobile (id: 2, PM: Francesca=3)
('Autenticazione FaceID', 'Implementare login con riconoscimento facciale', 'high', 'todo', 'feature', 2, 7, 3, 12.00, NULL, '2025-07-28'),
('Backup cloud automatico', 'Permettere backup automatico con sincronizzazione cloud', 'high', 'in_progress', 'feature', 2, 6, 3, 20.00, 8.00, '2025-08-01'),
('Messaggi in-app', 'Sistema di messaggistica integrata per collaborazione', 'medium', 'in_review', 'feature', 2, 11, 7, 10.00, 9.00, '2025-07-20'),
('Release store pubblicazione', 'Distribuzione su App Store e Google Play Store', 'high', 'done', 'task', 2, 10, 3, 6.00, 5.00, '2025-07-08'),

-- SecureAuth Hub (id: 3, PM: Roberto=4)
('OAuth Microsoft/LinkedIn', 'Implementare login aziendale con OAuth2', 'high', 'todo', 'feature', 3, 8, 4, 14.00, NULL, '2025-07-25'),
('Multi-factor authentication', 'Aggiungere autenticazione multi-fattore avanzata', 'medium', 'todo', 'feature', 3, 7, 7, 16.00, NULL, '2025-07-30'),
('Sistema reset credenziali', 'Recovery account via SMS e email sicuri', 'medium', 'in_progress', 'feature', 3, 8, 6, 8.00, 4.00, '2025-07-22'),
('Log sicurezza avanzato', 'Monitoraggio completo attività utenti', 'low', 'in_review', 'feature', 3, 9, 4, 6.00, 5.50, '2025-07-26'),
('Token session management', 'Gestione automatica sessioni e refresh token', 'high', 'done', 'improvement', 3, 9, 8, 10.00, 9.00, '2025-07-05'),

-- DataViz Dashboard (id: 4, PM: Roberto=4)
('Widget interattivi live', 'Dashboard con widget aggiornati in tempo reale', 'high', 'todo', 'feature', 4, 6, 4, 18.00, NULL, '2025-08-05'),
('Export report CSV/JSON', 'Funzionalità esportazione dati in formati multipli', 'medium', 'in_progress', 'feature', 4, 7, 6, 12.00, 6.00, '2025-07-28'),
('Ricerca intelligente', 'Sistema di ricerca avanzata con filtri dinamici', 'medium', 'in_review', 'improvement', 4, 10, 7, 8.00, 7.00, '2025-07-24'),
('Ottimizzazione engine dati', 'Migliorare velocità elaborazione dataset complessi', 'high', 'done', 'improvement', 4, 10, 4, 12.00, 11.00, '2025-07-06'),

-- Central API Core (id: 5, PM: Elena=5)
('Throttling requests', 'Implementare limitazione richieste per endpoint', 'high', 'todo', 'feature', 5, 7, 8, 10.00, NULL, '2025-07-30'),
('Cache layer MongoDB', 'Sistema di cache distribuita con MongoDB per performance', 'medium', 'in_progress', 'improvement', 5, 8, 6, 14.00, 7.00, '2025-08-02'),
('Versioning automatico', 'Sistema di versioning intelligente delle API', 'low', 'in_review', 'improvement', 5, 11, 5, 8.00, 6.00, '2025-07-25'),
('Documentazione OpenAPI', 'Documentazione interattiva API con OpenAPI 3.0', 'medium', 'done', 'task', 5, 11, 5, 6.00, 5.00, '2025-07-09'),

-- Issue aggiuntive per Online Store Pro (id: 1, PM: Francesca=3)
('Sistema raccomandazioni AI', 'Implementare algoritmo ML per suggerimenti prodotti personalizzati', 'high', 'todo', 'feature', 1, 8, 3, 24.00, NULL, '2025-08-10'),
('Gestione inventario real-time', 'Sincronizzazione quantità disponibili in tempo reale', 'critical', 'in_progress', 'feature', 1, 6, 6, 18.00, 9.00, '2025-07-27'),
('Fix crash carrello vuoto', 'L\'app crasha quando si apre carrello senza prodotti', 'critical', 'in_review', 'bug', 1, 9, 7, 3.00, 2.50, '2025-07-14'),
('Dashboard vendite analytics', 'Creare dashboard per monitoraggio vendite e metriche', 'medium', 'todo', 'feature', 1, 7, 3, 14.00, NULL, '2025-08-05'),

-- Issue aggiuntive per TaskFlow Mobile (id: 2, PM: Francesca=3)
('Widget home screen iOS', 'Widget per visualizzare task urgenti dalla home', 'medium', 'todo', 'feature', 2, 8, 3, 10.00, NULL, '2025-08-08'),
('Dark mode completo', 'Implementare tema scuro per tutta l\'applicazione', 'low', 'in_progress', 'improvement', 2, 6, 7, 8.00, 4.00, '2025-07-29'),
('Condivisione task via link', 'Permettere condivisione task tramite link dinamici', 'medium', 'in_review', 'feature', 2, 10, 6, 6.00, 5.50, '2025-07-21'),
('Statistiche produttività', 'Grafici e metriche per tracciare produttività personale', 'low', 'done', 'feature', 2, 11, 3, 10.00, 9.00, '2025-07-11'),

-- Issue aggiuntive per SecureAuth Hub (id: 3, PM: Roberto=4)
('Biometric authentication', 'Supporto per impronta digitale su dispositivi compatibili', 'high', 'todo', 'feature', 3, 6, 4, 12.00, NULL, '2025-08-02'),
('Password strength validator', 'Validatore avanzato con suggerimenti sicurezza', 'medium', 'in_progress', 'improvement', 3, 7, 8, 6.00, 3.00, '2025-07-26'),
('Fix timeout sessione', 'Timeout sessione non rispetta il valore configurato', 'high', 'in_review', 'bug', 3, 11, 6, 4.00, 3.50, '2025-07-17'),
('Rate limiting login', 'Protezione contro brute force attacks sui login', 'critical', 'done', 'security', 3, 9, 4, 8.00, 7.00, '2025-07-07'),

-- Issue aggiuntive per DataViz Dashboard (id: 4, PM: Roberto=4)
('Template dashboard custom', 'Permettere agli utenti di creare template personalizzati', 'medium', 'todo', 'feature', 4, 8, 4, 16.00, NULL, '2025-08-12'),
('Filtri avanzati temporali', 'Aggiungere filtri per range temporali e confronti', 'medium', 'in_progress', 'feature', 4, 6, 7, 10.00, 5.00, '2025-07-31'),
('Notifiche anomalie dati', 'Sistema di alert automatico per valori anomali', 'high', 'todo', 'feature', 4, 7, 4, 14.00, NULL, '2025-08-06'),

-- Issue aggiuntive per Central API Core (id: 5, PM: Elena=5)
('Webhooks sistema eventi', 'Implementare sistema webhooks per notifiche eventi', 'high', 'in_progress', 'feature', 5, 7, 5, 20.00, 10.00, '2025-08-04'),
('Health check endpoints', 'Endpoint per monitoraggio stato servizi', 'medium', 'in_review', 'task', 5, 10, 8, 4.00, 3.50, '2025-07-23'),
('GraphQL support', 'Aggiungere supporto GraphQL oltre alle REST API', 'low', 'todo', 'feature', 5, 8, 5, 22.00, NULL, '2025-08-15'),
('Fix memory leak cache', 'Memory leak nel sistema di caching dopo uso prolungato', 'critical', 'done', 'bug', 5, 11, 6, 6.00, 5.00, '2025-07-04');

-- Inserimento commenti realistici per test
-- Admin NON commentano. PM, Dev e Tester possono commentare
-- ID utenti: PM: 3,4,5 | Dev: 6,7,8 | Tester: 9,10,11
INSERT INTO comments (id_issue, id_user, content) VALUES
-- Commenti per Online Store Pro (issue IDs: 1-8)
(1, 6, 'Ho iniziato a lavorare sulla wishlist, sto usando Redux Toolkit per la gestione stato.'),
(1, 3, 'Perfetto! Ricordati di aggiungere la sincronizzazione con l\'account utente.'),
(1, 9, 'Ho testato il prototipo, funziona bene ma suggerirei di aggiungere feedback visivo quando si aggiunge un item.'),
(2, 7, 'PayPal SDK è ben documentato, ora sto integrando Apple Pay per iOS.'),
(2, 10, 'Verificherò la sicurezza dei pagamenti appena l\'integrazione è completa.'),
(3, 6, 'Ho ottimizzato la vetrina per tablet, ora sto lavorando sulle animazioni. Uso Framer Motion.'),
(5, 7, 'Bug risolto! Era un conflitto tra sconti percentuali e fissi. Test aggiunti.'),
(5, 9, 'Confermato! Ho testato vari scenari e il calcolo ora è corretto.'),

-- Commenti per TaskFlow Mobile (issue IDs: 9-12)
(9, 7, 'FaceID richiede configurazioni specifiche per iOS, sto studiando la documentazione Apple.'),
(9, 3, 'Ottimo, assicurati di gestire anche il fallback con PIN in caso FaceID non sia disponibile.'),
(10, 6, 'Il backup cloud funziona perfettamente. Sto testando con progetti di grandi dimensioni.'),
(10, 10, 'Testato con un progetto di 500+ task, sincronizzazione completata in meno di 5 secondi.'),
(11, 7, 'I messaggi in-app sono quasi pronti. Ho implementato WebSocket per real-time.'),
(11, 11, 'Ho verificato la funzionalità, manca solo la gestione delle notifiche push quando l\'app è in background.'),

-- Commenti per SecureAuth Hub (issue IDs: 13-17)
(13, 8, 'OAuth con Microsoft è completo, ora sto lavorando sull\'integrazione LinkedIn.'),
(13, 4, 'Fantastico! Verifica che i token di refresh vengano gestiti correttamente.'),
(15, 8, 'Il sistema di recovery è attivo. Token SMS scadono dopo 10 minuti, email dopo 1 ora.'),
(15, 9, 'Testato il flusso completo di recupero password, tutto funziona come previsto.'),
(17, 8, 'Session management implementato! Auto-refresh ogni 15 minuti con fallback.'),
(17, 10, 'Ho verificato che le sessioni vengano invalidate correttamente dopo il logout.'),

-- Commenti per DataViz Dashboard (issue IDs: 18-21)
(18, 6, 'Sto usando D3.js per widget personalizzati. WebSocket per aggiornamenti real-time configurato.'),
(18, 4, 'Assicurati che i widget siano responsive anche su schermi piccoli.'),
(19, 7, 'Export CSV completato, ora sto implementando JSON con schema validation.'),
(19, 11, 'Ho testato l\'export di dataset grandi (100k+ righe), performance eccellenti.'),
(21, 7, 'Engine dati ottimizzato! Performance migliorate del 400% con nuovi algoritmi.'),
(21, 9, 'Confermo il miglioramento, i test di carico mostrano risultati ottimi.'),

-- Commenti per Central API Core (issue IDs: 22-25)
(22, 7, 'Throttling implementato con algoritmo sliding window. Limite: 150 req/min per utente.'),
(22, 5, 'Perfetto! Assicurati di documentare i rate limits nella documentazione API.'),
(23, 8, 'Cache MongoDB funziona ottimamente. TTL dinamico basato su frequenza di utilizzo.'),
(23, 10, 'Ho testato con diversi pattern di accesso, la cache riduce i tempi di risposta del 70%.'),
(25, 8, 'OpenAPI 3.0 è live! Documentazione interattiva con esempi e sandbox di test.'),
(25, 5, 'Eccellente! Questo renderà molto più facile l\'onboarding di nuovi developer.'),

-- Commenti per le nuove issue di Online Store Pro
(26, 8, 'Sto valutando TensorFlow.js per implementare il sistema di raccomandazioni lato client.'),
(26, 3, 'Buona scelta! Considera anche di implementare A/B testing per verificare l\'efficacia.'),
(27, 6, 'WebSocket configurato per sync real-time inventario. Prestazioni eccellenti!'),
(27, 9, 'Testato con 1000+ prodotti simultanei, la sincronizzazione è istantanea.'),
(28, 7, 'Bug identificato! Era un null pointer sul check iniziale del carrello. Fix pronto.'),
(28, 9, 'Confermato risolto. Ho testato tutti gli edge case, nessun crash.'),
(29, 7, 'Per la dashboard userò Chart.js con aggregazioni server-side per performance.'),
(29, 3, 'Ottimo! Aggiungi anche export PDF per i report mensili.'),

-- Commenti per le nuove issue di TaskFlow Mobile
(30, 8, 'Widget iOS richiede WidgetKit, sto studiando la API Apple per aggiornamenti ottimali.'),
(30, 10, 'Serve anche versione Android con App Widgets per parità di funzionalità.'),
(31, 6, 'Dark mode implementato con Context API. Supporta preferenza sistema e toggle manuale.'),
(31, 11, 'Testato su iOS e Android, i colori sono accessibili e rispettano WCAG 2.1.'),
(32, 6, 'Link dinamici creati con Firebase Dynamic Links. Funzionano su web e mobile.'),
(32, 10, 'Ho verificato deep linking, funziona perfettamente anche con app non installata.'),
(33, 7, 'Dashboard produttività completa! Grafici settimanali, mensili e annuali implementati.'),
(33, 3, 'Fantastico lavoro! Gli utenti apprezzeranno molto questa feature.'),

-- Commenti per le nuove issue di SecureAuth Hub
(34, 6, 'Sto usando Web Authentication API per biometrica. Compatibile con FIDO2.'),
(34, 4, 'Perfetto! Assicurati di gestire fallback per browser non supportati.'),
(35, 7, 'Validator implementato con zxcvbn library. Suggerimenti in tempo reale attivi.'),
(35, 11, 'Testato con password comuni e complesse, i suggerimenti sono molto utili.'),
(36, 6, 'Timeout corretto! Era un problema di conversione tra secondi e millisecondi.'),
(36, 11, 'Verificato con diversi timeout configurati, ora rispetta sempre il valore.'),
(37, 8, 'Rate limiting attivo! Max 5 tentativi ogni 15 minuti per IP. Poi blocco temporaneo.'),
(37, 4, 'Eccellente! Questo previene efficacemente attacchi brute force.'),

-- Commenti per le nuove issue di DataViz Dashboard
(38, 8, 'Sistema template drag-and-drop quasi pronto. Sto usando React DnD Kit.'),
(38, 4, 'Ottimo! Permetti anche il salvataggio e condivisione template tra utenti.'),
(39, 6, 'Filtri temporali implementati: oggi, settimana, mese, custom range, confronto periodi.'),
(39, 10, 'Testato tutti i filtri, funzionano perfettamente e i dati sono accurati.'),
(40, 7, 'Sistema alert configurato con soglie personalizzabili per ogni metrica.'),
(40, 9, 'Ho testato con valori anomali simulati, notifiche arrivano istantaneamente.'),

-- Commenti per le nuove issue di Central API Core
(41, 7, 'Webhooks implementati! Eventi: create, update, delete. Retry automatico su failure.'),
(41, 5, 'Perfetto! Aggiungi anche signature HMAC per validazione autenticità payload.'),
(41, 11, 'Ho testato i webhooks con vari servizi, il retry funziona con backoff esponenziale.'),
(42, 8, 'Health check endpoints pronti: /health (basic), /health/detailed (metriche complete).'),
(42, 10, 'Verificato, forniscono info utili su database, cache, memoria, CPU.'),
(43, 8, 'Sto valutando Apollo Server per GraphQL. Schema generation da REST esistenti.'),
(43, 5, 'Buona scelta! Assicurati di mantenere retrocompatibilità con REST.'),
(44, 6, 'Memory leak trovato e risolto! Era un event listener non rimosso correttamente.'),
(44, 11, 'Confermato! Test di stress 24h completato, memoria stabile.');