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

@Component({
  selector: 'app-sign-in-main',
  templateUrl: './sign-in-main.component.html',
  styleUrls: ['./sign-in-main.component.css']
})
export class SignInMainComponent implements OnInit {
  email = '';
  pass = '';
  invalid = false;
  lg_error_message = '';

  constructor(private loginService: AuthService, private route: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('ENTRE A VALIDAR');
    this.invalid = this.invalidateEntry();
    if (!this.invalid) {
      // tslint:disable-next-line:prefer-const
      let resultMessage = new MessageError('');
      console.log(this.email + this.pass);

      this.loginService.login(this.email, this.pass, resultMessage);

      if (resultMessage.msg.length > 0) {
        this.lg_error_message = resultMessage.msg;
      }
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
