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

  constructor(private userService: UserService, private route: Router, private sharedDatasetService: SharedDatasetService) {}
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(email: string, pass: string, message: MessageError): boolean {

    this.userService.validateUser(email, pass).subscribe( data => {
        console.log(data);
        const resp = data['error'];
        console.log(resp);
        if (resp === 'success') {
          console.log('entre a retornar exito');
          this.isLoggedIn = true;
         // this.sharedDatasetService.setIdUser();
          this.route.navigate( ['/dashboard', data['id_user']]);
        }else {
          message.msg = resp;
        }
    });

    return this.isLoggedIn;
  }

  // luego definir
  logout(): void {
    this.isLoggedIn = false;
  }

}
