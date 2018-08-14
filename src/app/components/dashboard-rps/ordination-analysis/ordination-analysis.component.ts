import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ordination } from '../navbar-dashboard/ordination';
import { UploadFileService } from '../../../services/upload-file.service';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../../services/get-projects.service';
import { AnalyzeService } from '../../../services/analyze.service';
import { DatasetService } from '../../../services/dataset.service';
import { DistanceService } from '../../../services/distance.service';


declare var $: any;

@Component({
  selector: 'app-ordination-analysis',
  templateUrl: './ordination-analysis.component.html',
  styleUrls: ['./ordination-analysis.component.css']
})
export class OrdinationAnalysisComponent implements OnInit {
  filesToUpload: File[];
  project_list = [];
  
  idUser = '';
  dataset_list = [];
  distance_list = [];
  datasetEnable = true;
  distanceEnable = false;
  processing = false;


  ordination = new Ordination(false,'','','','',true,'','');
  subscription: Subscription;

  selected_dataset = "";
  selected_distance = "";

  node_id = "";
  constructor(
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private distanceService: DistanceService,
    private analizeService: AnalyzeService,
    private datasetService: DatasetService,
    private projectService: ProjectService
  ) {

      this.subscription = this.sharedDatasetService.getSelectedDistance().subscribe( params => {
        this.selected_distance = params.name;
        this.ordination.dataset_id = params.dataset_id;
        this.ordination.distance_id = params.distance_id;
        this.ordination.project_id = params.project_id;
        this.node_id = params.node;
    });


    $(window).on('hidden.bs.modal', function() { 
      $('#runOrdinations').modal('hide');
      sharedDatasetService.hiddenOrdination(" ");
    });
      
  this.subscription = this.sharedDatasetService.isHiddenOrdination().subscribe(
    params => { 
      this.ordination = new Ordination(false,'','','','',true,'','');
  });

     }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   }); 
  }

  
confirmOrdination(){
  this.processing = true;
  this.sharedDatasetService.newAnalisys(this.ordination);
  this.ordination.user_id = this.idUser;
  this.ordination.node_tree = this.node_id;
  this.analizeService.runAnalyzeOrdination(this.ordination).subscribe(result => {
    if(result.error){
      alert(result.error);
    }else{
      result = JSON.parse(result);
      result.node_tree = this.node_id.toString();
      this.sharedDatasetService.finishedAnalisys(JSON.stringify(result));
    }
    this.ordination = new Ordination(false,'','','','',true,'','');
    this.distanceEnable = false;
    this.processing = false;
  })
  document.getElementById('hideAnalysisOrdination').click();
  document.getElementById('buttonClose').click();
}

getProject(): void {
  this.projectService.getProjectsByData(this.idUser).then
    ( result => {
        this.project_list = result;
        this.sharedDatasetService.setProjects(result);
     });
}



loadDataset(idProject){
  this.datasetService.getDatasetsByProject(idProject).then( (result) =>{
      this.dataset_list = result;
  })
}

selectedProjectOrdination(e){
  this.distanceEnable = false;
  this.loadDistance(this.ordination.project_id);
}

loadDistance(idProject){
  this.distanceService.getDistaceByProjectId(idProject).then( (result) =>{
      this.distance_list = result;
  })
}

handleChangeCM(evt) {
  this.ordination.ordination_name = "lsUMDS_"+this.selected_distance; 
}

handleChange(evt) {
  this.ordination.ordination_name = "rUMDS_"+this.selected_distance; 
}

}
