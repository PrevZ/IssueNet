-- Inserimento utenti di esempio (password: "password123" hashata con bcrypt => Da sistemare)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@issuenet.com', '$2b$10$rOvHJtP1h2qHJ.j8N2mJ0uF5.1K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'System Administrator', 'admin'),
('john_dev', 'john@issuenet.com', '$2b$10$rOvHJtP1h2qHJ.j8N2mJ0uF5.1K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'John Developer', 'developer'),
('mary_tester', 'mary@issuenet.com', '$2b$10$rOvHJtP1h2qHJ.j8N2mJ0uF5.1K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Mary Tester', 'tester'),
('alice_pm', 'alice@issuenet.com', '$2b$10$rOvHJtP1h2qHJ.j8N2mJ0uF5.1K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Alice ProjectManager', 'developer'),
('test', 'test@test.com', 'TestUser2024!', 'Test User', 'developer'),
('demo', 'demo@demo.com', 'DemoPass789#', 'Demo User', 'tester'),
('marco', 'marco@issuenet.com', 'MarcoSecure456$', 'Marco Rossi', 'admin');

-- Inserimento progetti
INSERT INTO projects (name, description, created_by, status) VALUES
('IssueNet Core', 'Core functionality of IssueNet application', 1, 'active'),
('Mobile App', 'Mobile companion app for IssueNet', 1, 'active'),
('API Gateway', 'Manages all API requests and routing', 2, 'active'),
('Legacy Migration', 'Port legacy data to IssueNet', 1, 'archived');

-- Inserimento issue
INSERT INTO issues (title, description, priority, status, type, id_project, assigned_to, created_by, estimated_hours, actual_hours, due_date) VALUES
('Setup authentication system', 'Implement JWT-based authentication', 'high', 'in_progress', 'task', 1, 2, 1, 12.00, 2.50, '2025-07-15'),
('Fix login form validation', 'Email validation not working properly', 'medium', 'todo', 'bug', 1, 3, 2, 4.00, NULL, '2025-07-10'),
('Add dark mode theme', 'Implement dark mode toggle', 'low', 'todo', 'feature', 1, NULL, 1, 6.00, NULL, '2025-07-20'),
('Migrate API endpoints', 'Move endpoints to new API Gateway', 'critical', 'in_review', 'improvement', 3, 2, 2, 10.00, 7.00, '2025-07-14'),
('Refactor mobile UI', 'Improve UI for better UX', 'medium', 'in_progress', 'task', 2, 2, 1, 8.00, 3.00, '2025-07-16'),
('Legacy data import', 'Import data from old system', 'high', 'todo', 'task', 4, 3, 1, 16.00, NULL, '2025-07-30');

-- Inserimento commenti
INSERT INTO comments (id_issue, id_user, content) VALUES
(1, 2, 'Iniziato il setup di JWT, manca la parte di refresh token.'),
(1, 1, 'Aggiungere anche i test unitari per la login.'),
(2, 3, 'Il problema sembra legato alla regex dell\'email.'),
(4, 2, 'Endpoint principali migrati, mancano quelli legacy.'),
(5, 2, 'Stiamo usando Material Design per la nuova UI.'),
(6, 3, 'Importazione dati pianificata per la prossima settimana.');