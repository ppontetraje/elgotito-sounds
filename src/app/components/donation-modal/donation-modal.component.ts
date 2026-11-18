import { Component, HostListener } from '@angular/core';
import { DonationService } from '../../services/donation.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-donation-modal',
  templateUrl: './donation-modal.component.html',
  styleUrls: ['./donation-modal.component.css']
})
export class DonationModalComponent {
  public qrImagePath: string = 'assets/images/yape_jp.png';
  public imageError: boolean = false;
  public copiedNotification: boolean = false;

  constructor(
    public donationService: DonationService,
    public soundService: SoundService
  ) {}

  public close(): void {
    this.donationService.closeModal();
  }

  public open(): void {
    this.donationService.openModal();
  }

  public playGotoAudio(): void {
    this.soundService.playSound('./assets/sounds/ven_colabora.mp3');
  }

  public onImageError(): void {
    // Si falla yape_jp.png, intentamos yape-qr.png
    if (this.qrImagePath === 'assets/images/yape_jp.png') {
      this.qrImagePath = 'assets/images/yape-qr.png';
    } else {
      this.imageError = true;
    }
  }

  @HostListener('window:keydown.escape')
  public onEscape(): void {
    this.close();
  }
}
