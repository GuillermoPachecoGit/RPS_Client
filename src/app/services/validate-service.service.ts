import { Injectable  } from "@angular/core";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';

import { UserLogin } from '../components/login/user-login';



@Injectable()
export class ValidateService{

    constructor(private http: Http){ }

    validateUser(user : UserLogin){
        console.log(user);
        var headers = new Headers();
        headers.append('Content-Type','application/json');
        return this.http.post("http://localhost:8080/validate/validate",JSON.stringify(user),{ headers : headers })
                            .map( response => response.json());
    }
}