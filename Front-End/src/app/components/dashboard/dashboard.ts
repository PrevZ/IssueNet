import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { User, Project, DashboardProject } from '../../models';



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
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  projects: DashboardProject[] = [];
  stats = {
    totalProjects: 0,
    totalIssues: 0,
    openIssues: 0,
    closedIssues: 0
  };

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    
    // Carica i dati della dashboard se l'utente è loggato
    if (this.currentUser) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    console.log('Caricamento dati dal backend per utente:', this.currentUser!.id_user);
    
    // Carica progetti enhanced dal backend
    this.loadProjectsFromBackend();
    
    // Carica statistiche dal backend
    this.loadStatsFromBackend();
  }

  loadProjectsFromBackend(): void {
    this.projectService.getEnhancedProjectsByUser(this.currentUser!.id_user).subscribe({
      next: (projects) => {
        console.log('Progetti enhanced caricati dal backend:', projects);
        // Trasforma i progetti del backend in DashboardProject
        this.projects = projects.map(project => this.transformBackendProject(project));
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

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
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

  openProject(projectId: number): void {
    // Naviga alla board del progetto
    console.log('Opening project:', projectId);
    this.router.navigate(['/project', projectId]);
  }

  createNewProject(): void {
    console.log('Creazione nuovo progetto...');
    
  }
}
