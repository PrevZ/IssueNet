-- Inserimento utenti di esempio (password: "password123" hashata con bcrypt => Da sistemare)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@issuenet.com', 'admin$$$', 'System Administrator', 'admin'),
('john_dev', 'john@issuenet.com', 'j%d&v', 'John Developer', 'developer'),
('mary_tester', 'mary@issuenet.com', 'testando?M', 'Mary Tester', 'tester'),
('alice_pm', 'alice@issuenet.com', 'Alice!"£$%', 'Alice ProjectManager', 'developer'),
('test', 'test@test.com', 'TestUser2024!', 'Test User', 'developer'),
('demo', 'demo@demo.com', 'DemoPass789#', 'Demo User', 'tester'),
('marco', 'marco@issuenet.com', 'MarcoSecure456$', 'Marco Rossi', 'admin');

-- Inserimento progetti
INSERT INTO projects (name, description, created_by, status) VALUES
('IssueNet Core', 'Core functionality of IssueNet application', 1, 'active'),
('Mobile App', 'Mobile companion app for IssueNet', 1, 'active'),
('API Gateway', 'Manages all API requests and routing', 2, 'active'),
('Legacy Migration', 'Port legacy data to IssueNet', 1, 'archived'),
('Frontend Dashboard', 'Angular dashboard for project management', 5, 'active'),
('Testing Framework', 'Automated testing infrastructure', 5, 'active'),
('User Authentication', 'Complete user auth system', 5, 'active'),
('E-commerce Platform', 'Full e-commerce solution', 3, 'active'),
('Data Analytics', 'Business intelligence dashboard', 3, 'active'),
('Cloud Migration', 'Move services to cloud infrastructure', 4, 'active');

-- Inserimento issue
INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) VALUES
('Setup authentication system', 'Implement JWT-based authentication', 'high', 'in_progress', 'task', 1, 2, 1, 12.00, 2.50, '2025-07-15'),
('Fix login form validation', 'Email validation not working properly', 'medium', 'todo', 'bug', 1, 3, 2, 4.00, NULL, '2025-07-10'),
('Add dark mode theme', 'Implement dark mode toggle', 'low', 'todo', 'feature', 1, NULL, 1, 6.00, NULL, '2025-07-20'),
('Migrate API endpoints', 'Move endpoints to new API Gateway', 'critical', 'in_review', 'improvement', 3, 2, 2, 10.00, 7.00, '2025-07-14'),
('Refactor mobile UI', 'Improve UI for better UX', 'medium', 'in_progress', 'task', 2, 2, 1, 8.00, 3.00, '2025-07-16'),
('Legacy data import', 'Import data from old system', 'high', 'todo', 'task', 4, 3, 1, 16.00, NULL, '2025-07-30'),
('Dashboard charts implementation', 'Add responsive charts to dashboard', 'medium', 'done', 'feature', 5, 5, 5, 8.00, 6.00, '2025-07-12'),
('User authentication tests', 'Complete test suite for auth system', 'high', 'in_progress', 'task', 7, 5, 5, 12.00, 4.00, '2025-07-18'),
('Testing framework setup', 'Configure Jest and Cypress', 'medium', 'done', 'task', 6, 5, 5, 6.00, 5.00, '2025-07-11'),
('Dashboard responsive design', 'Make dashboard mobile-friendly', 'medium', 'in_progress', 'improvement', 5, 5, 5, 10.00, 3.00, '2025-07-20'),
('OAuth integration', 'Add Google and GitHub OAuth', 'high', 'todo', 'feature', 7, 5, 5, 14.00, NULL, '2025-07-25'),
('Performance optimization', 'Optimize API response times', 'medium', 'done', 'improvement', 5, 5, 5, 8.00, 7.00, '2025-07-08'),
('Unit tests for components', 'Add unit tests for Angular components', 'low', 'todo', 'task', 5, 5, 5, 16.00, NULL, '2025-07-30'),
('Integration tests', 'End-to-end testing with Cypress', 'medium', 'in_review', 'task', 6, 5, 5, 12.00, 8.00, '2025-07-22'),
('Security audit', 'Review auth system security', 'high', 'todo', 'improvement', 7, 5, 5, 6.00, NULL, '2025-07-28');

-- Inserimento commenti
INSERT INTO comments (id_issue, id_user, content) VALUES
(1, 2, 'Iniziato il setup di JWT, manca la parte di refresh token.'),
(1, 1, 'Aggiungere anche i test unitari per la login.'),
(2, 3, 'Il problema sembra legato alla regex dell\'email.'),
(4, 2, 'Endpoint principali migrati, mancano quelli legacy.'),
(5, 2, 'Stiamo usando Material Design per la nuova UI.'),
(6, 3, 'Importazione dati pianificata per la prossima settimana.'),
(7, 5, 'Charts implementati con Chart.js, molto belli!'),
(8, 5, 'Test suite quasi completa, mancano solo i test di integrazione.'),
(9, 5, 'OAuth Google già funzionante, lavorando su GitHub.'),
(10, 3, 'Shopping cart funziona bene, testato con vari prodotti.'),
(11, 3, 'Stripe integrato e testato con successo.'),
(12, 3, 'Grafici molto chiari, utenti entusiasti.'),
(13, 4, 'Ambiente AWS configurato, pronto per il deploy.'),
(7, 5, 'Aggiunti test per la registrazione utenti.'),
(8, 5, 'Configurato il mock per le API nei test.'),
(9, 5, 'Risolti problemi di compatibilità con Safari.'),
(10, 3, 'Ottimizzato il caricamento delle immagini.'),
(11, 3, 'Aggiunti controlli di sicurezza per le API.'),
(12, 3, 'Test di carico effettuati, tutto ok.'),
(13, 4, 'Deploy su ambiente di staging completato.');