import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-faq',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq {

}
