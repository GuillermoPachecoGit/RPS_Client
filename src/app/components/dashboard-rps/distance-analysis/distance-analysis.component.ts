import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../../../services/analyze.service';
import { ProjectService } from '../../../services/get-projects.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { Analyze } from '../navbar-dashboard/analyze';
import { Subscription } from 'rxjs';
import { Distance } from '../navbar-dashboard/distance';
import { DistanceService } from '../../../services/distance.service';
import { DatasetService } from '../../../services/dataset.service';

declare var $: any;

@Component({
  selector: 'app-distance-analysis',
  templateUrl: './distance-analysis.component.html',
  styleUrls: ['./distance-analysis.component.css']
})
export class DistanceAnalysisComponent implements OnInit {
  distance = new Distance(false,'','','',true,'','');
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
  analyze = new Analyze('','','','',false,'', true,[],[],'','','');
  subscription: Subscription;
  node_id = "";

  constructor(
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
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


      $(window).on('hidden.bs.modal', function() { 
        $('#runDistances').modal('hide');
        sharedDatasetService.hiddenDistance(" ");
      });
        
    this.subscription = this.sharedDatasetService.isHiddenDistance().subscribe(params => { 
        this.distance = new Distance(false,'','','',true,'','');
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
    this.distance.node_tree = this.node_id;
    this.sharedDatasetService.newAnalisys(this.distance);
    this.analizeService.runAnalyzeDistance(this.distance).subscribe(result => {

        if(result.error){
          alert(result.error);
        }else{
          result = JSON.parse(result);
          result.node_tree = this.node_id.toString();
          this.sharedDatasetService.finishedAnalisys(JSON.stringify(result));
        }
        this.distance = new Distance(false,'','','',true,this.idUser,this.node_id);
        this.datasetEnable = false;
        this.processing = false;
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

handleChangeCM(evt) {
  this.distance.distance_name = "lsD_"+this.selected_dataset; 
}

handleChange(evt) {
  this.distance.distance_name = "rD_"+this.selected_dataset; 
}

}
