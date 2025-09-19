import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [MatExpansionModule, MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule, MatChipsModule, RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq {
  // Nuovo sistema per gestire le FAQ con ID stringa
  openFaqs: { [key: string]: boolean } = {};

  // Metodo per gestire il toggle delle FAQ
  toggleFaq(faqId: string): void {
    this.openFaqs[faqId] = !this.openFaqs[faqId];
  }

  // Metodo per verificare se una FAQ è aperta
  isFaqOpen(faqId: string): boolean {
    return !!this.openFaqs[faqId];
  }
}
