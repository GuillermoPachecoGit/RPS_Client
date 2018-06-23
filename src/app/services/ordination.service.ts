import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SharedDatasetService } from './shared-dataset.service';

@Injectable()
export class OrdinationService {
  constructor(private http: Http, private shared: SharedDatasetService) { }

  private url_request_OrdinationById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_ordinationById';
  private url_request_ordinations = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_ordinations';
  private url_request_ordination_pending = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_ordination_pending';
  private url_request_PDFById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_ordination_PDF';


  getPendingOrdinations(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_ordination_pending,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getOrdinationsById(dataset_id: string,project_id: string, distance_id: string) {
    return this.http
    .get(this.generateRequestOrdination(this.url_request_ordinations,dataset_id,project_id,distance_id))
    .map((response) => response.json())
    .toPromise();
  }

  getOrdinationById(ordination_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_OrdinationById,ordination_id))
    .map((response) => response.json())
    .toPromise();
  }

  getPDFById(ordination_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_PDFById,ordination_id))
    .map((response) => response.json())
    .toPromise();
  }

  private generateRequestOrdination(url_request,dataset_id,project_id,distance_id){
    url_request += '?';
    // filter by id_user
    url_request += 'dataset_id=' + dataset_id;
    url_request += '&';
    url_request += 'project_id=' + project_id;
    url_request += '&';
    url_request += 'distance_id=' + distance_id;
    console.log(url_request);
    return url_request;
   }

  private generateRequest(url_request,id_user: string) : string {
    url_request += '?';
    // filter by id_user
    url_request += 'id=' + id_user;
    return url_request;
  }
  
}
