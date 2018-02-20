import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-rps-main',
  templateUrl: './home-rps-main.component.html',
  styleUrls: ['./home-rps-main.component.css']
})
export class HomeRpsMainComponent implements OnInit {
  private picos = require('./picos.png');
  private craneos = require('./craneos.png');
  private caracoles = require('./caracoles.png');

  constructor() { }

  ngOnInit() {
  }

}
