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
import { CreateProjectDialogComponent } from '../dashboard/create-project-dialog/create-project-dialog.component';
import { IssueDialogComponent } from '../project-board/issue-dialog/issue-dialog.component';
import { UpdateProjectDialogComponent } from '../dashboard/update-project-dialog/update-project-dialog';
import { User, Project, DashboardProject, Issue, Comment, CreateProjectRequest, UpdateProjectRequest } from '../../models';

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
  
  // Mapping per ottimizzazione visualizzazione dati
  projectNames: { [key: number]: string } = {}; // Mapping per i nomi dei progetti
  issueTitles: { [key: number]: string } = {}; // Mapping per i titoli delle issue
  
  // Statistiche utente aggregate
  stats = {
    registrationDate: null as Date | null,
    totalProjects: 0,
    totalIssuesAssigned: 0,
    totalComments: 0
  };
  
  // Sottoscrizione per eventi di navigazione
  private routerSubscription: Subscription = new Subscription();

  // Costruttore del componente Dashboard
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private issueService: IssueService,
    private commentService: CommentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  // Inizializzazione del componente dashboard
  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    
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
  
  // Pulizia risorse al distruggersi del componente
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  // Carica tutti i dati necessari per la dashboard
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

  // Carica i progetti dal backend con informazioni enhanced
  loadProjectsFromBackend(): void {
    this.projectService.getEnhancedProjectsByUser(this.currentUser!.id_user).subscribe({
      next: (projects) => {
        console.log('Progetti enhanced caricati dal backend:', projects);
        // Trasforma i progetti del backend in DashboardProject
        this.projects = projects.map(project => this.transformBackendProject(project));
        // Popola il mapping ID -> nome progetto per ottimizzazione
        this.populateProjectNames(projects);
      },
      error: (error) => {
        console.error('Errore nel caricamento dei progetti enhanced:', error);
        // In caso di errore, inizializza array vuoto
        this.projects = [];
      }
    });
  }

  // Carica le statistiche utente dal backend
  loadStatsFromBackend(): void {
    this.userService.getUserStats(this.currentUser!.id_user).subscribe({
      next: (stats) => {
        console.log('Statistiche caricate dal backend:', stats);
        // Trasforma le statistiche del backend in formato dashboard
        this.stats = {
          registrationDate: stats.created_at ? new Date(stats.created_at) : null,
          totalProjects: Number(stats.total_projects) || 0,
          totalIssuesAssigned: Number(stats.total_issues_assigned) || 0,
          totalComments: Number(stats.total_comments) || 0
        };
      },
      error: (error) => {
        console.error('Errore nel caricamento delle statistiche:', error);
        // Inizializza statistiche vuote in caso di errore
        this.stats = {
          registrationDate: null,
          totalProjects: 0,
          totalIssuesAssigned: 0,
          totalComments: 0
        };
      }
    });
  }

  // Carica le issue assegnate all'utente corrente
  loadUserIssues(): void {
    this.issueService.getIssuesByAssignee(this.currentUser!.id_user).subscribe({
      next: (issues) => {
        console.log('Issue dell\'utente caricate:', issues);
        this.userIssues = issues;
        // Carica i nomi dei progetti per le issue
        this.loadProjectNamesForIssues(issues);
      },
      error: (error) => {
        console.error('Errore nel caricamento delle issue dell\'utente:', error);
        // Inizializza array vuoto in caso di errore
        this.userIssues = [];
      }
    });
  }

  // Carica i commenti creati dall'utente corrente
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
        // Inizializza array vuoto in caso di errore
        this.userComments = [];
      }
    });
  }

  // Trasforma un progetto del backend in formato DashboardProject
  transformBackendProject(project: any): DashboardProject {
    // Calcoli statistiche progetto
    const totalIssues = Number(project.total_issues) || 0;
    const doneIssues = Number(project.done_issues) || 0;
    const openIssues = totalIssues - doneIssues;
    // Calcolo percentuale completamento (0-100)
    const progress = totalIssues > 0 ? Math.floor((doneIssues / totalIssues) * 100) : 0;
    // Numero reale di membri con issue assegnate
    const members = Number(project.total_members) || 0;

    return {
      id_project: project.id_project,
      name: project.name,
      description: project.description,
      created_by: project.created_by,
      status: project.status,
      created_at: project.created_at,
      updated_at: project.updated_at,
      // Dati statistici calcolati per la dashboard
      progress: progress,
      totalIssues: totalIssues,
      openIssues: openIssues,
      closedIssues: doneIssues,
      members: members, // Numero reale di utenti con issue assegnate
      priority: this.determinePriorityFromProject(project),
      lastUpdate: new Date(project.updated_at),
      tags: this.generateTagsForProject(project.name)
    };
  }

  // Determina la priorità di un progetto basandosi su logiche business
  determinePriorityFromProject(project: any): 'low' | 'medium' | 'high' {
    // Logica per determinare la priorità basata sul nome/status del progetto
    const name = project.name.toLowerCase();
    // Progetti critici: alta priorità
    if (name.includes('core') || name.includes('critical') || name.includes('auth')) {
      return 'high';
    // Progetti importanti: media priorità  
    } else if (name.includes('mobile') || name.includes('api') || name.includes('dashboard')) {
      return 'medium';
    // Altri progetti: bassa priorità
    } else {
      return 'low';
    }
  }

  // Genera tag tecnologici per un progetto basandosi sul nome
  generateTagsForProject(projectName: string): string[] {
    const name = projectName.toLowerCase();
    // Mapping nome progetto -> tag tecnologici
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
        // Combina tag trovati evitando duplicati
        projectTags = [...projectTags, ...tagMap[keyword]];
      }
    });

    // Se non trova tag specifici, usa tag generici
    if (projectTags.length === 0) {
      projectTags = ['Full Stack', 'Web Development', 'Software'];
    }

    // Ritorna massimo 3 tag unici per evitare sovraccarico UI
    return [...new Set(projectTags)].slice(0, 3);
  }

  // Ottiene il colore Material per il livello di priorità
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';       
      case 'medium': return 'accent';   
      case 'low': return 'primary';     
      default: return 'primary';
    }
  }

  // Ottiene l'icona Material per lo status del progetto
  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'play_circle';      
      case 'completed': return 'check_circle';  
      case 'on-hold': return 'pause_circle';    
      default: return 'help';                   
    }
  }

  // Calcola e formatta il tempo trascorso da una data
  getTimeAgo(date: Date | string): string {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    
    // Calcolo differenze temporali in millisecondi
    const diffMs = now.getTime() - targetDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Formattazione tempo relativo
    if (diffMins < 60) {
      return `${diffMins} minuti fa`;
    } else if (diffHours < 24) {
      return `${diffHours} ore fa`;
    } else {
      return `${diffDays} giorni fa`;
    }
  }

  // Ottiene l'icona appropriata per il tipo di issue
  getIssueTypeIcon(type: string): string {
    switch (type) {
      case 'bug': return 'bug_report';      
      case 'feature': return 'star';        
      case 'task': return 'assignment';     
      case 'improvement': return 'trending_up';  
      default: return 'help';              
    }
  }

  // Ottiene il colore per la priorità di un'issue
  getIssuePriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'error';     
      case 'high': return 'warn';          
      case 'medium': return 'accent';      
      case 'low': return 'primary';        
      default: return 'primary';
    }
  }

  // Ottiene il colore per lo status di un'issue
  getIssueStatusColor(status: string): string {
    switch (status) {
      case 'todo': return 'primary';        
      case 'in_progress': return 'accent';  
      case 'in_review': return 'warn';      
      case 'done': return 'success';        
      default: return 'primary';
    }
  }

  // Converte lo status tecnico in nome leggibile
  getStatusDisplayName(status: string): string {
    switch (status) {
      case 'todo': return 'Da Fare';
      case 'in_progress': return 'In Corso';
      case 'in_review': return 'In Revisione';
      case 'done': return 'Completato';
      default: return status;  // Fallback al valore originale
    }
  }

  // Gestisce il click su un'issue per navigare al dettaglio
  onIssueClick(issue: Issue): void {
    console.log('Issue clicked:', issue);
    // Naviga direttamente alla pagina dell'issue
    this.router.navigate(['/issue', issue.id_issue]);
  }

  // Gestisce il click per aprire il progetto di un'issue
  onProjectClick(issue: Issue): void {
    console.log('Project clicked for issue:', issue);
    // Naviga alla board del progetto contenente l'issue
    this.router.navigate(['/project', issue.id_project]);
  }

  // Apre la dashboard/board di un progetto specifico
  openProject(projectId: number): void {
    // Naviga alla board del progetto
    console.log('Opening project:', projectId);
    this.router.navigate(['/project', projectId]);
  }

  // Apre il dialog per creare un nuovo progetto
  createNewProject(): void {
    console.log('Apertura dialog creazione progetto...');
    
    // Configurazione dialog Material UI
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { userId: this.currentUser!.id_user },
      disableClose: false,  
      autoFocus: true       
    });

    // Gestione risultato dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dati progetto ricevuti:', result);
        this.handleCreateProject(result);
      }
    });
  }

  // Apre il dialog per modificare un progetto esistente
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

    // Gestione risultato modifica
    dialogRef.afterClosed().subscribe((result: UpdateProjectRequest | undefined) => {
      if (result) {
        console.log('Dati progetto ricevuti:', result);
        this.handleUpdateProject(project.id_project, result);
      }
    });
  }

  // Gestisce la creazione di un nuovo progetto tramite API
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
      }
    });
  }

  // Gestisce l'aggiornamento di un progetto esistente tramite API
  private handleUpdateProject(projectId: number, projectData: UpdateProjectRequest): void {
    this.projectService.updateProject(projectId, projectData).subscribe({
      next: (updProject) => {
        console.log('Progetto modificato con successo:', updProject);
        // Ricarica i dati della dashboard per mostrare le modifiche
        this.loadProjectsFromBackend();
        this.loadStatsFromBackend();
      },
      error: (error) => {
        console.error('Errore nella modifica del progetto:', error);
        }
    });
  }

  // Calcola la percentuale di progresso di un'issue
  getIssueProgress(issue: Issue): number {
    switch (issue.status) {
      case 'todo': return 0;         
      case 'in_progress': return 30;
      case 'in_review': return 70;
      case 'done': return 100;
      default: return 0;
    }
  }

  // Popola il mapping ID progetto -> nome per ottimizzazione display
  populateProjectNames(projects: any[]): void {
    this.projectNames = {};
    // Costruisce mapping ID -> nome per lookup veloce
    projects.forEach(project => {
      this.projectNames[project.id_project] = project.name;
    });
  }

  // Carica i nomi dei progetti per le issue assegnate all'utente
  loadProjectNamesForIssues(issues: Issue[]): void {
    // Estrae gli ID dei progetti dalle issue (rimuove duplicati)
    const projectIds = [...new Set(issues.map(issue => issue.id_project))];

    // Per ogni progetto ID, carica il progetto per ottenere il nome
    projectIds.forEach(projectId => {
      // Salta se già presente nel mapping
      if (this.projectNames[projectId]) {
        return;
      }

      this.projectService.getProjectById(projectId).subscribe({
        next: (project) => {
          // Popola mapping per lookup veloce
          this.projectNames[projectId] = project.name;
        },
        error: (error) => {
          console.error(`Errore nel caricamento del progetto ${projectId}:`, error);
          // Fallback: usa ID come placeholder
          this.projectNames[projectId] = `Progetto ${projectId}`;
        }
      });
    });
  }

  // Popola il mapping ID issue -> titolo per ottimizzazione display commenti
  populateIssueTitles(comments: Comment[]): void {
    // Estrae gli ID delle issue dai commenti (rimuove duplicati)
    const issueIds = [...new Set(comments.map(comment => comment.id_issue))];
    
    // Per ogni issue ID, carica l'issue per ottenere il titolo
    issueIds.forEach(issueId => {
      this.issueService.getIssueById(issueId).subscribe({
        next: (issue) => {
          // Popola mapping per lookup veloce
          this.issueTitles[issueId] = issue.title;
        },
        error: (error) => {
          console.error(`Errore nel caricamento dell'issue ${issueId}:`, error);
          // Fallback: usa ID come placeholder
          this.issueTitles[issueId] = `Issue ${issueId}`;
        }
      });
    });
  }

  // Ottiene il nome del progetto dal mapping o fallback
  getProjectNameById(projectId: number): string {
    return this.projectNames[projectId] || `Progetto ${projectId}`;
  }

  // Ottiene il titolo dell'issue dal mapping o fallback
  getIssueTitleById(issueId: number): string {
    return this.issueTitles[issueId] || `Issue ${issueId}`;
  }

  // Gestisce il click su un commento per navigare alla relativa issue
  onCommentClick(comment: Comment): void {
    // Naviga direttamente all'issue specifica del commento
    this.router.navigate(['/issue', comment.id_issue]);
  }

  // Ottiene l'ID del progetto associato a un'issue
  getProjectIdByIssueId(issueId: number): number {
    // Cerca l'issue nelle issue caricate per ottenere l'ID del progetto
    const issue = this.userIssues.find(issue => issue.id_issue === issueId);
    return issue ? issue.id_project : 1; // Default a progetto 1 se non trovato
  }

  // Verifica se l'utente corrente è project manager
  isPM(): boolean {
    return this.currentUser?.role === 'project_manager';
  }
}
