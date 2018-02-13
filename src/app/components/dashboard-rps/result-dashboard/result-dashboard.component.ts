import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


/*
 * Services
 */
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { zip } from 'rxjs/observable/zip';
// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-result-dashboard',
  templateUrl: './result-dashboard.component.html',
  styleUrls: ['./result-dashboard.component.css']
})
export class ResultDashboardComponent implements OnInit {
  subscription: Subscription;
  private count;

  constructor(private sharedDatasetService: SharedDatasetService) { 
    this.count = 0;
    // subscribe to home component messages
    this.subscription = this.sharedDatasetService.getMessage().subscribe(
      params => {
        const infoTab = this.generateTab(params.dataset_id,params.dataset_name);
        const containerGrap = infoTab.idGrap;
        const tab = infoTab.id;
        this.activaTab(tab);
        this.generateTable(params, containerGrap);
    });

    this.subscription = this.sharedDatasetService.getDistance().subscribe( params => {
      const infoTab = this.generateTab(params.distance_id,params.distance_name);
      const containerGrap = infoTab.idGrap;
      const tab = infoTab.id;
      this.activaTab(tab);
      this.generateDistanceMatrix(params,containerGrap);
    });

  }

  generateTab(dataset_id,dataset_name): any {
    // tslint:disable-next-line:max-line-length
    $('#tab_index_id_result').append('<li ><a data-toggle="tab" href="#tab_result_'+dataset_id + '"' + '>'+dataset_name+ ' </a></li>');
    $('#tab_content_id_result').append(
        '<div id="tab_result_'+dataset_id+ '"' + 'class="tab-pane" >'
          +'<div class="table-responsive" style="width: 50%;" >'
            + '<div id="dataset_result_'+dataset_id+ '"  style="height: 300px; width: auto;"></div>'
          +'</div>'
        +'</div>'

    );
    return { idGrap: ('dataset_result_'+dataset_id), id: ('tab_result_'+dataset_id)} ;
  }

  activaTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
  };


  generateDistanceMatrix(params,tab){
    let data = params.data;
    let names = params['specimen_name'];

    
    $('#'+tab).append(
          '<h2> Distance: '+params.distance_name+'</h2>'
    );

      $('#'+tab).append(
       ' <table id="table_'+ params.distance_id+'" class="table table-bordered">'
       + '<thead class="thead-default">'
       +  ' <tr id="headerRow_'+params.distance_id +'" >'
       +    '<th> Specimens </th>'
      );
 
      for (let index = 0; index < names.length; index++) {
          const element = names[index];
          $('#'+'headerRow_'+params.distance_id).append( 
            '<th>'+ element +'</th>'
          );
      }


      $('#table_'+ params.distance_id).append( ' </tr>'
       + '</thead>'
       + '<tbody id="distance_'+params.distance_id+'">'
      );

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        $('#distance_'+params.distance_id).append( 
          '<tr id="row_'+index+'_'+ params.distance_id+'" >'
          +'<th scope="row">'+names[index]+'</th>'
        );

        for (let row = 0; row < element.length; row++) {
          const value = element[row];
          console.log(value);
          $('#row_'+index+'_'+ params.distance_id).append( 
            '<td><h6>'+ value +'</h6></td>'
          ); 
        }

        $('#distance_'+params.distance_id).append( 
          '</tr>'
        );
      }
      
      $('#distance_'+params.distance_id).append(
        '</tbody>'
        +'</table>'
       );
  }
    

  generateTable(params, tab){
    let data = [];
    let specimens = params['specimens'];
    let names = params['specimen_name'];
    for (let index = 0; index < specimens.length; index++) {
      const specimen = specimens[index]['specimen' + index];

      if(names.length > 0){
        $('#'+tab).append(
          '<h2>'+names[index]+'</h2>'
        );
      }else{
        $('#'+tab).append(
          '<h2>trace '+index+'</h2>'
        );
      }

      $('#'+tab).append(
       ' <table class="table table-bordered">'
       + '<thead>'
       +  ' <tr>'
       +    '<th><h6> Landmarks </h6></th>'
       +    '<th><h6> Coordinate X </h6></th>'
       +    '<th><h6> Coordinate Y </h6></th>'
       +    '<th><h6> Coordinate Z </h6></th>'
       + ' </tr>'
       + '</thead>'
       + '<tbody id="specimen'+index+'_'+params.dataset_id+'">'
      );


      for (let i = 0; i < specimen.length; i++){

        if(params.dim == 3){
        $('#specimen'+index+'_'+params.dataset_id).append(
          '<tr>' 
            + '<td><h5> LM'+ i+'<h5></td>'
            +'<td><h6>'+ specimen[i][0]+'<h6></td>'
            +'<td><h6>'+ specimen[i][1]+'<h6></td>'
            +'<td><h6>'+ specimen[i][2]+'<h6></td>' 
          +'</tr>'
         );
        }
        else{
          $('#specimen'+index+'_'+params.dataset_id).append(
            '<tr>' 
              + '<td><h5> LM'+ i+'<h5></td>'
              +'<td><h6>'+ specimen[i][0]+'<h6></td>'
              +'<td><h6>'+ specimen[i][1]+'<h6></td>'
              +'<td><h6>0<h6></td>' 
            +'</tr>'
           );
        }
      } 
      
      $('#specimen'+index+'_'+params.dataset_id).append(
        '</tbody>'
        +'</table>'
       );
    }
  }
  ngOnInit() {}
}
