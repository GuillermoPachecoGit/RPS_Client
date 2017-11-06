import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  active = true;
  
    changeMode(){
      console.log("cambie el modoo");
      this.active = false;
    }
  

  constructor() { }

  ngOnInit() {
  }

}