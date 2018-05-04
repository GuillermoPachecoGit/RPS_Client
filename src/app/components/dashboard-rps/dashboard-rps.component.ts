import { Component, OnInit  } from '@angular/core';
import {ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs';
import { SharedDatasetService } from '../../services/shared-dataset.service';

@Component({
  selector: 'app-dashboard-rps',
  templateUrl: './dashboard-rps.component.html',
  styleUrls: ['./dashboard-rps.component.css']
})
export class DashboardRpsComponent implements OnInit {

  constructor() { 

  }

  ngOnInit() {
  }

}
