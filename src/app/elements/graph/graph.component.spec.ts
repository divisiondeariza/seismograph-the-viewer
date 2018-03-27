import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, Component } from '@angular/core';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';


import { GraphComponent } from './graph.component';
import { TimeSerie } from '../../classes/time-serie';


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

  beforeEach(async(() => {
    rawData = {'some':{'data':{'from':'server'}}};
    timeSeries = [
                    {'values':[
                      {'y': 0, 'x': new Date('2018-01-01')},
                      {'y': 0.5, 'x': new Date('2018-01-02')}
                      ],
                     'key': 'theme1'
                    },]
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
    // let chart:any;
    let nvd3Comp: Nvd3StubComponent;
    beforeEach(()=>{
      nvd3Comp = fixture.debugElement.query(By.css('nvd3')).componentInstance
      // chart = fixture.debugElement.query(By.css('nvd3')).componentInstance.options.chart
    });    

    it('should set correctly timeseries', () =>{
      component.showBy = 'candidate';
      component.metric = 'metric1';
      component.candidates = ['candidate1'];
      component.themes = ['theme1', 'theme2']
      fixture.detectChanges();
      expect(getSeriesSpy).toHaveBeenCalledTimes(1);
      expect(getSeriesSpy).toHaveBeenCalledWith(rawData, 'metric1', ['candidate1'],  ['theme1', 'theme2'], 'candidate');
      expect(nvd3Comp.data).toEqual(timeSeries);    
    })
  });
});
