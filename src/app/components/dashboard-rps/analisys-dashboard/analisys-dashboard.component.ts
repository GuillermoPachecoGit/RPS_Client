import { Component, OnInit } from '@angular/core';
import { Project } from '../navbar-dashboard/Project';
import { Dataset } from '../navbar-dashboard/dataset';
import { Distance } from '../navbar-dashboard/distance';
import { Analyze } from '../navbar-dashboard/analyze';
import { Ordination } from '../navbar-dashboard/ordination';
import { UploadFileService } from '../../../services/upload-file.service';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { ActivatedRoute, Params } from '@angular/router';
import { GetProjectsService } from '../../../services/get-projects.service';
import { AnalyzeService } from '../../../services/analyze.service';
import { Subscription } from 'rxjs';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-analisys-dashboard',
  templateUrl: './analisys-dashboard.component.html',
  styleUrls: ['./analisys-dashboard.component.css']
})
export class AnalisysDashboardComponent implements OnInit {
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
  landmarks_excluded = [];
  specimens_excluded = [];

  //Analysis
  analyze = new Analyze('','','',false,false,'', true,[],[]);
  distance = new Distance(false,'','','',true,'');
  ordination = new Ordination(false,'','','','',true,'');


  selected_dataset = "";
  selected_distance = "";

  node_id = "";
  subscription: Subscription;

  constructor(
    private uploadService: UploadFileService,
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute,
    private projectService: GetProjectsService,
    private analizeService: AnalyzeService) { 


    this.subscription = this.sharedDatasetService.getSelectedDataset().subscribe( params =>{
        this.selected_dataset = params.name;
        this.analyze.dataset_selected = params.dataset_id;
        this.analyze.project_selected = params.project_id;
        this.distance.dataset_id = params.dataset_id;
        this.distance.project_id = params.project_id;
        this.node_id = params.node;


        console.log(params.data);
        this.landmarks_excluded = [];
        this.specimens_excluded = [];
        this.generateSpecimensSelector(params.data);
        this.generateLandmarksSelector(params.data);  
    });


    this.subscription = this.sharedDatasetService.getSelectedDistance().subscribe( params => {
        this.selected_distance = params.name;
        this.ordination.dataset_id = params.dataset_id;
        this.ordination.distance_id = params.distance_id;
        this.ordination.project_id = params.project_id;
    });

    $(document).on('click', ':checkbox', function() {
        sharedDatasetService.setExclutionObject(this);
    });

    this.subscription = this.sharedDatasetService.getExclutionObject().subscribe(
        params => {
            
            if(params.checked){
                console.log('Tildo: '+ JSON.stringify(elem));
                var elem = $( params );
                if ( elem.attr( "isLandmark" )) {

                    var index  = this.landmarks_excluded.indexOf(elem.attr("value"));
                    
                    if (index > -1) {
                        console.log('Elimine el specimen: '+index);
                        this.landmarks_excluded.splice(index, 1);
                        console.log(this.landmarks_excluded);
                    }
                }
                if ( elem.attr( "isSpecimen" )) {
                    var index  = this.specimens_excluded.indexOf(elem.attr("value"));
                    console.log(index);
                    if (index > -1) {
                        console.log('Elimine el landmark: '+index);
                        this.specimens_excluded.splice(index, 1);
                        console.log(this.specimens_excluded);
                    }
                }
            }
            else{
                var elem = $( params );
                
                if ( elem.attr( "isLandmark" )) {
                    console.log('Agrego el elmento landmark: '+elem.attr("value"));
                    this.landmarks_excluded.push(elem.attr("value"));
                }
                if ( elem.attr( "isSpecimen" )) {
                    console.log('Agrego el elmento specimen: '+elem.attr("value"));
                    this.specimens_excluded.push(elem.attr("value"));
    
                }
            }
        }
    )
   
    }

    options = [];

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   }); 

   
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
    console.log("project: "+idProject);
    this.projectService.getDistaceByProjectId(idProject).then( (result) =>{
        this.distance_list = result;
    })
}

confirmAnalysis(){
    this.processing = true;
    this.analyze.user_id = this.idUser;
    this.sharedDatasetService.newAnalisys(this.analyze);
    this.analyze.excluided_landmark =  this.landmarks_excluded;
    this.analyze.excluided_specimen = this.specimens_excluded;
    this.analizeService.runAnalyze(this.analyze).subscribe(result => {
        this.analyze = new Analyze('','','',false,false,'',true,[],[]);
        this.datasetEnable = false;
        this.processing = false;
        this.landmarks_excluded = [];
        this.specimens_excluded = [];
        this.sharedDatasetService.finishedAnalisys(result);
    })
    document.getElementById('hideRunAnalysis').click();
    document.getElementById('buttonClose').click();
}

confirmDistance(){
    this.processing = true;
    console.log(this.distance);
    this.distance.user_id = this.idUser;
    this.sharedDatasetService.newAnalisys(this.distance);
    this.analizeService.runAnalyzeDistance(this.distance).subscribe(result => {
        this.distance = new Distance(false,'','','',true,this.idUser);
        this.datasetEnable = false;
        this.processing = false;
        //this.sharedDatasetService.setDistance(result);
        //llamar al shared pra compartir la info con los componentes result-dashboard y dataset-tree
        //document.getElementById('hideRunAnalysisDistance').click();
        this.sharedDatasetService.finishedAnalisys(result);
    })
    document.getElementById('hideRunAnalysisDistance').click();
    document.getElementById('buttonClose').click();
}


confirmOrdination(){
    this.processing = true;
    this.sharedDatasetService.newAnalisys(this.ordination);
    this.ordination.user_id = this.idUser;
    this.analizeService.runAnalyzeOrdination(this.ordination).subscribe(result => {
        this.ordination = new Ordination(false,'','','','',true,'');
        this.distanceEnable = false;
        this.processing = false;
        console.log(result);
        //llamar al shared pra compartir la info con los componentes result-dashboard y dataset-tree
        //this.sharedDatasetService.setOrdination(result);
        //document.getElementById('hideAnalysisOrdination').click();
        this.sharedDatasetService.finishedAnalisys(result)
    })
    document.getElementById('hideAnalysisOrdination').click();
    document.getElementById('buttonClose').click();
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

/**
 * Generate the landmarks selector to analize
 */
generateLandmarksSelector(params){
    var key = 0;
    $('#landmarks li').remove();
    this.landmarks_excluded = [];
    for (let index = 0; index < params.numbers_of_landmark; index++) {
        $('#landmarks').append('<li><a  class="small" data-value="'+index+'" tabIndex="-1"><input type="checkbox" value="'+index +'" isLandmark="true" checked />LM_'+index+'</a></li>');     
    }     
}

}
