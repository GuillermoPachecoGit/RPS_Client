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
import { GetProjectsService } from '../../../services/get-projects.service';
import { AnalyzeService } from "../../../services/analyze.service";
import { UserService } from "../../../services/user.service";
import { Analyze } from './analyze';
import { Distance } from './distance';
import { Ordination } from './ordination';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {
  filesToUpload: File[];
  project_list = [];
  project = new Project('', '', '');
  dataset = new Dataset('', '',1);
  idUser = '';
  dataset_list = [];
  distance_list = [];
  datasetEnable = true;
  distanceEnable = false;
  processing = false;

  //Analysis
  analyze = new Analyze('','','',false,false);
  distance = new Distance(false,'','','');
  ordination = new Ordination(false,'','','','');

  constructor(
    private uploadService: UploadFileService,
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private projectService: GetProjectsService,
    private analizeService: AnalyzeService
  ) { }

  /*ngOnInit() {
    
    // subscribe to router event
    this.route.params.subscribe((params: Params) => {
        this.idUser = params['id'];
     });
  }*/
  


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   }); 
    this.initialize();
  }

  initialize(): void {
    this.getProject();
  }

  getProject(): void {
    this.projectService.getProjectsByData(this.idUser).then
      ( result => {
          this.project_list = result;
          this.sharedDatasetService.setProjects(result);
       });
  }

confirmProject() {
    this.invalid = this.invalidProject();

    if(!this.invalid){
        this.uploadService.makeProjectRequest({ name_project:  this.project.name, description: this.project.description, id_user: this.idUser }).subscribe(data => {
            if (data.error == 'ok') {
                this.project_list.push(data.result);
                this.project = new Project('','','');
                this.filesToUpload = [];
                this.invalid = false;
                this.sharedDatasetService.setNameProject(data.result);
                document.getElementById('hideAddProject').click();
            }else {
                alert('Please, retry the operation again.');
            }
        }, (error) => {
            console.log(error);
        });
    }
}


selectedProject(e){
    this.datasetEnable = false;
    this.loadDataset(this.analyze.project_selected);
}


loadDataset(idProject){
    this.projectService.getDatasetsByProject(idProject).then( (result) =>{
        this.dataset_list = result;
    })
}

  

fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
}



upload() {
    
    this.invalid = this.invalidDataset();
    if(!this.invalid){
        this.processing = true;
        this.invalid = false;
        this.uploadService.makeFileRequest([], this.dataset, this.filesToUpload).then((result) => {
            
            if(result['error'] == undefined){
                this.dataset = new Dataset('','',1);
                console.log(result);
                this.sharedDatasetService.sendMessage(result);
                this.processing = false;
                this.invalid = false;
                document.getElementById('hideAddDataset').click();
            }
            else{
                this.error_msg = 'Please, add a new dataset file.';
                this.invalid = true;
                this.processing = false;
            }
        }, (error) => {
            this.processing = false;
            this.error_msg = 'Please, add a new dataset file.';;
            this.invalid = true;
        });
    }
}

error_msg = '';
invalid = false;
invalidProject(){
    
    if(this.project.name.length == 0){
        this.error_msg = 'Project name is empty.'
        return true;
    }
    if(this.project.description.length == 0){
        this.error_msg = 'Project description is empty.'
        return true;
    }
    return false;
}

invalidDataset(){
    if(this.dataset.project_for_data === ''){
        this.error_msg = 'Please, select a project.'
        return true;
    }

    if(this.dataset.dataset_name.length == 0){
        this.error_msg = 'Dataset name is empty.'
        return true;
    }
    
    

    return false;
}

}
