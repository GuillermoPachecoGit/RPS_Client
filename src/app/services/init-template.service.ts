import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CountryRps } from '../components/main-rps/sign-up-main/country-rps';
import { SharedDatasetService } from './shared-dataset.service';

@Injectable()
export class InitTemplateService {

   url = 'http://'+this.shared.getServerIP()+':3000/db_request_country/get_countries';

   constructor(private http: Http, private shared: SharedDatasetService){ }

   getCountries(): Observable<CountryRps[]> {
      return this.http.get(this.url)
          .map( 
            response => response.json() as CountryRps[]
          );
   } 
}
