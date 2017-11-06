import { Injectable  } from "@angular/core";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';

import { UserRegister } from '../components/login/user-login';



@Injectable()
export class RegisterService{

    constructor(private http: Http){ }

    registerUser(user : UserRegister){
       // console.log(user);
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this.http.post("http://localhost:8080/register/register_user",JSON.stringify(user),{ headers : headers })
                            .map( response => response.json());
    }
}