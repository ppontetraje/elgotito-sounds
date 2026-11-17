import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sound } from '../models/Sound';
import packageInfo from '../../assets/data.json';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private readonly audio: HTMLAudioElement = new Audio();
  private readonly currentPlayingIdSubject = new BehaviorSubject<string | null>(null);
  public readonly currentPlayingId$: Observable<string | null> = this.currentPlayingIdSubject.asObservable();

  private soundsCache: Sound[] = [];

  constructor() {
    this.audio.addEventListener('ended', () => {
      this.currentPlayingIdSubject.next(null);
    });

    this.audio.addEventListener('pause', () => {
      if (this.audio.paused) {
        this.currentPlayingIdSubject.next(null);
      }
    });

    this.audio.addEventListener('error', () => {
      this.currentPlayingIdSubject.next(null);
    });
  }

  public getAllSounds(): Sound[] {
    if (this.soundsCache.length === 0) {
      const rawSounds = packageInfo.sounds as Sound[];
      for (let index = 0; index < rawSounds.length; index++) {
        rawSounds[index].id = (index + 1).toString();
      }
      this.soundsCache = rawSounds;
    }
    return this.soundsCache;
  }

  public playSound(sound: Sound | string): void {
    let soundId: string | null = null;
    let soundUrl = '';

    if (typeof sound === 'string') {
      const allSounds = this.getAllSounds();
      const found = allSounds.find(s => s.id === sound || s.soundURL === sound);
      if (found) {
        soundId = found.id;
        soundUrl = found.soundURL;
      } else {
        soundUrl = sound;
      }
    } else if (sound) {
      soundId = sound.id;
      soundUrl = sound.soundURL;
    }

    if (!soundUrl) {
      return;
    }

    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = soundUrl;
    this.audio.load();
    this.currentPlayingIdSubject.next(soundId);

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (this.currentPlayingIdSubject.value === soundId) {
          this.currentPlayingIdSubject.next(null);
        }
      });
    }
  }

  public stopSound(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentPlayingIdSubject.next(null);
  }

  public isPlaying(id: string): boolean {
    return this.currentPlayingIdSubject.value === id;
  }
}
