import { Component, OnInit, Input } from '@angular/core';
import { BannerData } from 'src/app/app.component';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit, BannerData {
  data: any;
  @Input() nombre!: string;
  @Input() edad!: number;
  @Input() email!: string;
  
  constructor() { }

  ngOnInit(): void {
  }
  playSound(){
    let audio = new Audio();
    audio.src = "../assets/rg.mp3";
    audio.load();
    audio.play();
  }

}
