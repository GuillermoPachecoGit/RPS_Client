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
import { UserService } from '../../../services/user.service';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

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
  email_recovery = '';
  invalid_recovery = false;
  error_msg_recovery = '';

  constructor(private loginService: AuthService, private route: Router, private shared: SharedDatasetService, private userService: UserService) { 
    
    this.subscription = this.shared.getErrorLogin().subscribe( params => {
        this.invalid = true;
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
    }
  }

  passRecovery(){
    this.userService.passRecovery({ email: this.email_recovery}).subscribe( params => {

        console.log(params);
        console.log(params.result );
        if(params.result == 'ok'){
          var result = confirm('Your new password was sent to your email account. Please sign in again.');
          $('#hideRecovery').click();
        }else{
          console.log("seteo el error");
          this.invalid_recovery = true;
          this.error_msg_recovery = params.result;
        }
    });


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
