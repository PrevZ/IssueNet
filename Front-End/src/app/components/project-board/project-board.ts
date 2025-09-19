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

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  issues: Issue[];
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private issueService: IssueService,
    private dialog: MatDialog
  ) { }

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

  private loadProjectData(): void {
    this.loading = true;
    // Carica i dati del progetto
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

  private loadProjectIssues(): void {
    // Carica le issue dal backend
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
  }

  private loadProjectUsers(): void {
    // Carico tutti gli utenti del sistema
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

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'bug': return 'bug_report';
      case 'feature': return 'star';
      case 'task': return 'assignment';
      case 'improvement': return 'trending_up';
      default: return 'help';
    }
  }

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

  getAssigneeName(userId: number): string {
    // TODO: In futuro, caricare i dati degli utenti e mostrare il nome reale
    // Per ora mostriamo solo l'ID in modo più carino
    return `Utente ${userId}`;
  }

  onIssueClick(issue: Issue): void {
    // Apre il dialog dei dettagli con commenti
    this.openIssueDetailDialog(issue);
  }

  openDeleteProjectDialog(project?: Project | null): void {
    if (!project) {
      console.error('Nessun progetto disponibile per l\'eliminazione.');
      return;
    }
    // Apre il dialog di conferma per l'eliminazione del progetto
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

  openEditIssueDialog(issue: Issue): void {
    // Apre il dialog di modifica
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

  openIssueDetailDialog(issue: Issue): void {
    // Naviga alla pagina dell'issue invece di aprire un dialog
    this.router.navigate(['/issue', issue.id_issue]);
  }

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
          column.issues.unshift(newIssue);
        }
        // TODO: Mostrare notifica di successo
      },
      error: (error) => {
        console.error('Errore nella creazione dell\'issue:', error);
        // TODO: Mostrare notifica di errore
      }
    });
  }

  private handleUpdateIssue(issueId: number, issueData: UpdateIssueRequest): void {
    this.issueService.updateIssue(issueId, issueData).subscribe({
      next: (updatedIssue) => {
        console.log('Issue aggiornata con successo:', updatedIssue);
        // Ricarica le issue per aggiornare la board
        this.loadProjectIssues();
        // TODO: Mostrare notifica di successo
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento dell\'issue:', error);
        // TODO: Mostrare notifica di errore
      }
    });
  }

  public handleDeleteIssue(issue: Issue): void {
    if (!issue.id_issue) {
      console.error('ID issue non valido per la cancellazione:', issue);
      this.loadProjectIssues(); // Forza refresh per evitare board incoerente
      return;
    }
    this.issueService.deleteIssue(issue.id_issue).subscribe({
      next: () => {
        console.log('Issue eliminata con successo');
        this.loadProjectIssues();
      },
      error: (error) => {
        console.error('Errore nell\'eliminazione dell\'issue:', error);
        // TODO: Mostrare notifica di errore
      }
    });
  }

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
