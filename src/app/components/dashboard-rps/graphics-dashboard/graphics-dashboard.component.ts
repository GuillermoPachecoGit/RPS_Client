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
     /*  this.subscription = this.sharedDatasetService.getMessage().subscribe(
        message => {
          const name = this.generateTab();
          this.count++;
          this.generateNewGraphics(message, name);
      });*/
  }

  generateTab(): string {
    // tslint:disable-next-line:max-line-length
    $('#tab_index_id').append('<li class="active"><a data-toggle="tab" href="#tab' + this.count + '"' + '>Dataset ' + this.count + ' </a></li>');
    $('#tab_content_id').append(
      '<div id="tab' + this.count + '"' + 'class="tab-pane fade in active">'
       + '<div id="dataset' + this.count  + '"></div>'
    + '</div>'

    );
    return 'dataset' + this.count;
  }

  ngOnInit() {
  }

   generateNewGraphics(params, nameTab) {
        // Set up the chart
         // Give the points a 3D feel by adding a radial gradient

        Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function(color) {
          return {
            radialGradient: {
              cx: 0.4,
              cy: 0.3,
              r: 0.5
            },
            stops: [
              [0, color],
              [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
            ]
          };
        });
        // tslint:disable-next-line:prefer-const
      console.log(nameTab);
      var chart = new Highcharts.Chart({
          chart: {
            renderTo: nameTab,
            margin: 20,
            type: 'scatter',
            options3d: {
              enabled: true,
              alpha: 10,
              beta: 30,
              depth: 250,
              viewDistance: 2,
              fitToPlot: false,
              frame: {
                bottom: {
                  size: 1,
                  color: 'rgba(0,0,0,0.02)'
                },
                back: {
                  size: 1,
                  color: 'rgba(0,0,0,0.04)'
                },
                side: {
                  size: 1,
                  color: 'rgba(0,0,0,0.06)'
                }
              }
            }
          },
          plotOptions: {
            scatter: {
              width: 5,
              height: 5,
              depth: 5
            }
          },
          yAxis: {
            min: -20,
            max: 20,
            title: null
          },
          xAxis: {
            min: -20,
            max: 20,
            gridLineWidth: 1
          },
          zAxis: {
            min: -20,
            max: 20,
            showFirstLabel: false
          },
          legend: {
            enabled: false
          },
          series: []
        });


        for (let index = 0; index < params['specimens'].length; index++) {
          var element = params['names_specimen'][index];
          console.log(element);
          console.log(params['specimens'][index]['specimen'+index]);

          let nameSpecimen;
          if (!params['names_specimen'][index])
          {
              nameSpecimen = element;
          }
          
          console.log("LLEGUE HASTA ACA");
          chart.addSeries(
            {
              planeProjection: {
                enabled: false,
              },
              name: nameSpecimen,
              colors: ['#800000'],
              data: params['specimens'][index]['specimen'+index]
            }
          );
          console.log("SALI DE ACA");
        }
        // Add mouse events for rotation
        $(chart.container).on('mousedown.hc touchstart.hc', function(eStart) {
          eStart = chart.pointer.normalize(eStart);

          // tslint:disable-next-line:prefer-const
          let posX = eStart.pageX,
            // tslint:disable-next-line:prefer-const
            posY = eStart.pageY,
            // tslint:disable-next-line:prefer-const
            alpha = chart.options.chart.options3d.alpha,
            // tslint:disable-next-line:prefer-const
            beta = chart.options.chart.options3d.beta,
            newAlpha,
            newBeta,
            // tslint:disable-next-line:prefer-const
            sensitivity = 5; // lower is more sensitive

          $(document).on({
            'mousemove.hc touchdrag.hc': function(e) {
              // Run beta
              newBeta = beta + (posX - e.pageX) / sensitivity;
              chart.options.chart.options3d.beta = newBeta;

              // Run alpha
              newAlpha = alpha + (e.pageY - posY) / sensitivity;
              chart.options.chart.options3d.alpha = newAlpha;

              chart.redraw(false);
            },
            'mouseup touchend': function() {
              $(document).off('.hc');
            }
          });
        });
      }
}
