import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/**
 * Services
 */
// import { UserService } from "../../../services/user.service";
import { Console } from '@angular/core/src/console';
import { AuthService } from '../../../services/auth.service';

/**
 * Classes
 */
import { MessageError } from '../../../services/message-error';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in-main',
  templateUrl: './sign-in-main.component.html',
  styleUrls: ['./sign-in-main.component.css']
})
export class SignInMainComponent implements OnInit {
  
  subscription: Subscription;
  email = '';
  pass = '';
  invalid = false;
  lg_error_message = '';

  constructor(private loginService: AuthService, private route: Router, private shared: SharedDatasetService) { 
    
    this.subscription = this.shared.getErrorLogin().subscribe( params => {
        console.log('pase por aca putos, esta todo para el culo');
        this.invalid = true;
        console.log(params);
        this.lg_error_message = params;
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.invalid = true;
    this.invalid = this.invalidateEntry();
    if (!this.invalid) {
      let resultMessage = new MessageError('');
      this.loginService.login(this.email, this.pass, resultMessage);
      /*if(!this.loginService.isLoggedIn){
        this.invalid = true;
        this.lg_error_message = 'Email or password not valid.';
      }*/
      
      
    }
  }

  invalidateEntry(): boolean {
    if (this.email.length === 0) {
      this.lg_error_message = 'Please enter the email field.';
      return true;
    }
    if (this.pass.length === 0) {
       this.lg_error_message = 'Please enter the password field.';
       return true;
    }
    return false;
  }
}
