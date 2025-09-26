import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { IssueService } from '../../services/issue.service';
import { IssueDialogComponent } from '../project-board/issue-dialog/issue-dialog.component';
import { DeleteProjectDialog } from './delete-project-dialog/delete-project-dialog';
import { DeleteIssueDialog } from './delete-issue-dialog/delete-issue-dialog';
import { Project, User, Issue, CreateIssueRequest, UpdateIssueRequest } from '../../models';

// Interfaccia per le colonne della board Kanban
interface KanbanColumn {
  id: string;        // Identificativo univoco colonna
  title: string;     // Titolo visualizzato
  status: string;    // Stato corrispondente
  issues: Issue[];   // Lista issue nella colonna
}

@Component({
  selector: 'app-project-board',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  templateUrl: './project-board.html',
  styleUrl: './project-board.css'
})
export class ProjectBoard implements OnInit {
  project: Project | null = null;
  currentUser: User | null = null;
  projectUsers: User[] = [];
  projectId: number = 0;
  loading = false;

  // Configurazione colonne Kanban per organizzazione issue per stato
  kanbanColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'Da Fare',
      status: 'todo',
      issues: []
    },
    {
      id: 'in_progress',
      title: 'In Corso',
      status: 'in_progress',
      issues: []
    },
    {
      id: 'in_review',
      title: 'In Revisione',
      status: 'in_review',
      issues: []
    },
    {
      id: 'done',
      title: 'Completate',
      status: 'done',
      issues: []
    }
  ];

  // Costruttore del componente
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private issueService: IssueService,
    private dialog: MatDialog
  ) { }

  // Inizializza il componente caricando utente corrente e dati progetto
  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();

    // Ottengo l'ID del progetto dalla route
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.loadProjectData();
      }
    });
  }

  // Carica tutti i dati del progetto (info, issue, utenti)
  private loadProjectData(): void {
    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        console.log('Progetto caricato:', project);
        this.loadProjectIssues();
        this.loadProjectUsers();
      },
      error: (error) => {
        console.error('Errore nel caricamento del progetto:', error);
        this.loading = false;
        this.goBackToDashboard();
      }
    });
  }

  // Carica tutte le issue del progetto dal backend
  private loadProjectIssues(): void {
    this.issueService.getIssuesByProject(this.projectId).subscribe({
      next: (issues) => {
        console.log('Issue caricate dal backend:', issues);
        this.distributeIssuesInColumns(issues);
        this.loading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle issue:', error);
        this.loading = false;
      }
    });
  }

  // Distribuisce le issue nelle colonne Kanban appropriate per stato
  private distributeIssuesInColumns(issues: Issue[]): void {
    // Reset delle colonne
    this.kanbanColumns.forEach(column => {
      column.issues = [];
    });

    // Distribuisci le issue nelle colonne appropriate
    issues.forEach(issue => {
      const column = this.kanbanColumns.find(col => col.status === issue.status);
      if (column) {
        column.issues.push(issue);
      }
    });

    console.log('Issue distribuite nelle colonne:', this.kanbanColumns);
    this.loadProjectIssues();
  }

  // Carica tutti gli utenti del sistema per popolamento dati
  private loadProjectUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.projectUsers = users;
        console.log('Utenti del progetto caricati:', users);
      },
      error: (error) => {
        console.error('Errore nel caricamento degli utenti del progetto:', error);
        this.projectUsers = [];
      }
    });
  }

  // Restituisce il colore Material per la priorità dell'issue
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  // Restituisce l'icona Material per il tipo di issue
  getTypeIcon(type: string): string {
    switch (type) {
      case 'bug': return 'bug_report';
      case 'feature': return 'star';
      case 'task': return 'assignment';
      case 'improvement': return 'trending_up';
      default: return 'help';
    }
  }

  // Calcola il tempo trascorso dalla creazione dell'issue
  getTimeAgo(date: string): string {
    const now = new Date();
    const issueDate = new Date(date);
    const diffMs = now.getTime() - issueDate.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffDays > 0) {
      return `${diffDays} giorni fa`;
    } else if (diffHours > 0) {
      return `${diffHours} ore fa`;
    } else {
      return 'Meno di un\'ora fa';
    }
  }

  // Trova il nome completo dell'utente assegnato
  getAssigneeName(userId: number): string {
    const user = this.projectUsers.find(u => u.id_user === userId);
    return user ? user.full_name : `Utente ${userId}`;
  }

  // Genera le iniziali dell'utente assegnato per avatar
  getAssigneeInitials(userId: number): string {
    const user = this.projectUsers.find(u => u.id_user === userId);
    if (user && user.full_name) {
      return user.full_name
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    }
    return 'U';
  }

  // Restituisce l'etichetta italiana per il tipo di issue
  getTypeLabel(type: string): string {
    const typeMap = {
      'bug': 'Bug',
      'feature': 'Feature',
      'task': 'Task',
      'improvement': 'Miglioramento'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  }

  //Restituisce l'etichetta italiana per la priorità dell'issue
  getPriorityLabel(priority: string): string {
    const priorityMap = {
      'low': 'Bassa',
      'medium': 'Media',
      'high': 'Alta',
      'critical': 'Critica'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  }

  // Calcola il numero totale di issue in tutte le colonne
  getTotalIssuesCount(): number {
    return this.kanbanColumns.reduce((total, column) => total + column.issues.length, 0);
  }

  // Verifica se un issue è scaduto
  isDueOverdue(dueDate: string): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }


  // Gestisce il click su un issue per aprire i dettagli
  onIssueClick(issue: Issue): void {
    // Apre il dialog dei dettagli con commenti
    this.openIssueDetailDialog(issue);
  }

  // Apre il dialog di conferma per eliminazione progetto
  openDeleteProjectDialog(project?: Project | null): void {
    if (!project) {
      console.error('Nessun progetto disponibile per l\'eliminazione.');
      return;
    }
    const dialogRef = this.dialog.open(DeleteProjectDialog, {
      width: '400px',
      data: {
        projectId: this.projectId,
        projectName: project.name,
        mode: 'delete'
      },
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.handleDeleteProject(project);
      }
    });
  }

  // Apre il dialog per modificare un issue esistente
  openEditIssueDialog(issue: Issue): void {
    const dialogRef = this.dialog.open(IssueDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        projectId: this.projectId,
        currentUserId: this.currentUser!.id_user,
        projectUsers: this.projectUsers,
        issue: issue,
        mode: 'edit'
      },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type === 'update') {
        this.handleUpdateIssue(issue.id_issue, result.data);
      }
    });
  }

  // Apre il dialog per creare una nuova issue
  openCreateIssueDialog(): void {
    const dialogRef = this.dialog.open(IssueDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        projectId: this.projectId,
        currentUserId: this.currentUser!.id_user,
        projectUsers: this.projectUsers,
        mode: 'create'
      },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type === 'create') {
        this.handleCreateIssue(result.data);
      }
    });
  }

  //Naviga alla pagina dettagli dell'issue
  openIssueDetailDialog(issue: Issue): void {
    this.router.navigate(['/issue', issue.id_issue]);
  }

  //Apre il dialog di conferma per eliminazione issue
  openDeleteIssueDialog(issue: Issue): void {
    const dialogRef = this.dialog.open(DeleteIssueDialog, {
      width: '400px',
      data: {
        issueId: issue.id_issue,
        issueTitle: issue.title
      },
      disableClose: true,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.handleDeleteIssue(issue);
      }
    });
  }

  // Gestisce la creazione di una nuova issue
  private handleCreateIssue(issueData: CreateIssueRequest): void {
    this.issueService.createIssue(issueData).subscribe({
      next: (newIssue) => {
        console.log('Issue creata con successo:', newIssue);
        // Se manca l'id_issue, non aggiungere la issue alla board
        if (!newIssue.id_issue) {
          console.error('La nuova issue non ha un id_issue valido:', newIssue);
          // Forza un refresh delle issue per evitare problemi
          this.loadProjectIssues();
          return;
        }
        const status = newIssue.status || 'todo';
        const column = this.kanbanColumns.find(col => col.status === status);
        if (column) {
          column.issues.unshift(newIssue); // Aggiunge in cima alla colonna
        }
      },
      error: (error) => {
        console.error('Errore nella creazione dell\'issue:', error);
      }
    });
  }

  // Gestisce l'aggiornamento di un issue esistente
  private handleUpdateIssue(issueId: number, issueData: UpdateIssueRequest): void {
    this.issueService.updateIssue(issueId, issueData).subscribe({
      next: (updatedIssue) => {
        console.log('Issue aggiornata con successo:', updatedIssue);
        // Ricarica le issue per aggiornare la board
        this.loadProjectIssues();
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento dell\'issue:', error);
      }
    });
  }

  // Gestisce l'eliminazione di un issue
  public handleDeleteIssue(issue: Issue): void {
    if (!issue.id_issue) {
      console.error('ID issue non valido per la cancellazione:', issue);
      this.loadProjectIssues(); // Forza refresh per evitare board incoerente
      return;
    }
    this.issueService.deleteIssue(issue.id_issue).subscribe({
      next: () => {
        console.log('Issue eliminata con successo');
        this.loadProjectIssues(); // Ricarica la board
      },
      error: (error) => {
        console.error('Errore nell\'eliminazione dell\'issue:', error);
        // TODO: Mostrare notifica di errore
      }
    });
  }

  //Gestisce l'eliminazione del progetto corrente
  private handleDeleteProject(project: Project): void {
    console.log('Tentativo di eliminazione progetto:', {
      projectId: project.id_project,
      projectName: project.name,
      currentProjectId: this.projectId
    });
    
    this.projectService.deleteProject(project.id_project).subscribe({
      next: () => {
        console.log('Progetto eliminato con successo, navigazione alla dashboard');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Errore nell\'eliminazione del progetto:', error);
        if (error.status === 404) {
          console.error('Progetto non trovato nel backend, possibile problema di sincronizzazione');
          // Il progetto non esiste nel backend, naviga comunque alla dashboard
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  //Naviga alla dashboard principale
  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // Verifica se l'utente corrente è admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Verifica se l'utente può creare issue (admin o developer)
  canCreateIssue(): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.role === 'developer';
  }
}
