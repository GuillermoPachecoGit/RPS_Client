import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';


@Injectable()
export class GetProjectsService {

  constructor(private http: Http) { }

  private url_request = 'http://localhost:3000/db_request_project/get_projects';

  getProjectsByData(id_user: string) {
      return this.http
      .get(this.generateRequest(this.url_request, id_user))
      .map((response) => response.json())
      .toPromise();
  }

  private url_request_dataset = 'http://localhost:3000/db_request_dataset/get_datasets';
  private url_request_distances = 'http://localhost:3000/db_request_dataset/get_distances';
  private url_request_datasetById = 'http://localhost:3000/db_request_dataset/get_datasetById';
  private url_request_distanceById = 'http://localhost:3000/db_request_dataset/get_distanceById';

  
  getDatasetsByProject(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_dataset,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDistaceByProject(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_distances,project_id))
    .map((response) => response.json())
    .toPromise();
  }


  getDatasetsById(dataset_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_datasetById,dataset_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDistanceById(distance_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_distanceById,distance_id))
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
