import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SoundService } from '../../services/sound.service';
import { Sound } from '../../models/Sound';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  soundList: Sound[] = [];
  p: number = 1;
  itemsPerPage: number = 35;
  totalProduct: number = 0;
  currentPlayingId$: Observable<string | null>;

  constructor(public soundService: SoundService) {
    this.soundList = this.soundService.getAllSounds();
    this.totalProduct = this.soundList.length;
    this.currentPlayingId$ = this.soundService.currentPlayingId$;
  }

  ngOnInit(): void {
    this.loadFavorites();
    this.sortFavoritesFirst();
  }

  private loadFavorites(): void {
    this.soundList.forEach(sound => {
      const fav = localStorage.getItem(`fav_${sound.id}`);
      if (fav !== null) {
        sound.fav = fav;
      }
    });
  }

  toggleFavorite(sound: Sound): void {
    sound.fav = sound.fav === 'true' ? 'false' : 'true';
    localStorage.setItem(`fav_${sound.id}`, sound.fav);
    this.sortFavoritesFirst();
  }

  /**
   * Sorts the sound list to show favorites first
   * Maintains original order within each group (favorites and non-favorites)
   */
  private sortFavoritesFirst(): void {
    this.soundList.sort((a, b) => {
      if ((a.fav === 'true' && b.fav === 'true') || (a.fav !== 'true' && b.fav !== 'true')) {
        return 0;
      }
      if (a.fav === 'true' && b.fav !== 'true') {
        return -1;
      }
      return 1;
    });
  }

  playSound(sound: Sound | string): void {
    const soundItem = typeof sound === 'string'
      ? this.soundList.find(s => s.soundURL === sound || s.id === sound)
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
}