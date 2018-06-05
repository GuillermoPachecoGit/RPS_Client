import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../../../services/analyze.service';
import { ProjectService } from '../../../services/get-projects.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { UploadFileService } from '../../../services/upload-file.service';
import { Analyze } from '../navbar-dashboard/analyze';
import { Subscription } from 'rxjs';
import { Distance } from '../navbar-dashboard/distance';
import { DistanceService } from '../../../services/distance.service';
import { DatasetService } from '../../../services/dataset.service';

@Component({
  selector: 'app-distance-analysis',
  templateUrl: './distance-analysis.component.html',
  styleUrls: ['./distance-analysis.component.css']
})
export class DistanceAnalysisComponent implements OnInit {
  distance = new Distance(false,'','','',true,'');

  project_list = [];
  
  idUser = '';
  dataset_list = [];
  distance_list = [];
  datasetEnable = true;
  distanceEnable = false;
  processing = false;
  landmarks_excluded = [];
  specimens_excluded = [];
  selected_dataset = "";

  analyze = new Analyze('','','',false,false,'', true,[],[],'','');
 
  subscription: Subscription;
 
  node_id = "";

  constructor(
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private analizeService: AnalyzeService,
    private distanceService: DistanceService,
    private datasetService: DatasetService  
  ) { 

      
      this.subscription = this.sharedDatasetService.getSelectedDataset().subscribe( params =>{
        this.selected_dataset = params.name;
        this.analyze.dataset_selected = params.dataset_id;
        this.analyze.project_selected = params.project_id;
        this.distance.dataset_id = params.dataset_id;
        this.distance.project_id = params.project_id;
        this.node_id = params.node;
        this.landmarks_excluded = [];
        this.specimens_excluded = []; 
      });

    }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
  })
}

  confirmDistance(){
    this.processing = true;
    this.distance.user_id = this.idUser;
    this.sharedDatasetService.newAnalisys(this.distance);
    this.analizeService.runAnalyzeDistance(this.distance).subscribe(result => {
        this.distance = new Distance(false,'','','',true,this.idUser);
        this.datasetEnable = false;
        this.processing = false;
        this.sharedDatasetService.finishedAnalisys(result);
    })
    document.getElementById('hideRunAnalysisDistance').click();
    document.getElementById('buttonClose').click();
}

loadDistance(idProject){
  this.distanceService.getDistaceByProjectId(idProject).then( (result) =>{
      this.distance_list = result;
  })
}

selectedProjectDistance(e){
  this.datasetEnable = false;
  this.loadDataset(this.distance.project_id);
}

loadDataset(idProject){
  this.datasetService.getDatasetsByProject(idProject).then( (result) =>{
      this.dataset_list = result;
  })
}

}
