import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegister} from '../login/user-login';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { RegisterService } from "../../services/register.service";

import { Observable } from 'rxjs/Observable';

import { CountryService } from '../../services/country.service';
import { Country } from './country';

@Component({
  selector: 'my-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})

export class Register implements OnInit { 

    user =  new UserRegister('','','','','',''); 
    submitted = false;
    invalid = false;
	errorMessage : string;
    countries : Country[];

    errorRepeated = '';
    observableCountry: Observable<Country[]>;

    constructor(private register: RegisterService, private country: CountryService,public router: Router) { }

	onSubmit() { 
        
		this.register.registerUser(this.user)
                .subscribe(data => {
                    
                    if(data.error != 'success'){
                        console.log(data.error);
                        this.errorRepeated = data.error;
                        this.invalid = true;
                    }else{
                        console.log('SE REGISTRO EL USUARIO');
                        this.router.navigateByUrl('/login');
                    }
                    
                }
                
        );
	   this.submitted = true;
    }

    ngOnInit(): void {
        this.invalid = false;
        this.observableCountry = this.country.getCountry();
	    this.observableCountry.subscribe(
            countries => this.countries = countries,
            error =>  this.errorMessage = <any>error);
   }
}