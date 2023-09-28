import { Component, OnInit } from '@angular/core';
import { SoundComponent } from '../sound/sound.component';

@Component({
  selector: 'app-download-list',
  templateUrl: './download-list.component.html',
  styleUrls: ['./download-list.component.scss']
})
export class DownloadListComponent implements OnInit {

  soundList!:any[];
  constructor(public _sound:SoundComponent){
    this.soundList = this._sound.getAllSounds();
  }

  ngOnInit(): void {
  }

}
