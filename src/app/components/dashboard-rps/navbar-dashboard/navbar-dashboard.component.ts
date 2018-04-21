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
import {User} from './user';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {


  subscription: Subscription;
  filesToUpload: File[];
  project_list = [];
  project = new Project('', '', '');
  dataset = new Dataset('', '',1);
  user = new User('','','','','','','','');
  idUser = '';
  dataset_list = [];
  distance_list = [];
  datasetEnable = true;
  distanceEnable = false;
  processing = false;
  new_notification = 0;
  new_in_progress = 0;

  //Analysis
  analyze = new Analyze('','','',false,false,'',true);
  distance = new Distance(false,'','','', true,'');
  ordination = new Ordination(false,'','','','', true,'');

  constructor(
    private uploadService: UploadFileService,
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private projectService: GetProjectsService,
    private analizeService: AnalyzeService,
    private userService: UserService,
    private datasetService: GetProjectsService
  ) { 

    $(document).ready(function() {
        $('#notifications').on('click', '.view', function() { 
            var tabID = $(this).parents('li').attr('id');
            var IsDataset = $(this).parents('li').attr('isDataset');
            var IsDistance = $(this).parents('li').attr('isDistance');
            var IsOrdination = $(this).parents('li').attr('isOrdination');
            console.log(tabID+'  '+IsDataset);
            if(IsDataset){
                datasetService.getDatasetsById(tabID).then((result) =>{
                    sharedDatasetService.sendMessage(result);
                  });
            }
            if(IsDistance){
                datasetService.getDistanceById(tabID).then((result) =>{
                    sharedDatasetService.setDistance(result);
                  });
            }

            if(IsOrdination){
                console.log('entre por aca por la proyeccion  '+ tabID);
                datasetService.getOrdinationById(tabID).then((result) =>{
                    console.log(result);
                    sharedDatasetService.setOrdination(result);
                  });
            }

            $('#'+tabID).remove();
            sharedDatasetService.setNotificationCount(1);
        });
    });

    this.subscription = this.sharedDatasetService.getNotificationCount().subscribe(
        params => {
            this.new_notification--;
        }
    )

    this.subscription = this.sharedDatasetService.isFinishedAnalisys().subscribe(
         params => {
        if(params.dataset_name){
            this.addNotificationDataset(params);
        }
        if(params.distance_name){
            this.addNotificationDistance(params);
        }
        if(params.ordination_name){
            this.addNotificationOrdination(params);
        }
    });

    this.subscription = this.sharedDatasetService.isNewAnalisys().subscribe(
        params => {

       console.log(params);
       if(params.isAnalyze){
           this.addInProcessDataset(params);
       }
       if(params.isDistance){
           this.addInProcessDistance(params);
       }
       if(params.isOrdination){
           this.addInProcessOrdination(params);
       }
   });

  }

  addNotificationDataset(params) {
    this.new_notification++;
    this.new_in_progress--;
    $('#'+params.name).remove();
    $('#notifications').append('<li id="'+params.dataset_id +'"  isDataset="true"  ><a> New Analisys: '+params.dataset_name+'   <span > <button class="btn btn-info btn-xs view "   (click)="viewDataset()"> View </button> </span>  </a> </li>'); 
  }
  addNotificationOrdination(params) {
    this.new_notification++;
    $('#'+params.name).remove();
    this.new_in_progress--;
    $('#notifications').append('<li id="'+params.ordination_id +'" isOrdination="true" ><a> New Ordination: '+params.ordination_name+'  <span><button class="btn btn-info btn-xs view" (click)="viewDataset()"> View </button> </span>  </a> </li>'); 
  }
  addNotificationDistance(params) {
    this.new_in_progress--;
    $('#'+params.name).remove();
    this.new_notification++;
    $('#notifications').append('<li id="'+params.distance_id +'" isDistance="true" ><a> New Distance: '+params.distance_name+'  <span> <button class="btn btn-info btn-xs view" (click)="viewDataset()"> View </button>  </a> </span> </li>'); 
  }
  

  addInProcessDataset(params) {
    this.new_in_progress++;
    $('#in_progress').append('<li id="'+params.dataset_name +'"  isDataset="true"  ><a>Analisys in progress : '+params.dataset_name+'    </a> </li>'); 
  }
  addInProcessDistance(params) {
    this.new_in_progress++;
    $('#in_progress').append('<li id="'+params.distance_name +'" isOrdination="true" ><a>Ordination in progress : '+params.distance_name+'  </a> </li>'); 
  }
  addInProcessOrdination(params) {
    this.new_in_progress++;
    $('#in_progress').append('<li id="'+params.ordination_name +'" isDistance="true" ><a>Distance in progress : '+params.ordination_name+'  </a> </li>'); 
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
      this.user.id = this.idUser;
   }); 
    this.initialize();
  }

  initialize(): void {
    this.getProject();
    this.getUser();
  }

  getProject(): void {
    this.projectService.getProjectsByData(this.idUser).then
      ( result => {
          this.project_list = result;
          this.sharedDatasetService.setProjects(result);
       });
  }

  getUser(){
      this.projectService.getUserById(this.idUser).then(
          params => {
              console.log(params);
              this.user.name = params.first_name;
              this.user.old_pass = params.password;
              this.user.institution = params.institution;
              this.user.area = params.area;
              this.user.email = params.email_address;
          }
      )
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

error_update_msg = '';

confirmUserUpdate(){

    console.log("llegue a actualizar el user");
    if(this.user.new_pass != '' && this.user.confirm_pass != ''){
        if(this.user.new_pass != this.user.confirm_pass){
            alert("Invalid password");
        }
    }else{
        this.user.new_pass = this.user.old_pass;
    }
    console.log("llegue a actualizar el user");
    this.userService.updateUser(this.user).subscribe(params => {
        if(params.result != 'error'){
            document.getElementById('hideUpdateProfile').click();
        }
        else{
            this.error_update_msg = params.result;
        }
    })
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
                this.sharedDatasetService.sendMessage(result);
                this.processing = false;
                this.invalid = false;
                document.getElementById('hideAddDataset').click();
            }
            else{
                this.error_msg = result['error'];
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
