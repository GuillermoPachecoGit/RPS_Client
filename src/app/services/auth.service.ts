import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { MessageError } from './message-error';
import { Router } from '@angular/router';

/**
 * Services
 */
import { SharedDatasetService } from '../services/shared-dataset.service';



@Injectable()
export class AuthService {
  isLoggedIn = false;
  msg = '';

  constructor(private userService: UserService, private route: Router, private sharedDatasetService: SharedDatasetService) {}
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(email: string, pass: string, message: MessageError) {

   this.userService.validateUser(email, pass).subscribe( data => {
        const resp = data['error'];
        if (resp === 'success') {
          console.log('entre a retornar exito');
          this.isLoggedIn = true;
         // this.sharedDatasetService.setIdUser();
          this.route.navigate( ['/dashboard', data['id_user']]);
        }else {
          this.sharedDatasetService.setErrorLogin(resp);
          return resp;
        }
    });
  }

  getMessageError(){
    return this.msg;
  }

  // luego definir
  logout(): void {
    this.isLoggedIn = false;
  }

}
