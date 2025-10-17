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
  standalone: true,
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
  
  // Features
  features = [
    {
      id: 0,
      title: 'Dashboard Intuitiva',
      description: 'Visualizza tutti i tuoi progetti e issue in un\'interfaccia chiara e organizzata.',
      icon: 'dashboard',
      image: '/assets/images/dashboard.png',
      alt: 'Dashboard IssueNet'
    },
    {
      id: 1,
      title: 'Collaborazione',
      description: 'Lavora in team, assegna compiti e tieni traccia dei progressi di tutti.',
      icon: 'group',
      image: '/assets/images/project.png',
      alt: 'Collaborazione in team'
    },
    {
      id: 2,
      title: 'Tracking Avanzato',
      description: 'Monitora lo stato degli issue, aggiungi commenti e tieni tutto sotto controllo.',
      icon: 'track_changes',
      image: '/assets/images/issues.png',
      alt: 'Tracking degli issue'
    }
  ];
  
  currentFeatureIndex = 0;

  // statistiche utente
  userStats = {
    registrationDate: '',
    totalProjects: 0,
    totalIssues: 0,
    comments: 0
  };

  // Tips
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

  // Companies carousel
  companies = [
    {
      name: 'Microsoft',
      logo: 'https://www.logo.wine/a/logo/Microsoft/Microsoft-Logo.wine.svg',
      url: 'https://www.microsoft.com/'
    },
    {
      name: 'Google',
      logo: 'https://www.logo.wine/a/logo/Google/Google-Logo.wine.svg',
      url: 'https://www.google.com/'
    },
    {
      name: 'Apple',
      logo: 'https://www.logo.wine/a/logo/Apple_Inc./Apple_Inc.-Logo.wine.svg',
      url: 'https://www.apple.com/'
    },
    {
      name: 'Amazon',
      logo: 'https://www.logo.wine/a/logo/Amazon_(company)/Amazon_(company)-Logo.wine.svg',
      url: 'https://www.amazon.com/'
    },
    {
      name: 'Meta',
      logo: 'https://www.logo.wine/a/logo/Meta_Platforms/Meta_Platforms-Logo.wine.svg',
      url: 'https://www.meta.com/'
    },
    {
      name: 'Netflix',
      logo: 'https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg',
      url: 'https://www.netflix.com/'
    },
    {
      name: 'Tesla',
      logo: 'https://www.logo.wine/a/logo/Tesla%2C_Inc./Tesla%2C_Inc.-Logo.wine.svg',
      url: 'https://www.tesla.com/'
    },
    {
      name: 'Adobe',
      logo: 'https://www.logo.wine/a/logo/Adobe_Inc./Adobe_Inc.-Logo.wine.svg',
      url: 'https://www.adobe.com/'
    }
  ];


  // Costruttore - inizializza i servizi
  constructor(private userService: UserService, private projectService: ProjectService, private issueService: IssueService,private commentService: CommentService) {}

  // Inizializzazione del component
  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserStats(user.id_user);
        this.startTipRotation();
      }
    });
  }

  // Carica le statistiche dell'utente corrente
  loadUserStats(userId: number) {
    // Imposta la data di registrazione dall'utente corrente
    if (this.currentUser?.created_at) {
      this.userStats.registrationDate = this.currentUser.created_at;
    }

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
  
  // Seleziona una feature specifica
  selectFeature(index: number) {
    this.currentFeatureIndex = index;
  }
  
  // Restituisce la feature selezionata
  get currentFeature() {
    return this.features[this.currentFeatureIndex];
  }

  // Restituisce i tips disponibili in base al ruolo utente
  get availableTips() {
    return this.tips.filter(tip => {
      if (tip.adminOnly && this.currentUser?.role !== 'admin') {
        return false;
      }
      return true;
    });
  }

  // Restituisce il tip correntemente visualizzato
  get currentTip() {
    const tips = this.availableTips;
    return tips[this.currentTipIndex % tips.length];
  }

  // Naviga al tip successivo
  nextTip() {
    const tips = this.availableTips;
    this.currentTipIndex = (this.currentTipIndex + 1) % tips.length;
  }

  // Naviga al tip precedente
  previousTip() {
    const tips = this.availableTips;
    this.currentTipIndex = this.currentTipIndex === 0 ? tips.length - 1 : this.currentTipIndex - 1;
  }

  // Seleziona un tip specifico
  selectTip(index: number) {
    this.currentTipIndex = index;
  }

  // Avvia la rotazione automatica dei tips
  private startTipRotation() {
    // Cambia tip ogni 8 secondi
    setInterval(() => {
      this.nextTip();
    }, 8000);
  }

  // Apre il repository GitHub in una nuova scheda
  openGitHub() {
    // Apri GitHub in una nuova tab
    window.open('https://github.com/PrevZ/IssueNet.git', '_blank');
  }

  // Verifica se l'utente corrente è project manager
  isPM(): boolean {
    return this.currentUser?.role === 'project_manager';
  }

  // Verifica se l'utente corrente è admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
