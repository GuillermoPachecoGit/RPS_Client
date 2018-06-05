import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers } from '@angular/http';
import { SharedDatasetService } from './shared-dataset.service';


@Injectable()
export class ProjectService {
  constructor(private http: Http, private shared: SharedDatasetService) { }

  private url_request = 'http://'+this.shared.getServerIP()+'/db_request_project/get_projects';
  private url_request_description_project = 'http://'+this.shared.getServerIP()+'/db_request_dataset/getDescription';
  private url_update_project = 'http://'+this.shared.getServerIP()+'/db_request_dataset/update_project';

  updateProject(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url_update_project, JSON.stringify(data), { headers : headers })
                        .map( response => response.json());
  }

  getProjectsByData(id_user: string) {
    return this.http
    .get(this.generateRequest(this.url_request, id_user))
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

  private generateRequestAnalisys(url_request, dataset_id: string,project_id: string) : string {
    url_request += '?';
    // filter by id_user
    url_request += 'dataset_id=' + dataset_id;
    url_request += '&';
    url_request += 'project_id=' + project_id;
    return url_request;
 }

}
