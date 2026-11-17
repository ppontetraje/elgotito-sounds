import { Component, OnInit } from '@angular/core';
import { SoundService } from '../../services/sound.service';
import { Sound } from '../../models/Sound';

@Component({
  selector: 'app-download-list',
  templateUrl: './download-list.component.html',
  styleUrls: ['./download-list.component.css']
})
export class DownloadListComponent implements OnInit {

  soundList!: Sound[];
  constructor(public _sound: SoundService){
    this.soundList = this._sound.getAllSounds();
  }

  ngOnInit(): void {
  }

}
