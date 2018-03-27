import { Component, OnInit, DoCheck } from '@angular/core';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { TimeSerie } from '../../classes/time-serie';


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
  	this.timeSeriesService.getData()
  		.subscribe((data) => this.rawData = data);
  }

  ngDoCheck(){
    if(this.showBy)
      this.timeSeries = this.timeSeriesService.getSeries(this.rawData, this.metric, this.candidates, this.themes, this.showBy);

  }

}
