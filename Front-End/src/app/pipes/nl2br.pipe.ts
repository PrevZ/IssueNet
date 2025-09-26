import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizzato per convertire caratteri newline in tag HTML <br>
 * Utile per visualizzare testo multi-linea in template HTML
 * 
 * Utilizzo: {{ testoMultilinea | nl2br }}
 */
@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2brPipe implements PipeTransform {
  
  // Trasforma il testo sostituendo i caratteri di fine linea con tag <br>
  transform(value: string): string {
    // Controllo input vuoto o null
    if (!value) return '';
    
    // Sostituisce \n con <br> e rimuove \r 
    return value
      .replace(/\n/g, '<br>')  
      .replace(/\r/g, '');     
  }
}
