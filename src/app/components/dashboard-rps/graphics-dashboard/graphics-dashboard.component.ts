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
                this.generateGraphicsPlotly2D(params, containerGrap);
            }
            else{
                this.generateGraphicsPlotly(params, containerGrap);
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
                this.generateGraphicsPlotly2D(params, containerGrap);
            }
            else{
                this.generateGraphicsPlotly(params, containerGrap);
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
            this.generateOrdinationGraphicsPlotly(params, containerGrap);
          }
        }
      );

      this.subscription = this.sharedDatasetService.getDatasetViewDelete().subscribe(
        params => {
          console.log(params);
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
          console.log(params);
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
    let colors = params['colors'];
    var names = params['specimen_name'];
    console.log('NAMES:' +names);
    var data = params['data'];
    var dataResult = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      var trace = {
        x: [element[0]],
        y: [element[1]],
        mode: 'markers',
        type: 'scatter',
        name: names[index],
        textposition: 'top center',
        textfont: {
          family:  'Raleway, sans-serif'
        },
        marker: { 
          size: 6,
          color: colors[index]
        }
      };
      dataResult.push(trace);

    }

    var ran = params['range'];
    var layout = {
      margin: 5,
      gridwidth: 0,
      xaxis: { nticks: 10} ,
      yaxis: { scaleanchor: "x"},
      title: 'Universal Multidimensional Scaling'
    };


    Plotly.newPlot(tab, dataResult, layout);

  }

  generateGraphicsPlotly2D(params, tab){
    let data = [];
    let specimens = params['specimens'];
    let colors = params['colors'];
    let names = params['specimen_name'];

    console.log("PASE POR ACA   "+ JSON.stringify(specimens));

    for (let index = 0; index < specimens.data.length; index++) {
      const element = specimens.data[index]['specimen' + index];

     let resultArray = this.generateArrayPlot(element, params.dimention);
      var trace = {
        x: resultArray[0],
        y: resultArray[1],
        mode: 'markers',
        marker: {
          size: 4,
          line: {
          color: colors[index]}
        },
        type: 'scatter',
        name: names[index],
        text: this.namesLandmaks(params)
      };
      data.push(trace);
    }

    var layout = {
      margin: 2,
      xaxis: { nticks: 10 , showline: false} ,
      yaxis: { scaleanchor: "x" , showline: false}
    };
    Plotly.newPlot(tab, data, layout);
  }

  namesLandmaks(params){
    var result = [];
    for (let index = 0; index < params.specimens.root_number_landmarks; index++) {
      if(!params.specimens.excluded_land.includes(index.toString())){
          result.push('LM_'+(index+1).toString());
      }
    }
    console.log(result);
    return result;
  }

  generateGraphicsPlotly(params, tab){
        let data = [];
        let specimens = params['specimens'];
        let colors = params['colors'];
        let names = params['specimen_name'];

        for (let index = 0; index < specimens.data.length; index++) {
          const element = specimens.data[index]['specimen' + index];

         let resultArray = this.generateArrayPlot(element, params.dimention);

          var trace = {
            x: resultArray[0],
            y: resultArray[1],
            z: resultArray[2],
            mode: 'markers',
            marker: {
              size: 4,
              line: {
              color: colors[index],
              width: 0.5},
              opacity: 0.8},
            type: 'scatter3d',
            name: names[index],
            text: this.namesLandmaks(params)
          };
          data.push(trace);
        }

        var layout = {
          margin: {
            l: 2,
            r: 2,
            b: 2,
            t: 2
          },
          xaxis: { nticks: 10, showline: false} ,
          yaxis: { scaleanchor: "x", showline: false},
          zaxis: { scaleanchor: "x", showline: false}
        };
        Plotly.newPlot(tab, data, layout);
      }


  generateArrayPlot(specimen, dim) {
        let result = [[], [], []];
        for (let index = 0; index < specimen.length; index++) {
          const element = specimen[index];

              result[0].push(element[0]);
              result[1].push(element[1]);


              console.log('Dimension: '+dim);
              if (dim === 3) {
                result[2].push(element[2]);
              } 
              else 
              {
                result[2].push(0);
              }
        }
        return result;
      }
}
