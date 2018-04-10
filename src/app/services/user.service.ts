import { Injectable  } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserRps } from '../components/main-rps/sign-up-main/user-rps';



@Injectable()
export class UserService {

    constructor(private http: Http) { }
    server = '10.1.6.31';

    url_save = 'http://'+this.server+':3000/db_request_user_w/register_user';

    registerUser(user: UserRps) {
       // console.log(user);
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(user));
        return this.http.post(this.url_save, JSON.stringify(user), { headers : headers })
                            .map( response => response.json());
    }

    // tslint:disable-next-line:member-ordering
    url_validate = 'http://'+this.server+':3000/db_request_user/validate_user';

    validateUser(email: string, pass: string) {
        // console.log(user);
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.url_validate, JSON.stringify({'email': email, 'pass': pass}), { headers : headers })
                            .map( response => response.json());
    }

}
