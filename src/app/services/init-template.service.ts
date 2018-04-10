import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CountryRps } from '../components/main-rps/sign-up-main/country-rps';

@Injectable()
export class InitTemplateService {
  server = '10.1.6.31';
   url = 'http://'+this.server+':3000/db_request_country/get_countries';

   constructor(private http: Http){ }

   getCountries(): Observable<CountryRps[]> {
      return this.http.get(this.url)
          .map( 
            response => response.json() as CountryRps[]
          );
   } 
}
