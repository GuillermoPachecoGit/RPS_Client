import { Component, OnInit } from '@angular/core';
import { Analyze } from '../navbar-dashboard/analyze';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { UploadFileService } from '../../../services/upload-file.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../../services/get-projects.service';
import { AnalyzeService } from '../../../services/analyze.service';
import { Subscription } from 'rxjs';
import { DatasetService } from '../../../services/dataset.service';


// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-procrustes-analysis',
  templateUrl: './procrustes-analysis.component.html',
  styleUrls: ['./procrustes-analysis.component.css']
})
export class ProcrustesAnalysisComponent implements OnInit {
  project_list = [];
  
  idUser = '';
  dataset_list = [];
  datasetEnable = true;
  processing = false;
  landmarks_excluded = [];
  specimens_excluded = [];

  analyze = new Analyze('','','',false,false,'', true,[],[],'','');
  selected_dataset = "";
  subscription: Subscription;
  node_id = "";
  constructor(
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private analizeService: AnalyzeService,
    private datasetService: DatasetService
  ) { 

      
    this.subscription = this.sharedDatasetService.getSelectedDataset().subscribe( params =>{
      this.selected_dataset = params.name;
      this.analyze.dataset_selected = params.dataset_id;
      this.analyze.project_selected = params.project_id;
      this.node_id = params.node;
      this.landmarks_excluded = [];
      this.specimens_excluded = [];
      this.generateSpecimensSelector(params.data);
      this.generateLandmarksSelector(params.data);  
     });

    }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   }); 
  }

  
confirmAnalysis(){
  this.processing = true;
  this.analyze.user_id = this.idUser;
  this.sharedDatasetService.newAnalisys(this.analyze);
  this.analyze.excluided_landmark =  this.landmarks_excluded;
  this.analyze.excluided_specimen = this.specimens_excluded;
  this.analizeService.runAnalyze(this.analyze).subscribe(result => {
      this.analyze = new Analyze('','','',false,false,'',true,[],[],'','');
      this.datasetEnable = false;
      this.processing = false;
      this.landmarks_excluded = [];
      this.specimens_excluded = [];
      this.sharedDatasetService.finishedAnalisys(result);
  })
  document.getElementById('hideRunAnalysis').click();
  document.getElementById('buttonClose').click();
}


getProject(): void {
  this.projectService.getProjectsByData(this.idUser).then
    ( result => {
        this.project_list = result;
        this.sharedDatasetService.setProjects(result);
     });
}

selectedProject(e){
  this.datasetEnable = false;
  this.loadDataset(this.analyze.project_selected);
}

loadDataset(idProject){
  this.datasetService.getDatasetsByProject(idProject).then( (result) =>{
      this.dataset_list = result;
  })
}

/**
 * Generate the speciments selector to analize
 */
generateSpecimensSelector(params){
  var key = 0;
  $('#specimens li').remove();
  this.specimens_excluded = [];
  params.specimen_name.forEach(element => {
      $('#specimens').append('<li><a  class="small" data-value="'+key+'" tabIndex="-1"><input type="checkbox" value="'+key +'" isSpecimen="true"  checked />'+element+'</a></li>');    
      key++;
  });
}

visibleParamsResistent = false;

handleChangeCM(evt) {
      this.visibleParamsResistent = false;
}

handleChange(evt) {
      this.visibleParamsResistent = true;
}

/**
* Generate the landmarks selector to analize
*/
generateLandmarksSelector(params){
  var key = 0;
  $('#landmarks li').remove();
  this.landmarks_excluded = [];
  for (let index = 0; index < params.specimens.root_number_landmarks; index++) {  
      if(!params.specimens.excluded_land.includes(index.toString())){
          $('#landmarks').append('<li><a  class="small" data-value="'+index+'" tabIndex="-1"><input type="checkbox" value="'+index +'" isLandmark="true" checked />LM_'+(index+1)+'</a></li>');     
      }
  }
}


}
