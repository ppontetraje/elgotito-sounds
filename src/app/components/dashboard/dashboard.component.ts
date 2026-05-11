import { Component, OnInit } from '@angular/core';
import { SoundComponent } from '../sound/sound.component';
import { Sound } from 'src/app/models/Sound';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  soundList: Sound[] = [];
  p: number = 1;
  itemsPerPage: number = 35;
  totalProduct: number = 0;

  constructor(private _sound: SoundComponent) {
    this.soundList = this._sound.getAllSounds();
    this.totalProduct = this.soundList.length;
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
      // If both are favorites or both are not favorites, maintain original order
      if ((a.fav === 'true' && b.fav === 'true') || (a.fav !== 'true' && b.fav !== 'true')) {
        return 0;
      }
      // If a is favorite and b is not, a comes first (negative return value)
      if (a.fav === 'true' && b.fav !== 'true') {
        return -1;
      }
      // If a is not favorite and b is, b comes first (positive return value)
      return 1;
    });
  }

  playSound(path: string): void {
    this._sound.playSound(path);
  }
}
  