import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Mode } from '../../classes/mode';
import { ModesService } from './modes.service';

describe('ModesService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModesService],
      imports: [
        HttpClientTestingModule
        ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

  });


  it('should return expected modes of visualization (http called once)', inject([ModesService], 
  	(service: ModesService)  =>{
	  const expectedModes: Mode[] =
	    [
		    { 	id: 'candidate-metric',
			    showMode:"Candidate",
			    showModeName:"candidate",
			    metric:"metric",
			    name: "Metric"	}, 		    
			{   id: 'theme-metric',
			    showMode:"Theme",
			    showModeName:"theme",
			    metric:"metric",
			    name:"Metric"	}, 
		    ];
	  service.getModes()
	  		.subscribe(modes => expect(modes).toEqual(expectedModes))

	  const req = httpTestingController.expectOne("assets/data/modes.json");
	  expect(req.request.method).toEqual('GET');

	  req.flush(expectedModes)
  }))
});
