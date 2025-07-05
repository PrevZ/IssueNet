import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-features',
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './features.html',
  styleUrl: './features.css'
})
export class Features {

}
