import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RemoveService {

  constructor(private http: Http) { }

  url_remove_dataset = 'http://localhost:3000/db_request_remove_w/removeDataset';
  url_remove_distance = 'http://localhost:3000/db_request_remove_w/removeDistance';
  url_remove_ordination = 'http://localhost:3000/db_request_remove_w/removeOrdination';
  url_remove_project = 'http://localhost:3000/db_request_remove_w/removeProject';


  removeDataset(dataset_id: string) {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     console.log(dataset_id);
     return this.http.post(this.url_remove_dataset, JSON.stringify({dataset_id: dataset_id}), { headers : headers })
                         .map( response => response.json());
 }

 removeDistance(distance_id) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  console.log(distance_id);
  return this.http.post(this.url_remove_distance, JSON.stringify({distance_id: distance_id}), { headers : headers })
                      .map( response => response.json());
}

removeOrdination(ordination_id) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  console.log(ordination_id);
  return this.http.post(this.url_remove_ordination, JSON.stringify({ordination_id: ordination_id}), { headers : headers })
                      .map( response => response.json());
}

removeProject(project_id) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  console.log(project_id);
  return this.http.post(this.url_remove_project, JSON.stringify({project_id: project_id}), { headers : headers })
                      .map( response => response.json());
}

}
