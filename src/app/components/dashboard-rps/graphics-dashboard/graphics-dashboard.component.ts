import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

/*
 * Services
 */
import { SharedDatasetService } from '../../../services/shared-dataset.service';
import { forEach } from '@angular/router/src/utils/collection';


// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;
declare var Plotly: any;
@Component({
  selector: 'app-graphics-dashboard',
  templateUrl: './graphics-dashboard.component.html',
  styleUrls: ['./graphics-dashboard.component.css']
})
export class GraphicsDashboardComponent implements OnInit {
  subscription: Subscription;
  private count;

  datasets_showed = [];
  ordinations_showed = [];


  constructor(private sharedDatasetService: SharedDatasetService) {
      this.count = 0;

      $(document).ready(function() {
        $('#tab_index_id').on('click', '.close', function() {
            var tabID = $(this).parents('a').attr('href');
            var isDataset = $(this).parents('a').attr('is_dataset');
            $(this).parents('li').remove();
            $(tabID).remove();
  
            console.log(isDataset);
            if(isDataset){
              sharedDatasetService.setDatasetViewDelete({id: isDataset, source: "graphics" });
              
            }
            else{
              console.log($(this).parents('a').attr('is_ordination'));
              sharedDatasetService.setOrdinationViewDelete({id: $(this).parents('a').attr('is_ordination'), source:"graphics" } );
            }
            //display first tab
            var tabFirst = $('#tab_index_id a:first');
            tabFirst.tab('show');
        });
      });
      
      var list = document.getElementById("tab_index_id");

      // subscribe to home component messages
       this.subscription = this.sharedDatasetService.getMessage().subscribe(
        params => {

          var found = this.datasets_showed.find(item => item === params.dataset_id);
          if(found === undefined){
            this.datasets_showed.push(params.dataset_id);
            const infoTab = this.generateTab(params);
            const containerGrap = infoTab.idGrap;
            const tab = infoTab.id;
            this.activaTab(tab);
            this.count++;

            if(params.dimention === 2){
                this.generateGraphicPlotly(params, containerGrap);
            }
            else{
                this.generateGraphicPlotly(params, containerGrap);
            }
          }
         
         
      });


       // subscribe to home component messages
       this.subscription = this.sharedDatasetService.getAnalysis().subscribe(
        params => {

          var found = this.datasets_showed.find(item => item === params.dataset_id);
          if(found === undefined){
            this.datasets_showed.push(params.dataset_id);
            const infoTab = this.generateTab(params);
            const containerGrap = infoTab.idGrap;
            const tab = infoTab.id;
            this.activaTab(tab);
            this.count++;

            if(params.dimention === 2){
                this.generateGraphicPlotly(params, containerGrap);
            }
            else{
                this.generateGraphicPlotly(params, containerGrap);
            }
          }
         
         
      });

      this.subscription = this.sharedDatasetService.getOrdination().subscribe(
        params => {
          var found = this.ordinations_showed.find( item => item === params.ordination_id);
          if(found === undefined){
            this.ordinations_showed.push(params.ordination_id);
            const infoTab = this.generateTabOrdination(params);
            const containerGrap = infoTab.idGrap;
            const tab = infoTab.id;
            this.activaTab(tab);
            this.count++;
            this.generateGraphicPlotly(params, containerGrap);
          }
        }
      );

      this.subscription = this.sharedDatasetService.getDatasetViewDelete().subscribe(
        params => {
          if(params.source == "graphics"){
            var index  = this.datasets_showed.indexOf(parseInt(params.id));
            console.log(index);
            if (index > -1) {
              this.datasets_showed.splice(index, 1);
            }
          } 
        } 
      );

      this.subscription = this.sharedDatasetService.getOrdinationViewDelete().subscribe(
        params => {
          if(params.source == "graphics"){
            var index  = this.ordinations_showed.indexOf(parseInt(params.id));
            console.log(index);
            if (index > -1) {
              this.ordinations_showed.splice(index, 1);
            }
          } 
        } 
      );


  }

  generateTab(params): any {
    // tslint:disable-next-line:max-line-length
    $('#tab_index_id').append('<li ><a data-toggle="tab" is_dataset="'+params.dataset_id+'" href="#tab'+'_'+params.dataset_id + '"' + '>'+params.dataset_name+ ' <button class="close" (click)="closeTab($event)" type="button" title="Remove this page">×</button> </a></li>');
    $('#tab_content_id').append(
      '<div id="tab'+'_'+params.dataset_id + '"' + 'class="tab-pane"  >'
       + '<div  id="dataset'+'_'+params.dataset_id  + '"  "></div>'
    + '</div>'

    );
    //style="height: 300px; width: 100%;
    return { idGrap: ('dataset'+'_'+params.dataset_id), id: ('tab'+'_'+params.dataset_id)} ;
  }


  generateTabOrdination(params): any {
    // tslint:disable-next-line:max-line-length
    $('#tab_index_id').append('<li ><a data-toggle="tab" is_ordination="'+params.ordination_id+'" href="#tab_'+params.dataset_id+'_'+params.ordination_id + '"' + '>'+params.ordination_name+ ' <button class="close" (click)="closeTab($event)" type="button" title="Remove this page">×</button> </a> </li>');
    $('#tab_content_id').append(
      '<div id="tab_'+params.dataset_id+'_'+params.ordination_id + '"' + 'class="tab-pane" >'
       + '<div id="ordination'+'_'+params.ordination_id  + '"  ></div>'
    + '</div>'

    );
    return { idGrap: ('ordination'+'_'+params.ordination_id), id: ('tab_'+params.dataset_id+'_'+params.ordination_id)} ;
  }

  activaTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
  };

  public closeTab(event){
    console.log("cerre un dataset");
    console.log(event);
  }

  ngOnInit() { 
   
  }

  generateOrdinationGraphicsPlotly(params, tab){
    Plotly.newPlot(tab, params.data_plotly, params.layout);
  }

  generateGraphicsPlotly2D(params, tab){
    Plotly.newPlot(tab, params.data_plotly, params.layout);
  }

  generateGraphicPlotly(params, tab){
        Plotly.newPlot(tab, params.data_plotly, params.layout);
      }
}
