import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TimeSeriesService } from './time-series.service';
import { TimeSerie } from '../../classes/time-serie';

describe('TimeSeriesService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let expectedData: any;

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
  		 'key': 'theme1'
  		},
  		{'values':[
  			{'y': 2, 'x': new Date('2018-01-01')},
  			{'y': 2.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'theme2'
  		}
  	]

  	expect(service.getSeries(expectedData, 
                            'metric1', 
                            ['candidate1'],  
                            ['theme1', 'theme2'],
                            'candidate'))
  		.toEqual(expectedSeries);
  }));

  it('should get series by theme given a metric and some candidates', inject([TimeSeriesService], (service: TimeSeriesService) => {
	  
  	const expectedSeries:TimeSerie[] = [
  		{'values':[
  			{'y': 0, 'x': new Date('2018-01-01')},
  			{'y': 0.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'candidate1'
  		},
  		{'values':[
  			{'y': 1, 'x': new Date('2018-01-01')},
  			{'y': 1.5, 'x': new Date('2018-01-02')}
  			],
  		 'key': 'candidate2'
  		}
  	]

    expect(service.getSeries(expectedData, 
                            'metric1', 
                            ['candidate1', 'candidate2'],  
                            ['theme1'],
                            'theme'))
  		.toEqual(expectedSeries);
  }));

});
