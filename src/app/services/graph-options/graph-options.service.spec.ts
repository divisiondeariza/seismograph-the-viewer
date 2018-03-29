import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GraphOptionsService } from './graph-options.service';

describe('GraphOptionsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphOptionsService],
      imports: [
        HttpClientTestingModule
        ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  it('should return expected candidates (http called once)', inject([GraphOptionsService], 
  	(service: GraphOptionsService)  =>{
	  const expectedOptions = new Object();
	  service.getOptions()
	  		.subscribe(options => expect(options).toEqual(expectedOptions))

	  const req = httpTestingController.expectOne("assets/data/graph-options.json");
	  expect(req.request.method).toEqual('GET');

	  req.flush(expectedOptions)
  }))
});
