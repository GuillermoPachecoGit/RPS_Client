import { Component, OnInit } from '@angular/core';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

declare var Highcharts: any;

@Component({
  selector: 'app-result-dashboard',
  templateUrl: './result-dashboard.component.html',
  styleUrls: ['./result-dashboard.component.css']
})
export class ResultDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
