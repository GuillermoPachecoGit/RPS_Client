//# sourceMappingURL=profile-navbar.component.js.map
import { Component } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { UploadFileService } from '../../services/upload-file.service';
import { Project } from "./Project";
import { UserLogin } from "../login/user-login";

import 'rxjs/add/operator/map';
import { ValidateService } from "../../services/validate-service.service";

@Component({
  selector: 'my-profile',
  templateUrl:'./profile-navbar.component.html',
  styleUrls: [ './profile-navbar.component.css' ],
  providers: [UploadFileService,ValidateService]
}) 
export class ProfileNavbar {      
        filesToUpload: Array<File>;
        project = new Project('','');
        /**
         * MODOS DE USO: 
         * -con autenticacion
         * -libre
         */
        logged_in = false;
        logged_out = true;

        user =  new UserLogin('',''); 
        error = '';
        id_user = '';
        invalid = false;
        hideModal: boolean = false;
        
    constructor(private uploadService : UploadFileService, private validate: ValidateService) {
        this.filesToUpload = [];
    }

    upload() {
        this.uploadService.makeFileRequest([], this.filesToUpload).then((result) => {
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
                      document.getElementById("hideLogin").click();
                      console.log('SUCCESS');

                    }
                });
    }
}