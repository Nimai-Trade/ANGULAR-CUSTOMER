import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  tradeSupport: string;

  constructor() { }

  ngOnInit() {
    this.tradeSupport= environment.support;
  }

}
