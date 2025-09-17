import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule, MatChipsModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

}
