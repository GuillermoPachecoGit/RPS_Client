import { Component, OnInit } from '@angular/core';
import { Project } from '../navbar-dashboard/project';
import { Dataset } from '../navbar-dashboard/dataset';
import { Distance } from '../navbar-dashboard/distance';
import { Analyze } from '../navbar-dashboard/analyze';
import { Ordination } from '../navbar-dashboard/ordination';
import { UploadFileService } from '../../../services/upload-file.service';
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../../services/get-projects.service';
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
  idUser = '';
  landmarks_excluded = [];
  specimens_excluded = [];
  subscription: Subscription;
  node_id = "";

  constructor(
    private sharedDatasetService: SharedDatasetService,
    private route: ActivatedRoute) { 

    $(document).on('click', ':checkbox', function() {
        sharedDatasetService.setExclutionObject(this);
    });

    this.subscription = this.sharedDatasetService.getExclutionObject().subscribe(
        params => {
            
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
                    this.landmarks_excluded.push(elem.attr("value"));
                }
                if ( elem.attr( "isSpecimen" )) {
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

}
