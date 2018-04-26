import { Injectable  } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserRps } from '../components/main-rps/sign-up-main/user-rps';
import { SharedDatasetService } from './shared-dataset.service';



@Injectable()
export class UserService {

    constructor(private http: Http, private shared: SharedDatasetService) { }


    url_save = 'http://'+this.shared.getServerIP()+':3000/db_request_user_w/register_user';

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
    url_validate = 'http://'+this.shared.getServerIP()+':3000/db_request_user/validate_user';
    url_update = 'http://'+this.shared.getServerIP()+':3000/db_request_user/update_user';
    url_recovery = 'http://'+this.shared.getServerIP()+':3000/db_request_user/pass_recovery';

    validateUser(email: string, pass: string) {
        // console.log(user);
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.url_validate, JSON.stringify({'email': email, 'pass': pass}), { headers : headers })
                            .map( response => response.json());
    }

    updateUser(data) {
        // console.log(user);
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.url_update, JSON.stringify(data), { headers : headers })
                            .map( response => response.json());
    }

    passRecovery(data) {
        // console.log(user);
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.url_recovery, JSON.stringify(data), { headers : headers })
                            .map( response => response.json());
    }



}
