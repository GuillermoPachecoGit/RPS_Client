import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SharedDatasetService } from './shared-dataset.service';

@Injectable()
export class DatasetService {
  constructor(private http: Http, private shared: SharedDatasetService) { }

  private url_request_dataset_pending = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_dataset_pending';
  private url_request_datasetById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_datasetById';
  private url_request_OnlyDatasetById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_only_datasets';
  private url_request_dataset = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_datasets';
  private url_request_analisysById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_analisys';
  private url_request_PDFById = 'http://'+this.shared.getServerIP()+'/db_request_dataset/get_analisys_PDF';
   
  getPendingDatasets(project_id: string) {
    console.log(this.generateRequest(this.url_request_dataset_pending,project_id));
    return this.http
    .get(this.generateRequest(this.url_request_dataset_pending,project_id))
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

  getDatasetsById(dataset_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_datasetById,dataset_id))
    .map((response) => response.json())
    .toPromise();
  }

  getAnalisysById(dataset_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_analisysById,dataset_id))
    .map((response) => response.json())
    .toPromise();
  }

  getPDFById(dataset_id: string) {
    return this.http
    .get(this.generateRequest(this.url_request_PDFById,dataset_id))
    .map((response) => response.json())
    .toPromise();
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

  private generateRequest(url_request,id_user: string) : string {
    url_request += '?';
    // filter by id_user
    url_request += 'id=' + id_user;
    return url_request;
  }

}
