import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextComponent } from './components/text/text.component';
import { HomeComponent } from './components/home/home.component';
import { DynamicComponentDirective } from './directives/dynamic-component.directive';

@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    HomeComponent,
    DynamicComponentDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
