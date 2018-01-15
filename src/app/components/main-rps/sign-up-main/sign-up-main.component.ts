import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserRps } from "./user-rps";
import { CountryRps } from "./country-rps";

/**
 * Services
 */
import { InitTemplateService } from "../../../services/init-template.service";
import { UserService } from "../../../services/user.service";


@Component({
  selector: 'app-sign-up-main',
  templateUrl: './sign-up-main.component.html',
  styleUrls: ['./sign-up-main.component.css']
})

export class SignUpMainComponent implements OnInit {
  public userRPS = new UserRps('','','','','','','');
  public countries : CountryRps[];

  constructor( private initTemplate : InitTemplateService, private userService: UserService, private router : Router) { }

  ngOnInit() {
      this.getCountries();
  }

  getCountries(): void {
    this.initTemplate.getCountries()
      .subscribe( result => this.countries = result);
  }

  onSubmit() { 
        
		this.userService.registerUser(this.userRPS)
                .subscribe(data => {
                    if(data.result != 'ok'){
                        console.log(data.result);
                        //this.errorRepeated = data.error;
                        //this.invalid = true;
                    }else{
                        console.log('SE REGISTRO EL USUARIO');
                        this.router.navigateByUrl('/signin');
                    }
                    
                }
                
        );
    }
}
