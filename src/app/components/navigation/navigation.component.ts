import { Component } from '@angular/core';
import { SoundComponent } from '../sound/sound.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  data: any;
  constructor(public _sound:SoundComponent){

  }
}
