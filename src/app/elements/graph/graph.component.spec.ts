import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Output, Component } from '@angular/core';
import { TimeSeriesService } from '../../services/time-series/time-series.service';
import { GraphOptionsService } from '../../services/graph-options/graph-options.service';

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

  let graphOptionsService: any;
  let getOptionsSpy: jasmine.Spy;
  let options: any;

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
                {   showMode:"candidate",
                    showModeName:"Candidate",
                    metric:"metric1",
                    name:"Metric",
                    info: "info"  },         
                {   showMode:"theme",
                    showModeName:"Theme",
                    metric:"metric1",
                    name:"Metric",
                    info: "info"    }, 
                  ];
    options = { "chart":{"Some-default-option":{"setting":"graph"},
                        xAxis:{},
                        yAxis:{},
                  "interactiveLayer": {
                    "tooltip": {}
                  }

                }
              }

    timeSeriesService = jasmine.createSpyObj('TimeSeriesService',['getSeries', 'getData'])
    getSeriesSpy = timeSeriesService.getSeries.and.returnValue(timeSeries);
    getDataSpy = timeSeriesService.getData.and.returnValue(of(rawData));

    graphOptionsService = jasmine.createSpyObj('GraphOptionsService', ['getOptions']);
    getOptionsSpy = graphOptionsService.getOptions.and.returnValue(of(options));

    TestBed.configureTestingModule({
      declarations: [ GraphComponent, Nvd3StubComponent ],
      providers: [
          {provide:  TimeSeriesService, useValue: timeSeriesService},
          {provide: GraphOptionsService, useValue: graphOptionsService}
          ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('get data', ()=>{
    it('Should set data when source changes', () =>{
      expect(getDataSpy).toHaveBeenCalledTimes(0);
      component.source = 'some-source';
      fixture.detectChanges();
      expect(getDataSpy).toHaveBeenCalledTimes(1);
      expect(getDataSpy).toHaveBeenCalledWith('some-source');
      expect(component.rawData).toEqual(rawData);
      expect(getSeriesSpy).toHaveBeenCalledTimes(1); 
      expect(getSeriesSpy).toHaveBeenCalledWith(rawData, component.mode, component.candidates, component.themes);   

    });
  })


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
      component.source = 'some-source';
      component.ngOnChanges();
      fixture.detectChanges();
      expect(getSeriesSpy.calls.mostRecent().args).toEqual([rawData, modes[0], [candidates[0]],  vizCategories]);
      expect(nvd3Comp.data).toEqual(timeSeries);    
    });

    it('Should set default data', () =>{
      expect(chart["Some-default-option"]).toEqual({"setting":"graph"});

    });

    it('Should set tickFormats correctly', ()=>{
      expect(d3.format('.02f')(Math.PI)).toEqual(chart.yAxis.tickFormat(Math.PI));
      expect("Sin Valor").toEqual(chart.yAxis.tickFormat(NaN));
      expect("22/11").toEqual(chart.xAxis.tickFormat('1989-11-22'));
    });


  });

  describe('Sentiment tags',()=>{

    it("Should not set any tag when no sentiment when mode is not given", ()=>{
      const tags = fixture.debugElement.queryAll(By.css('.tag-container'));
      expect(tags.length).toEqual(0);
    });

    it("Should not set tags when candidates is undefined", ()=>{
      component.themes = [ vizCategories[0] ];
      component.mode =  {   showMode:"candidate",
                            showModeName:"Candidate",
                            metric:"topicsentiment",
                            name:"Metric",
                            info: "info"  };
      fixture.detectChanges()
      const tags = fixture.debugElement.queryAll(By.css('.tag-container'));
      expect(tags.length).toEqual(0);
    });

    it("Should not set tags when themes is undefined", ()=>{
      component.candidates = [ candidates[0] ];
      component.mode =  {   showMode:"candidate",
                            showModeName:"Candidate",
                            metric:"topicsentiment",
                            name:"Metric",
                            info: "info"  };
      fixture.detectChanges()
      const tags = fixture.debugElement.queryAll(By.css('.tag-container'));
      expect(tags.length).toEqual(0);
    });

    it("Should not set tags when mode.metric != topicsentiment", ()=>{
      component.candidates = [ candidates[0] ];
      component.themes = [ vizCategories[0] ];
      component.mode =  {   showMode:"candidate",
                            showModeName:"Candidate",
                            metric:"othertopic",
                            name:"Metric",
                            info: "info"  };
      fixture.detectChanges()
      const tags = fixture.debugElement.queryAll(By.css('.tag-container'));
      expect(tags.length).toEqual(0);
    });


    it("Should set tags when mode.metric == topicsentiment", ()=>{
      component.candidates = [ candidates[0] ];
      component.themes = [ vizCategories[0] ];
      component.mode =  {   showMode:"candidate",
                            showModeName:"Candidate",
                            metric:"topicsentiment",
                            name:"Metric",
                            info: "info"  };
      fixture.detectChanges()
      const tags = fixture.debugElement.queryAll(By.css('.tag-container'));
      expect(tags.length).toEqual(2);
    });


  })
});
