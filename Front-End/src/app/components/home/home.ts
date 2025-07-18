import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ProjectService } from '../../services/project.service';
import { CommentService } from '../../services/comment.service';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  currentUser: User | null = null;
  
  // Features carousel data
  features = [
    {
      id: 0,
      title: 'Dashboard Intuitiva',
      description: 'Visualizza tutti i tuoi progetti e issue in un\'interfaccia chiara e organizzata.',
      icon: 'dashboard',
      image: '/assets/dashboard-preview.svg',
      alt: 'Dashboard IssueNet'
    },
    {
      id: 1,
      title: 'Collaborazione',
      description: 'Lavora in team, assegna compiti e tieni traccia dei progressi di tutti.',
      icon: 'group_work',
      image: '/assets/collaboration-preview.svg',
      alt: 'Collaborazione in team'
    },
    {
      id: 2,
      title: 'Tracking Avanzato',
      description: 'Monitora lo stato degli issue, aggiungi commenti e tieni tutto sotto controllo.',
      icon: 'track_changes',
      image: '/assets/tracking-preview.svg',
      alt: 'Tracking degli issue'
    }
  ];
  
  currentFeatureIndex = 0;

  // statistiche utente
  userStats = {
    totalProjects: 0,
    totalIssues: 0,
    comments: 0
  };

  // Tips e suggerimenti
  tips = [
    {
      id: 1,
      title: 'Organizza i tuoi progetti',
      description: 'Usa la dashboard per avere una panoramica completa di tutti i tuoi progetti e issue assegnate.',
      icon: 'lightbulb',
      color: 'primary',
      actionText: 'Vai alla Dashboard',
      actionRoute: '/dashboard'
    },
    {
      id: 2,
      title: 'Collabora efficacemente',
      description: 'Aggiungi commenti dettagliati alle issue per tenere aggiornato il team sui progressi.',
      icon: 'forum',
      color: 'accent',
      actionText: 'Gestisci Issue',
      actionRoute: '/dashboard'
    },
    {
      id: 3,
      title: 'Mantieni il profilo aggiornato',
      description: 'Aggiorna le tue informazioni personali per una migliore esperienza di collaborazione.',
      icon: 'person',
      color: 'warn',
      actionText: 'Modifica Profilo',
      actionRoute: '/user-profile'
    },
    {
      id: 4,
      title: 'Gestione utenti (Admin)',
      description: 'Se sei un admin, puoi gestire utenti, ruoli e permessi dalla sezione dedicata.',
      icon: 'admin_panel_settings',
      color: 'primary',
      actionText: 'Gestione Utenti',
      actionRoute: '/user-management',
      adminOnly: true
    }
  ];

  currentTipIndex = 0;

  constructor(private userService: UserService, private projectService: ProjectService, private issueService: IssueService,private commentService: CommentService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserStats(user.id_user);
        this.startTipRotation();
      }
    });
  }

  loadUserStats(userId: number) {
    // Recupera progetti
    this.projectService.getUserProjectStats(userId).subscribe(stats => {
      this.userStats.totalProjects = Number(stats.total_projects) || 0;
    });

    // Recupera issue
    this.issueService.getIssuesByAssignee(userId).subscribe(issues => {
      this.userStats.totalIssues = issues.length;
    });

    // Recupera commenti
    this.commentService.getCommentsByUser(userId).subscribe(comments => {
      this.userStats.comments = comments.length;
    });
  }
  
  selectFeature(index: number) {
    this.currentFeatureIndex = index;
  }
  
  get currentFeature() {
    return this.features[this.currentFeatureIndex];
  }

  // Metodi per gestire i tips
  get availableTips() {
    return this.tips.filter(tip => {
      if (tip.adminOnly && this.currentUser?.role !== 'admin') {
        return false;
      }
      return true;
    });
  }

  get currentTip() {
    const tips = this.availableTips;
    return tips[this.currentTipIndex % tips.length];
  }

  nextTip() {
    const tips = this.availableTips;
    this.currentTipIndex = (this.currentTipIndex + 1) % tips.length;
  }

  previousTip() {
    const tips = this.availableTips;
    this.currentTipIndex = this.currentTipIndex === 0 ? tips.length - 1 : this.currentTipIndex - 1;
  }

  selectTip(index: number) {
    this.currentTipIndex = index;
  }

  private startTipRotation() {
    // Cambia tip ogni 8 secondi
    setInterval(() => {
      this.nextTip();
    }, 8000);
  }

  openGitHub() {
    // Apri GitHub in una nuova tab
    window.open('https://github.com/PrevZ/IssueNet.git', '_blank');
  }
}
