# IssueNet 🐛

> Bug tracking Single Page Application inspired by Trello

A comprehensive bug tracking system built for Web Systems Engineering course, featuring a modern client-server architecture with distinct conversation patterns.

## 🎯 Project Overview

IssueNet is a web-based bug tracking application that provides an intuitive Kanban-style interface for managing projects, issues, and team collaboration.

## 🛠 Tech Stack

- **Frontend**: Angular 17+ with TypeScript, HTML5, CSS3
- **Backend**: Express.js with JavaScript
- **Database**: MySQL with custom schema
- **Architecture**: Client-Server with 4 distinct conversations

## 🏗 Project Structure

```
IssueNet/
├── backend/               # Express.js API server
│   ├── config/           # Database and app configuration
│   ├── models/           # Data models and schemas
│   ├── routes/           # API route handlers
│   ├── middleware/       # Custom middleware
│   ├── controllers/      # Business logic
│   └── server.js         # Main server file
├── frontend/             # Angular application
│   ├── src/
│   │   ├── app/          # Angular components and services
│   │   ├── assets/       # Static assets
│   │   └── environments/ # Environment configurations
│   ├── angular.json      # Angular CLI configuration
│   └── package.json      # Frontend dependencies
├── docs/                 # Project documentation
│   ├── api/              # API documentation
│   ├── database/         # Database schema docs
│   └── architecture/     # System architecture docs
├── scripts/              # Build and deployment scripts
└── package.json          # Root workspace configuration
```

## 🚀 Core Features

### 1. Project Management (Client ↔ Server Conversation 1)
- ✨ Create, view, edit, delete projects
- 📊 Project overview and statistics
- 👥 Team member assignment
- 🏷 Project categorization and tags

### 2. Issue/Bug Tracking (Client ↔ Server Conversation 2)
- 🐛 Create and manage issues with detailed information
- 📋 Kanban board visualization (To Do, In Progress, Testing, Done)
- 🔥 Priority levels (Low, Medium, High, Critical)
- 👤 Assignee management
- 📝 Comments and updates tracking

### 3. Authentication & Authorization (Client ↔ Server Conversation 3)
- 🔐 User registration and login
- 🎫 JWT-based session management
- 👨‍💼 Role-based access control (Admin, Project Manager, Developer, Tester)
- 🔒 Protected routes and API endpoints

### 4. Dashboard & Analytics (Client ↔ Server Conversation 4)
- 📈 Project metrics and KPIs
- 📊 Visual charts and graphs
- 📅 Timeline and progress tracking
- 📋 Custom reports generation

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL 8.0+
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

### Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE issuenet;

# Run migrations (to be implemented)
cd backend
npm run migrate
```

## 🔧 Development Workflow

1. **Feature Development**: Create feature branches from `develop`
2. **API First**: Design API endpoints before frontend implementation
3. **Testing**: Write tests for both backend and frontend
4. **Code Review**: All changes require pull request review
5. **Documentation**: Update docs with any API or feature changes

## 📡 API Endpoints (Planned)

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Issues
- `GET /api/issues` - List issues with filters
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue details
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Analytics
- `GET /api/analytics/projects/:id` - Project statistics
- `GET /api/analytics/dashboard` - Dashboard metrics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for educational purposes as part of a Web Systems Engineering course.

## 👥 Team

- **PrevZ** - Project Lead & Full Stack Developer

---

**Course**: Web Systems Engineering  
**Institution**: Univerità degli Studi di Ferrara
**Academic Year**: 2024/2025
