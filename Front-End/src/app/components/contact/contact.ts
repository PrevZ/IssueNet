import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule, MatChipsModule, RouterModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

}
