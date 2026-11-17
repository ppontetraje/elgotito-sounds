import { Component } from '@angular/core';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  data: any;
  constructor(public _sound: SoundService){

  }
}
