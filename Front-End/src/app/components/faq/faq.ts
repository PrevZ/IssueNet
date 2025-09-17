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
  activeFaqs: Set<number> = new Set();

  toggleFaq(faqId: number): void {
    if (this.activeFaqs.has(faqId)) {
      this.activeFaqs.delete(faqId);
    } else {
      this.activeFaqs.add(faqId);
    }
    
    // Toggle CSS class
    const element = document.querySelector(`.faq-item:nth-child(${faqId})`);
    if (element) {
      element.classList.toggle('active');
    }
  }

  isFaqActive(faqId: number): boolean {
    return this.activeFaqs.has(faqId);
  }
}
