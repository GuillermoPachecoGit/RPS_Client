import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


import { Analyze } from '../components/dashboard-rps/navbar-dashboard/analyze';
import { Distance } from '../components/dashboard-rps/navbar-dashboard/distance';
import { Ordination } from '../components/dashboard-rps/navbar-dashboard/ordination';
import { SharedDatasetService } from './shared-dataset.service';

@Injectable()
export class AnalyzeService {

  constructor(private http: Http, private shared: SharedDatasetService) { }
    


    url_save = 'http://'+this.shared.getServerIP()+':3000/db_request_analisys_w/runAnalize';
    url_save_distance = 'http://'+this.shared.getServerIP()+':3000/db_request_distance_w/runDistance';
    url_save_ordination = 'http://'+this.shared.getServerIP()+':3000/db_request_ordination_w/runOrdination';

    runAnalyze(data: Analyze) {
       let headers = new Headers();
       headers.append('Content-Type', 'application/json');
       console.log(JSON.stringify(data));
       return this.http.post(this.url_save, JSON.stringify(data), { headers : headers })
                           .map( response => response.json());
   }

   runAnalyzeDistance(data: Distance) {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     console.log(JSON.stringify(data));
     return this.http.post(this.url_save_distance, JSON.stringify(data), { headers : headers })
                         .map( response => response.json());
 }

 runAnalyzeOrdination(data: Ordination) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  console.log(JSON.stringify(data));
  return this.http.post(this.url_save_ordination, JSON.stringify(data), { headers : headers })
                      .map( response => response.json());
}


}