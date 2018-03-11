import { Injectable  } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Dataset } from '../components/dashboard-rps/navbar-dashboard/dataset';

@Injectable()
export class UploadFileService {

    constructor(private http: Http) { }

    url = 'http://localhost:3000/uploadFile';
    url_project = 'http://localhost:3000/db_request_project_w/addProject';

    makeFileRequest(params: Array<string>, data: Dataset, files: Array<File>) {
        return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            formData.append('dataset_name', data.dataset_name);
            formData.append('project_id', data.project_for_data);
            formData.append('type_file', data.type_file);
            const xhr = new XMLHttpRequest();
            for (let i = 0; i < files.length; i++) {
                formData.append('uploads[]', files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', this.url, true);
            xhr.send(formData);
        });
    }
    makeProjectRequest(project: any) {
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(project));
        return this.http.post(this.url_project, JSON.stringify(project), { headers : headers })
                            .map( response => response.json());
    }
}

