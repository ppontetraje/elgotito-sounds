import { Component } from '@angular/core';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(public _sound: SoundService) { }
}