import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  public readonly isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  constructor(private soundService: SoundService) {}

  public openModal(playSound: boolean = true): void {
    this.isOpenSubject.next(true);
    if (playSound) {
      this.soundService.playSound('./assets/sounds/ven_colabora.mp3');
    }
  }

  public closeModal(): void {
    this.isOpenSubject.next(false);
  }

  public toggleModal(): void {
    if (this.isOpenSubject.value) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }
}
