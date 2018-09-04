import { Component, OnInit } from '@angular/core';
import { Analyze } from '../navbar-dashboard/analyze';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../../services/get-projects.service';
import { AnalyzeService } from '../../../services/analyze.service';
import { Subscription } from 'rxjs';
import { DatasetService } from '../../../services/dataset.service';

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
  invalid = false;
  error_msg = "";
  countLandmarks = 0;
  countObject = 0;
  visibleParamsResistent = false;
  analyze = new Analyze('','','','',false,'', true,[],[],'20','0.000000001','');
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

     $(document).on('click', ':checkbox', function() {
        sharedDatasetService.setExclutionObject(this);
      });

    $(window).on('hidden.bs.modal', function() { 
      $('#runProcrustes').modal('hide');
      sharedDatasetService.hiddenProcrustes(" ");
    });
      
  this.subscription = this.sharedDatasetService.isHiddenProcrustes().subscribe(
    () => {
      this.analyze = new Analyze('', '', '', '', false, '', true, [], [], '20', '0.000000001', '');
      this.invalid = false;
    });


  this.subscription = this.sharedDatasetService.getExclutionObject().subscribe(params => {
      if(params.checked){
          var elem = $( params );
          if ( elem.attr( "isLandmark" )) {
              var index  = this.landmarks_excluded.indexOf(elem.attr("value"));
              if (index > -1) {
                  this.landmarks_excluded.splice(index, 1);
              }
          }
          if ( elem.attr( "isSpecimen" )) {
              var index  = this.specimens_excluded.indexOf(elem.attr("value"));
              console.log(index);
              if (index > -1) {
                  this.specimens_excluded.splice(index, 1);
              }
          }
      }
      else{
          var elem = $( params );
          
          if ( elem.attr( "isLandmark" )) {
            console.log('agregue landmark'+elem.attr("value"));
              this.landmarks_excluded.push(elem.attr("value"));
          }
          if ( elem.attr( "isSpecimen" )) {
            console.log('agregue specimen '+elem.attr("value"));
              this.specimens_excluded.push(elem.attr("value"));

          }
      }
  });

    }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.idUser = params['id'];
   }); 
   
  }

isInvalid(){
  if(!this.analyze.algorithm_selected){
    this.error_msg = "Please must to select an algorithm.";
    return true;
  }

  if(this.analyze.dataset_name == ""){
    this.error_msg = "Please must to enter a name of analysis.";
    return true;
  }
  
  console.log("cantidad de landmarks "+(this.countLandmarks - this.analyze.excluided_landmark.length));
  if((this.countLandmarks - this.landmarks_excluded.length) < 3){
    this.error_msg = "The analysis must at least 3 landmarks";
    return true;
  }

  console.log("cantidad de objectos "+(this.countObject - this.analyze.excluided_specimen.length));
  if((this.countObject - this.specimens_excluded.length) < 2){
    this.error_msg = "The analysis must at least 2 objects";
    return true;
  }

  return false;
}
  

confirmAnalysis(){
  
  if(this.isInvalid()){
    this.invalid = true;
    return;
  }
  this.processing = true;
  this.analyze.user_id = this.idUser;
  this.analyze.excluided_landmark =  this.landmarks_excluded;
  this.analyze.excluided_specimen = this.specimens_excluded;
  this.analyze.node_tree = this.node_id.toString();
  this.sharedDatasetService.newAnalisys(this.analyze);
  if(this.analyze.algorithm_selected  == "2"){
    alert("Warning: Might take from several minutes to a few hours to finish, depending on the number of objects and/or landmarks of your dataset.")
  
  }
  this.analizeService.runAnalyze(this.analyze).subscribe(result => {
      if(result.error){
        alert(result.error);
      }else{
        result = JSON.parse(result);
        result.node_tree = this.node_id.toString();
        this.sharedDatasetService.finishedAnalisys( JSON.stringify(result));
      } 
      this.analyze = new Analyze('','','','',false,'',true,[],[],'20','0.000000001','');
        this.datasetEnable = false;
        this.processing = false;
        this.landmarks_excluded = [];
        this.specimens_excluded = [];
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

selectedProject(){
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
  params.objects_name.forEach(element => {
      $('#specimens').append('<li><a  class="small" data-value="'+key+'" tabIndex="-1"><input type="checkbox" value="'+key +'" isSpecimen="true"  checked />'+element+'</a></li>');    
      key++;
  });
  this.countObject = key;
}


handleChangeCM() {
      this.analyze.dataset_name = "GlsP_"+this.selected_dataset;
      this.visibleParamsResistent = false;
}

handleChange() {
      this.analyze.dataset_name = "GrP_"+this.selected_dataset;
      this.visibleParamsResistent = true;
}


/**
* Generate the landmarks selector to analize
*/
generateLandmarksSelector(params){
  $('#landmarks li').remove();
  var count = 0;
  this.landmarks_excluded = [];
  for (let index = 0; index < params.data.root_number_landmarks; index++) {  
      if(!params.data.excluded_land.includes(index.toString())){
          $('#landmarks').append('<li><a  class="small" data-value="'+index+'" tabIndex="-1"><input type="checkbox" value="'+index +'" isLandmark="true" checked />LM_'+(index+1)+'</a></li>');     
          count++;
      }
  }
  this.countLandmarks = count;
}


}
