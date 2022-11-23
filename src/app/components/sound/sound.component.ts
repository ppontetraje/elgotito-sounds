import { Component, OnInit, ViewChild } from '@angular/core';
import { Sound } from 'src/app/models/Sound';
import  packageInfo from '../../../assets/data.json';
@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.css']
})
export class SoundComponent implements OnInit {
  ngOnInit(): void {
  }
    constructor() {}

    public getAllSounds(): Sound[] {
      return packageInfo.sounds;
    }
    public playSound(path:string){
      let audio = new Audio();
      audio.src = path;
      audio.load();
      audio.play();
    }
}