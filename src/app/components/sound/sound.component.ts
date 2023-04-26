import { Component, OnInit, ViewChild } from '@angular/core';
import { Sound } from 'src/app/models/Sound';
import  packageInfo from '../../../assets/data.json';
@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.css']
})
export class SoundComponent implements OnInit {
  
  audio:any;
  
  ngOnInit(): void {
    
  }
    constructor() {
      
    }

    public getAllSounds(): Sound[] {
     /** 
      for (let index = 0; index < packageInfo.sounds.length; index++) {
        packageInfo.sounds[index].id = (index+1)+"";
      }
      console.log(packageInfo.sounds) 
      */
      return packageInfo.sounds;
    }
    
    public playSound(path:string){
      if(this.audio){
        /*console.log(path);*/
        this.audio.pause();
      }
      this.audio = new Audio();
      this.audio.src = path;
      this.audio.load();
      this.audio.play();
    }

}