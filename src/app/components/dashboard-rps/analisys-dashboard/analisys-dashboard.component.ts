import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analisys-dashboard',
  templateUrl: './analisys-dashboard.component.html',
  styleUrls: ['./analisys-dashboard.component.css']
})
export class AnalisysDashboardComponent implements OnInit {
  idUser = '';
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute) { 
    }

  options = [];

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   }); 
}

}
