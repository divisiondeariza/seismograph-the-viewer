import { Component, OnInit, DoCheck } from '@angular/core';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { TimeSerie } from '../../classes/time-serie';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import * as moment from 'moment';
declare let d3: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{
  public rawData: any;
  public showBy: string;
  public metric: string;
  public candidates: string[];
  public themes: string[];
  public timeSeries: TimeSerie[];

  constructor(
  	private timeSeriesService:TimeSeriesService
  	) { }

  ngOnInit() {
    moment.locale("es");
    
  	this.timeSeriesService.getData()
  		.subscribe((data) => this.rawData = data);


    this.options = {
      chart: {
        type: 'lineChart',
        height: 450,
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'fecha',
          tickFormat: d => moment(d).format("D [de] MMMM [de] YYYY"),
          rotateLabels: -15,
        },
        yAxis: {
          tickFormat: d => d3.format('.02f')(d),
        }
      }
    }
  }

  ngDoCheck(){
    if(this.showBy)
      this.timeSeries = this.timeSeriesService.getSeries(this.rawData, this.metric, this.candidates, this.themes, this.showBy);

  }

}
