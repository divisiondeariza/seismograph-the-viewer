import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TimeSeriesService } from './time-series.service';
import { TimeSerie } from '../../classes/time-serie';
import { VizCategory } from '../../classes/viz-category';
import { Candidate } from '../../classes/candidate';
import { Mode } from '../../classes/mode';

describe('TimeSeriesService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let expectedData: any;
  let candidates: Candidate[];
  let vizCategories: VizCategory[];
  let modes: Mode[];

  beforeEach(() => {
	expectedData = {
	  	'theme1':{
	  		'candidate1':{
	  			'dates': ['2018-01-01', '2018-01-02'], 'values': ['0', '0.5']
	  		},
	  		'candidate2':{
	  			'dates': ['2018-01-01', '2018-01-02'], 'values': ['1', '1.5']
	  		}
	  	},
		'theme2':{
	  		'candidate1':{
	  			'dates': ['2018-01-01', '2018-01-02'], 'values': ['2', '2.5']
	  		},
	  		'candidate2':{
	  			'dates': ['2018-01-01', '2018-01-02'], 'values': ['3', '3.5']
	  		}
	  	}
	  }

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
    TestBed.configureTestingModule({
      providers: [TimeSeriesService],
      imports: [
        HttpClientTestingModule
        ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should get full data if timeseries', inject([TimeSeriesService], (service: TimeSeriesService) => {
	  
	  service.getData()
	  		.subscribe(data => expect(data).toEqual(expectedData))

	  const req = httpTestingController.expectOne("assets/data/time-series.json");
	  expect(req.request.method).toEqual('GET');

	  req.flush(expectedData)
  }));

  it('should get series by candidate given a metric and some themes', inject([TimeSeriesService], (service: TimeSeriesService) => {
	  
  	const expectedSeries:TimeSerie[] = [
  		{'values':[
  			{'y': 0, 'x': new Date('2018-01-01')},
  			{'y': 0.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'Theme One'
  		},
  		{'values':[
  			{'y': 2, 'x': new Date('2018-01-01')},
  			{'y': 2.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'Theme Two'
  		}
  	]

  	expect(service.getSeries(expectedData, 
                             modes[0],
                            [candidates[0]],  
                            vizCategories))
  		.toEqual(expectedSeries);
  }));

  it('should get series by theme given a metric and some candidates', inject([TimeSeriesService], (service: TimeSeriesService) => {
	  
  	const expectedSeries:TimeSerie[] = [
  		{'values':[
  			{'y': 0, 'x': new Date('2018-01-01')},
  			{'y': 0.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'Candidate One',
       'color': '#fff'
  		},
  		{'values':[
  			{'y': 1, 'x': new Date('2018-01-01')},
  			{'y': 1.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'Candidate Two',
       'color': '#888'
  		}
  	]

    expect(service.getSeries(expectedData, 
                            modes[1],
                            candidates,  
                            [vizCategories[0]]))
  		.toEqual(expectedSeries);
  }));

  it('getSeries should return an empty array when one of parameters is undefined', 
     inject([TimeSeriesService], (service: TimeSeriesService) => {
    
    expect(service.getSeries(undefined, 
                            modes[1],
                            candidates,  
                            [vizCategories[0]])).toEqual([]);
    expect(service.getSeries(expectedData, 
                        undefined,
                        candidates,  
                        [vizCategories[0]])).toEqual([]);  
    expect(service.getSeries(expectedData, 
                        modes[1],
                        undefined,  
                        [vizCategories[0]])).toEqual([]);    
    expect(service.getSeries(expectedData, 
                        modes[1],
                        candidates,  
                        undefined)).toEqual([]);
  }))

});
