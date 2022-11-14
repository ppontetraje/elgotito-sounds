import { ThisReceiver } from '@angular/compiler';
import { Component, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { HomeComponent } from './components/home/home.component';
import { TextComponent } from './components/text/text.component';
import { DynamicComponentDirective } from './directives/dynamic-component.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DynamicComponentDirective) dynamic !: DynamicComponentDirective;
  idx = 0;
  ngAfterViewInit():void{
    this.generateComponent();
    interval(3000).subscribe(() : void => this.generateComponent());
  }
  generateComponent():void{
    const viewContainerRef = this.dynamic.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<BannerData>(BANNERS[this.idx].component);
    componentRef.instance.data = BANNERS[this.idx].data;
    this.idx = this.idx === 0 ? 1 : 0;
  }
}
  //title = 'sound-page';
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

  }

