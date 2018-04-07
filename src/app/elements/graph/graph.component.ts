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
  @Input() 
  set source(source: string){
    this.timeSeriesService.getData(source)
      .subscribe((data) => {
        this.rawData = data;
        this.setTimeSeries()  
      })
    }
  // source: string;
  public rawData: any;
  public options: any;
  public timeSeries: TimeSerie[];

  constructor(
  	private timeSeriesService:TimeSeriesService,
    private graphOptionsService:GraphOptionsService
  	) { }

  ngOnInit() {
    moment.locale("es");

    this.graphOptionsService.getOptions()
      .subscribe((options) => this.setOptions(options));
  }

  ngOnChanges(){
    this.setTimeSeries();
  }

  private setOptions(options){
    this.options = options;
    this.options.chart.xAxis.tickFormat = d => moment(d).format("DD/MM")
    this.options.chart.yAxis.tickFormat = this.formatY;
    this.options.chart.interactiveLayer.tooltip.valueFormatter = this.formatY;
  }

  private setTimeSeries(){
      this.timeSeries = this.timeSeriesService.getSeries(this.rawData, this.mode, this.candidates, this.themes);
  }

  private formatY(value, i){
    if(isNaN(value))
      return "Sin Valor"
    else
      return d3.format('.02f')(value)
  }




}
