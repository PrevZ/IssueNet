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

  constructor(private userService: UserService, private projectService: ProjectService, private issueService: IssueService,private commentService: CommentService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserStats(user.id_user);
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
}
