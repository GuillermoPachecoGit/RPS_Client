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
import { AnalyzeService  } from "../../../services/analyze.service";
import {  UserService } from "../../../services/user.service";
import { Analyze } from './analyze';
import { Distance } from './distance';
import { Ordination } from './ordination';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  styleUrls: ['./navbar-dashboard.component.css']
})
export class NavbarDashboardComponent implements OnInit {
  filesToUpload: Array<File>;
  project_list = [];
  project = new Project('', '', '');
  dataset = new Dataset('', '');
  idUser = '';
  dataset_list = [];
  distance_list = [];
  datasetEnable = true;
  distanceEnable = false;

  //Analysis
  analyze = new Analyze('','','',false,false);
  distance = new Distance(false,'','','');
  ordination = new Ordination(false,'','','');

  constructor(
    private uploadService: UploadFileService,
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private projectService: GetProjectsService,
    private analizeService: AnalyzeService
  ) { }

  ngOnInit() {
    // subscribe to router event
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
    this.uploadService.makeProjectRequest({ name_project:  this.project.name, description: this.project.description, id_user: this.idUser }).subscribe(data => {
        if (data.error == 'ok') {
            this.project_list.push(data.result);
            this.project = new Project('','','');
            this.filesToUpload = [];
            this.sharedDatasetService.setNameProject(data.result);
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


selectedProject(e){
    this.datasetEnable = false;
    this.loadDataset(this.analyze.project_selected);
}

selectedProjectDistance(e){
    this.datasetEnable = false;
    this.loadDataset(this.distance.project_id);
}

loadDataset(idProject){
    this.projectService.getDatasetsByProject(idProject).then( (result) =>{
        this.dataset_list = result;
    })
}

selectedProjectOrdination(e){
    this.distanceEnable = false;
    this.loadDistance(this.ordination.project_id);
}

loadDistance(idProject){
    this.projectService.getDistaceByProject(idProject).then( (result) =>{
        this.distance_list = result;
    })
}

confirmAnalysis(){
    this.analizeService.runAnalyze(this.analyze).subscribe(result => {
        this.analyze = new Analyze('','','',false,false);
        this.datasetEnable = false;
        this.sharedDatasetService.sendMessage(result);  
        document.getElementById('hideRunAnalysis').click();
    })
}

confirmDistance(){
    this.analizeService.runAnalyzeDistance(this.distance).subscribe(result => {
        this.distance = new Distance(false,'','','');
        this.datasetEnable = false;
        console.log(result);
        this.sharedDatasetService.setDistance(result);
        //llamar al shared pra compartir la info con los componentes result-dashboard y dataset-tree
        document.getElementById('hideRunAnalysisDistance').click();
    })
}


confirmOrdination(){
    this.analizeService.runAnalyzeOrdination(this.ordination).subscribe(result => {
        this.ordination = new Ordination(false,'','','');
        this.distanceEnable = false;
        console.log(result);
        //llamar al shared pra compartir la info con los componentes result-dashboard y dataset-tree
        this.sharedDatasetService.setOrdination(result);
        document.getElementById('hideAnalysisOrdination').click();
    })
}

upload() {
    this.uploadService.makeFileRequest([], this.dataset, this.filesToUpload).then((result) => {
        this.dataset = new Dataset('','');
        this.sharedDatasetService.sendMessage(result);
        document.getElementById('hideAddDataset').click();
    }, (error) => {
        console.log(error);
    });
}

}
