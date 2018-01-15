import { Component, OnInit } from '@angular/core';

/**
 * Data Components
 */
import { Project } from './Project';
import { Dataset } from './dataset';


// Services
import { UploadFileService } from '../../../services/upload-file.service';

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

  constructor(private uploadService: UploadFileService) { }

  ngOnInit() {
  }


  upload() {
    this.uploadService.makeFileRequest([], this.filesToUpload).then((result) => {
        console.log(result);
        document.getElementById('hideAddDataset').click();
    }, (error) => {
        console.log(error);
    });
}

confirmProject() {
    this.uploadService.makeProjectRequest(this.project.name, this.project.description, '', [], this.filesToUpload).then((result) => {
        console.log(result);
        document.getElementById('hideAddProject').click();
    }, (error) => {
        console.log(error);
    });
}

fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
}

}
