import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


import { Analyze } from '../components/dashboard-rps/navbar-dashboard/analyze';

@Injectable()
export class AnalyzeService {

  constructor(private http: Http) { }

    url_save = 'http://localhost:3000/db_request_user_w/runAnalize';

    runAnalyze(data: Analyze) {
      // console.log(user);
       // tslint:disable-next-line:prefer-const
       let headers = new Headers();
       headers.append('Content-Type', 'application/json');
       console.log(JSON.stringify(data));
       return this.http.post(this.url_save, JSON.stringify(data), { headers : headers })
                           .map( response => response.json());
   }


}