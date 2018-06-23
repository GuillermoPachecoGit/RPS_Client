import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SharedDatasetService } from './shared-dataset.service';

@Injectable()
export class DistanceService {
  constructor(private http: Http, private shared: SharedDatasetService) { }

  private url_request_distances = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_distances';
  private url_request_distanceById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_distanceById';
  private url_request_DistanceByProject = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_distances_by_project';
  private url_request_distance_pending = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_distance_pending';
  private url_request_PDFById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_distance_PDF';
  
  getPendingDistances(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_distance_pending,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDistaceByProjectId(project_id){
    return this.http
    .get(this.generateRequest(this.url_request_DistanceByProject,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDistaceByDatasets(dataset_id: string ,project_id: string) {
    return this.http
    .get(this.generateRequestAnalisys(this.url_request_distances,dataset_id,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDistanceById(distance_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_distanceById,distance_id))
    .map((response) => response.json())
    .toPromise();
  }

  getPDFById(distance_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_PDFById,distance_id))
    .map((response) => response.json())
    .toPromise();
  }

  private generateRequest(url_request,id_user: string) : string {
    url_request += '?';
    // filter by id_user
    url_request += 'id=' + id_user;
    return url_request;
  }

  private generateRequestAnalisys(url_request, dataset_id: string,project_id: string) : string {
    url_request += '?';
    // filter by id_user
    url_request += 'dataset_id=' + dataset_id;
    url_request += '&';
    url_request += 'project_id=' + project_id;
    console.log(url_request);
    return url_request;
 }
}
