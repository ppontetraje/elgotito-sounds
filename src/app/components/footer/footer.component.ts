import { Component } from '@angular/core';
import { SoundComponent } from '../sound/sound.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(public _sound: SoundComponent) { }
}