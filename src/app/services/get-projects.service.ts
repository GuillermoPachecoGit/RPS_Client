import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';


@Injectable()
export class GetProjectsService {

  constructor(private http : Http) { }

  private url_request = 'http://localhost:3000/validate/get_projects';

  getProjectsByData(id_user : string){
      this.generateRequest(id_user);
      return this.http
      .get(this.url_request)
      .map((response) => response.json())
      .toPromise();
  }

  private generateRequest(id_user : string) {
     this.url_request += '?'
     //filter by id_user
     this.url_request += 'id_user=${id_user}'
  }


}
