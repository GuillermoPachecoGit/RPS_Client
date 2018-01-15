import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from "./user.service";
import { MessageError } from './message-error';


@Injectable()
export class AuthService {
  isLoggedIn = false;

  constructor(private userService: UserService){}
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(email : string, pass : string, message : MessageError): boolean {
    this.userService.validateUser(email,pass).subscribe( data => {
        console.log(data);
        var resp = data['result']
        if( resp == 'ok'){
          this.isLoggedIn = true;
          return true;
        }else{
          message.msg = resp;
        }
    });
    return false;
  }

  //luego definir
  logout(): void {
    this.isLoggedIn = false;
  }
}