import { Injectable  } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserRps } from '../components/main-rps/sign-up-main/user-rps';
import { SharedDatasetService } from './shared-dataset.service';



@Injectable()
export class UserService {

    constructor(private http: Http, private shared: SharedDatasetService) { }


    url_save = 'http://'+this.shared.getServerIP()+'/db_request_user_w/register_user';
    url_validate = 'http://'+this.shared.getServerIP()+'/db_request_user/validate_user';
    url_update = 'http://'+this.shared.getServerIP()+'/db_request_user/update_user';
    url_recovery = 'http://'+this.shared.getServerIP()+'/db_request_user/pass_recovery';
    private url_request_userById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_user_by_id';

    registerUser(user: UserRps) {
       // console.log(user);
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(user));
        return this.http.post(this.url_save, JSON.stringify(user), { headers : headers })
                            .map( response => response.json());
    }

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

    getUserById(user_id: string) {
        return this.http
        .get(this.generateRequest(this.url_request_userById,user_id))
        .map((response) => response.json())
        .toPromise();
      }

      private generateRequest(url_request,id_user: string) : string {
        url_request += '?';
        // filter by id_user
        url_request += 'id=' + id_user;
        return url_request;
     }


}
