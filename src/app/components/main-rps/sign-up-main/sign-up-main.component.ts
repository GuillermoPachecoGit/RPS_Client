import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRps } from './user-rps';
import { CountryRps } from './country-rps';

/**
 * Services
 */
import { InitTemplateService } from '../../../services/init-template.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-sign-up-main',
  templateUrl: './sign-up-main.component.html',
  styleUrls: ['./sign-up-main.component.css']
})

export class SignUpMainComponent implements OnInit {
  public userRPS = new UserRps('', '', '', '', '', '', '','','');
  public countries: CountryRps[];

  constructor( private initTemplate: InitTemplateService, private userService: UserService, private router : Router) { }

  ngOnInit() {
      this.getCountries();
  }

  getCountries(): void {
    this.initTemplate.getCountries()
      .subscribe( result => this.countries = result);
  }

    invalid = false;
    error_msg = '';
    onSubmit() {
        this.invalid = this.invalidUserEntry();
    
        if(!this.invalid){
            this.userService.registerUser(this.userRPS).subscribe( data => {
                if(data.result === "ok"){
                    console.log('Se registro el usuario');
                    this.router.navigateByUrl('main/signin');
                }
                else{
                  this.invalid = true;
                  console.log(data.result);
                  this.error_msg = data.result;
                }
            });
        }
    }

    invalidUserEntry() : boolean {
        if(this.userRPS.nick.length == 0){
          this.error_msg = 'Nick is empty.';
          return true; 
        }
        if(this.userRPS.name.length == 0){
          this.error_msg = 'Fist name is empty.';
          return true; 
        }
        if(this.userRPS.last_name.length == 0){
          this.error_msg = 'Last name is empty.';
          return true; 
        }
        if(this.userRPS.email.length == 0){
          this.error_msg = 'Email is empty.'; 
          return true;
        }
        if(this.userRPS.pass.length == 0){
          this.error_msg = 'Password is empty.';
          return true;
        }
        if(this.userRPS.pass !== this.userRPS.pass_conf){
            this.error_msg = 'The passwords  dont match.';
            return true;
        }
        if(this.userRPS.country.length == 0){
          this.error_msg = 'Country is empty.';
          return true;
        }
        if(this.userRPS.institution.length == 0){
          this.error_msg = 'Institution is empty.';
          return true;
        }
        if(this.userRPS.area.length == 0){
          this.error_msg = 'Area is empty.';
          return true;
        }
        return false;
      }

}

