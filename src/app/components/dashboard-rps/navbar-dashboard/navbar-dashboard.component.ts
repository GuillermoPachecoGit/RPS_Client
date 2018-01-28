import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {ParamMap, ActivatedRoute, Params } from '@angular/router';

/**
 * Data Components
 */
import { Project } from './Project';
import { Dataset } from './dataset';


// Services
import { UploadFileService } from '../../../services/upload-file.service';
import { SharedDatasetService } from '../../../services/shared-dataset.service';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {
  filesToUpload: Array<File>;
  project_list = new Array();
  project = new Project('', '', '');
  dataset = new Dataset('default', 'default');
  idUser = '';

  constructor(private uploadService: UploadFileService, private sharedDatasetService: SharedDatasetService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // subscribe to router event
    this.route.params.subscribe((params: Params) => {
        this.idUser = params['id'];
       console.log(this.idUser);
     });
  }

  upload() {
    this.uploadService.makeFileRequest([], this.filesToUpload).then((result) => {
        this.sharedDatasetService.sendMessage(result);
        document.getElementById('hideAddDataset').click();
    }, (error) => {
        console.log(error);
    });
}

confirmProject() {
    // tslint:disable-next-line:max-line-length
    this.uploadService.makeProjectRequest({ name_project:  this.project.name, description: this.project.description, id_user: this.idUser }).subscribe(data => {
        if (data.result !== 'ok') {
            this.sharedDatasetService.setNameProject(this.project.name);
            document.getElementById('hideAddProject').click();
        }else {
            alert('Please, retry the operation again.');
        }

    }, (error) => {
        console.log(error);
    });
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
}

}
