import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AudioRecommendation } from '../../models/Comment';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {
  recommendations: AudioRecommendation[] = [];
  
  // Formulario
  phrase: string = '';
  clipUrl: string = '';
  timestampHint: string = '';
  author: string = '';

  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(public firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.firebaseService.getRecommendations().subscribe(data => {
      this.recommendations = data || [];
    });
  }

  submitRecommendation(): void {
    const trimmedPhrase = (this.phrase || '').trim();
    if (!trimmedPhrase) {
      this.errorMessage = 'Por favor escribe la frase o audio que deseas pedir.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newRec: Omit<AudioRecommendation, 'id' | 'votes' | 'createdAt' | 'status'> = {
      phrase: trimmedPhrase,
      clipUrl: (this.clipUrl || '').trim(),
      timestampHint: (this.timestampHint || '').trim(),
      author: (this.author || '').trim() || 'Dota fan'
    };

    this.firebaseService.addRecommendation(newRec).subscribe({
      next: (created) => {
        this.recommendations.unshift(created);
        this.phrase = '';
        this.clipUrl = '';
        this.timestampHint = '';
        this.isSubmitting = false;
        this.successMessage = '¡Petición enviada con éxito! La comunidad podrá apoyarla con sus votos.';
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Hubo un error al enviar tu solicitud. Intenta nuevamente.';
      }
    });
  }

  vote(rec: AudioRecommendation): void {
    this.firebaseService.voteRecommendation(rec).subscribe();
  }

  hasVoted(recId?: string): boolean {
    return this.firebaseService.hasVotedRecommendation(recId);
  }

  getTimeAgo(timestamp: number): string {
    if (!timestamp) return 'Hace poco';
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Hace unos segundos';
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days} d`;
    return new Date(timestamp).toLocaleDateString();
  }
}
