import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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

  constructor(private uploadService: UploadFileService, private sharedDatasetService: SharedDatasetService) { }

  ngOnInit() {
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
    this.uploadService.makeProjectRequest(this.project.name, this.project.description, '', [], this.filesToUpload).then((result) => {
        document.getElementById('hideAddProject').click();
    }, (error) => {
        console.log(error);
    });
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
}

}
