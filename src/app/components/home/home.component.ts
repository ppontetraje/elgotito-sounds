import { Component, OnInit } from '@angular/core';
import { BannerData } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, BannerData {
  data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
