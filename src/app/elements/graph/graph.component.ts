import { Component, OnInit, Input, DoCheck, OnChanges } from '@angular/core';
import { NvD3Module } from 'ng2-nvd3';


import { GraphOptionsService } from '../../services/graph-options/graph-options.service';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { TimeSerie } from '../../classes/time-serie';

import { VizCategory } from '../../classes/viz-category';
import { Candidate } from '../../classes/candidate';
import { Mode } from '../../classes/mode';

import 'd3';
import * as moment from 'moment';
declare let d3: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges{
  @Input() candidates: Candidate[];
  @Input() themes: VizCategory[];
  @Input() mode: Mode;
  public rawData: any;
  public options: any;
  public timeSeries: TimeSerie[];

  constructor(
  	private timeSeriesService:TimeSeriesService,
    private graphOptionsService:GraphOptionsService
  	) { }

  ngOnInit() {
    moment.locale("es");
    
  	this.timeSeriesService.getData()
  		.subscribe((data) => this.rawData = data);

    this.graphOptionsService.getOptions()
      .subscribe((options) => this.setOptions(options));
  }

  ngOnChanges(){
      this.timeSeries = this.timeSeriesService.getSeries(this.rawData, this.mode, this.candidates, this.themes);
  }

  private setOptions(options){
    this.options = options;
    this.options.chart.xAxis.tickFormat = d => moment(d).format("D [de] MMMM [de] YYYY")
    this.options.chart.yAxis.tickFormat = d => d3.format('.02f')(d)
  }

}
