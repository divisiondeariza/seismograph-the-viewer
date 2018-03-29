import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, Component } from '@angular/core';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';


import { GraphComponent } from './graph.component';
import { TimeSerie } from '../../classes/time-serie';
import { VizCategory } from '../../classes/viz-category';
import { Candidate } from '../../classes/candidate';
import { Mode } from '../../classes/mode';


declare let d3: any;

@Component({selector: 'nvd3', template: ''})
class Nvd3StubComponent{
  @Input() data:TimeSerie[];
  @Input() options:any
}


describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;
  let rawData: any;
  let timeSeries: TimeSerie[];
  let timeSeriesService: any;
  let getDataSpy: jasmine.Spy;
  let getSeriesSpy: jasmine.Spy;
  let candidates: Candidate[];
  let vizCategories: VizCategory[];
  let modes: Mode[];


  beforeEach(async(() => {
    rawData = {'some':{'data':{'from':'server'}}};
    timeSeries = [
                    {'values':[
                      {'y': 0, 'x': new Date('2018-01-01')},
                      {'y': 0.5, 'x': new Date('2018-01-02')}
                      ],
                     'key': 'theme1'
                    },]
    candidates = [{ id: 'candidate1', name: 'Candidate One', color:"#fff" }, 
                  { id: 'candidate2', name: 'Candidate Two', color:"#888" }];
    vizCategories = [{ id: 'theme1', name: 'Theme One', children: [] },
                     { id: 'theme2', name: 'Theme Two', children: [] } ]
    modes =  [
                {   id: 'candidate-metric',
                    showMode:"candidate",
                    showModeName:"Candidate",
                    metric:"metric1",
                    name:"Metric"  },         
                {   id: 'theme-metric',
                    showMode:"theme",
                    showModeName:"Theme",
                    metric:"metric1",
                    name:"Metric"  }, 
                  ];

    timeSeriesService = jasmine.createSpyObj('TimeSeriesService',['getSeries', 'getData'])
    getSeriesSpy = timeSeriesService.getSeries.and.returnValue(timeSeries);
    getDataSpy = timeSeriesService.getData.and.returnValue(of(rawData));
    TestBed.configureTestingModule({
      declarations: [ GraphComponent, Nvd3StubComponent ],
      providers: [{provide:  TimeSeriesService, useValue: timeSeriesService}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set data at start', () =>{
    expect(getDataSpy).toHaveBeenCalledTimes(1);
    expect(component.rawData).toEqual(rawData);
  });

  describe('nvd3 settings', ()=>{
    let chart:any;
    let nvd3Comp: Nvd3StubComponent;
    beforeEach(()=>{
      nvd3Comp = fixture.debugElement.query(By.css('nvd3')).componentInstance
      chart = nvd3Comp.options.chart
    });    

    it('should set correctly timeseries', () =>{
      component.mode = modes[0]
      component.candidates = [candidates[0]];
      component.themes = vizCategories;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(getSeriesSpy).toHaveBeenCalledTimes(1);
      expect(getSeriesSpy).toHaveBeenCalledWith(rawData, modes[0], [candidates[0]],  vizCategories);
      expect(nvd3Comp.data).toEqual(timeSeries);    
    });

    it('Should basic data', () =>{
      expect(chart.height).toEqual(450);
      expect(chart.type).toEqual('lineChart');
      expect(chart.useInteractiveGuideline).toBeTruthy();
      expect(chart.xAxis.axisLabel).toEqual("fecha");
      expect(chart.xAxis.rotateLabels).toEqual(-15);
    });

    it('Should set tickFormats correctly', ()=>{
      expect(d3.format('.02f')(Math.PI)).toEqual(chart.yAxis.tickFormat(Math.PI));
      expect("22 de noviembre de 1989").toEqual(chart.xAxis.tickFormat('1989-11-22'));

    })

  });
});
