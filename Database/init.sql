-- Inserimento utenti moderni e diversificati (password: "password123" con hash bcrypt)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin_elena', 'elena.ferrari@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Elena Ferrari', 'admin'),
('dev_alessandro', 'alessandro.rossi@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Alessandro Rossi', 'developer'),
('dev_sofia', 'sofia.bianchi@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Sofia Bianchi', 'developer'),
('test_giulia', 'giulia.romano@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Giulia Romano', 'tester'),
('dev_matteo', 'matteo.conti@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Matteo Conti', 'developer'),
('test_chiara', 'chiara.moretti@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Chiara Moretti', 'tester'),
('admin_luca', 'luca.ricci@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Luca Ricci', 'admin'),
('dev_francesca', 'francesca.bruno@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Francesca Bruno', 'developer'),
('test_marco', 'marco.galli@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Marco Galli', 'tester'),
('dev_valentina', 'valentina.costa@issuenet.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtqgD/h2hO', 'Valentina Costa', 'developer');

-- Inserimento progetti moderni e realistici
INSERT INTO projects (name, description, created_by, status) VALUES
('EcoTracker Mobile', 'Sustainable lifestyle tracking app with carbon footprint monitoring', 1, 'active'),
('AI Content Generator', 'Machine learning platform for automated content creation', 7, 'active'),
('FinTech Dashboard', 'Real-time financial analytics and trading platform', 1, 'active'),
('Smart Home Hub', 'IoT device management and automation system', 2, 'active'),
('HealthTech Portal', 'Telemedicine platform with appointment scheduling', 7, 'active'),
('CryptoWallet Pro', 'Multi-currency cryptocurrency wallet with DeFi integration', 2, 'active'),
('EdTech Platform', 'Interactive online learning management system', 1, 'active'),
('SocialMedia Analytics', 'Advanced social media monitoring and sentiment analysis', 7, 'archived'),
('CloudSecure Backup', 'Enterprise-grade cloud backup and disaster recovery', 2, 'active'),
('GameDev Studio Tools', 'Game development pipeline and asset management tools', 1, 'active');

-- Inserimento issue moderne e realistiche
INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) VALUES
('Implement biometric authentication', 'Add fingerprint and face recognition for enhanced security', 'high', 'in_progress', 'feature', 1, 2, 1, 16.00, 6.50, '2024-12-15'),
('Fix React Native navigation bug', 'Navigation stack not properly resetting on logout', 'critical', 'todo', 'bug', 1, 3, 2, 8.00, NULL, '2024-12-08'),
('Optimize AI model inference', 'Reduce response time from 2.5s to under 1s', 'medium', 'in_review', 'improvement', 2, 5, 7, 20.00, 18.00, '2024-12-20'),
('Add real-time notifications', 'WebSocket implementation for live updates', 'high', 'todo', 'feature', 3, 8, 1, 12.00, NULL, '2024-12-12'),
('Migrate to Kubernetes', 'Containerize services and deploy on K8s cluster', 'medium', 'in_progress', 'task', 4, 2, 7, 32.00, 15.00, '2024-12-25'),
('Implement dark mode', 'Add system-aware dark theme support', 'low', 'done', 'feature', 5, 10, 7, 10.00, 8.50, '2024-12-01'),
('Security vulnerability scan', 'Comprehensive security audit and penetration testing', 'critical', 'in_progress', 'task', 6, 6, 7, 24.00, 12.00, '2024-12-10'),
('Database performance optimization', 'Optimize slow queries and add proper indexing', 'high', 'todo', 'improvement', 7, 5, 1, 14.00, NULL, '2024-12-18'),
('Social media API rate limits', 'Handle Twitter API v2 rate limiting gracefully', 'medium', 'in_review', 'bug', 8, 3, 7, 6.00, 4.50, '2024-12-14'),
('Implement automated testing', 'Add comprehensive E2E test suite with Playwright', 'medium', 'todo', 'task', 9, 4, 2, 18.00, NULL, '2024-12-22'),
('Add multiplayer support', 'Real-time multiplayer gaming with WebRTC', 'high', 'in_progress', 'feature', 10, 8, 1, 40.00, 22.00, '2024-12-30'),
('GDPR compliance audit', 'Ensure full compliance with data protection regulations', 'critical', 'todo', 'task', 3, 9, 7, 16.00, NULL, '2024-12-16'),
('Mobile app crashes on iOS 18', 'App crashes when accessing camera on latest iOS', 'high', 'in_review', 'bug', 1, 2, 4, 8.00, 6.00, '2024-12-09'),
('Implement Redis caching', 'Add distributed caching layer for better performance', 'medium', 'done', 'improvement', 4, 5, 2, 12.00, 10.50, '2024-12-05'),
('Add blockchain integration', 'Smart contract integration for transaction verification', 'low', 'todo', 'feature', 6, 10, 7, 28.00, NULL, '2024-12-28');

-- Inserimento commenti significativi e moderni
INSERT INTO comments (id_issue, id_user, content) VALUES
(1, 2, 'Ho iniziato l''implementazione con Touch ID/Face ID. La libreria react-native-biometrics sembra promettente.'),
(1, 1, 'Perfetto! Assicurati di gestire anche i dispositivi senza biometria con fallback al PIN.'),
(2, 3, 'Il bug sembra essere causato da un memory leak nel navigation state. Sto investigando.'),
(2, 4, 'Ho visto questo problema anche su altri progetti RN. Prova a resettare lo stack manualmente.'),
(3, 5, 'Ottimizzazione in corso: ho ridotto la dimensione del modello del 30% con quantizzazione.'),
(3, 7, 'Eccellente! Considera anche l''uso di TensorFlow Lite per mobile deployment.'),
(4, 8, 'WebSocket server configurato con Socket.io. Devo ancora implementare l''autenticazione.'),
(4, 1, 'Per l''auth dei WebSocket, usa il JWT token nel handshake.'),
(5, 2, 'Cluster Kubernetes configurato su AWS EKS. Helm charts pronti per il deployment.'),
(5, 7, 'Ottimo lavoro! Non dimenticare di configurare il monitoring con Prometheus.'),
(6, 10, 'Dark mode implementato con CSS custom properties. Supporta anche system preference.'),
(6, 7, 'Perfetto! Aggiungi anche il toggle manuale per gli utenti che preferiscono forzare un tema.'),
(7, 6, 'Security scan completato con OWASP ZAP. Trovate 3 vulnerabilità di media priorità.'),
(7, 7, 'Condividi il report dettagliato così possiamo prioritizzare le fix.'),
(8, 5, 'Query ottimizzate e aggiunti indici compositi. Performance migliorata del 60%.'),
(9, 3, 'Implementato exponential backoff per gestire i rate limits di Twitter API.'),
(10, 4, 'Test suite quasi completa. Playwright configurato per test cross-browser.'),
(11, 8, 'WebRTC peer connection funzionante. Devo ancora ottimizzare per connessioni instabili.'),
(12, 9, 'Audit GDPR in corso. Implementato consent management e data retention policies.'),
(13, 2, 'Bug risolto aggiornando le permission per la camera in Info.plist.'),
(14, 5, 'Redis cluster configurato con persistenza. Cache hit rate al 85%.'),
(15, 10, 'Ricerca librerie per Ethereum smart contract. Web3.js vs Ethers.js?'),
(1, 4, 'Testato su diversi dispositivi. FaceID funziona perfettamente su iPhone 14 Pro.'),
(3, 8, 'Considera l''uso di GPU acceleration per l''inferenza. CUDA o Metal?'),
(5, 9, 'Monitoring configurato. Dashboard Grafana disponibile per metriche cluster.'),
(7, 4, 'Vulnerabilità patched. Aggiornate anche le dipendenze npm con security fixes.'),
(11, 1, 'Multiplayer testato con 8 giocatori simultanei. Latenza media 45ms.');