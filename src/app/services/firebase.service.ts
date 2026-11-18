import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { firebaseConfig } from '../../environments/firebase.config';
import { SoundComment, AudioRecommendation } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly baseUrl: string;

  // Lista de héroes/iconos temáticos para avatares aleatorios de Dota 2
  public readonly dotaHeroes = [
    { name: 'Nyx Assassin', icon: 'fas fa-bug', color: '#c0392b' },
    { name: 'Pudge', icon: 'fas fa-anchor', color: '#8e44ad' },
    { name: 'Invoker', icon: 'fas fa-magic', color: '#f39c12' },
    { name: 'Juggernaut', icon: 'fas fa-khanda', color: '#d35400' },
    { name: 'Axe', icon: 'fas fa-gavel', color: '#c0392b' },
    { name: 'Crystal Maiden', icon: 'fas fa-snowflake', color: '#2980b9' },
    { name: 'Rubick', icon: 'fas fa-eye', color: '#27ae60' },
    { name: 'Shadow Fiend', icon: 'fas fa-skull', color: '#34495e' },
    { name: 'Sniper', icon: 'fas fa-crosshairs', color: '#e67e22' }
  ];

  constructor(private http: HttpClient) {
    this.baseUrl = (firebaseConfig.databaseURL || '').replace(/\/$/, '');
  }

  public getRandomHero(): { name: string; icon: string; color: string } {
    const index = Math.floor(Math.random() * this.dotaHeroes.length);
    return this.dotaHeroes[index];
  }

  // ==========================================
  // COMENTARIOS
  // ==========================================

  public getComments(): Observable<SoundComment[]> {
    if (!this.baseUrl) {
      return of(this.getLocalComments());
    }

    return this.http.get<{ [id: string]: SoundComment }>(`${this.baseUrl}/comments.json`).pipe(
      map(data => {
        if (!data) return this.getLocalComments();
        const list: SoundComment[] = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        // Ordenar del más reciente al más antiguo
        return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }),
      catchError(() => {
        return of(this.getLocalComments());
      })
    );
  }

  public addComment(comment: Omit<SoundComment, 'id'>): Observable<SoundComment> {
    const newComment: SoundComment = {
      ...comment,
      createdAt: Date.now(),
      likes: 0,
      dislikes: 0
    };

    if (!this.baseUrl) {
      this.saveLocalComment(newComment);
      return of(newComment);
    }

    return this.http.post<{ name: string }>(`${this.baseUrl}/comments.json`, newComment).pipe(
      map(response => {
        const saved = { ...newComment, id: response.name };
        this.saveLocalComment(saved);
        return saved;
      }),
      catchError(() => {
        this.saveLocalComment(newComment);
        return of(newComment);
      })
    );
  }

  public voteComment(comment: SoundComment, voteType: 'like' | 'dislike'): Observable<any> {
    const storageKey = `voted_comment_${comment.id}`;
    const previousVote = localStorage.getItem(storageKey);

    if (previousVote === voteType) {
      return of(null); // Ya votó lo mismo
    }

    let likes = comment.likes || 0;
    let dislikes = comment.dislikes || 0;

    if (voteType === 'like') {
      likes += 1;
      if (previousVote === 'dislike' && dislikes > 0) {
        dislikes -= 1;
      }
    } else {
      dislikes += 1;
      if (previousVote === 'like' && likes > 0) {
        likes -= 1;
      }
    }

    comment.likes = likes;
    comment.dislikes = dislikes;
    localStorage.setItem(storageKey, voteType);
    this.updateLocalComment(comment);

    if (!this.baseUrl || !comment.id) {
      return of({ likes, dislikes });
    }

    return this.http.patch(`${this.baseUrl}/comments/${comment.id}.json`, { likes, dislikes }).pipe(
      catchError(() => of({ likes, dislikes }))
    );
  }

  public hasVotedComment(commentId?: string): 'like' | 'dislike' | null {
    if (!commentId) return null;
    return localStorage.getItem(`voted_comment_${commentId}`) as 'like' | 'dislike' | null;
  }

  // ==========================================
  // CONTADORES GLOBALES DE FAVORITOS
  // ==========================================

  public getFavoriteCounts(): Observable<{ [soundId: string]: number }> {
    if (!this.baseUrl) {
      return of(this.getLocalFavoriteCounts());
    }

    return this.http.get<{ [soundId: string]: number }>(`${this.baseUrl}/favorite_counts.json`).pipe(
      map(data => data || {}),
      catchError(() => of(this.getLocalFavoriteCounts()))
    );
  }

  public updateFavoriteCount(soundId: string, increment: boolean): Observable<number> {
    const localCounts = this.getLocalFavoriteCounts();
    const current = localCounts[soundId] || 0;
    const nextCount = Math.max(0, current + (increment ? 1 : -1));
    localCounts[soundId] = nextCount;
    localStorage.setItem('firebase_fav_counts', JSON.stringify(localCounts));

    if (!this.baseUrl) {
      return of(nextCount);
    }

    return this.http.put<number>(`${this.baseUrl}/favorite_counts/${soundId}.json`, nextCount).pipe(
      catchError(() => of(nextCount))
    );
  }

  // ==========================================
  // RECOMENDACIONES DE AUDIOS
  // ==========================================

  public getRecommendations(): Observable<AudioRecommendation[]> {
    if (!this.baseUrl) {
      return of(this.getLocalRecommendations());
    }

    return this.http.get<{ [id: string]: AudioRecommendation }>(`${this.baseUrl}/recommendations.json`).pipe(
      map(data => {
        if (!data) return this.getLocalRecommendations();
        const list: AudioRecommendation[] = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        return list.sort((a, b) => (b.votes || 0) - (a.votes || 0) || (b.createdAt || 0) - (a.createdAt || 0));
      }),
      catchError(() => of(this.getLocalRecommendations()))
    );
  }

  public addRecommendation(rec: Omit<AudioRecommendation, 'id' | 'votes' | 'createdAt' | 'status'>): Observable<AudioRecommendation> {
    const newRec: AudioRecommendation = {
      ...rec,
      createdAt: Date.now(),
      votes: 1,
      status: 'pending'
    };

    if (!this.baseUrl) {
      this.saveLocalRecommendation(newRec);
      return of(newRec);
    }

    return this.http.post<{ name: string }>(`${this.baseUrl}/recommendations.json`, newRec).pipe(
      map(response => {
        const saved = { ...newRec, id: response.name };
        this.saveLocalRecommendation(saved);
        return saved;
      }),
      catchError(() => {
        this.saveLocalRecommendation(newRec);
        return of(newRec);
      })
    );
  }

  public voteRecommendation(rec: AudioRecommendation): Observable<number> {
    const storageKey = `voted_rec_${rec.id}`;
    if (localStorage.getItem(storageKey)) {
      return of(rec.votes);
    }

    rec.votes = (rec.votes || 0) + 1;
    localStorage.setItem(storageKey, 'true');
    this.updateLocalRecommendation(rec);

    if (!this.baseUrl || !rec.id) {
      return of(rec.votes);
    }

    return this.http.patch(`${this.baseUrl}/recommendations/${rec.id}.json`, { votes: rec.votes }).pipe(
      map(() => rec.votes),
      catchError(() => of(rec.votes))
    );
  }

  public hasVotedRecommendation(recId?: string): boolean {
    if (!recId) return false;
    return !!localStorage.getItem(`voted_rec_${recId}`);
  }

  // ==========================================
  // HELPERS LOCAL STORAGE (Fallback offline)
  // ==========================================

  private getLocalComments(): SoundComment[] {
    const raw = localStorage.getItem('firebase_comments');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    // Comentarios iniciales de bienvenida
    const initial: SoundComment[] = [
      {
        id: 'initial_1',
        author: 'DotaFan_Gamer',
        avatarHero: 'Nyx Assassin',
        text: '¡Buena página para sacar clips en stream! Los audios de "Una chiki" y "Ta picantísimo" están god 🔥👑',
        createdAt: Date.now() - 3600000 * 2,
        likes: 12,
        dislikes: 1
      },
      {
        id: 'initial_2',
        author: 'Support_5',
        avatarHero: 'Crystal Maiden',
        text: 'Añadan el audio de cuando se le apaga la PC en plena teamfight 😂',
        createdAt: Date.now() - 3600000 * 5,
        likes: 8,
        dislikes: 0
      }
    ];
    localStorage.setItem('firebase_comments', JSON.stringify(initial));
    return initial;
  }

  private saveLocalComment(comment: SoundComment): void {
    const list = this.getLocalComments();
    list.unshift(comment);
    localStorage.setItem('firebase_comments', JSON.stringify(list));
  }

  private updateLocalComment(comment: SoundComment): void {
    const list = this.getLocalComments();
    const index = list.findIndex(c => c.id === comment.id);
    if (index >= 0) {
      list[index] = comment;
      localStorage.setItem('firebase_comments', JSON.stringify(list));
    }
  }

  private getLocalFavoriteCounts(): { [soundId: string]: number } {
    const raw = localStorage.getItem('firebase_fav_counts');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return {};
  }

  private getLocalRecommendations(): AudioRecommendation[] {
    const raw = localStorage.getItem('firebase_recommendations');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return [];
  }

  private saveLocalRecommendation(rec: AudioRecommendation): void {
    const list = this.getLocalRecommendations();
    list.unshift(rec);
    localStorage.setItem('firebase_recommendations', JSON.stringify(list));
  }

  private updateLocalRecommendation(rec: AudioRecommendation): void {
    const list = this.getLocalRecommendations();
    const index = list.findIndex(r => r.id === rec.id);
    if (index >= 0) {
      list[index] = rec;
      localStorage.setItem('firebase_recommendations', JSON.stringify(list));
    }
  }
}
