import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers } from '@angular/http';
import { SharedDatasetService } from './shared-dataset.service';


@Injectable()
export class GetProjectsService {

  
  constructor(private http: Http, private shared: SharedDatasetService) { }

  private url_request = 'http://'+this.shared.getServerIP()+':3000/db_request_project/get_projects';

  getProjectsByData(id_user: string) {
      return this.http
      .get(this.generateRequest(this.url_request, id_user))
      .map((response) => response.json())
      .toPromise();
  }

  private url_request_dataset = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_datasets';
  private url_request_distances = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_distances';
  private url_request_datasetById = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_datasetById';
  private url_request_distanceById = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_distanceById';
  private url_request_analisysById = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_analisys';
  private url_request_OnlyDatasetById = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_only_datasets';
  private url_request_OrdinationById = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_ordinationById';
  private url_request_DistanceByProject = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_distances_by_project';
  private url_request_ordinations = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_ordinations';
  private url_request_userById = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_user_by_id';
  
  private url_update_project = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/update_project';


//load pending

private url_request_dataset_pending = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_dataset_pending';
private url_request_distance_pending = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_distance_pending';
private url_request_ordination_pending = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/get_ordination_pending';


private url_request_description_project = 'http://'+this.shared.getServerIP()+':3000/db_request_dataset/getDescription';


getPendingDatasets(project_id: string) {
  console.log(this.generateRequest(this.url_request_dataset_pending,project_id));
  return this.http
  .get(this.generateRequest(this.url_request_dataset_pending,project_id))
  .map((response) => response.json())
  .toPromise();
}

getPendingDistances(project_id: string) {
  return this.http
  .get(this.generateRequest(this.url_request_distance_pending,project_id))
  .map((response) => response.json())
  .toPromise();
}

getPendingOrdinations(project_id: string) {
  return this.http
  .get(this.generateRequest(this.url_request_ordination_pending,project_id))
  .map((response) => response.json())
  .toPromise();
}

  getDistaceByProjectId(project_id){
    return this.http
    .get(this.generateRequest(this.url_request_DistanceByProject,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDatasetsByProject(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_dataset,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getOnlyDatasetsByProject(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_OnlyDatasetById,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  getDistaceByDatasets(dataset_id: string ,project_id: string) {
    return this.http
    .get(this.generateRequestAnalisys(this.url_request_distances,dataset_id,project_id))
    .map((response) => response.json())
    .toPromise();
  }


  getDatasetsById(dataset_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_datasetById,dataset_id))
    .map((response) => response.json())
    .toPromise();
  }

  getAnalisysById(dataset_id: string,project_id: string) {
    return this.http
    .get(this.generateRequestAnalisys(this.url_request_analisysById,dataset_id,project_id))
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

  getDistanceById(distance_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_distanceById,distance_id))
    .map((response) => response.json())
    .toPromise();
  }

  getUserById(user_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_userById,user_id))
    .map((response) => response.json())
    .toPromise();
  }

  getProjectDescription(project_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_description_project,project_id))
    .map((response) => response.json())
    .toPromise();
  }

  private generateRequest(url_request,id_user: string) : string {
     url_request += '?';
     // filter by id_user
     url_request += 'id=' + id_user;
     return url_request;
  }


  updateProject(data) {
    // console.log(user);
    // tslint:disable-next-line:prefer-const
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url_update_project, JSON.stringify(data), { headers : headers })
                        .map( response => response.json());
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

}
