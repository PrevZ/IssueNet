import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { IssueService } from '../../services/issue.service';
import { CommentService } from '../../services/comment.service';
import { CreateProjectDialogComponent } from '../create-project-dialog/create-project-dialog.component';
import { IssueDialogComponent } from '../issue-dialog/issue-dialog.component';
import { User, Project, DashboardProject, Issue, Comment, CreateProjectRequest, UpdateProjectRequest } from '../../models';
import { UpdateProjectDialogComponent } from '../update-project-dialog/update-project-dialog';



@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  currentUser: User | null = null;
  projects: DashboardProject[] = [];
  userIssues: Issue[] = [];
  userComments: Comment[] = [];
  // Mapping per i nomi dei progetti
  projectNames: { [key: number]: string } = {};
  // Mapping per i titoli delle issue
  issueTitles: { [key: number]: string } = {};
  stats = {
    totalProjects: 0,
    totalIssues: 0,
    openIssues: 0,
    closedIssues: 0
  };
  
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private issueService: IssueService,
    private commentService: CommentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    
    // Carica i dati della dashboard se l'utente è loggato
    if (this.currentUser) {
      this.loadDashboardData();
    }
    
    // Ascolta gli eventi di navigazione per ricaricare i dati quando si torna al dashboard
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/dashboard' && this.currentUser) {
          console.log('Navigazione al dashboard rilevata, ricarico i dati');
          this.loadDashboardData();
        }
      });
  }
  
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  loadDashboardData(): void {
    console.log('Caricamento dati dal backend per utente:', this.currentUser!.id_user);
    
    // Carica progetti enhanced dal backend
    this.loadProjectsFromBackend();
    
    // Carica statistiche dal backend
    this.loadStatsFromBackend();
    
    // Carica le issue dell'utente
    this.loadUserIssues();
    
    // Carica i commenti dell'utente
    this.loadUserComments();
  }

  loadProjectsFromBackend(): void {
    this.projectService.getEnhancedProjectsByUser(this.currentUser!.id_user).subscribe({
      next: (projects) => {
        console.log('Progetti enhanced caricati dal backend:', projects);
        // Trasforma i progetti del backend in DashboardProject
        this.projects = projects.map(project => this.transformBackendProject(project));
        // Popola il mapping ID -> nome progetto
        this.populateProjectNames(projects);
      },
      error: (error) => {
        console.error('Errore nel caricamento dei progetti enhanced:', error);
        this.projects = [];
      }
    });
  }

  loadStatsFromBackend(): void {
    this.projectService.getUserProjectStats(this.currentUser!.id_user).subscribe({
      next: (stats) => {
        console.log('Statistiche caricate dal backend:', stats);
        this.stats = {
          totalProjects: Number(stats.total_projects) || 0,
          totalIssues: Number(stats.total_issues) || 0,
          openIssues: (Number(stats.todo_issues) || 0) + (Number(stats.in_progress_issues) || 0) + (Number(stats.in_review_issues) || 0),
          closedIssues: Number(stats.done_issues) || 0
        };
      },
      error: (error) => {
        console.error('Errore nel caricamento delle statistiche:', error);
        this.stats = { totalProjects: 0, totalIssues: 0, openIssues: 0, closedIssues: 0 };
      }
    });
  }

  loadUserIssues(): void {
    this.issueService.getIssuesByAssignee(this.currentUser!.id_user).subscribe({
      next: (issues) => {
        console.log('Issue dell\'utente caricate:', issues);
        this.userIssues = issues;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle issue dell\'utente:', error);
        this.userIssues = [];
      }
    });
  }

  loadUserComments(): void {
    this.commentService.getCommentsByUser(this.currentUser!.id_user).subscribe({
      next: (comments) => {
        console.log('Commenti dell\'utente caricati:', comments);
        this.userComments = comments;
        // Popola il mapping dei titoli delle issue per i commenti
        this.populateIssueTitles(comments);
      },
      error: (error) => {
        console.error('Errore nel caricamento dei commenti dell\'utente:', error);
        this.userComments = [];
      }
    });
  }

  transformBackendProject(project: any): DashboardProject {
    const totalIssues = Number(project.total_issues) || 0;
    const doneIssues = Number(project.done_issues) || 0;
    const openIssues = totalIssues - doneIssues;
    const progress = totalIssues > 0 ? Math.floor((doneIssues / totalIssues) * 100) : 0;
    
    return {
      id_project: project.id_project,
      name: project.name,
      description: project.description,
      created_by: project.created_by,
      status: project.status,
      created_at: project.created_at,
      updated_at: project.updated_at,
      // Dati reali dal backend
      progress: progress,
      totalIssues: totalIssues,
      openIssues: openIssues,
      closedIssues: doneIssues,
      members: Math.floor(Math.random() * 6) + 2, // TODO: Da implementare con vera query
      priority: this.determinePriorityFromProject(project),
      lastUpdate: new Date(project.updated_at),
      tags: this.generateTagsForProject(project.name)
    };
  }

  determinePriorityFromProject(project: any): 'low' | 'medium' | 'high' {
    // Logica per determinare la priorità basata sul nome/status del progetto
    const name = project.name.toLowerCase();
    if (name.includes('core') || name.includes('critical') || name.includes('auth')) {
      return 'high';
    } else if (name.includes('mobile') || name.includes('api') || name.includes('dashboard')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  generateTagsForProject(projectName: string): string[] {
    const name = projectName.toLowerCase();
    const tagMap: { [key: string]: string[] } = {
      'frontend': ['Angular', 'TypeScript', 'Material Design', 'CSS'],
      'dashboard': ['Angular', 'Charts', 'UI/UX', 'Responsive'],
      'mobile': ['React Native', 'Mobile', 'iOS', 'Android'],
      'api': ['Node.js', 'Express', 'REST API', 'Backend'],
      'gateway': ['Microservices', 'Load Balancer', 'Security'],
      'core': ['Architecture', 'Performance', 'Scalability'],
      'auth': ['Security', 'JWT', 'OAuth', 'Encryption'],
      'testing': ['Jest', 'Cypress', 'Automation', 'QA'],
      'legacy': ['Migration', 'Database', 'Legacy Systems']
    };

    // Trova tag appropriati basati sul nome del progetto
    let projectTags: string[] = [];
    Object.keys(tagMap).forEach(keyword => {
      if (name.includes(keyword)) {
        projectTags = [...projectTags, ...tagMap[keyword]];
      }
    });

    // Se non trova tag specifici, usa tag generici
    if (projectTags.length === 0) {
      projectTags = ['Full Stack', 'Web Development', 'Software'];
    }

    // Ritorna massimo 3 tag unici
    return [...new Set(projectTags)].slice(0, 3);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'play_circle';
      case 'completed': return 'check_circle';
      case 'on-hold': return 'pause_circle';
      default: return 'help';
    }
  }

  getTimeAgo(date: Date | string): string {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - targetDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minuti fa`;
    } else if (diffHours < 24) {
      return `${diffHours} ore fa`;
    } else {
      return `${diffDays} giorni fa`;
    }
  }

  getIssueTypeIcon(type: string): string {
    switch (type) {
      case 'bug': return 'bug_report';
      case 'feature': return 'star';
      case 'task': return 'assignment';
      case 'improvement': return 'trending_up';
      default: return 'help';
    }
  }

  getIssuePriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  getIssueStatusColor(status: string): string {
    switch (status) {
      case 'todo': return 'primary';
      case 'in_progress': return 'accent';
      case 'in_review': return 'warn';
      case 'done': return 'success';
      default: return 'primary';
    }
  }

  getStatusDisplayName(status: string): string {
    switch (status) {
      case 'todo': return 'Da Fare';
      case 'in_progress': return 'In Corso';
      case 'in_review': return 'In Revisione';
      case 'done': return 'Completato';
      default: return status;
    }
  }

  onIssueClick(issue: Issue): void {
    console.log('Issue clicked:', issue);
    // Naviga direttamente alla pagina dell'issue
    this.router.navigate(['/issue', issue.id_issue]);
  }

  onProjectClick(issue: Issue): void {
    console.log('Project clicked for issue:', issue);
    // Naviga alla board del progetto contenente l'issue
    this.router.navigate(['/project', issue.id_project]);
  }

  openProject(projectId: number): void {
    // Naviga alla board del progetto
    console.log('Opening project:', projectId);
    this.router.navigate(['/project', projectId]);
  }

  createNewProject(): void {
    console.log('Apertura dialog creazione progetto...');
    
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { userId: this.currentUser!.id_user },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dati progetto ricevuti:', result);
        this.handleCreateProject(result);
      }
    });
  }

  updateProject(project: Project): void {
    console.log('Apertura dialog modifica progetto...');
    const dialogRef = this.dialog.open(UpdateProjectDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { 
        userId: this.currentUser!.id_user,
        project: project
      },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result: UpdateProjectRequest | undefined) => {
      if (result) {
        console.log('Dati progetto ricevuti:', result);
        this.handleUpdateProject(project.id_project, result);
      }
    });
  }

  private handleCreateProject(projectData: CreateProjectRequest): void {
    this.projectService.createProject(projectData).subscribe({
      next: (newProject) => {
        console.log('Progetto creato con successo:', newProject);
        // Ricarica i dati della dashboard per mostrare il nuovo progetto
        this.loadProjectsFromBackend();
        this.loadStatsFromBackend();
      },
      error: (error) => {
        console.error('Errore nella creazione del progetto:', error);
        // TODO: Implementare gestione errori con notifiche
      }
    });
  }

  private handleUpdateProject(projectId: number, projectData: UpdateProjectRequest): void {
    this.projectService.updateProject(projectId, projectData).subscribe({
      next: (updProject) => {
        console.log('Progetto modificato con successo:', updProject);
        // Ricarica i dati della dashboard per mostrare il nuovo progetto
        this.loadProjectsFromBackend();
        this.loadStatsFromBackend();
      },
      error: (error) => {
        console.error('Errore nella modifica del progetto:', error);
        // TODO: Implementare gestione errori con notifiche
      }
    });
  }

  getIssueProgress(issue: Issue): number {
    if (issue.estimated_hours && issue.actual_hours) {
      return Math.min(Math.floor((issue.actual_hours / issue.estimated_hours) * 100), 100);
    }
    
    // Se non ci sono ore effettive, calcola in base allo status
    switch (issue.status) {
      case 'todo': return 0;
      case 'in_progress': return 30;
      case 'in_review': return 70;
      case 'done': return 100;
      default: return 0;
    }
  }

  populateProjectNames(projects: any[]): void {
    this.projectNames = {};
    projects.forEach(project => {
      this.projectNames[project.id_project] = project.name;
    });
  }

  populateIssueTitles(comments: Comment[]): void {
    // Estrae gli ID delle issue dai commenti
    const issueIds = [...new Set(comments.map(comment => comment.id_issue))];
    
    // Per ogni issue ID, carica l'issue per ottenere il titolo
    issueIds.forEach(issueId => {
      this.issueService.getIssueById(issueId).subscribe({
        next: (issue) => {
          this.issueTitles[issueId] = issue.title;
        },
        error: (error) => {
          console.error(`Errore nel caricamento dell'issue ${issueId}:`, error);
          this.issueTitles[issueId] = `Issue ${issueId}`;
        }
      });
    });
  }

  getProjectNameById(projectId: number): string {
    return this.projectNames[projectId] || `Progetto ${projectId}`;
  }

  getIssueTitleById(issueId: number): string {
    return this.issueTitles[issueId] || `Issue ${issueId}`;
  }

  onCommentClick(comment: Comment): void {
    // Naviga al progetto dell'issue relativa al commento
    const projectId = this.getProjectIdByIssueId(comment.id_issue);
    this.router.navigate(['/project', projectId]);
  }

  getProjectIdByIssueId(issueId: number): number {
    // Cerca l'issue nelle issue caricate per ottenere l'ID del progetto
    const issue = this.userIssues.find(issue => issue.id_issue === issueId);
    return issue ? issue.id_project : 1; // Default a progetto 1 se non trovato
  }
}
