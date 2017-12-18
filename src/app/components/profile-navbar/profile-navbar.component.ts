//# sourceMappingURL=profile-navbar.component.js.map
/**
 * Native
 */
import { Component } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * Services 
 */
import { UploadFileService } from '../../services/upload-file.service';
import {GetProjectsService } from '../../services/get-projects.service';
import { ValidateService } from "../../services/validate-service.service";

/**
 * Data Components 
 */
import { Project } from "./Project";
import { UserLogin } from "../login/user-login";
import { Dataset } from "./dataset";


@Component({
  selector: 'my-profile',
  templateUrl:'./profile-navbar.component.html',
  styleUrls: [ './profile-navbar.component.css' ],
  providers: [UploadFileService, ValidateService, GetProjectsService]
}) 


export class ProfileNavbar {      
        /**
         * use mode: 
         * -con autenticacion
         * -libre
         */
        logged_in = false;
        logged_out = true;

        /**
         * Attributes of administration
         */
        error = '';
        id_user = '';
        invalid = false;
        hideModal: boolean = false;

        /**
         * Attributes of data layer
         */
        user =  new UserLogin('','');
        project = new Project('','','');
        dataset = new Dataset('default','default');

        filesToUpload: Array<File>;
        project_list = new Array();

    constructor(private uploadService : UploadFileService, private validate: ValidateService, private projectsRequest : GetProjectsService) {
        this.filesToUpload = [];
    }

    upload() {
        this.uploadService.makeFileRequest([],this.filesToUpload).then((result) => {
            console.log(result);
            document.getElementById("hideAddDataset").click();
        }, (error) => {
            console.log(error);
        });
    }
 
    confirmProject() {
        this.uploadService.makeProjectRequest(this.project.name,this.project.description,"",[], this.filesToUpload).then((result) => {
            console.log(result);
            document.getElementById("hideAddProject").click();
        }, (error) => {
            console.log(error);
        });
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }

    onSubmit() { 
		this.validate.validateUser(this.user)
                .subscribe(data => {
                    console.log('Success ' + data)
                    if(data.error != 'success'){
                        console.log(data.error);
                        this.error = data.error;
                       
                    }else{
                      this.id_user = data.id_user;
                      console.log(this.id_user);
                      this.logged_out = false;
                      this.logged_in = true;
                      this.invalid = true;
                      this.loadProjects(this.id_user);
                      document.getElementById("hideLogin").click();
                      console.log('SUCCESS');

                    }
                });
    }

    ngOnInit(): void {
   }

   /******Init profile******/
   loadProjects(id_user : string){
        this.projectsRequest.getProjectsByData(id_user)
        .then((result) => {
            console.log(result);
            result.forEach(row => {
                this.project_list.push(new Project(row.project_id,row.description,row.project_name));
            });
        })
        .catch((error) => console.error(error));
    }

   loadDatasets(id_project : string) : void{

   }

}