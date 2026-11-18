import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { SoundService } from '../../services/sound.service';
import { Sound } from '../../models/Sound';
import { FirebaseService } from '../../services/firebase.service';
import { SoundComment } from '../../models/Comment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allSounds: Sound[] = [];
  soundList: Sound[] = [];
  p: number = 1;
  itemsPerPage: number = 35;
  totalProduct: number = 0;
  currentPlayingId$: Observable<string | null>;

  searchTerm: string = '';
  activeFilter: 'all' | 'fav' | 'hot' | 'new' | 'top' = 'all';

  // Comentarios & Comunidad
  comments: SoundComment[] = [];
  newAuthor: string = '';
  newCommentText: string = '';
  isSubmittingComment: boolean = false;
  quickEmojis: string[] = ['🔥', '👑', '😂', '💀', '👏', '🎯', '👀', '💪', '⭐', '🎧'];

  // Contadores globales de favoritos de Firebase
  globalFavCounts: { [soundId: string]: number } = {};

  constructor(
    public soundService: SoundService,
    public firebaseService: FirebaseService
  ) {
    this.allSounds = this.soundService.getAllSounds();
    this.totalProduct = this.allSounds.length;
    this.soundList = [...this.allSounds];
    this.currentPlayingId$ = this.soundService.currentPlayingId$;
  }

  ngOnInit(): void {
    this.loadFavorites();
    this.sortFavoritesFirst();
    this.applyFilter();
    this.loadComments();
    this.loadGlobalFavoriteCounts();
  }

  loadComments(): void {
    this.firebaseService.getComments().subscribe(data => {
      this.comments = data || [];
    });
  }

  loadGlobalFavoriteCounts(): void {
    this.firebaseService.getFavoriteCounts().subscribe(counts => {
      this.globalFavCounts = counts || {};
      this.updateDynamicTopRanks();
    });
  }

  insertEmoji(emoji: string): void {
    this.newCommentText = (this.newCommentText || '') + emoji;
  }

  submitComment(): void {
    const text = (this.newCommentText || '').trim();
    if (!text || this.isSubmittingComment) return;

    this.isSubmittingComment = true;
    const hero = this.firebaseService.getRandomHero();

    const commentData: Omit<SoundComment, 'id'> = {
      author: (this.newAuthor || '').trim() || 'Dota Fan',
      avatarHero: hero.name,
      text: text,
      createdAt: Date.now(),
      likes: 0,
      dislikes: 0
    };

    this.firebaseService.addComment(commentData).subscribe({
      next: (savedComment) => {
        this.comments.unshift(savedComment);
        this.newCommentText = '';
        this.isSubmittingComment = false;
      },
      error: () => {
        this.isSubmittingComment = false;
      }
    });
  }

  voteComment(comment: SoundComment, voteType: 'like' | 'dislike'): void {
    this.firebaseService.voteComment(comment, voteType).subscribe();
  }

  hasVotedComment(commentId?: string): 'like' | 'dislike' | null {
    return this.firebaseService.hasVotedComment(commentId);
  }

  getHeroIcon(heroName?: string): string {
    const hero = this.firebaseService.dotaHeroes.find(h => h.name === heroName);
    return hero ? hero.icon : 'fas fa-user-shield';
  }

  getTimeAgo(timestamp: number): string {
    if (!timestamp) return 'Hace un momento';
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

  updateDynamicTopRanks(): void {
    if (!this.globalFavCounts || Object.keys(this.globalFavCounts).length === 0) {
      return;
    }

    const soundScores = this.allSounds.map(s => ({
      sound: s,
      score: this.globalFavCounts[s.id] || 0
    }));

    const hasVotes = soundScores.some(s => s.score > 0);
    if (!hasVotes) return;

    soundScores.sort((a, b) => b.score - a.score);

    // Asignar los puestos Top 1 al 10 en vivo según votos reales
    soundScores.slice(0, 10).forEach((entry, idx) => {
      if (entry.score > 0) {
        entry.sound.tag = `Top ${idx + 1}`;
      }
    });
  }

  get favoriteSounds(): Sound[] {
    return this.allSounds.filter(s => s.fav === 'true');
  }

  getHotkey(sound: Sound): string | null {
    if (sound.fav !== 'true') return null;
    const favIndex = this.favoriteSounds.findIndex(s => s.id === sound.id);
    if (favIndex >= 0 && favIndex < 9) {
      return (favIndex + 1).toString();
    }
    return null;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable)
    ) {
      return;
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Tecla Escape: silenciar o detener sonido
    if (event.key === 'Escape') {
      this.stopSound();
      return;
    }

    // Teclas numéricas 1 a 9 (teclado superior y numérico)
    let pressedDigit: number | null = null;
    if (event.key >= '1' && event.key <= '9') {
      pressedDigit = parseInt(event.key, 10);
    } else if (event.code && event.code.startsWith('Numpad')) {
      const numpadChar = event.code.replace('Numpad', '');
      if (numpadChar >= '1' && numpadChar <= '9') {
        pressedDigit = parseInt(numpadChar, 10);
      }
    }

    if (pressedDigit !== null) {
      const favIndex = pressedDigit - 1;
      const favorites = this.favoriteSounds;
      if (favIndex < favorites.length) {
        event.preventDefault();
        const soundToPlay = favorites[favIndex];
        this.playSound(soundToPlay);
      }
    }
  }

  get favoriteCount(): number {
    return this.favoriteSounds.length;
  }

  get hotCount(): number {
    return this.allSounds.filter(s => s.tag === 'Hot').length;
  }

  get newCount(): number {
    return this.allSounds.filter(s => s.tag === 'New').length;
  }

  get topCount(): number {
    return this.allSounds.filter(s => !!s.tag && s.tag.includes('Top')).length;
  }

  private normalizeText(str: string): string {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  applyFilter(): void {
    const term = this.normalizeText(this.searchTerm);

    this.soundList = this.allSounds.filter(sound => {
      // Filtro de categoría
      if (this.activeFilter === 'fav' && sound.fav !== 'true') {
        return false;
      }
      if (this.activeFilter === 'hot' && sound.tag !== 'Hot') {
        return false;
      }
      if (this.activeFilter === 'new' && sound.tag !== 'New') {
        return false;
      }
      if (this.activeFilter === 'top' && (!sound.tag || !sound.tag.includes('Top'))) {
        return false;
      }

      // Filtro de texto de búsqueda
      if (term) {
        const soundText = this.normalizeText(sound.text);
        const tagText = this.normalizeText(sound.tag);
        return soundText.includes(term) || tagText.includes(term);
      }

      return true;
    });

    this.p = 1;
  }

  setFilter(filter: 'all' | 'fav' | 'hot' | 'new' | 'top'): void {
    if (this.activeFilter === filter) return;
    this.activeFilter = filter;
    this.applyFilter();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.applyFilter();
  }

  private loadFavorites(): void {
    this.allSounds.forEach(sound => {
      const fav = localStorage.getItem(`fav_${sound.id}`);
      if (fav !== null) {
        sound.fav = fav;
      }
    });
  }

  toggleFavorite(sound: Sound): void {
    const isAdding = sound.fav !== 'true';
    sound.fav = isAdding ? 'true' : 'false';
    localStorage.setItem(`fav_${sound.id}`, sound.fav);
    this.sortFavoritesFirst();
    this.applyFilter();

    // Sincronizar contador global en Firebase en tiempo real
    this.firebaseService.updateFavoriteCount(sound.id, isAdding).subscribe(count => {
      this.globalFavCounts[sound.id] = count;
      this.updateDynamicTopRanks();
    });
  }

  /**
   * Sorts the sound list to show favorites first
   * Maintains original numeric order within each group (favorites and non-favorites)
   */
  private sortFavoritesFirst(): void {
    this.allSounds.sort((a, b) => {
      const aFav = a.fav === 'true';
      const bFav = b.fav === 'true';

      if (aFav && !bFav) {
        return -1;
      }
      if (!aFav && bFav) {
        return 1;
      }

      // Preserva el orden original según su id dentro de cada grupo
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  }

  playSound(sound: Sound | string): void {
    const soundItem = typeof sound === 'string'
      ? this.allSounds.find(s => s.soundURL === sound || s.id === sound)
      : sound;

    const id = soundItem ? soundItem.id : (typeof sound === 'string' ? sound : '');

    if (id && this.soundService.isPlaying(id)) {
      this.soundService.stopSound();
    } else {
      this.soundService.playSound(soundItem || sound);
    }
  }

  stopSound(): void {
    this.soundService.stopSound();
  }

  getTopRank(tag: string): number {
    if (!tag) return 0;
    const match = tag.match(/Top\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  getMedalImage(tag: string): string | null {
    const rank = this.getTopRank(tag);
    if (rank === 1) return './assets/images/ranks/medal_8.png'; // Inmortal (Top 1)
    if (rank === 2) return './assets/images/ranks/medal_7.png'; // Divino (Top 2)
    if (rank === 3) return './assets/images/ranks/medal_6.png'; // Ancient (Top 3)
    if (rank >= 4 && rank <= 10) return './assets/images/ranks/medal_5.png'; // Leyenda (Top 4 a 10 - rango común)
    return null;
  }

  getBadgeClass(tag: string): string {
    if (tag === 'Hot') return 'badge--hot';
    if (tag === 'New') return 'badge--new';
    const rank = this.getTopRank(tag);
    if (rank === 1) return 'badge--top-1';
    if (rank === 2) return 'badge--top-2';
    if (rank === 3) return 'badge--top-3';
    if (rank >= 4) return 'badge--top-rank';
    return 'badge--top';
  }
}