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

declare var Highcharts: any;

declare var Plotly: any;
@Component({
  selector: 'app-graphics-dashboard',
  templateUrl: './graphics-dashboard.component.html',
  styleUrls: ['./graphics-dashboard.component.css']
})
export class GraphicsDashboardComponent implements OnInit {

  subscription: Subscription;
  private count;
  constructor(private sharedDatasetService: SharedDatasetService) {
      this.count = 0;
      // subscribe to home component messages
       this.subscription = this.sharedDatasetService.getMessage().subscribe(
        params => {
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
         
      });

      this.subscription = this.sharedDatasetService.getOrdination().subscribe(
        params => {
          const infoTab = this.generateTabOrdination(params);
          const containerGrap = infoTab.idGrap;
          const tab = infoTab.id;
          this.activaTab(tab);
          this.count++;
          this.generateOrdinationGraphicsPlotly(params, containerGrap);
        }
      );

  }

  generateTab(params): any {
    // tslint:disable-next-line:max-line-length
    $('#tab_index_id').append('<li ><a data-toggle="tab" href="#tab'+'_'+params.dataset_id + '"' + '>'+params.dataset_name+ ' </a></li>');
    $('#tab_content_id').append(
      '<div id="tab'+'_'+params.dataset_id + '"' + 'class="tab-pane" >'
       + '<div id="dataset'+'_'+params.dataset_id  + '"  style="height: 300px; width: 100%;"></div>'
    + '</div>'

    );
    return { idGrap: ('dataset'+'_'+params.dataset_id), id: ('tab'+'_'+params.dataset_id)} ;
  }


  generateTabOrdination(params): any {
    // tslint:disable-next-line:max-line-length
    $('#tab_index_id').append('<li ><a data-toggle="tab" href="#tab_'+params.dataset_id+'_'+params.ordination_id + '"' + '>'+params.ordination_name+ ' </a></li>');
    $('#tab_content_id').append(
      '<div id="tab_'+params.dataset_id+'_'+params.ordination_id + '"' + 'class="tab-pane" >'
       + '<div id="ordination'+'_'+params.ordination_id  + '"  style="height: 300px; width: 100%;"></div>'
    + '</div>'

    );
    return { idGrap: ('ordination'+'_'+params.ordination_id), id: ('tab_'+params.dataset_id+'_'+params.ordination_id)} ;
  }

  activaTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
  };


  ngOnInit() { }

  generateOrdinationGraphicsPlotly(params, tab){
    let colors = params['colors'];
    let names = params['specimen_name'];
    var data = params['data'];
    var dataResult = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      var trace = {
        x: [element[0]],
        y: [element[1]],
        mode: 'markers',
        type: 'scatter',
        text: names[index],

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

    var layout = {
      margin: 5,
      xaxis: {},
      yaxis: {},
      height: 600,
      width: 600,
      title: 'Universal Multidimensional Scaling'
    };


    Plotly.newPlot(tab, dataResult, layout);

  }

  generateGraphicsPlotly2D(params, tab){
    let data = [];
    let specimens = params['specimens'];
    let colors = params['colors'];
    let names = params['specimen_name'];

    for (let index = 0; index < specimens.length; index++) {
      const element = specimens[index]['specimen' + index];

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
        name: names[index]
      };
      data.push(trace);
    }

    var layout = {
      margin: 2,
      height: 500,
      width: 500
    };
    Plotly.newPlot(tab, data, layout);
  }

      generateGraphicsPlotly(params, tab){
        let data = [];
        let specimens = params['specimens'];
        let colors = params['colors'];
        let names = params['specimen_name'];

        for (let index = 0; index < specimens.length; index++) {
          const element = specimens[index]['specimen' + index];

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
            name: names[index]
          };
          data.push(trace);
        }

        var layout = {margin: {
          l: 2,
          r: 2,
          b: 2,
          t: 2
          }};
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
