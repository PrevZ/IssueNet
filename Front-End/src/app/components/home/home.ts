import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  selectFeature(index: number) {
    this.currentFeatureIndex = index;
  }
  
  get currentFeature() {
    return this.features[this.currentFeatureIndex];
  }
}
