//# sourceMappingURL=register.component.js.map
import { Component } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { UploadFileService } from '../../services/upload-file.service';
import { Project } from "./Project";
import { SharedDataSessionService } from "../../services/shared-data-session.service";

import 'rxjs/add/operator/map';

@Component({
  selector: 'my-profile',
  templateUrl:'./profile-navbar.component.html',
  styleUrls: [ './profile-navbar.component.css' ],
  providers: [SharedDataSessionService, UploadFileService]
}) 
export class ProfileNavbar {
    
        filesToUpload: Array<File>;
        project = new Project('','');
 
    constructor(private uploadService : UploadFileService, private sharedData : SharedDataSessionService) {
        this.filesToUpload = [];
    }
 
    upload() {
        this.uploadService.makeFileRequest([], this.filesToUpload).then((result) => {
            console.log(result);
        }, (error) => {
            console.log(error);
        });
    }
 
    confirmProject() {
        this.uploadService.makeProjectRequest(this.project.name,this.project.description,this.sharedData.getUserId(),[], this.filesToUpload).then((result) => {
            console.log(result);
        }, (error) => {
            console.log(error);
        });
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }
}