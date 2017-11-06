import { Component } from '@angular/core';
import { UserLogin } from "./user-login";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ValidateService } from "../../services/validate-service.service";
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'my-login',
  templateUrl:'./login.component.html',
  styleUrls: [ './login.component.css' ],
  providers: [ ValidateService]
})
export class LoginComponent {
 

	constructor(private validate: ValidateService, private router: Router, private navbar : NavbarComponent) {}
	user =  new UserLogin('',''); 
  error = '';
  invalid = false;
	submitted = false;
  id_user = '';
	
	onSubmit() { 
		this.validate.validateUser(this.user)
                .subscribe(data => {
                    console.log('Success ' + data)
                    if(data.error != 'success'){
                        console.log(data.error);
                        this.error = data.error;
                        this.invalid = true;
                        
                    }else{
                      this.invalid = false;
                      this.navbar.changeMode();
                      this.id_user = data.id_user;
                      console.log(this.id_user);
                      this.router.navigateByUrl('/profile');
                      console.log('SUCCESS');

                    }
                });
	   this.submitted = true;
    }

 }

