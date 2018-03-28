import { Component, OnInit, Input, DoCheck, OnChanges } from '@angular/core';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { TimeSerie } from '../../classes/time-serie';
import { NvD3Module } from 'ng2-nvd3';

import { VizCategory } from '../../classes/viz-category';
import { Candidate } from '../../classes/candidate';

import 'd3';
import * as moment from 'moment';
declare let d3: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges{
  @Input() showBy: string;
  @Input() metric: string;
  @Input() candidates: Candidate[];
  @Input() themes: VizCategory[];
  public rawData: any;
  public options: any;
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

  ngOnChanges(){
      this.timeSeries = this.timeSeriesService.getSeries(this.rawData, this.metric, this.candidates, this.themes, this.showBy);
  }

}
