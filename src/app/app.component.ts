import {  Component,  OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor() { 
  
  }
  /*@ViewChild(DynamicComponentDirective) dynamic !: DynamicComponentDirective;
  idx = 0;
  ngAfterViewInit():void{
    this.generateComponent();
    //interval(3000).subscribe(() : void => this.generateComponent());
  }
  */
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
 }

}
  /*//*title = 'sound-page';
  const BANNERS = [
    {
      data: {
        text: 'Componente 1',
    },
    component: TextComponent
    },
    {
      data: {
        text: 'Componente 1',
    },
    component: HomeComponent
    }
  ]

  export interface BannerData{
    data: any;

  }*/

