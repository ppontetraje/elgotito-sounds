import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  data: any;
  @Input() nombre!: string;
  @Input() edad!: number;
  @Input() email!: string;
  

  constructor() { }

  ngOnInit(): void {
  }
  playSound(){
    let audio = new Audio();
    audio.src = "../../assets/calla-la-boca.mp3";
    audio.load();
    audio.play();
  }

}
