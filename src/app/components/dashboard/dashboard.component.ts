import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicComponentDirective } from 'src/app/directives/dynamic-component.directive';
import { SoundComponent } from '../sound/sound.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  soundList!:any[];
  errMsg!:string;
  constructor(public _sound:SoundComponent){
    this.soundList = this._sound.getAllSounds();
  }
  ngOnInit(): void {
    
  }

  /** Based on the screen size, switch from standard to one column per row 
 
  @ViewChild(DynamicComponentDirective) dynamic !: DynamicComponentDirective;
  idx = 0;
  ngAfterViewInit():void{
    this.generateComponent();
    //interval(3000).subscribe(() : void => this.generateComponent());
  }
  generateComponent():void{
    const viewContainerRef = this.dynamic.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(SoundComponent);
    //componentRef.instance.body = BANNERS[this.idx].data;
  }*/
}
  